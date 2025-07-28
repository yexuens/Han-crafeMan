<script setup lang="ts">
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared",
  },
});
const menuButtonArea = uni.getMenuButtonBoundingClientRect();
</script>

<template>
  <view
    :style="`padding-top: ${menuButtonArea.top + menuButtonArea.height}px;`"
  >
    <slot />
  </view>
</template>

<style scoped lang="scss"></style>
