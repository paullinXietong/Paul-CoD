<template>
  <div>
    <div style="background: #F4F4F2;">
      <div class="mx-auto w-full max-w-[1300px] px-2.5 relative">
        <div class="relative">
          <div class="py-3 flex justify-between">
            <!-- <div class="text-[22px] font-semibold italic select-none">CoDropshipping</div> -->
            <img src="@/assets/images/co logo.png" style="height: 46px;" alt="CoDropshipping">
            <div class="shrink-0 flex items-center">
              <!-- <div @mouseenter="showServices = true" @mouseleave="showServices = false" class="mx-4 relative">
                <img src="@/assets/images/nav/service.svg" class="w-6 cursor-pointer" alt="">
                <div v-show="showServices" class="absolute top-6 z-10 text-center bg-white shadow text-sm shadow-md" style="width: 220px;left: -80px;">
                  <a href="/about" target="_blank">
                    <div class="serviceItem">About Cosourcings</div>
                  </a>
                  <a href="/customization" target="_blank">
                    <div class="serviceItem">Custom Sourcing on Demand</div>
                  </a>
                  <a href="/warehousing" target="_blank">
                    <div class="serviceItem">CN Warehouse</div>
                  </a>
                </div>
              </div> -->
              <a href="/admin/account/orderList" target="_blank" class="mx-4">
                <svg t="1756448016848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12800" width="24" height="24"><path d="M859.919059 80.112941h-136.011294A103.424 103.424 0 0 0 625.121882 7.469176H415.442824c-46.441412 0-85.775059 30.599529-98.785883 72.764236h-137.938823C138.119529 80.112941 105.411765 112.880941 105.411765 153.419294v744.508235c0 40.478118 32.768 73.246118 73.246117 73.246118h681.140706c40.538353 0 73.306353-32.768 73.306353-73.246118V153.419294a73.185882 73.185882 0 0 0-73.185882-73.246118zM520.252235 719.088941c0 18.974118-15.420235 34.334118-34.334117 34.334118H314.548706a34.394353 34.394353 0 0 1 0-68.668235h171.369412c18.913882 0 34.334118 15.36 34.334117 34.334117z m241.844706-191.668706c0 18.913882-15.420235 34.334118-34.394353 34.334118H312.862118a34.394353 34.394353 0 0 1 0-68.728471h414.960941a34.334118 34.334118 0 0 1 34.273882 34.334118z m0-191.728941c0 18.974118-15.420235 34.334118-34.394353 34.334118H312.862118a34.394353 34.394353 0 0 1 0-68.668236h414.960941a34.334118 34.334118 0 0 1 34.273882 34.334118z" p-id="12801" fill="#F5A100"></path></svg>
              </a>
              <a href="/admin/account/cart" target="_blank" class="mx-4">
                <svg t="1756448136215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17077" width="24" height="24"><path d="M346.112 806.912q19.456 0 36.864 7.168t30.208 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.208 20.48-36.864 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 37.888-7.168zM772.096 808.96q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM944.128 227.328q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-13.312 37.888-22.016 62.976-23.552 68.096-18.944 53.248q-13.312 40.96-33.28 56.832t-49.664 15.872l-35.84 0-65.536 0-86.016 0-96.256 0-253.952 0 14.336 92.16 517.12 0q49.152 0 49.152 41.984 0 20.48-9.728 35.328t-38.4 14.848l-49.152 0-94.208 0-118.784 0-119.808 0-99.328 0-55.296 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-13.312l21.504 0 21.504 0 25.6 0 34.816 0q20.48 0 32.768 6.144t19.456 15.36 10.24 19.456 5.12 17.408q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0zM867.328 194.56l-374.784 0 135.168-135.168q23.552-23.552 51.712-24.064t51.712 23.04z" fill="#F5A100" p-id="17078"></path></svg>
              </a>
              <a v-if="isLogin" href="/admin/main/dashboard" target="_blank" class="shrink-0">
                <div class="shrink-0 flex items-center text-base">
                  <img :src="coimgRef" class="coimg w-10 h-10 mx-3 rounded-full" alt="Avatar">
                  <div>{{cousernameRef}}</div>
                </div>
              </a>
              <a v-else href="/admin/login" class="ml-3 flex-shrink-0 text-sm flex">
                <svg t="1756450582592" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22913" width="24" height="24"><path d="M723.43 508.6c-54.123 47.75-125.977 77.056-205.163 77.056-80.364 0-153.4-30.259-207.765-79.421C184.05 539.325 105.81 652.308 105.81 787.277v68.782c0 160.968 812.39 160.968 812.39 0v-68.782c-0.005-131.415-74.22-242.509-194.77-278.677z m-205.163 28.13c140.165 0 254.095-109.44 254.095-244.64S658.668 47.218 518.267 47.218c-139.93 0-253.855 109.675-253.855 244.874 0 135.204 113.925 244.639 253.855 244.639z m0 0" p-id="22914" fill="#F5A100"></path></svg>
                Sign in
              </a>
            </div>
          </div>

          <div class="w-full px-3 py-4 text-sm">
            <div class="my-12">
              <h1 class="font-semibold text-center text-2xl sm:h-8 sm:text-[42px]">1688 Sourcing • Factory Direct • Low Cost</h1>
            </div>
            <div class="mx-auto max-w-screen-md w-full bg-white px-6 py-3 flex rounded-full border-4 border-black relative">
              <div class="w-full flex items-center">
                <input @input="searchWord" @keyup.enter="search" ref="searchInput" id="navInput" class="w-full px-2 py-2 h-8 outline-none rounded-lg text-black" v-model="text" type="text" :placeholder="holders">
                <input type="file" ref="iptFileRef" @change="uploadFiles" accept="image/jpeg,image/png,image/jpg" class="hidden">
                <img @click="focusInput(searchInput)" ref="imgRef" src="@/assets/images/1688alibaba.svg" style="width: 36px;height: 36px;margin-right: 15px;" alt="1688">
                <svg @click="navImg" t="1761114037550" class="icon shrink-0 mr-3 cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14014" width="38" height="38"><path d="M341.333333 85.333333l341.333333 0 85.333333 128 128 0q52.992 0 90.496 38.186667t37.504 91.178667l0 468.650667q0 52.992-37.504 90.154667t-90.496 37.162667l-768 0q-52.992 0-90.496-37.504t-37.504-90.496l0-468.650667q0-52.992 37.504-90.837333t90.496-37.845333l128 0zM512 341.333333q43.349333 0 82.816 16.981333t68.010667 45.482667 45.482667 68.010667 16.981333 82.816-16.981333 82.816-45.482667 68.010667-68.010667 45.482667-82.816 16.981333-82.816-16.981333-68.010667-45.482667-45.482667-68.010667-16.981333-82.816 16.981333-82.816 45.482667-68.010667 68.010667-45.482667 82.816-16.981333zM512 426.666667q-52.992 0-90.496 37.504t-37.504 90.496 37.504 90.496 90.496 37.504 90.496-37.504 37.504-90.496-37.504-90.496-90.496-37.504zM722.346667 298.666667l-83.669333-128-251.648 0-85.333333 128-173.653333 0q-17.664 0-30.165333 12.672t-12.501333 30.677333l0 468.650667q0 17.664 12.501333 30.165333t30.165333 12.501333l768 0q18.005333 0 30.336-12.16t12.330667-29.824l0-468.650667q0-18.005333-12.672-31.018667t-29.994667-13.013333l-173.653333 0z" p-id="14015" fill="#707070"></path></svg>
                <div @click="search" class="px-4 h-8 flex justify-center items-center font-semibold cursor-pointer border-2 border-black rounded-full"
                  style="background: #F4F4F2;">Search</div>
              </div>
              <div v-show="keywordList.length>0 && keywordShow" class="absolute left-0 right-0 top-[65px] z-40 bg-white text-black rounded-lg p-3 shadow">
                <div v-for="(i,n) in keywordList" :key="i+n" @click="toSearch(i)" class="p-2 cursor-pointer">{{ i }}</div>
              </div>
            </div>
            <div class="mt-4 flex justify-center">
              <div class="mr-3">Frequently searched:</div>
              <div class="flex flex-wrap">
                <div v-for="(i,n) in searchWords" :key="n" @click="toSearch(i)" class="mr-3 mb-2 underline cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap" style="max-width: 180px;">{{ i }}</div>
              </div>
            </div>

          </div>
        </div>

        <!-- <img src="@/assets/images/bg.png" class="absolute bottom-0 right-0 z-0 object-cover object-left-top select-none" style="border-radius: 8px;" alt=""> -->
      </div>

      <div v-show="searchTop" class="fixed top-0 left-0 w-full flex justify-center py-2 text-sm shadow" style="z-index: 40;background: #F4F4F2;">
        <div class="flex w-full max-w-[1300px] px-2.5">
          <div class="flex-shrink-0 flex items-center">
            <!-- <div class="text-[22px] font-semibold italic select-none">CoDropshipping</div> -->
            <!-- <img src="@/assets/images/co logos.png" style="height: 54px;" alt="CoDropshipping" loading="lazy"> -->
          </div>
          <div class="w-full flex justify-center">
            <div class="w-full max-w-screen-sm bg-white p-2 flex rounded-full border-4 border-black relative">
              <div class="w-full flex items-center">
              <input @input="searchWord" @keyup.enter="search" ref="searchInputs" id="stickyNavInput" class="w-full px-2 py-2 h-8 outline-none rounded-lg text-black" v-model="text" type="text" :placeholder="holders">
              <img @click="focusInput(searchInput)" ref="imgRef" src="@/assets/images/1688alibaba.svg" style="width: 36px;height: 36px;margin-right: 15px;" alt="1688">
              <svg @click="navImg" t="1761114037550" class="icon shrink-0 mr-3 cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14014" width="38" height="38"><path d="M341.333333 85.333333l341.333333 0 85.333333 128 128 0q52.992 0 90.496 38.186667t37.504 91.178667l0 468.650667q0 52.992-37.504 90.154667t-90.496 37.162667l-768 0q-52.992 0-90.496-37.504t-37.504-90.496l0-468.650667q0-52.992 37.504-90.837333t90.496-37.845333l128 0zM512 341.333333q43.349333 0 82.816 16.981333t68.010667 45.482667 45.482667 68.010667 16.981333 82.816-16.981333 82.816-45.482667 68.010667-68.010667 45.482667-82.816 16.981333-82.816-16.981333-68.010667-45.482667-45.482667-68.010667-16.981333-82.816 16.981333-82.816 45.482667-68.010667 68.010667-45.482667 82.816-16.981333zM512 426.666667q-52.992 0-90.496 37.504t-37.504 90.496 37.504 90.496 90.496 37.504 90.496-37.504 37.504-90.496-37.504-90.496-90.496-37.504zM722.346667 298.666667l-83.669333-128-251.648 0-85.333333 128-173.653333 0q-17.664 0-30.165333 12.672t-12.501333 30.677333l0 468.650667q0 17.664 12.501333 30.165333t30.165333 12.501333l768 0q18.005333 0 30.336-12.16t12.330667-29.824l0-468.650667q0-18.005333-12.672-31.018667t-29.994667-13.013333l-173.653333 0z" p-id="14015" fill="#707070"></path></svg>
              <div @click="search" class="px-4 h-8 flex justify-center items-center font-semibold cursor-pointer border-2 border-black rounded-full"
                style="background: #F4F4F2;">Search</div>
            </div>
              <div v-show="keywordList.length>0 && keywordShow" class="absolute left-0 right-0 top-[49px] z-40 bg-white text-black rounded-lg p-3 shadow">
                <div v-for="(i,n) in keywordList" :key="i+n" @click="toSearch(i)" class="p-2 cursor-pointer">{{ i }}</div>
              </div>
            </div>
          </div>
          <div class="shrink-0 flex justify-end items-center">
            <!-- <div @mouseenter="showServices = true" @mouseleave="showServices = false" class="mx-4 relative">
              <img src="@/assets/images/nav/service.svg" class="w-6 h-6 cursor-pointer" alt="">
              <div v-show="showServices" class="absolute top-6 z-10 text-center bg-white shadow text-sm shadow-md" style="width: 220px;left: -80px;">
                <a href="/about" target="_blank">
                  <div class="serviceItem">About Cosourcings</div>
                </a>
                <a href="/customization" target="_blank">
                  <div class="serviceItem">Custom Sourcing on Demand</div>
                </a>
                <a href="/warehousing" target="_blank">
                  <div class="serviceItem">CN Warehouse</div>
                </a>
              </div>
            </div> -->
            <a href="/admin/account/orderList" target="_blank" class="mx-4"><svg t="1756448016848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12800" width="24" height="24"><path d="M859.919059 80.112941h-136.011294A103.424 103.424 0 0 0 625.121882 7.469176H415.442824c-46.441412 0-85.775059 30.599529-98.785883 72.764236h-137.938823C138.119529 80.112941 105.411765 112.880941 105.411765 153.419294v744.508235c0 40.478118 32.768 73.246118 73.246117 73.246118h681.140706c40.538353 0 73.306353-32.768 73.306353-73.246118V153.419294a73.185882 73.185882 0 0 0-73.185882-73.246118zM520.252235 719.088941c0 18.974118-15.420235 34.334118-34.334117 34.334118H314.548706a34.394353 34.394353 0 0 1 0-68.668235h171.369412c18.913882 0 34.334118 15.36 34.334117 34.334117z m241.844706-191.668706c0 18.913882-15.420235 34.334118-34.394353 34.334118H312.862118a34.394353 34.394353 0 0 1 0-68.728471h414.960941a34.334118 34.334118 0 0 1 34.273882 34.334118z m0-191.728941c0 18.974118-15.420235 34.334118-34.394353 34.334118H312.862118a34.394353 34.394353 0 0 1 0-68.668236h414.960941a34.334118 34.334118 0 0 1 34.273882 34.334118z" p-id="12801" fill="#F5A100"></path></svg></a>
            <a href="/admin/account/cart" target="_blank" class="mx-4"><svg t="1756448136215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17077" width="24" height="24"><path d="M346.112 806.912q19.456 0 36.864 7.168t30.208 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.208 20.48-36.864 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 37.888-7.168zM772.096 808.96q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM944.128 227.328q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-13.312 37.888-22.016 62.976-23.552 68.096-18.944 53.248q-13.312 40.96-33.28 56.832t-49.664 15.872l-35.84 0-65.536 0-86.016 0-96.256 0-253.952 0 14.336 92.16 517.12 0q49.152 0 49.152 41.984 0 20.48-9.728 35.328t-38.4 14.848l-49.152 0-94.208 0-118.784 0-119.808 0-99.328 0-55.296 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-13.312l21.504 0 21.504 0 25.6 0 34.816 0q20.48 0 32.768 6.144t19.456 15.36 10.24 19.456 5.12 17.408q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0zM867.328 194.56l-374.784 0 135.168-135.168q23.552-23.552 51.712-24.064t51.712 23.04z" fill="#F5A100" p-id="17078"></path></svg></a>
            <a v-if="isLogin" href="/admin/main/dashboard" target="_blank" class="shrink-0">
              <div class="shrink-0 flex items-center text-base">
                <img :src="coimgRef" class="coimg w-10 h-10 mx-3 rounded-full" alt="Avatar" loading="lazy">
                <div>{{cousernameRef}}</div>
              </div>
            </a>
            <a v-else href="/admin/login" class="shrink-0 flex ml-3 text-sm">
              <svg t="1756450582592" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22913" width="24" height="24"><path d="M723.43 508.6c-54.123 47.75-125.977 77.056-205.163 77.056-80.364 0-153.4-30.259-207.765-79.421C184.05 539.325 105.81 652.308 105.81 787.277v68.782c0 160.968 812.39 160.968 812.39 0v-68.782c-0.005-131.415-74.22-242.509-194.77-278.677z m-205.163 28.13c140.165 0 254.095-109.44 254.095-244.64S658.668 47.218 518.267 47.218c-139.93 0-253.855 109.675-253.855 244.874 0 135.204 113.925 244.639 253.855 244.639z m0 0" p-id="22914" fill="#F5A100"></path></svg>
              Sign in</a>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '#app'
