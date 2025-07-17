// https://www.npmjs.com/package/@uni-helper/unocss-preset-uni
import { presetUni } from '@uni-helper/unocss-preset-uni'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        100: '#FFE2D4', // 最浅
        200: '#FFDDCF',
        300: '#FE9B6A',
        400: '#F8996A',
        500: '#F6631B', // 核心主色
        600: '#F6590D', // 更深的主色
      },
    },
  },
  postprocess: (util) => {
    // 自动将 px 替换为 2 倍 rpx
    util.entries = util.entries.map(([key, value]) => {
      if (typeof value === 'string' && value.includes('px')) {
        // 匹配 14px 这种单位，转为 28rpx
        value = value.replace(/(\d+(\.\d+)?)px/g, (_, num) => `${Number.parseFloat(num) * 2}rpx`)
      }
      return [key, value]
    })
  },
  presets: [
    presetUni({
      attributify: {
        // prefix: 'fg-', // 如果加前缀，则需要在代码里面使用 `fg-` 前缀，如：<div fg-border="1px solid #000"></div>
        prefixedOnly: true,
      },
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // 支持css class属性化
    presetAttributify(),
  ],
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      center: 'flex justify-center items-center',
    },
  ],
  safelist: [],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})
