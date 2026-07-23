<template>
  <header class="sticky top-0 z-30 bg-white shadow">
    <div class="mx-auto max-w-screen-xl flex items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="flex items-center">
        <img src="@/assets/images/logo.png" alt="logo" class="h-8 w-auto" />
        <span class="ml-2 font-semibold">Codropshipping</span>
      </NuxtLink>
      <div class="flex items-center space-x-2 relative">
        <input id="navInput" ref="searchInput" v-model="text" type="text" placeholder="Please enter the product keywords / link" class="border rounded px-3 py-1 w-80" @input="searchWord" @keyup.enter="search" />
        <button class="px-3 py-1 rounded text-white" style="background:#102D62" @click="search">Search</button>
        <div v-show="keywordList.length>0 && keywordShow" class="absolute top-9 left-0 w-80 bg-white border rounded shadow z-50">
          <div v-for="(i,n) in keywordList" :key="i+n" @click="toSearch(i)" class="px-3 py-2 cursor-pointer hover:bg-gray-100">{{ i }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getKeywordRecommendation, parsePromotionText } from '~/services/api'
const router = useRouter()
const text = ref('')
const keywordList = ref([])
const keywordShow = ref(false)
const searchInput = ref(null)

function even(e){ if(!searchInput.value?.contains(e.target)){ keywordShow.value = false } else { keywordShow.value = true } }
onMounted(()=>{ document.addEventListener('click', even, true) })
onBeforeUnmount(()=>{ document.removeEventListener('click', even, true) })

const searchWord = useKeywordSuggestions(text, keywordList, keywordShow)
function toSearch(word){ text.value = word; search() }
async function search(){
  const destination = await resolveSearchDestination(
    text.value,
    (keyword) => `/searchResult?keyword=${encodeURIComponent(keyword)}`
  )
  if (!destination) return
  keywordShow.value = false
  if (destination.target === '_blank') window.open(destination.url, '_blank')
  else router.push(destination.url)
}
</script>
