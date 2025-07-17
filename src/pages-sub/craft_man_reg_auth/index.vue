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
import SafeAreaLayout from '@/components/safeAreaLayout.vue'

const form = reactive({
  phone: '',
  name: '',
  serviceCity: '',
})

const formValidation = computed(() => !(form.name && form.serviceCity && form.phone))

function handleSubmit() {

}
</script>

<template>
  <safe-area-layout>
    <view>
      <view class="relative ml-40px inline-block pt-40px text-center text-18px font-bold leading-7">
        第一步 身份认证
      </view>
      <view
        class="relative mx-auto mt-18px h-screen w-90vw flex flex-col items-center gap-y-20px rounded-12px bg-[#f6f6f6] px-18px py-35px"
        @click="() => console.log('wqrqw')"
      >
        <view class="flex flex-col items-center gap-y-20px">
          <view class="flex items-center gap-x-4px">
            <text class="w-80px text-left text-14px text-[#000] opacity-60">
              姓名：
            </text>
            <sar-input v-model="form.name" root-class="h-40px !w-200px rounded-6px bg-white" />
          </view>
          <view class="flex items-center gap-x-4px">
            <text class="w-80px text-left text-14px text-[#000] opacity-60">
              电话：
            </text>
            <sar-input v-model="form.phone" root-class="h-40px !w-200px rounded-6px bg-white" />
          </view>
          <view class="flex items-center gap-x-4px">
            <text class="w-80px text-left text-14px text-[#000] opacity-60">
              服务城市：
            </text>
            <sar-input v-model="form.serviceCity" root-class="h-40px !w-200px rounded-6px bg-white" />
          </view>
          <sar-button :disabled="formValidation" root-class="!w-full !mt-30px" @click="handleSubmit">
            确认信息完成工匠注册
          </sar-button>
        </view>
      </view>
    </view>
  </safe-area-layout>
</template>

<style lang="scss" scoped>
</style>
