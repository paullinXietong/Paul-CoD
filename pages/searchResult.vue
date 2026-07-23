<template>
  <div class="bg-[#f2f3f7] min-h-screen">
    <div v-if="dataLoading" class="co-loading animate-spin">
      <svg viewBox="0 0 1024 1024" class="w-[90px] h-[90px]" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 512h93.09A418.91 418.91 0 1 0 512 93.09V0c282.764 0 512 229.236 512 512s-229.236 512-512 512S0 794.764 0 512z" fill="#8a8a8a" />
      </svg>
    </div>

    <Teleport to="body">
      <div v-if="showRelated" class="co-mask">
        <div class="relatedModal">
          <div class="flex justify-between items-center pb-3">
            <div class="font-semibold">Related Products</div>
            <svg @click="showRelated = false" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="22" height="22">
              <path d="M631 485.84l309.77-309.78a65.63 65.63 0 0 0 0-92.83 65.63 65.63 0 0 0-92.83 0L538.16 393a37 37 0 0 1-52.32 0L176.06 83.23a65.63 65.63 0 0 0-92.83 0 65.63 65.63 0 0 0 0 92.83L393 485.84a37 37 0 0 1 0 52.32L83.23 847.94a65.63 65.63 0 0 0 0 92.83 65.63 65.63 0 0 0 92.83 0L485.84 631a37 37 0 0 1 52.32 0l309.78 309.77a65.63 65.63 0 0 0 92.83 0 65.63 65.63 0 0 0 0-92.83L631 538.16a37 37 0 0 1 0-52.32z" />
            </svg>
          </div>
          <div class="flex flex-wrap gap-y-5 gap-x-4">
            <div v-for="item in relatedList" :key="`${item.offerId}-${item.source}`" class="productItem shadow rounded-md">
              <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source, keyword: queryState.keyword } }" class="relative block" target="_blank">
                <img class="max-h-64 h-48 w-full object-cover object-left rounded" :src="item.imageUrl" :alt="item.subjectTrans">
                <button class="action-badge add-product" @click.prevent.stop="addProduct(item)">
                  <span class="desc">Add To My Products</span>
                  <i class="icon-product"></i>
                  <!-- <img :src="addProductIcon" alt="add product" class="icon-img"> -->
                </button>
                <button class="action-badge add-list" @click.prevent.stop="addList(item)">
                  <span class="desc">List</span>
                  <i
                  class="icon-list"></i>
                  <!-- <img :src="addListIcon" alt="list" class="icon-img"> -->
                </button>
              </NuxtLink>
              <div class="p-3">
                <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source, keyword: queryState.keyword } }" target="_blank">
                  <div class="productTitle" :title="item.subjectTrans">{{ item.subjectTrans }}</div>
                </NuxtLink>
                <div class="flex justify-between items-center">
                  <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
                  <img :src="alibabaIcon" class="w-7 h-7" alt="seller">
                </div>
                <div class="mt-2 flex justify-center">
                  <button class="chatbtn w-full" @click="chatNows(item)">Chat Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="max-w-[1390px] mx-auto px-6 py-2">
      <div v-if="keywordDisplay" id="keywordsearch" class="bg-white rounded px-6 py-4 text-sm text-gray-600 hidden">
        Search "{{ keywordDisplay }}"
      </div>

      <div v-else-if="searchImage" id="imgselect" class="mt-2 bg-white p-4 rounded flex items-center gap-4">
        <img :src="searchImage" class="w-24 h-24 rounded object-cover" alt="search image">
        <div>
          <div class="font-semibold text-sm text-gray-700">Image search</div>
          <div class="text-gray-500 text-sm">We are showing products similar to your image.</div>
        </div>
      </div>

      <section v-if="sortList.length && keywordDisplay" id="search-container" class="filter-panel mt-4">
        <div class="filter-groups">
          <div v-for="(item, index) in visibleSortList" :key="`${item.id}-${index}`" class="filter-row">
            <div class="filter-label" :title="item.translateName">
              <span>{{ item.translateName }}</span>
              <span class="filter-count">{{ item.children?.length || 0 }}</span>
            </div>
            <div class="filter-options">
              <button
                v-for="child in item.children"
                :key="child.id"
                type="button"
                class="filter-option"
                :class="{ active: snid.includes(child.id) }"
                :aria-pressed="snid.includes(child.id)"
                @click="selectItem(child)">
                <span class="option-check" aria-hidden="true">{{ snid.includes(child.id) ? '✓' : '' }}</span>
                <span>{{ child.translateName }}</span>
              </button>
            </div>
          </div>
        </div>

        <footer class="filter-footer">
          <div class="min-w-0 flex-1">
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ selectedCount ? `${selectedCount} selected` : 'No filters selected' }}
            </div>
            <div v-if="selectList.length" class="mt-2 flex flex-wrap gap-2">
              <button v-for="item in selectList" :key="item.id" type="button" class="selected-filter" :aria-label="`Remove ${item.translateName}`" @click="selectItem(item)">
                {{ item.translateName }} <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button v-if="selectedCount" type="button" class="clear-filter" @click="clearSnid">Clear all</button>
            <button type="button" class="apply-filter" :disabled="!filtersDirty" @click="applyFilters">
              {{ loading ? 'Searching...' : `Apply filters${selectedCount ? ` (${selectedCount})` : ''}` }}
            </button>
          </div>
        </footer>
      </section>

      <section v-if="keywordDisplay" id="sort-container" class="result-toolbar mt-4">
        <div class="min-w-0">
          <div class="font-semibold text-gray-950">{{ loading ? 'Finding products...' : `${totalNum || productList.length} products found` }}</div>
          <div v-if="appliedFilterText" class="mt-1 truncate text-xs text-gray-500">Matching: {{ appliedFilterText }}</div>
          <div v-else class="mt-1 text-xs text-gray-500">Results for {{ keywordDisplay }}</div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-3 select-none text-sm">
          <button type="button" class="sort-control" @click="saleSort()">
            <span :class="{ active: !!sort.monthSold }">Monthly sales</span>
            <svg v-if="!sort.monthSold" class="icon ml-1" viewBox="0 0 1024 1024" width="14" height="14">
              <path d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z" fill="#8a8a8a" />
            </svg>
            <svg v-else-if="sort.monthSold === 'asc'" class="icon ml-1" viewBox="0 0 1024 1024" width="14" height="14">
              <path d="M64 320l448 448 448-448z" fill="#FF6624" />
            </svg>
            <svg v-else class="icon ml-1" viewBox="0 0 1024 1024" width="14" height="14">
              <path d="M960 704L512 256l-448 448z" fill="#FF6624" />
            </svg>
          </button>

          <button type="button" class="sort-control" @click="priceSort()">
            <span :class="{ active: !!sort.price }">Price</span>
            <svg v-if="!sort.price" class="icon ml-1" viewBox="0 0 1024 1024" width="14" height="14">
              <path d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z" fill="#8a8a8a" />
            </svg>
            <svg v-else-if="sort.price === 'asc'" class="icon ml-1" viewBox="0 0 1024 1024" width="14" height="14">
              <path d="M64 320l448 448 448-448z" fill="#FF6624" />
            </svg>
            <svg v-else class="icon ml-1" viewBox="0 0 1024 1024" width="14" height="14">
              <path d="M960 704L512 256l-448 448z" fill="#FF6624" />
            </svg>
          </button>
        </div>
      </section>

      <section class="mt-4 bg-white text-black rounded-lg px-2 py-3">
        <div v-if="productList.length" id="YMLproduct" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px,1fr));">
          <div class="productItem shadow rounded-md" v-for="item in productList" :key="`${item.offerId}-${item.source}`">
            <div class="relative">
              <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source, keyword: queryState.keyword } }" class="relative block" target="_blank">
                <img class="max-h-64 h-48 w-full object-cover object-left rounded" :src="item.imageUrl" :alt="item.subjectTrans">
                <button class="action-badge add-product" @click.prevent.stop="addProduct(item)">
                  <span class="desc">Add To My Products</span>
                  <i class="icon-product"></i>
                  <!-- <img :src="addProductIcon" alt="add product" class="icon-img"> -->
                </button>
                <button class="action-badge add-list" @click.prevent.stop="addList(item)">
                  <span class="desc">List</span>
                  <i
                  class="icon-list"></i>
                  <!-- <img :src="addListIcon" alt="list" class="icon-img"> -->
                </button>
              </NuxtLink>
              <button class="related-btn" @click="getRelated(item.offerId)">
                <svg viewBox="0 0 1024 1024" width="24" height="24">
                  <path d="M320 149.333h-76.8q-61.653 0-70.827 4.736-12.074 6.229-18.304 18.262Q149.333 181.44 149.333 242.56V320a42.667 42.667 0 1 1-85.333 0v-77.44q0-43.179 1.365-59.499 2.539-29.952 12.95-50.048 18.731-36.053 54.869-54.763 20.096-10.368 50.155-12.885Q199.744 64 243.2 64H320a42.667 42.667 0 1 1 0 85.333zm460.8 0H704a42.667 42.667 0 1 1 0-85.333h76.8q43.456 0 59.861 1.365 30.08 2.517 50.134 12.885 36.16 18.688 54.89 54.763 10.411 20.096 12.95 50.048 1.365 16.32 1.365 59.499V320a42.667 42.667 0 1 1-85.333 0v-77.44q0-61.12-4.736-70.229-6.229-12.032-18.304-18.262-9.173-4.736-70.827-4.736zm-105.856 465.28A234.667 234.667 0 0 0 725.333 469.333c0-129.6-105.067-234.667-234.667-234.667S256 339.733 256 469.333s105.067 234.667 234.667 234.667a234.667 234.667 0 0 0 120-33.003l84.48 84.502a42.667 42.667 0 1 0 60.373-60.331l-80.555-80.555zM490.667 320a149.333 149.333 0 1 1 0 298.667 149.333 149.333 0 0 1 0-298.667zM243.2 874.667H320a42.667 42.667 0 1 1 0 85.333h-76.8q-43.456 0-59.861-1.365-30.08-2.517-50.134-12.907-36.16-18.667-54.89-54.741-10.411-20.096-12.95-50.048Q64 824.64 64 781.44V704a42.667 42.667 0 1 1 85.333 0v77.44q0 61.12 4.736 70.229 6.229 12.032 18.304 18.262 9.173 4.736 70.827 4.736zM704 874.667h76.8q61.653 0 70.827-4.736 12.074-6.229 18.304-18.262 4.736-9.109 4.736-70.229V704a42.667 42.667 0 1 1 85.333 0v77.44q0 43.179-1.365 59.499-2.539 29.952-12.95 50.048-18.731 36.053-54.869 54.741-20.096 10.389-50.155 12.907Q824.256 960 780.8 960H704a42.667 42.667 0 1 1 0-85.333z" fill="#FF7700" />
                </svg>
              </button>
            </div>
            <div class="p-3">
              <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source, keyword: queryState.keyword } }" target="_blank">
                <div class="productTitle" :title="item.subjectTrans">{{ item.subjectTrans }}</div>
              </NuxtLink>
              <div class="flex justify-between items-center">
                <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
                <img :src="alibabaIcon" class="w-7 h-7" alt="seller">
              </div>
              <div class="flex justify-between items-center text-xs">
                <p>Monthly sales: {{ item.monthSold || 0 }}</p>
              </div>
              <div class="mt-2 flex justify-center">
                <button class="chatbtn" @click="chatNows(item)">Chat Now</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" id="loading-container" class="mt-4 grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(200px,1fr));">
          <div v-for="idx in skeletonItems" :key="idx" class="skeleton-card"></div>
        </div>

        <div v-if="!loading && productError" class="my-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700" role="alert">
          {{ productError }}
        </div>

        <div v-else-if="!loading && !productList.length" class="text-center my-6 text-base text-black">
          No Data
        </div>

        <div class="mt-6 flex justify-center">
          <el-pagination
            @current-change="maybeLoadMore"
            :current-page.sync="current"
            :page-size="18"
            layout="prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </div>
      </section>
    </div>

    <BackTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { searchKeyword, searchImg, getRate, getSearchKeywordS, getProductRelatedRecommend, addShopList, getCountry, getDefault, getCategory } from '~/services/api'
