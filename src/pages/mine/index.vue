<route lang="jsonc">
{
"layout": "tabbar",
"style": {
// 'custom' 表示开启自定义导航栏，默认 'default'
"navigationStyle": "custom",
"navigationBarTitleText": "首页"
}
}
</route>

<script lang="ts" setup>
import FirstTakeOrderGuide from '@/components/firstTakeOrderGuide.vue'
</script>

<template>
  <first-take-order-guide />
</template>

<style lang="scss" scoped>

</style>
