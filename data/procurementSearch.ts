export type CapabilityState = 'native' | 'searchField' | 'detailIndex' | 'missingSource'

export type FilterCapability = {
  state: CapabilityState
  enabled: boolean
  coverage?: number
  reason?: string
}

export type SearchCapabilities = {
  indexStatus: 'not_started' | 'building' | 'complete' | 'failed'
  coverage: number
  filters: Record<string, FilterCapability>
}

export type ProcurementFilters = {
  categoryIds: string[]
  minSourcePrice?: number
  maxSourcePrice?: number
  maxMoq?: number
  minMonthlySales?: number
  onePieceDropshipping?: boolean
  dispatchGuarantee?: '48h'
  shippingIncluded?: boolean
  onlineInvoice?: boolean
  minTradeScore?: number
  minServiceScore?: number
  minRepurchaseRate?: number
  minTradeMedalLevel?: number
  attributes?: Record<string, string[]>
}

export type ProcurementProduct = {
  offerId: string | number
  source?: string
  imageUrl?: string
  subject?: string
  subjectTrans?: string
  usd?: number
  priceInfo?: {
    price?: number
    consignPrice?: number
    promotionPrice?: number
    jxhyPrice?: number
  }
  minOrderQuantity?: number
  monthSold?: number
  repurchaseRate?: number
  isOnePsale?: boolean | number
  isShippingIncluded?: boolean | number
  shippingIncludedCountry?: string
  tradeScore?: number
  sellerIdentities?: string[] | string
  offerIdentities?: string[] | string
  productSimpleShippingInfo?: {
    shippingTimeGuarantee?: string | number | boolean
  }
  invoiceInfo?: {
    supportOnlineInvoice?: boolean
    supportFastInvoice?: boolean
  }
  sellerDataInfo?: {
    tradeMedalLevel?: number
    compositeServiceScore?: number
    logisticsExperienceScore?: number
    repeatPurchasePercent?: number
  }
  [key: string]: unknown
}

export const defaultCapabilities: SearchCapabilities = {
  indexStatus: 'not_started',
  coverage: 0,
  filters: {
    categoryIds: { state: 'native', enabled: true },
    price: { state: 'searchField', enabled: false, reason: 'Preparing the complete result index' },
    moq: { state: 'searchField', enabled: false, reason: 'Preparing the complete result index' },
    monthlySales: { state: 'searchField', enabled: false, reason: 'Preparing the complete result index' },
    fulfillment: { state: 'searchField', enabled: false, reason: 'Preparing the complete result index' },
    supplierQuality: { state: 'searchField', enabled: false, reason: 'Preparing the complete result index' },
    productSpecs: { state: 'detailIndex', enabled: false, reason: 'Product specifications are being normalized' },
    supplierYears: { state: 'missingSource', enabled: false, reason: 'Supplier profile data is not available yet' },
    responseTime: { state: 'missingSource', enabled: false, reason: 'Supplier profile data is not available yet' },
    oemOdm: { state: 'missingSource', enabled: false, reason: 'Supplier profile data is not available yet' }
  }
}

export const quickFilterDefinitions = [
  { id: 'price', label: 'Price', capability: 'price' },
  { id: 'moq', label: 'MOQ', capability: 'moq' },
  { id: 'fulfillment', label: 'Fulfillment', capability: 'fulfillment' },
  { id: 'supplierQuality', label: 'Supplier quality', capability: 'supplierQuality' },
  { id: 'productSpecs', label: 'Product specs', capability: 'productSpecs' }
] as const

export function productPrice(item: ProcurementProduct) {
  return Number(
    item.priceInfo?.promotionPrice
    ?? item.priceInfo?.price
    ?? item.priceInfo?.jxhyPrice
    ?? item.priceInfo?.consignPrice
    ?? 0
  )
}

export function normalizePercent(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) return null
  const normalized = number <= 1 ? number * 100 : number
  return Math.min(Math.round(normalized), 100)
}

export function formatCompactNumber(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(number)
}

export function sellerIdentityLabel(value: unknown) {
  const identities = Array.isArray(value)
    ? value
    : String(value || '').split(',').filter(Boolean)

  if (!identities.length) return ''
  return identities
    .slice(0, 2)
    .map(identity => String(identity).replace(/[_-]+/g, ' ').trim())
    .filter(Boolean)
    .join(' · ')
}

export function dispatchLabel(item: ProcurementProduct) {
  const guarantee = item.productSimpleShippingInfo?.shippingTimeGuarantee
  if (guarantee === undefined || guarantee === null || guarantee === '' || guarantee === false) return ''
  const normalized = String(guarantee).toLowerCase()
  if (normalized === 'true' || normalized === '1' || normalized.includes('48')) return '48h dispatch'
  return `${guarantee} dispatch`
}

export function cloneCapabilities(value?: Partial<SearchCapabilities> | null): SearchCapabilities {
  const providedFilters = value?.filters || {}
  return {
    indexStatus: value?.indexStatus || defaultCapabilities.indexStatus,
    coverage: Number(value?.coverage || 0),
    filters: Object.fromEntries(
      Object.entries(defaultCapabilities.filters).map(([key, fallback]) => [
        key,
        { ...fallback, ...(providedFilters[key] || {}) }
      ])
    )
  }
}