import { buildProductTaxonomyFilters, isLocalFilterId, isTaxonomyFilter, type ProductTaxonomyNode } from '~/data/productTaxonomy'

useHead({
  title: 'Search Result - CoDropshipping',
  meta: [
    { name: 'description', content: 'Find China suppliers, manufacturers, wholesalers for the best products at wholesale prices.' },
    { name: 'referrer', content: 'no-referrer' }
  ]
})
definePageMeta({ layout: 'default' })
const route = useRoute()
const selectList = ref<any[]>([])
const appliedSelectList = ref<any[]>([])
const snid = ref<Array<number | string>>([])
const appliedSnid = ref<Array<number | string>>([])
const sortList = ref<any[]>([])
const filtersDirty = ref(false)
const queryState = ref<Record<string, string>>({})
const productList = ref<any[]>([])
const productError = ref('')
const relatedList = ref<any[]>([])
const loading = ref(true)
const fetchingMore = ref(false)
const dataLoading = ref(false)
const showRelated = ref(false)
const rate = ref(1)
const current = ref(1)
const pageSize = 18
const isPage = ref(true)
const searchImage = ref('')
const skeletonItems = Array.from({ length: 18 }, (_, idx) => idx)
const sort = ref<{ price?: 'asc' | 'desc'; monthSold?: 'asc' | 'desc' }>({})
let taxonomyCache: ProductTaxonomyNode[] | null = null
let filterRequestId = 0

