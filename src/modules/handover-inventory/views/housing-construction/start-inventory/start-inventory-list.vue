<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 19:22:00
 * @LastEditTime: 2019-10-22 09:14:05
 * @LastEditors: Please set LastEditors
 -->
<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      :right-buttons="[
        {
          buttonIcon: 'search',
          buttonLabel: ''
        },
      ]"
      @nav-bar-back-click="$router.backPage()"
      @nav-bar-right-click="search"
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
      <div class="control-button">
        <hips-button type="primary" @click="showControl">打印标签</hips-button>
        <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
      </div>
      <div v-for="item in buildList" :key="item.id" :class="{'single-build': showFlag}">
        <div v-if="showFlag">
          <i v-if="!item.checkFlag" class="iconfont iconxuanzekuang" @click="changeFlag(true, item)" />
          <i v-if="item.checkFlag" class="iconfont iconxuanzekuang1" @click="changeFlag(false, item)" />
          <!-- <hips-checkbox v-model="item.checkFlag" :border="false"></hips-checkbox> -->
        </div>
        <single-housing
          :buildDetail="item.taskBuildingBillDto"
          class="build-contain"
          @click.native="goDetail(item)"
        />
      </div>
    </div>
    <div v-else>
      <hips-tabs v-model="active">
        <hips-tab title="账实相符" @click.native="select('30')" />
        <hips-tab title="有差异" @click.native="select('40')"></hips-tab>
        <hips-tab title="盘盈" @click.native="select('10')"></hips-tab>
        <hips-tab title="盘亏" @click.native="select('20')"></hips-tab>
      </hips-tabs>
      <div class="task-details-contain">
        <div v-for="item in buildList" :key="item.id">
          <single-housing
            :buildDetail="item.taskBuildingBillDto"
            class="build-contain"
            @click.native="goDetail(item)"
          />
        </div>
      </div>
    </div>
    <hips-popup v-model="showPopup" position="top" @click-overlay="cancel">
      <div class="pop-content">
        <p class="title">筛选</p>
        <input-item keyVal="faCategoryDesc" title="固定资产目录" :value="searchCollection.faCategoryDesc" @updateInput="updateInput" />
        <input-item keyVal="faNameDesc" title="固定资产名称" :value="searchCollection.faNameDesc" @updateInput="updateInput" />
        <input-item keyVal="instanceDescription" title="房建/轨道名称" :value="searchCollection.instanceDescription" @updateInput="updateInput" />
        <input-item keyVal="btsMajorDesc" title="专业" :value="searchCollection.btsMajorDesc" @updateInput="updateInput" />
        <div class="button">
          <p @click="cancel">取消</p>
          <p @click="confirm">确定</p>
        </div>
      </div>
    </hips-popup>
    <div v-if="showFlag" class="footer">
      <div class="chosse">
        <i v-if="checkAll" class="iconfont iconxuanzekuang1" @click="selectAll(false)"></i>
        <i v-if="!checkAll" class="iconfont iconxuanzekuang" @click="selectAll(true)"></i>
        <p>全选</p>
      </div>
      <div class="button">
        <hips-button class="confirm" type="primary" @click="printTag">确定</hips-button>
        <hips-button class="cancel" type="primary" @click="tagCancel">取消</hips-button>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Tabs, Tab, Popup, Button } from 'hips'
