<!--
 * @Author: your name
 * @Date: 2019-09-19 19:22:00
 * @LastEditTime: 2019-11-06 14:24:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhengzhouMetro\src\modules\handover-inventory\views\housing-construction\start-inventory\start-record-inventory.vue
 -->
<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="盘盈资产"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="task-asset-contain" style="height:calc(100vh)">
      <div class="button">
        <hips-button type="primary" @click="printTag">打印标签</hips-button>
        <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
        <hips-button type="primary">查看设备树</hips-button>
      </div>
      <div class="inner-contain">
        <select-item
          title="盘点结果"
          :options="resultList"
          placeholder="盘盈"
          :isDisable="true"
        />
        <select-item
          title="盘点状态"
          :options="stateList"
          keyName="resultStatus"
          :selctValue="buildDetail.resultStatus"
          :isDisable="true"
          @selectChange="selectChange"
        />
        <select-item
          title="盘点轮次"
          :options="roundsList"
          keyName="inventoryTurn"
          :selctValue="buildDetail.inventoryTurn"
          @selectChange="selectChange"
        />
        <p-item title="标签编号" :value="buildDetail.taskBuildingBillDto.tagNum" />
        <!-- <input-item
          keyVal="instanceDescription"
          title="房建名称"
          placeholder="请输入房建名称"
          :value="buildDetail.taskBuildingBillDto.instanceDescription"
          @updateInput="updateInput"
        /> -->
        <SuggestInput
          keyVal="instanceDescription"
          title="房建名称"
          placeholder="请输入房建名称"
          :value="buildDetail.taskBuildingBillDto.instanceDescription"
          @updateInput="updateInput"
        ></SuggestInput>

        <!-- <input-item
          keyVal="unitOfMeasure"
          title="计量单位"
          placeholder="请输入计量单位"
          :value="buildDetail.taskBuildingBillDto.unitOfMeasure"
          @updateInput="updateInput"
        /> -->
        <SuggestInput
          keyVal="unitOfMeasure"
          title="计量单位"
          placeholder="请输入计量单位"
          :value="buildDetail.taskBuildingBillDto.unitOfMeasure"
          @updateInput="updateInput"
        ></SuggestInput>

        <!-- <input-item
          keyVal="projectScaleCompleted"
          title="竣工工程规模"
          placeholder="请输入竣工工程规模"
          :value="buildDetail.taskBuildingBillDto.projectScaleCompleted"
          @updateInput="updateInput"
        /> -->
        <SuggestInput
          keyVal="projectScaleCompleted"
          title="竣工工程规模"
          placeholder="请输入竣工工程规模"
          :value="buildDetail.taskBuildingBillDto.projectScaleCompleted"
          @updateInput="updateInput"
        ></SuggestInput>

        <cell-item
          title="线路"
          :class="{'font-override': buildDetail.taskBuildingBillDto.linewayName}"
          :value="buildDetail.taskBuildingBillDto.linewayName ? buildDetail.taskBuildingBillDto.linewayName:'请选择线路'"
          @click.native="goSearch('HAPPS_ZZM_LINE_NEW', ['codeType', 'flexId'])"
        />
        <cell-item
          title="专业"
          :class="{'font-override': buildDetail.taskBuildingBillDto.btsMajorDesc}"
          :value="buildDetail.taskBuildingBillDto.btsMajorDesc ? buildDetail.taskBuildingBillDto.btsMajorDesc:'请选择专业'"
          @click.native="goSearch('CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'])"
        />
        <cell-item
          title="部门"
          :class="{'font-override': buildDetail.taskBuildingBillDto.departmentName}"
          :value="buildDetail.taskBuildingBillDto.departmentName ? buildDetail.taskBuildingBillDto.departmentName:'请选择部门'"
          @click.native="goSearch('HAPPS_ZZM_DEPARTMENT')"
        />
        <!-- <input-item
          title="盘点备注"
          keyVal="resultComments"
          placeholder="请输入盘点备注"
          :value="buildDetail.resultComments"
          @updateInput="updateInput"
        /> -->
        <select-item
          title="盘点备注"
          keyVal="resultComments"
          placeholder="请输入盘点备注"
          :value="buildDetail.resultComments"
          @updateInput="updateInput"
        />
      </div>
    </div>
    <div
      slot="footer"
      class="footer"
    >
      <div class="chosse" @click="save">
        保存
      </div>
      <div @click="cancel">取消</div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import SelectItem from '../../../components/select-item'
import CellItem from '../../../components/cell-item'
// import InputItem from '../../../components/input-item'
import SuggestInput from '../../../components/suggest-input'
import PItem from '../../../components/p-item'
import { indexeddb } from '../../../utils'
import { isEmpty, storage } from '@/utils'

