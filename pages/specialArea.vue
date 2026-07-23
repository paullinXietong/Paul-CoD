<template>
  <div class="bg-[#f2f3f7] min-h-screen relative">
    <!-- Loading Spinner -->
    <div v-if="dataLoading" class="co-loading animate-spin">
      <svg viewBox="0 0 1024 1024" class="w-[90px] h-[90px]" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 512h93.09A418.91 418.91 0 1 0 512 93.09V0c282.764 0 512 229.236 512 512s-229.236 512-512 512S0 794.764 0 512z" fill="#8a8a8a" />
      </svg>
    </div>

    <!-- Related Products Modal -->
    <Teleport to="body">
      <div v-if="showRelated" class="co-mask" @click.self="showRelated = false">
        <div class="relatedModal">
          <div class="flex justify-between items-center" style="padding-bottom: 12px;">
            <div></div>
            <svg @click="showRelated = false" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="22" height="22">
              <path d="M631 485.84l309.77-309.78a65.63 65.63 0 0 0 0-92.83 65.63 65.63 0 0 0-92.83 0L538.16 393a37 37 0 0 1-52.32 0L176.06 83.23a65.63 65.63 0 0 0-92.83 0 65.63 65.63 0 0 0 0 92.83L393 485.84a37 37 0 0 1 0 52.32L83.23 847.94a65.63 65.63 0 0 0 0 92.83 65.63 65.63 0 0 0 92.83 0L485.84 631a37 37 0 0 1 52.32 0l309.78 309.77a65.63 65.63 0 0 0 92.83 0 65.63 65.63 0 0 0 0-92.83L631 538.16a37 37 0 0 1 0-52.32z" />
            </svg>
          </div>
          <div class="flex flex-wrap items-start justify-start" style="padding: 0 20px 20px;column-gap: 16px; row-gap: 18px;">
            <div class="productItem" v-for="(item, index) in relatedList" :key="`${item.offerId}-${index}`">
              <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source } }" target="_blank" class="relative block">
                <img class="max-h-64 h-48 w-full object-cover object-left cursor-pointer" :src="item.imageUrl" :alt="item.subjectTrans">
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
                <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source } }" target="_blank">
                  <div class="productTitle" :title="item.subjectTrans">{{ item.subjectTrans }}</div>
                </NuxtLink>
                <div class="flex justify-between items-center">
                  <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
                  <img :src="alibabaIcon" style="width: 28px;height: 28px;" alt="">
                </div>
                <div class="mt-2 flex justify-center">
                  <div class="chatbtn" @click="chatNows(item)">Chat Now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <div style="max-width: 1390px;" class="container mx-auto pt-6">
      <!-- Category List for classId == 1 -->
      <div v-if="classId == 1" class="py-2 flex overflow-x-auto" style="margin: 10px 24px;">
        <label v-for="(i, n) in cateList" :key="n" class="flex-shrink-0 flex items-center cursor-pointer" style="margin-right: 30px;">
          <NuxtLink :to="{ path: '/searchResult', query: { keyword: i.translatedName } }" target="_blank">
            <div :class="sortCategory1688 == i.categoryId ? 'text-orange' : ''">{{ i.translatedName }}</div>
          </NuxtLink>
        </label>
      </div>

      <!-- Filter Panel for classId == 4 -->
      <div v-if="classId == 4" class="bg-white rounded shadow" style="margin: 24px;padding: 20px;">
        <div class="flex py-1">
          <div class="flex-shrink-0 w-36">Warehouse Address</div>
          <div class="flex flex-wrap">
            <label v-for="(i, n) in deliveryRegions" :key="n" class="flex items-center cursor-pointer border-box"
              :class="sort1 == i.id ? 'active-box' : ''" style="margin: 0 30px 15px 0;">
              <input type="radio" :value="i.id" v-model="sort1" class="hidden">
              <img :src="i.logo" style="flex-shrink: 0;width: 36px;height: 24px;margin: 0 4px;border: 1px solid #cfcfcf;" alt="">
              <div :class="sort1 == i.id ? 'text-orange' : ''" class="mx-2">{{ i.code }}</div>
            </label>
          </div>
        </div>
        <div class="flex py-1">
          <div class="flex-shrink-0 w-36">All Qualifications</div>
          <div class="flex flex-wrap">
            <label v-for="(i, n) in certificateList" :key="n" class="flex items-center cursor-pointer" style="margin: 0 30px 15px 0;">
              <input type="radio" :value="i.id" v-model="sort2" class="hidden">
              <div :class="sort2 == i.id ? 'text-orange' : ''">{{ i.abbreviation }}</div>
            </label>
          </div>
        </div>
        <div class="flex py-1">
          <div class="flex-shrink-0 w-36">Category</div>
          <div class="flex flex-wrap">
            <label v-for="(i, n) in categoryList" :key="n" class="flex items-center cursor-pointer" style="margin: 0 30px 15px 0;">
              <input type="radio" :value="i.id" v-model="sortCategory" class="hidden">
              <div :class="sortCategory == i.id ? 'text-orange' : ''">{{ i.name }}</div>
            </label>
          </div>
        </div>
        <div class="flex py-1">
          <div class="flex-shrink-0 w-36 pt-1">New Product</div>
          <div class="w-full flex justify-between items-center">
            <div class="flex">
              <div @click="saleSort()" class="flex items-center cursor-pointer select-none" style="margin-right: 30px;">
                <div class="mr-1" :class="sort.monthSold ? 'text-orange' : ''">Sales</div>
                <svg v-show="!sort.monthSold" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z" fill="#8a8a8a" />
                </svg>
                <svg v-show="sort.monthSold == '1'" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M960 704L512 256l-448 448z" fill="#FF6624" />
                </svg>
                <svg v-show="sort.monthSold == '2'" class="icon" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M64 320l448 448 448-448z" fill="#FF6624" />
                </svg>
              </div>
              <div @click="priceSort()" class="flex items-center cursor-pointer select-none" style="margin-right: 30px;">
                <div class="mr-1" :class="sort.price ? 'text-orange' : ''">Price</div>
                <svg v-show="!sort.price" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z" fill="#8a8a8a" />
                </svg>
                <svg v-show="sort.price == '1'" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M960 704L512 256l-448 448z" fill="#FF6624" />
                </svg>
                <svg v-show="sort.price == '2'" class="icon" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M64 320l448 448 448-448z" fill="#FF6624" />
                </svg>
              </div>
              <div @click="inventorySort()" class="flex items-center cursor-pointer select-none" style="margin-right: 30px;">
                <div class="mr-1" :class="sort.inventory ? 'text-orange' : ''">Inventory</div>
                <svg v-show="!sort.inventory" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z" fill="#8a8a8a" />
                </svg>
                <svg v-show="sort.inventory == '1'" class="icon cursor-pointer" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M960 704L512 256l-448 448z" fill="#FF6624" />
                </svg>
                <svg v-show="sort.inventory == '2'" class="icon" viewBox="0 0 1024 1024" width="13" height="13">
                  <path d="M64 320l448 448 448-448z" fill="#FF6624" />
                </svg>
              </div>
              <label class="flex items-center cursor-pointer select-none" style="margin-right: 30px;">
                <input type="checkbox" class="mr-1" value="true" v-model="available">
                <div>Only if it's available</div>
              </label>
              <div class="flex items-center">
                <div class="mr-2">Price:</div>
                <input type="number" v-model.number="min_price" class="pl-2 border border-gray-300 outline-none" min="0" style="width: 70px;">
                <div class="mx-2">~</div>
                <input type="number" v-model.number="max_price" class="pl-2 border border-gray-300 outline-none" min="0" style="width: 70px;">
              </div>
            </div>
            <div class="flex">
              <div @click="searchPrice" class="py-1 px-2 rounded-sm text-white cursor-pointer" style="width: 86px;background: #102D62;margin-right: 14px;">Recognize</div>
              <div @click="searchClear" class="py-1 px-2 rounded-sm bg-white cursor-pointer text-center" style="width: 86px;border: 1px solid #c7c7c7;">Clear</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="classId == 6" class="bg-white rounded shadow" style="margin: 0 24px 24px;padding: 20px;">
        <div class="flex py-1 items-center">
          <div class="flex-shrink-0 w-36">Keywords:</div>
          <el-input v-model="searchText" placeholder="" style="width: 500px;height: 38px;"></el-input>
          <div class="ml-3 flex">
            <div @click="searchPrice" class="py-1 px-2 rounded-sm text-white cursor-pointer" style="width: 96px;background: #102D62;margin-right: 14px;">Recognize</div>
            <div @click="searchClear" class="py-1 px-2 rounded-sm bg-white cursor-pointer text-center" style="width: 86px;border: 1px solid #c7c7c7;">Clear</div>
          </div>
        </div>
      </div>

      <!-- Product List -->
      <div id="YMLproduct" class="my-2 flex flex-wrap items-start justify-start" style="column-gap: 16px; row-gap: 18px;" v-show="!loading">
        <div class="productItem" v-for="(item, index) in productList" :key="index">
          <div class="relative">
            <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source } }" target="_blank" class="relative block">
              <img class="max-h-64 h-48 w-full object-cover object-left cursor-pointer" :src="item.imageUrl" :alt="item.subjectTrans">
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
            <div v-show="classId != 4" @click="getRelated(item.offerId)" class="cursor-pointer" style="position: absolute;left: 10px;bottom: 10px;padding: 3px;border-radius: 6px;background: #343434ed;">
              <svg class="icon" viewBox="0 0 1024 1024" width="28" height="28">
                <path d="M320 149.333333h-76.8q-61.653333 0-70.826667 4.736-12.074667 6.229333-18.304 18.261334Q149.333333 181.44 149.333333 242.56V320a42.666667 42.666667 0 1 1-85.333333 0v-77.44q0-43.178667 1.365333-59.498667 2.538667-29.952 12.949334-50.048 18.730667-36.053333 54.869333-54.762666 20.096-10.368 50.154667-12.885334Q199.744 64 243.2 64H320a42.666667 42.666667 0 1 1 0 85.333333z m460.8 0H704a42.666667 42.666667 0 1 1 0-85.333333h76.8q43.456 0 59.861333 1.365333 30.08 2.517333 50.133334 12.885334 36.16 18.688 54.890666 54.762666 10.410667 20.096 12.949334 50.048 1.365333 16.32 1.365333 59.498667V320a42.666667 42.666667 0 1 1-85.333333 0v-77.44q0-61.12-4.736-70.229333-6.229333-12.032-18.304-18.261334Q842.453333 149.333333 780.8 149.333333z m-105.856 465.28A234.666667 234.666667 0 0 0 725.333333 469.333333c0-129.6-105.066667-234.666667-234.666666-234.666666s-234.666667 105.066667-234.666667 234.666666 105.066667 234.666667 234.666667 234.666667a234.666667 234.666667 0 0 0 120-33.002667l84.48 84.501334a42.666667 42.666667 0 1 0 60.373333-60.330667l-80.554667-80.554667zM490.666667 320a149.333333 149.333333 0 1 1 0 298.666667 149.333333 149.333333 0 0 1 0-298.666667zM243.2 874.666667H320a42.666667 42.666667 0 1 1 0 85.333333h-76.8q-43.456 0-59.861333-1.365333-30.08-2.517333-50.133334-12.906667-36.16-18.666667-54.890666-54.741333-10.410667-20.096-12.949334-50.048Q64 824.64 64 781.44V704a42.666667 42.666667 0 1 1 85.333333 0v77.44q0 61.12 4.736 70.229333 6.229333 12.032 18.304 18.261334 9.173333 4.736 70.826667 4.736zM704 874.666667h76.8q61.653333 0 70.826667-4.736 12.074667-6.229333 18.304-18.261334 4.736-9.109333 4.736-70.229333V704a42.666667 42.666667 0 1 1 85.333333 0v77.44q0 43.178667-1.365333 59.498667-2.538667 29.952-12.949334 50.048-18.730667 36.053333-54.869333 54.741333-20.096 10.389333-50.154667 12.906667Q824.256 960 780.8 960H704a42.666667 42.666667 0 1 1 0-85.333333z" fill="#FF7700" />
              </svg>
            </div>
          </div>
          <div class="p-3">
            <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source } }" target="_blank">
              <div class="productTitle" :title="item.subjectTrans">{{ item.subjectTrans }}</div>
            </NuxtLink>
            <div class="flex justify-between items-center">
              <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
              <img :src="alibabaIcon" style="width: 28px;height: 28px;" alt="">
            </div>
            <div class="mt-2 flex justify-center">
              <div class="chatbtn" @click="chatNows(item)">Chat Now</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div id="loading-container" class="my-2 flex flex-wrap items-start justify-start" style="column-gap: 16px; row-gap: 18px;" v-show="loading">
        <div v-for="idx in 24" :key="idx" class="productItem">
          <div class="relative">
            <div class="max-h-64 h-48 w-full bg-gray-200 animate-pulse"></div>
          </div>
          <div class="p-3">
            <div class="h-4 bg-gray-200 animate-pulse mb-2"></div>
            <div class="h-6 bg-gray-200 animate-pulse w-20"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <el-pagination
          @current-change="maybeLoadMore"
          :current-page.sync="current"
          :page-size="24"
          layout="prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { getRate, getSpecialList, getXiYueCertificates, getXiYueDeliveryRegions, getXiYueCategory, getZoneGoodsCategory, getProductRelatedRecommend } from '~/services/api'