const alibabaIcon = new URL('@/assets/images/1688alibaba.svg', import.meta.url).href

const keywordDisplay = computed(() => queryState.value.keyword ? decodeURIComponent(queryState.value.keyword) : '')
const visibleSortList = computed(() => sortList.value)
const selectedCount = computed(() => selectList.value.length)
const appliedFilterText = computed(() => appliedSelectList.value.map(item => item.translateName).join(', '))
const actionRegion = ref('')
const chatText = inject('chatProduct')
const totalNum = ref(0)

function divide(num1 = 0, num2 = 1) {
  const result = (num1 * 100) / (num2 * 100)
  const fixed = Math.round(result * 100) / 100
  return fixed > 0 ? fixed : 0.01
}

function syncQuery() {
  const q: Record<string, string> = {}
  Object.entries(route.query).forEach(([key, value]) => {
    if (Array.isArray(value)) q[key] = value[0] as string
    else if (value !== undefined) q[key] = String(value)
  })
  queryState.value = q
}

function saleSort() {
  if (sort.value.monthSold === 'asc') sort.value = { monthSold: 'desc' }
  else sort.value = { monthSold: 'asc' }
  delete sort.value.price
  current.value = 1
  fetchProducts(true)
}

function priceSort() {
  if (sort.value.price === 'asc') sort.value = { price: 'desc' }
  else sort.value = { price: 'asc' }
  delete sort.value.monthSold
  current.value = 1
  fetchProducts(true)
}

