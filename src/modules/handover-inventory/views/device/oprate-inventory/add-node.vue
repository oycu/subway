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
          :selctValue="addInventory.resultStatus"
          :options="checkstateList"
          :isDisable="true"
          @selectChange="selectAdd"
        />
        <SelectItem
          title="盘点轮次"
          keyName="inventoryTurn"
          :selctValue="addInventory.inventoryTurn"
          :options="roundsList"
          :isDisable="selectDisable"
          @selectChange="selectAdd"
        />
        <SelectItem
          title="盘点结果"
          keyName="resultCode"
          :selctValue="addInventory.resultCode"
          :options="resultList"
          :isDisable="true"
          @selectChange="selectAdd"
        />
        <input-item
          keyVal="taskDeviceBillDto.tagNum"
          title="标签编号"
          :disableFlag="true"
          :value="addInventory.taskDeviceBillDto.tagNum"
          @updateInput="updateAdd"
        />

        <input-item keyVal="taskDeviceBillDto.combineCode" title="组合码" :value="addInventory.taskDeviceBillDto.combineCode" @updateInput="updateAdd" />
        <input-item keyVal="taskDeviceBillDto.hierarchicalCode" title="层级码" :value="addInventory.taskDeviceBillDto.hierarchicalCode" @updateInput="updateAdd" />

        <input-item keyVal="taskDeviceBillDto.instanceDescription" title="设备名称" :value="addInventory.taskDeviceBillDto.instanceDescription" @updateInput="updateAdd" />

        <input-item keyVal="taskDeviceBillDto.specification" title="规格型号" :value="addInventory.taskDeviceBillDto.specification" @updateInput="updateAdd" />
        <input-item keyVal="taskDeviceBillDto.manufacturer" title="制造商" :value="addInventory.taskDeviceBillDto.manufacturer" @updateInput="updateAdd" />

        <input-item keyVal="taskDeviceBillDto.unitOfMeasure" title="计量单位" :value="addInventory.taskDeviceBillDto.unitOfMeasure" @updateInput="updateAdd" />
        <input-item
          keyVal="actualQuantity"
          title="实盘数量"
          :typeNum="true"
          :value="addInventory.actualQuantity"
          @updateInput="updateAdd"
        />

        <input-item keyVal="taskDeviceBillDto.locationCode" title="安装（存放）地点" :value="addInventory.taskDeviceBillDto.locationCode" @updateInput="updateAdd" />

        <input-item keyVal="taskDeviceBillDto.objectStatus" title="资产状态" :value="addInventory.taskDeviceBillDto.objectStatus" @updateInput="updateAdd" />

        <input-item keyVal="taskDeviceBillDto.objectNature" title="资产性质" :value="addInventory.taskDeviceBillDto.objectNature" @updateInput="updateAdd" />
        <input-item keyVal="resultComments" title="盘点备注" :value="addInventory.resultComments" @updateInput="updateAdd" />
        <cell-item
          title="线路"
          :value="addInventory.taskDeviceBillDto.linewayName ? addInventory.taskDeviceBillDto.linewayName:'请选择线路'"
          @click.native="goSearch('HAPPS_ZZM_LINE_NEW', ['codeType', 'flexId'])"
        />
        <cell-item
          title="专业"
          :value="addInventory.taskDeviceBillDto.btsMajorDesc ? addInventory.taskDeviceBillDto.btsMajorDesc:'请选择专业'"
          @click.native="goSearch('CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'])"
        />
        <cell-item
          title="部门"
          class="border-bot"
          :value="addInventory.taskDeviceBillDto.departmentName ? addInventory.taskDeviceBillDto.departmentName:'请选择部门'"
          @click.native="goSearch('HAPPS_ZZM_DEPARTMENT')"
        />
        <SelectItem
          class="border-bot"
          title="其他问题"
          keyName="specificIssues"
          :selctValue="addInventory.specificIssues"
          :options="specificIssuesList"
          @selectChange="selectAdd"
        />
        <div class="footer">
          <div v-if="updataFlag && addInventory.resultCode !== '10'" @click="operateAdd('delete')">删除</div>
          <div v-else @click="operateAdd('cancel')">取消</div>
          <div class="chosse" @click="operateAdd('confirm')">确定</div>
        </div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
