<template>
  <hips-view
    @scroll.native="scrollEvent"
  >
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="盘点信息"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="content">
      <div id="contentDiv">
        <select-item
          title="盘点状态"
          keyName="resultStatus"
          :selctValue="inventoryDetail.resultStatus"
          :isDisable="inventoryDetail.resultCode === '10'"
          :options="checkstateList|limitrResultStatus"
          @selectChange="selectChange"
        />
        <SelectItem
          title="盘点轮次"
          keyName="inventoryTurn"
          :selctValue="inventoryDetail.inventoryTurn"
          :options="roundsList"
          @selectChange="selectChange"
        />
        <SelectItem
          title="盘点结果"
          keyName="resultCode"
          :selctValue="inventoryDetail.resultCode === '50' ? '' : inventoryDetail.resultCode"
          :options="resultList.filter(ele => {if(scopeFromName !== 'NoInventoryDetail'){return ele.value !== '50' && ele.value !=='10' && ele.value !== '70'}else{return ele.value !=='10' && ele.value !== '70'}})"
          :isDisable="inventoryDetail.resultCode === '70' || inventoryDetail.resultCode === '10'"
          @selectChange="selectChange"
        />
        <div>
          <PItem v-if="showHap || showProblem" title="标签编号" :value="deviceBill.tagNum" />
          <input-item
            v-if="showProblem"
            keyVal="tagNumIssues"
            title="标签编号问题"
            :value="inventoryDetail.tagNumIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="固定资产名称" :value="deviceBill.faNameDesc" />
          <input-item
            v-if="showProblem"
            keyVal="faIssues"
            title="固定资产名称问题"
            :value="inventoryDetail.faIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="组合码/层级码" :value="`${deviceBill.combineCode ? deviceBill.combineCode : ''}${deviceBill.hierarchicalCode ? '/' + deviceBill.hierarchicalCode : ''}`" />
          <input-item
            v-if="showProblem"
            keyVal="combineIssues"
            title="组合码/层级码问题"
            :value="inventoryDetail.combineIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="设备名称" :value="deviceBill.instanceDescription" />
          <input-item
            v-if="showProblem"
            keyVal="deviceNameIssues"
            title="设备名称问题"
            :value="inventoryDetail.deviceNameIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="规格型号" :value="deviceBill.specification" />
          <input-item
            v-if="showProblem"
            keyVal="specificationIssues"
            title="规格型号问题"
            :value="inventoryDetail.specificationIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="计量单位" :value="deviceBill.unitOfMeasure" />
          <input-item
            v-if="showProblem"
            keyVal="unitIssues"
            title="计量单位问题"
            :value="inventoryDetail.unitIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="安装（存放）地点" :value="deviceBill.locationCode" />
          <input-item
            v-if="showProblem"
            keyVal="locationIssues"
            title="安装（存放）地点问题"
            :value="inventoryDetail.locationIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="资产状态" :value="deviceBill.objectStatus" />
          <input-item
            v-if="showProblem"
            keyVal="objectStatusIssues"
            title="资产状态问题"
            :value="inventoryDetail.objectStatusIssues"
            @updateInput="updateInput"
          />

          <PItem v-if="showHap || showProblem" title="资产性质" :value="deviceBill.objectNature" />
          <input-item
            v-if="showProblem"
            keyVal="objectNatureIssues"
            title="资产性质问题"
            :value="inventoryDetail.objectNatureIssues"
            @updateInput="updateInput"
          />
          <!-- <PItem v-if="showHap || showProblem" title="备注" :value="deviceBill.comments" /> -->
          <input-item
            v-if="showProblem"
            keyVal="conclusion"
            title="盘点结论"
            :value="inventoryDetail.conclusion"
            @updateInput="updateInput"
          />
        </div>
        <input-item
          v-if="showProblem || showLoss"
          keyVal="quantityIssues"
          title="数量问题"
          :value="inventoryDetail.quantityIssues"
          @updateInput="updateInput"
        />
        <input-item
          v-if="showProblem || showLoss || showNum||showOther"
          keyVal="actualQuantity"
          title="实盘数量"
          :typeNum="true"
          :disableFlag="isShow"
          :value="inventoryDetail.actualQuantity"
          @updateInput="updateInput"
        />
        <input-item
          v-if="showProblem || showComment || showOther || showLoss || showNum"
          class="border-bot"
          keyVal="resultComments"
          title="盘点备注"
          :value="inventoryDetail.resultComments"
          @updateInput="updateInput"
        />
        <input-item
          v-if="showProblem || showComment || showOther || showLoss || showNum"
          class="machecial"
          keyVal="machecial"
          title="设备名称"
          :value="inventoryDetail.instanceDescription"
          @updateInput="updateInput"
        />
        <SelectItem
          v-if=" showProblem || showOther"
          title="其他问题"
          keyName="specificIssues"
          :selctValue="inventoryDetail.specificIssues"
          :options="specificIssuesList"
          @selectChange="selectChange"
        />
        <div class="footer">
          <div @click="operate('cancel')">取消</div>
          <div class="chosse" @click="operate('confirm')">确定</div>
        </div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
