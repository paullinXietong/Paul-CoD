<template>
  <div class="" style="background: #F4F4F2;">
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
              <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source } }" class="relative block" target="_blank">
                <img class="max-h-64 h-48 w-full object-cover object-left rounded" :src="item.imageUrl" :alt="item.subjectTrans">
                <button class="action-badge add-product" @click.prevent.stop="addProduct(item)">
                  <span class="desc">Add To My Products</span>
                  <i class="icon-product"></i>
                </button>
                <button class="action-badge add-list" @click.prevent.stop="addList(item)">
                  <span class="desc">List</span>
                  <i
                  class="icon-list"></i>
                </button>
              </NuxtLink>
              <div class="p-3">
                <NuxtLink :to="{ path: '/productDetail', query: { id: item.offerId, source: item.source } }" target="_blank">
                  <div class="productTitle" :title="item.subjectTrans">{{ item.subjectTrans }}</div>
                </NuxtLink>
                <div class="flex justify-between items-center">
                  <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
                  <img :src="alibabaIcon" class="w-7 h-7" alt="seller">
                </div>
                <div class="mt-2 flex justify-between items-center">
                  <button class="chatbtn w-full" @click="chatNows(item)">Chat Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- <div class="text-center p-3" style="background: #FFFBE8;color: #ff0d00;font-size: 18px;font-weight: 600;">China Sourcing, Global Success - Your Trusted Procurement Partner</div> -->
    
    <div class="mx-auto" style="max-width:1300px;">
      <div class="pt-3 flex relative">
        <div class="flex-shrink-0 text-sm rounded" style="width:270px;background-color:#F8F8F8;overflow-x:auto;max-height:400px;"
          @mouseenter="showCatePanels = true" @mouseleave="showCatePanels = false">
          <div ref="catePanels" v-show="showCatePanels"
            style="top: -200px;left: 270px;height: 800px;width: 1030px;z-index: 40;background: #F8F8F8;"
            class="absolute border-r rounded shadow border-l overflow-y-scroll">
            <div class="container p-4 w-full">
              <div v-for="(i,n) in catetree" :key="i.id+n"
                class="mb-3 pr-3" style="width: 254px;">
                <div @click="toSearch(i.translatedName, i.categoryId)"
                  class="mb-2 font-semibold text-base co-cate select-none cursor-pointer">{{i.translatedName}}</div>
                <div v-for="(ic,nc) in i.children" :key="ic.id+nc"
                  class="py-1 text-sm cursor-pointer co-cates"
                  @click="toSearch(ic.translatedName, ic.categoryId)">{{ic.translatedName}}</div>
              </div>
            </div>
          </div>
          <div v-for="(i,n) in cateList" :key="i.id+n" @click="toSearch(i.translatedName, i.categoryId)"
            @mouseenter="getCates(i.children)" class="px-2 py-2 flex items-center cursor-pointer select-none co-cates">
            <!-- <div v-html="i.icon"></div> -->
            <div class="ml-2">{{i.translatedName}}</div>
          </div>
        </div>
        <!-- <div class="swiper" style="width:1000px;margin-left:30px;">
          <div class="swiper-wrapper">
            <a :href="'specialArea?id=5'" style="width:100%;">
              <img src="@/assets/images/23.jpg" style="width:100%;" alt="Special Sale Event">
            </a>
          </div>
        </div> -->
        <el-carousel height="400px" style="width:1000px;margin-left:30px;">
          <!-- <el-carousel-item>
            <a :href="'specialArea?id=5'" style="width:100%;" target="_blank">
              <img src="@/assets/images/23.jpg" style="width:100%;" alt="Special Sale Event">
            </a>
          </el-carousel-item> -->
          <el-carousel-item>
            <a :href="'specialArea?id=6'" style="width:100%;" target="_blank">
              <img src="@/assets/images/bander/Furniture1.webp" style="width:100%;" alt="China Furniture Hub" loading="lazy">
            </a>
          </el-carousel-item>
          <el-carousel-item>
            <a :href="'specialArea?id=6'" style="width:100%;" target="_blank">
              <img src="@/assets/images/bander/Furniture2.webp" style="width:100%;" alt="China Furniture Hub" loading="lazy">
            </a>
          </el-carousel-item>
          <el-carousel-item>
            <a :href="'specialArea?id=6'" style="width:100%;" target="_blank">
              <img src="@/assets/images/bander/Furniture3.webp" style="width:100%;" alt="China Furniture Hub" loading="lazy">
            </a>
          </el-carousel-item>
          <el-carousel-item>
            <a :href="'activity'" style="width:100%;" target="_blank">
              <img src="@/assets/images/activity/activity.webp" style="width:100%;" alt="China Furniture Hub" loading="lazy">
            </a>
          </el-carousel-item>
          <!-- <el-carousel-item>
            <a :href="'https://www.globals2s.com/'" style="width:100%;" target="_blank">
              <img src="@/assets/images/activity/globals2s.webp" style="width:100%;" alt="China Furniture Hub" loading="lazy">
            </a>
          </el-carousel-item> -->
        </el-carousel>
      </div>

      <div class="mt-10 w-full grid gap-12" style="margin: 20px 0;grid-template-columns: repeat(3, minmax(0, 1fr));">
        <div class="p-2 col-span-1 rounded">
          <div class="text-lg">Browsing history</div>
          <div class="grid grid-cols-2" style="margin: 20px 0 10px;">
            <div v-for="(i,n) in historyList" :key="i.offerId+n" class="flex productItem">
              <a :href="'/productDetail?id='+i.offerId+'&source='+i.source" target="_blank" class="relative">
                <img :src="i.imageUrl" style="width: 150px;height: 150px;border-radius: 6px;" alt="Browsing history" loading="lazy">
              </a>
            </div>
          </div>
        </div>
        <div class="p-2 col-span-1 rounded">
          <div class="text-lg">Keep looking for</div>
          <div class="grid grid-cols-2" style="margin: 20px 0 10px;">
            <div v-for="(i,n) in lookingList" :key="i.offerId+n" class="flex productItem">
              <a :href="'/productDetail?id='+i.offerId+'&source='+i.source" target="_blank" class="relative">
                <img :src="i.imageUrl" style="width: 150px;height: 150px;border-radius: 6px;" alt="Keep looking for" loading="lazy">
              </a>
            </div>
          </div>
        </div>
        <div class="p-2 col-span-1 rounded">
          <div class="text-lg">Frequently searched</div>
          <div class="grid grid-cols-2" style="margin: 20px 0 10px;">
            <div v-for="(i,n) in searchedList" :key="i.offerId+n" class="flex productItem">
              <a :href="'/productDetail?id='+i.offerId+'&source='+i.source" target="_blank" class="relative">
                <img :src="i.imageUrl" style="width: 150px;height: 150px;border-radius: 6px;" alt="Frequently searched" loading="lazy">
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="mb-5 text-3xl text-center">Best-Sellers Section</div>
        <swiper-container
          class="swiper"
          ref="containerRef"
          :slidesPerView="3"
          :spaceBetween="0"
          navigation="true"
          >
          <swiper-slide
            v-for="(i,n) in bestSellersList">
            <div class="px-10">
              <a :href="'/specialArea?id=8&category='+i.id" target="_blank" class="flex items-center rounded-3xl py-2 px-4 cursor-pointer" style="background: #EEF0F1">
                <div class="text-lg text-ellipsis overflow-hidden whitespace-nowrap">{{i.category}}</div>
                <img src="@/assets/images/nav/arrow-right.svg" class="w-4 ml-3" alt="">
              </a>
              <div class="mt-4">
                <swiper-container
                  class="swiper"
                  :slidesPerView="2"
                  :spaceBetween="0"
                  navigation="true"
                  loop="true"
                  :autoplay="{
                    delay: 2500,
                    disableOnInteraction: false,
                  }"
                  >
                  <swiper-slide v-for="(item,index) in i.goods_list">
                    <a :href="'/productDetail?id='+item.offerId+'&source=1'" target="_blank">
                      <img :src="item.productImage.images[0]" style="width:100%;" :alt="item.subjectTrans" loading="lazy">
                    </a>
                  </swiper-slide>
                </swiper-container>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </div>

      <div class="mt-10">
        <div class="pt-5 flex items-center mb-5 relative">
          <div class="text-3xl">Ganzhou Furniture Source Factory · China Furniture Hub</div>
          <a :href="'specialArea?id=6'">
            <div class="absolute bottom-0.5 right-0 text-xl cursor-pointer hover:underline">
              More Products</div>
          </a>
        </div>
        <div class="grid grid-cols-6 gap-3">
          <div class="productItem shadow rounded-md" v-for="(i, n) in zoneList" :key="n">
            <div class="relative">
              <NuxtLink :to="{ path: '/productDetail', query: { id: i.offerId, source: i.source } }" target="_blank" class="relative">
                <img class="max-h-64 h-48 w-full object-cover object-left rounded-t-md" :src="i.imageUrl" :alt="i.subjectTrans" loading="lazy">
              </NuxtLink>
              <div @click="getRelated(i.offerId)" class="cursor-pointer" style="position: absolute;left: 10px;bottom: 10px;padding: 3px;border-radius: 6px;background: #343434ed;">
                <svg t="1759043988270" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11218" width="28" height="28"><path d="M320 149.333333h-76.8q-61.653333 0-70.826667 4.736-12.074667 6.229333-18.304 18.261334Q149.333333 181.44 149.333333 242.56V320a42.666667 42.666667 0 1 1-85.333333 0v-77.44q0-43.178667 1.365333-59.498667 2.538667-29.952 12.949334-50.048 18.730667-36.053333 54.869333-54.762666 20.096-10.368 50.154667-12.885334Q199.744 64 243.2 64H320a42.666667 42.666667 0 1 1 0 85.333333z m460.8 0H704a42.666667 42.666667 0 1 1 0-85.333333h76.8q43.456 0 59.861333 1.365333 30.08 2.517333 50.133334 12.885334 36.16 18.688 54.890666 54.762666 10.410667 20.096 12.949334 50.048 1.365333 16.32 1.365333 59.498667V320a42.666667 42.666667 0 1 1-85.333333 0v-77.44q0-61.12-4.736-70.229333-6.229333-12.032-18.304-18.261334Q842.453333 149.333333 780.8 149.333333z m-105.856 465.28A234.666667 234.666667 0 0 0 725.333333 469.333333c0-129.6-105.066667-234.666667-234.666666-234.666666s-234.666667 105.066667-234.666667 234.666666 105.066667 234.666667 234.666667 234.666667a234.666667 234.666667 0 0 0 120-33.002667l84.48 84.501334a42.666667 42.666667 0 1 0 60.373333-60.330667l-80.554667-80.554667zM490.666667 320a149.333333 149.333333 0 1 1 0 298.666667 149.333333 149.333333 0 0 1 0-298.666667zM243.2 874.666667H320a42.666667 42.666667 0 1 1 0 85.333333h-76.8q-43.456 0-59.861333-1.365333-30.08-2.517333-50.133334-12.906667-36.16-18.666667-54.890666-54.741333-10.410667-20.096-12.949334-50.048Q64 824.64 64 781.44V704a42.666667 42.666667 0 1 1 85.333333 0v77.44q0 61.12 4.736 70.229333 6.229333 12.032 18.304 18.261334 9.173333 4.736 70.826667 4.736zM704 874.666667h76.8q61.653333 0 70.826667-4.736 12.074667-6.229333 18.304-18.261334 4.736-9.109333 4.736-70.229333V704a42.666667 42.666667 0 1 1 85.333333 0v77.44q0 43.178667-1.365333 59.498667-2.538667 29.952-12.949334 50.048-18.730667 36.053333-54.869333 54.741333-20.096 10.389333-50.154667 12.906667Q824.256 960 780.8 960H704a42.666667 42.666667 0 1 1 0-85.333333z" p-id="11219" fill="#FF7700"></path></svg>
              </div>
            </div>
            <div class="bg-white rounded-md" style="padding:12px;">
              <NuxtLink :to="{ path: '/productDetail', query: { id: i.offerId, source: i.source } }" target="_blank">
                <div class="text-sm productTitle">{{i.subjectTrans}}</div>
              </NuxtLink>
              <div class="flex justify-between items-center">
                <p class="py-2 font-semibold text-lg text-red-500">US${{i.usd}}</p>
                <img src="@/assets/images/1688alibaba.svg" style="width:28px;height:28px;" alt="1688 Product" loading="lazy">
              </div>
              <!-- <div class="mb-2 text-xs">Monthly sales: {{i.soldOut}}</div> -->
              <div style="margin-top: 7px;display: flex;justify-content: space-evenly;align-items: center;">
                <div class="chatbtn" @click="chatNows(i)">Chat Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="mb-5 text-3xl text-center">Local Stock Zone</div>
        <div class="text-xl text-center">US & Mexico local inventory for instant fulfillment - no more long shipping times.</div>
        <div class="mt-5 flex justify-center text-xl">
          <a href="/dropshipping" target="_blank" class="flex items-center rounded-3xl py-2 px-4 cursor-pointer mr-10" style="background: #EEF0F1">
            <div>Local inventory in USA</div>
            <img src="@/assets/images/nav/arrow-right.svg" class="w-4 ml-3" alt="">
          </a>
          <a href="/dropshippingMX" target="_blank" class="flex items-center rounded-3xl py-2 px-4 cursor-pointer" style="background: #EEF0F1">
            <div>Local inventory in Mexico</div>
            <img src="@/assets/images/nav/arrow-right.svg" class="w-4 ml-3" alt="">
          </a>
        </div>
        <div class="mt-4 grid grid-cols-4 gap-14">
          <NuxtLink v-for="i in usPro" :to="{ path: '/productDetail', query: { id: i.product_id, source: i.source, code: i.country_code } }" class="relative" target="_blank">
            <img :src="i.main_image" class="rounded-2xl" alt="">
          </NuxtLink>
        </div>
      </div>


      <div class="mt-10">
        <div class="pt-5 hidden sm:flex justify-center items-center mb-5">
          <div class="text-3xl text-center">Recommended Products</div>
        </div>
        <div class="grid grid-cols-6 gap-3">
          <div class="productItem shadow rounded-md" v-for="(i, n) in RecommendList" :key="n">
            <div class="relative">
              <NuxtLink :to="{ path: '/productDetail', query: { id: i.offerId, source: i.source } }" target="_blank" class="relative">
                <img class="max-h-64 h-48 w-full object-cover object-left rounded-t-md" :src="i.imageUrl" :alt="i.subjectTrans" loading="lazy">
                <button class="action-badge add-product" @click.prevent.stop="addProduct(i)">
                  <span class="desc">Add To My Products</span>
                  <i class="icon-product"></i>
                </button>
                <button class="action-badge add-list" @click.prevent.stop="addList(i)">
                  <span class="desc">List</span>
                  <i
                  class="icon-list"></i>
                </button>
              </NuxtLink>
              <div @click="getRelated(i.offerId)" class="cursor-pointer" style="position: absolute;left: 10px;bottom: 10px;padding: 3px;border-radius: 6px;background: #343434ed;">
                <svg t="1759043988270" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11218" width="28" height="28"><path d="M320 149.333333h-76.8q-61.653333 0-70.826667 4.736-12.074667 6.229333-18.304 18.261334Q149.333333 181.44 149.333333 242.56V320a42.666667 42.666667 0 1 1-85.333333 0v-77.44q0-43.178667 1.365333-59.498667 2.538667-29.952 12.949334-50.048 18.730667-36.053333 54.869333-54.762666 20.096-10.368 50.154667-12.885334Q199.744 64 243.2 64H320a42.666667 42.666667 0 1 1 0 85.333333z m460.8 0H704a42.666667 42.666667 0 1 1 0-85.333333h76.8q43.456 0 59.861333 1.365333 30.08 2.517333 50.133334 12.885334 36.16 18.688 54.890666 54.762666 10.410667 20.096 12.949334 50.048 1.365333 16.32 1.365333 59.498667V320a42.666667 42.666667 0 1 1-85.333333 0v-77.44q0-61.12-4.736-70.229333-6.229333-12.032-18.304-18.261334Q842.453333 149.333333 780.8 149.333333z m-105.856 465.28A234.666667 234.666667 0 0 0 725.333333 469.333333c0-129.6-105.066667-234.666667-234.666666-234.666666s-234.666667 105.066667-234.666667 234.666666 105.066667 234.666667 234.666667 234.666667a234.666667 234.666667 0 0 0 120-33.002667l84.48 84.501334a42.666667 42.666667 0 1 0 60.373333-60.330667l-80.554667-80.554667zM490.666667 320a149.333333 149.333333 0 1 1 0 298.666667 149.333333 149.333333 0 0 1 0-298.666667zM243.2 874.666667H320a42.666667 42.666667 0 1 1 0 85.333333h-76.8q-43.456 0-59.861333-1.365333-30.08-2.517333-50.133334-12.906667-36.16-18.666667-54.890666-54.741333-10.410667-20.096-12.949334-50.048Q64 824.64 64 781.44V704a42.666667 42.666667 0 1 1 85.333333 0v77.44q0 61.12 4.736 70.229333 6.229333 12.032 18.304 18.261334 9.173333 4.736 70.826667 4.736zM704 874.666667h76.8q61.653333 0 70.826667-4.736 12.074667-6.229333 18.304-18.261334 4.736-9.109333 4.736-70.229333V704a42.666667 42.666667 0 1 1 85.333333 0v77.44q0 43.178667-1.365333 59.498667-2.538667 29.952-12.949334 50.048-18.730667 36.053333-54.869333 54.741333-20.096 10.389333-50.154667 12.906667Q824.256 960 780.8 960H704a42.666667 42.666667 0 1 1 0-85.333333z" p-id="11219" fill="#FF7700"></path></svg>
              </div>
            </div>
            <div class="bg-white rounded-md" style="padding:12px;">
              <NuxtLink :to="{ path: '/productDetail', query: { id: i.offerId, source: i.source } }" target="_blank">
                <div class="text-sm productTitle">{{i.subjectTrans}}</div>
              </NuxtLink>
              <div class="flex justify-between items-center">
                <p class="py-2 font-semibold text-lg text-red-500">US${{i.usd}}</p>
                <img src="@/assets/images/1688alibaba.svg" style="width:28px;height:28px;" alt="1688 Product" loading="lazy">
              </div>
              <div class="mb-2 text-xs">Monthly sales: {{i.monthSold}}</div>
              <div style="margin-top: 7px;display: flex;justify-content: space-evenly;align-items: center;">
                <div class="chatbtn" @click="chatNows(i)">Chat Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <ChatMini /> -->
    <BackTop />
    <ShippingCouponPopup v-if="newUserShippingCouponActivityEnabled" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, onMounted, onUnmounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { getRate, getProductSearchOfferRecommendHandle, getSpecialList, getCategory, getHistoricalRecordRecommendations, getProductRelatedRecommend, addShopList, getCountry, getDefault, getGoodsSpecialAreaCategoryList } from '~/services/api'
