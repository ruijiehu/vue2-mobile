import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
// import { hasRight } from '@/libs/util'
Vue.use(Router)

const router = new Router({
  routes,
  mode: 'hash'
})

// const toPage = (to, from, next) => {
//   if (!to.meta.access || hasRight(store.state.user.rights, to.meta.access[0])) {
//     next()
//   } else {
//     next(new Error('您无权限进入此页面'))
//   }
// }

// 路由守卫
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to) => {
  window.scrollTo(0, 0)
})

router.onError((err) => {
  console.log(err)
})
export default router
