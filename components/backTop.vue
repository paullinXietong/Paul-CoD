<template>
  <div id="back" v-show="showBackTop" @click="scrollToTop" class="z-20 fixed bg-white cursor-pointer border rounded shadow hover:bg-gray-50 transition-colors">
    <div class="flex justify-center items-center h-full">
      <svg t="1681356113931" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2627" width="24" height="24">
        <path d="M992 720L576 304l-64-64-64 64L32 720l64 64 416-412.8L928 784z" p-id="2628" fill="#515151"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showBackTop = ref(false)

function handleScroll(){
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showBackTop.value = scrollTop > 400
}

function scrollToTop(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
    #back{
    width: 56px;
    height: 56px;
    bottom: 20px;
    right: 40px;
    }
</style>