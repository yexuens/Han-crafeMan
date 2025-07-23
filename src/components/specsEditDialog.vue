<script lang="ts" setup>
import { ref, watch } from "vue";
import { addOrEditRequirement } from "@/service/requirement";

interface IProps {
  show: boolean;
  specsList?: { unit: string; price: number | string }[];
  id: number;
}

const props = withDefaults(defineProps<IProps>(), {
  show: false,
  specsList: () => [],
});

const emit = defineEmits(["update:show", "close"]);

interface ISpecEditable {
  unit: string;
  originalPrice: number | string;
  newPrice: number | string | null;
}

const _specsList = ref<ISpecEditable[]>([]);
const updateSuccess = ref(false);
watch(
  () => props.specsList,
  (newVal) => {
    _specsList.value = (newVal || []).map((spec) => ({
      unit: spec.unit,
      originalPrice: spec.price,
      newPrice: null,
    }));
  },
  { immediate: true, deep: true },
);

const handleUpdateSpecs = () => {
  try {
    const specsToSubmit = _specsList.value.map((spec) => {
      return {
        unit: spec.unit,
        price:
          spec.newPrice !== null && spec.newPrice !== ""
            ? spec.newPrice
            : spec.originalPrice,
      };
    });

    const finalSpecsString = JSON.stringify(specsToSubmit);
    const originalSpecsString = JSON.stringify(props.specsList);
    if (finalSpecsString === originalSpecsString) {
      updateSuccess.value = false;
      return;
    }

    addOrEditRequirement({
      id: props.id,
      specs: finalSpecsString,
      userId: 1,
    });
    updateSuccess.value = true;
  } catch (e) {
    updateSuccess.value = false;
  }
};

const beforeClose = (type: string) => {
  if (type === "confirm") {
    handleUpdateSpecs();
    emit("update:show", false);
  }
  return true;
};

const handleClose = (isVisible: boolean) => {
  if (!isVisible) {
    emit("close", updateSuccess.value);
  }
};
</script>

<template>
  <sar-dialog
    :before-close="beforeClose"
    :cancel-props="{ type: 'outline' }"
    :headed="false"
    :overlay-closable="false"
    :visible="show"
    popup-style="top: 50%"
    @update:visible="handleClose"
  >
    <view class="text-center text-18px font-500 pt-24px pb-28px">
      预算修改
    </view>
    <scroll-view
      class="max-h-300px"
      scroll-y
      style="margin-top: 1px; margin-bottom: 16rpx; overflow-y: auto"
    >
      <view class="px-24px flex flex-col gap-y-24px">
        <view v-for="(spec, index) in _specsList" :key="index">
          <view class="flex items-center text-14px justify-between">
            <view>{{ spec.unit }}</view>
            <view class="text-#060606 text-14px opacity-60">
              当前价格：{{ spec.originalPrice }}/㎡
            </view>
          </view>
          <sar-input
            v-model.number="spec.newPrice"
            placeholder="请输入提价后的价格"
            root-class="mt-8px !rounded-12px !bg-#F6F6F6"
            type="number"
          />
        </view>
      </view>
    </scroll-view>
  </sar-dialog>
</template>
