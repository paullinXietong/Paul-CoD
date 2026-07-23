<template>
  <div class="bg-[#f2f3f7] min-h-screen">
    <div
      v-if="dataLoading"
      class="co-loading animate-spin"
    >
      <svg
        viewBox="0 0 1024 1024"
        class="w-[90px] h-[90px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 512h93.09A418.91 418.91 0 1 0 512 93.09V0c282.764 0 512 229.236 512 512s-229.236 512-512 512S0 794.764 0 512z"
          fill="#8a8a8a"
        />
      </svg>
    </div>

    <Teleport to="body">
      <div
        v-if="showRelated"
        class="co-mask"
      >
        <div class="relatedModal">
          <div class="flex justify-between items-center pb-3">
            <div class="font-semibold">Related Products</div>
            <svg
              @click="showRelated = false"
              class="icon cursor-pointer"
              viewBox="0 0 1024 1024"
              width="22"
              height="22"
            >
              <path d="M631 485.84l309.77-309.78a65.63 65.63 0 0 0 0-92.83 65.63 65.63 0 0 0-92.83 0L538.16 393a37 37 0 0 1-52.32 0L176.06 83.23a65.63 65.63 0 0 0-92.83 0 65.63 65.63 0 0 0 0 92.83L393 485.84a37 37 0 0 1 0 52.32L83.23 847.94a65.63 65.63 0 0 0 0 92.83 65.63 65.63 0 0 0 92.83 0L485.84 631a37 37 0 0 1 52.32 0l309.78 309.77a65.63 65.63 0 0 0 92.83 0 65.63 65.63 0 0 0 0-92.83L631 538.16a37 37 0 0 1 0-52.32z" />
            </svg>
          </div>
          <div class="flex flex-wrap gap-y-5 gap-x-4">
            <div
              v-for="item in relatedList"
              :key="`${item.offerId}-${item.source}`"
              class="productItem shadow rounded-md"
            >
              <NuxtLink
                :to="{ path: '/productDetail', query: { id: item.product_id, source: item.source, code: item.country_code } }"
                class="relative block"
                target="_blank"
              >
                <img
                  class="max-h-64 h-48 w-full object-cover object-left rounded"
                  :src="item.main_image"
                  :alt="item.subjectTrans"
                >
                <!-- <button class="action-badge add-product" @click.prevent.stop="addProduct(item)">
                  <span class="desc">Add To My Products</span>
                  <img :src="addProductIcon" alt="add product" class="icon-img">
                </button> -->
                <!-- <button
                  class="action-badge add-list"
                  @click.prevent.stop="addList(item)"
                >
                  <span class="desc">List</span>
                  <i class="icon-list"></i>
                </button> -->
              </NuxtLink>
              <div class="p-3">
                <NuxtLink :to="{ path: '/productDetail', query: { id: item.product_id, source: item.source, code: item.country_code } }" target="_blank">
                  <div
                    class="productTitle"
                    :title="item.subjectTrans"
                  >{{ item.title }}</div>
                </NuxtLink>
                <div class="flex justify-between items-center">
                  <p class="py-2 font-semibold text-lg text-red-500">${{ item.priceRange }}</p>
                  <!-- <img :src="alibabaIcon" class="w-7 h-7" alt="seller"> -->
                </div>
                <div class="mt-2 flex justify-between items-center">
                  <button
                    class="chatbtn w-full"
                    @click="chatNow(item)"
                  >Chat Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="max-w-[1390px] mx-auto px-6 py-2">
      <div
        v-if="keywordDisplay"
        id="keywordsearch"
        class="bg-white rounded px-6 py-4 text-sm text-gray-600 hidden"
      >
        Search "{{ keywordDisplay }}"
      </div>

      <div
        v-else-if="searchImage"
        id="imgselect"
        class="mt-2 bg-white p-4 rounded flex items-center gap-4"
      >
        <img
          :src="searchImage"
          class="w-24 h-24 rounded object-cover"
          alt="search image"
        >
        <div>
          <div class="font-semibold text-sm text-gray-700">Image search</div>
          <div class="text-gray-500 text-sm">We are showing products similar to your image.</div>
        </div>
      </div>

      <section
        v-if="sortList.length"
        id="search-container"
        class="mt-4 bg-white text-black p-6 text-sm rounded-lg relative"
      >
        <div
          v-for="(item, index) in visibleSortList"
          :key="`${item.id}-${index}`"
          class="flex mt-2"
        >
          <div
            class="type-name w-40"
            :title="item.translateName"
          >{{ item.translateName }}:</div>
          <div class="flex flex-wrap gap-3 ml-4">
            <div
              v-for="child in item.children"
              :key="child.id"
              class="type-option"
              :class="{ active: snid.includes(child.id) }"
              @click="selectItem(child)"
            >
              {{ child.translateName }}
            </div>
          </div>
        </div>
        <button
          v-if="sortList.length > 5"
          class="show-all-btn absolute bottom-4 right-4"
          @click="toggleShowAllSorts"
        >
          {{ showAllSorts ? 'Hide Filter' : 'Show Filter' }}
        </button>
      </section>

      <section
        v-if="keywordDisplay"
        id="sort-container"
        class="mt-4 bg-white text-black rounded-lg px-6 py-4"
      >
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in selectList"
            :key="item.id"
            class="select-chip text-xs"
            @click="selectItem(item)"
          >
            {{ item.translateName }}
            <img
              :src="deleteIcon"
              class="w-3 h-3 ml-2"
              alt="delete"
            >
          </div>
          <div
            v-if="selectList.length > 1"
            class="select-chip text-xs"
            @click="clearSnid"
          >
            Clear All
            <img
              :src="cancelIcon"
              class="w-4 h-4 ml-2"
              alt="clear"
            >
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-6 mt-2 select-none text-sm">
          <div
            class="flex items-center cursor-pointer"
            @click="saleSort()"
          >
            <span :class="{ active: !!sort.monthSold }">Monthly sales</span>
            <svg
              v-if="!sort.monthSold"
              class="icon ml-1"
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
            >
              <path
                d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z"
                fill="#8a8a8a"
              />
            </svg>
            <svg
              v-else-if="sort.monthSold === 'asc'"
              class="icon ml-1"
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
            >
              <path
                d="M64 320l448 448 448-448z"
                fill="#FF6624"
              />
            </svg>
            <svg
              v-else
              class="icon ml-1"
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
            >
              <path
                d="M960 704L512 256l-448 448z"
                fill="#FF6624"
              />
            </svg>
          </div>

          <div
            class="flex items-center cursor-pointer"
            @click="priceSort()"
          >
            <span :class="{ active: !!sort.price }">Price</span>
            <svg
              v-if="!sort.price"
              class="icon ml-1"
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
            >
              <path
                d="M64 448l448-448 448 448H64z m896 128l-448 448-448-448h896z"
                fill="#8a8a8a"
              />
            </svg>
            <svg
              v-else-if="sort.price === 'asc'"
              class="icon ml-1"
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
            >
              <path
                d="M64 320l448 448 448-448z"
                fill="#FF6624"
              />
            </svg>
            <svg
              v-else
              class="icon ml-1"
              viewBox="0 0 1024 1024"
              width="14"
              height="14"
            >
              <path
                d="M960 704L512 256l-448 448z"
                fill="#FF6624"
              />
            </svg>
          </div>
        </div>
      </section>

      <section class="mt-4 bg-white text-black rounded-lg px-2 py-3">
        <div
          v-if="productList.length"
          id="YMLproduct"
          class="grid gap-2"
          style="grid-template-columns: repeat(auto-fill, minmax(200px,1fr));"
        >
          <div
            class="productItem shadow rounded-md"
            v-for="item in productList"
            :key="`${item.offerId}-${item.source}`"
          >
            <div class="relative">
              <NuxtLink
                :to="{ path: '/productDetail', query: { id: item.product_id, source: item.source, code: item.country_code } }"
                class="relative block"
                target="_blank"
              >
                <img
                  class="max-h-64 h-48 w-full object-cover object-left rounded"
                  :src="item.main_image"
                  :alt="item.subjectTrans"
                >
                <!-- <button class="action-badge add-product" @click.prevent.stop="addProduct(item)">
                  <span class="desc">Add To My Products</span>
                  <img :src="addProductIcon" alt="add product" class="icon-img">
                </button> -->
                <!-- <button
                  class="action-badge add-list"
                  @click.prevent.stop="addList(item)"
                >
                  <span class="desc">List</span>
                  <i class="icon-list"></i>
                </button> -->
              </NuxtLink>
              <button
                class="related-btn"
                @click="getRelated(item.product_id)"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  width="24"
                  height="24"
                >
                  <path
                    d="M320 149.333h-76.8q-61.653 0-70.827 4.736-12.074 6.229-18.304 18.262Q149.333 181.44 149.333 242.56V320a42.667 42.667 0 1 1-85.333 0v-77.44q0-43.179 1.365-59.499 2.539-29.952 12.95-50.048 18.731-36.053 54.869-54.763 20.096-10.368 50.155-12.885Q199.744 64 243.2 64H320a42.667 42.667 0 1 1 0 85.333zm460.8 0H704a42.667 42.667 0 1 1 0-85.333h76.8q43.456 0 59.861 1.365 30.08 2.517 50.134 12.885 36.16 18.688 54.89 54.763 10.411 20.096 12.95 50.048 1.365 16.32 1.365 59.499V320a42.667 42.667 0 1 1-85.333 0v-77.44q0-61.12-4.736-70.229-6.229-12.032-18.304-18.262-9.173-4.736-70.827-4.736zm-105.856 465.28A234.667 234.667 0 0 0 725.333 469.333c0-129.6-105.067-234.667-234.667-234.667S256 339.733 256 469.333s105.067 234.667 234.667 234.667a234.667 234.667 0 0 0 120-33.003l84.48 84.502a42.667 42.667 0 1 0 60.373-60.331l-80.555-80.555zM490.667 320a149.333 149.333 0 1 1 0 298.667 149.333 149.333 0 0 1 0-298.667zM243.2 874.667H320a42.667 42.667 0 1 1 0 85.333h-76.8q-43.456 0-59.861-1.365-30.08-2.517-50.134-12.907-36.16-18.667-54.89-54.741-10.411-20.096-12.95-50.048Q64 824.64 64 781.44V704a42.667 42.667 0 1 1 85.333 0v77.44q0 61.12 4.736 70.229 6.229 12.032 18.304 18.262 9.173 4.736 70.827 4.736zM704 874.667h76.8q61.653 0 70.827-4.736 12.074-6.229 18.304-18.262 4.736-9.109 4.736-70.229V704a42.667 42.667 0 1 1 85.333 0v77.44q0 43.179-1.365 59.499-2.539 29.952-12.95 50.048-18.731 36.053-54.869 54.741-20.096 10.389-50.155 12.907Q824.256 960 780.8 960H704a42.667 42.667 0 1 1 0-85.333z"
                    fill="#FF7700"
                  />
                </svg>
              </button>
            </div>
            <div class="p-3">
              <NuxtLink :to="{ path: '/productDetail', query: { id: item.product_id, source: item.source, code: item.country_code } }" target="_blank">
                <div
                  class="productTitle"
                  :title="item.subjectTrans"
                >{{ item.title }}</div>
              </NuxtLink>
              <div class="flex justify-between items-center">
                <p class="py-2 font-semibold text-lg text-red-500">US ${{ item.usd }}</p>
                <!-- <img :src="alibabaIcon" class="w-7 h-7" alt="seller"> -->
              </div>
              <!-- <div class="flex justify-between items-center text-xs">
                <p>Monthly sales: {{ item.monthSold || 0 }}</p>
              </div> -->
              <div class="mt-2 flex justify-center">
                <button
                  class="chatbtn"
                  @click="chatNow(item)"
                >Chat Now</button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="loading"
          id="loading-container"
          class="mt-4 grid gap-2"
          style="grid-template-columns: repeat(auto-fill, minmax(200px,1fr));"
        >
          <div
            v-for="idx in skeletonItems"
            :key="idx"
            class="skeleton-card"
          ></div>
        </div>

        <div
          v-if="!loading && !productList.length"
          class="text-center my-6 text-base text-black"
        >
          No Data
        </div>
      </section>
    </div>

    <BackTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import {
  searchKeyword,
  getBuyerItemRecImageList,
  getRate,
  getSearchKeywordS,
  getProductRelatedRecommend,
} from "~/services/api";

