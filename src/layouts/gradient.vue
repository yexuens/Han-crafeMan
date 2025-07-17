<script setup lang="ts">
const safeTop = ref()
onMounted(async () => {
  const {
    height,
    top,
  } = wx.getMenuButtonBoundingClientRect()

  safeTop.value = top + height + 12
})
</script>

<template>
  <view>
    <slot />
  </view>
</template>