import InputItem from '../../../components/input-item'
import SingleHouse from '../../../components/single-housing'
import { indexeddb } from '../../../utils'
import { buildPrintTag } from '../../../utils/utils'
var fromName = ''
export default {
  name: 'HouseStartInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [SingleHouse.name]: SingleHouse,
    InputItem,
  },
  data () {
    return {
      isSelected: true,
      active: 0,
      showPopup: false, // 搜索弹出层
      showFlag: false, // 打印标签
      indexDB: {},
      buildDetail: {
        taskBuildingBillDto: {
          faCategoryDesc: '',
          faNameDesc: '',
          instanceDescription: '',
          btsMajorDesc: '',
        },
      },
      buildList: [],
      searchCollection: { // 搜索字段
        faCategoryDesc: '',
        faNameDesc: '',
        instanceDescription: '',
        btsMajorDesc: '',
      },
    }
  },
  computed: {
    checkAll: { // 全选计算
      get () {
        return this.buildList.every(item => item.checkFlag === true)
      },
      set (value) {
        this.buildList.map(item => {
          item.checkFlag = value
        })
      },
    },
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  async activated () {
    if (fromName === 'FunctionSelect') {
      this.routerQuery = this.$route.query
      this.indexDB = this.$store.state.handoverInventory.indexDB
      this.getBuildListByStatus('10') // 获取未盘点列表
      this.isSelected = true
    }
  },
  methods: {
    handleLeft () { // 未完成跳转
      this.isSelected = true
      this.getBuildListByStatus('10')
    },
    handleRight () { // 已完成跳转
      this.isSelected = false
      this.active = 0
      this.getBuildListByTaskId('20', '30')
    },
    search () { // 点击搜索图标
      this.showPopup = true
      this.searchCollection.faCategoryDesc = ''
      this.searchCollection.faNameDesc = ''
      this.searchCollection.instanceDescription = ''
      this.searchCollection.btsMajorDesc = ''
    },
    cancel () { // 取消搜索
      this.showPopup = false
    },
    /**
     * @description: 点击确认按钮搜索 已完成未完成区分(isSelected) 已完成结果区分(active)
     */
    async confirm () {
      this.showPopup = false
      let params = ['', '', '', '']
      Object.keys(this.searchCollection).forEach((item, index) => {
        params[index] = this.searchCollection[item]
      })
      console.log('搜索内容', params)
      if (this.isSelected) { // 未完成
        try {
          this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'StatusTaskId', ['10', this.routerQuery.taskId], params)
          if (this.buildList.length === 0) {
            this.$hips.toast('无数据')
          }
        } catch (err) {
          throw new Error(err)
        }
      } else { // 已完成
        if (this.active === 0) { // 账实相符
          try {
            this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '30', this.routerQuery.taskId], params)
            if (this.buildList.length === 0) {
              this.$hips.toast('无数据')
            }
          } catch (err) {
            throw new Error(err)
          }
        }
        if (this.active === 1) { // 有差异
          try {
            this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '40', this.routerQuery.taskId], params)
            if (this.buildList.length === 0) {
              this.$hips.toast('无数据')
            }
          } catch (err) {
            throw new Error(err)
          }
        }
        if (this.active === 2) { // 盘盈
          try {
            this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '10', this.routerQuery.taskId], params)
            if (this.buildList.length === 0) {
              this.$hips.toast('无数据')
            }
          } catch (err) {
            throw new Error(err)
          }
        }
        if (this.active === 3) { // 盘亏
          try {
            this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '20', this.routerQuery.taskId], params)
            if (this.buildList.length === 0) {
              this.$hips.toast('无数据')
            }
          } catch (err) {
            throw new Error(err)
          }
        }
      }
    },
    /**
     * @description: 已完成筛选
     * @param {String} val 选择的状态
     * 30 账实相符  40 有差异  10 盘盈  20 盘亏
     */
    select (val) {
      this.getBuildListByTaskId('20', val)
    },
    goDetail (item) { // 跳转到资产明细页
      this.$router.push({
        name: 'HouseShowInventoryDetail',
        query: {
          buildDetail: item,
          taskId: this.routerQuery.taskId,
        },
      })
    },
    /**
     * @description 获取单个taskId下的房建清单(包含盘点结果)
     * @param {String} resultStatus 盘点状态 （已完成 未完成）
     * @param {String} resultCode 盘点结果 （账实相符 属性差异 盘盈 盘亏）
     */
    async getBuildListByTaskId (resultStatus = '', resultCode = '') { // 盘点状态 盘点结果
      try {
        this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', [resultStatus, resultCode, this.routerQuery.taskId])
        if (this.buildList.length === 0) {
          this.$hips.toast('无数据')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    /**
     * @description: 获取单个taskId下的房建清单(不包含盘点结果)
     * @param {String} resultStatus 盘点状态（未完成 已完成）
     */
    async getBuildListByStatus (resultStatus = '10') {
      this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'StatusTaskId', [resultStatus, this.routerQuery.taskId])
      if (this.buildList.length === 0) {
        this.$hips.toast('无数据')
      }
    },
    /**
     * @description: 输入框更新值
     * @param {String} val 输入的值
     * @param {String} key 更新的值
     */
    updateInput (val, key) {
      this.searchCollection[key] = val
    },
    showControl () { // 打印标签按钮
      this.showFlag = true
    },
    tagCancel () { // 取消打印标签
      this.showFlag = false
      this.buildList.forEach(item => {
        item.checkFlag = false
      })
    },
    changeFlag (flag, val) { // 单选点击
      val.checkFlag = flag
    },
    selectAll (flag) { // 全选点击
      this.checkAll = flag
    },
    scanInventory () { // 扫码
      let vm = this
      const env = process.env.VUE_APP_BUILD // 环境
      if (env === 'release') { // 真机
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result.text !== '' && result.text !== 'cancel') { // 扫一扫点击取消时，返回的result.text为空
              vm.$router.push({
                name: 'HouseScanInventoryDetail',
                query: {
                  taskId: vm.routerQuery.taskId,
                  tagNum: result.text,
                },
              })
            }
          }, function () {
            console.log('失败了')
          },
          {
            preferFrontCamera: false, // iOS and Android（是否默认前置摄像头）
            showFlipCameraButton: true, // iOS and Android（是否允许转换摄像头）
            showTorchButton: true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (是否开启手电筒)
            saveHistory: true, // Android, save scan history (default false)
            prompt: 'Place a barcode inside the scan area', // Android（提示）
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500（猜测为默认扫描时间）
            formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED（格式）
            orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device（扫描框的方向，长方形或者正方形默认是长方形）
            disableAnimations: true, // iOS
            disableSuccessBeep: false, // iOS and Android
          },
        )
      } else { // 模拟
        vm.$router.push({
          name: 'HouseScanInventoryDetail',
          query: {
            taskId: '12201',
            tagNum: 'null00000039',
          },
        })
      }
    },
    async printTag () { // 确认批量打印标签
      buildPrintTag(this.buildList) // 公共方法
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

.select {
  background-color: #2896ff;
  color: #fff;
}

.left {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  // border 1px solid #ddc
  border-radius: 20px 0 0 20px;

  // background-color: #0079f3;
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
  .single-build {
    display flex
    justify-content space-between
    align-items center
  }
  .control-button {
    padding: 10px 0 0 0;
  }

  .hips-button {
    background-color: #2896ff !important;
    // flex: 1;
    margin-right: 15px;
  }

  .hips-button:last-child {
    margin-right: 0;
  }
}

.iconxuanzekuang1{
  font-size 20px
  color #108aee
}
.iconxuanzekuang{
  font-size 20px
  color #aaa
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.footer{
  position fixed
  left 0
  bottom 0
  background-color #fff
  display flex
  height 13.333vw
  width 100%
  text-align center
  color: #108AEE;
  padding 0 15px
  .chosse{
    display flex
    align-items center
    flex 1
    p{
      margin auto 0
    }
  }
  .button{
    margin auto
    flex 1
    display flex
  }
  .confirm{
    flex 1
    margin auto
    margin-right 15px
  }
  .cancel{
    flex 1
    margin auto
  }
  i{
    margin-right 5px
  }
}

</style>