useHead({
  title: "Search Result - CoDropshipping",
  meta: [
    {
      name: "description",
      content:
        "Find China suppliers, manufacturers, wholesalers for the best products at wholesale prices.",
    },
    { name: "referrer", content: "no-referrer" },
  ],
});
definePageMeta({ layout: "alitop" });
const route = useRoute();
const selectList = ref<any[]>([]);
const snid = ref<Array<number | string>>([]);
const sortList = ref<any[]>([]);
const queryState = ref<Record<string, string>>({});
const productList = ref<any[]>([]);
const relatedList = ref<any[]>([]);
const showAllSorts = ref(false);
const loading = ref(true);
const fetchingMore = ref(false);
const dataLoading = ref(false);
const showRelated = ref(false);
const rate = ref(1);
const current = ref(1);
const pageSize = 18;
const isPage = ref(true);
const searchImage = ref("");
const skeletonItems = Array.from({ length: 18 }, (_, idx) => idx);
const sort = ref<{ price?: "asc" | "desc"; monthSold?: "asc" | "desc" }>({});

const deleteIcon = new URL("@/assets/images/nav/delete.png", import.meta.url)
  .href;
const cancelIcon = new URL("@/assets/images/nav/candel.png", import.meta.url)
  .href;
const addListIcon = new URL("@/assets/images/addList.png", import.meta.url)
  .href;
