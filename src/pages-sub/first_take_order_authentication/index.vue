<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
"layout": "customBar",
"style": {
// 'custom' 表示开启自定义导航栏，默认 'default'
"navigationStyle": "custom",
"disableScroll":true,
}
}
</route>

<script lang="ts" setup>
const step = ref(3)
const stepList = ref([
  {
    label: '第一步 请上传或拍摄身份证',
  },

  {
    label: '第二步 完成视频学习',
  },

  {
    label: '第三步 完成考试',
  },
])
const isFinishedStep = computed(() => step.value >= stepList.value.length)
const isFinishedLearn = ref(false)
const form = reactive({
  idCard: '',
  progress: 0,
})
const nextStepBtnDisabled = computed(() => {
  switch (step.value) {
    case 1:
      return !form.idCard
    case 2:
      return !isFinishedLearn.value
    case 3:
      return false
    default:
      return false
  }
})
const nextStepBtnLabel = computed(() => {
  switch (step.value) {
    case 2:
      return isFinishedLearn.value ? '下一步' : '请先完成视频学习'
    case 3:
      return '下一题'
    default:
      return '下一步'
  }
})
function directUploadIdCardPics() {
  uni.chooseImage({
    count: 1,
    success(res) {
      form.idCard = Array.isArray(res.tempFilePaths) ? res.tempFilePaths[0] : res.tempFilePaths
    },
  })
}

function handleUploadIdCardPics() {
  if (form.idCard) {
    uni.showModal({
      title: '是否需要重新上传身份证?',
      success(res) {
        if (res.confirm) {
          directUploadIdCardPics()
        }
      },
    })
    return
  }
  directUploadIdCardPics()
}

function handleSubmit() {
  console.log('success')
}

function validateFormAndHandleOperation() {
  switch (step.value) {
    case 1:
      if (!form.idCard) {
        uni.showToast({
          title: '请先上传身份证人像面图片',
        })
        return false
      }
      return true
    case 2:
      return true
      break
    case 3:
      break
    default:
      handleSubmit()
      return true
  }
}

function handleNextStep() {
  if (!validateFormAndHandleOperation())
    return
  step.value = step.value + 1
}

function handleUpdateProgress(e) {
  const { currentTime, duration } = e.detail
  if (!duration || duration <= 0) {
    form.progress = 0 // 如果时长无效，进度设为0
    return
  }
  const progressPercentage = (currentTime / duration) * 100
  form.progress = Math.round(progressPercentage) // 四舍五入为整数
  if (form.progress >= 100) {
    isFinishedLearn.value = true
  }
}
</script>

<template>
  <safe-area-layout>
    <view v-for="(stepItem, index) in stepList" :key="index">
      <view v-if="step === index + 1" class="px-16px py-30px">
        <view class="primary-text pb-100px">
          {{ stepItem.label }}
        </view>

        <block v-if="step === 1">
          <view
            class="flex flex-col items-center gap-y-30px"
          >
            <view class="h-170px w-250px flex items-center justify-center" @click="handleUploadIdCardPics">
              <image
                v-if="!form.idCard" class="h-full w-full"
                mode="aspectFill" src="https://cdn.juesedao.cn/mdy/af5d10481fb54f389440a04a7e0e0d1a"
              />
              <view v-else>
                已上传
              </view>
            </view>
            <view class="primary-text">
              身份证-人像面
            </view>
          </view>
        </block>

        <block v-if="step === 2">
          <view
            class="flex flex-col items-center gap-y-30px"
          >
            <view class="h-220px w-350px flex items-center justify-center">
              <video
                class="h-full w-full"
                mode="aspectFill"
                src="https://cdn.juesedao.cn/mdy/827246545e4e4be5a6f0733987942813"
                @timeupdate="handleUpdateProgress"
              />
            </view>
            <view class="primary-text">
              学习进度：
              {{ isFinishedLearn ? 100 : form.progress }}
              %
            </view>
          </view>
        </block>

        <block v-if="step === 3">
          hhh
        </block>

        <sar-button :disabled="nextStepBtnDisabled" root-class="!mt-40px" @click="handleNextStep">
          {{ nextStepBtnLabel }}
        </sar-button>
      </view>
    </view>
  </safe-area-layout>
</template>

<style lang="scss" scoped>
.primary-text {
  color: #000;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
}
</style>