import InputItem from '../../../components/input-item'
import SelectItem from '../../../components/select-item'
import CellItem from '../../../components/cell-item'
import { indexeddb } from '../../../utils'
import { isEmpty, autoKeyboardHeight } from '@/utils'
var fromName
export default {
  name: 'AddNode',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    InputItem,
    SelectItem,
    CellItem,
  },
  data () {
    return {
      routerQuery: {}, // 路由信息
      indexDB: {}, // 数据库实例
      deviceBill: {}, // 清单基本信息
      selectDisable: false, // select组件是否可选
      resultList: [], // 快码-盘点结果list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [], // 快码-盘点轮次list
      specificIssuesList: [], // 快码-其他问题list
      linewayItem: {}, // 默认线路信息
      btsMajorItem: {}, // 默认专业信息
      currentType: {}, // 当前类型
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
    }
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  mounted () {
    let elementList
    elementList = document.querySelectorAll('.input') // 获取所有的弹出框DOM
    elementList.forEach(element => {
      autoKeyboardHeight(element, document.querySelector('#contentDiv'), this)
    })
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    if (fromName === 'HandSearch') { // 上一页面为搜索页
      let chooseData = this.$store.state.handoverInventory.chooseData // 接收选中的数据
      if (!isEmpty(chooseData.codeType)) { // 判断是否为空
        if (this.currentType === 'CUX_ERP_EAM_SPEC_TYPE') {
          this.$set(this.addInventory.taskDeviceBillDto, 'btsMajorDesc', chooseData.meaning) // 专业名称
          this.$set(this.addInventory.taskDeviceBillDto, 'btsMajor', chooseData.codeValue) // 专业code
        }
        if (this.currentType === 'HAPPS_ZZM_LINE_NEW') {
          this.$set(this.addInventory.taskDeviceBillDto, 'linewayName', chooseData.description) // 线路名称
          this.$set(this.addInventory.taskDeviceBillDto, 'linewayId', chooseData.flexId) // 线路id
        }
        if (this.currentType === 'HAPPS_ZZM_DEPARTMENT') {
          this.$set(this.addInventory.taskDeviceBillDto, 'departmentName', chooseData.description) // 部门名称
          this.$set(this.addInventory.taskDeviceBillDto, 'departmentId', chooseData.flexId) // 部门id
        }
        this.$store.commit('handoverInventory/updateState', {key: 'chooseData', value: {}}) // 清空vuex数据
      }
    } else {
      this.routerQuery = this.$route.query
      await this.getFastCode() // 获取快码信息
      if (this.routerQuery.tagNum) {
        await this.getDefaultData()
        this.clear()
        this.updataFlag = false
      } else {
        this.addInventory = this.$route.query.addInventory
        this.updataFlag = true
      }
    }
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
    selectAdd (selectObj, title, keyName) { // 更新select组件的值（新增节点中）
      this.addInventory[keyName] = selectObj.value
      if (title === '其他问题') {
        this.addInventory.specificIssuesDesc = selectObj.label // 其他问题描述
      }
    },
    updateAdd (val, key) { // 更新input框的值（新增节点中）
      if (key.indexOf('.') !== -1) { // 含有两个层级
        let keyList = key.split('.')
        let keyOne = keyList[0]
        let keyTwo = keyList[1]
        this.addInventory[keyOne][keyTwo] = val
      } else {
        this.addInventory[key] = val
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
    clear () { // 初始化新增节点信息
      this.addInventory = {
        taskId: this.routerQuery.taskId,
        taskNumber: this.routerQuery.taskNumber,
        taskName: this.routerQuery.taskName, // 任务名称
        resultStatus: '20', // 盘点状态
        inventoryTurn: 'FIRST', // 盘点轮次
        resultCode: '70', // 盘点结果
        specificIssues: '', // 其他问题
        specificIssuesDesc: '', // 其他问题说明
        conclusion: '', // 盘点结论
        actualQuantity: '', // 实盘数量
        tagNum: this.routerQuery.tagNum, // 标签编号
        changeFlag: 1,
        inventoryObject: '10', // 设备
        local: true,
        resultComments: '', // 盘点备注
        taskDeviceBillDto: {
          tagNum: this.routerQuery.tagNum, // 标签编号
          combineCode: '', // 组合码
          hierarchicalCode: '', // 层级码
          instanceDescription: '', // 设备名称
          specification: '', // 规格型号
          manufacturer: '', // 制造商
          unitOfMeasure: '', // 计量单位
          locationCode: '', // 安装（存放）地点
          objectStatus: '', // 资产状态
          objectNature: '', // 资产性质
          linewayId: this.linewayItem.flexId ? this.linewayItem.flexId : '', // 线路id
          linewayName: this.linewayItem.description ? this.linewayItem.description : '', // 线路名称
          btsMajor: this.btsMajorItem.codeValue ? this.btsMajorItem.codeValue : '', // 专业CODE
          btsMajorDesc: this.btsMajorItem.meaning ? this.btsMajorItem.meaning : '', // 专业名称
          departmentId: '', // 部门id
          departmentName: '', // 部门名称
          comments: '', // 备注
        },
      }
    },
    goSearch (type, indexName) { // 搜索
      this.currentType = type

      this.$router.push({
        name: 'HandSearch',
        query: {
          indexName,
          type,
          taskId: this.routerQuery.taskId,
        },
      })
    },
    async operateAdd (val) {
      if (val === 'confirm') { // 确认按钮
        if (!this.addInventory.inventoryTurn) {
          this.$hips.toast('需填写盘点轮次')
          return
        }
        let updateSuccess
        if (this.updataFlag) { // 更新数据
          this.addInventory.changeFlag = 1 // 标记为已修改
          updateSuccess = await indexeddb.updateData(this.indexDB, 'deviceList', this.addInventory) // 更新清单数据到indexedDB deviceList表中
        } else { // 新增数据
          updateSuccess = await indexeddb.addData(this.indexDB, 'deviceList', this.addInventory) // 新增清单数据到indexedDB deviceList表中
        }
        if (updateSuccess) {
          this.routerQuery.NoInventoryFlag ? this.$hips.toast('保存成功,请在已盘点中查看！') : this.$hips.toast('保存成功！')
          this.$router.backPage()
        } else {
          this.$hips.toast('保存失败！')
        }
      }
      if (val === 'delete') { // 删除按钮
        if (this.addInventory.local) {
          let updateSuccess = await indexeddb.deleteData(this.indexDB, 'deviceList', this.addInventory.id) // 新增清单数据到indexedDB deviceList表中
          if (updateSuccess) {
            this.$hips.toast('删除成功！')
            this.$router.backPage()
          } else {
            this.$hips.toast('删除失败！')
          }
        } else {
          this.$hips.toast('已上传的数据不允许删除！')
        }
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
    async getDefaultData () { // 获取专业和部门默认的数据
      let lineList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'linewayId') // 获取该任务下不同的lineId
      if (lineList.length !== 0) {
        await this.getDataIndexeddb(lineList, 'HAPPS_ZZM_LINE_NEW', ['codeType', 'flexId'], 'linewayItem')
      }
      let btsMajorList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'btsMajor') // 获取该任务下不同的专业code
      if (btsMajorList.length !== 0) {
        await this.getDataIndexeddb(btsMajorList, 'CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'], 'btsMajorItem')
      }
    },
    async getDataIndexeddb (list, type, indexName, name) { // 获取满足条件的线路和专业的数据
      let resultList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', indexName, [type, list[0]]) // 获取该任务下标签编号为element的未盘点清单
      this[name] = resultList[0]
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
}
.border-bot{
  border-bottom 1px solid #ccc
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
