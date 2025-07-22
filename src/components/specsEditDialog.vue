<script lang="ts" setup>
import { ref } from "vue";

interface IProps {
  show: boolean;
  specsList?: Array<unknown>;
  // onClose: () => void; // 移除 onClose，因为它将被 emit 替代
}

const props = withDefaults(defineProps<IProps>(), {
  show: false,
});
watchEffect(() => {
  console.log(props.specsList);
});
// 修改点 2: 声明组件可以发出的事件
const emit = defineEmits(["update:show", "close"]);

const unitList = ref([
  // ... unitList 内容不变
]);

const beforeClose = (type: string) => {
  if (type === "confirm") {
    emit("update:show", false);
  }
  // 如果是 cancel 或 overlay-close，允许直接关闭
  return true;
};
const handleClose = (val) => {
  if (!val) emit("close");
  return;
};
</script>

<template>
  <sar-dialog
    :before-close="beforeClose"
    :cancel-props="{
      type: 'outline',
    }"
    :headed="false"
    :overlay-closable="false"
    :visible="show"
    popup-style="top: 50%"
    @update:visible="handleClose"
  >
    <view class="text-center text-18px font-500 pt-24px pb-28px"
      >预算修改
    </view>
    <scroll-view
      class="max-h-300px"
      scroll-y
      style="margin-top: 1px; margin-bottom: 16rpx; overflow-y: auto"
    >
      <view class="px-24px flex flex-col gap-y-24px">
        <view v-for="(spec, index) in specsList" :key="index">
          <view class="flex items-center text-14px justify-between">
            <view>{{ spec.unit }}</view>
            <view class="text-#060606 text-14px opacity-60"
              >当前价格：{{ spec.price }}/㎡
            </view>
          </view>
          <sar-input
            root-class="mt-8px !rounded-12px !bg-#F6F6F6"
            placeholder="请输入提价后的价格"
          />
        </view>
      </view>
    </scroll-view>
  </sar-dialog>
</template>
