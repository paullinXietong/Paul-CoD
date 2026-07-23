<template>
  <div class="bg-gray-100">
    <div id="global-tooltip" class="fixed left-1/2 -translate-x-1/2 top-4 z-50 hidden bg-white shadow px-4 py-2 rounded border">
      <span :class="tooltipInfo.type==='success' ? 'text-green-600' : 'text-orange-500'">{{ tooltipInfo.title }}</span>
    </div>
    <input ref="iptFileRef" type="file" accept="image/jpeg,image/png,image/jpg" class="hidden" @change="uploadFiles" />

    <div ref="loadingPanel" class="w-full h-72 flex justify-center items-center">
      <div v-show="!overdue" class="loader"></div>
      <div class="text-lg" v-show="overdue">The product has expired</div>
    </div>

    <div ref="productPanel" class="max-w-[1440px] mx-auto hidden">
      <div class="mx-auto flex flex-col justify-center">
        <div class="w-full flex py-3 rounded bg-white">
          <div class="px-2.5" style="width: 780px;">
            <div class="flex">
              <div class="mx-4">
                <div class="w-20 h-20 mb-2 rounded border" v-for="(item,index) in swiperImages" :key="index" :class="index===action ? 'action-slide-1' : ''" @click="selectImage(index)">
                  <img :src="item" class="w-full h-full object-cover rounded" />
                </div>
              </div>
              <div class="mx-auto">
                <img id="Img" class="mb-2 object-cover max-w-[520px] max-h-[520px]" :src="bigImage" />
              </div>
            </div>
            <div class="my-3">
              <h4 class="pt-2 font-bold text-2xl">Description</h4>
              <p class="max-w-[750px] mx-auto flex justify-center items-center flex-wrap overflow-hidden" v-html="shopDetail.description"></p>
            </div>
          </div>

          <div class="sticky top-4 h-fit max-h-[100vh] shadow p-3 flex-1">
            <div class=" mb-2">
              <div id="spu" class="text-base text-gray-950 font-bold">{{ shopDetail.subjectTrans }}</div>
              <div class="flex-shrink-0">
                <div v-if="shopSource===4" class="flex items-center"><img src="@/assets/images/westmonth.png" class="w-4 h-4 inline-block mr-2" alt=""> WestMonth</div>
                <a v-if="shopSource===5" :href="aliLink" target="_blank" class="border text-sm cursor-pointer px-2 py-1 rounded ">
                  <img src="@/assets/images/1688.svg" class="w-4 h-4 inline-block mr-2" alt="">
                  Alibaba Original Link</a>
                <a v-if="shopSource!==4 && shopSource!==5" :href="link" target="_blank" class="border text-sm cursor-pointer px-2 py-1 rounded ">
                  <img src="@/assets/images/1688.svg" class="w-4 h-4 inline-block mr-2" alt="">
                  1688 Original Link</a>
              </div>
            </div>

            <div class="overflow-auto pb-4 shop-content" style="max-height: calc(100vh - 480px)">
              <div class="mb-3">
                <div class="inline-block text-white rounded text-sm px-3 py-2 w-full " style="background-color:#FB5842">Source goods ex-factory price</div>
              </div>

              <div id="piece" class="mb-3 p-3" style="background: #F7F8FA;border-radius: 0 0 4px 4px;">
                <div v-if="shopSource<4 && quoteType!=1" class="flex flex-wrap">
                  <div v-for="(i,n) in productPriceList" :key="n" style="margin: 0 24px 10px 0;">
                    <div class="pieces text-lg font-semibold text-red-500">US ${{i.price}}</div>
                    <div class="text-sm">{{i.num}}</div>
                  </div>
                </div>
                <div v-if="shopSource<4 && quoteType==1" class="pieces text-xl font-semibold text-red-500">US ${{priceRange}}</div>
                <div v-if="shopSource==4" class="pieces text-xl font-semibold text-red-500">US ${{priceRange}}</div>
                <div v-if="shopSource==5" class="flex flex-wrap">
                  <div v-for="(i,n) in aliPrice" :key="n" style="margin: 0 24px 10px 0;">
                    <div class="pieces text-lg font-semibold text-red-500">US ${{i.price}}</div>
                    <div class="text-sm">{{i.num}}</div>
                  </div>
                </div>
                <div class="mt-1 flex items-center text-xs" style="color: #ff6624;">
                  <svg t="1762940949539" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7201" width="16" height="16"><path d="M924.8 337.6c-22.6-53.4-54.9-101.3-96-142.4-41.1-41.1-89-73.4-142.4-96C631.1 75.8 572.5 64 512 64S392.9 75.8 337.6 99.2c-53.4 22.6-101.3 54.9-142.4 96-41.1 41.1-73.4 89-96 142.4C75.8 392.9 64 451.5 64 512s11.8 119.1 35.2 174.4c22.6 53.4 54.9 101.3 96 142.4s89 73.4 142.4 96C392.9 948.2 451.5 960 512 960s119.1-11.8 174.4-35.2c53.4-22.6 101.3-54.9 142.4-96 41.1-41.1 73.4-89 96-142.4C948.2 631.1 960 572.5 960 512s-11.8-119.1-35.2-174.4zM545.9 753.9c-8.7 8.7-20.7 14.1-33.9 14.1s-25.3-5.4-33.9-14.1c-8.7-8.7-14.1-20.7-14.1-33.9 0-26.5 21.5-48 48-48 13.3 0 25.3 5.4 33.9 14 8.7 8.7 14.1 20.7 14.1 33.9s-5.4 25.4-14.1 34zM480 544V256c0-17.7 14.3-32 32-32s32 14.3 32 32v288c0 17.7-14.3 32-32 32s-32-14.3-32-32z" p-id="7202" fill="#FF6400"></path></svg>
                  Prices may vary with promotions or quantity, and are final as displayed at checkout.
                </div>
              </div>

              <div v-if="shopSource<4" class="flex justify-between text-xs">
                <div class="flex items-center">
                  Customer Rating: 
                  <svg v-for="(i,n) in starList" t="1762999442498" class="icon" style="margin-left: 4px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4867" id="mx_n_1762999442499" width="18" height="18"><path d="M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z" p-id="4868"
                    :fill="i<=tradeScore?'#F5A623':'#F0F0F0'"></path></svg>
                </div>
                <div class="">
                  Sold: <span style="color: #ff2424;">{{soldOut}}</span>
                </div>
                <div style="padding-right: 10px;">
                  Repurchase Rate: <span style="color: #ff2424;">{{repeatPurchasePercent}}%</span>
                </div>
              </div>

              <!-- <div class="mb-3 p-3 rounded" style="background:#F7F8FA">
                <div v-if="shopSource<4 && quoteType===1" class="text-xl font-semibold text-red-500">US ${{ priceRange }}</div>
                <div v-if="shopSource===4" class="text-xl font-semibold text-red-500">US ${{ priceRange }}</div>
                <div v-if="shopSource===5" class="flex flex-wrap">
                  <div v-for="(i,n) in aliPrice" :key="n" class="mr-6 mb-2">
                    <div class="text-lg font-semibold text-red-500">US ${{ i.price }}</div>
                    <div class="text-sm">{{ i.num }}</div>
                  </div>
                </div>
              </div> -->

              <div v-if="quoteType==0">
                <div class="my-6 px-2 flex justify-between">
                  <div class="text-base w-20 text-black font-semibold">Qty</div>
                  <div class="">
                    <div class="flex items-center">
                      <div class="w-28 text-sm">${{ productPriceList[0].price }}</div>
                      <div class="flex items-center">
                        <button class="w-6 h-6 text-center bg-gray-100" @click="reduceNumPrice()">-</button>
                        <input :readonly="onlyOne" class="mx-0.5 w-14 text-center" type="text" v-model="oneQty" @blur="blurNumPrice()" />
                        <button class="w-6 h-6 text-center bg-gray-100" @click="addNumPrice()">+</button>
                      </div>
                    </div>
                    <div class="text-xs">Available: {{ amountOnSale }}</div>
                  </div>
                </div>
              </div>

              <div v-if="quoteType!==0">
                <div v-if="shopSource===4">
                  <div v-if="wVariables.length>0" class="mb-3">
                    <div class="text-base w-20 text-black font-semibold mb-3">Size</div>
                    <div class="flex flex-wrap">
                      <div v-for="(item,index) in wVariables[0].values" :key="index" class="border border-gray-100 text-base cursor-pointer rounded mr-3 shadow-sm flex items-center px-2 py-1 p-color" :class="index===actionColor ? 'action-slide-1' : ''" @click="selecVari(item,index)">{{ item.name }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-base text-black font-semibold mb-3">Shipping Country</div>
                    <div class="flex flex-wrap">
                      <div v-for="(value, index) in skuInfo[0].regions" :key="value.code" class="border border-gray-100 text-base cursor-pointer rounded mr-3 shadow-sm flex items-center mb-2 px-2 py-1 p-color" :class="{ 'action-slide-1 ': value.code===actionRegion, 'opacity-50': value.qty===0 }" @click="selecReg(value,index)">{{ value.name }}</div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-base text-black font-semibold mb-3">Count</div>
                    <div class="w-32">
                      <div class="flex border border-gray-300 rounded">
                        <button class="w-8 h-8 text-center" @click="reduceCount">-</button>
                        <input class="mx-0.5 w-16 text-center border-x" type="text" :readonly="onlyOne" v-model="count" @blur="blurCount" />
                        <button class="w-8 h-8 text-center" @click="addCount">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="shopSource===5" class="flex flex-col-reverse">
                  <div class="my-2 text-gray-600">*Taxes and related import fees will be calculated at checkout.</div>
                  <div v-if="attrType == 1">
                    <div class="text-base w-full text-black font-semibold">Quantity</div>
                    <div class="mt-2 flex flex-1 items-center">
                      <button class="w-6 h-6 text-center bg-gray-100" @click="reduceNums(index)">-</button>
                      <input :readonly="onlyOne" class="mx-0.5 w-14 text-center" type="text" v-model="count" @blur="blurNumbers(index)" />
                      <button class="w-6 h-6 text-center bg-gray-100" @click="addNums(index)">+</button>
                      <div class="ml-6 text-xs" :class="[attrInventory==0 ? 'text-red-500' : 'text-gray-500']" style="color: #6b7280;">Available: {{attrInventory}}</div>
                    </div>
                  </div>
                  <div class="my-2" v-if="priceList.length===aliAttr.length">
                    <div class="text-base w-full text-black font-semibold">{{ attrName }}</div>
                    <div class="w-full">
                      <div class="px-2 flex my-3 flex-wrap items-center h-10" v-for="(item,index) in aliAttr" :key="index">
                        <div class="flex-1 text-sm flex items-center gap-2">
                          <img v-show="item.image!==''" :src="item.image" class="w-9 h-9 rounded" />
                          {{ item.valueTrans }}
                        </div>
                        <div>
                          <div class="flex">
                            <div class="w-28 text-sm">${{ priceList[index].price }}</div>
                            <div class="flex flex-1">
                              <button class="w-6 h-6 text-center bg-gray-100" @click="reduceNum(index)">-</button>
                              <input :readonly="onlyOne" class="mx-0.5 w-14 text-center" type="text" v-model="skuNumber[actionColor].sizeNumber[index]" @blur="blurNumber(index)" />
                              <button class="w-6 h-6 text-center bg-gray-100" @click="addNum(index)">+</button>
                            </div>
                          </div>
                          <div class="text-xs" :class="[priceList[index].qty==0 ? 'text-red-500' : 'text-gray-500']" >Available: {{priceList[index].qty}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="my-2" :class="aliAttrs.length>0 ? 'flex flex-wrap' : 'hidden'">
                    <div class="pb-2 text-base w-full text-black font-semibold">{{ attrNames }}</div>
                    <div class="flex flex-wrap">
                      <div class="relative bg-white mb-3" v-for="(item,index) in aliAttrs" :key="item.attributeId">
                        <div class="border border-gray-100 text-base cursor-pointer rounded mr-3 shadow-sm flex items-center px-2 py-1 p-color" :class="index===actionColor ? 'action-slide-1' : ''" @click="selecColorAli(index)">
                          <img v-show="item.image!==''" :src="item.image" class="w-9 h-9 rounded" />
                          <span class="pl-2 text-sm">{{ item.valueTrans }}</span>
                          <div class="badge-countup-position" v-show="skuNumber[index].value!==0">x{{ skuNumber[index].value }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else>
                  <div class="my-2" :class="colorAttribute.length>0 ? 'flex flex-wrap' : 'hidden'">
                    <div class="text-base w-full text-black font-semibold">{{ attrNames }}</div>
                    <div class="flex flex-wrap px-2">
                      <div class="relative bg-white mb-3" v-for="(item,index) in colorAttribute" :key="item.attributeId">
                        <div class="border border-gray-100 text-base cursor-pointer rounded mr-3 shadow-sm flex items-center px-2 py-1 p-color" :class="index===actionColor ? 'action-slide-1' : ''" @click="selecColor(index)">
                          <img v-show="skuImageList.length>0" :src="skuImageList[index]" class="w-9 h-9 rounded" />
                          <span class="pl-2 text-sm">{{ item.valueTrans }}</span>
                          <div class="badge-countup-position" v-show="skuNumber[index].value!==0">x{{ skuNumber[index].value }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="my-2">
                    <div class="text-base w-20 text-black font-semibold">{{ attrName }}</div>
                    <div class="w-full" v-if="priceList.length===sizeAttribute.length">
                      <div class="px-2 flex my-3 items-center h-10" v-for="(item,index) in sizeAttribute" :key="index">
                        <div class="flex-1 text-sm flex items-center" style="width: 351px;">
                          <div class="flex-shrink-0" v-if="skuImageList.length>0 && colorAttribute.length===0">
                            <img :src="skuImageList[index]" class="w-10 h-10 rounded" 
                              :class="skuImageList[index]?'block':'hidden'"
                              @mouseenter="showImage(skuImageList[index])" />
                          </div>
                          <div class="skuTitle" :title="item.valueTrans">{{ item.valueTrans }}</div>
                        </div>
                        <div class="w-56">
                          <div class="flex items-center">
                            <div class="w-28 text-sm">${{ priceList[index].price }}</div>
                            <div class="flex items-center">
                              <button class="w-6 h-6 text-center bg-gray-100" @click="reduceNum(index)">-</button>
                              <input :readonly="onlyOne" class="mx-0.5 w-14 text-center" type="text" v-model="skuNumber[actionColor].sizeNumber[index]" @blur="blurNumber(index)" />
                              <button class="w-6 h-6 text-center bg-gray-100" @click="addNum(index)">+</button>
                            </div>
                          </div>
                          <div class="text-xs">Available: {{ priceList[index].qty }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div v-if="shopSource!=5" class="my-2 pb-3">
                <div class="flex justify-between items-center">
                  <div class="text-base text-black font-medium w-full mb-2">Freight</div>
                </div>
              </div> -->

              <!-- <div class="my-2 flex flex-wrap" >
                <div class="text-base text-black font-medium w-full mb-2">International Delivery Fee Estimate</div>
                
              </div> -->

              <!-- <div class="my-3">
                <div class="text-base text-black font-medium w-full mb-2">Dropship this product to your store</div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <div class="p-2 rounded-full border">
                      <svg t="1754987643529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6311" width="32" height="32"><path d="M850.026667 199.68c-0.725333-5.162667-5.12-8.106667-8.810667-8.106667s-82.218667-5.866667-82.218667-5.866666-54.314667-54.314667-60.906666-60.181334c-5.888-5.866667-17.621333-4.416-22.037334-2.944-0.725333 0-11.733333 3.669333-30.826666 9.557334-18.346667-53.589333-50.645333-102.037333-107.178667-102.037334h-5.12C517.504 9.536 496.96 0 480.064 0c-132.117333 0-195.242667 165.162667-215.061333 248.853333-51.413333 16.149333-88.106667 27.157333-92.501334 28.608-28.629333 8.810667-29.354667 9.557333-33.024 36.693334C136.533333 334.72 61.653333 914.645333 61.653333 914.645333L645.226667 1024l316.373333-68.266667c0-0.725333-110.826667-750.933333-111.573333-756.053333zM612.928 140.906667a1690.026667 1690.026667 0 0 0-49.173333 15.424v-11.008c0-32.298667-4.416-58.730667-11.733334-80 29.354667 4.394667 48.426667 37.418667 60.906667 75.584z m-97.621333-68.266667c8.064 20.565333 13.226667 49.194667 13.226666 88.832v5.866667c-32.32 10.282667-66.816 20.565333-102.058666 31.573333 19.84-75.605333 57.258667-112.32 88.832-126.272zM476.373333 35.242667c5.866667 0 11.733333 2.197333 16.896 5.866666-42.581333 19.818667-87.36 69.738667-106.453333 170.304-27.882667 8.810667-55.04 16.874667-80.746667 24.96 22.037333-76.352 75.605333-201.130667 170.304-201.130666z" fill="#95BF47" p-id="6312"></path><path d="M841.216 190.848c-3.669333 0-82.218667-5.866667-82.218667-5.866667s-54.314667-54.314667-60.906666-60.202666a11.797333 11.797333 0 0 0-8.085334-3.669334L645.973333 1024l316.373334-68.266667S851.498667 204.8 850.773333 199.68a12.714667 12.714667 0 0 0-9.557333-8.832z" fill="#5E8E3E" p-id="6313"></path><path d="M538.069333 365.546667l-38.912 115.989333s-34.496-18.346667-76.352-18.346667c-61.653333 0-64.597333 38.890667-64.597333 48.426667 0 52.864 138.026667 73.429333 138.026667 197.482667 0 97.621333-61.674667 160.746667-145.365334 160.746666-100.565333 0-151.210667-62.4-151.210666-62.4l27.157333-88.810666s52.864 45.504 96.896 45.504c29.376 0 41.109333-22.741333 41.109333-39.637334 0-68.992-113.045333-71.936-113.045333-185.706666 0-95.424 68.266667-187.925333 206.997333-187.925334 52.864-0.725333 79.296 14.677333 79.296 14.677334z" fill="#FFFFFF" p-id="6314"></path></svg>
                    </div>
                    <div class="p-2 rounded-full border">
                      <svg t="1754987763570" class="icon" viewBox="0 0 2000 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9910" width="32" height="32"><path d="M1246.7 329.5h-109.2v-62h203.7v56.1l-103.3 150.5s41.3 3 59 8.9c23.6 5.9 53.1 20.7 53.1 20.7v62s-70.8-23.6-109.2-23.6c-47.2 0-109.2 23.6-109.2 23.6v-67.9l115.1-168.3zM381.9 524.4l-29.5-29.5V326.6c0-35.4-62-67.9-109.2-67.9-67.9 0-121 44.3-124 100.4H190c5.9-23.6 23.6-38.4 47.2-38.4s41.3 14.8 41.3 38.4v26.6h-59c-14.8 0-29.5 3-41.3 8.9-53.1 23.6-76.7 79.7-56.1 126.9 20.7 47.2 79.7 67.9 132.8 44.3 14.8-5.9 26.6-14.8 35.4-26.6l38.4 38.4 53.2-53.2z m-177.2-14.8c-17.7-17.7-11.8-47.2 8.9-67.9 5.9-5.9 14.8-11.8 20.7-11.8h44.3v64.9l-5.9 5.9c-20.7 20.7-50.2 23.7-68 8.9z m897.4 14.8l-29.5-29.5V326.6c0-35.4-62-67.9-109.2-67.9-67.9 0-121 44.3-124 100.4h70.8c5.9-23.6 23.6-38.4 47.2-38.4s41.3 14.8 41.3 38.4v26.6h-62c-14.8 0-29.5 3-41.3 8.9-53.1 23.6-76.7 79.7-56.1 126.9 20.7 47.2 79.7 67.9 132.8 44.3 14.8-5.9 26.6-14.8 35.4-26.6l38.4 38.4 56.2-53.2z m-174.2-14.8c-17.7-17.7-11.8-47.2 8.9-67.9 5.9-5.9 14.8-11.8 20.7-11.8h44.3v64.9l-3 3c-23.6 23.6-53.1 26.6-70.9 11.8z m0 0" fill="#221E1F" p-id="9911"></path><path d="M706.6 258.7c-32.5 0-59 20.7-70.8 56.1-14.8-35.4-41.3-56.1-73.8-56.1s-59 26.6-70.8 62v-53.1h-73.8v309.9h73.8V376.8c0-26.6 20.7-44.3 44.3-44.3 11.8 0 32.5 20.7 32.5 32.5v209.6h73.8V367.9c3-17.7 23.6-35.4 41.3-32.5 14.8 0 32.5 20.7 32.5 35.4v206.6h73.8V341.3c-12-47.2-32.7-82.6-82.8-82.6z m0 0" fill="#221E1F" p-id="9912"></path><path d="M783.3 344.3v11.8c3-2.9 3-8.9 0-11.8z m0 0" fill="#221E1F" p-id="9913"></path><path d="M1810.5 258.7c-32.5 0-59 26.6-70.8 62v-53.1h-73.8v309.9h73.8V376.8c0-26.6 20.7-44.3 44.3-44.3 11.8 0 32.5 20.7 32.5 32.5v209.6h67.9v-245c-0.1-41.4-41.4-70.9-73.9-70.9z m-309.9 0c-70.8 0-126.9 70.8-126.9 162.4 0 88.6 56.1 162.4 126.9 162.4 70.8 0 126.9-70.8 126.9-162.4-2.9-88.6-59-162.4-126.9-162.4z m38.4 218.4c0 20.7-17.7 38.4-38.4 38.4h-3c-20.7 0-38.4-17.7-38.4-38.4V362c0-20.7 17.7-38.4 38.4-38.4h3c20.7 0 38.4 17.7 38.4 38.4v115.1z m0 0" fill="#221E1F" p-id="9914"></path><path d="M381.9 604.1s194.8 124 454.6 126.9c259.8 3 354.2-73.8 377.8-79.7 23.6-5.9 17.7 20.7 0 35.4-17.7 14.8-239.1 129.9-413.3 112.2-174.2-17.7-336.5-88.6-422.1-174.2-26.6-29.5 3-20.6 3-20.6z m0 0" fill="#F59328" p-id="9915"></path><path d="M1143.4 627.7s106.3-20.7 115.1 0c8.9 20.7-20.7 97.4-32.5 118.1-8.9 14.8 11.8 17.7 20.7 8.9 8.9-11.8 59-73.8 53.1-141.7 0-23.6-17.7-29.5-50.2-29.5-20.7 0-91.5 14.8-118.1 29.5-2.8 2.9-5.8 17.6 11.9 14.7z m0 0" fill="#F59328" p-id="9916"></path></svg>
                    </div>
                    <div class="p-2 rounded-full border">
                      <svg t="1754987839663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11015" width="32" height="32"><path d="M0 0m192 0l640 0q192 0 192 192l0 640q0 192-192 192l-640 0q-192 0-192-192l0-640q0-192 192-192Z" fill="#000000" p-id="11016"></path><path d="M444.608 416.256V384.64a200.512 200.512 0 0 0-32.512-2.56 241.536 241.536 0 0 0-241.408 241.152c0 82.112 41.088 153.92 103.552 197.568a239.616 239.616 0 0 1-65.024-164.224C208.32 525.76 313.6 418.816 444.608 416.256z" fill="#00F2EA" p-id="11017"></path><path d="M450.56 767.744c59.136 0 107.904-47.04 110.464-106.048V135.744h95.872c-1.664-11.136-3.392-22.208-3.392-33.344H522.496v525.952a110.4 110.4 0 0 1-110.4 106.048c-18.88 0-35.968-4.224-51.392-12.8 20.544 28.16 53.12 46.144 89.92 46.144z" fill="#00F2EA" p-id="11018"></path><path d="M736.512 255.488a179.84 179.84 0 0 1-44.48-119.68h-35.136a183.296 183.296 0 0 0 79.616 119.68zM412.096 513.792c-60.8 0-110.464 49.6-110.464 110.272 0 42.816 24 79.552 59.072 97.536-12.8-17.92-20.48-40.192-20.48-64.128 0-60.8 49.6-110.336 110.4-110.336 11.072 0 22.208 1.664 32.512 5.12V417.92a200.576 200.576 0 0 0-32.512-2.56h-6.016v102.592a135.616 135.616 0 0 0-32.512-4.224z" fill="#FF004F" p-id="11019"></path><path d="M836.672 314.496v101.76a305.664 305.664 0 0 1-182.336-59.008v266.88a241.536 241.536 0 0 1-380.096 197.504 243.008 243.008 0 0 0 177.216 76.992 241.536 241.536 0 0 0 241.408-241.152v-266.88a313.6 313.6 0 0 0 182.4 59.008V317.888c-13.76 0-26.56-0.832-38.592-3.392z" fill="#FF004F" p-id="11020"></path><path d="M653.44 624.128v-266.88a313.536 313.536 0 0 0 182.4 59.008v-101.76a185.152 185.152 0 0 1-99.328-59.008 182.4 182.4 0 0 1-80.448-119.68H561.024v525.952a110.4 110.4 0 0 1-110.4 105.984 110.72 110.72 0 0 1-89.92-46.144 111.04 111.04 0 0 1-59.072-97.472c0-60.8 49.664-110.336 110.464-110.336 11.136 0 22.208 1.664 32.512 5.12V416.256a241.088 241.088 0 0 0-236.288 241.216c0 63.296 24.832 121.408 65.088 164.16a242.688 242.688 0 0 0 138.688 43.648 241.024 241.024 0 0 0 241.408-241.152z" fill="#FFFFFF" p-id="11021"></path></svg>
                    </div>
                    <div class="p-2 rounded-full border">
                      <svg t="1754987858981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12154" width="32" height="32"><path d="M8.292124 259.413333A95.857778 95.857778 0 0 1 94.194347 199.111111h832.568889A93.582222 93.582222 0 0 1 995.598791 227.555556a97.848889 97.848889 0 0 1 28.444445 70.826666V625.777778a96.426667 96.426667 0 0 1-90.168889 94.151111H630.372124c13.653333 34.702222 28.444444 68.835556 40.675556 103.253333-60.302222-34.133333-119.751111-69.12-180.622222-102.684444H90.496569A96.995556 96.995556 0 0 1 0.043236 625.777778V305.777778a116.622222 116.622222 0 0 1 8.248888-46.364445" fill="#945C87" p-id="12155"></path><path d="M419.598791 259.128889a36.693333 36.693333 0 0 1 56.888889 7.395555 35.555556 35.555556 0 0 1 1.422222 33.28 495.217778 495.217778 0 0 0-38.115555 136.533334 906.524444 906.524444 0 0 0-14.791111 184.035555 35.555556 35.555556 0 0 1-23.04 38.684445 42.097778 42.097778 0 0 1-40.106667-18.488889 432.355556 432.355556 0 0 1-89.6-176.64c-18.773333 37.262222-37.546667 74.808889-55.466667 113.777778A278.186667 278.186667 0 0 1 170.709902 648.248889c-8.533333 8.533333-23.04 16.213333-34.133333 7.395555a123.733333 123.733333 0 0 1-28.444445-56.888888 2423.751111 2423.751111 0 0 1-56.888888-284.444445 36.693333 36.693333 0 0 1 18.488888-41.528889 39.822222 39.822222 0 0 1 39.822223 4.266667 42.666667 42.666667 0 0 1 11.093333 27.022222c11.093333 74.24 23.608889 148.195556 41.813333 221.013333 30.151111-56.888889 60.302222-116.053333 90.453334-174.648888a54.044444 54.044444 0 0 1 18.204444-22.471112 28.444444 28.444444 0 0 1 36.693333 3.413334 63.715556 63.715556 0 0 1 12.515556 30.72 799.573333 799.573333 0 0 0 38.684444 140.8 796.444444 796.444444 0 0 1 42.097778-203.093334 137.671111 137.671111 0 0 1 19.626667-38.684444m170.666667 36.977778a105.528889 105.528889 0 0 1 90.168888 32.142222A142.222222 142.222222 0 0 1 711.154347 403.342222a233.244444 233.244444 0 0 1-24.462223 137.102222 148.764444 148.764444 0 0 1-52.053333 60.302223 105.813333 105.813333 0 0 1-111.502222-3.413334 125.44 125.44 0 0 1-46.648889-79.644444 219.022222 219.022222 0 0 1 60.302222-195.697778 98.417778 98.417778 0 0 1 53.191111-25.031111m6.542223 71.111111a72.533333 72.533333 0 0 0-34.133334 32.995556 127.146667 127.146667 0 0 0-9.955555 117.191111 34.417778 34.417778 0 0 0 23.04 22.471111 40.106667 40.106667 0 0 0 31.573333-12.8 116.053333 116.053333 0 0 0 33.564444-66.56 115.768889 115.768889 0 0 0-13.368888-83.626667 28.444444 28.444444 0 0 0-29.866667-10.524444m256-71.111111a105.528889 105.528889 0 0 1 85.333333 30.151111 138.808889 138.808889 0 0 1 33.564445 80.497778 231.253333 231.253333 0 0 1-24.746667 131.413333 149.048889 149.048889 0 0 1-53.191111 61.724444 106.097778 106.097778 0 0 1-106.666667-2.56 113.777778 113.777778 0 0 1-44.942222-59.733333 223.004444 223.004444 0 0 1 49.208889-213.617778 111.786667 111.786667 0 0 1 59.448889-28.444444m6.826666 71.111111a80.497778 80.497778 0 0 0-36.124444 37.831111 126.293333 126.293333 0 0 0-6.542222 113.777778 31.288889 31.288889 0 0 0 24.746666 20.195555 47.786667 47.786667 0 0 0 32.711112-16.213333 121.173333 121.173333 0 0 0 31.004444-73.955556 106.097778 106.097778 0 0 0-15.644444-72.817777 28.444444 28.444444 0 0 0-30.151112-9.386667" fill="#FFFFFF" p-id="12156"></path></svg>
                    </div>
                  </div>
                  <div class="py-2 px-4 rounded-full border border-black cursor-pointer hover:bg-gray-200" @click="goList">Start dropshipping</div>
                </div>
              </div> -->
            </div>

            <div id="action-btn" class="sticky bottom-0 mt-7 flex justify-start flex-wrap text-sm bg-white border-t">
              <div class="flex-1">
                <div class="text-sm py-2">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <div class="mr-1 rounded-full text-white text-xs text-center"
                        style="padding: 2px 0;line-height: 14px;background: #E53935;width: 16px;height: 16px;">1</div>
                      Product Sourcing - CoDropshipping Warehouse
                    </div>
                  </div>
                  <div v-show="totalNumber!==0" class="mt-2 ml-5 flex justify-between items-center">
                    <div class="relative">
                      <div class="text-sm flex">
                        <div class="mr-2">Product Cost</div>
                        <el-popover
                          placement="top"
                          width="260"
                          trigger="hover">
                          <div class="text-xs text-gray-500 font-normal rounded">
                            <div class="pt-1 text-orange-500">Includes:</div>
                            <div class="pt-1 flex justify-between w-full"><div>Item subtotal ({{ totalNumber }} products)</div><div>${{ totalPrice }}</div></div>
                            <div class="pt-1 flex justify-between w-full">
                              <div>Domestic shipping(China)</div>
                              <div>{{freightFee >0?'$'+freightFee:'Free'}}</div>
                            </div>
                            <div class="py-1 flex justify-between w-full"><div>Product sourcing service</div><div>{{ purchaseFee>0 ? '$'+purchaseFee : '--' }}</div></div>
                          </div>
                          <template #reference>
                            <div class="text-orange-500 cursor-pointer">[View details]</div>
                          </template>
                        </el-popover>
                      </div>
                      <!-- <div v-show="showFee"
                        class="absolute text-xs bottom-5 bg-white px-3 border-t border-b text-gray-500 font-normal flex items-center flex-wrap rounded" style="width: 260px;background: #F0F0F0;">
                        <div class="py-1 text-orange-500">Includes:</div>
                        <div class="py-1 flex justify-between w-full"><div>Item subtotal ({{ totalNumber }} products)</div><div>${{ totalPrice }}</div></div>
                        <div class="py-1 flex justify-between w-full">
                          <div>Domestic shipping(China)</div>
                          <div>{{freightFee >0?'$'+freightFee:'Free'}}</div>
                        </div>
                        <div class="py-1 flex justify-between w-full"><div>Product sourcing service</div><div>{{ purchaseFee>0 ? '$'+purchaseFee : '--' }}</div></div>
                      </div> -->
                    </div>
                    <div class="mr-4 font-semibold">${{ getTotalPrice() }}</div>
                  </div>
                  <div class="mt-2 ml-5 flex items-center">
                    <svg t="1775726690684" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9455" width="22" height="22"><path d="M865.777931 73.218582 158.222069 73.218582c-51.586912 0-93.406366 41.819454-93.406366 93.406366l0 707.554838c0 51.585889 41.819454 93.405343 93.406366 93.405343l707.555861 0c51.586912 0 93.406366-41.819454 93.406366-93.405343L959.184297 166.624948C959.184297 115.038036 917.364843 73.218582 865.777931 73.218582zM841.576739 338.686722 405.535735 761.527077c-7.414877 7.188726-17.018605 10.770298-26.597775 10.770298-9.78997 0-19.569708-3.730974-27.033703-11.193947L182.012915 591.21004c-14.944364-14.929014-14.944364-42.029232 0-56.958246 14.927991-14.929014 39.10053-17.841344 54.030567-2.913353l143.293567 143.273101 409.048233-396.642692c15.124466-14.654768 39.289841-11.419074 54.039777 3.758604C857.094154 296.880571 856.747253 323.977719 841.576739 338.686722z" fill="#00B700" p-id="9456" data-spm-anchor-id="a313x.search_index.0.i2.79613a81OTR7PV" class="selected"></path></svg>
                    Pay product cost first, shipping fee charged later</div>
                  <div class="mt-2 flex justify-between items-center">
                    <div class="flex items-center">
                      <div class="mr-1 rounded-full text-white text-xs text-center"
                        style="padding: 2px 0;line-height: 14px;background: #E53935;width: 16px;height: 16px;">2</div>
                      <div class="flex items-center">
                        Shipping Destination
                        <el-popover
                          placement="top"
                          width="400"
                          trigger="hover">
                          <div class="text-xs text-gray-500 font-normal rounded">
                            Shipping cost will update based on destination.<br/>
                            We provide estimated international shipping costs so you can calculate your profit in advance.
                          </div>
                          <template #reference>
                            <svg t="1775728787805" class="icon ml-1 cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10680" width="20" height="20"><path d="M512 0C227.555556 0 0 227.555556 0 512s227.555556 512 512 512 512-227.555556 512-512-227.555556-512-512-512z m45.511111 853.333333c-17.066667 11.377778-28.444444 17.066667-51.2 17.066667-17.066667 0-34.133333-5.688889-51.2-17.066667-17.066667-11.377778-22.755556-28.444444-22.755555-51.2s5.688889-34.133333 22.755555-51.2c11.377778-11.377778 28.444444-22.755556 51.2-22.755555s34.133333 5.688889 51.2 22.755555c11.377778 11.377778 22.755556 28.444444 22.755556 51.2s-11.377778 39.822222-22.755556 51.2z m176.355556-443.733333c-11.377778 22.755556-22.755556 39.822222-39.822223 51.2-17.066667 17.066667-39.822222 39.822222-79.644444 73.955556l-28.444444 28.444444c-5.688889 5.688889-11.377778 17.066667-17.066667 22.755556v17.066666c0 5.688889-5.688889 17.066667-5.688889 34.133334-5.688889 34.133333-22.755556 51.2-56.888889 51.2-17.066667 0-28.444444-5.688889-39.822222-17.066667-11.377778-11.377778-17.066667-28.444444-17.066667-45.511111 0-28.444444 5.688889-51.2 11.377778-68.266667 5.688889-17.066667 17.066667-34.133333 34.133333-51.2 11.377778-17.066667 34.133333-34.133333 56.888889-51.2 22.755556-17.066667 34.133333-28.444444 45.511111-39.822222s17.066667-17.066667 22.755556-28.444445c5.688889-11.377778 11.377778-22.755556 11.377778-34.133333 0-22.755556-11.377778-45.511111-28.444445-62.577778-17.066667-17.066667-45.511111-28.444444-73.955555-28.444444-45.511111-11.377778-73.955556 0-85.333334 17.066667-17.066667 17.066667-34.133333 45.511111-45.511111 79.644444-11.377778 34.133333-28.444444 51.2-62.577778 51.2-17.066667 0-34.133333-5.688889-45.511111-17.066667-11.377778-11.377778-17.066667-28.444444-17.066666-39.822222 0-28.444444 11.377778-62.577778 28.444444-91.022222s45.511111-56.888889 85.333333-79.644445c39.822222-22.755556 79.644444-28.444444 130.844445-28.444444 45.511111 0 85.333333 5.688889 119.466667 22.755556 34.133333 17.066667 62.577778 39.822222 79.644444 68.266666 22.755556 28.444444 34.133333 62.577778 34.133333 96.711111 0 28.444444-5.688889 51.2-17.066666 68.266667z" fill="#FF7E11" p-id="10681"></path></svg>
                          </template>
                        </el-popover>
                        :
                      </div>
                      <div class="relative">
                        <el-select v-model="searchText" filterable placeholder="">
                          <el-option
                            v-for="item in filteredOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            @click="selectOption(item)">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div v-show="totalNumber!==0" class="mr-4 font-semibold">
                      <div v-if="freightList.length>0">${{ freightList[actionFre].freight }}</div>
                      <div v-else>$--</div>
                    </div>
                  </div>
                </div>
                <div v-if="skuShippingDetails.length>0 || shopSource===5" class="flex px-3 flex-wrap bg-gray-100 py-2 text-base w-full rounded">
                  <div v-show="totalNumber===0">After selecting the product, the shipping fee will be automatically calculated based on the volume and weight of the product.</div>
                  <div v-show="totalNumber!==0 && freightList.length===0">Please contact our service personnel to inquire about shipping costs.</div>
                  
                  <div v-if="totalNumber!=0&& freightList.length>0" class="w-full text-sm">
                    <div class="shipping-name flex justify-between">
                      <div class="">
                        Shipping Method: {{freightList[actionFre].name}}
                      </div>
                      <div class="cursor-pointer decoration-black underline" @click="changeFreight">
                        More Method
                      </div>
                    </div>
                    <div class="pt-2 shipping-date">Transit time: Est. {{freightList[actionFre].time}} days</div>
                    <div class="pt-2">Tracking available</div>
                  </div>
                </div>

                <a href="/admin/main/booking" class="py-2.5 w-full flex justify-between items-center" target="_blank">
                  <div class="text-xs w-full">Have questions about pricing? Click here to learn more.</div>
                  <div class="text-sm shrink-0 mr-3 flex">
                    <svg t="1761813196913" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5837" width="20" height="20"><path d="M532.523781 653.790711h-40.51207c-11.186971 0-20.255523 9.0706-20.255524 20.255524v40.514118c0 11.184923 9.068552 20.255523 20.255524 20.255524h40.51207c11.186971 0 20.255523-9.0706 20.255524-20.255524V674.047259c0.001024-11.185947-9.067528-20.256547-20.255524-20.256548z m0-141.790711h-40.51207c-11.186971 0-20.255523 9.0706-20.255524 20.255523v40.512071c0 11.186971 9.068552 20.257571 20.255524 20.257571h40.51207c11.186971 0 20.255523-9.0706 20.255524-20.257571v-40.512071c0.001024-11.184923-9.067528-20.255523-20.255524-20.255523z m-182.302782 0h-40.51207c-11.186971 0-20.255523 9.0706-20.255524 20.255523v40.512071c0 11.186971 9.068552 20.257571 20.255524 20.257571h40.51207c11.184923 0 20.255523-9.0706 20.255524-20.257571v-40.512071c0-11.184923-9.0706-20.255523-20.255524-20.255523z m425.373158-384.862111H248.941335c-44.748908 0-81.023117 36.276257-81.023118 81.025165v607.674916c0 44.748908 36.274209 81.023117 81.023118 81.023118h526.652822c44.74686 0 81.023117-36.274209 81.023118-81.023118V208.164078c0.001024-44.749932-36.275233-81.026189-81.023118-81.026189z m40.512071 688.702129c0 22.374966-18.137105 40.512071-40.512071 40.512071H248.941335c-22.374966 0-40.512071-18.137105-40.512071-40.512071v-607.67594c0-22.374966 18.137105-40.512071 40.512071-40.512071h526.652822c22.374966 0 40.512071 18.137105 40.512071 40.512071v607.67594zM350.220999 653.790711h-40.51207c-11.186971 0-20.255523 9.0706-20.255524 20.255524v40.514118c0 11.184923 9.068552 20.255523 20.255524 20.255524h40.51207c11.184923 0 20.255523-9.0706 20.255524-20.255524V674.047259c0-11.185947-9.0706-20.256547-20.255524-20.256548z m364.605564-141.790711h-40.51207c-11.186971 0-20.255523 9.0706-20.255524 20.255523v40.512071c0 11.186971 9.068552 20.257571 20.255524 20.257571h40.51207c11.186971 0 20.255523-9.0706 20.255524-20.257571v-40.512071c0.001024-11.184923-9.067528-20.255523-20.255524-20.255523z m-20.255523-263.326923h-364.605564c-22.374966 0-40.512071 18.139152-40.512071 40.51207v81.025165c0 22.374966 18.137105 40.510023 40.512071 40.510023h364.605564c22.372918 0 40.512071-18.135057 40.512071-40.510023v-81.025165c0-22.372918-18.139152-40.512071-40.512071-40.51207z m0 121.537235h-364.605564v-81.023117h364.605564v81.023117z m20.255523 283.580399h-40.51207c-11.186971 0-20.255523 9.0706-20.255524 20.255524v40.514118c0 11.184923 9.068552 20.255523 20.255524 20.255524h40.51207c11.186971 0 20.255523-9.0706 20.255524-20.255524V674.047259c0.001024-11.185947-9.067528-20.256547-20.255524-20.256548z" fill="#8a8a8a" p-id="5838"></path></svg>
                    International Shipping Calculator
                  </div>
                </a>
                <div v-show="totalNumber!==0" class="text-gray-950 w-full pt-2 pb-4 flex flex-col flex-wrap relative items-end font-bold">
                  <!-- <div v-show="showFee" class="absolute -top-20 h-20 bg-white w-full px-4 border-t border-b text-gray-500 font-normal flex items-center flex-wrap">
                    <div class="flex justify-between w-full"><div>Item subtotal ({{ totalNumber }} products)</div><div>${{ totalPrice }}</div></div>
                    <div class="flex justify-between w-full"><div>Shipping total</div><div v-if="freightList.length>0">${{ freightList[actionFre].freight }}</div><div v-else>$--</div></div>
                    <div v-if="shopSource==5" class="flex justify-between w-full">
                      <div>International Logistics</div>
                      <div v-if="freightList.length>0">${{freightList[actionFre].freight}}</div>
                      <div v-else>--</div>
                    </div>
                    <div v-else class="flex justify-between w-full">
                      <div>Factory to CoDropshipping warehouse freight</div>
                      <div>{{freightFee >0?'$'+freightFee:'Free'}}</div>
                    </div>
                    <div class="flex justify-between w-full"><div>Procurement</div><div>{{ purchaseFee>0 ? '$'+purchaseFee : '--' }}</div></div>
                  </div> -->
                  <!-- <div class="flex">
                    <div class="mr-2">Total Cost: </div>
                    <div class="w-28 flex">${{ getTotalPrices() }}</div>
                  </div> -->
                  <div class="flex">
                    <div class="mr-2 flex items-center">
                      Pay Now
                      <el-popover
                        placement="top"
                        width="400"
                        trigger="hover">
                        <div class="text-xs">
                          <div class="text-gray-500 font-normal rounded">
                            <div class="pt-1 text-orange-500">Only product cost:</div>
                            <div class="pt-1 flex justify-between w-full"><div>Item subtotal ({{ totalNumber }} products)</div><div>${{ totalPrice }}</div></div>
                            <div class="pt-1 flex justify-between w-full">
                              <div>Domestic shipping(China)</div>
                              <div>{{freightFee >0?'$'+freightFee:'Free'}}</div>
                            </div>
                            <div class="py-1 flex justify-between w-full"><div>Product sourcing service</div><div>{{ purchaseFee>0 ? '$'+purchaseFee : '--' }}</div></div>
                          </div>
                          <div class="mt-3">
                            📦Shipping fee (Paid later):<br/>
                            Cost varies by destination, weight & delivery speed.<br/>
                            Options: Economy sea freight / Standard air / Express delivery.<br/>
                            Shipping cost confirmed after quality inspection. No hidden fees.<br/>
                            Please feel free to contact your <span @click="chatNows" class="text-orange-500 cursor-pointer">sourcing partner</span> for consultation!
                          </div>
                        </div>
                        <template #reference>
                          <svg t="1775728787805" class="icon ml-1 cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10680" width="20" height="20"><path d="M512 0C227.555556 0 0 227.555556 0 512s227.555556 512 512 512 512-227.555556 512-512-227.555556-512-512-512z m45.511111 853.333333c-17.066667 11.377778-28.444444 17.066667-51.2 17.066667-17.066667 0-34.133333-5.688889-51.2-17.066667-17.066667-11.377778-22.755556-28.444444-22.755555-51.2s5.688889-34.133333 22.755555-51.2c11.377778-11.377778 28.444444-22.755556 51.2-22.755555s34.133333 5.688889 51.2 22.755555c11.377778 11.377778 22.755556 28.444444 22.755556 51.2s-11.377778 39.822222-22.755556 51.2z m176.355556-443.733333c-11.377778 22.755556-22.755556 39.822222-39.822223 51.2-17.066667 17.066667-39.822222 39.822222-79.644444 73.955556l-28.444444 28.444444c-5.688889 5.688889-11.377778 17.066667-17.066667 22.755556v17.066666c0 5.688889-5.688889 17.066667-5.688889 34.133334-5.688889 34.133333-22.755556 51.2-56.888889 51.2-17.066667 0-28.444444-5.688889-39.822222-17.066667-11.377778-11.377778-17.066667-28.444444-17.066667-45.511111 0-28.444444 5.688889-51.2 11.377778-68.266667 5.688889-17.066667 17.066667-34.133333 34.133333-51.2 11.377778-17.066667 34.133333-34.133333 56.888889-51.2 22.755556-17.066667 34.133333-28.444444 45.511111-39.822222s17.066667-17.066667 22.755556-28.444445c5.688889-11.377778 11.377778-22.755556 11.377778-34.133333 0-22.755556-11.377778-45.511111-28.444445-62.577778-17.066667-17.066667-45.511111-28.444444-73.955555-28.444444-45.511111-11.377778-73.955556 0-85.333334 17.066667-17.066667 17.066667-34.133333 45.511111-45.511111 79.644444-11.377778 34.133333-28.444444 51.2-62.577778 51.2-17.066667 0-34.133333-5.688889-45.511111-17.066667-11.377778-11.377778-17.066667-28.444444-17.066666-39.822222 0-28.444444 11.377778-62.577778 28.444444-91.022222s45.511111-56.888889 85.333333-79.644445c39.822222-22.755556 79.644444-28.444444 130.844445-28.444444 45.511111 0 85.333333 5.688889 119.466667 22.755556 34.133333 17.066667 62.577778 39.822222 79.644444 68.266666 22.755556 28.444444 34.133333 62.577778 34.133333 96.711111 0 28.444444-5.688889 51.2-17.066666 68.266667z" fill="#FF7E11" p-id="10681"></path></svg>
                        </template>
                      </el-popover>
                      : </div>
                    <div class="flex">${{ getTotalPrice() }}</div>
                    <!-- <img :src="showFee?'@/assets/images/icon/bottom.png':'@/assets/images/icon/top.png'" class="w-4 h-4 mx-2" @click="showFee=!showFee" /> -->
                  </div>
                  <!-- <div class="my-3 w-full flex justify-between text-red-500 font-medium text-xs">
                    <div class="flex items-center">
                      <svg t="1775633664315" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5923" width="24" height="24"><path d="M835.413333 316.586667a42.666667 42.666667 0 0 1-12.586666 30.293333L431.786667 737.92C418.773333 750.933333 405.333333 768 384 746.666667l-202.24-207.36a44.8 44.8 0 0 1-4.053333-60.16 42.666667 42.666667 0 0 1 62.506666-2.133334l161.066667 161.066667a6.826667 6.826667 0 0 0 9.813333 0l352.853334-353.066667a38.4 38.4 0 0 1 37.76-10.666666 44.16 44.16 0 0 1 33.706666 42.24z" p-id="5924" fill="#f83f27"></path></svg>
                      <div>No hidden fees</div>
                    </div>
                    <div class="flex items-center">
                      <svg t="1775633664315" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5923" width="24" height="24"><path d="M835.413333 316.586667a42.666667 42.666667 0 0 1-12.586666 30.293333L431.786667 737.92C418.773333 750.933333 405.333333 768 384 746.666667l-202.24-207.36a44.8 44.8 0 0 1-4.053333-60.16 42.666667 42.666667 0 0 1 62.506666-2.133334l161.066667 161.066667a6.826667 6.826667 0 0 0 9.813333 0l352.853334-353.066667a38.4 38.4 0 0 1 37.76-10.666666 44.16 44.16 0 0 1 33.706666 42.24z" p-id="5924" fill="#f83f27"></path></svg>
                      <div>Shipping cost confirmed after quality inspection</div>
                    </div>
                    <div class="flex items-center">
                      <svg t="1775633664315" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5923" width="24" height="24"><path d="M835.413333 316.586667a42.666667 42.666667 0 0 1-12.586666 30.293333L431.786667 737.92C418.773333 750.933333 405.333333 768 384 746.666667l-202.24-207.36a44.8 44.8 0 0 1-4.053333-60.16 42.666667 42.666667 0 0 1 62.506666-2.133334l161.066667 161.066667a6.826667 6.826667 0 0 0 9.813333 0l352.853334-353.066667a38.4 38.4 0 0 1 37.76-10.666666 44.16 44.16 0 0 1 33.706666 42.24z" p-id="5924" fill="#f83f27"></path></svg>
                      <div>Full refund if product issue</div>
                    </div>
                  </div> -->
                </div>

                <div v-if="quoteType!==0" class="flex justify-around">
                  <el-popover
                    placement="top"
                    :width="240"
                    trigger="hover"
                    effect="dark"
                    content="Add the product to your store."
                  >
                    <template #reference>
                      <button v-if="shopSource!=5" class="mb-2 w-20 h-10 border text-white bg-orange-500 rounded-lg" @click="goList"><span class="inline-block">List</span></button>
                    </template>
                  </el-popover>
                  <button v-if="shopSource!=5" class="mb-2 px-4 h-10 text-orange-500 border border-orange-500 hover:bg-gray-200 rounded-lg" @click="addShop"><span class="inline-block">Add to products</span></button>
                  <button v-show="!onlyOne" :class="shopSource==5?'mr-10':''" class="mb-2 px-4 h-10 text-orange-500 border border-orange-500 hover:bg-gray-200 rounded-lg" @click="addCar"><span class="inline-block relative">Add to cart<div v-show="loadingCart" style="width:1.4rem;height:1.4rem;left:37%;" class="loader inline-block mx-1 align-middle absolute"></div></span></button>
                  <button v-show="!onlyOne" class="mb-2 px-4 h-10 text-white bg-orange-500 hover:bg-orange-500 rounded-lg" @click="buyNow"><span class="inline-block relative">Buy Now<div v-show="loadingBuy" style="width:1.4rem;height:1.4rem;left:37%;" class="loader inline-block mx-1 align-middle absolute"></div></span></button>
                  <button v-show="onlyOne" class="mb-2 px-4 h-10 text-white bg-orange-500 hover:bg-orange-500 rounded-lg" @click="buyNow"><span class="inline-block relative">Buy Now<div v-show="loadingBuy" style="width:1.4rem;height:1.4rem;left:37%;" class="loader inline-block mx-1 align-middle absolute"></div></span></button>
                </div>
                <div v-if="quoteType===0" class="flex justify-evenly text-center">
                  <button class="mb-2 w-32 h-10 text-orange-500 border border-orange-500 hover:bg-gray-200 rounded-lg" @click="chatNows"><span class="inline-block">Chat Now</span></button>
                  <!-- <button class="mb-2 px-4 h-10 text-orange-500 border border-orange-500 hover:bg-gray-200 rounded-lg" @click="addCars"><span class="inline-block relative">Add to cart<div v-show="loadingCart" style="width:1.4rem;height:1.4rem;left:37%;" class="loader inline-block mx-1 align-middle absolute"></div></span></button>
                  <button class="mb-2 px-4 h-10 text-white bg-orange-500 hover:bg-orange-500 rounded-lg" @click="buyNows"><span class="inline-block relative">Buy Now<div v-show="loadingBuy" style="width:1.4rem;height:1.4rem;left:37%;" class="loader inline-block mx-1 align-middle absolute"></div></span></button> -->
                </div>
                <div class="ml-4 text-red-600 w-full" v-show="showCart">Quantity cannot be less than {{ leastQuantity }}</div>
              </div>
            </div>

          </div>
        </div>

        <div v-show="showLoading" class="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div class="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full"></div>
        </div>

        <div v-show="showTransfer" ref="shippingModal" class="fixed inset-0 bg-black/30 z-50 hidden lg:flex justify-center items-center">
          <div class="bg-white rounded-lg w-full max-w-2xl px-4 py-4">
            <div class="text-lg font-semibold mb-2">Shipping Selection</div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-700">From</div>
                <div class="text-base">{{ fromAddress }}</div>
              </div>
              <!-- <div>
                <div class="text-sm text-gray-700">To</div>
                <input class="w-full border rounded px-2 py-1" v-model="searchText" @focus="focusOption" @blur="blurOption" @input="filterOptions" />
                <div v-show="showDropdown" class="border rounded mt-1 max-h-48 overflow-auto">
                  <div v-for="option in filteredOptions" :key="option.value" class="px-2 py-1 cursor-pointer hover:bg-gray-100" @click="selectOption(option)">{{ option.label }}</div>
                </div>
              </div> -->
            </div>
            <div class="mt-4">
              <div class="text-base font-medium mb-2">Freight</div>
              <div v-if="freightList.length>0" class="space-y-2">
                <div v-for="(item,index) in freightList" :key="index" class="border rounded p-2 flex justify-between items-center cursor-pointer"
                  :class="index===selectTran ? 'border-blue-500' : 'border-gray-200'" @click="selectMeth(index)">
                  <div>
                    <div class="font-semibold">{{ item.name }}</div>
                    <div class="text-sm">Transit time: Est. {{ item.time }} days</div>
                  </div>
                  <div v-if="item.freight>0">${{ item.freight }}</div>
                  <div v-else>Free Shipping</div>
                </div>
              </div>
              <div class="mt-4 flex justify-center">
                <button class="bg-orange-500 text-white px-6 py-2 rounded-3xl" @click="confirmTrans">Apply</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div id="back" @click="goTop" class="z-10 fixed bg-white cursor-pointer border rounded" v-show="backVisible" style="right: 20px; bottom: 20px; width: 42px; height: 42px;">
    <div class="flex justify-center items-center h-full">
      <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M992 720L576 304l-64-64-64 64L32 720l64 64 416-412.8L928 784z" fill="#515151"></path></svg>
    </div>
  </div>

</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'
import { getDetail, getRate, getCountry, getDefault, getWeght, getPrice, getInfo, addCartList, addShopList, getEcoBuyerItemAdd, getImgId, getPurchaseFee } from '~/services/api'

definePageMeta({ layout: 'default' })

const chatText = inject('chatProduct')
const route = useRoute()
const config = useRuntimeConfig()

const iptFileRef = ref(null)
const loadingPanel = ref(null)
const productPanel = ref(null)
const shippingModal = ref(null)

const tooltipInfo = reactive({ title: '', type: 'success' })
const showLoading = ref(false)
const showTransfer = ref(false)
const selectTran = ref(0)
const count = ref(0)
const west_sku = ref('')
const onlyOne = ref(false)
const isPhone = ref(false)
const selectedGender = ref(0)
const isFreight = ref(false)
const selectedValue = ref('')
const countryOptions = ref([])
const filteredOptions = ref([])
const actOption = ref('')
const exchange = ref(6)
const showCart = ref(false)
const loadingCart = ref(false)
const loadingShop = ref(false)
const loadingBuy = ref(false)
const loadingPage = ref(true)
const message = ref('')
const shopDetail = reactive({ subjectTrans: '', description: '' })
const shopId = ref('')
const keyword = ref('')
const shopSource = ref(0)
const link = ref('')
const swiperImages = ref([])
const bigImage = ref('')
const action = ref(0)
const colorAttribute = ref([])
const sizeAttribute = ref([])
const actionColor = ref(0)
const priceRangeList = reactive({ price: 0, startQuantity: 1 })
const skuInfo = ref([])
const skuNumber = ref([])
const priceList = ref([])
const quoteType = ref(0)
const promotionPrice = ref(0)
const skuAttributes = ref([])
const priceRange = ref('')
const overdue = ref(false)
const shop_name = ref('')
const code = ref('')
const totalFreight = ref(0)
const actionFre = ref(0)
const freightList = ref([])
const totalNumber = ref(0)
const totalPrice = ref(0)
const purchaseFee = ref(0)
const AllPrice = ref(0)
const AllCost = ref(0)
const skuImageList = ref([])
const wVariables = ref([])
const actionRegion = ref('')
const dialogVisible = ref(false)
const skuShippingDetails = ref([])
const options = ref([])
const placeholder = ref('Please select')
const value = ref('')
const searchText = ref('')
const showDropdown = ref(false)
const selectedOption = ref({})
const fromAddress = ref('China')
const toAddress = ref('')
const total_weight = ref(0)
const total_volume = ref(0)
const skuData = ref([])
const attrType = ref(0)
const attrInventory = ref(0)
const aliAttr = ref([])
const aliAttrs = ref([])
const attrName = ref('')
const attrNames = ref('')
const aliLink = ref('')
const aliWarehouse = ref([])
const selectRegion = ref('')
const moreFreight = ref(false)
const aliPrice = ref([])
const itemInventory = ref([])
const soldOut = ref(0)

const showFee = ref(false)
const backVisible = ref(false)
const repeatPurchasePercent = ref(0)
const tradeScore = ref(0)
const productPrice = ref([])
const productPriceList = ref([{price:0}])
const starList = ref([1,2,3,4,5])
const freightFee = ref(0)
const leastQuantity = ref(1)
const amountOnSale = ref(0)
const oneQty = ref(0)
const oneWeight = ref(0)
const oneVolume = ref(0)

let scrollHandler = () => { const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop; backVisible.value = y > 400 }

function showGlobalTooltip(t, type='success') {
  const el = document.getElementById('global-tooltip')
  message.value = t
  tooltipInfo.title = t
  tooltipInfo.type = type
  el.style.display = 'block'
  setTimeout(() => { el.style.display = 'none' }, 3000)
}

function isLogin() {
  const t = window.localStorage.getItem('TOKEN')
  if (!t || t === 'undefined') return false
  return true
}

function normalizeString(str) {
  return String(str).replace(/\s/g, '').toLowerCase()
}

function selecColor(index) {
  showImage(skuImageList.value[index])
  actionColor.value = index;
  setColorPrice();
}

function selecColorAli(index){
  actionColor.value = index;
  setColorPriceAli();
}

function divide(num1, num2) {
  const result = (num1 * 100) / (num2 * 100)
  if (Math.round(result * 100) / 100 > 0) return Math.round(result * 100) / 100
  return 0.01
}

function findPrice() {
  const arr = priceList.value.map(i => i.price)
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  priceRange.value = max === min ? max : `${min} ~ $${max}`
}

function setSkuImage() {
  skuImageList.value = []
  for (let i = 0; i < colorAttribute.value.length; i++) {
    const skuItem = skuInfo.value.find(sku => normalizeString(sku.skuAttributes.find(sk => sk.attributeId == colorAttribute.value[i].attributeId).value) === normalizeString(colorAttribute.value[i].value))
    if (skuItem.skuAttributes[0].skuImageUrl) skuImageList.value.push(skuItem.skuAttributes[0].skuImageUrl)
    else skuImageList.value.push(swiperImages.value[0])
  }
}

function setAttri(attribute) {
  for (let i = 0; i < attribute.length; i++) {
    if (skuAttributes.value.length > 1) {
      if (skuAttributes.value[0] == parseInt(attribute[i].attributeId)) {
        colorAttribute.value.push({ attributeId: attribute[i].attributeId, value: attribute[i].value, valueTrans: attribute[i].valueTrans, price: 0 })
      }
    } else {
      sizeAttribute.value = []
      skuInfo.value.forEach(item => {
        sizeAttribute.value.push({ attributeId: item.skuAttributes[0].attributeId, value: item.skuAttributes[0].value, valueTrans: item.skuAttributes[0].valueTrans })
      })
    }
  }
  if (colorAttribute.value.length > 0) {
    setSkuImage()
    setColorPrice()
  } else {
    sizeAttribute.value.map((item, index) => {
      const skuItem = skuInfo.value.find(sku => normalizeString(sku.skuAttributes.find(sk => sk.attributeId == item.attributeId).value) === normalizeString(item.value))
      if (skuItem.skuAttributes[0].skuImageUrl) skuImageList.value.push(skuItem.skuAttributes[0].skuImageUrl)
      let price = 0
      let cnPrice = 0
      if(quoteType.value == 2){
        price = divide(promotionPrice.value, exchange.value)
        cnPrice = promotionPrice.value
      }else{
        if (skuItem.price) { price = divide(skuItem.price, exchange.value); cnPrice = skuItem.price }
        else if (skuItem.jxhyPrice) { price = divide(skuItem.jxhyPrice, exchange.value); cnPrice = skuItem.jxhyPrice }
        else { price = divide(skuItem.consignPrice, exchange.value); cnPrice = skuItem.consignPrice }
      }
      priceList.value.push({ price, cnPrice, weight: skuItem.weight ? skuItem.weight : 0, qty: skuItem.amountOnSale })
    })
    const sizeNumber = sizeAttribute.value.map(() => 0)
    skuNumber.value.push({ sizeNumber: sizeNumber.slice(), value: 0 })
  }
  findPrice()
  actionColor.value = 0
}

function setColorPrice() {
  const actionItem = colorAttribute.value[actionColor.value]
  const skuItem = skuInfo.value.filter(sku => normalizeString(sku.skuAttributes.find(sk => sk.attributeId == actionItem.attributeId).value) === normalizeString(actionItem.value))
  sizeAttribute.value = []
  skuItem.forEach(item => { sizeAttribute.value.push({ attributeId: item.skuAttributes[1].attributeId, value: item.skuAttributes[1].value, valueTrans: item.skuAttributes[1].valueTrans }) })
  priceList.value = []
  skuItem.forEach(item => {
    let price = 0; let cnPrice = 0
    if(quoteType.value == 2){
      price = divide(promotionPrice.value, exchange.value)
      cnPrice = promotionPrice.value
    }else{
      if (item.price) { price = divide(item.price, exchange.value); cnPrice = item.price }
      else if (item.jxhyPrice) { price = divide(item.jxhyPrice, exchange.value); cnPrice = item.jxhyPrice }
      else { price = divide(item.consignPrice, exchange.value) }
    }
    priceList.value.push({ price, cnPrice, weight: item.weight ? item.weight : 0, qty: item.amountOnSale })
  })
  const sizeNumber = sizeAttribute.value.map(() => 0)
  // skuNumber.value = []
  colorAttribute.value.map(() => { skuNumber.value.push({ sizeNumber: sizeNumber.slice(), value: 0 }) })
}

function setColorPriceAli() {
  const actionItem = aliAttrs.value[actionColor.value]
  const skuItem = skuInfo.value.filter(sku => sku.sku_attr_list.find(sk => sk.attr_name_id == actionItem.attributeId).attr_value_desc == actionItem.value)
  aliAttr.value = []
  priceList.value = []
  skuItem.forEach(item => {
    let qtyItem = {}
    if(itemInventory.value.length>0){
      qtyItem = itemInventory.value[0].inventory_list.find(sk => {
        return sk.sku_id == item.sku_id
      })
    }else{
      qtyItem = {
        inventory_count: 0,
      }
    }
    aliAttr.value.push({ attributeId: item.sku_attr_list[0].attr_name_id, value: item.sku_attr_list[0].attr_value_desc, valueTrans: item.sku_attr_list[0].attr_value_desc, image: item.sku_attr_list[0].attr_value_image })
    priceList.value.push({ price: item.ladder_price[0].price, qty: qtyItem.inventory_count })
  })
  const sizeNumber = aliAttr.value.map(() => 0)
  // skuNumber.value = []
  aliAttrs.value.map(() => { skuNumber.value.push({ sizeNumber: sizeNumber.slice(), value: 0 }) })
}

function addAndRound(num1, num2, num3, num4) {
  if (num2 === '') num2 = 0; else num2 = parseFloat(num2)
  num1 = parseFloat(num1)
  num3 = parseFloat(num3)
  num4 = parseFloat(num4)
  const sum = Math.round((num1 + num2 + num3 + num4) * 100) / 100
  return parseFloat(sum.toFixed(2))
}

function getTotalPrice() {
  if (freightList.value.length > 0 && shopSource.value == 5) AllPrice.value = addAndRound(totalPrice.value, freightList.value[actionFre.value].freight, purchaseFee.value, freightFee.value)
  else AllPrice.value = addAndRound(totalPrice.value, 0, purchaseFee.value, freightFee.value)
  return AllPrice.value
}

function getTotalPrices(){
  let freights = freightList.value.length>0 ? freightList.value[actionFre.value].freight : 0
  AllCost.value = addAndRound(totalPrice.value, freights, purchaseFee.value, freightFee.value)
  return AllCost.value
}

function getPurchase() {
  const skuInfoData = skuData.value.map(item => ({ skuId: item.specId, number: item.num }))
  return getPurchaseFee({ price: totalPrice.value, currency: 2, offerId: shopId.value, skuInfo: skuInfoData }).then(res => {
    purchaseFee.value = res.data.data.purchase_fee
    freightFee.value = res.data.data.freight
  })
}

function selectMeth(index) {
  if (freightList.value[index].freight !== '') {
    selectedGender.value = index;
    selectTran.value = index;
    getTotalPrice()
  }
}

function initData() {
  getCountry({}).then(res => {
    let endCountry = res.data.data.endCountry
    countryOptions.value = endCountry
    filteredOptions.value = endCountry.map(item => ({ value: item.en_nickname, label: item.en_nickname }))
    options.value = JSON.parse(JSON.stringify(filteredOptions.value))
    getDefault().then(req => {
      selectedValue.value = req.data.data.name
      searchText.value = req.data.data.name
      for (let i = 0; i < endCountry.length; i++) {
        if(req.data.data.name_en == endCountry[i].zh_cn_nickname){
          actionRegion.value = endCountry[i].code_two
          break
        }
      }
    })
    // selectedValue.value = 'Mexico'
    // actionRegion.value = 'MX'
  })
}

function fetchShipPrice(totalShipping, totalVolume) {
  const country = countryOptions.value.find(item => item.en_nickname.toUpperCase() == selectedValue.value.toUpperCase())
  isFreight.value = true
  return getPrice({ dispatch_country: actionRegion.value, shipping_to: country.zh_cn_nickname, weight: totalShipping, volume: totalVolume, shipping_to_en: selectedValue.value }).then(res => {
    const data = res.data.data
    if (data.length == 0 || includeShiping()) { freightList.value = [] }
    else {
      actionFre.value = 0; selectTran.value = 0;
      // freightList.value = []
      freightList.value = data.map(item => ({ name: item.product_name_e, freight: item.super_freight, time: item.aging_start + '~' + item.aging_end, vendor: item.vendor_code}))
    }
    moreFreight.value = false; isFreight.value = false; getTotalPrice()
  })
}

function fetchShipPriceAli(totalShipping) {
  const country = countryOptions.value.find(item => item.en_nickname.toUpperCase() == selectedValue.value.toUpperCase())
  isFreight.value = true
  return getPrice({ dispatch_country: actionRegion.value, shipping_to: country.zh_cn_nickname, weight: totalShipping, product_id: shopId.value, source: 5, total: totalNumber.value, shipping_to_en: selectedValue.value, goodsSkuAndNum: skuData.value }).then(res => {
    const data = res.data.data
    if (data.length == 0 || includeShiping()) { freightList.value = [] }
    else {
      actionFre.value = 0; selectTran.value = 0; freightList.value = data.map(item => ({ name: item.product_name_e, freight: item.freight, time: item.aging_start + '~' + item.aging_end, vendor: item.vendor_code }))
    }
    moreFreight.value = false; isFreight.value = false; getTotalPrice()
  })
}

function includeShiping() {
  if (isShippingIncluded.value == '1' && selectedValue.value.toUpperCase() == 'UNITED STATES') return true
  return false
}

function getAliWeight(skuId) {
  if (skuShippingDetails.value.length == 0) return 0
  const data = skuShippingDetails.value.find(item => item.skuId == skuId)
  if (data != undefined) {
    // const v = parseFloat((data.height * data.length * data.width / 8000).toFixed(2))
    // if (v > parseFloat(data.weight)) return v
    return data.weight
  }
  return 0
}

function getAliVolume(skuId) {
  if (skuShippingDetails.value.length == 0) return 0
  const data = skuShippingDetails.value.find(item => item.skuId == skuId)
  if (data != undefined) {
    const v = parseFloat(data.height * data.length * data.width)
    return v
  }
  return 0
}

function computeTotal() {
  let totalShipping = 0
  totalNumber.value = 0
  totalPrice.value = 0
  skuData.value = getSku()
  skuData.value.map(item => { totalPrice.value += item.total_price })
  const total_weight_v = skuData.value.reduce((total, item) => total + multiply(item.weight, item.num), 0)
  total_weight.value = total_weight_v
  const total_volume_v = skuData.value.reduce((total, item) => total + multiply(item.volume, item.num), 0)
  total_volume.value = total_volume_v
  showLoading.value = true
  Promise.all([fetchShipPrice(total_weight_v, total_volume_v), getPurchase()]).then(() => { showLoading.value = false }).catch(() => { showLoading.value = false })
  skuNumber.value.map(item => { totalNumber.value += item.value })
  totalShipping = parseFloat(totalShipping.toFixed(2))
  totalPrice.value = parseFloat(totalPrice.value.toFixed(2))
  getTotalPrice()
}

function computeTotalAli() {
  let totalShipping = 0
  totalNumber.value = 0
  totalPrice.value = 0
  skuData.value = getSkuAli()
  skuData.value.map(item => { totalPrice.value += item.total_price })
  const total_weight_v = skuData.value.reduce((total, item) => total + multiply(item.weight, item.num), 0)
  total_weight.value = total_weight_v
  showLoading.value = true
  skuNumber.value.map(item => { totalNumber.value += item.value })
  Promise.all([fetchShipPriceAli(total_weight_v), getPurchase()]).then(() => { showLoading.value = false }).catch(() => { showLoading.value = false })
  totalShipping = parseFloat(totalShipping.toFixed(2))
  totalPrice.value = parseFloat(totalPrice.value.toFixed(2))
  getTotalPrice()
}

function computeTotals() {
  let totalShipping = 0
  // totalNumber.value = 0
  totalPrice.value = 0
  skuData.value = getSkuAlis()
  skuData.value.map(item => { totalPrice.value += item.total_price })
  const total_weight_v = skuData.value.reduce((total, item) => total + multiply(item.weight, item.num), 0)
  total_weight.value = total_weight_v
  showLoading.value = true
  // skuNumber.value.map(item => { totalNumber.value += item.value })
  Promise.all([fetchShipPriceAli(total_weight_v), getPurchase()]).then(() => { showLoading.value = false }).catch(() => { showLoading.value = false })
  totalShipping = parseFloat(totalShipping.toFixed(2))
  totalPrice.value = parseFloat(totalPrice.value.toFixed(2))
  getTotalPrice()
}

function getSkuAlis() {
  const skuDataV = []
  let price = 0
  let skus = skuInfo.value[0].ladder_price
  for (let n = skus.length - 1; n >= 0; n--) {
    if (count.value >= skus[n].min_quantity) {
      price = skus[n].price;
      break
    }
  }
  skuDataV.push({
    num: count.value,
    skuId: skuInfo.value[0].sku_id,
    weight: 0,
    total_price: count.value * price,
    delivery_area_code: actionRegion.value
  })
  return skuDataV
}

function multiply(a, b) { return parseFloat((a * b).toFixed(2)) }

function reduceCount() { if (count.value > 1) { count.value--; totalPrice.value = multiply(count.value, priceRange.value); totalNumber.value = count.value } }
function addCount() { count.value++; totalPrice.value = multiply(count.value, priceRange.value); totalNumber.value = count.value }
function blurCount() { totalPrice.value = count.value * priceRange.value; totalNumber.value = count.value }

function selecReg(v, k) { actionRegion.value = v.code; totalPrice.value = 0; count.value = 0; totalNumber.value = 0; priceRange.value = divide(v.platform_product_price, exchange.value) }

function selecRegAli(v) { actionRegion.value = v.country_code === undefined ? 'US' : v.country_code; selectRegion.value = v.warehouse_id; fromAddress.value = v.country; computeTotalAli() }

function selecVari(row, index) { bigImage.value = row.image; actionColor.value = index }

function loadEnd() { loadingPanel.value.style = 'display:none;'; productPanel.value.style = 'display:block;' }

function reduceNum(index) {
  if (skuNumber.value[actionColor.value].sizeNumber[index] > 0) {
    skuNumber.value[actionColor.value].sizeNumber[index]--
    skuNumber.value[actionColor.value].value--
    const sizeNumberArr = skuNumber.value[actionColor.value].sizeNumber
    const valueV = skuNumber.value[actionColor.value].value
    skuNumber.value.splice(actionColor.value, 1, { sizeNumber: sizeNumberArr, value: valueV })
  }
  if (shopSource.value == 5) computeTotalAli(); else computeTotal();
  totalShippingFn(index)
}

function reduceNums() {
  if (count.value > 1) {
    count.value--;
    // totalPrice.value = multiply(count.value, priceRange.value);
    totalNumber.value = count.value
  }
  computeTotals();
}

function addNums() {
  count.value++;
  // totalPrice.value = multiply(count.value, priceRange.value);
  totalNumber.value = count.value
  computeTotals();
}
function blurNumbers() {
  // totalPrice.value = count.value * priceRange.value;
  count.value = Number(count.value)
  totalNumber.value = count.value
  computeTotals();
}

function countLimit() { if (onlyOne.value) { if (totalNumber.value >= 1) { showGlobalTooltip('Limited to one purchase!', 'info'); return false } else return true } return true }

let throttleAddNum = null
function throttle(func, limit) {
  let inThrottle = false
  return function (...args) {
    if (!inThrottle) { func(...args); inThrottle = true; setTimeout(() => { inThrottle = false }, limit) }
  }
}

function addNum(index) { if (!throttleAddNum) throttleAddNum = throttle((i) => { if (countLimit()) { skuNumber.value[actionColor.value].sizeNumber[i]++; skuNumber.value[actionColor.value].value++; const sizeNumberArr = skuNumber.value[actionColor.value].sizeNumber; const valueV = skuNumber.value[actionColor.value].value; skuNumber.value.splice(actionColor.value, 1, { sizeNumber: sizeNumberArr, value: valueV }); if (shopSource.value == 5) computeTotalAli(); else computeTotal(); } }, 500); throttleAddNum(index) }

function blurNumber(index) {
  let numbers = skuNumber.value[actionColor.value].sizeNumber[index]
  let number = 0
  if (numbers > 0) number = Math.max(0, parseInt(numbers, 10))
  const sizeNumberArr = skuNumber.value[actionColor.value].sizeNumber
  sizeNumberArr[index] = number
  const valueV = sizeNumberArr.reduce((acc, cur) => acc + parseInt(cur, 10), 0)
  skuNumber.value.splice(actionColor.value, 1, { sizeNumber: sizeNumberArr, value: valueV })
  if (shopSource.value == 5) computeTotalAli(); else computeTotal();
  totalShippingFn(index)
}

function totalShippingFn(index) {
  showLoading.value = true
  totalNumber.value = 0
  skuNumber.value.map(item => { totalNumber.value += item.value })
  if (priceList.value[index] && priceList.value[index].weight != 0) { showLoading.value = false; return }
  getWeght({ categoryId: categoryId.value, price: priceList.value[index].cnPrice }).then(res => {
    priceList.value[index].weight = res.data.net_weight
    if (shopSource.value == 5) computeTotalAli(); else computeTotal();
    showLoading.value = false
  }).catch(() => {
    priceList.value[index].weight = 0
    showLoading.value = false
    if (shopSource.value == 5) computeTotalAli(); else computeTotal();
  })
}

function showImage(image) { bigImage.value = image; action.value = -1 }
function selectImage(index) { action.value = index; bigImage.value = swiperImages.value[index] }

function getSku() {
  const skuDataV = []
  if (colorAttribute.value.length > 0) {
    skuNumber.value.map((item, index) => {
      if (item.value > 0) {
        item.sizeNumber.map((sm, i) => {
          if (sm > 0) {
            const color = colorAttribute.value[index].value
            const size = sizeAttribute.value[i].value
            const skuMag = lookSku(color, size)
            let price = 0
            let productPrices = productPrice.value
            // if(quoteType.value == 2){
            //   price = divide(promotionPrice.value, exchange.value)
            // }else 
            if(quoteType.value == 1){
              if (skuMag.price) price = divide(skuMag.price, exchange.value)
              else if (skuMag.jxhyPrice) price = divide(skuMag.jxhyPrice, exchange.value)
              else price = divide(skuMag.consignPrice, exchange.value)
            }else{
              for(let i=productPrices.length-1;i>=0;i--){
                if(sm>=productPrices[i].startQuantity){
                  if(productPrices[i].promotionPrice){
                    price = divide(productPrices[i].promotionPrice, exchange.value)
                  }else{
                    price = divide(productPrices[i].price, exchange.value)
                  }
                  break;
                }
                if(i==0){
                  if(productPrices[i].promotionPrice){
                    price = divide(productPrices[i].promotionPrice, exchange.value)
                  }else{
                    price = divide(productPrices[i].price, exchange.value)
                  }
                }
              }
            }
            const weight = getAliWeight(skuMag.skuId)
            const volume = getAliVolume(skuMag.skuId)
            skuDataV.push({ num: sm, skuId: skuMag.skuId, weight, volume, total_price: sm * price, specId: skuMag.specId })
          }
        })
      }
    })
  } else {
    skuNumber.value.map((item) => {
      if (item.value > 0) {
        item.sizeNumber.map((sm, i) => {
          if (sm > 0) {
            const size = sizeAttribute.value[i].value
            const skuMag = lookSku1(size)
            let price = 0
            let productPrices = productPrice.value
            // if(quoteType.value == 2){
            //   price = divide(promotionPrice.value, exchange.value)
            // }else 
            if(quoteType.value == 1){
              if (skuMag.price) price = divide(skuMag.price, exchange.value)
              else if (skuMag.jxhyPrice) price = divide(skuMag.jxhyPrice, exchange.value)
              else price = divide(skuMag.consignPrice, exchange.value)
            }else{
              for(let i=productPrices.length-1;i>=0;i--){
                if(sm>=productPrices[i].startQuantity){
                  if(productPrices[i].promotionPrice){
                    price = divide(productPrices[i].promotionPrice, exchange.value)
                  }else{
                    price = divide(productPrices[i].price, exchange.value)
                  }
                  break;
                }
                if(i==0){
                  if(productPrices[i].promotionPrice){
                    price = divide(productPrices[i].promotionPrice, exchange.value)
                  }else{
                    price = divide(productPrices[i].price, exchange.value)
                  }
                }
              }
            }
            const weight = getAliWeight(skuMag.skuId)
            const volume = getAliVolume(skuMag.skuId)
            skuDataV.push({ num: sm, skuId: skuMag.skuId, weight, volume, total_price: sm * price, specId: skuMag.specId })
          }
        })
      }
    })
  }
  return skuDataV
}

function lookSku(att1, att2) { return skuInfo.value.find(sku => normalizeString(sku.skuAttributes[0].value) == normalizeString(att1) && normalizeString(sku.skuAttributes[1].value) == normalizeString(att2)) }
function lookSku1(att1) { return skuInfo.value.find(sku => normalizeString(sku.skuAttributes[0].value) == normalizeString(att1)) }

function getSkuAli() {
  const skuDataV = []
  if (aliAttrs.value.length > 0) {
    skuNumber.value.map((item, index) => {
      if (item.value > 0) {
        item.sizeNumber.map((sm, i) => {
          if (sm > 0) {
            const color = aliAttrs.value[index].value
            const size = aliAttr.value[i].value
            const skuMag = lookSkuAli(color, size)
            let price = 0
            if (sm < skuMag.ladder_price[0].min_quantity) price = skuMag.ladder_price[0].price
            else { for (let n = skuMag.ladder_price.length - 1; n >= 0; n--) { if (sm >= skuMag.ladder_price[n].min_quantity) { price = skuMag.ladder_price[n].price; break } } }
            if (itemInventory.value.length > 0) {
              const itemlist = itemInventory.value[0].inventory_list
              for (let ia = 0; ia < itemlist.length; ia++) {
                if (skuMag.sku_id == itemlist[ia].sku_id) {
                  if (sm > itemlist[ia].inventory_count) {
                    sm = Number(itemlist[ia].inventory_count)
                    skuNumber.value[index].sizeNumber[i] = sm
                    skuNumber.value[index].value = 0
                    for (let ib = 0; ib < skuNumber.value[index].sizeNumber.length; ib++) { skuNumber.value[index].value += skuNumber.value[index].sizeNumber[ib] }
                  }
                }
              }
            }
            skuDataV.push({ num: sm, skuId: skuMag.sku_id, weight: 0, total_price: sm * price, delivery_area_code: actionRegion.value })
          }
        })
      }
    })
  } else {
    skuNumber.value.map((item, index) => {
      if (item.value > 0) {
        item.sizeNumber.map((sm, i) => {
          if (sm > 0) {
            let price = 0
            let skuMag = {}
            if (skuInfo.value[0].sku_id != -1) {
              skuMag = lookSkuAlis(aliAttr.value[i].value)
              if (sm < skuMag.ladder_price[0].min_quantity) price = skuMag.ladder_price[0].price
              else { for (let n = skuMag.ladder_price.length - 1; n >= 0; n--) { if (sm >= skuMag.ladder_price[n].min_quantity) { price = skuMag.ladder_price[n].price; break } } }
            } else {
              skuMag = { sku_id: skuInfo.value[0].sku_id }
              if (sm < skuInfo.value[0].ladder_price[0].min_quantity) price = skuInfo.value[0].ladder_price[0].price
              else { for (let n = skuInfo.value[0].ladder_price.length - 1; n >= 0; n--) { if (sm >= skuInfo.value[0].ladder_price[n].min_quantity) { price = skuInfo.value[0].ladder_price[n].price; break } } }
            }
            if (itemInventory.value.length > 0) {
              const itemlist = itemInventory.value[0].inventory_list
              for (let ia = 0; ia < itemlist.length; ia++) {
                if (skuMag.sku_id == itemlist[ia].sku_id) {
                  if (sm > itemlist[ia].inventory_count) {
                    sm = Number(itemlist[ia].inventory_count)
                    skuNumber.value[index].sizeNumber[i] = sm
                    skuNumber.value[index].value = 0
                    for (let ib = 0; ib < skuNumber.value[index].sizeNumber.length; ib++) { skuNumber.value[index].value += skuNumber.value[index].sizeNumber[ib] }
                  }
                }
              }
            }
            skuDataV.push({ num: sm, skuId: skuMag.sku_id, weight: 0, total_price: sm * price, delivery_area_code: actionRegion.value })
          }
        })
      }
    })
  }
  return skuDataV
}

function lookSkuAli(att1, att2) { return skuInfo.value.find(sku => sku.sku_attr_list[1].attr_value_desc == att1 && sku.sku_attr_list[0].attr_value_desc == att2) }
function lookSkuAlis(att1) { return skuInfo.value.find(sku => sku.sku_attr_list[0].attr_value_desc == att1) }

function addShop() {
  if (isLogin()) {
    if (!loadingShop.value) {
      loadingShop.value = true
      addShopList({ source: shopSource.value, goodsId: shopId.value, country_code: actionRegion.value }).then(res => {
        if (res.data.code == 0) { loadingShop.value = false; showGlobalTooltip('Success!') }
        else { loadingShop.value = false; showGlobalTooltip(res.data.msg, 'info') }
      })
    }
  } else {
    window.open(config.public.loginUrl, '_blank')
    showGlobalTooltip('Please log', 'info')
  }
}

function addCar() {
  let vendor = ''
  if (freightList.value.length > 0) vendor = freightList.value[actionFre.value].vendor
  let dataSku = []
  if(attrType.value == 1){
    dataSku = getSkuAlis()
  }else{
    dataSku = shopSource.value == 5 ? getSkuAli() : getSku()
  }
  let totalNum = 0
  for(let i=0;i<dataSku.length;i++){
    totalNum += dataSku[i].num
  }
  if (isLogin()) {
    if (totalNum >= leastQuantity.value || count.value > 0) {
      if (!loadingCart.value) {
        loadingCart.value = true
        let payloadSku = dataSku
        if (shopSource.value == 4) {
          payloadSku = [{ num: count.value, weight: 0, total_price: totalPrice.value, skuId: west_sku.value, delivery_area_code: actionRegion.value }]
        }
        addCartList({ goodsSkuAndNum: payloadSku, source: shopSource.value, goodsId: shopId.value, delivery_area_code: actionRegion.value, vendor_code: vendor }).then(res => {
          if (res.data.code == 0) showGlobalTooltip('Success!')
          else showGlobalTooltip(res.data.msg, 'info')
          loadingCart.value = false
          clearCart()
        })
      }
    } else { showCart.value = true }
  } else {
    if (totalNum >= leastQuantity.value || count.value > 0) {
      if (!loadingCart.value) {
        loadingCart.value = true
        let payloadSku = dataSku
        if (shopSource.value == 4) {
          payloadSku = [{ num: count.value, weight: 0, total_price: totalPrice.value, skuId: west_sku.value, delivery_area_code: actionRegion.value }]
        }
        addCartList({ goodsSkuAndNum: payloadSku, source: shopSource.value, goodsId: shopId.value, delivery_area_code: actionRegion.value, vendor_code: vendor }).then(res => {
          if (res.data.code == 0) showGlobalTooltip('Success!')
          else showGlobalTooltip(res.data.msg, 'info')
          loadingCart.value = false
          clearCart()
        })
      }
    } else { showCart.value = true }
  }
}

function clearCart() {
  showCart.value = false
  totalFreight.value = 0
  totalNumber.value = 0
  totalPrice.value = 0
  count.value = 0
  skuData.value = []
  freightList.value = []
  purchaseFee.value = 0
  freightFee.value = 0
  if (skuNumber.value.length) {
    const sizeNumberArr = skuNumber.value[0].sizeNumber.map(() => 0)
    skuNumber.value.map((item, index) => { skuNumber.value[index].sizeNumber = JSON.parse(JSON.stringify(sizeNumberArr)); skuNumber.value[index].value = 0 })
  }
}

function changeFreight() { selectTran.value = actionFre.value; searchText.value = selectedValue.value; selectedOption.value = { value: selectedValue.value, label: selectedValue.value }; showTransfer.value = true; shippingModal.value.style = 'display:flex;' }
function confirmTrans() { actionFre.value = selectTran.value; showTransfer.value = false; shippingModal.value.style = 'display:none;' }
function closeShippingModal() { showTransfer.value = false; shippingModal.value.style = 'display:none;' }

function focusOption() { toAddress.value = searchText.value; showDropdown.value = true }
function blurOption() { searchText.value = toAddress.value }
function toggleDropdown() { showDropdown.value = !showDropdown.value; if (showDropdown.value) filteredOptions.value = options.value }
function closeDropdown() { showDropdown.value = false }
function filterOptions() { if (!searchText.value) { filteredOptions.value = options.value; return } filteredOptions.value = options.value.filter(option => option.label.toLowerCase().includes(searchText.value.toLowerCase())) }
async function selectOption(option) {
  const country = countryOptions.value.find(item => item.en_nickname.toUpperCase() == option.label.toUpperCase())
  actionRegion.value = country.code_two
  selectedOption.value = option; toAddress.value = option.label; searchText.value = option.label; selectedValue.value = option.label; showDropdown.value = false; showLoading.value = true;
  showLoading.value = false
  if(skuData.value.length>0){
    skuData.value[0].delivery_area_code = country.code_two
    if (shopSource.value == 5) await fetchShipPriceAli(total_weight.value); else await fetchShipPrice(total_weight.value, total_volume.value);
  }
  
}

function goList() { window.open(`${config.public.orderUrl.replace('/admin/order','')}/admin/account/Publish?id=${shopId.value}&source=${shopSource.value}&region=${code.value}`, '_blank') }

function buyNow() {
  let vendor = ''
  if (freightList.value.length > 0) vendor = freightList.value[actionFre.value].vendor
  let dataSku = []
  if(attrType.value == 1){
    dataSku = getSkuAlis()
  }else{
    dataSku = shopSource.value == 5 ? getSkuAli() : getSku()
  }
  let totalNum = 0
  for(let i=0;i<dataSku.length;i++){
    totalNum += dataSku[i].num
  }
  if (isLogin()) {
    if (totalNum >= leastQuantity.value || count.value > 0) {
      if (onlyOne.value && totalNumber.value != 1) { showGlobalTooltip('You can only purchase one', 'info'); return }
      let encodedParam = ''
      if (shopSource.value == 4) {
        const jsonString = JSON.stringify([{ num: count.value, weight: 0, total_price: totalPrice.value, skuId: west_sku.value, delivery_area_code: actionRegion.value, delivery_region_name: actionRegion.value }])
        encodedParam = encodeURIComponent(jsonString)
      } else {
        const jsonString = JSON.stringify(dataSku)
        encodedParam = encodeURIComponent(jsonString)
      }
      window.open(`${config.public.orderUrl}?sku=${encodedParam}&offerId=${shopId.value}&onlyOne=${onlyOne.value}&source=${shopSource.value}&vendor=${vendor}`, '_blank')
      clearCart()
    } else { showCart.value = true }
  } else {
    showGlobalTooltip('Please log in first', 'info')
    window.open(`${config.public.loginUrl}`, '_blank')
  }
}

function search() {
  const textEl = document.getElementById('navInput')
  const text = textEl ? textEl.value : ''
  if (text !== '') { if (shopSource.value == 5) window.open(`/specialAreas?keyword=${text}`, '_self'); else window.open(`/searchResult?keyword=${encodeURIComponent(text)}`, '_self') }
}

function searchImg() { iptFileRef.value.click() }
function uploadFiles(e) {
  const data = new FormData()
  data.append('file', e.target.files[0])
  if (shopSource.value == 5) {
    getEcoBuyerItemAdd(data).then(res => { window.localStorage.setItem('aliSearchImg', res.data.data.image); window.open(`/searchResultAli?imageId=${res.data.data.item_id}`, '_self') })
  } else {
    getImgId(data).then(res => { window.localStorage.setItem('SearchImg', res.data.data.img); window.open(`/searchResult?imageId=${res.data.data.imageId}`, '_self') })
  }
}

function chatNow() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')
  let chat_info
  let username = ''
  if (userInfo) { chat_info = userInfo.manage; username = `${userInfo.first_name} ${userInfo.last_name}` }
  else { const ci = JSON.parse(localStorage.getItem('chat_info') || '{}'); chat_info = ci.manage; username = ci.chat_id }
  const msg = { page: 'Product', product: shopDetail.subjectTrans, link: location.href }
  const text = `Customer: ${username} | Source: ${msg.page} | Product: ${msg.product} | Link: ${msg.link} `
  window.open('https://api.whatsapp.com/send?phone=' + chat_info.whatsappp + '&text=' + encodeURIComponent(text), '_blank')
}

function chatNows() {
  let productItem = {
    id: shopId.value,
    source: shopSource.value,
  }
  localStorage.setItem("askProduct", JSON.stringify(productItem))
  chatText()
}

const categoryId = ref(0)
const isShippingIncluded = ref('')

function enableCustomLayout () {
  if(shopSource.value == 5){
    if(code.value == 'MX'){
      setPageLayout('mxtop')
    }else{
      setPageLayout('alitop')
    }
  }else{
    setPageLayout('default')
  }
}

function reduceNumPrice () {
  if (oneQty.value > 1) {
    oneQty.value--;
    totalNumber.value = oneQty.value
  }
  computeTotalOne();
}

function addNumPrice () {
  oneQty.value++;
  totalNumber.value = oneQty.value
  computeTotalOne();
}

function blurNumPrice () {
  oneQty.value = Number(oneQty.value)
  totalNumber.value = oneQty.value
  computeTotalOne();
}

function computeTotalOne() {
  let sm = oneQty.value
  if (sm > 0) {
    let total_price= 0
    let total_weight_v = 0
    let total_volume_v = 0
    let price = 0
    let productPrices = productPrice.value
    if(productPriceList.value.length==1){
      price = productPriceList[0].value
    }else{
      for(let i=productPrices.length-1;i>=0;i--){
        if(sm>=productPrices[i].startQuantity){
          price = divide(productPrices[i].price, exchange.value)
          break;
        }
        if(i==0){
          price = divide(productPrices[i].price, exchange.value)
        }
      }
    }
    total_price = sm*price
    totalPrice.value = parseFloat(total_price.toFixed(2))
    total_weight_v = sm*oneWeight.value
    total_weight.value = parseFloat(total_weight_v)
    total_volume_v = sm*oneVolume.value
    total_volume.value = parseFloat(total_volume_v)
    Promise.all([fetchShipPrice(total_weight_v, total_volume_v), getPurchaseOne()]).then(() => { showLoading.value = false }).catch(() => { showLoading.value = false })
    getTotalPrice()
  }
}

function getPurchaseOne() {
  const skuInfoData = [{ skuId: '', number: oneQty.value }]
  getPurchaseFee({
    price: totalPrice.value,
    currency: 2,
    offerId: shopId.value,
    skuInfo: skuInfoData
  }).then(res => {
    purchaseFee.value = res.data.data.purchase_fee
    freightFee.value = res.data.data.freight
  })
}

function addCars() {
  let vendor = ''
  if (freightList.value.length > 0) vendor = freightList.value[actionFre.value].vendor
  if (totalNumber.value >= leastQuantity.value) {
    if (!loadingCart.value) {
      loadingCart.value = true
      let payloadSku = [{
        num: totalNumber.value,
        weight: total_weight.value,
        total_price: totalPrice.value,
        skuId: '',
        specId: '',
      }]
      addCartList({ goodsSkuAndNum: payloadSku, source: shopSource.value, goodsId: shopId.value, delivery_area_code: actionRegion.value, vendor_code: vendor }).then(res => {
        if (res.data.code == 0) showGlobalTooltip('Success!')
        else showGlobalTooltip(res.data.msg, 'info')
        loadingCart.value = false
        clearCarts()
      })
    }
  } else { showCart.value = true }
}

function buyNows() {
  let vendor = ''
  if (freightList.value.length > 0) vendor = freightList.value[actionFre.value].vendor
  if (isLogin()) {
    if (totalNumber.value >= leastQuantity.value) {
      let encodedParam = ''
      let dataSku = [{
        num: totalNumber.value,
        weight: total_weight.value,
        total_price: totalPrice.value,
        skuId: '',
        specId: '',
      }]
      const jsonString = JSON.stringify(dataSku)
      encodedParam = encodeURIComponent(jsonString)
      window.open(`${config.public.orderUrl}?sku=${encodedParam}&offerId=${shopId.value}&onlyOne=${onlyOne.value}&source=${shopSource.value}&vendor=${vendor}`, '_blank')
      clearCarts()
    } else { showCart.value = true }
  } else {
    showGlobalTooltip('Please log in first', 'info')
    window.open(`${config.public.loginUrl}`, '_blank')
  }
}

function clearCarts() {
  showCart.value = false
  totalFreight.value = 0
  totalNumber.value = 0
  totalPrice.value = 0
  oneQty.value = 0
  // skuData.value = []
  freightList.value = []
  purchaseFee.value = 0
  freightFee.value = 0
  // if (skuNumber.value.length) {
  //   const sizeNumberArr = skuNumber.value[0].sizeNumber.map(() => 0)
  //   skuNumber.value.map((item, index) => { skuNumber.value[index].sizeNumber = JSON.parse(JSON.stringify(sizeNumberArr)); skuNumber.value[index].value = 0 })
  // }
}

onMounted(() => {
  const params = route.query
  code.value = String(params.code || '')
  shopId.value = String(params.id || '')
  onlyOne.value = String(params.onlyOne || '') === 'true' || String(params.onlyOne || '') === '1'
  shopSource.value = Number(params.source || 0)
  // if (shopSource.value == 5) {  
  //   // 修改layout 
  //   if(code.value == 'MX'){
  //     setPageLayout('mxtop')
  //   }else{
  //     setPageLayout('alitop')
  //   }
  // }
  keyword.value = String(params.keyword || '')
  link.value = `https://detail.1688.com/offer/${shopId.value}.html`
  overdue.value = false
  enableCustomLayout()
  initData()
  window.addEventListener('scroll', scrollHandler)
  getRate().then(res => {
    exchange.value = res.data.data.exchange_rate
    getDetail({ offerId: shopId.value, source: shopSource.value, code: code.value, keyword: keyword.value }).then(res2 => {
      if(res2.data.data.length == 0){
        overdue.value = true
      }
      if (res2.data.code == 0) {
        if (shopSource.value == 4) {
          const info = res2.data.data
          isShippingIncluded.value = ''
          west_sku.value = info.main_info.product_sku_id
          shop_name.value = 'WestMonth'
          shopDetail.subjectTrans = info.sub_info.name
          shopDetail.description = info.sub_info.description
          swiperImages.value = info.sub_info.images.map(i => i.preview)
          bigImage.value = swiperImages.value[0]
          wVariables.value = info.sub_info.variables
          const obj = info.main_info.delivery_regions
          const regions = []
          for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { regions.push({ name: obj[key].name_en, code: obj[key].delivery_region_name, platform_product_price: obj[key].platform_product_price, id: obj[key].delivery_region_id, qty: obj[key].qty }) } }
          actionRegion.value = regions.find(item => item.id == info.main_info.delivery_region_id).code
          skuInfo.value = [{ region_id: actionRegion.value, regions: regions, delivery_regions: info.main_info.delivery_regions, origin_price: info.main_info.platform_product_price, price: divide(info.main_info.platform_product_price, exchange.value) }]
          actionRegion.value = skuInfo.value[0].region_id
          priceRange.value = skuInfo.value[0].price
          priceRangeList.price = priceRange.value
          priceRangeList.startQuantity = 1
          loadingPage.value = false
          loadEnd()
          quoteType.value = 1
        } else if (shopSource.value == 5) {
          const data = res2.data.data
          if(data.skus[0].ladder_price.length == 0){
            overdue.value = true
          }
          isShippingIncluded.value = ''
          shop_name.value = data.supplier
          shopDetail.subjectTrans = data.title
          shopDetail.description = data.description
          swiperImages.value = data.images
          itemInventory.value = data.itemInventory
          bigImage.value = swiperImages.value[0]
          priceRangeList.price = data.skus[0].ladder_price[0].price
          priceRangeList.startQuantity = data.skus[0].ladder_price[0].min_quantity
          data.skus[0].ladder_price.forEach(item => { const numPrice = item.max_quantity == -1 ? `>= ${item.min_quantity} pieces` : `${item.min_quantity} - ${item.max_quantity} pieces`; aliPrice.value.push({ num: numPrice, price: item.price }) })
          quoteType.value = 1
          categoryId.value = data.category_id
          priceRange.value = priceRangeList.price
          aliLink.value = data.detail_url
          aliWarehouse.value = data.warehouselist || []
          const country = countryOptions.value.find(item => item.code_two.toUpperCase() == String(params.code || '').toUpperCase())
          if (country) fromAddress.value = country.en_nickname
          skuInfo.value = data.skus
          const attribute = data.skus
          const attr1 = []
          const attr2 = []
          if (skuInfo.value[0].sku_id != -1) {
            skuInfo.value[0].sku_attr_list.map(item => { skuAttributes.value.push(item.attr_name_id) })
            for (let i = 0; i < attribute.length; i++) {
              attr1.push({ attributeId: attribute[i].sku_attr_list[0].attr_name_id, value: attribute[i].sku_attr_list[0].attr_value_desc, valueTrans: attribute[i].sku_attr_list[0].attr_value_desc, image: attribute[i].sku_attr_list[0].attr_value_image })
              if (skuAttributes.value.length > 1) { attr2.push({ attributeId: attribute[i].sku_attr_list[1].attr_name_id, value: attribute[i].sku_attr_list[1].attr_value_desc, valueTrans: attribute[i].sku_attr_list[1].attr_value_desc, price: 0, image: attribute[i].sku_attr_list[1].attr_value_image }) }
            }
            attrName.value = attribute[0].sku_attr_list[0].attr_name_desc
          } else {
            attrType.value = 1
            aliAttr.value = [{ attributeId: skuInfo.value[0].product_id, value: '', valueTrans: '', image: '' }]
            if(itemInventory.value.length > 0){
              attrInventory.value = data.itemInventory[0].inventory_list[0].inventory_count
            }
          }
          const dedup = (arr, t) => { const newArr = []; const assignList = []; for (let i = 0; i < arr.length; i++) { if (!assignList.includes(arr[i][t])) { assignList.push(arr[i][t]); newArr.push(arr[i]) } } return newArr }
          aliAttr.value = dedup(attr1, 'value')
          if (skuAttributes.value.length > 1) { aliAttrs.value = dedup(attr2, 'value'); attrNames.value = data.skus[0].sku_attr_list[1].attr_name_desc; setColorPriceAli() }
          else {
            priceList.value = []
            if (skuInfo.value[0].sku_id != -1) {
              aliAttr.value.map(item => {
                const skuItem = skuInfo.value.find(sku => sku.sku_attr_list.find(sk => sk.attr_name_id == item.attributeId).attr_value_desc == item.value);
                let qtyItem = {}
                if(itemInventory.value.length>0){
                  qtyItem = itemInventory.value[0].inventory_list.find(sk => {
                    return skuInfo.value.find(sku => sk.sku_id == sku.sku_id)
                  })
                }else{
                  qtyItem = {
                    inventory_count: 0,
                  }
                }
                priceList.value.push({ price: skuItem.ladder_price[0].price, qty: qtyItem.inventory_count })
              })
            }
            else {
              let qtyItem = {}
              if(itemInventory.value.length>0){
                qtyItem = itemInventory.value[0].inventory_list[0]
              }else{
                qtyItem = {
                  inventory_count: 0,
                }
              }
              priceList.value = [{ price: skuInfo.value[0].ladder_price[0].price, qty: qtyItem.inventory_count }]
            }
            const sizeNumber = aliAttr.value.map(() => 0)
            skuNumber.value.push({ sizeNumber: sizeNumber.slice(), value: 0 })
          }
          loadingPage.value = false
          loadEnd()
        } else {
          const data = res2.data.data
          isShippingIncluded.value = data.isShippingIncluded
          shop_name.value = data.shop_name
          shopDetail.subjectTrans = data.subjectTrans
          shopDetail.description = data.description
          swiperImages.value = data.productImage.images
          bigImage.value = swiperImages.value[0]
          priceRangeList.price = data.productSaleInfo.priceRangeList[0].price
          priceRangeList.startQuantity = data.productSaleInfo.priceRangeList[0].startQuantity
          quoteType.value = data.productSaleInfo.quoteType
          categoryId.value = data.categoryId
          soldOut.value = data.soldOut
          tradeScore.value = Math.ceil(data.tradeScore)
          repeatPurchasePercent.value = Math.ceil(Number(data.sellerDataInfo.repeatPurchasePercent)*100)
          if (data.productShippingInfo.skuShippingDetails) skuShippingDetails.value = data.productShippingInfo.skuShippingDetails
          
          
          productPrice.value = data.productSaleInfo.priceRangeList

          const priceRangeL = data.productSaleInfo.priceRangeList
          productPriceList.value = []
          for(let i=priceRangeL.length-1;i>=0;i--){
            let numPrice = ''
            if(i==priceRangeL.length-1){
              numPrice = `≥${priceRangeL[i].startQuantity}`
            }else{
              numPrice = `${priceRangeL[i].startQuantity}-${Number(priceRangeL[i+1].startQuantity)-1}`
            }
            if (priceRangeL[i].promotionPrice) {
              productPriceList.value.unshift({
                num: numPrice,
                price: divide(priceRangeL[i].promotionPrice, exchange.value)
              })
            }else{
              productPriceList.value.unshift({
                num: numPrice,
                price: divide(priceRangeL[i].price, exchange.value)
              })
            }
          }
          if (priceRangeL[0].promotionPrice) {
            promotionPrice.value = priceRangeL[0].promotionPrice
          }else{
            promotionPrice.value = priceRangeL[0].price
          }
          if(quoteType.value == 2){
            leastQuantity.value = priceRangeL[0].startQuantity
          }
          if (quoteType.value == 0) {
            overdue.value = true;
            priceRange.value = divide(priceRangeList.price, exchange.value);
            skuNumber.value = [{ sizeNumber: [0], value: 0 }]
            amountOnSale.value = data.productSaleInfo.amountOnSale
            oneWeight.value = data.productShippingInfo.weight
            oneVolume.value = data.productShippingInfo.height * data.productShippingInfo.length * data.productShippingInfo.width
            leastQuantity.value = priceRangeL[0].startQuantity
          } else {
            skuInfo.value = data.productSkuInfos;
            skuInfo.value[0].skuAttributes.map(item => { skuAttributes.value.push(item.attributeId) });
            setAttri(data.productAttribute)

            if(data.productSkuInfos[0].skuAttributes.length > 1){
              attrNames.value = data.productSkuInfos[0].skuAttributes[0].attributeNameTrans
              attrName.value = data.productSkuInfos[0].skuAttributes[1].attributeNameTrans
            }else{
              attrName.value = data.productSkuInfos[0].skuAttributes[0].attributeNameTrans
            }
          }
          loadingPage.value = false
          loadEnd()
        }
      } else { overdue.value = true }
    })
  })

  /* if (code.value) {
    if (!window.localStorage.getItem('TOKEN') || window.localStorage.getItem('TOKEN') == 'undefined') {
      getInfo({ code: code.value }).then(res => {
        const userInfo = res.data.data
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
        window.localStorage.setItem('TOKEN', userInfo.token)
      })
    }
  }*/
})

onUnmounted(() => { window.removeEventListener('scroll', scrollHandler) })

function goTop() { window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }) }

</script>

<style scoped>
.loader { width: 40px; height: 40px; border: 4px solid #ddd; border-top-color: #333; border-radius: 50%; animation: spin 1s linear infinite }
@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
.shop-content .action-slide-1 {
  border-color: red;
  border-width: 1px;
}
.p-color {
  padding: 1px;
  padding-right: 4px;
  border: 1px solid #ddd;
}
.badge-countup-position{
  position: absolute;
  top: 0;
  right: 0;
  /* inset-inline-end: 0; */
  transform: translate(0%, -50%);
  transform-origin: 100% 0%;
  display: inline-flex;
    justify-content: center;
    z-index: auto;
    min-width: 20px;
    height: 20px;
    color: #ffffff;
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    text-align: center;
    background: #ff4d4f;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #ffffff;
    transition: background 0.2s;
    padding: 0 4px;
}
.action-slide-1{border-color:red;border-width:1px}

.skuTitle{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>