<template>
  <div class="bg-white rounded">
    <NuxtLink :to="detailLink">
      <img :src="item.imageUrl" class="max-h-64 h-48 w-full object-cover object-left" alt="">
    </NuxtLink>
    <div class="p-3">
      <NuxtLink :to="detailLink">
        <div class="text-sm" :title="item.subjectTrans">{{ item.subjectTrans }}</div>
      </NuxtLink>
      <div class="flex justify-between items-center">
        <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
        <img src="@/assets/images/1688alibaba.svg" class="w-7 h-7" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: { type: Object, required: true } })
const detailLink = computed(()=>({ path: '/productDetail', query: { id: props.item.offerId, source: props.item.source } }))
</script>