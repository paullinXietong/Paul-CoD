<template>
  <div ref="floatButton" 
    class="fixed z-20 "
    draggable="true" @dragenter="dragenter($event)" @dragstart="chatmove($event)" @dragover="chatmoving($event)"
    style="right: 40px;bottom: 96px;"
  >
    <div v-show="!chatOpen" @click="chatPanelOpen" id="co-chatmini" class="bg-white rounded-full shadow cursor-pointer px-2 py-2">
      <div class="flex items-center">
        <div class="relative">
          <img :src="manageNew.image_url || ''" class="w-12 h-12 rounded-full" />
          <div class="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-400 rounded-full"></div>
        </div>
        <div v-show="chatNum>0" class="absolute top-0 right-0 text-white bg-red-500 rounded-full px-1.5 py-0.5 text-xs">{{ chatNum }}</div>
      </div>
    </div>

    <div v-show="chatOpen" id="co-chatmodal" class="w-96 bg-white rounded shadow">
      <div class="p-3 flex items-center border-b relative">
        <div class="relative mr-3">
          <img class="w-12 h-12 rounded-full" :src="manageNew.image_url || ''" />
          <div class="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-400 rounded-full"></div>
        </div>
        <div>
          <div class="flex items-center">
            <div class="font-medium mr-4">{{ manageNew.englishname }}</div>
            <button @click="toWhatsApp" class="text-green-600 underline">
              <svg @click="toWhatsApp" t="1724839971157" class="icon cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6428" width="28" height="28"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#25D366" p-id="6429"></path><path d="M528.878933 796.842667h-0.136533a304.1792 304.1792 0 0 1-145.476267-37.034667L221.866667 802.133333l43.178666-157.764266a303.906133 303.906133 0 0 1-40.618666-152.200534C224.477867 324.3008 361.0624 187.733333 528.878933 187.733333a302.472533 302.472533 0 0 1 215.364267 89.2928 302.592 302.592 0 0 1 89.088 215.381334c-0.068267 167.816533-136.6016 304.384-304.469333 304.452266z m-138.1376-92.16l9.233067 5.4784a252.672 252.672 0 0 0 128.802133 35.2768h0.1024c139.4688 0 252.9792-113.527467 253.047467-253.047467a251.528533 251.528533 0 0 0-74.052267-179.029333 251.323733 251.323733 0 0 0-178.8928-74.205867c-139.588267 0-253.098667 113.493333-253.166933 253.0304a252.433067 252.433067 0 0 0 38.690133 134.656l6.024534 9.591467-25.565867 93.354666 95.778133-25.105066z m291.515734-139.8784c-1.8944-3.1744-6.980267-5.085867-14.574934-8.874667-7.611733-3.822933-45.0048-22.2208-51.985066-24.746667-6.980267-2.56-12.049067-3.822933-17.117867 3.7888-5.0688 7.611733-19.643733 24.746667-24.081067 29.832534-4.437333 5.0688-8.874667 5.717333-16.4864 1.8944-7.611733-3.805867-32.119467-11.8272-61.166933-37.751467-22.6304-20.1728-37.888-45.073067-42.325333-52.701867-4.437333-7.611733-0.477867-11.7248 3.328-15.530666 3.413333-3.413333 7.611733-8.874667 11.4176-13.312 3.805867-4.437333 5.0688-7.6288 7.611733-12.6976 2.525867-5.0688 1.262933-9.5232-0.631467-13.312-1.911467-3.822933-17.117867-41.2672-23.466666-56.490667-6.178133-14.848-12.458667-12.834133-17.117867-13.073067-4.437333-0.221867-9.506133-0.256-14.574933-0.256-5.0688 0-13.312 1.8944-20.292267 9.5232-6.9632 7.611733-26.624 26.0096-26.624 63.453867s27.272533 73.608533 31.061333 78.677333c3.805867 5.102933 53.640533 81.92 129.962667 114.875734a436.906667 436.906667 0 0 0 43.349333 16.042666c18.244267 5.7856 34.816 4.949333 47.9232 3.003734 14.626133-2.184533 45.021867-18.397867 51.370667-36.181334 6.314667-17.749333 6.314667-32.989867 4.420267-36.181333z" fill="#FDFDFD" p-id="6430"></path></svg>
            </button>
          </div>
          <div class="text-xs text-gray-500">Account Manager</div>
        </div>
        <button @click="chatOpen=false" class="absolute right-2 top-2 text-gray-500">✕</button>
      </div>
      <div id="chatPanel" class="h-80 overflow-y-auto">
        <div ref="chatPanels" class="overflow-y-auto h-full p-3">
          <div v-for="(i,n) in chatMessage" :key="n">
            <div v-if="i.is_me==1">
              <div class="pt-2 pb-1 text-center text-gray-500 text-xs">{{ i.date_entered }}</div>
              <div class="py-2 flex justify-end items-start">
                <div class="pr-2 flex flex-col items-end" style="width:calc(100% - 80px)">
                  <div class="text-sm text-gray-700">{{ i.nickname }}</div>
                  <div v-if="i.msg_type==0" class="mt-1.5 px-3 py-1.5 text-sm text-white rounded-3xl bg-blue-500 break-words">{{ i.msg }}</div>
                  <div v-if="i.msg_type==2" class="mt-1.5 px-3 py-1.5 text-sm rounded-3xl bg-blue-500 break-words text-white">
                    <a :href="i.msg" target="_blank" class="underline">{{ i.file_name }}</a>
                  </div>
                  <div v-if="i.msg_type==1" class="mt-1.5">
                    <img :src="i.msg" class="max-w-32 rounded" />
                  </div>
                  <div v-if="i.msg_type == 3 || i.msg_type == 4" class="mt-1.5 relative">
                    <div class="p-3 rounded-md bg-white shadow">
                      <div class="flex items-center mb-1.5">
                        <img v-show="i.msg.img != ''" :src="i.msg.img" class="w-7 h-7 rounded-full mr-1" alt="">
                        <div class="text-sm font-semibold">{{i.msg.name}}</div>
                      </div>
                      <div v-show="i.msg.date != ''" class="flex items-center">
                        <img src="@/assets/images/chat/dtdtime.svg" class="w-3 h-3 mr-1" alt="">
                        <div class="text-xs">{{i.msg.date}}</div>
                      </div>
                      <div class="flex items-center my-0.5">
                        <img src="@/assets/images/chat/dtdprice.svg" class="w-3 h-3 mr-1" alt="">
                        <div class="flex items-center">
                          <div class="text-red-500 font-semibold">{{i.msg.price}}</div>
                          <div v-show="i.msg_type == 3" class="text-xs">{{i.msg.weight}}</div>
                        </div>
                      </div>
                      <div v-show="i.msg.destination != ''" class="flex items-center">
                        <img src="@/assets/images/chat/dtdlocation.svg" class="w-3 h-3 mr-1" alt="">
                        <div class="text-xs">{{i.msg.destination}}</div>
                      </div>
                    </div>
                    <div v-show="i.is_read == 1" class="absolute bottom-0 -left-6">
                      <svg t="1678437391950" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30218" width="18" height="18"><path d="M511.006881 64.592111c-247.195985 0-447.565479 200.369493-447.565479 447.566502 0 247.168356 200.369493 447.566502 447.565479 447.566502 247.168356 0 447.566502-200.398146 447.566502-447.566502C958.573383 264.961604 758.175237 64.592111 511.006881 64.592111zM511.006881 895.376551c-211.645304 0-383.217938-171.59924-383.217938-383.217938 0-211.646328 171.572634-383.217938 383.217938-383.217938s383.217938 171.572634 383.217938 383.217938C894.22482 723.776288 722.652186 895.376551 511.006881 895.376551z" fill="#7a7a7a" p-id="30219"></path><path d="M706.369338 385.719922c-11.580756 0-22.099321 4.700045-29.706579 12.308327L454.6135 620.581997l-137.570215-138.074705c-7.608282-7.609305-18.098193-12.308327-29.706579-12.308327-23.161512 0-41.958624 18.769482-41.958624 41.959647 0 11.580756 4.670369 22.043039 12.252045 29.622668l167.277818 167.837566c7.580652 7.580652 18.098193 12.308327 29.706579 12.308327 11.609409 0 22.099321-4.700045 29.707602-12.308327l0 0.028653 251.754814-252.343215c7.553023-7.580652 12.252045-18.070564 12.252045-29.65132C748.327962 404.491451 729.53085 385.719922 706.369338 385.719922z" fill="#7a7a7a" p-id="30220"></path></svg>
                    </div>
                  </div>
                  <div v-if="i.msg_type == 14" class="mt-1.5 relative">
                    <a :href="i.msgx.url" target="_blank">
                      <img :src="i.msgx.image" style="border-radius: 6px 6px 0 0;width: 180px;height: 160px;object-fit: cover;" alt="">
                    </a>
                    <div style="width: 180px;background-color: #ededed;padding: 10px;border-radius: 0 0 6px 6px;">
                      <a :href="i.msgx.url" target="_blank">
                        <div class="productTitleMsg">{{i.msgx.subject}}</div>
                      </a>
                      <div style="padding-top: 6px;color: #e30101;font-weight: 600;">${{i.msgx.price_us}}</div>
                    </div>
                  </div>
                </div>
                <img :src="i.head_img" class="w-12 h-12 rounded-full" />
              </div>
            </div>
            <div v-else-if="i.msg_type!=15">
              <div class="pt-2 pb-1 text-center text-gray-500 text-xs">{{ i.date_entered }}</div>
              <div class="py-2 flex items-start">
                <img :src="i.head_img" class="w-12 h-12 rounded-full" />
                <div class="pl-2 flex flex-col items-start" style="width:calc(100% - 80px)">
                  <div class="text-sm text-gray-700">{{ i.nickname }}</div>
                  <div v-if="i.msg_type==0 || i.msg_type==5" class="mt-1.5 px-3 py-1.5 text-sm rounded-3xl bg-gray-200 break-words">{{ i.msg }}</div>
                  <div v-if="i.msg_type==2" class="mt-1.5 px-3 py-1.5 text-sm rounded-3xl bg-gray-200 break-words">
                    <a :href="i.msg" download class="underline text-blue-600">{{ i.file_name }}</a>
                  </div>
                  <div v-if="i.msg_type==1" class="mt-1.5">
                    <img :src="i.msg" class="max-w-32 rounded" />
                  </div>
                  <div v-if="i.msg_type == 3 || i.msg_type == 4" class="mt-1.5 relative">
                    <div class="p-3 rounded-md bg-gray-100 shadow">
                      <div class="bg-white rounded-md shadow overflow-hidden">
                        <div v-show="i.msg_type == 4" class="text-13">
                          <div class="p-2">Cargo Consolidation</div>
                          <table class="w-full table-auto text-center border-t border-l">
                            <thead>
                              <tr>
                                <th class="py-2 border-r border-b font-normal">Cabinet type</th>
                                <th class="py-2 border-r border-b font-normal">Volume</th>
                                <th class="py-2 border-r border-b font-normal">Unit price (cabinet)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(ix,nx) in i.msg.price_list" :key="nx">
                                <td class="py-2 border-r border-b">{{ ix.type }}</td>
                                <td class="py-2 border-r border-b">{{ ix.volume }}</td>
                                <td class="py-2 border-r border-b">{{ ix.price }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div class="p-3">
                          <div class="flex items-center mb-1.5">
                            <img v-show="i.msg.img != ''" :src="i.msg.img" class="w-7 h-7 rounded-full mr-1" alt="">
                            <div class="text-sm font-semibold">{{i.msg.name}}</div>
                          </div>
                          <div v-show="i.msg.date != ''" class="flex items-center">
                            <img src="@/assets/images/chat/dtdtime.svg" class="w-3 h-3 mr-1" alt="">
                            <div class="text-13">{{i.msg.date}}</div>
                          </div>
                          <div v-show="i.msg.unit_price" class="flex items-center mt-0.5">
                            <img src="@/assets/images/chat/dtdprice.svg" class="w-3 h-3 mr-1" alt="">
                            <div class="text-13">${{i.msg.unit_price}}/kg</div>
                          </div>
                          <div class="flex items-center my-0.5">
                            <img src="@/assets/images/chat/dtdprice.svg" class="w-3 h-3 mr-1" alt="">
                            <div class="flex items-center">
                              <div v-show="i.msg_type == 4" class="text-red-500 font-semibold">USD {{i.msg.total_price}}</div>
                              <div v-show="i.msg_type == 4" class="text-13 flex items-center">
                                (<div v-for="(it,nt) in i.msg.type_and_number" :key="nt">
                                  <span v-show="nt>0">+</span>
                                  {{it.number}} * {{it.type}}
                                </div>)
                              </div>
                              <div v-show="i.msg_type == 3" class="text-red-500 font-semibold">{{i.msg.price}}</div>
                              <div v-show="i.msg_type == 3" class="text-13">{{i.msg.weight}}</div>
                            </div>
                          </div>
                          <div v-show="i.msg.destination != ''" class="flex items-center">
                            <img src="@/assets/images/chat/dtdlocation.svg" class="w-3 h-3 mr-1" alt="">
                            <div class="text-13">{{i.msg.destination}}</div>
                          </div>
                          <div v-show="i.msg.tax == '1'" class="flex items-center mt-2.5">
                            <div class="py-0.5 px-3 rounded text-13"
                              style="color: #5dba00;background-color: #ebf9ed;">Included Tax</div>
                          </div>
                        </div>
                      </div>
                      <div v-show="i.msg_type == 4" class="mt-4 text-gray-400 text-xs">
                        Tips: Time: Includes route transportation time only
                      </div>
                      <div class="flex justify-center text-sm">
                        <button class="mt-3 py-1.5 px-10 bg-orange hover:bg-orange1 text-white rounded-md"
                          @click="toPriceDetails(i.msg.detail_info,i.msg_type)">Get Discount</button>
                      </div>
                    </div>
                  </div>
                  <div v-if="i.msg_type == 12" class="mt-1.5 relative text-13">
                    <div class="p-3 rounded-md bg-gray-100 shadow">
                      <div class="bg-white rounded-md shadow">
                        <div class="p-2">Cargo Consolidation</div>
                        <table v-if="i.msg_state == 0" class="table-auto text-center border-t border-l">
                          <thead>
                            <tr>
                              <th class="border-r border-b font-normal">Total Volume(CBM)</th>
                              <th class="border-r border-b font-normal">Number of suppliers</th>
                              <th class="border-r border-b font-normal">Prices(kg)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(ix,nx) in i.msg" :key="nx">
                              <td class="py-2 border-r border-b">{{ ix.volume }}</td>
                              <td class="py-2 border-r border-b">{{ ix.supplier }}</td>
                              <td class="py-2 border-r border-b">{{ ix.price }}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div v-if="i.msg_state == 1" class="px-2 pb-2">
                          <div class="flex">
                            <div class="text-gray-400 w-36">Total volume(CBM):</div>
                            <div>{{ i.msg.volume }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Number of suppliers:</div>
                            <div>{{ i.msg.suppliers }}</div>
                          </div>
                          <div class="flex items-center">
                            <div class="text-gray-400 w-36">Prices:</div>
                            <div class="text-red-500 font-semibold text-base">${{ i.msg.price }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-4 text-gray-400 text-xs">
                        <div>Tips: Warehouse address</div>
                        <div>102 Building C, Hezhihe Industrial Park, No. 2990 Songbai Road, Shiyan, Baoan, Shenzhen</div>
                        <div>Customer service call: 0755-28225927/15323780975</div>
                        <div>Name:Andy</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="i.msg_type == 11" class="mt-1.5 relative text-13">
                    <div class="p-3 rounded-md bg-gray-100 shadow">
                      <div class="bg-white rounded-md shadow">
                        <div class="p-2">Cargo Consolidation</div>
                        <table v-if="i.msg_state == 0" class="w-full table-auto text-center border-t border-l">
                          <thead>
                            <tr>
                              <th class="py-2 border-r border-b font-normal">Service name</th>
                              <th class="py-2 border-r border-b font-normal">Prices</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(ix,nx) in i.msg" :key="nx">
                              <td class="py-2 border-r border-b">{{ ix.service_name }}</td>
                              <td class="py-2 border-r border-b">{{ ix.prices }}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div v-if="i.msg_state == 1" class="px-2 pb-2">
                          <div class="flex">
                            <div class="text-gray-400 w-36">Warehouse address:</div>
                            <div>{{ i.msg.warehouse_address }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Total volume(CBM):</div>
                            <div>{{ i.msg.total_volume }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Cargo type:</div>
                            <div>{{ i.msg.cargo_type }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Of boxes:</div>
                            <div>{{ i.msg.of_boxes }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Inventory time:</div>
                            <div>{{ i.msg.inventory_time }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Fee days:</div>
                            <div>{{ i.msg.free_days }}</div>
                          </div>
                          <div class="flex">
                            <div class="text-gray-400 w-36">Outbound service:</div>
                            <div>{{ i.msg.outbound_service }}</div>
                          </div>
                          <div class="flex items-center">
                            <div class="text-gray-400 w-36">Prices:</div>
                            <div class="text-red-500 font-semibold text-base">${{ i.msg.free }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-4 text-gray-400 text-xs">
                        <div>Tips: Warehouse address</div>
                        <div>102 Building C, Hezhihe Industrial Park, No. 2990 Songbai Road, Shiyan, Baoan, Shenzhen</div>
                        <div>Customer service call: 0755-28225927/15323780975</div>
                        <div>Name:Andy</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="i.msg_type==13" class="AI_msg mt-1.5 pl-7 pr-5 py-1.5 text-sm rounded-3xl bg-gray-200 break-words" style="max-width: 270px;" v-html="i.msg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-3 border-t">
        <div class="mb-2 flex justify-between items-center">
          <input ref="iptFileRef" type="file" class="hidden" @change="uploads" />
          <button class="px-2 py-1 text-gray-700">
            <svg @click="upload" t="1694769826059" class="icon" style="cursor: pointer;padding: 4px;" viewBox="0 0 1024 1024"
              version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4016" width="28" height="28">
              <path
                d="M1024 512.032c0 30.304-23.616 54.848-52.768 54.848H52.736C23.616 566.88 0 542.4 0 512.032c-0.064-30.4 23.616-54.88 52.736-54.88H971.2c29.248 0 52.8 24.512 52.8 54.88"
                p-id="4017" fill="#7a7a7a"></path>
              <path
                d="M512.032 0c30.304 0 54.816 23.616 54.816 52.768v918.464c0 29.12-24.448 52.736-54.816 52.736-30.432 0.064-54.88-23.616-54.88-52.736V52.768c0-29.216 24.512-52.768 54.88-52.768"
                p-id="4018" fill="#7a7a7a"></path>
            </svg>
          </button>
          <button @click="sendMessage" class="px-3 py-1 bg-gray-400 text-white rounded-2xl">Send</button>
        </div>
        <textarea @keyup.enter.exact="sendMessage" @keyup.ctrl.enter="listenKey" ref="textArea" v-model="msg" rows="2" class="w-full border rounded px-2 py-1 text-sm bg-gray-50 resize-none outline-none"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, defineExpose } from 'vue'
import { getRate } from '~/services/api'
import axios from 'axios'
import MarkdownIt from 'markdown-it';
const config = useRuntimeConfig()
const chatOpen = ref(false)
const chatMessage = ref([])
const manageNew = reactive({})
const userInfo = ref({})
const token = ref('')
const websocket = ref(null)
const chatNum = ref(0)
const msg = ref('')
const iptFileRef = ref(null)
const chatPanels = ref(null)
const times = ref(Date.now())
const fileType = ref(1)
const aiEnter = ref(false)
let formData = null
const offLeft = ref(null)
const offTop = ref(null)
const point = ref({ x: null, y: null })
const screenWidth = ref(0)
const screenHeight = ref(0)
const floatButton = ref(null)
const rate = ref(6)
let reconnectTimer
let shouldReconnect = true

function dragenter(e){
  e.preventDefault()
}

function chatmove(e){
  if(!chatOpen.value){
    offLeft.value = e.offsetX
    offTop.value = e.offsetY
  }
}

function chatmoving(e){
  if(!chatOpen.value){
    point.value.x = e.clientX - offLeft.value
    point.value.y = e.clientY - offTop.value
    floatButton.value.style.right = (screenWidth.value - point.value.x) + 'px'
    floatButton.value.style.bottom = (screenHeight.value - point.value.y) + 'px'
  }
}

function even(e){
  if (!floatButton.value.contains(e.target)) {
    chatOpen.value = false
  }
}

function StartWebSocket(){
  if (!shouldReconnect) return
  const socket = new WebSocket(config.public.wssUrl)
  websocket.value = socket
  socket.onopen = () => onOpen(socket)
  socket.onclose = () => scheduleReconnect(socket)
  socket.onmessage = onMessage
  socket.onerror = () => socket.close()
}

function scheduleReconnect(socket){
  if (!shouldReconnect || websocket.value !== socket) return
  clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(StartWebSocket, 1000)
}

function sendSocket(message, socket = websocket.value){
  if (!socket || socket.readyState !== WebSocket.OPEN) return false
  socket.send(JSON.stringify(message))
  return true
}

function onOpen(socket){
  const ui = JSON.parse(localStorage.getItem('userInfo') || 'null')
  if(ui){
    Object.assign(userInfo.value, ui)
    Object.assign(manageNew, ui.manage || {})
    const me = { type: 'init', from_user_id: ui.id, service_type: 1, status: '', order_state: token.value }
    sendSocket(me, socket)
  }else{
    nologinMessage(socket)
  }
}

function onMessage(e){
  const data = JSON.parse(e.data)
  if(data.type==='init' || data.type==='chat_msg_list' || data.type==='no_login_init'){
    let list = data.message_list
    for(let n=0;n<list.length;n++){
      if(list[n].msg_type == 3 || list[n].msg_type == 4){
        list[n].msg = JSON.parse(list[n].msg)
      }
      if(list[n].msg_type == 11 || list[n].msg_type == 12){
        list[n].msg = JSON.parse(list[n].msg)
        if(Object.prototype.toString.call(list[n].msg) == '[object Array]'){
          list[n].msg_state = 0
        }else{
          list[n].msg_state = 1
        }
      }
      if(list[n].msg_type == 13){
        const markdownIt = new MarkdownIt();
        list[n].msg = markdownIt.render(list[n].msg);
      }
      if(list[n].msg_type == 14){
        list[n].msgx = JSON.parse(list[n].msg)
        list[n].msgx.price_us = (Number(list[n].msgx.min_price)/rate.value).toFixed(2)
      }
    }
    chatMessage.value = data.message_list || []
    Height()
  }else if(data.type==='chat_msg' && data.msg_type!=13){
    const a = { date_entered: data.date_entered, head_img: (data.head_img || '') + '?v=' + times.value, is_me: data.is_me, is_read: data.is_read, msg: data.msg, nickname: data.nickname, msg_type: data.msg_type }
    if(data.msg_type == 3 || data.msg_type == 4){
      a.msg = JSON.parse(data.msg)
    }
    if(data.msg_type===2){ a.file_name = data.file_name }
    if(data.msg_type == 11 || data.msg_type == 12){
      a.msg = JSON.parse(data.msg)
      if(Object.prototype.toString.call(a.msg) == '[object Array]'){
        a.msg_state = 0
      }else{
        a.msg_state = 1
      }
    }
    if(data.msg_type===14){
      a.msgx = JSON.parse(a.msg)
      a.msgx.price_us = (Number(a.msgx.min_price)/rate.value).toFixed(2)
      chatOpen.value = true
      chatNum.value = 0
    }
    chatMessage.value.push(a)
    if(!chatOpen.value && data.is_me===0){ chatNum.value += 1 }
    Height()
  }
  if(data.msg_type == 13){
    let a = {
      head_img: data.head_img + '?v=' + times.value,
      is_me: data.is_me,
      msg: data.msg,
      nickname: data.nickname,
      msg_type: data.msg_type,
    }
    if(!aiEnter.value){
      chatMessage.value.push(a)
    }else if(aiEnter.value && data.msg != '[DONE]'){
      const markdownIt = new MarkdownIt();
      chatMessage.value[chatMessage.value.length - 1].msg = markdownIt.renderInline(chatMessage.value[chatMessage.value.length - 1].msg + data.msg)
      Height()
    }

    if(data.msg != '[DONE]'){
      aiEnter.value = true
    }else{
      aiEnter.value = false
      const markdownIt = new MarkdownIt();
      chatMessage.value[chatMessage.value.length - 1].msg = markdownIt.render(chatMessage.value[chatMessage.value.length - 1].msg)
      Height()
    }
  }
  // if(data.msg_type===13 && data.msg==='[DONE]'){
  //   const a = { date_entered: data.date_entered, head_img: (data.head_img || '') + '?v=' + times.value, is_me: data.is_me, is_read: data.is_read, msg: data.left_msg, nickname: data.nickname, msg_type: data.msg_type }
  //   chatMessage.value.push(a)
  // }
}

function nologinMessage(socket = websocket.value){
  const ua = navigator.userAgent.toLowerCase()
  let sys = 'Unknown'
  if (ua.includes('windows nt 10.0')) sys = 'Windows 10'
  else if (ua.includes('windows nt 6.2')) sys = 'Windows 8'
  else if (ua.includes('windows nt 6.1')) sys = 'Windows 7'
  else if (ua.includes('windows nt 6.0')) sys = 'Windows Vista'
  else if (ua.includes('windows nt 5.1')) sys = 'Windows XP'
  else if (ua.includes('windows nt 5.0')) sys = 'Windows 2000'
  else if (/mac/.test(ua)) sys = 'Mac'
  else if (/linux/.test(ua)) sys = 'Linux'
  else if (/android/.test(ua)) sys = 'Android'
  else if (/iphone|ipad/.test(ua)) sys = 'IOS'
  const browser = /Chrome/i.test(ua) ? 'Chrome' : (/Firefox/i.test(ua) ? 'Firefox' : (/Safari/i.test(ua) ? 'Safari' : (/MSIE|Trident/.test(ua) ? 'IE' : 'Unknown')))
  const machine = `${window.screen.width}*${window.screen.height}`
  const code = window.localStorage.getItem('invitation_codes') || ''
  const message = { type: 'no_login_init', sys, browser, machine, from_user_id: (userInfo.value.id || 0), code, manage: manageNew, order_state: token.value }
  sendSocket(message, socket)
  window.localStorage.removeItem('invitation_codes')
}

function chatPanelOpen(){
  chatOpen.value = true
  chatNum.value = 0
  const message = { type: 'chat_msg_list', from_user_id: (userInfo.value.id || 0), from_service_id: manageNew.id, service_type: 1, order_state: token.value }
  sendSocket(message)
}

function Height(){
  nextTick(()=>{ if(chatPanels.value) chatPanels.value.scrollTop = chatPanels.value.scrollHeight })
}

function upload(){ iptFileRef.value.click() }
function uploads(e){ const files = e.target.files[0]; formData = new FormData(); formData.append('file', files); fileType.value = files.type.indexOf('image')!=-1 ? 1 : 2; tttt() }
async function tttt(){ const res = await fetch('https://mini.cargosoon.online/api/mini/Login/upload_chat', { method: 'POST', body: formData }); const data = await res.json(); if(data.code==='0'){ const img = data.data.image; const imgs = 'https://mini.cargosoon.online/api' + img.substr(1); if(fileType.value===1){ const message = { type: 'chat_msg', from_user_id: (userInfo.value.id || 0), from_service_id: manageNew.id, service_type: 1, msg_type: 1, msg: imgs, order_state: token.value, client_source: 2 }; sendSocket(message) } else { const msgs = { image: imgs, file_name: data.data.file_name, file_size: data.data.file_size, file_type: data.data.file_type }; const message = { type: 'chat_msg', from_user_id: (userInfo.value.id || 0), from_service_id: manageNew.id, service_type: 1, msg_type: 2, msg: JSON.stringify(msgs), order_state: token.value, client_source: 2 }; sendSocket(message) } } }

function sendMessage(){ const message = { type: 'chat_msg', from_user_id: (userInfo.value.id || 0), from_service_id: manageNew.id, service_type: 1, msg_type: 0, msg: msg.value, order_state: token.value, msg_source_type: 'app', client_source: 2 }; if(sendSocket(message)) msg.value = '' }
function listenKey(){ msg.value = msg.value + '\n' }

function toWhatsApp(){ let chat_info; const ui = JSON.parse(localStorage.getItem('userInfo') || 'null'); if(ui){ chat_info = ui.manage } else { const ci = JSON.parse(localStorage.getItem('chat_info') || '{}'); chat_info = ci.manage } if(chat_info){ let num = chat_info.whatsappp || ''; if(num.indexOf('+')===-1) num = '+86' + num; const text = `Hello, ${chat_info.englishname}`; window.open('https://api.whatsapp.com/send?phone=' + num + '&text=' + encodeURIComponent(text), '_blank') } }

function chatPro(){
  let item = JSON.parse(localStorage.getItem("askProduct"))
  const message = {
    type: "chat_msg",
    from_user_id: (userInfo.value.id || 0),
    from_service_id: manageNew.id,
    service_type: 1,
    msg_type: 14,
    msg: item.id,
    source: item.source,
    client_source: 2,
  }
  sendSocket(message)
  setTimeout(() => {
    localStorage.removeItem('askProduct')
  },1000)
}

defineExpose({ chatPro, chatPanelOpen });

async function fetchRate(){
  const rez = await getRate()
  rate.value = rez.data.data.exchange_rate
}

onMounted(async ()=>{
  shouldReconnect = true
  fetchRate()
  const ui = JSON.parse(localStorage.getItem('userInfo') || 'null')
  if(ui){ userInfo.value = ui; token.value = localStorage.getItem('TOKEN') || '' }
  else {
    const ci = JSON.parse(localStorage.getItem('chat_info') || 'null')
    const code = window.localStorage.getItem('invitation_codes') || ''
    if(ci && !code){ manageNew.id = ci.manage?.id; manageNew.image_url = ci.manage?.image_url; manageNew.englishname = ci.manage?.englishname; userInfo.value.id = ci.chat_id }
    else {
      try{
        const baseUrl = config.public.baseUrl
        const res = await axios.post(baseUrl + '/customer/api/polymerization/save_ip', `type=3&code=${code}`)
        const data = res.data?.data
        if(data){ 
          localStorage.setItem('invitation_code', data.manage.invitation_code);
          localStorage.setItem('chat_info', JSON.stringify(data)); manageNew.id = data.manage?.id; manageNew.image_url = data.manage?.image_url; manageNew.englishname = data.manage?.englishname; userInfo.value.id = data.chat_id
        }
      }catch{}
    }
  }
  StartWebSocket()
  screenWidth.value = window.innerWidth - 72;
  screenHeight.value = window.innerHeight - 56;
  document.addEventListener('click', even, true)
})

onUnmounted(()=>{
  shouldReconnect = false
  clearTimeout(reconnectTimer)
  if (websocket.value) websocket.value.close()
  document.removeEventListener('click', even, true) 
})
</script>

<style scoped>
#co-chatmini{ box-shadow: 0 0 6px 0 #0000004d }
</style>

<style>
.AI_msg a{
  color: #4CA2FE !important;
}
.AI_msg ol{
  list-style-type: demical !important;
}
.AI_msg ol>li>ul{
  list-style-type: circle !important;
}
.AI_msg>ul{
  list-style-type: disc !important;
}
.AI_msg>ul>li>ul{
  list-style-type: circle !important;
}

.productTitleMsg{
  font-size: 13px;
}
</style>