import { getImgId, getEcoBuyerItemAdd, parsePromotionText, queryHistory, getKeywordRecommendation, getTourists } from '~/services/api'

useHead({ link: [
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
  { rel: 'manifest', href: '/site.webmanifest' }
] })

const route = useRoute()
const searchType = ref(1)
const searchWords = ref([])
const text = ref('')
const keywordList = ref([])
const keywordShow = ref(false)
const searchTop = ref(false)
const holders = ref('Please enter the product keywords / link')
const searchInput = ref(null)
const searchInputs = ref(null)
const iptFileRef = ref(null)
const isLogin = ref(false)
const coimgRef = ref('')
const cousernameRef = ref('')
const imgRef = ref(null)
const imgRef1 = ref(null)
// const holders = 'Please enter the product keywords / link'
const chatOpen = inject('chatModal')
const showServices = ref(false)

function focusInput(el){
  el.focus();
}
function toSearch(word) { text.value = word; search() }
async function search() {
  const destination = await resolveSearchDestination(text.value, (keyword) => (
    searchType.value === 1
      ? `/searchResult?keyword=${encodeURIComponent(keyword)}`
      : `/specialAreas?keyword=${encodeURIComponent(keyword)}`
  ))
  if (!destination) return
  keywordShow.value = false
  window.open(destination.url, destination.target)
}
const searchWord = useKeywordSuggestions(text, keywordList, keywordShow)
function homeType(type) { if (type === 1) { searchType.value = 1; holders.value = 'Please enter the product keywords / link' } else if (type === 2) { 
  // 跳转到 dropshipping
  window.open('/dropshipping', '_self')
 } else {
  window.open('/dropshippingMX', '_self')
 } }