const addProductIcon = new URL(
  "@/assets/images/addProduct.png",
  import.meta.url
).href;
const alibabaIcon = new URL("@/assets/images/1688alibaba.svg", import.meta.url)
  .href;

const keywordDisplay = computed(() =>
  queryState.value.keyword ? decodeURIComponent(queryState.value.keyword) : ""
);
const visibleSortList = computed(() =>
  showAllSorts.value ? sortList.value : sortList.value.slice(0, 5)
);

function divide(num1 = 0, num2 = 1) {
  const result = (num1 * 100) / (num2 * 100);
  const fixed = Math.round(result * 100) / 100;
  return fixed > 0 ? fixed : 0.01;
}

function syncQuery() {
  const q: Record<string, string> = {};
  Object.entries(route.query).forEach(([key, value]) => {
    if (Array.isArray(value)) q[key] = value[0] as string;
    else if (value !== undefined) q[key] = String(value);
  });
  queryState.value = q;
}

function toggleShowAllSorts() {
  showAllSorts.value = !showAllSorts.value;
}

function saleSort() {
  if (sort.value.monthSold === "asc") sort.value = { monthSold: "desc" };
  else sort.value = { monthSold: "asc" };
  delete sort.value.price;
  current.value = 1;
  fetchProducts(true);
}

