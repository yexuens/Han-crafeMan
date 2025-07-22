<script lang="ts" setup>
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})
const visible = ref(true)

function beforeClose() {
  return new Promise(resolve => setTimeout(resolve, 1500))
}

const guideList = ref([{
  content: '第一步 上传身份证',
  status: 0,
  unfinishedTip: '尚未完成上传',
  url: '/pages',
  btnLabel: '去上传',
  bgColor: '#f0fbe9',
}, {
  content: '第二步 完成视频学习',
  status: 1,
  unfinishedTip: '尚未视频学习',
  btnLabel: '去学习 ',

  url: '/pages',
  bgColor: '#e9fbfb',
}, {
  content: '第三步 完成考试题目',
  status: 0,
  unfinishedTip: '尚未完成考试',
  btnLabel: '去考试',

  url: '/pages',
  bgColor: '#fbe9ef',
}])
</script>

<template>
  <sar-popup
    :visible="visible"
    effect="fade"
    @overlay-click="beforeClose"
  >
    <view class="guide-container h-420px w-320px flex flex-col px-32px pb-32px pt-50px">
      <view class="flex flex-col items-center text-18px text-white" style="text-shadow: 0 4px 4px rgb(12,4,0,0.25)">
        <view class="font-bold">
          首次接单
        </view>
        <view>请先完成以下步骤</view>
      </view>
      <view class="mt-26px flex flex-1 grow-1 flex-col items-center gap-y-12px">
        <view
          v-for="(item, index) in guideList" :key="index"
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
          <view class="go-to-btn flex items-center justify-center text-12px text-white">
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
