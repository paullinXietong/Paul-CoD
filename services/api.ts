import axios from 'axios'

let touristRefreshPromise: Promise<string> | null = null

function touristPayload() {
  const ua = navigator.userAgent
  const browser = /\bOPR\/|Opera/.test(ua) ? 'Opera'
    : /Chrome/i.test(ua) ? 'Chrome'
      : /Firefox/i.test(ua) ? 'Firefox'
        : /MSIE|Trident/.test(ua) ? 'IE'
          : /Safari/i.test(ua) ? 'Safari'
            : 'Unknown'
  const normalizedUa = ua.toLowerCase()
  const sys = normalizedUa.includes('windows nt 10.0') ? 'Windows 10'
    : normalizedUa.includes('windows nt 6.2') ? 'Windows 8'
      : normalizedUa.includes('windows nt 6.1') ? 'Windows 7'
        : /iphone|ipad/.test(normalizedUa) ? 'IOS'
          : /android/.test(normalizedUa) ? 'Android'
            : /mac/.test(normalizedUa) ? 'Mac'
              : /linux/.test(normalizedUa) ? 'Linux'
                : 'Unknown'

  return {
    browser,
    sys,
    agent: ua,
    machine: `${window.screen.width}*${window.screen.height}`,
    language: window.navigator.language
  }
}

async function refreshTouristToken(baseURL: string) {
  if (!process.client) return ''
  if (!touristRefreshPromise) {
    touristRefreshPromise = axios
      .post(`${baseURL}/shipping/Tourists/login`, touristPayload(), { timeout: 30000 })
      .then((res) => {
        const token = res.data?.data?.token || res.data?.token || ''
        if (token) window.localStorage.setItem('Touriststoken', token)
        return token
      })
      .finally(() => {
        touristRefreshPromise = null
      })
  }
  return touristRefreshPromise
}

function isTouristAuthError(response: any) {
  const message = String(response?.data?.msg || response?.data?.message || '')
  return response?.status === 401
    || response?.status === 403
    || (response?.data?.code === -1 && /log\s*in|tourist|token|\u767b\u5f55|\u8eab\u4efd/i.test(message))
}

function attachTouristRecovery(instance: any, baseURL: string) {
  async function retry(response: any) {
    const request = response?.config
    const hasMemberToken = process.client && window.localStorage.getItem('TOKEN')
    const isLoginRequest = String(request?.url || '').includes('/shipping/Tourists/login')
    if (!process.client || hasMemberToken || isLoginRequest || request?.__touristRetry || !isTouristAuthError(response)) {
      return null
    }

    request.__touristRetry = true
    const token = await refreshTouristToken(baseURL)
    if (!token) return null
    request.headers = request.headers || {}
    request.headers.Touriststoken = token
    return instance.request(request)
  }

  instance.interceptors.response.use(
    async (response: any) => (await retry(response)) || response,
    async (error: any) => {
      const recovered = await retry(error?.response)
      if (recovered) return recovered
      return Promise.reject(error)
    }
  )
}

export async function ensureTouristToken(force = false) {
  if (!process.client || window.localStorage.getItem('TOKEN')) return ''
  const existing = window.localStorage.getItem('Touriststoken') || ''
  if (existing && !force) return existing
  const config = useRuntimeConfig()
  return refreshTouristToken(config.public.baseUrl)
}

function createAxios(){
  const config = useRuntimeConfig()
  const token = process.client ? window.localStorage.getItem('TOKEN') : ''
  const headers: Record<string, string> = {}
  if (token) headers.token = token
  const instance = axios.create({ baseURL: config.public.baseUrl, timeout: 30000, headers })
  instance.interceptors.request.use((cfg)=>{ if(process.client){ const t = window.localStorage.getItem('Touriststoken'); if(t){ cfg.headers['Touriststoken'] = t } } return cfg })
  attachTouristRecovery(instance, config.public.baseUrl)
  return instance
}

function createAxiosMall(){
  const config = useRuntimeConfig()
  const token = process.client ? window.localStorage.getItem('TOKEN') : ''
  const headers: Record<string, string> = {}
  if (token) headers.token = token
  const instance = axios.create({ baseURL: config.public.mallBaseUrl, timeout: 30000, headers })
  instance.interceptors.request.use((cfg)=>{ if(process.client){ const t = window.localStorage.getItem('Touriststoken'); if(t){ cfg.headers['Touriststoken'] = t } } return cfg })
  attachTouristRecovery(instance, config.public.baseUrl)
  return instance
}