function priceSort() {
  if (sort.value.price === "asc") sort.value = { price: "desc" };
  else sort.value = { price: "asc" };
  delete sort.value.monthSold;
  current.value = 1;
  fetchProducts(true);
}

function selectItem(item: any) {
  const exists = snid.value.includes(item.id);
  if (exists) {
    selectList.value = selectList.value.filter((sel) => sel.id !== item.id);
    snid.value = snid.value.filter((id) => id !== item.id);
  } else {
    selectList.value.push(item);
    snid.value.push(item.id);
  }
  current.value = 1;
  fetchProducts(true);
}

function clearSnid() {
  selectList.value = [];
  snid.value = [];
  current.value = 1;
  fetchProducts(true);
}

function addList(item: any) {
  if (process.client) {
    const url = `/admin/account/Publish?id=${item.offerId}&source=${item.source}`;
    window.open(url, "_blank");
  }
}

function addProduct(item: any) {
  if (process.client) {
    const url = `/admin/account/Publish?id=${item.offerId}&source=${item.source}&mode=product`;
    window.open(url, "_blank");
  }
}

function chatNow(item: any) {
  if (!process.client) return;
  const userInfo = window.localStorage.getItem("userInfo");
  let chatInfo: any;
  let username = "";
  if (userInfo) {
    const data = JSON.parse(userInfo);
    chatInfo = data.manage;
    username = `${data.first_name} ${data.last_name}`.trim();
  } else {
    const cache = window.localStorage.getItem("chat_info");
    if (!cache) return;
    const parsed = JSON.parse(cache);
    chatInfo = parsed.manage;
    username = parsed.chat_id;
  }
  const msg = {
    page: "Product",
    product: item.subjectTrans,
    link: `https://codropshipping.com/productDetail?id=${item.offerId}&source=${item.source}`,
  };
  const text = `Customer: ${username} | Source: ${msg.page} | Product: ${msg.product} | Link: ${msg.link} `;
  window.open(
    `https://api.whatsapp.com/send?phone=${
      chatInfo.whatsappp
    }&text=${encodeURIComponent(text)}`,
    "_blank"
  );
}

async function getRelated(offerId: string | number) {
  dataLoading.value = true;
  try {
    const res = await getProductRelatedRecommend({
      offerId,
      pageIndex: 1,
      pageCount: 10,
      type: 1,
      source: 5,
    });
    const alist = res.data?.data.data || [];
    for (let i = 0; i < alist.length; i++) {
      if (alist[i].skus[0].ladder_price.length > 0) {
        let arr = alist[i].skus[0].ladder_price.map((item) => item.price);
        let max = Math.max(...arr);
        let min = Math.min(...arr);

        if (max == min) {
          alist[i].priceRange = "US $" + max;
        } else {
          alist[i].priceRange = "US $" + min + " ~ " + "$" + max;
        }
      } else {
        alist[i].priceRange = "N/A";
      }
    }

    relatedList.value = alist;
    dataLoading.value = false;
    showRelated.value = true;
  } finally {
    dataLoading.value = false;
  }
}

