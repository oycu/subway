<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 19:22:00
 * @LastEditTime: 2019-10-16 09:47:53
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
      title="资产明细"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="task-asset-contain">
      <div class="button">
        <hips-button type="primary" @click="printTag">打印标签</hips-button>
        <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
        <hips-button type="primary">查看设备树</hips-button>
      </div>
      <asset-info :buildDetail="buildDetail.taskBuildingBillDto" />
      <div class="inventory-contain">
        <p class="header">盘点信息</p>
        <select-item
          :isDisable="true"
          title="盘点状态"
          :options="stateList"
          keyName="resultStatus"
          :selctValue="buildDetail.resultStatus"
        />
        <select-item
          :isDisable="true"
          title="盘点轮次"
          :options="roundsList"
          keyName="inventoryTurn"
          :selctValue="buildDetail.inventoryTurn"
        />
        <select-item
          :isDisable="true"
          title="盘点结果"
          :options="resultList"
          keyName="resultCode"
          :selctValue="buildDetail.resultCode"
        />
        <select-item
          :isDisable="true"
          title="其他问题"
          :options="specificIssuesList"
          keyName="specificIssues"
          :selctValue="buildDetail.specificIssues"
        />
        <input-item :disableFlag="true" keyVal="resultComments" title="盘点备注" :value="buildDetail.resultComments" />
        <input-item
          :disableFlag="true"
          keyVal="conclusion"
          title="盘点结论"
          :value="buildDetail.conclusion"
        />
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import AssetInfo from '../../../components/asset-information'
import SelectItem from '../../../components/select-item'
import InputItem from '../../../components/input-item'
import { indexeddb } from '../../../utils'

var fromName = ''
export default {
  name: 'HouseShowInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [AssetInfo.name]: AssetInfo,
    SelectItem,
    InputItem,
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  data () {
    return {
      buildDetail: {
        taskBuildingBillDto: {},
      },
      stateList: [],
      roundsList: [],
      resultList: [],
      specificIssuesList: [],
    }
  },
  async activated () {
    console.log('路径', fromName)
    if (fromName !== 'HouseScanInventoryDetail') {
      this.buildDetail = this.$route.query.buildDetail
      this.taskId = this.$route.query.taskId
      this.indexDB = this.$store.state.handoverInventory.indexDB
      this.getFastCode('CUX.BT.CHECK_RESULT_STATE')
      this.getFastCode('CUX.BT.CHECK_ROUNDS')
      this.getFastCode('CUX.BT.CHECK_RESULT')
      this.getFastCode('CUX.BT.OTHER_PROBLEM')
    }
  },
  methods: {
    async getFastCode (codeType) { // 获取值列表
      try {
        let list = []
        let stateCodeList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', codeType) // 盘点状态
        stateCodeList.forEach(element => {
          let temp = {
            value: element.codeValue,
            label: element.meaning,
          }
          list.push(temp)
        })
        if (codeType === 'CUX.BT.CHECK_RESULT_STATE') { // 盘点状态
          this.stateList = list
        }
        if (codeType === 'CUX.BT.CHECK_ROUNDS') { // 盘点轮次
          this.roundsList = list
        }
        if (codeType === 'CUX.BT.CHECK_RESULT') { // 盘点结果
          this.resultList = list
        }
        if (codeType === 'CUX.BT.OTHER_PROBLEM') { // 其他问题
          this.specificIssuesList = list
        }
      } catch (err) {
        console.log(err)
      }
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
                  taskId: vm.$route.query.taskId,
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
    async printTag () { // 单个标签打印
      // 登录成功回调
      window.bridgeLoginSuccess = function (str) {
        const res = JSON.parse(str)
        console.log('登录返回', JSON.stringify(res))
      }
      // 登录失败回调
      window.bridgeLoginFailure = function (res) {
        console.error(res)
      }
      let task = await indexeddb.cursorGetDataByIndex(this.indexDB, 'taskSummary', 'taskId', this.taskId) // 获取当前taskId下的任务名称
      let randomNum = Math.floor(Math.random() * (999 - 100)) + 100
      const filename = task[0].taskName + '_' + randomNum // 文件名（任务名称 + _ + 三位流水）
      let params = {
        filename,
        data: [
          {
            cardType: 1,
            tagNum: this.buildDetail.taskBuildingBillDto.tagNum,
            instanceDescription: this.buildDetail.taskBuildingBillDto.instanceDescription,
            unitOfMeasure: this.buildDetail.taskBuildingBillDto.unitOfMeasure,
            projectScaleCompleted: this.buildDetail.taskBuildingBillDto.projectScaleCompleted,
          },
        ],
      }
      console.log('paramas', params)
      const dict = {
        'className': 'WebBridge',
        'function': 'showCard',
        'params': params,
        'successCallBack': 'bridgeLoginSuccess',
        'failureCallBack': 'bridgeLoginFailure',
      }

      HandBridge.postMessage(JSON.stringify(dict))
    },
  },
}
</script>

<style scoped lang="stylus">
.task-asset-contain {
  padding: 5px 15px 10px 15px;
  background-color: #fafafa;
}

.inventory-contain {
  border: 1px solid #DDDDCC;
  border-radius: 10px;
  padding: 5px 0px 10px 10px;
  margin-top: 10px;
  background-color #fff
  .header {
    text-align: center;
    color: #1f8ceb;
    padding: 10px 0;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
  }
}

.button {
  padding: 10px 0;

  .hips-button {
    background-color: #2896ff !important;
    margin-right: 15px;
  }

  .hips-button:last-child {
    margin-right: 0;
  }
}

</style>
