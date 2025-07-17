<script setup lang="ts">
import type { IconResKeyType } from '@/constants'
import { iconRes } from '@/constants'

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const { iconName, size, customClass } = withDefaults(defineProps<Props>(), {
  height: 16,
  width: 16,
})

interface Props {
  iconName: IconResKeyType
  size?: number
  height?: number
  width?: number
  customClass?: string
}
</script>

<template>
  <image
    :style="`width: ${size ? size * 2 : width * 2}rpx;height: ${size ? size * 2 : height * 2}rpx`"
    :class="customClass"
    :src="iconRes[iconName]"
  />
</template>

<style scoped>

</style>
