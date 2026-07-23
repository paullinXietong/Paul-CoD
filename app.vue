<template>
  <NuxtLayout>
    <NuxtPage />
    <FooterBar />
    <ChatMini ref="chatModal"/>
  </NuxtLayout>
</template>

<script setup>
import { provide, ref } from 'vue';
const chatModal = ref(null)

function getChat(){
  chatModal.value.chatPro()
}

function openChat(){
  chatModal.value.chatPanelOpen()
}

provide('chatProduct', getChat)
provide('chatModal', openChat)
</script>