function selectItem(item: any) {
  const exists = snid.value.includes(item.id)
  if (exists) {
    selectList.value = selectList.value.filter(sel => sel.id !== item.id)
    snid.value = snid.value.filter(id => id !== item.id)
  } else {
    selectList.value.push(item)
    snid.value.push(item.id)
  }
  filtersDirty.value = true
}

function applyFilters() {
  appliedSelectList.value = [...selectList.value]
  appliedSnid.value = [...snid.value]
  current.value = 1
  filtersDirty.value = false
  fetchProducts(true)
}

function clearSnid() {
  selectList.value = []
  appliedSelectList.value = []
  snid.value = []
  appliedSnid.value = []
  current.value = 1
  filtersDirty.value = false
  fetchProducts(true)
}

function addList(item: any) {
  if (process.client) {
    const url = `/admin/account/Publish?id=${item.offerId}&source=${item.source}`
    window.open(url, '_blank')
  }
}

function addProduct(item: any) {
  if (process.client) {
    // const url = `/admin/account/Publish?id=${item.offerId}&source=${item.source}&mode=product`
    // window.open(url, '_blank')
    addShopList({ source: item.source, goodsId: item.offerId, country_code: actionRegion.value }).then(res => {
      window.open('/admin/account/ProductList', '_blank')
    })
  }
}

function initData() {
  getCountry({}).then(res => {
    let endCountry = res.data.data.endCountry
    getDefault().then(req => {
      for (let i = 0; i < endCountry.length; i++) {
        if(req.data.data.name_en == endCountry[i].zh_cn_nickname){
          actionRegion.value = endCountry[i].code_two
          break
        }
      }
    })
  })
}

function chatNows(item) {
  let productItem = {
    id: item.offerId,
    source: item.source,
  }
  localStorage.setItem("askProduct", JSON.stringify(productItem))
  chatText()
}

