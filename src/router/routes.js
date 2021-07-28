/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: Summer
 * @Date: 2021-04-29 14:26:06
 * @LastEditors: Summer
 * @LastEditTime: 2021-05-11 17:16:32
 */
export default [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/home/index.vue')
  }
]
