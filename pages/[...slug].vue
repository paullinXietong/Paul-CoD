<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/', { replace: true })
    }
  ]
})
</script>