import { isNewUserShippingCouponActivityEnabled } from '~/features/新用户物流现金券活动/config'
definePageMeta({ layout: 'homenew' })

const ShippingCouponPopup = defineAsyncComponent(() => (
  import('~/features/新用户物流现金券活动/ShippingCouponPopup.vue')
))
const runtimeConfig = useRuntimeConfig()
const newUserShippingCouponActivityEnabled = computed(() => (
  isNewUserShippingCouponActivityEnabled(
    runtimeConfig.public.newUserShippingCouponEnabled
  )
))
const route = useRoute()
const router = useRouter()
const cateList = ref([])
const catetree = ref([])
const RecommendList = ref([])
const zoneDeal = ref([])
const zoneRank = ref([])
const zoneArrival = ref([])
const zoneList = ref([])
const rate = ref(1)
const page = ref(1)
const isPage = ref(false)
const showCatePanels = ref(false)
const isLoading = ref(false)
const historyList = ref([])
const lookingList = ref([])
const searchedList = ref([])
const relatedList = ref([])
const dataLoading = ref(false)
const showRelated = ref(false)
const alibabaIcon = new URL('@/assets/images/1688alibaba.svg', import.meta.url).href
const actionRegion = ref('')
const chatText = inject('chatProduct')
const usPro = ref([])
const bestSellersList = ref([])

