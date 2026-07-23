const API_BASE = String(process.env.UPSTREAM_API_BASE || 'https://codropshipping.com/api').replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = Number(process.env.UPSTREAM_TIMEOUT_MS || 30000)

let touristToken = ''
let tokenExpiresAt = 0
let tokenRequest

function touristPayload() {
  return {
    browser: 'Chrome',
    sys: 'Linux',
    agent: 'CoDropshipping Search Indexer/1.0',
    machine: 'server',
    language: 'en-US'
  }
}

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(`Upstream ${response.status}: ${data.message || data.msg || 'request failed'}`)
    return data
  } finally {
    clearTimeout(timeout)
  }
}

export async function getTouristToken(force = false) {
  if (!force && touristToken && Date.now() < tokenExpiresAt) return touristToken
  if (!tokenRequest) {
    tokenRequest = request('/shipping/Tourists/login', {
      method: 'POST',
      body: JSON.stringify(touristPayload())
    }).then((data) => {
      touristToken = data?.data?.token || data?.token || ''
      if (!touristToken) throw new Error('Upstream tourist login did not return a token')
      tokenExpiresAt = Date.now() + 50 * 60 * 1000
      return touristToken
    }).finally(() => {
      tokenRequest = undefined
    })
  }
  return tokenRequest
}

function unpackSearch(data) {
  if (String(data?.code) === '-1') throw new Error(data?.msg || 'Upstream product search failed')
  const payload = data?.data
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : []
  return {
    items,
    total: Array.isArray(payload) ? items.length : Number(payload?.totalRecords || items.length)
  }
}

export async function searchUpstream({ keyword, categoryId = '', page = 1, pageSize = 50, sort = {} }) {
  let token = await getTouristToken()
  const payload = {
    keyword,
    categoryId: categoryId || undefined,
    snId: '',
    filter: '',
    sort,
    beginPage: page,
    pageSize
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const data = await request('/shipping/Goods/ProductSearchKeywordQuery', {
      method: 'POST',
      headers: { Touriststoken: token },
      body: JSON.stringify(payload)
    })
    const authMessage = String(data?.msg || data?.message || '')
    if (attempt === 0 && String(data?.code) === '-1' && /token|tourist|log\s*in|登录|身份/i.test(authMessage)) {
      token = await getTouristToken(true)
      continue
    }
    return unpackSearch(data)
  }
  throw new Error('Upstream authentication failed')
}

export async function getProductDetail({ offerId, source = '' }) {
  let token = await getTouristToken()
  const payload = { offerId, source }
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const data = await request('/shipping/Goods/ProductSearchQueryProductDetail', {
      method: 'POST',
      headers: { Touriststoken: token },
      body: JSON.stringify(payload)
    })
    const authMessage = String(data?.msg || data?.message || '')
    if (attempt === 0 && String(data?.code) === '-1' && /token|tourist|log\s*in|登录|身份/i.test(authMessage)) {
      token = await getTouristToken(true)
      continue
    }
    if (String(data?.code) === '-1') throw new Error(data?.msg || 'Upstream product detail failed')
    return data?.data || data
  }
  throw new Error('Upstream detail authentication failed')
}
