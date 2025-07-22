import {extend, locale} from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import {VueQueryPlugin} from '@tanstack/vue-query'
import {createSSRApp} from 'vue'
import App from './App.vue'
import {requestInterceptor} from './http/interceptor'
import {routeInterceptor} from './router/interceptor'
import 'dayjs/locale/zh-cn'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

import 'sard-uniapp/global.d.ts'

// 扩展功能插件
extend(relativeTime)
extend(duration)

// 本地化语言
locale('zh-cn')

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(VueQueryPlugin)

  return {
    app,
  }
}