useHead({
  title: 'Boards - CoDropshipping',
  meta: [
    { name: 'description', content: 'Find China suppliers, manufacturers, wholesalers for best products at cheap wholesale price.' }
  ]
})

definePageMeta({ layout: 'default' })

const route = useRoute()

// Image paths
const alibabaIcon = new URL('@/assets/images/1688alibaba.svg', import.meta.url).href

// State
const productList = ref<any[]>([])
const rate = ref(1)
const classId = ref<number>(0)
const searchText = ref('')
const current = ref(1)
const total = ref(0)
const loading = ref(true)
const certificateList = ref<any[]>([])
const deliveryRegions = ref<any[]>([])
const sort1 = ref<number | string>('')
const sort2 = ref<number | string>('')
const sort = ref<{ monthSold?: string; price?: string; inventory?: string }>({})
const min_price = ref<number | null>(null)
const max_price = ref<number | null>(null)
const available = ref(true)
const categoryList = ref<any[]>([])
const sortCategory = ref<number | string>('')
const cateList = ref<any[]>([])
const sortCategory1688 = ref<number | string>('')
const dataLoading = ref(false)
const showRelated = ref(false)
const relatedList = ref<any[]>([])
const isPage = ref(true)
const chatText = inject('chatProduct')
const totalNum = ref(0)

