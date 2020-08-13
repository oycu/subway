<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="条码丢损"
      @nav-bar-back-click="$router.backPage()"
    >
    </hips-nav-bar>
    <div class="task-details-contain">
      <single-housing v-for="(item, index) in inventoryList" :key="index" :item="item" @click.native="goDetail(item)" />
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar } from 'hips'
import SingleHouse from '../../../components/single-housing'
import {indicator} from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

var fromName = ''
export default {
  name: 'AssetsCodeInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
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
      this.routerQuery = this.$route.query
      this.getMobileAssetList('30')
    }
    let success = this.getSuceessFlagType()
    if (success) {
      this.getMobileAssetList('30')
      this.setSuceessFlagType(false)
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
        name: 'AssetsCodeInventoryDetail',
        query: {
          inventoryItem: item,
          taskId: this.routerQuery.task_id,
        },
      })
    },
    async getMobileAssetList (status, result) { // 任务下载接口
      this.inventoryList = []
      indicator.show()
      let params = {
        'P_TASK_ID': this.routerQuery.task_id, // 单据头Id
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
.task-details-contain {
  margin-top .5px solid #ccc
  background-color #fafafa
  overflow auto
  padding 0 15px 10px 15px
}

</style>
