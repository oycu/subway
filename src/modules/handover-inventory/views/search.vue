<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="搜索"
      @nav-bar-back-click="$router.backPage()"
    />
    <div slot="sub-header">
      <div class="header">
        <input v-model="inputValue" type="text" placeholder="请输入内容" @keyup.enter="search">
        <div @click="search">
          <hips-icon name="search" />
          <p>搜索</p>
        </div>
      </div>
    </div>
    <div class="content demo-scroll" style="height:calc(100vh)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[resultList]"
        @pulling-down="loadRefresh"
        @pulling-up="loadMore"
      >
        <div class="scr-content">
          <p v-for="(item,index) in resultList" :key="index" @click="choose(item)">{{ item.meaning }}{{ item.flexValue }}  {{ item.description }}</p>
        </div>
      </hips-scroll>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Scroll, Input, Icon } from 'hips'
import { indexeddb } from '../utils'
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
  name: 'HandSearch',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Input.name]: Input,
    [Icon.name]: Icon,
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
      inputValue: '', // 搜索值
      resultList: [], // 分页后结果列表
      allResultList: [], // 所有结果列表
      filterList: [], // 筛选结果列表
      indexDB: {}, // 数据库对象
      pageNum: 1,
      pageSize: 15,
      currentIndex: 0, // 当前index
      btsMajorList: [], // 专业list
      lineList: [], // 线路list
    }
  },
  async mounted () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.routerQuery = this.$route.query
    if (this.routerQuery.type === 'HAPPS_ZZM_DEPARTMENT') {
      this.getFastCode() // 获取部门数据
    } else if (this.routerQuery.type === 'CUX_ERP_EAM_SPEC_TYPE') {
      this.getFastCode() // 获取专业数据
    } else { // 选择字段为线路或部门
      this.getDiffData()
    }
  },
  methods: {
    loadRefresh () { // 下拉刷新
      console.log('下拉刷新')
      this.pageNum = 1
      this.sliceList()
    },
    loadMore () { // 上拉加载
      console.log('上拉加载')
      this.pageNum++
      this.sliceList()
    },
    choose (item) { // 选中数据
      this.$store.commit('handoverInventory/updateState', {key: 'chooseData', value: item}) // 更新到vuex中
      this.$router.backPage()
    },
    search () { // 搜索数据
      this.filterList = [] // 筛选数据清空
      this.allResultList.forEach((element) => {
        if (this.routerQuery.type === 'CUX_ERP_EAM_SPEC_TYPE' && element.meaning.indexOf(this.inputValue) !== -1) { // 专业
          this.filterList.push(element) // 满足条件的数据
        }
        if (this.routerQuery.type === 'HAPPS_ZZM_LINE_NEW' || this.routerQuery.type === 'HAPPS_ZZM_DEPARTMENT') { // 线路或部门
          if (element.flexValue.indexOf(this.inputValue) !== -1 || element.description.indexOf(this.inputValue) !== -1) {
            this.filterList.push(element) // 满足条件的数据
          }
        }
      })
      this.pageNum = 1
      this.sliceList() // 对数据进行分页
    },
    sliceList () { // 分页
      let startIndex = (this.pageNum - 1) * this.pageSize // 开始索引
      let endIndex = this.pageNum * this.pageSize // 结束索引
      if (this.pageNum === 1) {
        this.resultList = this.filterList.slice(startIndex, endIndex)
      } else {
        this.resultList = this.resultList.concat(this.filterList.slice(startIndex, endIndex))
      }
      if (this.resultList.length >= this.filterList.length) {
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
    async getFastCode () { // 获取快码值 专业
      this.allResultList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', this.routerQuery.type) // 获取专业快码值
      this.filterList = this.allResultList // 初始化时筛选数据等于所有的数据
      this.sliceList() // 数据分页
    },
    async getDiffData () {
      this.allResultList = []
      if (this.routerQuery.type === 'HAPPS_ZZM_LINE_NEW') { // 线路
        if (this.routerQuery.buildFlag) {
          console.log('this.routerQuery.buildFlag', this.routerQuery.buildFlag)
          this.lineList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'taskId', this.routerQuery.taskId, 'linewayId', this.routerQuery.buildFlag) // 获取该任务下不同的lineId
        } else {
          this.lineList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'linewayId', false) // 获取该任务下不同的lineId
        }
        await this.getDataIndexeddb('lineList')
      }
      if (this.routerQuery.type === 'CUX_ERP_EAM_SPEC_TYPE') { // 专业
        console.log('路由参数', this.routerQuery)
        if (this.routerQuery.buildFlag) {
          this.btsMajorList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'taskId', this.routerQuery.taskId, 'btsMajor', this.routerQuery.buildFlag) // 获取该任务下不同的专业code
        } else {
          this.btsMajorList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'btsMajor', false) // 获取该任务下不同的专业code
        }
        await this.getDataIndexeddb('btsMajorList')
      }
      this.currentIndex = 0
      this.filterList = this.allResultList // 初始化时筛选数据等于所有的数据
      this.sliceList() // 数据分页
    },
    async getDataIndexeddb (valueName) {
      let lineItem = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', this.routerQuery.indexName, [this.routerQuery.type, this[valueName][this.currentIndex]]) // 获取该任务下标签编号为element的未盘点清单
      this.allResultList = this.allResultList.concat(lineItem)
      this.currentIndex++
      if (this[valueName].length > this.currentIndex) {
        this.getDataIndexeddb(valueName)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view{
  background #fafafa!important
  >>>.hips-view__content{
    overflow-y scroll
  }
  .hips-nav-bar__theme-default{
    border-bottom 1px solid #eee
  }
}
.header
  padding 10px 15px
  display flex
  font-size 14px
  border-bottom 1px solid #eee
  background #fafafa
  input
    flex 1
    border 1px solid #2896ff
    border-radius 5px
    margin-right 10px
    padding-left 5px
  div
    // width 80px
    height 28px
    padding 0 20px
    border-radius 5px
    text-align center
    background #2896ff
    color #fff
    display flex
    .hips-icon
      margin auto 0
      margin-right 5px
    p
      margin auto
.content
  .scr-content
    background-color #fff
    padding-left 15px
    border-bottom 1px solid #ccc
    border-top 1px solid #ccc
    p{
      border-top 1px solid #ccc
      padding 10px 10px
      word-wrap break-word
      font-size 14px
      line-height 18px
    }
    p:first-child{
      border-top none
    }
</style>