// Methods
function divide(num1: number, num2: number) {
  const result = (num1 * 100) / (num2 * 100)
  const fixed = Math.round(result * 100) / 100
  return fixed > 0 ? fixed : 0.01
}

function goTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

function maybeLoadMore(val) {
  current.value = val
  getPages()
}

function handleScroll() {
  // if (typeof window === 'undefined') return
  // if (document.documentElement.scrollHeight - document.documentElement.scrollTop < 1450 && isPage.value) {
  //   isPage.value = false
  //   current.value += 1
  //   getPages()
  // }
}

function getPages() {
  productList.value = []
  loading.value = true
  let forms: any = {}
  if (classId.value == 4) {
    forms = {
      class_id: classId.value,
      pageIndex: current.value,
      pageCount: 24,
      keyword: searchText.value,
      delivery_region_id: sort1.value,
      certificate_id: sort2.value,
      min_price: min_price.value,
      max_price: max_price.value,
      only_show_in_stock: available.value,
      category_id: sortCategory.value
    }
    if (sort.value.monthSold) {
      forms.sales_sort = sort.value.monthSold
    }
    if (sort.value.price) {
      forms.price_sort = sort.value.price
    }
    if (sort.value.inventory) {
      forms.inventory_sort = sort.value.inventory
    }
  } else {
    forms = {
      class_id: classId.value,
      pageIndex: current.value,
      pageCount: 24,
      keyword: searchText.value,
      categoryId: sortCategory1688.value
    }
  }
  getSpecialList(forms).then((res) => {
    totalNum.value = Number(res.data.data.total)
    const list = res.data.data.list || []
    list.forEach((item: any) => {
      item.usd = divide(parseFloat(item.priceInfo.price), rate.value)
    })
    productList.value = list
    isPage.value = true
    loading.value = false
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
  if (typeof window === 'undefined') return
  const userInfoStr = window.localStorage.getItem('userInfo')
  let chatInfo: any
  let username = ''
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    chatInfo = userInfo.manage
    username = `${userInfo.first_name} ${userInfo.last_name}`.trim()
  } else {
    const chatInfoStr = window.localStorage.getItem('chat_info')
    if (!chatInfoStr) return
    const chatInfoData = JSON.parse(chatInfoStr)
    chatInfo = chatInfoData.manage
    username = chatInfoData.chat_id
  }
  const msg = {
    page: 'Product',
    product: item.subjectTrans,
    link: `https://codropshipping.com/productDetail?id=${item.offerId}&source=${item.source}`
  }
  const text = `Customer: ${username} | Source: ${msg.page} | Product: ${msg.product} | Link: ${msg.link} `
  window.open(`https://api.whatsapp.com/send?phone=${chatInfo.whatsappp}&text=${encodeURIComponent(text)}`, '_blank')
}

function addProduct(item: any) {
  // Empty function - can be implemented later
}

function addList(item: any) {
  if (typeof window !== 'undefined') {
    window.open(`/admin/account/Publish?id=${item.offerId}&source=${item.source}`, '_blank')
  }
}

async function fetchData() {
  const id = route.query.id as string
  const region = route.query.region as string
  const type = route.query.type as string

  classId.value = id ? Number(id) : 0

  try {
    const rateRes = await getRate()
    rate.value = rateRes.data.data.exchange_rate
  } catch (error) {
    console.error('Failed to fetch rate:', error)
  }

  if (classId.value == 4) {
    try {
      const [certRes, regionRes, categoryRes] = await Promise.all([
        getXiYueCertificates(),
        getXiYueDeliveryRegions(),
        getXiYueCategory()
      ])
      certificateList.value = certRes.data.data || []
      deliveryRegions.value = regionRes.data.data || []
      categoryList.value = categoryRes.data.data || []
    } catch (error) {
      console.error('Failed to fetch filter data:', error)
    }

    if (region) {
      sort1.value = Number(region)
    } else {
      getPro()
    }
  } else {
    if (type) {
      sortCategory1688.value = type
    }
    getPro()
    try {
      const res = await getZoneGoodsCategory({})
      cateList.value = res.data.data || []
    } catch (error) {
      console.error('Failed to fetch category list:', error)
    }
  }
}

function getPro() {
  productList.value = []
  loading.value = true
  goTop()
  let forms: any = {}
  if (classId.value == 4) {
    forms = {
      class_id: classId.value,
      pageIndex: current.value,
      pageCount: 24,
      keyword: searchText.value,
      delivery_region_id: sort1.value,
      certificate_id: sort2.value,
      min_price: min_price.value,
      max_price: max_price.value,
      only_show_in_stock: available.value,
      category_id: sortCategory.value
    }
    if (sort.value.monthSold) {
      forms.sales_sort = sort.value.monthSold
    }
    if (sort.value.price) {
      forms.price_sort = sort.value.price
    }
    if (sort.value.inventory) {
      forms.inventory_sort = sort.value.inventory
    }
  } else {
    forms = {
      class_id: classId.value,
      pageIndex: current.value,
      pageCount: 24,
      keyword: searchText.value,
      categoryId: sortCategory1688.value
    }
  }
  getSpecialList(forms).then((res) => {
    loading.value = false
    totalNum.value = Number(res.data.data.total)
    const list = res.data.data.list || []
    list.forEach((item: any) => {
      item.usd = divide(parseFloat(item.priceInfo.price), rate.value)
    })
    productList.value = list
    isPage.value = true
    total.value = parseInt(res.data.data.total || '0')
  }).catch((error) => {
    loading.value = false
    console.error('Failed to fetch products:', error)
  })
}

function searchPrice() {
  current.value = 1
  getPro()
}

function searchClear() {
  sort1.value = ''
  sort2.value = ''
  sortCategory.value = ''
  sort.value = {}
  available.value = true
  min_price.value = null
  max_price.value = null
  current.value = 1
  searchText.value = ''
  getPro()
}

function saleSort() {
  if (sort.value.monthSold == '1') {
    sort.value = { monthSold: '2' }
  } else {
    sort.value = { monthSold: '1' }
  }
  searchPrice()
}

function priceSort() {
  if (sort.value.price == '1') {
    sort.value = { price: '2' }
  } else {
    sort.value = { price: '1' }
  }
  searchPrice()
}

function inventorySort() {
  if (sort.value.inventory == '1') {
    sort.value = { inventory: '2' }
  } else {
    sort.value = { inventory: '1' }
  }
  searchPrice()
}

async function getRelated(id: string | number) {
  dataLoading.value = true
  try {
    const res = await getProductRelatedRecommend({
      offerId: id,
      pageIndex: 1,
      pageCount: 10,
      type: 2
    })
    const list = res.data.data || []
    list.forEach((item: any) => {
      item.usd = divide(item.priceInfo.price, rate.value)
    })
    relatedList.value = list
    showRelated.value = true
  } catch (error) {
    console.error('Failed to fetch related products:', error)
  } finally {
    dataLoading.value = false
  }
}

// Watchers
watch(sort1, () => {
  searchPrice()
})

watch(sort2, () => {
  searchPrice()
})

watch(sortCategory, () => {
  searchPrice()
})

watch(sortCategory1688, () => {
  searchPrice()
})

// Lifecycle
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }
  fetchData()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.co-loading {
  position: fixed;
  left: calc(50% - 45px);
  top: calc(50% - 45px);
  z-index: 40;
}

