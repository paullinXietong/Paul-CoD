<template>
  <div class="px-4">
    <div class="mt-3 flex items-center">
      <button @click="goBack" class="mr-2">
        <svg viewBox="0 0 1024 1024" width="26" height="26"><path d="M303.22 520.23c-3.3-13.92.48-29.18 11.34-40.04l341.93-341.93c16.66-16.66 43.68-16.66 60.34 0s16.66 43.68 0 60.34L405 510.43l311.88 311.88c16.66 16.66 16.66 43.68 0 60.34s-43.68 16.66-60.34 0L314.61 540.73a42.47 42.47 0 0 1-11.39-20.5z" fill="#707070"></path></svg>
      </button>
      <div class="flex items-center bg-gray-100 rounded-full px-2 py-1 w-full">
        <input v-model="keyword" class="w-full bg-gray-100 px-2" type="text" />
        <button @click="doSearch">
          <svg viewBox="0 0 1024 1024" width="26" height="26"><path d="M883.63 823.04l-145.07-144.64A337.92 337.92 0 0 0 810.67 469.33a341.33 341.33 0 1 0-341.33 341.33 337.92 337.92 0 0 0 209.07-72.11l144.64 145.07a42.67 42.67 0 0 0 60.59 0 42.67 42.67 0 0 0 0-60.59zM213.33 469.33a256 256 0 1 1 256 256 256 256 0 0 1-256-256z" fill="#707070"></path></svg>
        </button>
      </div>
    </div>

    <div class="px-4">
      <div class="flex justify-between items-center py-6">
        <div>Search History</div>
        <button @click="clearAll">
          <svg viewBox="0 0 1024 1024" width="19" height="19"><path d="M795.65 874.5c0 33.79-27.65 61.44-61.44 61.44h-440.32c-33.79 0-61.44-27.65-61.44-61.44V226.3h562.18v648.2z m-439.3-757.76c0-3.07 1.02-6.14 3.07-8.19 2.05-2.05 5.12-3.07 8.19-3.07h292.86c7.17 0 12.29 5.12 12.29 12.29v36.86h-317.44v-37.89z m622.59 35.84H747.52v-36.86C747.52 68.61 708.61 30.72 661.5 30.72H368.64c-47.1 0-86.02 37.89-86.02 86.02V153.6H50.18c-13.31 0-25.6 7.17-31.74 18.43-6.14 11.26-6.14 25.6 0 36.86s18.43 18.43 31.74 18.43h109.57v648.2c0 73.73 60.42 134.14 134.14 134.14h440.32c73.73 0 134.14-60.42 134.14-134.14V226.3h109.57c20.48 0 36.86-16.38 36.86-36.86 1.02-20.48-15.36-36.86-35.84-36.86zM515.07 825.34c20.48 0 36.86-16.38 36.86-36.86V397.31c0-13.31-7.17-25.6-18.43-31.74-11.26-6.14-25.6-6.14-36.86 0s-18.43 18.43-18.43 31.74V788.48c0 20.48 16.38 36.86 36.86 36.86m-171.01 0c10.24 0 19.46-4.1 25.6-10.24 7.17-7.17 10.24-16.38 10.24-25.6V397.31c0-13.31-7.17-25.6-18.43-31.74-11.26-6.14-25.6-6.14-36.86 0s-18.43 18.43-18.43 31.74V788.48c1.02 20.48 17.41 36.86 37.89 36.86m342.02 0c20.48 0 36.86-16.38 36.86-36.86V397.31c0-13.31-7.17-25.6-18.43-31.74-11.26-6.14-25.6-6.14-36.86 0s-18.43 18.43-18.43 31.74V788.48c0 20.48 16.38 36.86 36.86 36.86" fill="#707070"></path></svg>
        </button>
      </div>
      <div class="flex flex-wrap">
        <div v-for="item in history" :key="item" class="historyItem bg-gray-100 rounded-full px-2 py-1 text-xs m-1 cursor-pointer" @click="openKeyword(item)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryHistory, clearHistory } from '~/services/api'
const route = useRoute()
const router = useRouter()
const keyword = ref(String(route.query.keyword || ''))
const history = ref([])
onMounted(()=>{ queryHistory({}).then(res=>{ history.value = res.data?.data?.list || [] }) })
function doSearch(){ if(keyword.value){ router.push({ path: '/search/result', query: { keyword: keyword.value } }) } }
function clearAll(){ history.value = []; clearHistory({}).then(()=>{}) }
function goBack(){ history.go(-1) }
function openKeyword(text){ router.push({ path: '/search/result', query: { keyword: text } }) }
</script>

<style scoped>
.historyItem{ background:#F2F2F2; border-radius:24px }
</style>