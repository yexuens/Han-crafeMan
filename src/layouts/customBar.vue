<script setup lang="ts">
import { computed } from "vue";
import { imgRes } from "@/constants";

const menuButtonArea = uni.getMenuButtonBoundingClientRect();
const isLastPage = computed(() => getCurrentPages().length === 1);

function handleNavigate() {
  if (isLastPage.value) {
    uni.reLaunch({
      url: "/pages/index/index",
    });
    return;
  }
  uni.navigateBack({
    delta: 1,
  });
}
</script>

<template>
  <view
    class="fixed z-14 left-1/2 w-90vw flex items-center gap-x-4px -translate-x-1/2"
    :style="`top:${menuButtonArea.top}px;height:${menuButtonArea.height}px`"
  >
    <view @click="handleNavigate">
      <custom-icon icon-name="leftArrowIconWhite" />
    </view>
    <image :src="imgRes.longTitle" mode="aspectFit" class="h-full w-65%" />
  </view>
  <!--  <view :style="`min-height: calc( 100vh - ${menuButtonArea.top + menuButtonArea.height}px )`"> -->
  <view class="relative">
    <slot />
  </view>
</template>

<style scoped lang="scss"></style>