function createSearchAxios() {
  const config = useRuntimeConfig()
  return axios.create({
    baseURL: config.public.searchBaseUrl,
    timeout: 45000,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function getDetail(data:any){ return createAxios().post('/shipping/Goods/ProductSearchQueryProductDetail', data) }
export function addShopList(data:any){ return createAxios().post('/shipping/Order/addToGoodsList', data) }
export function addCartList(data:any){ return createAxios().post('/shipping/Order/addToCart', data) }
export function getCategory(data:any){ return createAxios().post('/shipping/Category/CategoryTranslationGetById', data) }
export function getRecommend(data:any){ return createAxios().post('/shipping/Goods/ProductSearchOfferRecommend', data) }
export function searchKeyword(data:any){ return createAxios().post('/shipping/Goods/ProductSearchKeywordQuery', data) }
export function searchProcurementProducts(data:any){ return createSearchAxios().post('/v1/search', data) }
export function getProcurementSearchStatus(data:any){ return createSearchAxios().post('/v1/search/status', data) }
export function getImgId(data:any){ return createAxios().post('/shipping/Goods/ProductImageUpload', data) }
export function searchImg(data:any){ return createAxios().post('/shipping/Goods/ProductSearchImageQueryParam', data) }
export function getInfo(data:any){ return createAxios().post('/customer/api/polymerization/getUserInfoFromCode', data) }
export function getRate(data?:any){ return createAxios().post('/shipping/Order/getExchangeRate', data) }
export function getCountry(data:any){ return createAxios().post('/customer/api/polymerization/get_sel', data) }
export function getPrice(data:any){ return createAxios().post('/customer/api/polymerization/get_logistics_price', data) }
export function getWeght(params:any){ return createAxios().get('https://gsa.bi.gobizdev.com/item/get_weight', { params }) }
export function getDefault(params:any){ return createAxios().get('/shipping/Order/getDefaultShippingToInfo', { params }) }
export function getTourists(data:any){ return createAxios().post('/shipping/Tourists/login', data) }
export function getTransport(data:any){ return createAxios().post('/shipping/Order/getTransportTypeInfo', data) }
export function getPurchaseFee(data:any){ return createAxios().post('/shipping/Order/getPurchaseFee', data) }
export function getDiscount(data:any){ return createAxios().post('/shipping/Goods/DiscountProducts', data) }
export function getInclude(data:any){ return createAxios().post('/shipping/Goods/ShippingIncludedQuery', data) }
export function includeCategory(params:any){ return createAxios().get('/shipping/Category/getShippingIncludedCategory', { params }) }
export function queryHistory(params:any){ return createAxios().get('/shipping/Goods/getQueryHistory', { params }) }
export function clearHistory(data:any){ return createAxios().post('/shipping/Goods/clearQueryHistory', data) }
export function oneUsd(data:any){ return createAxios().post('/shipping/Goods/OneUsdQuery', data) }
export function receiveCoupon(data:any){ return createAxios().post('/shipping/Order/receiveCoupon', data) }
export function getActInfo(data:any){ return createAxios().post('/shipping/Order/getUserInfo', data) }
export function getSpecialList(params:any){ return createAxios().get('/shipping/Goods/GoodsSpecialAreaList', { params }) }
export function getSearchKeywordS(data:any){ return createAxios().post('/shipping/Goods/ProductSearchKeywordSNQuery', data) }
export function getXiYueCertificates(params?:any){ return createAxios().get('/shipping/Goods/getXiYueCertificates', { params }) }
export function getXiYueDeliveryRegions(params?:any){ return createAxios().get('/shipping/Goods/getXiYueDeliveryRegions', { params }) }
export function getXiYueCategory(params?:any){ return createAxios().get('/shipping/Goods/getXiYueCategory', { params }) }
export function getZoneGoodsCategory(data:any){ return createAxios().post('/shipping/Category/getZoneGoodsCategory', data) }
export function getCommodityRecommendation(params?:any){ return createAxios().get('/shipping/Goods/commodityRecommendation', { params }) }
export function getProductCategoryList(params?:any){ return createAxios().get('/shipping/Goods/getProductCategoryList', { params }) }
export function getCommodityList(params?:any){ return createAxios().get('/shipping/Goods/getCommodityList', { params }) }
export function getEcoBuyerItemAdd(data:any){ return createAxios().post('/shipping/Goods/EcoBuyerItemAdd', data) }
export function getBuyerItemRecImageList(data:any){ return createAxios().post('/shipping/Goods/getBuyerItemRecImageList', data) }
export function getProductSearchList(params?:any){ return createAxios().get('/shipping/Goods/getProductSearchList', { params }) }
export function getKeywordRecommendation(params?:any){ return createAxios().get('/shipping/Goods/getKeywordRecommendation', { params }) }
export function getHistoricalRecordRecommendations(data:any){ return createAxios().post('/shipping/Goods/getHistoricalRecordRecommendations', data) }
export function getProductSearchOfferRecommendHandle(data:any){ return createAxios().post('/shipping/Goods/getProductSearchOfferRecommendHandle', data) }
export function getProductRelatedRecommend(data:any){ return createAxios().post('/shipping/Goods/getProductRelatedRecommend', data) }
export function getProductSearchLists(params?:any){ return createAxiosMall().get('/mall/getProductSearchList', { params }) }
export function getSpecialCategories(params?:any){ return createAxiosMall().get('/mall/getSpecialCategories', { params }) }
export function getUserTopCategoryData(params?:any){ return createAxiosMall().get('/mall/getUserTopCategoryData', { params }) }
export function recommendCategories(params?:any){ return createAxiosMall().get('/mall/recommendCategories', { params }) }
export function parsePromotionText(params?:any){ return createAxiosMall().get('/mall/parsePromotionText', { params }) }
export function getGoodsSpecialAreaCategoryList(data:any){ return createAxios().post('/shipping/goods/getGoodsSpecialAreaCategoryList', data) }
