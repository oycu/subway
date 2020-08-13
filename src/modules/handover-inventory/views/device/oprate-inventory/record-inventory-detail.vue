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
      title="盘盈信息"
      @nav-bar-back-click="goBack"
    />
    <div class="content" style="height:calc(100vh - 50px)">
      <!-- <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[allInventoryList]"
        @pulling-up="loadMore"
      > -->
      <div id="contentDiv" ref="contentDiv" class="contentDiv">
        <select-item
          title="盘点状态"
          keyName="resultStatus"
          :selctValue="inventoryDetail.resultStatus"
          :options="checkstateList"
          :isDisable="true"
          @selectChange="selectChange"
        />
        <SelectItem
          title="盘点轮次"
          keyName="inventoryTurn"
          :selctValue="inventoryDetail.inventoryTurn"
          :options="roundsList"
          :isDisable="selectDisable"
          @selectChange="selectChange"
        />
        <SelectItem
          title="盘点结果"
          keyName="resultCode"
          :selctValue="inventoryDetail.resultCode"
          :options="resultList"
          :isDisable="true"
          @selectChange="selectChange"
        />
        <input-item
          keyVal="taskDeviceBillDto.tagNum"
          title="标签编号"
          :value="inventoryDetail.taskDeviceBillDto.tagNum"
          :disableFlag="true"
          @updateInput="updateInput"
        />

        <input-item
          keyVal="taskDeviceBillDto.combineCode"
          title="组合码"
          :value="inventoryDetail.taskDeviceBillDto.combineCode"
          @updateInput="updateInput"
        />
        <input-item
          keyVal="taskDeviceBillDto.hierarchicalCode"
          title="层级码"
          :value="inventoryDetail.taskDeviceBillDto.hierarchicalCode"
          @updateInput="updateInput"
        />

        <SuggestInput
          keyVal="taskDeviceBillDto.instanceDescription"
          title="设备名称"
          :value="inventoryDetail.taskDeviceBillDto.instanceDescription"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="taskDeviceBillDto.specification"
          title="规格型号"
          :value="inventoryDetail.taskDeviceBillDto.specification"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="taskDeviceBillDto.manufacturer"
          title="制造商"
          :value="inventoryDetail.taskDeviceBillDto.manufacturer"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="taskDeviceBillDto.unitOfMeasure"
          title="计量单位"
          :value="inventoryDetail.taskDeviceBillDto.unitOfMeasure"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="actualQuantity"
          title="实盘数量"
          :typeNum="true"
          :value="inventoryDetail.actualQuantity"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="taskDeviceBillDto.locationCode"
          title="安装（存放）地点"
          :value="inventoryDetail.taskDeviceBillDto.locationCode"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="taskDeviceBillDto.objectStatus"
          title="资产状态"
          :value="inventoryDetail.taskDeviceBillDto.objectStatus"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="taskDeviceBillDto.objectNature"
          title="资产性质"
          :value="inventoryDetail.taskDeviceBillDto.objectNature"
          @updateInput="updateInput"
        ></SuggestInput>

        <SuggestInput
          keyVal="resultComments"
          title="盘点备注"
          :value="inventoryDetail.resultComments"
          @updateInput="updateInput"
        ></SuggestInput>
        <cell-item
          title="线路"
          :value="inventoryDetail.taskDeviceBillDto.linewayName ? inventoryDetail.taskDeviceBillDto.linewayName:'请选择线路'"
          @click.native="goSearch('HAPPS_ZZM_LINE_NEW', ['codeType', 'flexId'])"
        />
        <cell-item
          title="专业"
          :value="inventoryDetail.taskDeviceBillDto.btsMajorDesc ? inventoryDetail.taskDeviceBillDto.btsMajorDesc:'请选择专业'"
          @click.native="goSearch('CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'])"
        />
        <cell-item
          class="border-bot"
          title="部门"
          :value="inventoryDetail.taskDeviceBillDto.departmentName ? inventoryDetail.taskDeviceBillDto.departmentName:'请选择部门'"
          @click.native="goSearch('HAPPS_ZZM_DEPARTMENT')"
        />
        <SelectItem
          class="border-bot"
          title="其他问题"
          keyName="specificIssues"
          :selctValue="inventoryDetail.specificIssues"
          :options="specificIssuesList"
          @selectChange="selectChange"
        />
        <div class="foot">
          <div v-if="deleteFlag" @click="operate('delete')">删除</div>
          <div v-else @click="operate('cancel')">取消</div>
          <div class="chosse" @click="operate('confirm')">确定</div>
        </div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
