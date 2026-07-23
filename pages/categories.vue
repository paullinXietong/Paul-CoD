<template>
  <div class="px-4">
    <div class="mt-5 bg-white py-4 text-sm">
      <div class="text-xl mb-4 px-5">All Categories</div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-5">
        <NuxtLink v-for="(item,idx) in items" :key="idx" :to="{ path: '/productDetail', query: { id: item.id, source: 1 } }" class="productItem block">
          <img class="max-h-64 w-full object-cover cursor-pointer" :src="item.pic" />
          <div class="p-3">
            <div class="productTitle">{{ item.title }}</div>
            <p class="py-2 font-semibold text-lg text-red-500">US${{ item.price }}</p>
            <p class="text-sm">5 pieces(MOQ)</p>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div id="back" class="fixed bottom-24 right-10 w-14 h-14 bg-white cursor-pointer border rounded" v-show="showBack" @click="goTop">
      <div class="flex justify-center items-center h-full">
        <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M992 720L576 304l-64-64-64 64L32 720l64 64 416-412.8L928 784z" fill="#515151"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const showBack = ref(false)
function onScroll(){ showBack.value = (window.scrollY > 400) }
function goTop(){ window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }) }
onMounted(()=>{ window.addEventListener('scroll', onScroll) })
onBeforeUnmount(()=>{ window.removeEventListener('scroll', onScroll) })

const items = ref([
  { id: 580878945592, pic: 'https://s.alicdn.com/@sc04/kf/H230c1dbbe155405492be3b668936e75er.jpg_300x300.jpg', title: 'Prime Quality Tshirts', price: 12 },
  { id: 823788142769, pic: 'https://s.alicdn.com/@sc04/kf/H3f8b3daffc024cd9b19ba6b82eac9835b.jpg_480x480.jpg', title: 'Prime Quality Tshirts', price: 12 },
  { id: 888709388066, pic: 'https://s.alicdn.com/@sc04/kf/Hcb8bfb6a49ff43d5b770acf6020b1a95a.jpg_480x480.jpg', title: 'Prime Quality Tshirts', price: 12 },
  { id: 823894083608, pic: 'https://s.alicdn.com/@sc04/kf/Hbd227ede0cf54365bb49f4f1fad95fe9y.jpg_480x480.jpg', title: 'Prime Quality Tshirts', price: 12 },
  { id: 779881743001, pic: 'https://s.alicdn.com/@sc04/kf/H230c1dbbe155405492be3b668936e75er.jpg_300x300.jpg', title: 'Prime Quality Tshirts', price: 12 },
  { id: 808545667332, pic: 'https://s.alicdn.com/@sc04/kf/H3f8b3daffc024cd9b19ba6b82eac9835b.jpg_480x480.jpg', title: 'Prime Quality Tshirts', price: 12 },
])
</script>

<style scoped>
.productItem{ border: 1px solid #eee; border-radius: 6px; overflow: hidden; background: #fff }
.productTitle{ display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden }
</style>