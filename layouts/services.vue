<template>
  <div>
    <div class="py-2 text-white" style="background: #F4F4F2;">
      <div class="mx-auto flex w-full max-w-[1300px] justify-between px-2.5">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-white">
            <img src="@/assets/images/co logo.png" style="height: 46px;" alt="CoDropshipping">
          </a>
        </div>
        <div class="shrink-0 flex justify-end items-center text-black">
          <!-- <div @mouseenter="showServices = true" @mouseleave="showServices = false" class="mx-4 relative">
            <img src="@/assets/images/nav/service.svg" class="mx-4 w-6 h-6 cursor-pointer" alt="">
            <div v-show="showServices" class="absolute top-6 z-10 text-center bg-white border shadow text-sm shadow-md" style="width: 220px;left: -80px;">
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
          <a href="/admin/account/storeOrder" target="_blank" class="mx-4"><svg t="1756448016848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12800" width="24" height="24"><path d="M859.919059 80.112941h-136.011294A103.424 103.424 0 0 0 625.121882 7.469176H415.442824c-46.441412 0-85.775059 30.599529-98.785883 72.764236h-137.938823C138.119529 80.112941 105.411765 112.880941 105.411765 153.419294v744.508235c0 40.478118 32.768 73.246118 73.246117 73.246118h681.140706c40.538353 0 73.306353-32.768 73.306353-73.246118V153.419294a73.185882 73.185882 0 0 0-73.185882-73.246118zM520.252235 719.088941c0 18.974118-15.420235 34.334118-34.334117 34.334118H314.548706a34.394353 34.394353 0 0 1 0-68.668235h171.369412c18.913882 0 34.334118 15.36 34.334117 34.334117z m241.844706-191.668706c0 18.913882-15.420235 34.334118-34.394353 34.334118H312.862118a34.394353 34.394353 0 0 1 0-68.728471h414.960941a34.334118 34.334118 0 0 1 34.273882 34.334118z m0-191.728941c0 18.974118-15.420235 34.334118-34.394353 34.334118H312.862118a34.394353 34.394353 0 0 1 0-68.668236h414.960941a34.334118 34.334118 0 0 1 34.273882 34.334118z" p-id="12801" fill="#F5A100"></path></svg></a>
          <a href="/admin/account/ProductList" target="_blank" class="mx-4">
            <svg t="1776324128295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="49491" width="24" height="24"><path d="M384 256a128 128 0 1 1 256 0H384zM298.666667 256H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v597.333333a42.666667 42.666667 0 0 0 42.666667 42.666667h682.666666a42.666667 42.666667 0 0 0 42.666667-42.666667V298.666667a42.666667 42.666667 0 0 0-42.666667-42.666667h-128A213.333333 213.333333 0 0 0 298.666667 256z m85.333333 170.666667a128 128 0 1 0 256 0h85.333333a213.333333 213.333333 0 0 1-426.666666 0h85.333333z" fill="#F5A100" p-id="49492"></path></svg>
          </a>
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

    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '#app'
import { parsePromotionText, getKeywordRecommendation, getImgId, getEcoBuyerItemAdd } from '~/services/api'

useHead({ link: [
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
  { rel: 'manifest', href: '/site.webmanifest' }
] })

const text = ref('')
const keywordList = ref([])
const keywordShow = ref(false)
const searchInput = ref(null)
const isLogin = ref(false)
const fileInput = ref(null)
const searchType = ref(1)
const coimgRef = ref('')
const cousernameRef = ref('')
const showServices = ref(false)

function navImg() { fileInput.value?.click() }

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

function getLoginInfo() {
  const cache = localStorage.getItem('userInfo')
  let userInfo = null
  if (cache) {
    try {
      userInfo = JSON.parse(cache)
    } catch (err) {
      console.warn('Invalid userInfo cache, clearing', err)
      localStorage.removeItem('userInfo')
    }
  }
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

function focusInput(el){
  el.focus();
}

onMounted(() => {
  // 获取当前页面路由
  const route = useRoute()
  if(route.query.keyword){
    text.value = route.query.keyword
  }
  // if (route.path.includes('dropshipping')) { searchType.value = 2; holders.value = 'Please enter the product keywords' } else { searchType.value = 1; holders.value = 'Please enter the product keywords / link' }
  // queryHistory({}).then(res => { searchWords.value = res.data.data.list || [] })
  // document.addEventListener('click', clickOutside, true)
  // window.addEventListener('scroll', handleScroll)
  getLoginInfo()
})


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
function clickOutside(e) { const s1 = searchInput.value; const inside = s1 && s1.contains(e.target); keywordShow.value = inside }

onMounted(() => { document.addEventListener('click', clickOutside, true) })
onUnmounted(() => { document.removeEventListener('click', clickOutside, true) })
</script>

<style scoped>
.cmh::-webkit-scrollbar { width: 6px }
.cmh::-webkit-scrollbar-thumb { border-radius: 2px; box-shadow: inset 0 0 5px rgba(0,0,0,0.2); background: rgba(0,0,0,0.2) }
.cmh::-webkit-scrollbar-track { background: #fff; border-radius: 6px }

.serviceItem{
  padding: 8px 10px;
}

.serviceItem:hover{
  color: #fff;
  background: #F5A100;
}
</style>