async function fetchFilters() {
  if (!queryState.value.keyword) {
    sortList.value = [];
    return;
  }
  const res = await getSearchKeywordS({ keyword: queryState.value.keyword });
  sortList.value = res.data?.data || [];
}

async function fetchProducts(reset = false) {
  if (!queryState.value.keyword && !queryState.value.imageId) {
    productList.value = [];
    loading.value = false;
    return;
  }
  if (reset) {
    loading.value = true;
    fetchingMore.value = false;
    productList.value = [];
    current.value = 1;
  } else {
    fetchingMore.value = true;
  }
  const payload: Record<string, any> = {
    sort: sort.value,
    filter: "",
    pageIndex: current.value,
    pageCount: pageSize,
  };
  if (queryState.value.keyword) {
    payload.keyword = queryState.value.keyword;
    payload.categoryId = queryState.value.categoryId;
    payload.snId = snid.value.join(",");
  } else {
    payload.item_id = queryState.value.imageId;
  }
  const api = queryState.value.keyword
    ? searchKeyword
    : getBuyerItemRecImageList;
  try {
    const res = await api(payload);
    const list = res.data?.data?.data || [];
    searchImage.value = queryState.value.imageIdList;
    productList.value = (reset ? [] : productList.value).concat(
      list.map((litem: any) => {
        if (litem.skus[0].ladder_price.length > 0) {
          let arr = litem.skus[0].ladder_price.map((item) => item.price);
          let max = Math.max(...arr);
          let min = Math.min(...arr);

          if (max == min) {
            litem.usd = max;
          } else {
            litem.usd = min + " ~ " + "$" + max;
          }
        } else {
          litem.usd = "N/A";
        }
        litem.source = "5";
        return litem;
      })
    );
    const total = res.data?.data?.totalRecords;
    if (total && total > 0) {
      isPage.value = current.value * pageSize < total;
    } else {
      isPage.value = list.length === pageSize;
    }
  } catch (error) {
    console.error("Failed to fetch products", error);
  } finally {
    loading.value = false;
    fetchingMore.value = false;
  }
}

async function loadRate() {
  const res = await getRate();
  rate.value = res.data?.data?.exchange_rate || 1;
}

function maybeLoadMore() {
  if (loading.value || fetchingMore.value || !isPage.value) return;
  current.value += 1;
  fetchProducts(false);
}

function handleScroll() {
  if (!process.client) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollHeight - (scrollTop + clientHeight) < 600) {
    maybeLoadMore();
  }
}

async function bootstrap() {
  loading.value = true;
  await loadRate();
  await fetchFilters();
  if (queryState.value.keyword) searchImage.value = "";
  else if (process.client) searchImage.value = queryState.value.imageIdList;
  await fetchProducts(true);
}

onMounted(() => {
  syncQuery();
  bootstrap();
  if (process.client) {
    window.addEventListener("scroll", handleScroll);
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});

watch(
  () => route.fullPath,
  () => {
    syncQuery();
    selectList.value = [];
    snid.value = [];
    sort.value = {};
    bootstrap();
  }
);
</script>

<style scoped>
.icon-list {
  margin-right: 0;
}
.icon-list::before {
  content: "";
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  display: block;
  background: url("@/assets/images/addList.png") center center no-repeat;
}
.productItem {
  width: 200px;
  margin: 0 auto;
}

.productTitle {
  font-size: 14px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.action-badge {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: #f70;
  color: #fff;
  padding: 4px 10px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
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
  right: 10px;
}

.add-list {
  right: 10px;
  bottom: 15px;
}

.related-btn {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px;
  border-radius: 6px;
  background: #343434ed;
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

.select-chip {
  background-color: #f5f5f5;
  padding: 4px 8px 4px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  height: 28px;
  cursor: pointer;
}

.type-option {
  cursor: pointer;
  color: #111;
}

.type-option.active {
  color: #f70;
}

.active {
  color: #f70;
}

.show-all-btn {
  padding: 4px 8px;
  background-color: #f70;
  color: #fff;
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

.skeleton-card {
  height: 250px;
  border-radius: 10px;
  background: linear-gradient(120deg, #ececec 25%, #f7f7f7 37%, #ececec 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.type-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  fill: currentColor;
}
</style>