<template>
  <div>
    <div style="background-image: linear-gradient(180deg, #F7F6F5 0%, #F7F6F5 90%, #ffffff 100%);">
      <div class="mx-auto" style="max-width:1300px;">
        <div class="py-3 relative" style="height: 600px;">
          <div class="relative z-10">
            <div class="flex">
              <a href="/">
                <img src="@/assets/images/co logo.png" style="height: 54px;" alt="CoDropshipping">
              </a>
            </div>
            <h1 class="my-16 text-center" style="font-size: 48px;">Try Our Sourcing or Dropshipping<br/>- Get Rewarded</h1>
            <div class="mx-auto flex justify-between text-2xl" style="width: 600px;">
              <a href="https://www.cosourcings.com/" target="_blank">
                <div class="py-2.5 px-5 shadow border border-2 border-white text-white"
                  style="background: #FFA000;border-radius: 20px;">1688 sourcing</div>
              </a>
              <a href="/">
                <div class="py-2.5 px-5 rounded-2xl shadow border border-2 border-white text-white"
                  style="background: #FFA000;border-radius: 20px;">codropshipping</div>
              </a>
            </div>
          </div>
          <img src="@/assets/images/activity/bg.webp" class="absolute bottom-0 right-0 w-full z-0 object-cover select-none" alt="">
        </div>
        <div class="mx-auto flex items-center relative" style="margin-top: -120px;width: 1000px;">
          <img src="@/assets/images/activity/1.png" class="flex-shrink-0 mr-6 select-none" style="width: 260px;" alt="">
          <div class="mt-10 w-full">
            <h2 class="text-3xl">Why Join This Program?</h2>
            <div class="mt-5 px-3 py-6 bg-white border shadow-md text-2xl" style="border-radius: 20px;">
              <ul class="pl-6" style="list-style: disc;">
                <li class="py-2">Test real sourcing & fulfillment workflows</li>
                <li class="py-2">Experience a smoother global supply chain</li>
                <li class="py-2">Get rewarded for your feedback</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-16 flex flex-col items-center">
          <h2 class="text-3xl">How It Works</h2>
          <div class="mt-4 px-6 py-4 bg-white border shadow-md text-2xl flex" style="border-radius: 20px;width: 800px;">
            <div class="flex flex-col justify-between items-end">
              <img src="@/assets/images/activity/hiw1.png" class="w-12 select-none" alt="">
              <img src="@/assets/images/activity/hiw5.png" class="w-36 select-none" alt="">
            </div>
            <div>
              <ul class="pl-2">
                <li class="py-4">1. Choose one test path(1688 or Dropshipping)</li>
                <li class="py-4 flex items-center">2. Complete at least 1 full workflow
                  <img src="@/assets/images/activity/hiw2.png" class="ml-2 w-12 select-none" alt="">
                </li>
                <li class="py-4 flex items-center">3. Take screenshots as proof
                  <img src="@/assets/images/activity/hiw3.png" class="ml-2 w-12 select-none" alt="">
                </li>
                <li class="py-4 flex items-center">4. Contact support to claim your reward
                  <img src="@/assets/images/activity/hiw4.png" class="mx-2 w-10 select-none" alt="">
                  <img src="@/assets/images/activity/hiw4.png" class="mx-2 w-10 select-none" alt="">
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-16 mx-auto py-6 px-10 rounded-2xl border shadow-md" style="background: #F6F5F2;width: 1000px;">
          <div class="flex justify-between">
            <img src="@/assets/images/activity/pricepool1.png" class="w-40" alt="">
            <img src="@/assets/images/activity/pricepool2.png" class="w-40" alt="">
            <img src="@/assets/images/activity/pricepool3.png" class="w-40" alt="">
            <img src="@/assets/images/activity/pricepool4.png" class="w-40" alt="">
          </div>
          <div class="mt-8 flex justify-center">
            <div class="py-2 px-6 text-2xl text-white font-semibold shadow-md" style="border-radius: 20px;background: #FFB153;">Price Pool</div>
          </div>
        </div>
        <div class="my-16 mx-auto flex justify-center items-center" style="width: 900px;">
          <div>
            <h2 class="text-3xl">Reward Policy</h2>
            <div class="mt-5 pt-3 text-xl">
              <ul class="pl-6" style="list-style: disc;">
                <li class="py-1.5">Rewards are given for completed orders only</li>
                <li class="py-1.5">Earn up to 3 rewards per user</li>
                <li class="py-1.5">Shipping fees are not covered</li>
                <li class="py-1.5">Submit a screenshot as proof to claim your reward</li>
              </ul>
            </div>
          </div>
          <div>
          <img src="@/assets/images/activity/RewardPolicy.png" style="width: 280px;" alt="">
          </div>
        </div>
      </div>
    </div>

    <div style="background: #132E68;">
      <div class="py-16 mx-auto flex items-end" style="width: 1000px;">
        <div class="text-white mr-10">
          <div class="text-2xl">Ready to start?</div>
          <div class="mt-1 text-lg">Choose your path and start testing now!</div>
        </div>
        <a href="https://www.cosourcings.com/" target="_blank" class="mr-8">
          <div class="py-2 px-3 bg-white hover:bg-gray-200 rounded-md">
            Start 1688 sourcing
          </div>
        </a>
        <a href="/" class="mr-8">
          <div class="py-2 px-3 bg-white rounded-md">
            Start Dropshipping
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: '' })
</script>