function chatNow(item: any) {
  if (!process.client) return
  const userInfo = window.localStorage.getItem('userInfo')
  let chatInfo:any
  let username = ''
  if (userInfo) {
    const data = JSON.parse(userInfo)
    chatInfo = data.manage
    username = `${data.first_name} ${data.last_name}`.trim()
  } else {
    const cache = window.localStorage.getItem('chat_info')
    if (!cache) return
    const parsed = JSON.parse(cache)
    chatInfo = parsed.manage
    username = parsed.chat_id
  }
  const msg = {
    page: 'Product',
    product: item.subjectTrans,
    link: `https://codropshipping.com/productDetail?id=${item.offerId}&source=${item.source}`
  }
  const text = `Customer: ${username} | Source: ${msg.page} | Product: ${msg.product} | Link: ${msg.link} `
  window.open(`https://api.whatsapp.com/send?phone=${chatInfo.whatsappp}&text=${encodeURIComponent(text)}`, '_blank')
}

async function getRelated(offerId: string | number) {
  dataLoading.value = true
  try {
    const res = await getProductRelatedRecommend({ offerId, pageIndex: 1, pageCount: 10, type: 2 })
    const list = res.data?.data || []
    relatedList.value = list.map((item: any) => ({
      ...item,
      usd: divide(item.priceInfo?.price, rate.value)
    }))
    showRelated.value = true
  } finally {
    dataLoading.value = false
  }
}

async function fetchFilters() {
  const requestId = ++filterRequestId
  if (!queryState.value.keyword) {
    sortList.value = []
    return
  }
  const [liveResult, taxonomyResult] = await Promise.allSettled([
    getSearchKeywordS({ keyword: queryState.value.keyword }),
    taxonomyCache ? Promise.resolve(taxonomyCache) : getCategory({})
  ])
  if (requestId !== filterRequestId) return

  const liveFilters = liveResult.status === 'fulfilled' && liveResult.value.data?.code !== -1
    && Array.isArray(liveResult.value.data?.data)
    ? liveResult.value.data.data
    : []

  if (taxonomyResult.status === 'fulfilled') {
    taxonomyCache = Array.isArray(taxonomyResult.value)
      ? taxonomyResult.value
      : Array.isArray(taxonomyResult.value.data?.data)
        ? taxonomyResult.value.data.data
        : []
  }

  const taxonomyFilters = buildProductTaxonomyFilters(
    taxonomyCache || [],
    keywordDisplay.value,
    queryState.value.categoryId
  )
  sortList.value = [...taxonomyFilters, ...liveFilters]

  if (liveResult.status === 'rejected') console.warn('Failed to fetch live search filters', liveResult.reason)
  if (taxonomyResult.status === 'rejected') console.warn('Failed to fetch product taxonomy', taxonomyResult.reason)
}

