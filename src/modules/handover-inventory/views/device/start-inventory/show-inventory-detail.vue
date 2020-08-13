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
      title="资产明细"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="content" style="height:calc(100vh)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[inventoryList]"
        @pulling-up="loadMore"
      >
        <div class="button">
          <hips-button type="primary" @click="printTag">打印标签</hips-button>
          <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
          <hips-button type="primary">查看设备树</hips-button>
        </div>
        <div class="inventory-item">
          <div class="table">
            <thead class="table-header">
              <tr>
                <td class="boder">序号</td>
                <td>导入标识</td>
                <td>标签编号</td>
                <td>固定资产目录</td>
                <td>固定资产名称</td>
                <td>组合码</td>
                <td>层级码</td>
                <td>设备名称</td>
                <td>规格型号</td>
                <td>制造商</td>
                <td>计量单位</td>
                <td>合同数量（变更后）</td>
                <td>四方验收单数量</td>
                <td>安装数量</td>
                <td>合同设备单价(元）</td>
                <td>安装（存放）地点</td>
                <td>资产状态</td>
                <td>资产性质</td>
                <td>其他问题</td>
                <td>盘点结论</td>
                <td>备注</td>
              </tr>
            </thead>
            <tbody v-for="(item,index) in inventoryList" :key="index" :class="{'animation-tr':animationFlag,'checked':index === currentIndex,'change':item.changeFlag}">
              <tr @click="showMore(item,index)">
                <td class="boder">{{ index+1 }}</td>
                <td>{{ item.taskDeviceBillDto.batchId }}</td>
                <td>{{ item.taskDeviceBillDto.tagNum }}</td>
                <td>{{ item.taskDeviceBillDto.faCategoryDesc }}</td>
                <td>{{ item.taskDeviceBillDto.faNameDesc }}</td>
                <td>{{ item.taskDeviceBillDto.combineCode }}</td>
                <td>{{ item.taskDeviceBillDto.hierarchicalCode }}</td>
                <td>{{ item.taskDeviceBillDto.instanceDescription }}</td>
                <td>{{ item.taskDeviceBillDto.specification }}</td>
                <td>{{ item.taskDeviceBillDto.manufacturer }}</td>
                <td>{{ item.taskDeviceBillDto.unitOfMeasure }}</td>
                <td>{{ item.taskDeviceBillDto.conItemQuantity }}</td>
                <td>{{ item.taskDeviceBillDto.inspectionQuantity }}</td>
                <td>{{ item.taskDeviceBillDto.installationQuantity }}</td>
                <td>{{ item.taskDeviceBillDto.conItemUnitPrice }}</td>
                <td>{{ item.taskDeviceBillDto.locationCode }}</td>
                <td>{{ item.taskDeviceBillDto.objectStatus }}</td>
                <td>{{ item.taskDeviceBillDto.objectNature }}</td>
                <td>{{ item.specificIssuesDesc }}</td>
                <td>{{ item.conclusion }}</td>
                <td>{{ item.taskDeviceBillDto.comments }}</td>
              </tr>
            </tbody>
          </div>
        </div>
      </hips-scroll>
    </div>
    <hips-popup v-model="showPopup" position="bottom">
      <detailItem
        v-if="inventoryDetail.resultCode !== '10' && inventoryDetail.resultCode !== '70'"
        :inventoryDetail="inventoryDetail"
        :checkstateList="checkstateList"
        :roundsList="roundsList"
        :resultList="resultList"
        :specificIssuesList="specificIssuesList"
        @operate="operate"
      />
      <addDetailItem
        v-else
        :inventoryDetail="inventoryDetail"
        :checkstateList="checkstateList"
        :roundsList="roundsList"
        :resultList="resultList"
        :specificIssuesList="specificIssuesList"
        @operate="operate"
      />
    </hips-popup>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
import detailItem from '../../../components/detail-item'
import addDetailItem from '../../../components/add-detail-item'
import { indexeddb } from '../../../utils'
import { leftRightScroll } from '@/utils'

var fromName = ''
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
  name: 'ShowInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    detailItem,
    addDetailItem,
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
      showPopup: false, // 控制显示盘点信息
      animationFlag: false,
      taskId: {}, // 路由参数
      inventoryList: [], // 清单列表
      inventoryDetail: {}, // 清单信息
      indexDB: {},
      resultList: [], // 快码-盘点结果list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [], // 快码-盘点轮次list
      specificIssuesList: [],
      currentIndex: null,
    }
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.currentIndex = null
    if (fromName.indexOf('List') !== -1) {
      this.getFastCode() // 获取快码值
      this.inventoryList = this.$route.query.inventoryList
      this.taskId = this.$route.query.taskId
      leftRightScroll(this)
    }
  },
  methods: {
    loadMore () { // 上拉加载
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    showMore (item, index) { // 查看盘点信息
      this.currentIndex = index
      this.inventoryDetail = item
      this.showPopup = true
    },
    operate (val) { // 盘点信息内取消/确认事件
      this.showPopup = false
    },
    printTag () { // 打印标签
      let vm = this
      // 打印成功回调
      window.bridgeLoginSuccess = function (str) {
        const res = JSON.parse(str)
        console.log('打印成功', JSON.stringify(res))
      }
      // 打印失败回调
      window.bridgeLoginFailure = function (res) {
        console.error(res)
        vm.$hips.toast('打印失败！')
      }
      let limitNum = 0
      let currentIndex
      this.inventoryList.forEach((ele, index) => { // 判断是否满足打印的条件--有且只有含一个.的层级码
        if (ele.taskDeviceBillDto.hierarchicalCode) { // 层级码是否存在
          let arrData = ele.taskDeviceBillDto.hierarchicalCode.split('.')
          if (arrData.length === 2) { // 长度是否为2
            currentIndex = index // 满足条件的当前index
            limitNum++ // 第几个长度为2的层级码
          }
        }
      })
      if (limitNum !== 1) {
        this.$hips.toast('该清单不满足打印条件！')
        return
      }
      let randomNum = Math.floor(Math.random() * (999 - 100)) + 100 // 随机生成三位数
      let faCategoryDesc = this.inventoryList[currentIndex].taskDeviceBillDto.faCategoryDesc ? this.inventoryList[currentIndex].taskDeviceBillDto.faCategoryDesc : ''
      let faNameDesc = this.inventoryList[currentIndex].taskDeviceBillDto.faNameDesc ? this.inventoryList[currentIndex].taskDeviceBillDto.faNameDesc : ''
      let dataArr = [{
        cardType: 0, // 0设备 1房建
        tagNum: this.inventoryList[currentIndex].tagNum, // 标签编号
        instanceDescription: this.inventoryList[currentIndex].taskDeviceBillDto.instanceDescription, // 设备名称
        unitOfMeasure: this.inventoryList[currentIndex].taskDeviceBillDto.unitOfMeasure, // 计量单位
        specification: this.inventoryList[currentIndex].taskDeviceBillDto.specification, // 规格型号
        faNameDesc: `${faCategoryDesc}${faNameDesc ? '/' : ''}${faNameDesc}`, // 固定资产目录/名称
        isfixed: '否', // 是否为固定资产
      }]
      let params = {
        filename: `${this.inventoryList[0].taskName}_${randomNum}`, // 盘点任务名称+下划线+三位流水
        data: dataArr,
      }
      const dict = {
        'className': 'WebBridge',
        'function': 'showCard',
        'params': params,
        'successCallBack': 'bridgeLoginSuccess',
        'failureCallBack': 'bridgeLoginFailure',
      }
      HandBridge.postMessage(JSON.stringify(dict))
    },
    scanInventory () { // 扫描盘点
      let vm = this
      const env = process.env.VUE_APP_BUILD // 环境
      if (env === 'release') { // 真机
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result.text !== '' && result.text !== 'cancel') { // 扫一扫点击取消时，返回的result.text为空
              vm.$router.push({
                name: 'ScanInventoryDetail',
                query: {
                  taskId: vm.taskId,
                  text: result.text,
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
          name: 'ScanInventoryDetail',
          query: {
            taskId: vm.taskId,
            text: 'TEST00002',
          },
        })
      }
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
    async getFastCode () { // 获取快码值 盘点状态 盘点轮次 盘点结果
      let roundsList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_ROUNDS') // 获取盘点轮次快码值
      let checkstateList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT_STATE') // 获取盘点状态快码值
      let resultList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT') // 获取盘点结果快码值
      let specificIssuesList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.OTHER_PROBLEM') // 获取其他问题快码值
      this.transte(roundsList, 'roundsList') // 盘点轮次
      this.transte(checkstateList, 'checkstateList') // 盘点状态
      this.transte(resultList, 'resultList') // 盘点结果
      this.transte(specificIssuesList, 'specificIssuesList') // 盘点状态
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
  >>>.hips-scroll__content{
    padding 0 15px 15px
  }
}
.content{
  margin-top 10px
  overflow scroll
  .button{
    .hips-button{
      background-color: #2896ff!important
      flex 1
      margin-bottom 10px
      margin-right 15px
    }
    .hips-button:last-child{
      margin-right 0
    }
  }
  tr{
    height 25px
    td{
      padding 6px 10px
      border 1px solid #eee
      text-align center
      white-space nowrap
    }
    td:first-child{
        border none
    }
    .detail{
        width 100%
    }
  }
  .inventory-item{
  overflow auto
  border 1px solid #eeeeee
  border-radius 10px
}
  .table{
    overflow-y scroll
    font-size 14px
    border 1px solid #eeeeee
    border-radius 10px
    .table-header{
      width 100%
      overflow hidden
      tr{
        overflow scroll
      }
      td{
          // background #eee
          background #dbebf9
          color black
      }
    }
  }
  .checked{
    background #ffe4d4!important
  }
  input{
    outline none
  }
}
.boder{
    border 1px solid #eee!important
    + td{
        border 1px solid #eee!important
    }
}
.hips-popup--bottom{
  max-height 520px
  height auto
  border-radius 15px 15px 0 0
  overflow scroll
}
</style>