function divide(num1, num2){
  const result = (num1 * 100) / (num2 * 100)
  if (Math.round(result * 100) / 100 > 0) return Math.round(result * 100) / 100
  return 0.01
}

function getCates(item){
  catetree.value = item
}

async function fetchAll(){
  const cats = await getCategory({})
  cateList.value = cats.data.data
  const params = route.query
  if(params.ref){
    // localStorage.setItem('invitation_code', params.ref);
    localStorage.setItem('invitation_codes', params.ref);
  }
  const rez = await getRate()
  rate.value = rez.data.data.exchange_rate
  
  const historyRes = await getHistoricalRecordRecommendations({
    type: 2,
  })
  let list = historyRes.data.data.data
  for(let i=0;i<list.length;i++){
    let price = 0
    if (list[i].priceInfo.price) {
      price = divide(list[i].priceInfo.price, rate.value)
    } else if (list[i].priceInfo.jxhyPrice) {
      price = divide(list[i].priceInfo.jxhyPrice, rate.value)
    } else {
      price = divide(list[i].priceInfo.consignPrice, rate.value)
    }
    list[i].usd = price
  }
  historyList.value = list.slice(0, 2)
  lookingList.value = list.slice(2, 4)
  searchedList.value = list.slice(4, 6)

  // const deal = await getSpecialList({ class_id: 1, pageIndex: 1, pageCount: 7, keyword: '', categoryId: 97 })
  // const dlist = deal.data.data.list
  // dlist.forEach(it=>{ it.usd = divide(parseFloat(it.priceInfo.price), rate.value) })
  // zoneDeal.value = dlist
  // const rank = await getSpecialList({ class_id: 1, pageIndex: 1, pageCount: 3, keyword: '', categoryId: 201547801 })
  // const rkl = rank.data.data.list
  // rkl.forEach(it=>{ it.usd = divide(parseFloat(it.priceInfo.price), rate.value) })
  // zoneRank.value = rkl
  // const arr = await getSpecialList({ class_id: 1, pageIndex: 1, pageCount: 3, keyword: '', categoryId: 15 })
  // const arl = arr.data.data.list
  // arl.forEach(it=>{ it.usd = divide(parseFloat(it.priceInfo.price), rate.value) })
  // zoneArrival.value = arl

  const arrSpecial = await getGoodsSpecialAreaCategoryList({ class_id: 8 })
  bestSellersList.value = arrSpecial.data.data

  const arr = await getSpecialList({ class_id: 6, pageIndex: 1, pageCount: 6, keyword: '', categoryId: '' })
  const arl = arr.data.data.list
  arl.forEach(it=>{ it.usd = divide(parseFloat(it.priceInfo.price), rate.value) })
  zoneList.value = arl

  const usres = await getProductSearchOfferRecommendHandle({ type: 1, pageIndex: 1, pageCount: 2 })
  const usList = Array.isArray(usres?.data?.data?.data) ? usres.data.data.data : []
  const mxres = await getProductSearchOfferRecommendHandle({ type: 1, pageIndex: 1, pageCount: 2, ship_from: 'MX', })
  const mxList = Array.isArray(mxres?.data?.data?.data) ? mxres.data.data.data : []
  usPro.value = [...usList, ...mxList]

  const rec = await getProductSearchOfferRecommendHandle({ type: 2, pageIndex: 1, pageCount: 12 })
  const rlist = rec.data.data
  for(let i=0;i<rlist.length;i++){
    let price = 0
    if (rlist[i].priceInfo.price) price = divide(rlist[i].priceInfo.price, rate.value)
    else if (rlist[i].priceInfo.jxhyPrice) price = divide(rlist[i].priceInfo.jxhyPrice, rate.value)
    else price = divide(rlist[i].priceInfo.consignPrice, rate.value)
    rlist[i].usd = price
  }
  RecommendList.value = rlist
  isPage.value = true
}

