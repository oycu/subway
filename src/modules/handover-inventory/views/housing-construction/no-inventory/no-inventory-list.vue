<!--
 * @Author: your name
 * @Date: 2019-09-16 11:15:10
 * @LastEditTime: 2019-11-12 09:18:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /c:\Users\dzw\zhengzhouMetro\src\modules\handover-inventory\views\housing-construction\no-inventory\no-inventory-list.vue
 -->
<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="未盘点"
      :right-buttons="[
        {
          buttonIcon: 'search',
          buttonLabel: ''
        },
      ]"
      @nav-bar-back-click="$router.backPage()"
      @nav-bar-right-click="search"
    ></hips-nav-bar>
    <div class="task-details-contain">
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
import { View, NavBar, Popup, Button } from 'hips'
import InputItem from '../../../components/input-item'
import SingleHouse from '../../../components/single-housing'
import { indexeddb } from '../../../utils'
import { buildPrintTag } from '../../../utils/utils'

var fromName = ''
export default {
  name: 'HouseNoInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [SingleHouse.name]: SingleHouse,
    InputItem,
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  data () {
    return {
      active: 0,
      showPopup: false, // 显示弹出层搜索
      showFlag: false, // 打印标签弹出
      indexDB: {},
      buildList: [
        {
          taskBuildingBillDto: {},
        },
      ],
      searchCollection: { // 搜索字段
        faCategoryDesc: '',
        faNameDesc: '',
        instanceDescription: '',
        btsMajorDesc: '',
      },
    }
  },
  computed: {
    checkAll: { // 全选按钮切换计算
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
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    if (fromName === 'TaskSummary') {
      this.routerParams = this.$route.query
    }
    this.getBuildList()
  },
  methods: {
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
    async confirm () { // 确认搜索
      this.showPopup = false
      let params = ['', '', '', '']
      Object.keys(this.searchCollection).forEach((item, index) => {
        params[index] = this.searchCollection[item]
      })
      console.log('搜索内容', params)
      try {
        this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'StatusTaskId', ['10', this.routerParams.taskId], params)
        if (this.buildList.length === 0) {
          this.$hips.toast('无数据')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    goDetail (item) { // 跳转资产明细页
      this.$router.push({
        name: 'HouseNoInventoryDetail',
        query: {
          buildDetail: item,
          taskId: this.routerParams.taskId,
        },
      })
    },
    async getBuildList () { // 获取当前taskId下未盘点房建清单
      try {
        this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'StatusTaskId', ['10', this.routerParams.taskId])
        console.log('任务列表', this.buildList)
        if (this.buildList.length === 0) {
          this.$hips.toast('无数据')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    updateInput (val, key) {
      this.searchCollection[key] = val
    },
    showControl () { // 点击打印标签按钮
      this.showFlag = true
    },
    tagCancel () { // 取消打印标签
      this.showFlag = false
      this.buildList.forEach(item => {
        item.checkFlag = false
      })
    },
    changeFlag (flag, item) { // 点击单选按钮
      item.checkFlag = flag
    },
    selectAll (flag) { // 点击全选按钮
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
                  taskId: vm.routerParams.taskId,
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
            taskId: vm.$route.query.taskId,
            tagNum: 'FJTEST00001',
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
  background-color: #fafafa;
  overflow: auto;
  padding 0 15px 10px 15px
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

>>>.hips-cell {
  padding 0
}
>>>.hips-checkbox__label {
  display none
}
>>>.hips-checkbox__checked {
  margin-right 0px
  border 1px solid #ccc
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
