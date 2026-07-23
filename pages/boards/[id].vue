<template>
  <div class="px-4">
    <div class="my-2 flex flex-wrap items-start justify-start" style="column-gap:16px;row-gap:18px;">
      <ProductCard v-for="(item, idx) in productList" :key="idx" :item="item" />
      <el-button type="primary">测试按钮</el-button>
    </div>
    <div v-if="loading" class="text-center py-6">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProductCard from '~/components/ProductCard.vue'
import { getRate, getSpecialList } from '~/services/api'

const route = useRoute()
const classId = computed(()=> Number(route.params.id))
const productList = ref([])
const loading = ref(true)
const rate = ref(1)
const current = ref(1)

function usd(price){
  const result = (price * 100) / (rate.value * 100)
  return Math.round(result * 100) / 100 > 0 ? Math.round(result * 100) / 100 : 0.01
}

async function fetchList(){
  const rateRes = await getRate()
  rate.value = rateRes.data.exchange_rate
  const res = await getSpecialList({
    class_id: classId.value,
    pageIndex: current.value,
    pageCount: 24,
    keyword: ''
  })
  const list = res.data.list || []
  list.forEach((item)=>{ item.usd = usd(parseFloat(item.priceInfo.price)) })
  productList.value = list
  loading.value = false
}

onMounted(fetchList)
</script>