function navImg() { iptFileRef.value?.click() }

function uploadFiles(e) { const data = new FormData(); data.append('file', e.target.files[0]); 
  if (searchType.value === 1) { 
      getImgId(data).then(res => { window.localStorage.setItem('SearchImg', res.data.data.img); 
      window.open(`/searchResult?imageId=${res.data.data.imageId}&imageIdList=${res.data.data.img}`, '_self') }
    ) 
  } 
  else { 
    getEcoBuyerItemAdd(data).then(res => { 
      window.localStorage.setItem('aliSearchImg', res.data.data.image); 
      window.open(`/searchResultAli?imageId=${res.data.data.item_id}&imageIdList=${res.data.data.image}`, '_self') }) 
    } 
}

function clickOutside(e) {
  const s1 = searchInput.value, s2 = searchInputs.value
  const inside = (s1 && s1.contains(e.target)) || (s2 && s2.contains(e.target))
  keywordShow.value = inside
}
function handleScroll() { searchTop.value = (document.documentElement.scrollTop || document.body.scrollTop || 0) > 290 }

function getLoginInfo() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if(userInfo){
    let dt = new Date()
    var head_portrait = userInfo.img + userInfo.id + '_40_40.png?v=' + dt.getTime()
    coimgRef.value = head_portrait
    cousernameRef.value = userInfo.first_name + ' ' + userInfo.last_name
    isLogin.value = true
  }else{
    if(localStorage.getItem('Touriststoken')){
      
    }else{
      const uap = new UAParser();
      const ua = uap.getResult()
      let ruleForm = {}
      ruleForm.browser = ua.browser.name
      ruleForm.sys = ua.os.name + ua.os.version
      ruleForm.agent = ua.ua
      ruleForm.machine = window.screen.width + '*' + window.screen.height
      ruleForm.language = window.navigator.language
      getTourists(ruleForm).then((req)=>{
        window.localStorage.setItem('Touriststoken', req.data.data.token)
      })
    }
  }
}