async function fetchProducts(reset = false) {
  productError.value = ''
  if (!queryState.value.keyword && !queryState.value.imageId) {
    productList.value = []
    loading.value = false
    return
  }
  if (reset) {
    loading.value = true
    fetchingMore.value = false
    productList.value = []
    // current.value = 1
  } else {
    fetchingMore.value = true
  }
  const basePayload: Record<string, any> = {
    sort: sort.value,
    filter: '',
    beginPage: current.value,
    pageSize
  }
  const api = queryState.value.keyword ? searchKeyword : searchImg
  let payloads: Record<string, any>[] = []

  if (queryState.value.keyword) {
    const selectedCategories = appliedSelectList.value.filter(isTaxonomyFilter)
    const refinementQueries = appliedSelectList.value
      .filter(item => isLocalFilterId(item.id) && !isTaxonomyFilter(item) && item.query)
      .map(item => item.query)
    const remoteSnIds = appliedSnid.value.filter(id => !isLocalFilterId(id)).join(',')
    const categorySearches = selectedCategories.length ? selectedCategories : [null]

    payloads = categorySearches.map((category) => ({
      ...basePayload,
      keyword: [category?.translateName || queryState.value.keyword, ...refinementQueries].join(' ').trim(),
      categoryId: category?.categoryId || queryState.value.categoryId,
      snId: remoteSnIds
    }))
  } else {
    payloads = [{ ...basePayload, imageId: queryState.value.imageId }]
  }

  try {
    const responses = await Promise.all(payloads.map(payload => api(payload)))
    const searches = responses.map((res) => {
      if (String(res.data?.code) === '-1') {
        throw new Error(res.data?.msg || 'Product search failed')
      }
      const responseData = res.data?.data
      const items = Array.isArray(responseData)
        ? responseData
        : (Array.isArray(responseData?.data) ? responseData.data : [])
      const total = Array.isArray(responseData)
        ? items.length
        : Number(responseData?.totalRecords || items.length)
      return { items, total }
    })

    const uniqueProducts = new Map<string, any>()
    searches.forEach(({ items }) => {
      items.forEach((item: any) => {
        const key = `${item.offerId || item.id}-${item.source || ''}`
        if (!uniqueProducts.has(key)) uniqueProducts.set(key, item)
      })
    })
    const list = [...uniqueProducts.values()]

    if (sort.value.price) {
      const direction = sort.value.price === 'asc' ? 1 : -1
      list.sort((a, b) => {
        const aPrice = Number(a.priceInfo?.price ?? a.priceInfo?.jxhyPrice ?? a.priceInfo?.consignPrice ?? 0)
        const bPrice = Number(b.priceInfo?.price ?? b.priceInfo?.jxhyPrice ?? b.priceInfo?.consignPrice ?? 0)
        return (aPrice - bPrice) * direction
      })
    } else if (sort.value.monthSold) {
      const direction = sort.value.monthSold === 'asc' ? 1 : -1
      list.sort((a, b) => (Number(a.monthSold || 0) - Number(b.monthSold || 0)) * direction)
    }

    searchImage.value = queryState.value.imageIdList

    productList.value =
    // (reset ? [] : productList.value).concat(
      list.slice(0, pageSize).map((item: any) => {
        const priceSource = item.priceInfo?.price ?? item.priceInfo?.jxhyPrice ?? item.priceInfo?.consignPrice ?? 0
        return {
          ...item,
          usd: divide(priceSource, rate.value)
        }
      })
    // )

    // console.log('productList', productList.value.length)
    const total = searches.reduce((sum, search) => sum + search.total, 0)
    totalNum.value = total
    if (total && total > 0) {
      isPage.value = current.value * pageSize < total
    } else {
      isPage.value = list.length === pageSize
    }
  } catch (error) {
    console.error('Failed to fetch products', error)
    productError.value = 'Products could not be loaded. Please try the search again.'
  } finally {
    loading.value = false
    fetchingMore.value = false
  }
}

async function loadRate() {
  const res = await getRate()
  rate.value = res.data?.data?.exchange_rate || 1
}

function maybeLoadMore(val) {
  if (loading.value || fetchingMore.value || !isPage.value) return
  current.value = val
  fetchProducts(true)
}

async function bootstrap() {
  loading.value = true
  await Promise.allSettled([loadRate(), fetchFilters()])
  if (queryState.value.keyword) searchImage.value = ''
  else if (process.client) searchImage.value = queryState.value.imageIdList
  await fetchProducts(true)
}

onMounted(() => {
  syncQuery()
  bootstrap()
  initData()
})

watch(() => route.fullPath, () => {
  syncQuery()
  selectList.value = []
  appliedSelectList.value = []
  snid.value = []
  appliedSnid.value = []
  filtersDirty.value = false
  sort.value = {}
  bootstrap()
})
</script>

<style scoped>
.icon-list{
  margin-right: 0;
}
.icon-list::before{
  content: '';
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  display: block;
  background: url('@/assets/images/addList.png') center center no-repeat;
}

.icon-product{
  margin-right: 0;
}
.icon-product::before{
  content: '';
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  display: block;
  background: url('@/assets/images/addProduct.png') center center no-repeat;
}

.action-badge:hover .desc {
  display: inline-block;
}

