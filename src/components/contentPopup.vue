<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
}>(), {})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()
const content = `特别提醒：在接受本协议之前，请您仔细阅读本协议的全部内容，如果您对本协议条款有任何疑问，可以通过匠平台客服渠道进行问。如果您不同意本协议的任意内容，或者无法准确理解条款的解释，请不要同意本协议或使用本协议项下的服务，否则，您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，成为汉工华匠平台"用户"。
请务必认真阅读，特别是粗体下划线部分内容。

<br/><br/><br/>第一条、定义
汉工华匠平台：指土巴兔集团股份有限公司及其关联公司合法拥有并运营的相关网站及客户端应用程序（以下称"本网站"或"土巴兔公司"或"平台"）运营管理的，供用户发布房屋装修服务需求及装修建材购买需求、并与服务／商品提供方达成交易的网络服务平台，包括但不限于电脑及手机客户端（含 IOS 、安卓及已有或未来将新增的任何其他客户端）、微信公众号、微信小程序、网站及其他应用程序。
<br/>2、您：有装修服务需求的，在汉工华匠平台上注册，并使用其本人注册的账号，通过汉工华匠平台展示的信息获取商品／服务的具有完全民事行为能力的自然人、法人或其他组织。
<br/>3、工匠：即装修服务提供方，是指承接并提供装修服务的主体，包括但不限于拆除工、水电工、泥工、木工、油漆工、设计师、验房师、工长等自然人、法人及其他组织。
<br/>4、商家：即装修建材提供方，通过汉工华匠平台出售装修建材的法人及其他商事主体。
<br/>5、账号：指您根据汉工华匠平台提供的方式设置或取得的供您登录及使用汉工华匠平台的编码，该编码可能是您的手机号码／邮箱地址，也可能是您根据汉工华匠平台的规则编辑或设置的其他数字及／或文字及／或其组合。`
const show = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const hasRead = ref(false)

function onScrollToEnd() {
  hasRead.value = true
}

function handleClose() {
  if (hasRead.value) {
    emit('update:modelValue', false) // Also close the popup
    emit('close')
  }
  else {
    uni.showToast({
      title: '请先阅读完协议',
      icon: 'none',
    })
  }
}

onShow(() => {
  setTimeout(() => {
    hasRead.value = true
  }, 3000)
})
</script>

<template>
  <sar-popup
    :visible="show"
    :close-on-click-modal="false"
    custom-style="border-radius: 32rpx;"
    safe-area-inset-bottom
    @close="handleClose"
  >
    <view class="h-520px w-320px flex flex-col items-center gap-y-20px rounded-lg bg-white pb-24px pt-36px">
      <view class="text-4.5 text-[#000] font-700 lh-[100%] font-not-italic">
        汉工华匠服务协议
      </view>

      <scroll-view
        class="hide-scrollbar h-380px w-66 text-justify text-2.5 text-[#414141]"
        scroll-y
        @scrolltolower="onScrollToEnd"
      >
        <rich-text :nodes="content" />
      </scroll-view>

      <button
        :class="{ 'opacity-50': !hasRead }"
        class="rounded-12px bg-primary-500 px-60px text-white"
        @click="handleClose"
      >
        同意协议
      </button>
    </view>
  </sar-popup>
</template>

<style scoped>
/* A simple class to visually indicate the disabled state */
.opacity-50 {
  opacity: 0.5;
}
</style>