onMounted(() => {
  if (route.path.includes('dropshipping')) { searchType.value = 2; holders.value = 'Please enter the product keywords' } else { searchType.value = 1; holders.value = 'Please enter the product keywords / link' }
  queryHistory({}).then(res => { searchWords.value = res.data.data.list || [] })
  document.addEventListener('click', clickOutside, true)
  window.addEventListener('scroll', handleScroll)
  getLoginInfo()
})

onUnmounted(() => {
  document.removeEventListener('click', clickOutside, true)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.cmh::-webkit-scrollbar { width: 6px }
.cmh::-webkit-scrollbar-thumb { border-radius: 2px; box-shadow: inset 0 0 5px rgba(0,0,0,0.2); background: rgba(0,0,0,0.2) }
.cmh::-webkit-scrollbar-track { background: #fff; border-radius: 6px }

/* .homebg{
  background: url('@/assets/images/homebg.png') left bottom no-repeat;
  background-size: cover;
} */

.co-type{
  color: #FF7634;
  background: #fff;
}

.co-type:hover{
  color: #fff;
  background: linear-gradient(180deg, #FDAE13 0%, #FF2700 100%);
}

.serviceItem{
  padding: 8px 10px;
}

.serviceItem:hover{
  color: #fff;
  background: #F5A100;
}
</style>
