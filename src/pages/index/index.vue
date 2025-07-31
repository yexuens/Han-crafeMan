<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc" type="home">
{
  "layout": "tabbar",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页",
  },
}
</route>

<script lang="ts" setup>
import { imgRes } from "@/constants";
import { queryCraftManCount } from "@/service/system";
import { useUserStore } from "@/store";
import { queryRequirementCount } from "@/service/requirement";
const craftManCount = ref(0);
const current = ref(0);
const isCraftMan = computed(() => user.userInfo?.role === 1);
const isFinishCraftAuth = computed(() => user.userInfo?.name);
const user = useUserStore();
const popupShow = ref(false);
const menuButtonArea = uni.getMenuButtonBoundingClientRect();
const bannerList = [
  "https://cdn.juesedao.cn/mdy/a064a93175144fd789d3a628977a2d54",
  "https://cdn.juesedao.cn/mdy/6d62ae3a3fec4e39933010403d456b54",
  "https://cdn.juesedao.cn/mdy/2a81d7f356fa44d981e77ecc77220a67",
];
const newRequirementCount = ref(0);
const { screenHeight } = uni.getWindowInfo();
function handleCraftManRegistration() {
  uni.navigateTo({
    url: "/pages-sub/craft_man_reg/index",
  });
}
async function fetchManCount() {
  const data = (await queryCraftManCount()) as any;
  craftManCount.value = data?.totalnum || 0;
}
async function fetchRequirementCount() {
  const data: any = await queryRequirementCount({
    accesUserId: user.userInfo.id,
  });
  if (data.code === 1) {
    newRequirementCount.value = data.Num1;
  }
}
function navigateToOrderCenter() {
  uni.navigateTo({
    url: "/pages-sub/craft_man_order_center/index",
  });
}
const bannerTextList = ref([
  {
    title: "业主自主出价更优惠\n" + "十万工匠更快接单",
    sub: "去掉中间商工价公开透明\n" + "需求直接对工匠效率更高",
  },
  {
    title: "业主议价：更优惠！\n海量工匠：极速响应！",
    sub: "告别中间差价，明码实价\n需求秒达工匠，效率倍增",
  },
  {
    title: "价格由你定，工匠秒响应！",
    sub: "砍掉中间商，透明更高效。",
  },
]);
onShow(() => {
  fetchManCount();
  if (isFinishCraftAuth.value) fetchRequirementCount();
});
onShareAppMessage(() => {
  return {};
});
</script>

<template>
  <view
    class="bg flex flex-col"
    :style="`padding-top: ${menuButtonArea.top}px;height: ${screenHeight}px`"
  >
    <view class="px-12px">
      <!--    TopBar -->
      <view
        class="flex items-center gap-y-4px text-18px text-white"
        :style="`height:${menuButtonArea.height}px`"
      >
        <image
          class="w-240px"
          mode="widthFix"
          src="https://cdn.juesedao.cn/mdy/1ce89fd31d7a4e5da0a5d7e7c02640d8"
        />
      </view>
      <!--    Craft Man Count Card -->
      <view
        class="mt-26px h-[84px] w-[351px] flex shrink-0 flex-col justify-between border-b-[1px] border-b-[#FFF] rounded-[12px] border-b-solid bg-gradient-[90deg,#EEF0FF_0%,#FFFAEE_44.19%] bg-gradient-linear p-16px"
      >
        <view class="flex items-center justify-between pr-8px">
          <view class="flex gap-x-8px">
            <text class="text-24px text-primary-500 font-bold">
              {{ craftManCount }}
            </text>
            <text class="my-auto text-12px text-[#060606] font-500">
              名高标准工匠
            </text>
          </view>
          <icon-button
            open-type="contact"
            :width="28"
            :height="24"
            icon-name="serviceIcon"
          />
        </view>
        <view class="flex items-center gap-x-4px">
          <custom-icon :size="12" icon-name="funIcon" />
          <view class="text-12px text-primary-500">
            更多工匠 更快接单 匹配更灵活 装修更省心
          </view>
        </view>
      </view>
      <!--      Valuable Card -->
      <view class="mt-32px">
        <view
          class="underline-gradient relative ml-25px inline-block text-18px font-bold"
        >
          我们的价值
        </view>
        <view
          class="relative mt-14px h-[160px] w-[351px] rounded-[12px] bg-gradient-[180deg,#F6621A_0%,#F8996A_100%] bg-gradient-linear"
        >
          <!--          内容轮播 -->
          <view
            style="position: relative"
            class="h-full w-220px py-20px pl-24px"
          >
            <swiper
              :current="current"
              autoplay
              :interval="3000"
              @change="current = $event.detail.current"
            >
              <swiper-item v-for="(item, index) in bannerTextList" :key="index">
                <view class="text-white text-16px font-bold">{{
                  item.title
                }}</view>
                <view class="text-12px mt-14px text-white">{{ item.sub }}</view>
              </swiper-item>
            </swiper>
            <sar-swiper-dot
              :list="bannerTextList"
              field="title"
              :current="current"
              type="dot-bar"
            />
          </view>

          <image
            class="bottom-0 h-225px w-150px -right-12px"
            style="position: absolute"
            :src="imgRes.squirrelSide"
          />
        </view>
      </view>
      <!--      Card -->
      <view class="mt-35px flex items-center justify-between">
        <image
          v-for="url in bannerList"
          :key="url"
          class="h-[240px] w-[109px] shrink-0"
          :src="url"
          mode="aspectFill"
        />
      </view>
    </view>
    <view class="text-#c9c6c6 mx-auto mt-24px text-12px"
      >-蜜多云科技提供技术支持-
    </view>
  </view>
  <content-popup v-model="popupShow" />
  <image
    v-if="!user.isLogin || !isFinishCraftAuth"
    class="fixed bottom-100px right-0 h-40px w-100px"
    mode="widthFix"
    :src="imgRes.registerCraftButton"
    @click="handleCraftManRegistration"
  />
  <!--  接单中心 -->
  <view
    @click="navigateToOrderCenter"
    v-else
    class="fixed bottom-40px left-50% h-[66px] w-[350px] flex shrink-0 items-center rounded-[20px] bg-gradient-[180deg,#FE9B6A_0%,#F6631B_100%] bg-gradient-linear px-26px py-8px shadow-[0px_4px_4px_0px_#FFD1BA,0px_4px_4px_0px_#FFE6D9,0px_4px_4px_0px_#FFBB98_inset] -translate-x-1/2"
  >
    <image class="h-50px w-50px" :src="imgRes.orderReceivingCenter" />
    <view class="ml-6px text-25px text-white"> 接单中心 </view>
    <view class="ml-auto flex flex-col">
      <view class="text-12px text-[#872C00]">
        +{{ newRequirementCount }}条新需求
      </view>
      <view class="text-right text-10px text-white"> 马上查看 </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.underline-gradient:before {
  content: "";
  position: absolute;
  flex-shrink: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: -1;
  background: linear-gradient(90deg, rgba(246, 99, 27, 0) 0%, #f6631b 100%);
}
.bg {
  background: linear-gradient(
    180deg,
    #fc7c44 10.05%,
    #f6f6f6 24.44%,
    #f6f6f6 100.12%
  );
  z-index: -3;
}
.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120rpx;
  font-weight: bold;
  color: var(--sar-white);
}

.slide1 {
  background-color: rgba(var(--sar-red-rgb), 0.3);
}

.slide2 {
  background-color: rgba(var(--sar-green-rgb), 0.3);
}

.slide3 {
  background-color: rgba(var(--sar-blue-rgb), 0.3);
}
</style>
