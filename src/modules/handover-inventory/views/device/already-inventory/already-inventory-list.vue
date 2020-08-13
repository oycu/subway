<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="已盘点"
      :right-buttons="[
        {
          buttonIcon: 'search',
          buttonLabel: ''
        },
      ]"
      @nav-bar-back-click="$router.backPage()"
      @nav-bar-right-click="search"
    >
    </hips-nav-bar>
    <hips-tabs v-model="active">
      <hips-tab ref="same" title="账实相符" class="override" @click.native="select(['30'])"></hips-tab>
      <hips-tab title="有差异" @click.native="select(['40', '60'])"></hips-tab>
      <hips-tab title="盘盈" @click.native="select(['10', '70'])"></hips-tab>
      <hips-tab title="盘亏" @click.native="select(['20'])"></hips-tab>
    </hips-tabs>
    <div class="discontent" style="height:calc(100vh)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[devInventoryList]"
        @pulling-down="loadRefresh"
        @pulling-up="loadMore"
      >
        <div class="item">
          <InventoryItem
            v-for="(item, index) in devInventoryList"
            :key="index"
            :billDetailList="item"
            :checkstateList="checkstateList"
            @click.native="goDeatil(item)"
          ></InventoryItem>
        </div>
      </hips-scroll>
    </div>
    <hips-popup v-model="showPopup" position="top">
      <div class="pop-content">
        <p class="title">筛选</p>
        <InputItem keyVal="faCategoryDesc" :title="'固定资产目录'" :value="filter.faCategoryDesc" @updateInput="updateInput" />
        <InputItem keyVal="faNameDesc" :title="'固定资产名称'" :value="filter.faNameDesc" @updateInput="updateInput" />
        <InputItem keyVal="instanceDescription" :title="'设备名称'" :value="filter.instanceDescription" @updateInput="updateInput" />
        <InputItem keyVal="specification" :title="'规格型号'" :value="filter.specification" @updateInput="updateInput" />
        <InputItem keyVal="locationCode" :title="'安装（存放）地点'" :value="filter.locationCode" @updateInput="updateInput" />
        <InputItem keyVal="btsMajorDesc" :title="'专业'" :value="filter.btsMajorDesc" @updateInput="updateInput" />
        <InputItem keyVal="tagNum" :title="'标签编号'" :value="filter.tagNum" @updateInput="updateInput" />
        <div class="button">
          <p @click="oprate('cancle')">取消</p>
          <p @click="oprate('confirm')">确定</p>
        </div>
      </div>
    </hips-popup>
  </hips-view>
</template>

<script>
import { View, NavBar, Tabs, Tab, Picker, Popup, Scroll } from 'hips'
import InventoryItem from '../../../components/inventory-item'
import SingleHouse from '../../../components/single-housing'
import InputItem from '../../../components/input-item'
import { indexeddb } from '../../../utils'
import { leftRightScroll } from '@/utils'

