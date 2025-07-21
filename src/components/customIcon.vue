<script lang="ts" setup>
import type { IconResKeyType } from '@/constants'
import { iconRes } from '@/constants'

const { iconName, size, customClass } = withDefaults(defineProps<Props>(), {
  height: 16,
  width: 16,
})

interface Props {
  iconName?: IconResKeyType
  size?: number
  height?: number
  width?: number
  customClass?: string
  customUrl?: string
}
</script>

<template>
  <image
    :class="customClass"
    :src="customUrl ? customUrl : iconRes[iconName]"
    :style="`width: ${size ? size * 2 : width * 2}rpx;height: ${size ? size * 2 : height * 2}rpx`"
    class="block"
  />
</template>

<style scoped>
</style>