.desc {
  display: none;
  font-size: 12px;
  margin-left: 4px;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.productItem {
  width: 200px;
  margin: 0 auto;
}

.productTitle {
  font-size: 14px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.action-badge {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: #f70;
  color: #fff;
  padding: 7px;
  font-size: 12px;
  opacity: 0;
  transition: opacity .2s;
  gap: 6px;
}

.productItem:hover .action-badge {
  opacity: 1;
}

.action-badge .icon-img {
  width: 18px;
  height: 18px;
}

.add-product {
  bottom: 48px;
}

.add-list {
  bottom: 10px;
}

.related-btn {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px;
  border-radius: 6px;
  background: #343434ed;
}

.chatbtn {
  border: 1px solid #5e5e5e;
  border-radius: 24px;
  cursor: pointer;
  text-align: center;
  padding: 4px;
  min-width: 130px;
  color: #000;
}

.active {
  color: #f70;
}

.filter-panel {
  overflow: hidden;
  border: 1px solid #e6e7e9;
  border-radius: 14px;
  background: #fff;
  color: #202124;
  box-shadow: 0 12px 36px rgba(59, 47, 41, 0.06);
}

.clear-filter {
  min-height: 32px;
  border: 1px solid #d9dbdf;
  border-radius: 9px;
  background: #fff;
  padding: 6px 11px;
  color: #45474c;
  font-size: 12px;
  font-weight: 600;
}

.clear-filter:hover {
  border-color: #aeb1b7;
  background: #f7f7f7;
}

.filter-groups {
  padding: 2px 24px;
}

.filter-row {
  display: grid;
  grid-template-columns: 145px minmax(0, 1fr);
  gap: 18px;
  padding: 16px 0;
}

.filter-row + .filter-row {
  border-top: 1px solid #f0f1f2;
}

.filter-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 7px;
  color: #33363b;
  font-size: 13px;
  font-weight: 650;
}

.filter-count {
  min-width: 24px;
  border-radius: 999px;
  background: #f1f2f3;
  padding: 2px 7px;
  color: #777b82;
  font-size: 10px;
  text-align: center;
}

.filter-options {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 7px;
  overscroll-behavior-x: contain;
  scrollbar-color: #c6c8cc transparent;
  scrollbar-width: thin;
  scroll-snap-type: x proximity;
}

.filter-options::-webkit-scrollbar {
  height: 5px;
}

.filter-options::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #c6c8cc;
}

.filter-option {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 7px;
  border: 1px solid #dfe1e4;
  border-radius: 9px;
  background: #fff;
  padding: 6px 10px 6px 7px;
  color: #3f4247;
  font-size: 12px;
  line-height: 1;
  flex: 0 0 auto;
  scroll-snap-align: start;
  transition: border-color .16s ease, background-color .16s ease, transform .16s ease;
}

.filter-option:hover {
  border-color: #ff9b5b;
  background: #fffaf7;
}

.filter-option:active,
.apply-filter:active,
.selected-filter:active {
  transform: translateY(1px);
}

.option-check {
  display: inline-flex;
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  align-items: center;
  justify-content: center;
  border: 1px solid #cfd2d6;
  border-radius: 5px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.filter-option.active {
  border-color: #ff7700;
  background: #fff4eb;
  color: #9b3e08;
}

.filter-option.active .option-check {
  border-color: #ff7700;
  background: #ff7700;
}

.filter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid #e9eaec;
  background: #f8f8f7;
  padding: 16px 24px;
}

.selected-filter {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  gap: 6px;
  border: 1px solid #ffcba8;
  border-radius: 8px;
  background: #fff;
  padding: 4px 8px;
  color: #98400d;
  font-size: 11px;
}

.apply-filter {
  min-height: 38px;
  border-radius: 10px;
  background: #272727;
  padding: 8px 16px;
  color: #fff;
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
}

.apply-filter:disabled {
  cursor: not-allowed;
  background: #d7d8da;
  color: #73767c;
}

.result-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid #e7e8ea;
  border-radius: 12px;
  background: #fff;
  padding: 14px 18px;
  color: #202124;
}

.sort-control {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  border-radius: 8px;
  padding: 6px 9px;
  color: #565960;
}

.sort-control:hover {
  background: #f4f4f4;
}

.co-mask {
  position: fixed;
  z-index: 40;
  background: rgba(0, 0, 0, 0.38);
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.relatedModal {
  padding: 20px;
  width: 1174px;
  border-radius: 6px;
  background: #fff;
  max-height: 90vh;
  overflow-y: auto;
}

.co-loading {
  position: fixed;
  left: calc(50% - 45px);
  top: calc(50% - 45px);
  z-index: 50;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1.2s linear infinite;
}

.skeleton-card {
  height: 250px;
  border-radius: 10px;
  background: linear-gradient(120deg, #ececec 25%, #f7f7f7 37%, #ececec 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.icon {
  fill: currentColor;
}

@media (max-width: 767px) {
  .filter-footer,
  .result-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-groups,
  .filter-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .filter-row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px 0;
  }

  .filter-label {
    padding-top: 0;
  }

  .filter-option {
    justify-content: flex-start;
    text-align: left;
  }

  .filter-footer > div:last-child {
    justify-content: flex-end;
  }

  .result-toolbar > div:last-child {
    justify-content: flex-start;
  }
}
</style>
