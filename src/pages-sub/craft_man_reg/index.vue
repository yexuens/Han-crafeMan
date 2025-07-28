<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "layout": "customBar",
  "needLogin": true,
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "disableScroll": true,
  },
}
</route>

<script setup lang="ts">
import { imgRes } from "@/constants";
import { toast } from "@/utils/toast";
function gotoConfirm() {
  uni.navigateTo({
    url: "/pages-sub/craft_man_reg/index",
  });
}
function goToAuthentication() {
  toast.info("请先确认合同");
}
const { screenHeight } = uni.getWindowInfo();
</script>

<template>
  <view :style="`min-height: ${screenHeight}px`" class="bg relative">
    <safe-area-layout>
      <view
        class="ml-40px relative inline-block pt-85px text-center text-25px font-bold leading-7"
      >
        <text> 如何成为平台 </text>
        <br />
        <text class="underline-gradient"> 注册工匠 </text>
      </view>
      <view
        class="mx-auto relative mt-40px h-full w-90vw flex flex-col items-center gap-y-20px rounded-12px bg-white px-18px py-35px"
      >
        <view
          class="relative z-11 w-full flex items-center justify-between rounded-12px bg-[#E3EEFB] px-24px py-32px"
        >
          <view class="flex flex-col gap-y-7px">
            <view class="text-18px text-[#4D99FF] font-bold">
              第一步 合同确认
            </view>
            <view class="text-14px text-[#979797]"> 尚未确认合同 </view>
          </view>
          <view
            @click="gotoConfirm"
            class="go_to_confirm_btn flex items-center justify-center text-14px text-white font-bold"
          >
            去确认
          </view>
        </view>
        <image
          style="position: absolute"
          class="-top-148px right-28px h-200px w-130px z-10"
          :src="imgRes.squirrelFront"
        />
        <view
          @click="goToAuthentication"
          class="w-full flex items-center justify-between rounded-12px bg-[#EAF7EF] px-24px py-32px"
        >
          <view class="flex flex-col gap-y-7px">
            <view class="text-18px text-[#4D99FF] font-bold">
              第二步 信息填写
            </view>
            <view class="text-14px text-[#979797]"> 尚未提交资料 </view>
          </view>
          <view
            class="goto_auth_btn flex items-center justify-center text-14px text-white font-bold"
          >
            去认证
          </view>
        </view>
      </view>
    </safe-area-layout>
  </view>
</template>

<style scoped lang="scss">
.underline-gradient:before {
  content: "";
  position: absolute;
  flex-shrink: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25rpx;
  z-index: -1;
  background: linear-gradient(90deg, rgba(246, 99, 27, 0) 0%, #f6631b 100%);
}

.go_to_confirm_btn {
  width: 75px;

  height: 30px;
  flex-shrink: 0;
  border-radius: 15px;
  background: linear-gradient(180deg, #4d99ff 0%, #2375e4 100%);
  box-shadow:
    0px 4px 4px 0px rgba(19, 57, 180, 0.25) inset,
    0px 4px 4px 0px #4d99ff;
}

.goto_auth_btn {
  width: 75px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 15px;
  background: linear-gradient(180deg, #4feb7e 0%, #6bd58b 100%);
  box-shadow:
    0px 4px 4px 0px rgba(72, 184, 50, 0.25) inset,
    0px 4px 4px 0px #b4f2c7;
}
.bg {
  background: linear-gradient(
    180deg,
    #fc7c44 10.05%,
    #f7ded2 24.44%,
    #f6f6f6 100.12%
  );
}
</style>