import InputItem from '../../../components/input-item'
import SelectItem from '../../../components/select-item'
import PItem from '../../../components/p-item'
import { indexeddb } from '../../../utils'
import { autoKeyboardHeight } from '@/utils'
var fromName
export default {
  name: 'EditInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    InputItem,
    SelectItem,
    PItem,
  },
  filters: {
    limitrResultStatus (list) {
      list.forEach((ele, index) => {
        if (fromName === 'NoInventoryDetail' && ele.value === '20') { list.splice(index, 1) }
        if (fromName === 'ScanInventoryDetail' && ele.value === '30') { list.splice(index, 1) }
      })
      return list
    },
  },
  data () {
    return {
      routerQuery: {}, // 路由信息
      indexDB: {}, // 数据库实例
      deviceList: [], // 设备列表
      inventoryDetail: {}, // 清单信息
      deviceBill: {}, // 清单基本信息
      resultList: [], // 快码-盘点结果list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [], // 快码-盘点轮次list
      specificIssuesList: [], // 快码-其他问题list
      currentIndex: null, // 当前索引值
      currentType: {}, // 当前类型
      showProblem: false,
      showHap: false,
      showComment: false,
      showOther: false,
      showLoss: false,
      showNum: false,
      scopeFromName: '',
      isShow:true
    }
  },
  watch: {
    'inventoryDetail.resultCode': {
      handler (val, oldVal) {
        val === '' ? this.showHap = true : this.showHap = false // 盘点结果为空
        val === '40' ? this.showProblem = true : this.showProblem = false // 盘点结果为属性差异
        val === '50' ? this.showComment = true : this.showComment = false // 盘点结果为账实相符或条码丢损时
        val === '60' ? this.showOther = true : this.showOther = false // 盘点结果其他
        val === '20' ? this.showLoss = true : this.showLoss = false // 盘点结果盘亏
        val === '30' ? this.showNum = true : this.showNum = false // 盘点结果为账实相符或条码丢损时
        // this.clear()
        let elementList
        this.$nextTick(function () {
          elementList = document.querySelectorAll('.input') // 获取所有的弹出框DOM
          elementList.forEach(element => {
            autoKeyboardHeight(element, document.querySelector('#contentDiv'), this)
          })
        })
      },
      immediate: true,
    },
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  async mounted () {
    this.scopeFromName = fromName
    this.indexDB = this.$store.state.handoverInventory.indexDB
    await this.getFastCode() // 获取快码信息
    this.inventoryDetail = JSON.parse(JSON.stringify(this.$route.query.inventoryDetail))
    // console.log(this.inventoryDetail)
    this.deviceBill = this.inventoryDetail.taskDeviceBillDto // 清单基本信息
    this.$watch('inventoryDetail.resultCode', this.clear) // 监听盘点结果
    if (this.deviceBill.inspectionQuantity === this.deviceBill.installationQuantity && this.deviceBill.inspectionQuantity === this.deviceBill.conItemQuantity) {
      if (!this.inventoryDetail.actualQuantity && this.inventoryDetail.actualQuantity !== 0) {
        this.inventoryDetail.actualQuantity = this.deviceBill.inspectionQuantity
      }
    }
    this.inventoryDetail.instanceDescription = this.deviceBill.instanceDescription
    let elementList
    this.$nextTick(function () {
      elementList = document.querySelectorAll('.input') // 获取所有的弹出框DOM
      elementList.forEach(element => {
        autoKeyboardHeight(element, document.querySelector('#contentDiv'), this)
      })
    })
  },
  methods: {
    scrollEvent () { // 监听popup滚动，将选择框隐藏
      let elementList
      elementList = document.querySelectorAll('.el-select-dropdown') // 获取所有的弹出框DOM
      elementList.forEach(element => {
        if (element.style.display !== 'none') { // 判断弹出框是否显示
          element.style.display = 'none' // 将已显示的弹出框隐藏
        }
      })
    },
    selectChange (selectObj, title, keyName) { // 更新select组件的值
      console.log(selectObj.label)
      if (selectObj.label === "账实相符") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      this.inventoryDetail[keyName] = selectObj.value
      if (title === '其他问题') {
        this.inventoryDetail.specificIssuesDesc = selectObj.label // 其他问题描述
      }
    },
    updateInput (val, key) { // 更新input框的值
      this.inventoryDetail[key] = val
      console.log(val,key)
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
    clear () {
      this.inventoryDetail.tagNumIssues = ''
      this.inventoryDetail.faIssues = ''
      this.inventoryDetail.combineIssues = ''

      this.inventoryDetail.deviceNameIssues = ''
      this.inventoryDetail.specificationIssues = ''
      this.inventoryDetail.unitIssues = ''

      this.inventoryDetail.locationIssues = ''
      this.inventoryDetail.objectStatusIssues = ''
      this.inventoryDetail.objectNatureIssues = ''

      this.inventoryDetail.conclusion = ''
      this.inventoryDetail.quantityIssues = ''
      this.inventoryDetail.actualQuantity = ''

      this.inventoryDetail.resultComments = ''
      // this.inventoryDetail.resultComments = this.inventoryDetail.instanceDescription
      // console.log(this.inventoryDetail)
      this.inventoryDetail.specificIssues = ''
      this.inventoryDetail.specificIssuesDesc = ''

      if (this.showProblem || this.showLoss || this.showNum) {
        if (this.deviceBill.inspectionQuantity === this.deviceBill.installationQuantity && this.deviceBill.inspectionQuantity === this.deviceBill.conItemQuantity) {
          if (!this.inventoryDetail.actualQuantity && this.inventoryDetail.actualQuantity !== 0) {
            this.inventoryDetail.actualQuantity = this.deviceBill.inspectionQuantity
          }
        }
      }
    },
    async operate (val) { // 盘点信息取消/确认事件
      if (val === 'confirm') {
        if (!this.inventoryDetail.resultStatus) {
          this.$hips.toast('需填写盘点状态')
          return
        }

        if (!this.inventoryDetail.inventoryTurn) {
          this.$hips.toast('需填写盘点轮次')
          return
        }

        if (!this.inventoryDetail.resultCode) {
          this.$hips.toast('需填写盘点结果')
          return
        }
        if (this.inventoryDetail.resultCode === '40' || this.inventoryDetail.resultCode === '30' || this.inventoryDetail.resultCode === '20') {
          if (!this.inventoryDetail.actualQuantity) {
            this.$hips.toast('需填写有效的实盘数量')
            return
          }
        }
        this.inventoryDetail.changeFlag = 1
        let updateSuccess = await indexeddb.updateData(this.indexDB, 'deviceList', this.inventoryDetail) // 更新清单数据到indexedDB deviceList表中
        if (updateSuccess) {
          this.$hips.toast('保存成功！')
          this.$router.backPage()
        } else {
          this.$hips.toast('保存失败！')
        }
      } else {
        this.$router.backPage()
      }
    },
    async getFastCode () { // 获取快码值 盘点状态 盘点轮次 盘点结果
      let roundsList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_ROUNDS') // 获取盘点轮次快码值
      let checkstateList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT_STATE') // 获取盘点状态快码值
      let resultList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.CHECK_RESULT') // 获取盘点结果快码值
      let specificIssuesList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', 'CUX.BT.OTHER_PROBLEM') // 获取其他问题快码值
      this.transte(roundsList, 'roundsList') // 盘点轮次
      this.transte(checkstateList, 'checkstateList') // 盘点状态
      this.transte(resultList, 'resultList') // 盘点结果
      this.transte(specificIssuesList, 'specificIssuesList') // 其他问题
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view{
  background #fafafa!important
  .hips-nav-bar__theme-default{
    border-bottom 1px solid #eee
  }
}
.content{
  padding-left 10px
  margin 10px
  background #fff
  border-radius 15px
  .machecial{
    border-bottom 1px solid #ccc
  }
}
.footer{
  display flex
  height 48px
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
