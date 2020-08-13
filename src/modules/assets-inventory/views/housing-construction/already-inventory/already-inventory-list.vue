<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="已盘点"
      @nav-bar-back-click="$router.backPage()"
    ></hips-nav-bar>
    <div>
      <hips-tabs v-model="active">
        <hips-tab title="账实相符" class="override" @click.native="select('账实相符')" />
        <hips-tab title="有差异" @click.native="select('有差异')"></hips-tab>
        <hips-tab title="盘盈" @click.native="select('盘盈')"></hips-tab>
        <hips-tab title="盘亏" @click.native="select('盘亏')"></hips-tab>
      </hips-tabs>
      <div class="task-details-contain">
        <single-housing v-for="(item, index) in inventoryList" :key="index" :item="item" @click.native="goDetail(item)" />
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Tabs, Tab } from 'hips'
import SingleHouse from '../../../components/single-housing'
import {indicator} from '@/utils'

var fromName = ''
export default {
  name: 'AssetsAlreadyInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [SingleHouse.name]: SingleHouse,
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  props: {
    dataList: {
      type: Array,
      default: () => [1, 2, 3],
    },
  },
  data () {
    return {
      active: 0,
      inventoryList: [],
    }
  },
  activated () {
    if (fromName === 'AssetsFunctionSelect') {
      this.routerParams = this.$route.query
      this.getMobileAssetList('20', '30')
      this.active = 0
    }
  },
  methods: {
    select (val) { // 已盘点选择
      if (val === '账实相符') {
        this.getMobileAssetList('20', '30')
      } else if (val === '有差异') {
        this.getMobileAssetList('20', '40')
      } else if (val === '盘盈') {
        this.getMobileAssetList('20', '10')
      } else {
        this.getMobileAssetList('20', '20')
      }
    },
    goDetail (item) { // 跳转到资产明细页
      this.$router.push({
        name: 'AssetsShowInventoryDetail',
        query: {
          inventoryItem: item,
        },
      })
    },
    async getMobileAssetList (status, result) { // 任务下载接口
      this.inventoryList = []
      indicator.show()
      let params = {
        'P_TASK_ID': this.routerParams.task_id, // 单据头Id
        'P_CHECK_STATUS': status,
        'P_CHECK_RESULT': result,
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileAssetListApi', params)
        indicator.hide()
        this.inventoryList = resp.data.X_MOBILE_DATA_LINEASSET_OUT_TB.X_MOBILE_DATA_LINEASSET_OUT_TB_ITEM
        console.log('成功', resp)
        if (!this.inventoryList) {
          this.$hips.toast({
            message: '无数据',
            position: 'middle',
          })
        }
      } catch (err) {
        indicator.hide()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
>>>.hips-view__content {
  background-color: #fafafa
}

.hips-popup--top {
  top: 55px;
}

.task-details-contain {
  background-color: #fafafa;
  overflow: auto;
  padding: 0 15px 10px 15px;
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.override {
  padding: 0 !import;
}
</style>
