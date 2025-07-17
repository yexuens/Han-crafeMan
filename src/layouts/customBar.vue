<script setup lang="ts">
import { computed } from 'vue'
import { imgRes } from '@/constants'

const menuButtonArea = uni.getMenuButtonBoundingClientRect()
const isLastPage = computed(() => getCurrentPages().length === 1)

function handleNavigate() {
  if (isLastPage.value) {
    uni.reLaunch({
      url: '/pages/index/index',
    })
    return
  }
  uni.navigateBack({
    delta: 1,
  })
}
</script>

<template>
  <view
    class="absolute h-screen w-screen"
    style="background: linear-gradient(180deg, #FC7C44 10.05%, #F7DED2 24.44%, #F6F6F6 100.12%);z-index: -3;pointer-events: none"
  />
  <view
    class="fixed left-1/2 w-90vw flex items-center gap-x-4px -translate-x-1/2"
    :style="`top:${menuButtonArea.top}px;height:${menuButtonArea.height}px`"
  >
    <view @click="handleNavigate">
      <custom-icon icon-name="leftArrowIconWhite" />
    </view>
    <image :src="imgRes.longTitle" mode="aspectFit" class="h-full w-65%" />
  </view>
  <!--  <view :style="`min-height: calc( 100vh - ${menuButtonArea.top + menuButtonArea.height}px )`"> -->
  <view>
    <slot />
  </view>
</template>

<style scoped lang="scss">

</style>
