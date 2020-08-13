/*
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-03 11:23:32
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 */
import Vue from 'vue'
import Vuex from 'vuex'

let modules = {}
if (process.env.VUE_APP_BUILD === 'dev') {
  modules = {
    handoverInventory: require('@/modules/handover-inventory/store').default, // 移交盘点
    assetsInventory: require('@/modules/assets-inventory/store').default, // 资产盘点
  }
} else {
  let ary = process.env.VUE_APP_TARGET.split('-')
  let moduleName = ''
  ary.map((item, index) => {
    if (index > 0) {
      item = item.replace(item.charAt(0), item.charAt(0).toUpperCase())
    }
    moduleName += item
  })
  modules[moduleName] = require(`@/modules/${process.env.VUE_APP_TARGET}/store`).default
}

Vue.use(Vuex)

let store = new Vuex.Store({
  modules,
  state: {
    routerHistory: [],
    userInfo: void 0,
    allSystemUser: void 0,
    locationSearch: void 0,
  },
  getters: {
    getRouterHistory: (state) => {
      return state.routerHistory
    },
    getUserInfo: (state) => {
      return state.userInfo
    },
    getAllSystemUser: (state) => {
      return state.allSystemUser
    },
    getLocationSearch: (state) => {
      return state.locationSearch
    },
  },

  mutations: {
    setRouterHistory: (state, value) => {
      state.routerHistory = value
    },
    setUserInfo: (state, value) => {
      state.userInfo = value
    },
    setAllSystemUser: (state, value) => {
      state.allSystemUser = value
    },
    setLocationSearch: (state, value) => {
      state.locationSearch = value
    },
  },
})

export default store
