/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: Summer
 * @Date: 2021-05-08 14:32:25
 * @LastEditors: Summer
 * @LastEditTime: 2021-05-11 14:36:43
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from '@/api'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import '@/styles/common.less'
import { Tabbar, TabbarItem, Toast, Popup, DatetimePicker, Divider, DropdownMenu, DropdownItem, Row, Col, NavBar, Search, Icon, Calendar, List, Cell, Picker, PullRefresh, Button } from 'vant'
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'http://3701e863b2b546408640357129b912c9@36.26.8.234:9006/sentry/6',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.DEPLOY_ENV
  })
}

Vue.config.productionTip = false
Vue.prototype.$store = store

// 把api公共请求放到全局
Vue.prototype.$api = api

// 清除click事件300ms延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(Tabbar).use(TabbarItem).use(Toast).use(Popup).use(DatetimePicker).use(Divider).use(DropdownMenu).use(DropdownItem).use(Row).use(Col).use(NavBar).use(Search).use(Icon).use(Calendar).use(List).use(Cell).use(Picker).use(PullRefresh).use(Button)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
