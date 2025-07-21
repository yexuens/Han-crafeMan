<route lang="jsonc">
{
"layout": "tabbar",
"style": {
// 'custom' 表示开启自定义导航栏，默认 'default'
"navigationStyle": "custom",
"navigationBarTitleText": "首页"
}
}
</route>

<script lang="ts" setup>
const menuBtnArea = uni.getMenuButtonBoundingClientRect()
</script>

<template>
  <view class="bg h-screen w-screen flex flex-col -z-1" style="pointer-events: none;position:absolute;" />
  <view class="h-screen w-screen flex flex-col" style="pointer-events: none">
    <view :style="`padding-top:${menuBtnArea.top}px`">
      <view :style="`width:100vw;height:${menuBtnArea.height}px`" class="relative flex items-center">
        <view class="mx-auto text-16px font-bold">
          工作台
        </view>
        <view :style="`position:absolute;left:calc( 100vw - ${(menuBtnArea.width + 48) * 2}rpx )`">
          <custom-icon :height="25" :width="28" icon-name="serviceIcon" />
        </view>
      </view>
    </view>
    <view class="mx-auto w-90vw">
      <view class="mt-20px flex items-center gap-x-12px">
        <image class="h48px w48px" src="https://cdn.juesedao.cn/mdy/a3d1bc47b9ed472988473498604dbbfe" />
        <view class="flex flex-col justify-center">
          <view class="flex items-center gap-x-4px">
            <view class="text-16px font-bold">
              王女士
            </view>
            <view class="text-10px">
              业主
            </view>
          </view>
          <view class="text-12px text-#060606 opacity-60" @click="() => console.log('safas')">
            编辑信息
          </view>
        </view>
      </view>
    </view>
    <view class="mt-60px flex-1 rounded-t-16px bg-white">
      <view class="absolute h-60px w-screen rounded-t-16px bg-#FFE2D4 -z-1 -translate-y-40px" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.bg {
  flex-shrink: 0;
  background: linear-gradient(180deg, #f8e4db 0%, #faf2ee 13.07%, #f6f6f6 100.12%);
}
</style>
