/*
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 17:16:22
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 */
import Vue from 'vue'
import FastClick from 'fastclick'
// import { Select, Progress, Option } from 'element-ui'
import ElementUI from 'element-ui'
import App from './App.vue'
import store from './store'
import router from './router'

import mixin from '@/mixin/bgControl'

import 'x-photoswipe/dist/photoswipe.css'
import 'x-photoswipe/dist/default-skin/default-skin.css'
import './style/reset.css'
import './style/normalize.css'
import './style/iconfont/iconfont.css'

import { Toast, Indicator, Dialog } from 'hips'

if (process.env.VUE_APP_MOCK === 'yes') {
  require('../mocks')
}

if (process.env.VUE_APP_BUILD === 'release') {
  const VConsole = require('vconsole')
    new VConsole() // eslint-disable-line
}

Vue.use(Toast).use(Indicator).use(Dialog).use(ElementUI)

// 全局引入一个控制页面背景色，想要修改默认背景白色的话，在路由组件data里设置backgroundColor的值即可
Vue.mixin(mixin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

// 解决手指轻触输入框不聚焦的问题
let deviceIsWindowsPhone = navigator.userAgent.indexOf('Windows Phone') >= 0
let deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone
FastClick.prototype.focus = function (targetElement) {
  let length
  // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length
    targetElement.setSelectionRange(length, length)
    targetElement.focus()
  } else {
    targetElement.focus()
  }
}
FastClick.attach(document.body)
