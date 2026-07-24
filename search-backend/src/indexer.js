import { createHash } from 'node:crypto'
import {
  getDetailCandidates,
  getJobs,
  storeProductDetail,
  storeProducts,
  updateDetailProgress,
  upsertJob
} from './db.js'
import { getProductDetail, searchUpstream } from './upstream.js'

const PAGE_SIZE = Math.max(10, Math.min(Number(process.env.INDEX_PAGE_SIZE || 50), 100))
const MAX_PRODUCTS = Math.max(PAGE_SIZE, Number(process.env.MAX_INDEX_PRODUCTS || 2000))
const CONCURRENCY = Math.max(1, Math.min(Number(process.env.INDEX_CONCURRENCY || 2), 4))
const DETAIL_ENABLED = String(process.env.DETAIL_INDEX_ENABLED || 'true') === 'true'
const DETAIL_CONCURRENCY = Math.max(1, Math.min(Number(process.env.DETAIL_INDEX_CONCURRENCY || 1), 2))
const DETAIL_BATCH_SIZE = Math.max(10, Math.min(Number(process.env.DETAIL_INDEX_BATCH_SIZE || 50), 100))
const DETAIL_DELAY_MS = Math.max(0, Number(process.env.DETAIL_INDEX_DELAY_MS || 250))
const MAX_ACTIVE_QUERY_JOBS = Math.max(1, Math.min(Number(process.env.MAX_ACTIVE_QUERY_JOBS || 1), 3))
const MAX_ACTIVE_DETAIL_JOBS = Math.max(1, Math.min(Number(process.env.MAX_ACTIVE_DETAIL_JOBS || 1), 2))
const activeJobs = new Set()
const pendingJobs = new Map()
const activeDetailJobs = new Set()
const pendingDetailJobs = new Map()

export function normalizeKeyword(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 255)
}

export function queryHash(keyword, categoryId = '') {
  return createHash('sha256').update(`${normalizeKeyword(keyword)}\n${String(categoryId || '')}`).digest('hex')
}

async function runInBatches(values, limit, worker) {
  for (let start = 0; start < values.length; start += limit) {
    const batch = values.slice(start, start + limit)
    await Promise.all(batch.map(worker))
  }
}

async function runIndex({ keyword, categoryId, hash }) {
  let indexed = 0
  let expected = 0
  try {
    await upsertJob({ queryHash: hash, keyword, categoryId, status: 'running' })
    const first = await searchUpstream({ keyword, categoryId, page: 1, pageSize: PAGE_SIZE })
    expected = Math.min(first.total, MAX_PRODUCTS)
    const effectivePageSize = Math.max(first.items.length, 1)
    await storeProducts({
      queryHash: hash,
      keyword,
      categoryId,
      items: first.items,
      page: 1,
      pageSize: effectivePageSize
    })
    indexed = first.items.length

    const totalPages = Math.ceil(expected / effectivePageSize)
    const pages = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index + 2)
    await runInBatches(pages, CONCURRENCY, async (page) => {
      const result = await searchUpstream({ keyword, categoryId, page, pageSize: PAGE_SIZE })
      await storeProducts({
        queryHash: hash,
        keyword,
        categoryId,
        items: result.items,
        page,
        pageSize: effectivePageSize
      })
      indexed += result.items.length
      await upsertJob({
        queryHash: hash,
        keyword,
        categoryId,
        status: 'running',
        indexedProducts: Math.min(indexed, expected),
        expectedProducts: expected
      })
    })
    const completionRatio = expected > 0 ? indexed / expected : 1
    await upsertJob({
      queryHash: hash,
      keyword,
      categoryId,
      status: completionRatio >= 0.9 ? 'complete' : 'failed',
      indexedProducts: Math.min(indexed, expected),
      expectedProducts: expected,
      error: completionRatio >= 0.9
        ? undefined
        : `Upstream pagination ended at ${Math.round(completionRatio * 100)}% coverage`
    })
    if (DETAIL_ENABLED && completionRatio >= 0.9) {
      enqueueDetailIndex({ hash })
    }
  } catch (error) {
    console.error(`Indexing failed for ${keyword}/${categoryId || 'all'}`, error)
    await upsertJob({
      queryHash: hash,
      keyword,
      categoryId,
      status: 'failed',
      indexedProducts: indexed,
      expectedProducts: expected,
      error: error?.message || error
    }).catch(() => {})
  }
}

