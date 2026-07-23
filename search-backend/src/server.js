import express from 'express'
import {
  databaseReady,
  importSupplierProfiles,
  initializeDatabase,
  queryFacets,
  queryProducts,
  storeProducts,
  upsertJob
} from './db.js'
import { enqueueIndex, normalizeKeyword, queryHash, queryIndexState } from './indexer.js'
import { searchUpstream } from './upstream.js'

const app = express()
const port = Number(process.env.PORT || 8788)
const publicLimit = Math.max(10, Number(process.env.PUBLIC_RATE_LIMIT_PER_MINUTE || 90))
const clients = new Map()
setInterval(() => {
  const cutoff = Date.now() - 120000
  clients.forEach((value, key) => {
    if (value.startedAt < cutoff) clients.delete(key)
  })
}, 60000).unref()

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'same-origin')
  next()
})

function rateLimit(request, response, next) {
  const key = request.ip || request.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const current = clients.get(key)
  if (!current || now - current.startedAt >= 60000) {
    clients.set(key, { startedAt: now, count: 1 })
    return next()
  }
  current.count += 1
  if (current.count > publicLimit) {
    response.setHeader('Retry-After', '60')
    return response.status(429).json({ error: 'Too many search requests. Please retry shortly.' })
  }
  return next()
}

function validateSearch(body) {
  const keyword = normalizeKeyword(body?.keyword)
  if (!keyword || keyword.length < 2) throw new Error('keyword must contain at least 2 characters')
  const page = Math.max(1, Math.min(Number(body?.page || 1), 500))
  const pageSize = Math.max(1, Math.min(Number(body?.pageSize || 20), 50))
  const categoryIds = Array.isArray(body?.filters?.categoryIds)
    ? [...new Set(body.filters.categoryIds.map(value => String(value).trim()).filter(Boolean))].slice(0, 10)
    : []
  const direction = String(body?.direction).toLowerCase() === 'asc' ? 'asc' : 'desc'
  const sortBy = ['relevance', 'price', 'monthSold'].includes(body?.sortBy) ? body.sortBy : 'relevance'
  return {
    keyword,
    page,
    pageSize,
    sortBy,
    direction,
    categoryIds: categoryIds.length ? categoryIds : [''],
    filters: { ...(body?.filters || {}), categoryIds }
  }
}

function upstreamSort(sortBy, direction) {
  if (sortBy === 'price') return { price: direction }
  if (sortBy === 'monthSold') return { monthSold: direction }
  return {}
}

function capabilityPayload(indexState) {
  const ready = indexState.complete && databaseReady()
  const detailThreshold = Number(process.env.DETAIL_FILTER_COVERAGE_THRESHOLD || 0.9)
  const detailReady = ready && Number(indexState.detailCoverage || 0) >= detailThreshold
  const readyCapability = (reason) => ({
    state: 'searchField',
    enabled: ready,
    coverage: indexState.coverage,
    reason: ready ? '' : reason
  })
  return {
    indexStatus: indexState.status,
    coverage: indexState.coverage,
    filters: {
      categoryIds: { state: 'native', enabled: true, coverage: 1 },
      price: readyCapability('Preparing the complete result index'),
      moq: readyCapability('Preparing the complete result index'),
      monthlySales: readyCapability('Preparing the complete result index'),
      fulfillment: readyCapability('Preparing the complete result index'),
      supplierQuality: readyCapability('Preparing the complete result index'),
      productSpecs: {
        state: 'detailIndex',
        enabled: detailReady,
        coverage: Number(indexState.detailCoverage || 0),
        reason: detailReady ? '' : 'Category attributes have not reached the required coverage'
      },
      supplierYears: {
        state: 'missingSource',
        enabled: false,
        reason: 'Governed supplier profile data is not available'
      },
      responseTime: {
        state: 'missingSource',
        enabled: false,
        reason: 'Governed supplier profile data is not available'
      },
      oemOdm: {
        state: 'missingSource',
        enabled: false,
        reason: 'Governed supplier profile data is not available'
      }
    }
  }
}

