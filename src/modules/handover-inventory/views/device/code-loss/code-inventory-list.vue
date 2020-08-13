<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="条码丟损"
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
    <div class="discontent" style="height:calc(100vh)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[codeLossList]"
        @pulling-down="loadRefresh"
        @pulling-up="loadMore"
      >
        <div class="item">
          <InventoryItem
            v-for="(item, index) in codeLossList"
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
  name: 'CodeInventoryList',
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
      showPopup: false, // 控制显示筛选框
      routerQuery: {}, // 路由参数路由参数
      indexDB: {}, // 数据库db
      tagNumList: [], // 该任务下tagNum集合
      codeLossList: [], // 条码丟损清单
      resultList: [], // 快码-盘点结果list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [], // 快码-盘点轮次list
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
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    if (fromName === 'TaskSummary') {
      this.routerQuery = this.$route.query
      await this.getFastCode()
    }
    let allDeviceBillList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId) // 获取该任务下所有未盘点清单
    this.tagNumList = []
    allDeviceBillList.forEach(element => { // 获取该任务下所有的tagNum
      if (!this.tagNumList.includes(element.tagNum)) {
        this.tagNumList.push(element.tagNum)
      }
    })
    this.getcodeLossList()
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
      this.$router.push({
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
        this.getcodeLossList()
      }
    },
    updateInput (val, key) { // 更新input框的值
      this.filter[key] = val
    },
    async getDeviceListByTaskId (indexName, indexValue) {
      let dataList = await indexeddb.cursorGetDataByfilter(this.indexDB, 'deviceList', indexName, indexValue, this.filter)
      return dataList
    },
    async getcodeLossList () { // 获取未盘点的数据
      this.codeLossList = []
      this.tagNumList.forEach(async (element) => {
        let sameDevice = await this.getDeviceListByTaskId(['taskId', 'resultStatus', 'tagNum'], [this.routerQuery.taskId, '30', element]) // 获取该任务下所有未盘点清单
        if (sameDevice.length !== 0) {
          this.codeLossList.push(sameDevice)
        }
      })
      leftRightScroll(this)

      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    async getFastCode () { // 获取快码值 盘点状态 盘点轮次 盘点结果
      let roundsList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_ROUNDS') // 获取盘点轮次快码值
      let checkstateList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT_STATE') // 获取盘点状态快码值
      let resultList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT') // 获取盘点结果快码值
      this.transte(roundsList, 'roundsList') // 盘点轮次
      this.transte(checkstateList, 'checkstateList') // 盘点状态
      this.transte(resultList, 'resultList') // 盘点结果
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
.discontent{
  .item{
    // padding 0 15px
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
  background-color: #2896ff
  color: #fff
}

.left {
  flex: 1
  height: 100%
  display: flex
  flex-direction: column-reverse
  border-radius: 20px 0 0 20px
  p {
    margin: auto 0
  }
}

.right {
  flex: 1
  height: 100%
  border-radius: 0 20px 20px 0
  display: flex
  flex-direction: column-reverse
  p {
    margin: auto 0
  }
}

.layout {
  width: 80%
  margin: 20px auto
}

.override {
  padding 0 !important
}
</style>