.co-mask {
  position: fixed;
  z-index: 40;
  background: #00000061;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.relatedModal {
  padding: 10px;
  width: 1174px;
  border-radius: 6px;
  background: #fff;
  max-height: 90vh;
  overflow-y: auto;
}

.border-box {
  padding: 6px 2px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.active-box {
  border-color: #ff6624;
}

.productItem {
  width: 210px;
  margin: 0 !important;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}



.desc-list {
  display: none;
  font-size: 12px;
  margin-left: 4px;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.icon-list {
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

/* .add-product {
  display: none;
  position: absolute;
  bottom: 10px;
  align-items: center;
  right: 10px;
  background: #f70;
  color: #fff;
  border-radius: 15px;
  padding: 6px 8px;
  height: 32px;
  cursor: pointer;
}

.add-product:hover .desc-product {
  display: inline-block;
} */

.desc-product {
  display: none;
  font-size: 12px;
  margin-left: 4px;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.productTitle {
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
}

.chatbtn {
  border: 1px solid #5e5e5e;
  border-radius: 24px;
  cursor: pointer;
  text-align: center;
  padding: 4px;
  width: 130px;
  color: #000;
  transition: all 0.2s;
}

.chatbtn:hover {
  background: #f0f0f0;
}

.text-orange {
  color: #ff6624;
}

@media only screen and (max-width: 1389px) {
  #YMLproduct {
    width: 1190px;
    column-gap: 23px !important;
  }

  #loading-container {
    width: 1190px;
    margin: 0.5rem auto;
  }
}

#loading-container {
  padding-left: 24px;
  padding-right: 24px;
}

#YMLproduct {
  padding-left: 24px;
  padding-right: 24px;
}

.action-badge:hover .desc {
  display: inline-block;
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
</style>

