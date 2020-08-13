<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      @nav-bar-back-click="$router.backPage()"
    >
      <div slot="center" class="status">
        <div :class="['left', { 'select': isSelected}]" @click="handleLeft">
          <p>未盘点</p>
        </div>
        <div :class="['right', { 'select': !isSelected}]" @click="handleRight">
          <p>已盘点</p>
        </div>
      </div>
    </hips-nav-bar>
    <div v-if="isSelected" class="task-details-contain">
      <single-housing v-for="(item, index) in inventoryList" :key="index" :item="item" @click.native="goDetail(item)" />
    </div>
    <div v-else>
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
import { View, NavBar, Tabs, Tab, Popup } from 'hips'
import SingleHouse from '../../../components/single-housing'
import {indicator} from '@/utils'

var fromName = ''
export default {
  name: 'AssetsStartInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Popup.name]: Popup,
    [SingleHouse.name]: SingleHouse,
  },
  props: {
    dataList: {
      type: Array,
      default: () => [1, 2, 3],
    },
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  data () {
    return {
      isSelected: true,
      active: 0,
      showPopup: false,
      inventoryList: [],
    }
  },
  activated () {
    if (fromName === 'AssetsFunctionSelect') {
      this.routerParams = this.$route.query
      this.getMobileAssetList('10')
      this.isSelected = true
    }
  },
  methods: {
    handleLeft () {
      // 未完成跳转
      this.getMobileAssetList('10')
      this.isSelected = true
    },
    handleRight () {
      // 已完成跳转
      this.active = 0
      this.getMobileAssetList('20', '30')
      this.isSelected = false
    },
    select (val) {
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
    goDetail (item) { // 资产详情页跳转
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
.status {
  width: 150px;
  height: 30px;
  margin: 0 auto;
  border: 1px solid #ddc;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.hips-popup--top {
  top: 55px;
}

.pop-content {
  padding: 15px

  .item {
    border: none;
  }

  .button {
    display: flex;
    height: 48px;
    line-height: 48px;
    border-top: 1px solid #ccc;

    p {
      flex: 1;
      text-align: center;
      color: #108aee;
    }

    p:last-child {
      color: #48d2a0;
    }
  }

  .title {
    color: #2896ff;
    text-align: center;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
}

.select {
  background-color: #2896ff;
  color: #fff;
}

.left {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  border-radius: 20px 0 0 20px;
  p {
    margin: auto 0;
  }
}

.right {
  flex: 1;
  height: 100%;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column-reverse;

  p {
    margin: auto 0;
  }
}

.task-details-contain {
  margin-top: 0.5px solid #fafafa;
  padding: 0 15px 10px 15px;
  background-color: #fafafa;
  overflow: auto;
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.override {
  padding: 0 !import;
}
</style>