async function getPages(){
  if (isLoading.value || !isPage.value) return
  isLoading.value = true
  page.value++
  try {
    const res = await getProductSearchOfferRecommendHandle({
      type: 2,
      pageIndex: page.value,
      pageCount: 12
    })
    let list = res.data.data
    if (list.length === 0) {
      isPage.value = false
      return
    }
    for(let i=0;i<list.length;i++){
      let price = 0
      if (list[i].priceInfo.price) {
        price = divide(list[i].priceInfo.price, rate.value)
      } else if (list[i].priceInfo.jxhyPrice) {
        price = divide(list[i].priceInfo.jxhyPrice, rate.value)
      } else {
        price = divide(list[i].priceInfo.consignPrice, rate.value)
      }
      list[i].usd = price
    }
    RecommendList.value = [...RecommendList.value, ...list]
  } catch (error) {
    console.error('加载失败:', error)
    page.value--
  } finally {
    isLoading.value = false
  }
}

function handleScroll(){
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // 当滚动到距离底部100px时触发加载
  if (documentHeight - scrollTop < 1500 && page.value < 5) {
    getPages()
  }
}

function toSearch(name, id){
  // router.push({ path: '/searchResult', query: { keyword: name, categoryId: id } })
  const routeUrl = router.resolve({ path: '/searchResult', query: { keyword: name, categoryId: id } })
  window.open(routeUrl.href, '_blank');
}