async function runDetailIndex({ hash }) {
  let candidates = await getDetailCandidates(hash, DETAIL_BATCH_SIZE)
  while (candidates.length) {
    await runInBatches(candidates, DETAIL_CONCURRENCY, async ({ offerId, source }) => {
      const detail = await getProductDetail({ offerId, source })
      await storeProductDetail({ offerId, source, detail })
      if (DETAIL_DELAY_MS) await new Promise(resolve => setTimeout(resolve, DETAIL_DELAY_MS))
    })
    await updateDetailProgress(hash)
    candidates = await getDetailCandidates(hash, DETAIL_BATCH_SIZE)
  }
  await updateDetailProgress(hash)
}

export function enqueueIndex(input) {
  if (activeJobs.has(input.hash) || pendingJobs.has(input.hash)) return
  pendingJobs.set(input.hash, input)
  setImmediate(pumpIndexQueue)
}

function pumpIndexQueue() {
  while (activeJobs.size < MAX_ACTIVE_QUERY_JOBS && pendingJobs.size) {
    const [hash, input] = pendingJobs.entries().next().value
    pendingJobs.delete(hash)
    activeJobs.add(hash)
    runIndex(input)
      .catch(error => console.error(`Unhandled query index error for ${hash}`, error))
      .finally(() => {
        activeJobs.delete(hash)
        setImmediate(pumpIndexQueue)
      })
  }
}

export function enqueueDetailIndex(input) {
  if (!DETAIL_ENABLED || activeDetailJobs.has(input.hash) || pendingDetailJobs.has(input.hash)) return
  pendingDetailJobs.set(input.hash, input)
  setImmediate(pumpDetailQueue)
}

function pumpDetailQueue() {
  while (activeDetailJobs.size < MAX_ACTIVE_DETAIL_JOBS && pendingDetailJobs.size) {
    const [hash, input] = pendingDetailJobs.entries().next().value
    pendingDetailJobs.delete(hash)
    activeDetailJobs.add(hash)
    runDetailIndex(input)
      .catch(error => console.error(`Detail indexing failed for ${hash}`, error))
      .finally(() => {
        activeDetailJobs.delete(hash)
        setImmediate(pumpDetailQueue)
      })
  }
}

export function queueState(queryHashes = []) {
  const pendingHashes = [...pendingJobs.keys()]
  const detailPendingHashes = [...pendingDetailJobs.keys()]
  const positions = queryHashes
    .map(hash => pendingHashes.indexOf(hash))
    .filter(position => position >= 0)
  const detailPositions = queryHashes
    .map(hash => detailPendingHashes.indexOf(hash))
    .filter(position => position >= 0)
  return {
    activeQueryJobs: activeJobs.size,
    queuedQueryJobs: pendingJobs.size,
    activeDetailJobs: activeDetailJobs.size,
    queuedDetailJobs: pendingDetailJobs.size,
    queryQueuePosition: positions.length ? Math.min(...positions) + 1 : 0,
    detailQueuePosition: detailPositions.length ? Math.min(...detailPositions) + 1 : 0
  }
}

export async function queryIndexState(queryHashes) {
  const jobs = await getJobs(queryHashes)
  const byHash = new Map(jobs.map(job => [job.query_hash, job]))
  const states = queryHashes.map(hash => byHash.get(hash))
  const complete = states.length > 0 && states.every((job) => {
    const expectedForJob = Number(job?.expected_products || 0)
    const coverageForJob = expectedForJob > 0
      ? Number(job?.indexed_products || 0) / expectedForJob
      : 0
    return job?.status === 'complete' && coverageForJob >= 0.9
  })
  const failed = states.some(job => job?.status === 'failed')
  const indexed = states.reduce((sum, job) => sum + Number(job?.indexed_products || 0), 0)
  const expected = states.reduce((sum, job) => sum + Number(job?.expected_products || 0), 0)
  const detailIndexed = states.reduce((sum, job) => sum + Number(job?.detail_indexed_products || 0), 0)
  return {
    complete,
    status: complete ? 'complete' : failed ? 'failed' : states.some(Boolean) ? 'building' : 'not_started',
    coverage: expected > 0 ? Math.min(indexed / expected, 1) : 0,
    detailCoverage: expected > 0 ? Math.min(detailIndexed / expected, 1) : 0,
    jobs,
    queue: queueState(queryHashes)
  }
}
