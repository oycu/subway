<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="未盘点"
      @nav-bar-back-click="$router.backPage()"
    ></hips-nav-bar>
    <div class="task-details-contain">
      <single-housing v-for="(item, index) in inventoryList" :key="index" :item="item" @click.native="goDetail(item)" />
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Popup } from 'hips'
import SingleHouse from '../../../components/single-housing'
import {indicator} from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

var fromName = ''
export default {
  name: 'AssetsNoInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
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
      inventoryList: [],
    }
  },
  activated () {
    if (fromName === 'AssetsFunctionSelect') {
      this.routerParams = this.$route.query
      console.log(this.routerParams)
      this.getMobileAssetList('10')
    } else {
      let success = this.getSuceessFlagType()
      if (success) {
        this.getMobileAssetList('10')
        this.setSuceessFlagType(false)
      }
    }
  },
  methods: {
    ...mapGetters({
      getSuceessFlagType: 'assetsInventory/getSuceessFlag',
    }),
    ...mapMutations({
      setSuceessFlagType: 'assetsInventory/setSuceessFlag',
    }),
    goDetail (item) {
      this.$router.push({
        name: 'AssetsNoInventoryDetail',
        query: {
          inventoryItem: item,
          index: this.routerParams.index,
          TASK_ID: this.routerParams.task_id,
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
.hips-popup--top {
  top: 55px;
}

.pop-content {
  padding: 10px 15px 0;

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

.task-details-contain {
  margin-top: 0.5px solid #fafafa;
  background-color: #fafafa;
  overflow: auto;
  padding 0 15px 10px 15px
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.override {
  padding: 0 !import;
}
</style>
