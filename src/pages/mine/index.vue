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
import {
  queryRequirementList,
  queryRequirementNotice,
} from "@/service/requirement";
import { useNavTransparent } from "@/composables/useNavTransparent";
import { useUserStore } from "@/store";
import { imgRes } from "@/constants";
import { useSafeAreaStyle } from "@/composables/useSafeAreaStyle";
import { isNotEmpty } from "@/utils";

const user = useUserStore();
const navTransparent = useNavTransparent();
const latestRequirement = ref();
const { style } = useSafeAreaStyle();
const screenHeight = uni.getSystemInfoSync().windowHeight;

const featureList = [
  {
    label: "我的资料",
    iconUrl: "https://cdn.juesedao.cn/mdy/47c7c9d7935b41e69ee9727a0101c138",
    handleFunc: () => navigateToEditProfile(),
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
    url: "/pages-sub/user_orders/index",
  });
}
async function fetchData() {
  const { data } = await queryRequirementList({
    userId: user.userInfo.id,
    curPage: 1,
    jobState: null,
    number: 1,
  });
  if (isNotEmpty(data)) latestRequirement.value = data[0];
}
function navigateToLogin() {
  if (user.isLogin) return;
  uni.navigateTo({
    url: "/pages-sub/login/index",
  });
}
async function fetchNotice() {
  const data = await queryRequirementNotice({
    type: 0,
    ...{
      userId: user.userInfo.role === 0 ? user.userInfo.id : null,
      accesUserId: user.userInfo.role === 1 ? user.userInfo.id : null,
    },
  });
}
function navigateToEditProfile() {
  uni.navigateTo({
    url: "/pages-sub/user_profile/index?scene=2",
  });
}
onShow(async () => {
  if (!user.isLogin) return;
  fetchData();
  fetchNotice();
  user.updateUser();
});

onPageScroll((e) => {
  navTransparent.onScroll(e);
});
onPullDownRefresh(async () => {
  if (!user.isLogin) return;

  await fetchData();
  await fetchNotice();

  uni.stopPullDownRefresh();
});
</script>

<template>
  <view :style="`min-height: ${screenHeight}px`" class="mine_bg flex flex-col">
    <nav-with-support
      :left-arrow="false"
      :transparent="navTransparent.transparent.value"
      title="工作台"
    />
    <view class="mx-auto w-90vw" :style="style">
      <view
        class="mt-20px flex items-center gap-x-12px"
        @click="navigateToLogin"
      >
        <image
          class="h48px w48px rounded-full"
          :src="user.userInfo.wxPhoto || imgRes.defaultAvatar"
        />
        <view class="flex flex-col gap-y-4px justify-center">
          <view class="flex items-center gap-x-4px">
            <view class="text-16px font-bold">
              {{ user.userInfo.wxName || "待登录" }}</view
            >
            <sar-tag
              v-if="user.isLogin"
              root-class="!px-8px"
              round
              theme="primary"
            >
              {{ user.userInfo.role === 0 ? "业主" : "工匠" }}
            </sar-tag>
          </view>
          <view
            v-if="user.isLogin"
            class="text-12px text-#060606 opacity-60"
            @click="navigateToEditProfile"
          >
            编辑信息
          </view>
        </view>
      </view>
    </view>
    <view class="relative mt-60px h-full flex flex-1 flex-col">
      <view
        class="relative z-10 flex-1 rounded-t-16px bg-white px-16px py-20px"
      >
        <!--        全部工单 -->
        <view
          v-if="user.isLogin"
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
        <view :class="user.isLogin ? 'mt-40px' : 'mt-0'">
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
        v-if="user.isLogin"
        class="absolute z-9 h-60px w-screen rounded-t-16px bg-#FFE2D4 px-24px py-8px text-12px text-primary-500 -translate-y-35px"
      >
        <view class="flex items-center gap-x-8px">
          <custom-icon :size="20" icon-name="noticeIcon" />
          <text>这是一条公告！</text>
        </view>
      </view>
    </view>
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
