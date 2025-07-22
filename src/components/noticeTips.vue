<script lang="ts" setup>
const props = defineProps(["noticeList"]);
watchEffect(() => {
  console.log(props.noticeList);
});
</script>

<template>
  <view
    class="h-36px w-90vw rounded-16px bg-#FFE2D4 px-18px py-8px text-12px text-primary-500"
  >
    <swiper :interval="1500" autoplay circular class="h-full" vertical>
      <swiper-item
        v-for="(text, index) in noticeList"
        :key="index"
        class="flex items-center gap-x-8px"
      >
        <custom-icon :size="20" icon-name="noticeIcon" />
        <view class="truncate">{{ text }}</view>
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