import CellItem from '../../../components/cell-item'
import InputItem from '../../../components/input-item'
import SelectItem from '../../../components/select-item'
import SuggestInput from '../../../components/suggest-input'
import { indexeddb } from '../../../utils'
import { isEmpty, storage, autoKeyboardHeight } from '@/utils'
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
  name: 'RecordInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    CellItem,
    InputItem,
    SelectItem,
    SuggestInput,
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
      contentHeight: '100%',
      showPopup: false, // 控制显示盘点信息
      routerQuery: {}, // 路由参数
      selectDisable: false, // select组件是否可选
      resultList: [], // 快码-盘点结果list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [], // 快码-盘点轮次list
      specificIssuesList: [], // 快码-其他问题list
      currentType: '', // 当前类型
      currentIndex: null,
      currentEleIndex: null,
      deleteFlag: false, // 是否显示删除按钮
      allInventoryList: [], // 所有设备盘盈清单
      linewayItem: {}, // 线路信息
      btsMajorItem: {}, // 专业信息
      tagNumList: [],
      tagNum: '',
      refresh: true,
      inventoryDetail: { // 清单信息
        taskId: '', // 任务id
        taskNumber: '', // 任务编号
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
        local: true, // 本地新增盘盈
        father: false, // 父级标志
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
          // comments: '', // 备注
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
    // 解决ios中input框被遮挡问题
    let elementList
    elementList = document.querySelectorAll('.input') // 获取所有的弹出框DOM
    elementList.forEach(element => {
      autoKeyboardHeight(element, document.querySelector('#contentDiv'), this)
    })
  },
  async activated () {
    this.contentHeight = this.$refs.contentDiv.offsetHeight - 20 + 'px'
    this.indexDB = this.$store.state.handoverInventory.indexDB
    if (fromName === 'FunctionSelect' || fromName === 'StartRecordInventory') {
      await this.getFastCode() // 获取快码--盘点结果list、盘点状态list、盘点轮次list
      if (fromName === 'FunctionSelect') { // // 上一页面为功能选择页
        this.$store.commit('handoverInventory/updateState', {key: 'allInventoryList', value: []}) // 清空allInventoryList
        await this.generateRandomTagNum() // 自动生成tagNum
      }
      this.allInventoryList = this.$store.state.handoverInventory.allInventoryList
      this.routerQuery = this.$route.query // 接收路由参数
      this.currentIndex = this.routerQuery.currentIndex // 当前index
      if (this.currentIndex || this.currentIndex === 0) { // 有currentIndex传过来
        this.inventoryDetail = this.allInventoryList[this.currentIndex] // 查看盘盈信息
        this.deleteFlag = true // 显示删除按钮
      } else {
        this.deleteFlag = false
        await this.getDefaultData() // 获取线路和专业的默认值
        if (this.routerQuery.tagNum) {
          this.tagNum = this.routerQuery.tagNum
        }
        this.clear() // 初始化盘盈信息--新增盘盈
      }
    }
    if (fromName === 'HandSearch') { // 上一页面为搜索页
      let chooseData = this.$store.state.handoverInventory.chooseData // 接收选中的数据
      if (!isEmpty(chooseData.codeType)) { // 判断是否为空
        if (this.currentType === 'CUX_ERP_EAM_SPEC_TYPE') {
          this.inventoryDetail.taskDeviceBillDto.btsMajorDesc = chooseData.meaning // 专业名称
          this.inventoryDetail.taskDeviceBillDto.btsMajor = chooseData.codeValue // 专业code
        }
        if (this.currentType === 'HAPPS_ZZM_LINE_NEW') {
          this.inventoryDetail.taskDeviceBillDto.linewayName = chooseData.description // 线路名称
          this.inventoryDetail.taskDeviceBillDto.linewayId = chooseData.flexId // 线路id
        }
        if (this.currentType === 'HAPPS_ZZM_DEPARTMENT') {
          this.inventoryDetail.taskDeviceBillDto.departmentName = chooseData.description // 部门名称
          this.inventoryDetail.taskDeviceBillDto.departmentId = chooseData.flexId // 部门id
        }
        this.$store.commit('handoverInventory/updateState', {key: 'chooseData', value: {}}) // 清空vuex数据
      }
    }
  },
  methods: {
    goBack () {
      this.$router.backPage()
    },
    loadMore () { // 上拉加载
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    scrollEvent () { // 监听popup滚动，将选择框隐藏
      let elementList
      elementList = document.querySelectorAll('.el-select-dropdown') // 获取所有的弹出框DOM
      elementList.forEach(element => {
        if (element.style.display !== 'none') { // 判断弹出框是否显示
          element.style.display = 'none' // 将已显示的弹出框隐藏
        }
      })
      // elementList = document.querySelectorAll('.el-autocomplete-suggestion') // 获取所有的弹出框DOM
      // elementList.forEach(element => {
      //   if (element.style.display !== 'none') { // 判断弹出框是否显示
      //     element.style.display = 'none' // 将已显示的弹出框隐藏
      //     element.style.position = 'none' // 将已显示的弹出框隐藏
      //     element.style.top = '0' // 将已显示的弹出框隐藏
      //     element.style.left = '0' // 将已显示的弹出框隐藏

      //     // element.style.z-index = '2160'
      //   }
      // })
    },
    goSearch (type, indexName) { // 搜索
      this.currentType = type // 当前选中的字段
      this.$router.push({ // 跳转到搜索页面
        name: 'HandSearch',
        query: {
          indexName,
          type,
          taskId: this.routerQuery.taskId,
        },
      })
    },
    selectChange (selectObj, title, keyName) { // 更新select组件的值
      this.inventoryDetail[keyName] = selectObj.value
      if (title === '其他问题') {
        this.inventoryDetail.specificIssuesDesc = selectObj.label
      }
    },
    updateInput (val, key) { // 更新input框的值
      if (key.indexOf('.') !== -1) { // key值含有.时
        let keyList = key.split('.')
        let keyOne = keyList[0]
        let keyTwo = keyList[1]
        this.inventoryDetail[keyOne][keyTwo] = val
      } else {
        this.inventoryDetail[key] = val
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
    clear () { // 初始化盘盈信息
      let father
      fromName === 'FunctionSelect' ? father = true : father = false
      this.inventoryDetail = {
        taskId: this.routerQuery.taskId,
        taskNumber: this.routerQuery.taskNumber,
        taskName: this.routerQuery.taskName,
        resultStatus: '20', // 盘点状态
        inventoryTurn: 'FIRST', // 盘点轮次
        resultCode: '10', // 盘点结果
        specificIssues: '', // 其他问题
        specificIssuesDesc: '', // 其他问题说明
        conclusion: '', // 盘点结论
        actualQuantity: '', // 实盘数量
        tagNum: this.tagNum, // 标签编号
        changeFlag: 1,
        inventoryObject: '10', // 设备
        local: true,
        father,
        resultComments: '', // 盘点备注
        taskDeviceBillDto: {
          tagNum: this.tagNum, // 标签编号
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
          // comments: '', // 备注
        },
      }
    },
    async operate (val) { // 盘点信息取消/确认事件
      let vm = this
      if (val === 'confirm') { // 确认按钮
        if (!this.inventoryDetail.inventoryTurn) {
          this.$hips.toast('需填写盘点轮次')
          return
        }
        let cloneInventoryDetail = JSON.parse(JSON.stringify(this.inventoryDetail))
        if (this.deleteFlag) { // 存在删除按钮，更新数据
          this.allInventoryList[this.currentIndex] = cloneInventoryDetail
        } else { // 不存在删除按钮，新增数据
          this.allInventoryList.push(cloneInventoryDetail)
        }
        if (this.routerQuery.addNode) { // 新增节点标志为true
          this.$router.backPage() // 返回
        } else { // 无新增节点标志
          this.$router.push({
            name: 'StartRecordInventory',
            query: this.routerQuery,
          })
        }
      }
      if (val === 'delete') { // 删除按钮
        if (this.inventoryDetail.father) {
          vm.$hips.dialog.confirm({
            content: '<p style="line-height:22px;font-size:16px">此项为父项，删除后，其下属子项会同时被删除。确认删除？</p>',
            okText: '是',
            cancelText: '否',
            closable: false,
            async onOk () { // 是
              this.$hips.toast('删除成功')
              vm.$router.go(-3)
            },
            onCancel () {
            },
          })
        } else {
          this.allInventoryList.splice(this.currentIndex, 1)
          this.$router.backPage()
        }
      }
      if (val === 'cancel') {
        this.$router.backPage()
      }
      this.$store.commit('handoverInventory/updateState', {key: 'allInventoryList', value: this.allInventoryList}) // 更新allInventoryList
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
    async getDefaultData () { // 获取线路和专业默认数据
      let lineList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'linewayId') // 获取该任务下不同的lineId
      if (lineList.length !== 0) {
        await this.getDataIndexeddb(lineList, 'HAPPS_ZZM_LINE_NEW', ['codeType', 'flexId'], 'linewayItem') // 通过lineId在快码中匹配相应 的数据
      }
      let btsMajorList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'btsMajor') // 获取该任务下不同的专业code
      if (btsMajorList.length !== 0) {
        await this.getDataIndexeddb(btsMajorList, 'CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'], 'btsMajorItem')
      }
      // let btsMajorList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', 'taskId', this.routerQuery.taskId, 'btsMajor') // 获取该任务下不同的专业code
      // console.log('btsMajorList', btsMajorList)
      // if (btsMajorList.length === 1) {
      //   await this.getDataIndexeddb(btsMajorList, 'CUX_ERP_EAM_SPEC_TYPE', ['codeType', 'codeValue'], 'btsMajorItem')
      // }
    },
    async getDataIndexeddb (list, type, indexName, name) {
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
  border-radius 15px
  overflow scroll
  .contentDiv{
    padding-left 10px
    background #fff
    margin 15px
  }
}
.border-bot{
  border-bottom 1px solid #ccc
}
.foot{
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
