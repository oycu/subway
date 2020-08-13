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
      @nav-bar-back-click="goBack"
    />
    <div class="content" style="height:calc(100vh - 44px)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[allInventoryList]"
        @pulling-up="loadMore"
      >
        <div class="button">
          <hips-button type="primary" @click="printTag">打印标签</hips-button>
          <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
          <hips-button type="primary">查看设备树</hips-button>
          <hips-button type="primary" @click="addNode">增加节点</hips-button>
        </div>
        <!-- <div v-for="(element,eleIndex) in allInventoryList" :key="eleIndex" class="table"> -->
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
                <!-- <td>盘点数量</td> -->
                <td>合同设备单价(元）</td>
                <td>安装（存放）地点</td>
                <td>资产状态</td>
                <td>资产性质</td>
                <td>其他问题</td>
                <td>盘点结论</td>
                <td>备注</td>
              </tr>
            </thead>
            <tbody v-for="(item,index) in allInventoryList" :key="index" :class="{'checked':index === currentIndex,'change':item.changeFlag}">
              <tr @click="showMore(item, index)">
                <td class="boder">{{ index+1 }}</td>
                <td>{{ item.taskDeviceBillDto.batchId ? item.taskDeviceBillDto.batchId : '' }}</td>
                <td>{{ item.taskDeviceBillDto.tagNum ? item.taskDeviceBillDto.tagNum : '' }}</td>
                <td>{{ item.taskDeviceBillDto.faCategoryDesc ? item.taskDeviceBillDto.faCategoryDesc : '' }}</td>
                <td>{{ item.taskDeviceBillDto.faNameDesc ? item.taskDeviceBillDto.faNameDesc : '' }}</td>
                <td>{{ item.taskDeviceBillDto.combineCode ? item.taskDeviceBillDto.combineCode : '' }}</td>
                <td>{{ item.taskDeviceBillDto.hierarchicalCode ? item.taskDeviceBillDto.hierarchicalCode : '' }}</td>
                <td>{{ item.taskDeviceBillDto.instanceDescription ? item.taskDeviceBillDto.instanceDescription : '' }}</td>
                <td>{{ item.taskDeviceBillDto.specification ? item.taskDeviceBillDto.specification : '' }}</td>
                <td>{{ item.taskDeviceBillDto.manufacturer ? item.taskDeviceBillDto.manufacturer : '' }}</td>
                <td>{{ item.taskDeviceBillDto.unitOfMeasure ? item.taskDeviceBillDto.unitOfMeasure : '' }}</td>
                <td>{{ item.taskDeviceBillDto.conItemQuantity ? item.taskDeviceBillDto.conItemQuantity : '' }}</td>
                <td>{{ item.taskDeviceBillDto.inspectionQuantity ? item.taskDeviceBillDto.inspectionQuantity : '' }}</td>
                <td>{{ item.taskDeviceBillDto.installationQuantity ? item.taskDeviceBillDto.installationQuantity : '' }}</td>
                <!-- <td>{{ item.taskDeviceBillDto.quantityReceived ? item.taskDeviceBillDto.quantityReceived : '' }}</td> -->
                <td>{{ item.taskDeviceBillDto.conItemUnitPrice ? item.taskDeviceBillDto.conItemUnitPrice : '' }}</td>
                <td>{{ item.taskDeviceBillDto.locationCode ? item.taskDeviceBillDto.locationCode : '' }}</td>
                <td>{{ item.taskDeviceBillDto.objectStatus ? item.taskDeviceBillDto.objectStatus : '' }}</td>
                <td>{{ item.taskDeviceBillDto.objectNature ? item.taskDeviceBillDto.objectNature : '' }}</td>
                <td>{{ item.specificIssuesDesc ? item.specificIssuesDesc : '' }}</td>
                <td>{{ item.conclusion ? item.conclusion : '' }}</td>
                <td>{{ item.taskDeviceBillDto.comments ? item.taskDeviceBillDto.comments : '' }}</td>
              </tr>
            </tbody>
          </div>
        </div>
      </hips-scroll>
    </div>
    <div slot="footer" class="footer">
      <div class="chosse" @click="save">保存</div>
      <div @click="goBack">取消</div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
import { indexeddb } from '../../../utils'
import { isEmpty, leftRightScroll, storage } from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

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
  name: 'StartRecordInventory',
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
      routerQuery: {}, // 路由参数
      currentIndex: null,
      allInventoryList: [], // 所有设备盘盈清单
      tagNum: '',
      clickFlag: true,
    }
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.allInventoryList = this.$store.state.handoverInventory.allInventoryList// 盘盈list为空
    if (fromName === 'RecordInventoryDetail') { // 上一页面为功能选择页
      this.routerQuery = this.$route.query // 接收路由参数
    }
    if (fromName === 'ScanInventoryDetail') { // 上一页面为扫码详情页
      console.log('this.routerQuery', this.routerQuery)
      this.routerQuery = this.$route.query // 接收路由参数
      // let deviceList = this.$store.state.handoverInventory.deviceList
      // console.log('deviceList', deviceList)
      await this.generateRandomTagNum()
      this.allInventoryList = []
      let deviceList = JSON.parse(JSON.stringify(this.$store.state.handoverInventory.deviceList))
      let fatherNodeFlag = 0
      let fatherNodeIndex
      deviceList.forEach((ele, index) => {
        // delete ele.id
        // delete ele.combineIssues
        // delete ele.deviceNameIssues
        // delete ele.faIssues
        // delete ele.inventoryPersonNum
        // delete ele.locationIssues
        // delete ele.objectNatureIssues
        // delete ele.objectStatusIssues
        // delete ele.quantityIssues
        // delete ele.resultBillId
        // delete ele.resultId
        // delete ele.tagNumIssues
        // delete ele.unitIssues

        // delete ele.taskDeviceBillDto.batchId
        // delete ele.taskDeviceBillDto.batchNum
        // delete ele.taskDeviceBillDto.billId
        // delete ele.taskDeviceBillDto.poolId
        const {
          combineCode, // 组合码
          hierarchicalCode, // 层级码
          instanceDescription, // 设备名称
          specification, // 规格型号
          manufacturer, // 制造商
          unitOfMeasure, // 计量单位
          locationCode, // 安装（存放）地点
          objectStatus, // 资产状态
          objectNature, // 资产性质
          linewayId, // 线路id
          linewayName, // 线路名称
          btsMajor, // 专业CODE
          btsMajorDesc, // 专业名称
          departmentId, // 部门id
          departmentName, // 部门名称
          // comments, // 备注
        } = ele.taskDeviceBillDto
        const {
          taskId, // 任务id
          taskNumber, // 任务编号
          taskName, // 任务名称
          resultStatus, // 盘点状态
          inventoryTurn = 'FIRST', // 盘点轮次
          resultCode, // 盘点结果
          specificIssues, // 其他问题
          specificIssuesDesc, // 其他问题说明
          conclusion, // 盘点结论
          actualQuantity, // 实盘数量
          tagNum, // 标签编号
          changeFlag = 1, // 标志为已改变
          inventoryObject = '10', // 设备
          local = true, // 本地新增盘盈
          father = false, // 父级标志
          resultComments, // 盘点备注
        } = ele
        let cloneELe = {
          taskId, // 任务id
          taskNumber, // 任务编号
          taskName, // 任务名称
          resultStatus, // 盘点状态
          inventoryTurn, // 盘点轮次
          resultCode, // 盘点结果
          specificIssues, // 其他问题
          specificIssuesDesc, // 其他问题说明
          conclusion, // 盘点结论
          actualQuantity, // 实盘数量
          tagNum, // 标签编号
          changeFlag, // 标志为已改变
          inventoryObject, // 设备
          local, // 本地新增盘盈
          father, // 父级标志
          resultComments, // 盘点备注
          taskDeviceBillDto: {
            tagNum,
            combineCode, // 组合码
            hierarchicalCode, // 层级码
            instanceDescription, // 设备名称
            specification, // 规格型号
            manufacturer, // 制造商
            unitOfMeasure, // 计量单位
            locationCode, // 安装（存放）地点
            objectStatus, // 资产状态
            objectNature, // 资产性质
            linewayId, // 线路id
            linewayName, // 线路名称
            btsMajor, // 专业CODE
            btsMajorDesc, // 专业名称
            departmentId, // 部门id
            departmentName, // 部门名称
            // comments, // 备注
          },
        }
        console.log('cloneELe', cloneELe)
        // ele = cloneELe
        // ele.father = false
        // console.log('ele.taskDeviceBillDto.hierarchicalCode.split()', ele.taskDeviceBillDto.hierarchicalCode.split('.'))
        if (cloneELe.taskDeviceBillDto.hierarchicalCode) {
          if (cloneELe.taskDeviceBillDto.hierarchicalCode.split('.').length === 2) {
            fatherNodeFlag++
            fatherNodeIndex = index
          }
        }
        cloneELe.tagNum = this.tagNum
        cloneELe.taskDeviceBillDto.tagNum = this.tagNum
        cloneELe.taskDeviceBillDto.combineCode = ''
        cloneELe.taskDeviceBillDto.hierarchicalCode = ''
        cloneELe.resultCode = '10'
        cloneELe.resultStatus = '20'
        cloneELe.changeFlag = 1
        this.allInventoryList.push(cloneELe)
        // ele.local = true
        // ele.changeFlag = 1
      })
      console.log('fatherNodeFlag', fatherNodeFlag)
      console.log('fatherNodeFlag === 1', fatherNodeFlag === 1)
      if (fatherNodeFlag === 1) {
        this.allInventoryList[fatherNodeIndex].father = true
      }
      this.setAllInventoryList(this.allInventoryList)
      console.log('this.allInventoryList11111', this.allInventoryList)
    }
    leftRightScroll(this)
  },
  methods: {
    ...mapGetters({
      getDeviceList: 'handoverInventory/getDeviceList',
      getAllInventoryList: 'handoverInventory/getAllInventoryList',
    }),
    ...mapMutations({
      setDeviceList: 'handoverInventory/setDeviceList',
      setAllInventoryList: 'handoverInventory/setAllInventoryList',
    }),
    loadMore () { // 上拉加载
      console.log('上拉加载')
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    goBack () {
      console.log('1111')
      let vm = this
      if (!isEmpty(this.allInventoryList)) { // 盘盈列表是不为空
        vm.$hips.dialog.confirm({
          content: '<p style="line-height:22px;font-size:16px">数据未保存，确认退出？</p>',
          okText: '是',
          cancelText: '否',
          closable: false,
          async onOk () { // 是
            vm.$router.go(-2)
          },
          onCancel () {
          },
        })
      } else {
        vm.$router.go(-2)
      }
    },
    scanInventory () { // 扫码盘点
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
            text: 'TEST00002',
          },
        })
      }
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
      this.allInventoryList.forEach((ele, index) => { // 判断是否满足打印的条件--有且只有含一个.的层级码
        // if (ele.taskDeviceBillDto.hierarchicalCode) { // 层级码是否存在
        //   let arrData = ele.taskDeviceBillDto.hierarchicalCode.split('.')
        //   if (arrData.length === 2) { // 长度是否为2
        //     limitNum++ // 第几个长度为2的层级码
        //     currentIndex = index // 满足条件的当前index
        //   }
        // }
        if (ele.father) {
          limitNum++
          currentIndex = index
        }
      })
      if (limitNum !== 1) {
        this.$hips.toast('该清单不满足打印条件！')
        return
      }
      let randomNum = Math.floor(Math.random() * (999 - 100)) + 100 // 生成三位随机数
      let faCategoryDesc = this.allInventoryList[currentIndex].taskDeviceBillDto.faCategoryDesc ? this.allInventoryList[currentIndex].taskDeviceBillDto.faCategoryDesc : ''
      let faNameDesc = this.allInventoryList[currentIndex].taskDeviceBillDto.faNameDesc ? this.allInventoryList[currentIndex].taskDeviceBillDto.faNameDesc : ''

      let dataArr = [{
        cardType: 0, // 0设备 1房建
        tagNum: this.allInventoryList[currentIndex].tagNum, // 标签编号
        instanceDescription: this.allInventoryList[currentIndex].taskDeviceBillDto.instanceDescription, // 设备名称
        unitOfMeasure: this.allInventoryList[currentIndex].taskDeviceBillDto.unitOfMeasure, // 计量单位
        specification: this.allInventoryList[currentIndex].taskDeviceBillDto.specification, // 规格型号
        faNameDesc: `${faCategoryDesc}${faNameDesc ? '/' : ''}${faNameDesc}`, // 固定资产目录/名称
        isfixed: '否', // 是否为固定资产
      }]
      let params = {
        filename: `${this.routerQuery.taskName}_${randomNum}`, // 盘点任务名称+下划线+三位流水
        data: dataArr,
      }
      console.log('params', params)
      const dict = {
        'className': 'WebBridge',
        'function': 'showCard',
        'params': params,
        'successCallBack': 'bridgeLoginSuccess',
        'failureCallBack': 'bridgeLoginFailure',
      }
      HandBridge.postMessage(JSON.stringify(dict))
    },
    addNode () { // 增加节点
      console.log('addNode')
      // this.showPopup = true
      this.$router.push({
        name: 'RecordInventoryDetail',
        query: {
          taskNumber: this.routerQuery.taskNumber,
          taskId: this.routerQuery.taskId,
          taskName: this.routerQuery.taskName,
          tagNum: this.tagNum,
          addNode: true },
      })
    },
    showMore (item, currentIndex) {
      console.log('showMore')
      this.$router.push({
        name: 'RecordInventoryDetail',
        query: {
          taskNumber: this.routerQuery.taskNumber,
          taskId: this.routerQuery.taskId,
          taskName: this.routerQuery.taskName,
          addNode: true,
          currentIndex },
      })
    },
    async generateRandomTagNum () { // 生成随机的标签编号，并且与本地的盘盈tagNum不同
      let randomNum = Math.floor(Math.random() * (999999 - 100000)) + 100000 // 生成六位随机数
      let defaultNum = 'S' + storage.get('empId') + randomNum // 拼接tagnum
      let tagNumList = await indexeddb.cursorGetData(this.indexDB, 'deviceList') // 获取设备表中所有的清单
      let flag = tagNumList.filter(item => item.resultCode === '10').some(element => element.tagNum === defaultNum) // 判断盘盈中是否有相同的tagNum
      if (flag) { // 不满足条件
        this.generateRandomTagNum() // 重新获取
      }
      this.tagNum = defaultNum
    },
    async save () { // 保存数据
      console.log('this.clickFlag', this.clickFlag)
      if (this.clickFlag) {
        this.clickFlag = false
        console.log('this.allInventoryList', this.allInventoryList)
        let updateSuccess = await indexeddb.addAll(this.indexDB, 'deviceList', this.allInventoryList) // 新增清单数据到indexedDB deviceList表中
        console.log('updateSuccess', updateSuccess)
        if (updateSuccess) {
          this.$hips.toast('保存成功！')
          this.$router.go(-2)
        } else {
          this.$hips.toast('保存失败！')
        }
        // setTimeout(function () {
        //   this.clickFlag = true
        // }, 500)
      }
      this.clickFlag = true
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
    display flex
    .hips-button{
      background-color: #2896ff!important
      flex 1
      margin-bottom 10px
      margin-right 5px
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
  .table{
    overflow-y scroll
    font-size 14px
    border 1px solid #eeeeee
    border-radius 10px
    margin-bottom 15px
    .table-header{
      width 100%
      overflow hidden
      // overflow scroll
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
  .select{
    background #e1ec11
  }
  .checked{
    background #ffe4d4!important
  }
  input{
    outline none
  }
}
>>>.font-override{
  div {
    color black
    p{
      color black
    }
  }
}
.boder{
    border 1px solid #eee!important
    + td{
        border 1px solid #eee!important
    }
}
.hips-popup--bottom{
  height 520px
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
.border-bot{
  border-bottom 1px solid #ccc
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
