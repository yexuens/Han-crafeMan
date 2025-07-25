<script lang="ts" setup>
import type { IconResKeyType } from "@/constants";
import { iconRes } from "@/constants";

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  customClass: "",
});

interface Props {
  openType:
    | "contact"
    | "share"
    | "chooseAvatar"
    | "getUserInfo"
    | "getPhoneNumber";
  inline?: boolean;
  customClass?: string;
  getUserInfo?: (e: any) => void;
  chooseAvatar?: (e: any) => void;
  getPhoneNumber?: (e: any) => void;
}
</script>

<template>
  <button
    @getuserinfo="getUserInfo"
    @chooseavatar="chooseAvatar"
    @getphonenumber="getPhoneNumber"
    :class="[inline ? 'inline' : '', customClass]"
    class="!bg-transparent !p-0 !m-0 !ml-0 !mr-0 button-reset"
    hover-class="none"
    :open-type="openType"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button-reset {
  /* 清除所有内外边距 */
  margin: 0;
  padding: 0;

  /* 使按钮宽度和高度跟内容一样，而不是有个默认的最小尺寸 */
  display: block;
  box-sizing: border-box;

  /* 重置字体大小和行高，让它继承父元素 */
  font-size: inherit;
  line-height: inherit;

  /* 重置字体颜色 */
  color: inherit;

  /* 重置文字对齐方式为左对齐 */
  text-align: left;

  /* 清除背景色，使其透明 */
  background-color: transparent;

  /* 清除默认的圆角 */
  border-radius: 0;
}
</style>
