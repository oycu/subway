<!--
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-03 11:29:35
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 -->
<template>
  <div id="app">
    <transition :name="routerTransition">
      <keep-alive :include="includeArray">
        <router-view v-if="isLogin" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import { setDocumentTitle } from '@/utils'

// import { noAuthHttp } from '@/request'
import hmapLogin from '@/platform/hmap/login'

export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload,
    }
  },
  data () {
    return {
      isLogin: false,
      routerTransition: 'router-slide-left',
      includeArray: [
        'AssetsMain', // 资产盘点开始
        'AssetsTaskSummary',
        'AssetsFunctionSelect',
        'AssetsScanInventoryDetail', // 资产盘点设备
        'AssetsStartInventoryList',
        'AssetsStartRecordInventory',
        'AssetsAlreadyInventoryList',
        'AssetsNoInventoryList',
        'AssetsNoInventoryDetail',
        'AssetsCodeInventoryList',
        'AssetsCodeInventoryDetail',
        'MaterialStartInventoryList', // 资产盘点物资
        'MaterialInventoryList', // 资产盘点结束
        'Main', // 移交盘点开始
        'InventoryItem',
        'TaskSummary',
        'FunctionSelect',
        'ScanInventoryDetail', // 移交盘点设备
        'RecordInventoryDetail',
        'AddNode',
        'ShowInventoryDetail',
        'StartInventoryList',
        'StartRecordInventory',
        'AlreadyInventoryList',
        'NoInventoryList',
        'NoInventoryDetail',
        'CodeInventoryList',
        'HouseStartInventoryList',
        'HouseStartRecordInventory',
        'HouseAlreadyInventoryList',
        'HouseCodeInventoryList',
        'HouseNoInventoryList',
        'HouseNoInventoryDetail',
        'HouseShowInventoryDetail',
      ],
    }
  },
  watch: {
    $route (to, from) {
      setDocumentTitle(to.meta.title)
      this.routerTransition = from.meta.routerTransition
    },
  },
  async mounted () {
    // let route = this.$router
    let search = window.location.search
    if (search !== '') {
      let t = search.split('?')[1].split('&')
      let searchObj = {}
      t.map((item) => {
        searchObj[item.split('=')[0]] = item.split('=')[1]
      })
      this.setLocationSearch(searchObj)
    }
    // 路由跳转
    // this.$router.replacePage(route.options.routes[1].name)
    try {
      await hmapLogin('local', true)
      this.isLogin = true
    } catch (err) {
      console.error('app 获取数据出错')
      console.error(err)
    }
  },
  methods: {
    ...mapGetters([ 'getRouterHistory' ]),
    ...mapMutations([ 'setRouterHistory', 'setLocationSearch' ]),
    reload () { // 用于提交返回刷新页面的场景
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
  },
}
</script>

<style lang="stylus">
    @import "style/theme.styl"
</style>
