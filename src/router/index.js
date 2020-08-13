/*
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-03 11:27:34
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 */
import Vue from 'vue'
import Router from './router'

let routes = []
if (process.env.VUE_APP_BUILD === 'dev') {
  // 只有一个应用，暂时不需要入口
  // const mainRoute = {
  //     path: '/applications',
  //     name: 'applications',
  //     component: require('../applications').default,
  // }
  // routes.push(mainRoute)
  routes.push(
    ...require('@/modules/handover-inventory/router').default, // 移交盘点
  )
  routes.push(
    ...require('@/modules/assets-inventory/router').default, // 资产盘点
  )
} else {
  routes.push(...require(`@/modules/${process.env.VUE_APP_TARGET}/router`).default)
}

routes.unshift({
  path: '*',
  redirect: routes[0].path,
})

Vue.use(Router)

export default new Router({
  routes,
})