async function fetchLiveResults(input, hashes) {
  const results = await Promise.all(input.categoryIds.map(async (categoryId, index) => {
    const result = await searchUpstream({
      keyword: input.keyword,
      categoryId,
      page: input.page,
      pageSize: input.pageSize,
      sort: upstreamSort(input.sortBy, input.direction)
    })
    if (databaseReady()) {
      await storeProducts({
        queryHash: hashes[index],
        keyword: input.keyword,
        categoryId,
        items: result.items,
        page: input.page,
        pageSize: input.pageSize
      })
      await upsertJob({
        queryHash: hashes[index],
        keyword: input.keyword,
        categoryId,
        status: 'pending',
        indexedProducts: result.items.length,
        expectedProducts: result.total
      })
      enqueueIndex({ keyword: input.keyword, categoryId, hash: hashes[index] })
    }
    return result
  }))
  const unique = new Map()
  results.forEach(result => result.items.forEach((item) => {
    const key = `${item.offerId || item.id}-${item.source || ''}`
    if (!unique.has(key)) unique.set(key, item)
  }))
  return {
    items: [...unique.values()].slice(0, input.pageSize),
    total: results.reduce((sum, result) => sum + result.total, 0)
  }
}

app.get('/health', async (_request, response) => {
  response.json({
    status: 'ok',
    database: databaseReady() ? 'ready' : 'unavailable',
    service: 'codropshipping-search-api'
  })
})

app.post('/v1/search', rateLimit, async (request, response) => {
  try {
    const input = validateSearch(request.body)
    const hashes = input.categoryIds.map(categoryId => queryHash(input.keyword, categoryId))
    const indexState = databaseReady()
      ? await queryIndexState(hashes)
      : { complete: false, status: 'not_started', coverage: 0, detailCoverage: 0, jobs: [] }

    let result
    let facets = { summary: {}, attributes: [] }
    if (indexState.complete) {
      result = await queryProducts({
        queryHashes: hashes,
        filters: input.filters,
        page: input.page,
        pageSize: input.pageSize,
        sortBy: input.sortBy,
        direction: input.direction
      })
      facets = await queryFacets({ queryHashes: hashes, filters: input.filters })
    } else {
      result = await fetchLiveResults(input, hashes)
    }

    response.json({
      data: {
        ...result,
        page: input.page,
        pageSize: input.pageSize,
        facets,
        filtersApplied: indexState.complete,
        capabilities: capabilityPayload(indexState)
      }
    })
  } catch (error) {
    const message = error?.message || 'Search failed'
    const status = /keyword must|invalid/i.test(message) ? 400 : 502
    response.status(status).json({ error: message })
  }
})

function requireAdmin(request, response, next) {
  const expected = process.env.SEARCH_ADMIN_TOKEN
  const provided = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!expected || provided !== expected) return response.status(401).json({ error: 'Unauthorized' })
  return next()
}

function validateProfiles(value) {
  if (!Array.isArray(value) || !value.length || value.length > 500) throw new Error('profiles must contain 1 to 500 records')
  return value.map((profile) => {
    if (!profile?.supplierKey || !profile?.sourceName) {
      throw new Error('Each profile requires supplierKey and sourceName')
    }
    return {
      ...profile,
      supplierKey: String(profile.supplierKey).slice(0, 255),
      sourceName: String(profile.sourceName).slice(0, 255)
    }
  })
}

app.post('/v1/admin/suppliers/import', requireAdmin, async (request, response) => {
  try {
    const profiles = validateProfiles(request.body?.profiles)
    const imported = await importSupplierProfiles(profiles)
    response.json({ data: { imported } })
  } catch (error) {
    response.status(400).json({ error: error?.message || 'Import failed' })
  }
})

app.use((_request, response) => response.status(404).json({ error: 'Not found' }))

async function connectDatabase() {
  try {
    await initializeDatabase()
    console.log('Search database ready')
  } catch (error) {
    console.error('Search database unavailable, proxy mode remains active:', error.message)
    setTimeout(connectDatabase, 30000).unref()
  }
}

connectDatabase()

app.listen(port, '0.0.0.0', () => {
  console.log(`Search API listening on ${port}`)
})