function getRelated(id){
  dataLoading.value = true
  getProductRelatedRecommend({
    offerId: id,
    pageIndex: 1,
    pageCount: 10,
    type: 2
  }).then((res)=>{
    let list = res.data.data
    list.forEach((item)=>{
      item.usd = divide(item.priceInfo.price, rate.value)
    })
    relatedList.value = list
    showRelated.value = true
    dataLoading.value = false
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

function chatNow(item) {
  if (!process.client) return
  const userInfo = window.localStorage.getItem('userInfo')
  let chatInfo
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
    link: `https://cosourcings.com/productDetail?id=${item.offerId}&source=${item.source}`
  }
  const text = `Customer: ${username} | Source: ${msg.page} | Product: ${msg.product} | Link: ${msg.link} `
  window.open(`https://api.whatsapp.com/send?phone=${chatInfo.whatsappp}&text=${encodeURIComponent(text)}`, '_blank')
}

function addList(item) {
  if (process.client) {
    const url = `/admin/account/Publish?id=${item.offerId}&source=${item.source}`
    window.open(url, '_blank')
  }
}

function addProduct(item) {
  if (process.client) {
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

function coLogin() {
  let cookieArr = document.cookie.split(";");
  for(let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if(cookiePair[0].indexOf('userInfo')!=-1) {
      localStorage.setItem('userInfo', cookiePair[1])
    }
    if(cookiePair[0].indexOf('customer_manage')!=-1) {
      localStorage.setItem('customer_manage', cookiePair[1])
    }
    if(cookiePair[0].indexOf('TOKEN')!=-1) {
      localStorage.setItem('TOKEN', cookiePair[1])
    }
  }
}

onMounted(() => {
  // if(!JSON.parse(localStorage.getItem('userInfo'))){
  //   coLogin()
  // }
  fetchAll()
  initData()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>


<style scoped>
.productTitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 2.5rem;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-decoration-line: underline;
}

.container{
  column-width: 254px;
  column-gap: 5px;
  column-count: 3;
}

.container>div{
  break-inside: avoid-column;
}

.co-cate{
  padding: 4px 0;
  border-bottom: 1px solid #FF7634;
}

.co-cate:hover{
  color: #FF7634;
}

.co-cates:hover{
  color: #FF7634;
}

::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-track {
  border-radius: 6px;
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

.productItem {
  width: 200px;
  margin: 0 auto;
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

.icon-product, .icon-list{
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

.icon-list::before{
  content: '';
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  display: block;
  background: url('@/assets/images/addList.png') center center no-repeat;
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

.swiper{
  --swiper-navigation-color: #777f91;
  --swiper-navigation-size: 30px;
}
</style>
