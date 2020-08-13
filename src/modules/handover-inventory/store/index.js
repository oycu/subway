import { createGetter, createMutations } from '@/store/utils'
import api from '../api'

let state = {
  chooseData: {},
  indexDB: {},
  allInventoryList: [], // 新增盘盈list
  deviceList: [],
}

export default {
  namespaced: true,
  state,
  getters: createGetter(state),
  mutations: {
    ...createMutations(state),
    updateState (state, params) {
      state[params.key] = params.value
    },
  },
  actions: {
    ...api,
  },
}
