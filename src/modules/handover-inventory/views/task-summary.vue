<!--
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 17:13:25
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 -->
<template>
  <hips-view
    header-height="48"
    footer-height="48"
  >
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="盘点任务汇总"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="content demo-scroll" style="height:calc(100vh - 44px)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[taskList]"
        @pulling-down="loadRefresh"
        @pulling-up="loadMore"
      >
        <div class="scr-content">
          <Task v-for="item in taskList" :key="item.taskId" :task="item" @click="goInventory(item)" />
        </div>
      </hips-scroll>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Scroll } from 'hips'
import Task from '../components/task'
import { indexeddb } from '../utils'
var fromName = ''
const i18n = {
  'zh-CN': {
    spaceTitle: '留白占位区域',
    nestScrollTitle: '嵌套滚动区域',
    backTop: '点我回到顶部',
    refreshTxt: '刷新成功',
    moreTxt: '上拉加载更多',
    noMoreTxt: '没有更多数据',
  },
  'en-US': {
    spaceTitle: 'Space Section',
    nestScrollTitle: 'Nest Scroll Section',
    backTop: 'Click Me Back To The Top',
    refreshTxt: 'Refresh Success',
    moreTxt: 'Pull Up And Load More',
    noMoreTxt: 'No More Data',
  },
}
export default {
  name: 'TaskSummary',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    Task,
  },
  data () {
    return {
      scrollOption: {
        pullDownRefresh: {
          threshold: 60, // 触发 pullingDown 的距离
          stop: 40, // pullingDown 正在刷新 hold 时的距离
          txt: i18n[this.$hipsLang]['refreshTxt'],
        },
        pullUpLoad: {
          txt: {
            more: i18n[this.$hipsLang]['moreTxt'],
            noMore: i18n[this.$hipsLang]['noMoreTxt'],
          },
        },
      },
      routerQuery: {}, // 路由参数
      taskList: [], // 展示的任务列表
      alltaskList: [], // 所有的任务列表
      indexDB: {},
      pageNum: 1,
      pageSize: 5,
    }
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.pageNum = 1
    if (fromName === 'main') {
      this.routerQuery = this.$route.query
    }
    this.getTaskList(true) // 获取任务列表
  },
  methods: {
    loadRefresh () { // 下拉刷新
      this.pageNum = 1
      console.log('下拉刷新')
      this.sliceList()
    },
    loadMore () { // 上拉加载
      this.pageNum++
      this.sliceList()
      console.log('上拉加载')
    },
    goInventory (item) { // 点击任务卡片触发
      if (Number(this.routerQuery.index) === 2) { // 跳转到功能选择页
        this.$router.pushPage({ path: '/main/function-select',
          query: {
            type: item.inventoryObjectDesc,
            taskId: item.taskId,
            taskNumber: item.taskNumber,
            taskName: item.taskName,
          },
        })
      }
      if (Number(this.routerQuery.index) === 3) { // 已盘点
        if (item.inventoryObjectDesc === '设备') { // 任务类型为设备时
          this.$router.pushPage({
            name: 'AlreadyInventoryList',
            query: {
              val: item.inventoryObjectDesc,
              taskId: item.taskId,
            },
          })
        }
        if (item.inventoryObjectDesc === '房建') { // 任务类型为房建时
          this.$router.pushPage({
            name: 'HouseAlreadyInventoryList',
            query: {
              taskId: item.taskId,
            },
          })
        }
      }
      if (Number(this.routerQuery.index) === 4) { // 未盘点
        if (item.inventoryObjectDesc === '设备') { // 任务类型为设备时
          this.$router.pushPage({
            name: 'NoInventoryList',
            query: {
              taskId: item.taskId,
            },
          })
        }
        if (item.inventoryObjectDesc === '房建') { // 任务类型为房建时
          this.$router.pushPage({
            name: 'HouseNoInventoryList',
            query: {
              taskId: item.taskId,
            },
          })
        }
      }
      if (Number(this.routerQuery.index) === 5) {
        if (item.inventoryObjectDesc === '设备') { // 任务类型为设备时
          this.$router.pushPage({
            name: 'CodeInventoryList',
            query: {
              taskId: item.taskId,
            },
          })
        }
        if (item.inventoryObjectDesc === '房建') { // 任务类型为房建时
          this.$router.pushPage({
            name: 'HouseCodeInventoryList',
            query: {
              taskId: item.taskId,
            },
          })
        }
      }
    },
    async getTaskList () { // 获取任务列表
      let alltaskList = await indexeddb.cursorGetData(this.indexDB, 'taskSummary')
      alltaskList = alltaskList.filter(item => item.inventoryQuantity !== 0)
      alltaskList.forEach(async element => { // 更新任务中数据
        if (element.inventoryObject === '10') {
          element.inventoriedQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus'], [element.taskId, '20']) // 已盘点数
          element.inventorinoQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus'], [element.taskId, '10']) // 未盘点数
          element.codeLossQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus'], [element.taskId, '30']) // 条码丟损数
          element.countMatchQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '30']) // 账实相符数
          element.invProfitQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '10']) // 盘盈数
          element.incLossQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '20']) // 盘亏数
          element.invDiffQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '40']) // 差异数
        }
        if (element.inventoryObject === '30') {
          element.inventoriedQuantity = await this.getQuantity('buildList', 'StatusTaskId', ['20', element.taskId]) // 已盘点数
          element.inventorinoQuantity = await this.getQuantity('buildList', 'StatusTaskId', ['10', element.taskId]) // 未盘点数
          element.codeLossQuantity = await this.getQuantity('buildList', 'StatusTaskId', ['30', element.taskId]) // 条码丟损数
          element.countMatchQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '30', element.taskId]) // 账实相符数
          element.invProfitQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '10', element.taskId]) // 盘盈数
          element.incLossQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '20', element.taskId]) // 盘亏数
          element.invDiffQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '40', element.taskId]) // 差异数
        }
        element.inventoryQuantity = element.inventoriedQuantity + element.inventorinoQuantity + element.codeLossQuantity
        await indexeddb.updateData(this.indexDB, 'taskSummary', element)
      })
      if (this.routerQuery.index === 2) { // 开始盘点
        this.alltaskList = alltaskList
      } else if (this.routerQuery.index === 3) { // 已盘点
        this.alltaskList = alltaskList.filter(item => item.inventoriedQuantity > 0)
      } else if (this.routerQuery.index === 4) { // 未盘点
        this.alltaskList = alltaskList.filter(item => item.inventorinoQuantity > 0)
      } else if (this.routerQuery.index === 5) { // 条码丢损
        this.alltaskList = alltaskList.filter(item => item.codeLossQuantity > 0)
      }
      this.sliceList()
    },
    async getQuantity (storeName, indexName, indexValue) { //
      let inventoriedList = await indexeddb.cursorGetDataByIndex(this.indexDB, storeName, indexName, indexValue)
      return inventoriedList.length
    },
    sliceList () { // 分页
      let startIndex = (this.pageNum - 1) * this.pageSize
      let endIndex = this.pageNum * this.pageSize
      if (this.pageNum === 1) {
        this.taskList = this.alltaskList.slice(startIndex, endIndex)
      } else {
        this.taskList = this.taskList.concat(this.alltaskList.slice(startIndex, endIndex))
      }
      if (this.taskList.length >= this.alltaskList.length) {
        // 禁用上拉加载
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate()
        })
      } else {
        // 启用上拉加载
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate(true)
        })
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view
  background #fafafa!important
  >>>.hips-view__content
    overflow-y scroll
  .hips-nav-bar__theme-default
    border-bottom 1px solid #eee
.content
  .scr-content
    padding 0 15px

</style>
