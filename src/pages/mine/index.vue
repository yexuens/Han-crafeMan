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
const screenHeight = uni.getSystemInfoSync().windowHeight
const featureList = [{
  label: '我的资料',
  iconUrl: 'https://cdn.juesedao.cn/mdy/47c7c9d7935b41e69ee9727a0101c138',
  handleFunc() {

  },
}, {
  label: '邀请业主',
  iconUrl: 'https://cdn.juesedao.cn/mdy/93afb76a8c1c4060b18cdd85be574bed',
  handleFunc() {

  },
}, {
  label: '邀请工人',
  iconUrl: 'https://cdn.juesedao.cn/mdy/e2452f5fa67a432c9774aa4525ca1b71',
  handleFunc() {

  },
}]
</script>

<template>
  <view class="mine_bg flex flex-col" :style="`height: ${screenHeight}px`">
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
            <sar-tag root-class="!px-8px" round theme="primary">
              业主
            </sar-tag>
          </view>
          <view class="text-12px text-#060606 opacity-60" @click="() => console.log('safas')">
            编辑信息
          </view>
        </view>
      </view>
    </view>
    <view class="relative mt-60px flex flex-1 flex-col">
      <view class="relative z-10 flex-1 rounded-t-16px bg-white px-16px py-20px">
        <!--        全部工单 -->
        <view class="h-56px w-full flex items-center justify-between rounded-12px bg-primary-500 px-16px text-white">
          <view class="center">
            <custom-icon :size="21" icon-name="pointIcon" />
            <text class="ml-6px text-16px font-500">
              全部工单
            </text>
          </view>
          <custom-icon icon-name="rightArrowWhiteIcon" />
        </view>
        <!--        需求卡片 -->
        <view class="sd mt-20px rounded-8px bg-white px-18px py-24px">
          <view class="flex flex-col gap-y-12px text-12px text-#979797">
            <view>房屋地址 佛山市南海区季华东路万科金域..</view>
            <view>发布时间 2025.15:30:17</view>
            <view>房发布详情 点击查看</view>
          </view>
          <view class="mt24px flex items-center justify-between">
            <view class="flex flex-col gap-y-4px text-14px" style="width:calc( 100% - 200rpx )">
              <view class="flex items-center gap-x-8px">
                <view class="text-primary-500">
                  接单人
                </view>
                <view class="font-bold">
                  夜雪
                </view>
              </view>
              <view class="flex items-center gap-x-8px">
                <view class="text-primary-500">
                  已发布
                </view>
                <view class="font-bold">
                  3天21小时36分
                </view>
              </view>
            </view>
            <sar-button>
              马上加价
            </sar-button>
          </view>
          <view class="mt-40px flex items-center justify-between">
            <view v-for="(item, index) in 5" :key="index" class="check_status_line">
              <custom-icon :size="18" icon-name="checkedStatusIcon" />
            </view>
          </view>
        </view>
        <!--        常用功能 -->
        <view class="mt-40px">
          <view class="font-500">
            常用功能
          </view>
          <view class="grid grid-cols-4 mt-18px gap-40px">
            <button v-for="(item, index) in featureList" :key="index" class="flex flex-col items-center justify-center !bg-transparent !p-0">
              <custom-icon :size="22" :custom-url="item.iconUrl" />
              <view class="text-12px opacity-70">
                {{ item.label }}
              </view>
            </button>
          </view>
        </view>
      </view>
      <view class="absolute z-9 h-60px w-screen rounded-t-16px bg-#FFE2D4 px-24px py-8px text-12px text-primary-500 -translate-y-35px">
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
  background: linear-gradient(180deg, #f8e4db 0%, #faf2ee 13.07%, #f6f6f6 100.12%);
}
.sd {
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.25);
}
.check_status_line:after {
  content: '';
  display: block;
  position: absolute;
  height: 1px;
  background: #f86919;
  width: 100%;
}
</style>
