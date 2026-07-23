<template>
  <footer class="bg-white">
    <div class="mx-auto w-full max-w-[1300px] border-t bg-white" style="color: #222;font-size: 13px;">
      <div class="">
        <div class="pt-10 px-10">
          <div class="flex flex-row justify-between">
            <div class="flex-grow grid grid-cols-3 gap-4">
              <div class="footerMenu">
                <div class="flex">
                  <ul class="list-none px-2.5 text-13 font-semibold">
                    <div class="my-2">SOLUTION</div>
                    <!-- <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                        <h4 class="m-0 hover:underline">Overview</h4>
                    </li> -->
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <a class="no-underline" href="/admin/main/booking" target="_blank">Cost Calculator</a>
                    </li>
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <a class="no-underline" href="https://www.globals2s.com/pricing" target="_blank">Pricing</a>
                    </li>
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <a class="no-underline" href="https://www.globals2s.com/integrations" target="_blank">Integrations</a>
                    </li>
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <div @click="chatOpen" class="cursor-pointer">Support</div>
                    </li>
                    <!-- <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                        <h4 class="m-0 hover:underline">Discover</h4>
                    </li> -->
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <a href="/policy" target="_blank" style="text-decoration:none;">Refund, Resend and Returns Policy</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="footerMenu">
                <ul class="list-none text-13 font-semibold">
                  <h2 class="my-2 text-[14px] font-bold uppercase tracking-wider">Resources</h2>
                  <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                    <a class="no-underline" href="https://www.globals2s.com/blog/" target="_blank">Blog</a>
                  </li>
                  <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                    <a class="no-underline" href="/procurementGuides">Procurement Guides</a>
                  </li>
                  <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                    <a class="no-underline" href="https://www.globals2s.com/videoTutorials/">Video Tutorials</a>
                  </li>
                  <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                    <a class="no-underline" href="/caseStudies">Case Studies</a>
                  </li>
                  <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                    <a class="no-underline" href="https://www.globals2s.com/industryReports/">Industry Reports</a>
                  </li>
                  <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                    <a class="no-underline" href="/faq">FAQ</a>
                  </li>
                </ul>
              </div>

              <div class="footerMenu">
                <div class="flex">
                  <ul class="list-none px-2.5 text-13 font-semibold">
                    <div class="my-2">COMPANY</div>
                    <!-- <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                        <h4 class="m-0 hover:underline">Overview</h4>
                    </li> -->
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <h4 style="margin: 0;font-size: 13px;">
                        <a href="/privacy_policy.html" target="_blank" style="text-decoration:none;">Privacy Policy</a>
                      </h4>
                    </li>
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <h4 style="margin: 0;font-size: 13px;">
                        <a href="/terms.html" target="_blank" style="text-decoration:none;">Terms &amp; Conditions</a>
                      </h4>
                    </li>
                    <!-- <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                        <h4 class="m-0 hover:underline">Integrations</h4>
                    </li> -->
                    <!-- <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                        <h4 class="m-0 hover:underline">Support</h4>
                    </li>
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                        <h4 class="m-0 hover:underline">Discover</h4>
                    </li> -->
                  </ul>
                </div>
              </div>
              <!-- <div class="footerMenu">
                <div class="flex">
                  <ul class="list-none px-2.5 text-13 font-semibold">
                    <div class="my-2">FOLLOW US</div>
                    
                     <li class="pb-0.5 text-gray-500 hover:text-black transition-colors cursor-pointer">
                      <h4 style="margin: 0;font-size: 13px;">
                        <div @click="chatOpen">Contact Sales</div>
                      </h4>
                    </li>
                    <li class="pb-0.5 text-gray-500 hover:text-black transition-colors">
                      <h4 style="margin: 0;font-size: 13px;">
                        <a style="text-decoration:none;">Partners</a>
                      </h4>
                    </li>
                  </ul>
                </div>
              </div> -->
            </div>
            <div class="footerInfo">
              <div class="px-1">
                <div>
                  <div class="font-semibold uppercase">Find us on</div>
                  <div id="icons" class="my-5 ml-2 flex">
                    <a href="https://www.facebook.com/profile.php?id=100084854202594" style="text-decoration: none;" target="_blank">
                        <img src="@/assets/images/facebook.svg" style="width: 28px; margin-right: 8px;" alt="">
                    </a>
                    <a href="https://twitter.com/CoDrop2" style="text-decoration: none;" target="_blank">
                        <img src="@/assets/images/twitter.svg" style="width: 28px; margin-right: 8px;" alt="">
                    </a>
                    <a href="https://www.instagram.com/Cargosoon_Official/" style="text-decoration: none;" target="_blank">
                        <img src="@/assets/images/instagram.svg" style="width: 28px; margin-right: 8px;" alt="">
                    </a>
                    <a href="https://www.youtube.com/channel/UCFOKg1TJcD27lvQtw1lgP3A" style="text-decoration: none;" target="_blank">
                        <img src="@/assets/images/youtube.svg" style="width: 28px; margin-right: 8px;" alt="">
                    </a>
                    <a href="https://www.tiktok.com/@cargosoon?lang=en" style="text-decoration: none;" target="_blank">
                        <img src="@/assets/images/tiktok.svg" style="width: 28px; margin-right: 8px;" alt="">
                    </a>
                  </div>
                </div>
                <div class="hidden sm:block mt-5">
                  <div class="font-semibold uppercase">We Accept</div>
                  <div class="pay1 flex flex-wrap mt-2.5">
                    <img src="@/assets/images/pay1.webp" alt="">
                    <img src="@/assets/images/pay2.webp" alt="">
                    <img src="@/assets/images/pay3.webp" alt="">
                    <img src="@/assets/images/pay4.webp" alt="">
                    <img src="@/assets/images/pay5.webp" alt="">
                    <img src="@/assets/images/pay6.webp" alt="">
                    <img src="@/assets/images/pay7.webp" alt="">
                    <img src="@/assets/images/pay8.webp" alt="">
                    <img src="@/assets/images/pay9.webp" alt="">
                    <img src="@/assets/images/pay10.webp" alt="">
                    <img src="@/assets/images/pay11.webp" alt="">
                    <img src="@/assets/images/pay12.webp" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 pb-16">
          <div class="block sm:hidden mt-5">
            <div class="font-semibold uppercase">We Accept</div>
            <div class="pay1 flex flex-wrap mt-2.5">
              <img src="@/assets/images/pay1.webp" alt="">
              <img src="@/assets/images/pay2.webp" alt="">
              <img src="@/assets/images/pay3.webp" alt="">
              <img src="@/assets/images/pay4.webp" alt="">
              <img src="@/assets/images/pay5.webp" alt="">
              <img src="@/assets/images/pay6.webp" alt="">
              <img src="@/assets/images/pay7.webp" alt="">
              <img src="@/assets/images/pay8.webp" alt="">
              <img src="@/assets/images/pay9.webp" alt="">
              <img src="@/assets/images/pay10.webp" alt="">
              <img src="@/assets/images/pay11.webp" alt="">
              <img src="@/assets/images/pay12.webp" alt="">
            </div>
          </div>
          <div class="text-13 flex mt-5 flex-wrap">
            <div class="mr-3.5">
              <a href="https://www.globals2s.com/conditions" target="_blank" class="hover:underline">Conditions of Use</a>
            </div>
            <div class="mr-3.5">
              <a href="https://www.globals2s.com/privacy" target="_blank" class="hover:underline">Privacy Notice</a>
            </div>
            <div class="mr-3.5">
              <a href="https://www.globals2s.com/ads" target="_blank" class="hover:underline">Interest-Based Ads</a>
            </div>
            <!-- 获取今年的年份 -->
            <!-- <div>© {{ new Date().getFullYear() }}, Cargosoon, Inc. or its affiliates</div> -->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'

const chatOpen = inject('chatModal')
</script>

<style scoped>
.footerInfo {
  width: 400px
}

.pay1 img {
  width: 42px;
  margin: 5px 3px;
}

@media only screen and (max-width: 500px) {
  
}
</style>