var fromName
const i18n = {
  'zh-CN': {
    spaceTitle: '留白占位区域',
    nestScrollTitle: '嵌套滚动区域',
    backTop: '点我回到顶部',
    refreshTxt: '刷新成功',
    moreTxt: '',
    noMoreTxt: '',
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
  name: 'AlreadyInventoryList',
  components: {
    [View.name]: View,
    [Scroll.name]: Scroll,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    InventoryItem,
    InputItem,
    [SingleHouse.name]: SingleHouse,
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  data () {
    return {
      scrollOption: {
        pullDownRefresh: false,
        pullUpLoad: {
          txt: {
            more: i18n[this.$hipsLang]['moreTxt'],
            noMore: i18n[this.$hipsLang]['noMoreTxt'],
          },
        },
      },
      isSelected: true, // 已盘点或未盘点是否选中
      active: 0,
      showPopup: false, // 控制显示筛选框
      routerQuery: {}, // 路由参数路由参数
      indexDB: {}, // 数据库db
      deviceBillList: [],
      checkstateList: [], // 快码-盘点结果list
      tagNumList: [], // 该任务下tagNum集合
      devInventoryList: [], // 已盘点清单
      currentStatus: '',
      currentIndex: 0,
      filter: { // 筛选字段
        faCategoryDesc: '', // 固定资产目录
        faNameDesc: '', // 固定资产名称
        instanceDescription: '', // 设备名称
        specification: '', // 规格型号
        locationCode: '', // 安装（存放）地点
        btsMajorDesc: '', // 专业
      },
    }
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    if (fromName === 'TaskSummary') {
      this.getFastCode()
      this.routerQuery = this.$route.query
      this.resultStatus = ['30']
      this.active = 0
    }
    let allDeviceBillList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId) // 获取该任务下所有盘点清单
    this.tagNumList = []
    allDeviceBillList.forEach(element => { // 获取该任务下所有的tagNum
      if (!this.tagNumList.includes(element.tagNum)) {
        this.tagNumList.push(element.tagNum)
      }
    })
    this.getDevInventoryList()
  },
  methods: {
    loadRefresh () { // 下拉刷新
    },
    loadMore () { // 上拉加载
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    search () { // 筛选
      this.showPopup = true
    },
    goDeatil (item) { // 跳转到资产明细页
      this.$router.push({ // 已盘点
        name: 'ShowInventoryDetail',
        query: {
          inventoryList: item,
          taskId: this.routerQuery.taskId,
        },
      })
    },
    oprate (val) { // 筛选框确定事件
      this.showPopup = false
      if (val === 'confirm') {
        this.getDevInventoryList()
      }
    },
    updateInput (val, key) { // 更新input框的值
      this.filter[key] = val
    },
    cancel () { // 筛选框内取消事件
      this.showPopup = false
    },
    confirm () { // 筛选框内确定事件
      this.showPopup = false
    },
    select (val) { // 点击页签，更新数据
      this.resultStatus = val
      this.getDevInventoryList()
    },
    async getDeviceListByTaskId (indexName, indexValue) {
      let dataList = await indexeddb.cursorGetDataByfilter(this.indexDB, 'deviceList', indexName, indexValue, this.filter)
      return dataList
    },
    async getDevInventoryList () { // 获取已盘点的数据
      this.devInventoryList = []
      this.currentIndex = 0
      await this.sameDevice(this.tagNumList[this.currentIndex])
      leftRightScroll(this)

      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    async sameDevice (tagNum) { // 获取已盘点的数据
      let sameDeviceList
      let tagNumListLen = this.tagNumList.length
      if (this.resultStatus.length === 2) {
        let sameDeviceOne = await this.getDeviceListByTaskId(['taskId', 'resultStatus', 'resultCode', 'tagNum'], [this.routerQuery.taskId, '20', this.resultStatus[0], tagNum]) // 获取该任务下所有未盘点清单
        let sameDeviceTwo = await this.getDeviceListByTaskId(['taskId', 'resultStatus', 'resultCode', 'tagNum'], [this.routerQuery.taskId, '20', this.resultStatus[1], tagNum]) // 获取该任务下所有未盘点清单
        sameDeviceList = sameDeviceOne.concat(sameDeviceTwo)
      } else if (this.resultStatus.length === 1) {
        let sameDevice = await this.getDeviceListByTaskId(['taskId', 'resultStatus', 'resultCode', 'tagNum'], [this.routerQuery.taskId, '20', this.resultStatus[0], tagNum]) // 获取该任务下所有未盘点清单
        sameDeviceList = sameDevice
      }
      if (sameDeviceList.length !== 0) {
        this.devInventoryList.push(sameDeviceList)
      }
      this.currentIndex++
      if (tagNumListLen > this.currentIndex) {
        await this.sameDevice(this.tagNumList[this.currentIndex])
      }
    },
    async getFastCode () { // 获取快码值 盘点状态 盘点轮次 盘点结果
      let checkstateList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT_STATE') // 获取盘点结果快码值
      this.transte(checkstateList, 'checkstateList') // 盘点结果
    },
    transte (list, listName) { // 将快码值转换为select组件接收的类型
      this[listName] = []
      list.forEach(element => {
        let temp = {
          value: element.codeValue,
          label: element.meaning,
        }
        this[listName].push(temp)
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.hips-view{
  background #fafafa!important
  >>>.hips-view__content{
    overflow-y scroll
  }
  .hips-nav-bar__theme-default{
    border-bottom 1px solid #eee
  }
  >>>.hips-scroll__content{
    padding 0 15px 15px
  }
}
.status {
  color #6d7a80
  width: 150px;
  height: 30px;
  margin: 0 auto;
  border: 1px solid #ddc;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.content{
  >>>.table{
    tbody{
      background #fff
    }
  }
}
.hips-popup--top{
  top 65px
}
.pop-content{
  padding 10px 15px 0
  .item{
    border none
  }
  .button{
    display flex
    height 48px
    line-height 48px
    border-top 1px solid #ccc
    p{
        flex 1
        text-align center
        color: #108aee
    }
    p:last-child{
        color #48d2a0
    }
  }
  .title{
    color #2896ff
    text-align center
    border-bottom 1px solid #ccc
    padding 10px 0
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

.layout {
  width: 80%;
  margin: 20px auto;
}

.override {
  padding 0 !import
}
</style>
