<script lang="ts" setup>
import type { IconResKeyType } from "@/constants";
import { iconRes } from "@/constants";

const { iconName, size, customClass } = withDefaults(defineProps<Props>(), {
  height: 16,
  width: 16,
});

interface Props {
  iconName?: IconResKeyType;
  size?: number;
  height?: number;
  width?: number;
  customClass?: string;
  customUrl?: string;
  openType: "contact" | "share";
}
</script>

<template>
  <button
    class="flex flex-col items-center justify-center !bg-transparent !p-0"
    hover-class="none"
    :open-type="openType"
  >
    <image
      :class="customClass"
      :src="customUrl ? customUrl : iconRes[iconName]"
      :style="`width: ${size ? size * 2 : width * 2}rpx;height: ${size ? size * 2 : height * 2}rpx`"
      class="block"
    />
  </button>
</template>

<style lang="scss" scoped></style>
