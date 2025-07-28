<script setup lang="ts">
const props = withDefaults(defineProps<IProps>(), {
  leftArrow: true,
  transparent: true,
  withServiceIcon: true,
});
const menuBtnArea = uni.getMenuButtonBoundingClientRect();
interface IProps {
  title: string;
  leftArrow?: boolean;
  transparent?: boolean;
  withServiceIcon?: boolean;
}
const isLastPage = computed(() => getCurrentPages().length === 1);
function handleLeftOperation() {
  if (isLastPage.value) {
    uni.reLaunch({
      url: "/pages/index/index",
    });
  } else {
    uni.navigateBack();
  }
}
</script>

<template>
  <view
    :style="`padding-top:${menuBtnArea.top}px`"
    class="pb-6px fixed z-12"
    :class="[transparent ? 'bg-transparent' : 'bg-white']"
  >
    <view
      :style="`width:100vw;height:${menuBtnArea.height}px`"
      class="relative flex items-center"
    >
      <view
        class="absolute left-5% top-1/2 -translate-y-1/2"
        @click="handleLeftOperation"
      >
        <custom-icon v-if="!isLastPage" icon-name="leftArrowIcon" />
        <custom-icon v-else icon-name="homeIcon" :size="18" />
      </view>
      <view class="mx-auto text-16px font-bold">
        {{ title }}
      </view>
      <view
        v-if="withServiceIcon"
        :style="`position:absolute;left:calc( 100vw - ${(menuBtnArea.width + 48) * 2}rpx )`"
      >
        <icon-button
          open-type="contact"
          :height="25"
          :width="28"
          icon-name="serviceIcon"
        />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss"></style>
