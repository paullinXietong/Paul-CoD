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
const activeJobs = new Set()

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
  if (activeJobs.has(hash)) return
  activeJobs.add(hash)
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
      setImmediate(() => runDetailIndex({ hash }).catch((error) => {
        console.error(`Detail indexing failed for ${hash}`, error)
      }))
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
  } finally {
    activeJobs.delete(hash)
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
}

export function enqueueIndex(input) {
  setImmediate(() => runIndex(input))
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
    jobs
  }
}
