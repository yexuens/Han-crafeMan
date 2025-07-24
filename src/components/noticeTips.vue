<script lang="ts" setup>
interface IProps {
  noticeList: string[];
  roundedClass?: string;
  showNextText?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  showNextText: false,
});
</script>

<template>
  <view
    :class="[roundedClass]"
    class="h-36px bg-#FFE2D4 px-18px py-8px text-12px text-#733617"
  >
    <swiper :interval="1500" autoplay circular class="h-full" vertical>
      <swiper-item
        v-for="(text, index) in noticeList"
        :key="index"
        class="flex items-center gap-x-8px"
      >
        <custom-icon :size="20" icon-name="noticeIcon" />
        <view class="truncate">{{ text }}</view>
        <view
          v-if="showNextText"
          class="border-b-solid border-b-1px border-b-#733617 ml-auto"
          >前往</view
        >
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
.swipe-item {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
</style>