var fromName = ''
export default {
  name: 'HouseStartRecordInventory',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    SelectItem,
    CellItem,
    // InputItem,
    SuggestInput,
    PItem,
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  data () {
    return {
      buildDetail: {
        taskId: '',
        taskNumber: '',
        changeFlag: 1,
        inventoryPersonNum: '',
        inventoryTurn: '', // 盘点轮次
        resultBillId: '',
        'resultCode': '10', // 盘点结果
        'resultStatus': '20', // 盘点状态
        'specificIssues': '', // 其他问题
        tagNum: '', // 标签编号
        inventoryObject: '30', // 房建
        taskBuildingBillDto: {
          tagNum: '',
          instanceDescription: '', // 房建名称
          unitOfMeasure: '', // 计量单位
          projectScaleCompleted: '', // 竣工工程规模
          linewayName: '', // 线路名称
          linewayId: '', // 线路id
          btsMajorDesc: '', // 专业
          btsMajor: '', // 专业CODE
          departmentName: '', // 部门
          departmentId: '', // 部门id
          faCategoryDesc: '', // 固定资产目录
          faNameDesc: '', // 固定资产名称
          comments: '', // 备注
        },
      },
      linewayItem: {}, // 线路信息
      btsMajorItem: {}, // 专业信息
      stateList: [],
      roundsList: [],
      resultList: [],
      specificIssuesList: [],
      indexDB: {},
      currentType: '',
      currentIndex: 0,
      allResultList: [],
    }
  },
  async activated () {
    console.log('activated', fromName)
    if (fromName === 'FunctionSelect') {
      this.routerQuery = this.$route.query
      this.indexDB = this.$store.state.handoverInventory.indexDB
      this.getFastCode('CUX.BT.CHECK_RESULT_STATE')
      this.getFastCode('CUX.BT.CHECK_ROUNDS')
      this.getFastCode('CUX.BT.CHECK_RESULT')
      this.getFastCode('CUX.BT.OTHER_PROBLEM')
      this.generateRandomTagNum()
      this.initBtsMajor()
    }
    if (fromName === 'HandSearch') {
      let chooseData = this.$store.state.handoverInventory.chooseData // 接收选中的数据
      if (!isEmpty(chooseData)) { // 判断是否为空
        if (this.currentType === 'CUX_ERP_EAM_SPEC_TYPE') {
          this.buildDetail.taskBuildingBillDto.btsMajorDesc = chooseData.meaning // 专业名称
          this.buildDetail.taskBuildingBillDto.btsMajor = chooseData.codeValue // 专业code
        }
        if (this.currentType === 'HAPPS_ZZM_LINE_NEW') {
          this.buildDetail.taskBuildingBillDto.linewayName = chooseData.description // 线路名称
          this.buildDetail.taskBuildingBillDto.linewayId = chooseData.flexId // 线路id
        }
        if (this.currentType === 'HAPPS_ZZM_DEPARTMENT') {
          this.buildDetail.taskBuildingBillDto.departmentName = chooseData.description // 部门名称
          this.buildDetail.taskBuildingBillDto.departmentId = chooseData.flexId // 部门id
        }
        this.$store.commit('handoverInventory/updateState', {key: 'chooseData', value: {}}) // 清空
      }
    }
    this.buildDetail.taskId = this.routerQuery.taskId
    this.buildDetail.taskNumber = this.routerQuery.taskNumber
  },
  methods: {
    async initBtsMajor () {
      console.log('this.routerQuery.taskId', this.routerQuery.taskId)
      let lineList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'taskId', this.routerQuery.taskId, 'linewayId', true) // 获取该任务下不同的lineId
      if (lineList.length !== 0) {
        await this.getDataIndexeddb(lineList, 'HAPPS_ZZM_LINE_NEW', ['codeType', 'flexId'], 'linewayItem') // 通过lineId在快码中匹配相应 的数据
      }
      let btsMajorList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'taskId', this.routerQuery.taskId, 'btsMajor', true) // 获取该任务下不同的专业code
      if (btsMajorList.length !== 0) {
        await this.getDataIndexeddb(btsMajorList, 'CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'], 'btsMajorItem')
      }
      console.log('btsMajorList', btsMajorList)
      this.buildDetail.taskBuildingBillDto.btsMajorDesc = this.btsMajorItem.meaning ? this.btsMajorItem.meaning : ''
      this.buildDetail.taskBuildingBillDto.btsMajor = this.btsMajorItem.codeValue ? this.btsMajorItem.codeValue : ''
      this.buildDetail.taskBuildingBillDto.linewayName = this.linewayItem.description ? this.linewayItem.description : ''
      this.buildDetail.taskBuildingBillDto.linewayId = this.linewayItem.flexId ? this.linewayItem.flexId : ''
    },
    async getDataIndexeddb (list, type, indexName, name) {
      let resultList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', indexName, [type, list[0]])
      this[name] = resultList[0]
    },
    /**
     * @description: 生成随机的标签编号
     * @param {type}
     * @return: Num 如果盘盈清单存在相同的则加一
     */
    async generateRandomTagNum () {
      try {
        let randomNum = Math.floor(Math.random(0, 1) * 1000000)
        let Num = 'F' + storage.get('empId') + randomNum
        let tagNumList = await indexeddb.cursorGetData(this.indexDB, 'buildList')
        let flag = tagNumList.filter(item => item.resultCode === '10').some(element => element.taskBuildingBillDto.tagNum === Num)
        if (flag) {
          // randomNum = randomNum + 1
          // this.buildDetail.taskBuildingBillDto.tagNum = 'F' + storage.get('empId') + randomNum
          // this.buildDetail.tagNum = 'F' + storage.get('empId') + randomNum
          // return
          this.generateRandomTagNum()
          return
        }
        this.buildDetail.taskBuildingBillDto.tagNum = Num
        this.buildDetail.tagNum = Num
      } catch (err) {
        throw new Error(err)
      }
    },
    async getFastCode (codeType) {
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
          this.resultList = list.filter(ele => ele.label !== '盘盈')
        }
        if (codeType === 'CUX.BT.OTHER_PROBLEM') { // 盘点结果
          this.specificIssuesList = list
        }
      } catch (err) {
        console.log(err)
      }
    },
    selectChange (selectObj, title, keyName) { // 更新select组件的值
      this.buildDetail[keyName] = selectObj.value
      if (keyName === 'specificIssues') {
        this.buildDetail.specificIssuesDesc = selectObj.label
      }
    },
    updateInput (val, key) {
      if (key === 'tagNum' || key === 'instanceDescription' || key === 'unitOfMeasure' || key === 'projectScaleCompleted' || key === 'comments') {
        this.buildDetail[key] = val
        this.buildDetail.taskBuildingBillDto[key] = val
      } else {
        this.buildDetail[key] = val
      }
    },
    goSearch (type, indexName) {
      this.currentType = type
      this.$router.push({
        name: 'HandSearch',
        query: {
          type,
          indexName,
          buildFlag: true,
          taskId: this.routerQuery.taskId,
        },
      })
    },
    async save () {
      console.log('this.buildDetail', this.buildDetail)
      if (!this.buildDetail.inventoryTurn) {
        this.$hips.toast('需填写盘点轮次')
        return
      }
      let updateSuccess = await indexeddb.addData(this.indexDB, 'buildList', this.buildDetail) // 新增清单数据到indexedDB buildList表中
      updateSuccess ? this.$hips.toast('新增成功！') : this.$hips.toast('新增失败！')
      this.$router.backPage()
    },
    cancel () {
      this.buildDetail = {
        taskId: '',
        taskNumber: '',
        changeFlag: 1,
        comments: '', // 备注
        inventoryPersonNum: '',
        inventoryTurn: '', // 盘点轮次
        resultBillId: '',
        'resultCode': '10', // 盘点结果
        'resultStatus': '20', // 盘点状态
        'specificIssues': '', // 其他问题
        'specificIssuesDesc': '', // 其他问题
        tagNum: '', // 标签编号
        inventoryObject: '30', // 房建
        taskBuildingBillDto: {
          tagNum: '',
          instanceDescription: '', // 房建名称
          unitOfMeasure: '', // 计量单位
          projectScaleCompleted: '', // 竣工工程规模
          linewayName: '', // 线路名称
          linewayId: '', // 线路id
          btsMajorDesc: '', // 专业
          btsMajor: '', // 专业CODE
          departmentName: '', // 部门
          departmentId: '', // 部门id
          faCategoryDesc: '', // 固定资产目录
          faNameDesc: '', // 固定资产名称
        },
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
            taskId: vm.routerQuery.taskId,
            tagNum: 'null00024286',
          },
        })
      }
    },
    async printTag () { // 打印标签
      // 登录成功回调
      window.bridgeLoginSuccess = function (str) {
        const res = JSON.parse(str)
        console.log('登录返回', JSON.stringify(res))
      }
      // 登录失败回调
      window.bridgeLoginFailure = function (res) {
        console.error(res)
      }
      let task = await indexeddb.cursorGetDataByIndex(this.indexDB, 'taskSummary', 'taskId', this.routerQuery.taskId) // 获取当前taskId下的任务名称
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
>>>.font-override{
  div {
    color black
    p{
      color black
    }
  }
}

>>>.hips-view__content{
    background-color #fafafa
}

.task-asset-contain {
  padding: 5px 15px 10px 15px;
  background-color: #fafafa;
  .inner-contain {
    border 1px solid #DDDDCC
    border-radius 10px
    padding 5px 0px 0px 10px
    background-color #fff
  }
}

.button {
  // display: flex;
  padding: 10px 0;

  .hips-button {
    background-color: #2896ff !important;
    // flex: 1;
    margin-right: 15px;
  }

  .hips-button:last-child {
    margin-right: 0;
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
