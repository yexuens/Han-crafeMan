<script lang="ts" setup>
// Define component options
import { useUserStore } from "@/store";

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared",
  },
});

// 1. Define props to receive the visibility state from the parent.
// 'modelValue' is the default prop for v-model.
const props = defineProps<{
  modelValue: boolean;
}>();

// 2. Define the event that will be emitted to update the parent's state.
// 'update:modelValue' is the default event for v-model.
const emit = defineEmits(["update:modelValue"]);

// The beforeClose logic remains the same.
// It's a function that returns a promise, which the popup will wait for.
function beforeClose() {
  return new Promise((resolve) => setTimeout(resolve, 300)); // Reduced delay for smoother feel
}
const user = useUserStore();
// The guide list data remains the same.
const guideList = computed(() => [
  {
    content: "第一步 上传身份证",
    status: 0,
    unfinishedTip:
      user.userInfo.yuliutwo && user.userInfo.yuliutwo
        ? "已完成上传"
        : "尚未完成上传",
    btnLabel: user.userInfo.yuliutwo && user.userInfo.yuliutwo ? "" : "去上传",
    bgColor: "#f0fbe9",
  },
  {
    content: "第二步 完成视频学习",
    status: 1,
    unfinishedTip:
      user.userInfo.number === 1 ? "已完成视频学习" : "尚未视频学习",
    btnLabel: user.userInfo.number === 1 ? "" : "去学习 ",
    bgColor: "#e9fbfb",
  },
  {
    content: "第三步 完成考试题目",
    status: 0,
    unfinishedTip: "尚未完成考试",
    btnLabel: "去考试",
    bgColor: "#fbe9ef",
  },
]);
function navigateToCertification() {
  uni.navigateTo({
    url: "/pages-sub/craft_man_certification/index",
  });
}
</script>

<template>
  <sar-popup
    :visible="modelValue"
    effect="fade"
    overlay-closable
    :before-close="beforeClose"
    @update:visible="emit('update:modelValue', $event)"
  >
    <view
      class="guide-container h-420px w-320px flex flex-col px-32px pb-32px pt-50px"
    >
      <view
        class="flex flex-col items-center text-18px text-white"
        style="text-shadow: 0 4px 4px rgb(12, 4, 0, 0.25)"
      >
        <view class="font-bold"> 首次接单 </view>
        <view>请先完成以下步骤</view>
      </view>
      <view class="mt-26px flex flex-1 grow-1 flex-col items-center gap-y-12px">
        <view
          @click="navigateToCertification"
          v-for="(item, index) in guideList"
          :key="index"
          :style="`background: ${item.bgColor}`"
          class="w-full flex flex-1 items-center justify-between rounded-8px px-20px py-24px"
        >
          <view class="flex flex-col gap-y-4px">
            <view class="text-14px text-primary-500 font-bold">
              {{ item.content }}
            </view>
            <view class="text-12px text-[#979797]">
              {{ item.unfinishedTip }}
            </view>
          </view>
          <view
            v-if="item.btnLabel"
            class="go-to-btn flex items-center justify-center text-12px text-white"
          >
            {{ item.btnLabel }}
          </view>
        </view>
      </view>
    </view>
  </sar-popup>
</template>

<style lang="scss" scoped>
.guide-container {
  border-radius: 23px;
  background: linear-gradient(180deg, #e06546 0%, #f58c4f 48.08%, #f6590d 100%);

  .go-to-btn {
    width: 60px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 12px;
    background: linear-gradient(180deg, #fbd698 0%, #f6631b 100%);
    box-shadow:
      0px 3.2px 3.2px 0px rgba(180, 38, 19, 0.25) inset,
      0px 3.2px 3.2px 0px #f9d4a2;
  }
}
</style>
