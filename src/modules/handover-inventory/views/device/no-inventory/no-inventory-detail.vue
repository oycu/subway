<template>
  <hips-view>
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
        :data="[deviceList]"
        @pulling-up="loadMore"
      >
        <div class="button">
          <hips-button type="primary" @click="printTag">打印标签</hips-button>
          <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
          <hips-button type="primary">查看设备树</hips-button>
          <hips-button type="primary" @click="addNode">增加节点</hips-button>
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
            <tbody v-for="(item,index) in deviceList" :key="index" :class="{'checked':index === currentIndex,'change':item.changeFlag}">
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
    <div slot="footer" class="footer">
      <div class="chosse" @click="$router.backPage()">返回</div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
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
  name: 'NoInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
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
      routerQuery: {},
      indexDB: {},
      deviceList: [],
      inventoryDetail: {},
      deviceBill: {},
      selectDisable: false, // select组件是否可选
      resultList: [], // 快码-盘点结果list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [], // 快码-盘点轮次list
      specificIssuesList: [], // 快码-其他问题list
      currentIndex: null,
      deleteFlag: false, // 是否显示删除按钮
      linewayItem: {}, // 默认线路信息
      btsMajorItem: {}, // 默认专业信息
      currentType: {}, // 当前类型
      addNodeFlag: false, // 是否为新增的盘盈信息
      updataFlag: false, // 是否更新数据
      addInventory: { // 清单信息
        taskId: '', // 任务id
        taskNumber: '', // 任务编码
        taskName: '', // 任务名称
        resultStatus: '20', // 盘点状态
        inventoryTurn: 'FIRST', // 盘点轮次
        resultCode: '10', // 盘点结果
        specificIssues: '', // 其他问题
        specificIssuesDesc: '', // 其他问题说明
        conclusion: '', // 盘点结论
        actualQuantity: '', // 实盘数量
        tagNum: '', // 标签编号
        changeFlag: 1, // 标志为已改变
        inventoryObject: '10', // 设备
        local: true,
        resultComments: '', // 盘点备注
        taskDeviceBillDto: {
          tagNum: '', // 标签编号
          combineCode: '', // 组合码
          hierarchicalCode: '', // 层级码
          instanceDescription: '', // 设备名称
          specification: '', // 规格型号
          manufacturer: '', // 制造商
          unitOfMeasure: '', // 计量单位
          locationCode: '', // 安装（存放）地点
          objectStatus: '', // 资产状态
          objectNature: '', // 资产性质
          linewayId: '', // 线路id
          linewayName: '', // 线路名称
          btsMajor: '', // 专业CODE
          btsMajorDesc: '', // 专业名称
          departmentId: '', // 部门id
          departmentName: '', // 部门名称
          comments: '', // 备注
        },
      },
      showProblem: false,
      showHap: false,
      showComment: false,
      showOther: false,
      showLoss: false,
    }
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.currentIndex = null
    if (fromName === 'NoInventoryList') {
      this.routerQuery = this.$route.query // 接收路由参数
    }
    this.getDeviceListByBillId() // 根据taskId tagNum匹配清单信息
  },
  methods: {
    loadMore () { // 上拉加载
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
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
      this.deviceList.forEach((ele, index) => { // 判断是否满足打印的条件--有且只有含一个.的层级码
        if (ele.taskDeviceBillDto.hierarchicalCode) { // 层级码是否存在
          let arrData = ele.taskDeviceBillDto.hierarchicalCode.split('.')
          if (arrData.length === 2) { // 长度是否为2
            limitNum++ // 第几个长度为2的层级码
            currentIndex = index // 满足条件的当前index
          }
        }
      })
      if (limitNum !== 1) {
        this.$hips.toast('该清单不满足打印条件！')
        return
      }
      let randomNum = Math.floor(Math.random() * (999 - 100)) + 100 // 随机生成三位数
      let faCategoryDesc = this.deviceList[currentIndex].taskDeviceBillDto.faCategoryDesc ? this.deviceList[currentIndex].taskDeviceBillDto.faCategoryDesc : ''
      let faNameDesc = this.deviceList[currentIndex].taskDeviceBillDto.faNameDesc ? this.deviceList[currentIndex].taskDeviceBillDto.faNameDesc : ''
      let dataArr = [{
        cardType: 0, // 0设备 1房建
        tagNum: this.deviceList[currentIndex].tagNum, // 标签编号
        instanceDescription: this.deviceList[currentIndex].taskDeviceBillDto.instanceDescription, // 设备名称
        unitOfMeasure: this.deviceList[currentIndex].taskDeviceBillDto.unitOfMeasure, // 计量单位
        specification: this.deviceList[currentIndex].taskDeviceBillDto.specification, // 规格型号
        faNameDesc: `${faCategoryDesc}${faNameDesc ? '/' : ''}${faNameDesc}`, // 固定资产目录/名称
        isfixed: '否', // 是否为固定资产
      }]
      let params = {
        filename: `${this.deviceList[currentIndex].taskName}_${randomNum}`, // 盘点任务名称+下划线+三位流水
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
                  taskId: vm.routerQuery.taskId,
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
            taskId: vm.routerQuery.taskId,
            text: 'TEST_1028004',
          },
        })
      }
    },
    addNode () { // 增加节点
      this.$router.push({
        name: 'AddNode',
        query: {
          taskId: this.routerQuery.taskId, // 任务id
          taskNumber: this.deviceList[0].taskNumber, // 任务编号
          taskName: this.deviceList[0].taskName, // 任务名
          tagNum: this.deviceList[0].tagNum, // 清单编号
          NoInventoryFlag: true,
        },
      })
    },
    async showMore (item, index) { // 查看盘点信息
      await this.getDeviceListByBillId() // 重新获取表中的清单信息
      this.currentIndex = index
      // this.inventoryDetail = this.deviceList[index] // 清单盘点信息
      // this.deviceBill = item.taskDeviceBillDto // 清单信息
      // this.updataFlag = true // 更新数据
      // this.showPopup = true
      // this.addInventory.local ? this.deleteFlag = true : this.deleteFlag = false // 数据只存储在本地时，删除按钮显示
      if (item.resultCode === '70' || item.resultCode === '10') {
        this.addInventory = this.deviceList[index]
        this.$router.push({
          name: 'AddNode',
          query: {
            addInventory: this.addInventory },
        })
      } else {
        this.$router.push({
          name: 'EditInventoryDetail',
          query: {
            inventoryDetail: this.deviceList[index] },
        })
      }
    },
    async getDeviceListByBillId () { // 根据taskId tagNum匹配清单信息
      this.deviceList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', ['taskId', 'resultStatus', 'tagNum'], [this.routerQuery.taskId, '10', this.routerQuery.tagNum])
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
      leftRightScroll(this)
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
  >>>.hips-button{
    padding 0
  }
}
.content{
  margin-top 10px
  overflow scroll
  .button{
    margin-bottom 15px
    display flex
    .hips-button{
      background-color: #2896ff!important
      flex 1
      margin-right 5px
    }
    .hips-button:last-child{
      margin-right 0
    }
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
  // td:first-child{
  //     border none
  // }
  .detail{
      width 100%
  }
}
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
.checked{
    background #ffe4d4!important
  }
.select{
    background #e1ec11
}
.detail{
    td:first-child + td{
        background #728dc7
        border none
        +td +td{
            background #e5c6b1
            border none
        }
    }
}
.boder{
    border 1px solid #eee!important
    + td{
        border 1px solid #eee!important
    }
}
input{
    outline none
}
.inventory-item{
  overflow auto
  border 1px solid #eeeeee
  border-radius 10px
}
.table{
  font-size 14px
}
.hips-popup--bottom{
  max-height 520px
  height auto
  border-radius 15px 15px 0 0
}
.detail{
    padding-left 10px
    margin 10px 10px 0 10px
    background #fff
    // border 1px solid #ccc
    border-radius 15px
    // margin-top 20px
    z-index 9
    >>>.item{
       z-index 1
    }
    .select-item:last-child{
      border none
    }
    .item:last-child{
        border none
        border-radius 0 0 15px 0
    }
    .title{
        color #2896ff
        text-align center
        padding 10px 0
        border-bottom 1px solid #ccc
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
}
.footer{
  display flex
  height 100%
  text-align center
  color: #48D2A0;
  div{
    flex 1
    margin auto 0
  }
  div:first-child{
    color #108AEE
  }
  i{
    margin-right 10px
  }
}

</style>
