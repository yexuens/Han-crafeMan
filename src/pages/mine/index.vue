<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页",
    "enablePullDownRefresh": true,
  },
}
</route>

<script lang="ts" setup>
import NavWithSupport from "@/components/navWithSupport.vue";
import { queryRequirementList } from "@/service/requirement";
import { useNavTransparent } from "@/composables/useNavTransparent";

const navTransparent = useNavTransparent();
const latestRequirement = ref();
const screenHeight = uni.getSystemInfoSync().windowHeight;
const featureList = [
  {
    label: "我的资料",
    iconUrl: "https://cdn.juesedao.cn/mdy/47c7c9d7935b41e69ee9727a0101c138",
    handleFunc() {},
  },
  {
    label: "邀请业主",
    iconUrl: "https://cdn.juesedao.cn/mdy/93afb76a8c1c4060b18cdd85be574bed",
    handleFunc() {},
  },
  {
    label: "邀请工人",
    iconUrl: "https://cdn.juesedao.cn/mdy/e2452f5fa67a432c9774aa4525ca1b71",
    handleFunc() {},
  },
];
function navigateToAllRequirement() {
  uni.navigateTo({
    url: "/pages-sub/user_requirement_list/index",
  });
}
async function fetchData() {
  const { data } = await queryRequirementList({
    userId: 1,
    curPage: 1,
    jobState: null,
    number: 1,
  });
  latestRequirement.value = data[0];
}
onShow(async () => {
  fetchData();
});

onPageScroll((e) => {
  navTransparent.onScroll(e);
});
onPullDownRefresh(async () => {
  await fetchData();
  uni.stopPullDownRefresh();
});
</script>

<template>
  <view :style="`height: ${screenHeight}px`" class="mine_bg flex flex-col">
    <nav-with-support
      :left-arrow="false"
      :transparent="navTransparent.transparent.value"
      title="工作台"
    />
    <safe-area-layout>
      <view class="mx-auto w-90vw">
        <view class="mt-20px flex items-center gap-x-12px">
          <image
            class="h48px w48px"
            src="https://cdn.juesedao.cn/mdy/a3d1bc47b9ed472988473498604dbbfe"
          />
          <view class="flex flex-col justify-center">
            <view class="flex items-center gap-x-4px">
              <view class="text-16px font-bold"> 王女士</view>
              <sar-tag root-class="!px-8px" round theme="primary">
                业主
              </sar-tag>
            </view>
            <view
              class="text-12px text-#060606 opacity-60"
              @click="() => console.log('safas')"
            >
              编辑信息
            </view>
          </view>
        </view>
      </view>
      <view class="relative mt-60px flex flex-1 flex-col">
        <view
          class="relative z-10 flex-1 rounded-t-16px bg-white px-16px py-20px"
        >
          <!--        全部工单 -->
          <view
            class="h-56px w-full flex items-center justify-between rounded-12px bg-primary-500 px-16px text-white"
            @click="navigateToAllRequirement"
          >
            <view class="center">
              <custom-icon :size="21" icon-name="pointIcon" />
              <text class="ml-6px text-16px font-500"> 全部工单</text>
            </view>
            <custom-icon icon-name="rightArrowWhiteIcon" />
          </view>
          <!--        需求卡片 -->
          <view v-if="latestRequirement" class="mt-12px">
            <requirement-card
              :enable-shadow="true"
              :requirement="latestRequirement"
            />
          </view>
          <!--        常用功能 -->
          <view class="mt-40px">
            <view class="font-500"> 常用功能</view>
            <view class="grid grid-cols-4 mt-18px gap-40px">
              <button
                hover-class="none"
                v-for="(item, index) in featureList"
                :key="index"
                class="flex flex-col items-center justify-center !bg-transparent !p-0"
              >
                <custom-icon :custom-url="item.iconUrl" :size="22" />
                <view class="text-12px opacity-70">
                  {{ item.label }}
                </view>
              </button>
            </view>
          </view>
        </view>
        <view
          class="absolute z-9 h-60px w-screen rounded-t-16px bg-#FFE2D4 px-24px py-8px text-12px text-primary-500 -translate-y-35px"
        >
          <view class="flex items-center gap-x-8px">
            <custom-icon :size="20" icon-name="noticeIcon" />
            <text>这是一条公告！</text>
          </view>
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style lang="scss">
.mine_bg {
  flex-shrink: 0;
  background: linear-gradient(
    180deg,
    #f8e4db 0%,
    #faf2ee 13.07%,
    #f6f6f6 100.12%
  );
}
</style>
