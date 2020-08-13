<!--
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-10-25 09:09:35
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 -->
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
      @nav-bar-back-click="goBack"
    >
      <div slot="right">
        <span style="margin-right:10px;">{{ userName }}</span><span style="margin-right:10px">{{ userNum }}</span>
      </div>
    </hips-nav-bar>
    <div>
      <div class="img">
        <img src="../assets/banner.png" alt="">
      </div>
      <!-- 两端对齐 -->
      <div class="mainRoute">
        <div
          v-for="(item, index) in routeList"
          :key="index"
          class="routePage"
          @click="toPage(index)"
        >
          <div class="pageDetail">
            <div class="left">
              <i class="iconfont" :class="item.icon"></i>
            </div>
            <p>{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Slide, SlideItem, Row, Col } from 'hips'
import { indexeddb } from '../utils'
import { storage, isEmpty } from '@/utils'

export default {
  name: 'Main',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Slide.name]: Slide,
    [SlideItem.name]: SlideItem,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  data () {
    return {
      routeList: [ // 模块列表
        {
          icon: 'icondownload',
          title: '下载任务',
          key: 'download',
        },
        {
          // img: require('../assets/img-default-avator.png'),
          icon: 'iconshangchuan',
          title: '数据回传',
          key: 'upload',
        },
        {
          icon: 'iconbianji',
          title: '开始盘点',
          key: 'start',
        },
        {
          icon: 'iconquerengongdan',
          title: '已盘任务',
          key: 'over',
        },
        {
          icon: 'iconshalou',
          title: '未盘任务',
          key: 'unstart',
        },
        {
          icon: 'iconico',
          title: '条码丢损',
          key: 'lost',
        },
      ],
      statusList: [], // 盘点状态
      checkRoundsList: [], // 盘点轮次
      resultList: [], // 盘点结果
      taskList: [], // 任务汇总
      professionList: [], // 专业
      specificIssuesList: [], // 其他问题列表
      lineList: [], // 线路
      taskDeviceBillList: [], // 设备任务清单
      taskBuildingBillList: [], // 房建任务清单
      currentIndex: 0,
      indexDB: {},
      deviceList: [], // 已修改的设备清单
      allBillList: [], // 所有已修改的清单数据
      departmentList: [], // 部门列表
      userName: storage.get('userName'),
      userNum: storage.get('empId') + '',
      objStore: [
        { // 值级
          name: 'fastCode', // 表名称-快码值表
          indexList: [
            {
              indexKeyName: 'codeType', // 索引名
              indexKey: 'codeType', // 索引值
            },
            {
              indexKeyName: ['codeType', 'codeValue'], // 索引名
              indexKey: ['codeType', 'codeValue'], // 索引值
            },
            {
              indexKeyName: ['codeType', 'flexId'], // 索引名
              indexKey: ['codeType', 'flexId'], // 索引值
            },
          ],
        },
        { // 表名称--任务汇总表
          name: 'taskSummary', // 表名称--任务汇总表
          indexList: [
            {
              indexKeyName: 'taskId', // 索引名
              indexKey: 'taskId', // 索引值
            },
          ],
        },
        { // 表名称-设备清单表
          name: 'deviceList', // 表名称-设备清单表
          indexList: [
            {
              indexKeyName: 'taskId',
              indexKey: 'taskId',
            },
            {
              indexKeyName: 'changeFlag', // 索引名
              indexKey: 'changeFlag', // 索引值,数据是否改变
            },
            {
              indexKeyName: ['taskId', 'tagNum'], // 索引名
              indexKey: ['taskId', 'tagNum'], // 索引值，根据 taskId和tagNum-标签编号 匹配扫描盘点信息
            },
            {
              indexKeyName: ['taskId', 'resultStatus'], // 索引名
              indexKey: ['taskId', 'resultStatus'], // 索引值，根据 taskId 和 resultStatus-盘点状态 筛选未盘点信息
            },
            {
              indexKeyName: ['taskId', 'resultStatus', 'resultCode'], // 索引名
              indexKey: ['taskId', 'resultStatus', 'resultCode'], // 索引值，根据 taskId和resultStatus-盘点状态 和 resultCode-盘点结果 筛选已盘点四种状态信息
            },
            {
              indexKeyName: ['taskId', 'resultStatus', 'tagNum'], // 索引名
              indexKey: ['taskId', 'resultStatus', 'tagNum'], // 索引值，根据 taskId和resultStatus-盘点状态 和 resultCode-盘点结果 tagNum-标签编号 筛选同一套设备已盘点四种状态信息
            },
            {
              indexKeyName: ['taskId', 'resultStatus', 'resultCode', 'tagNum'], // 索引名
              indexKey: ['taskId', 'resultStatus', 'resultCode', 'tagNum'], // 索引值，根据 taskId和resultStatus-盘点状态 和 resultCode-盘点结果 筛选同一套设备已盘点四种状态信息
            },
          ],
        },
        { // 表名称-房建清单表
          name: 'buildList', // 表名称-房建清单表
          indexList: [
            {
              indexKeyName: ['taskId', 'tagNum'],
              indexKey: ['taskId', 'tagNum'],
            },
            {
              indexKeyName: 'taskId',
              indexKey: 'taskId',
            },
            {
              indexKeyName: 'changeFlag',
              indexKey: 'changeFlag',
            },
            {
              indexKeyName: 'tagNum',
              indexKey: 'tagNum',
            },
            { // 根据盘点状态和盘点结果搜索taskId下的已盘点、未盘点信息
              indexKeyName: 'SingleTaskId',
              indexKey: ['resultStatus', 'resultCode', 'taskId'],
            },
            { // 根据盘点状态搜索taskId下的已盘点、未盘点信息
              indexKeyName: 'StatusTaskId',
              indexKey: ['resultStatus', 'taskId'],
            },
          ],
        },
      ],
      modeFlag: false, // 模式 true为在线 false为离线
    }
  },
  async mounted () {
    let vm = this
    this.indexDB = await indexeddb.openDB('inventoryDB', 1, this.objStore)
    this.$store.commit('handoverInventory/updateState', {key: 'indexDB', value: this.indexDB}) // 更新到vuex中
    this.userName = storage.get('userName')
    this.userNum = storage.get('empId') + ''
    let lastUserNum = storage.get('lastEmpId') + ''
    console.log('lastUserNum', lastUserNum)
    if (isEmpty(lastUserNum)) {
      storage.set('lastEmpId', this.userNum)
    } else if (lastUserNum !== this.userNum) {
      console.log('用户切换')
      vm.allBillList = []
      vm.buildList = await indexeddb.cursorGetDataByIndex(vm.indexDB, 'buildList', 'changeFlag', 1) // 已修改的房建清单
      vm.deviceList = await indexeddb.cursorGetDataByIndex(vm.indexDB, 'deviceList', 'changeFlag', 1) // 已修改的设备清单
      vm.allBillList = vm.buildList.concat(vm.deviceList) // 所有已修改的清单数据
      if (vm.allBillList.length !== 0) {
        vm.$hips.dialog.confirm({
          content: '<p style="line-height:22px;font-size:16px">检测到用户切换，是否清除上一用户的数据？</p>',
          okText: '是',
          cancelText: '否',
          closable: false,
          async onOk () {
            storage.set('lastEmpId', this.userNum)
            vm.restartIndexedDB()
          },
          onCancel () {
            vm.goBack()
          },
        })
      } else {
        storage.set('lastEmpId', this.userNum)
        vm.restartIndexedDB()
      }
    }
    this.$hips.dialog.confirm({
      content: '<p style="line-height:22px;font-size:16px">请选择模式</p>',
      okText: '离线模式',
      cancelText: '在线模式',
      closable: false,
      async onOk () {
        console.log('离线')
        vm.modeFlag = false
      },
      async onCancel () {
        console.log('在线')
        vm.modeFlag = true
        vm.routeList.shift()
        vm.toPage(-1)
      },
    })
  },
  async activated () {
    this.$store.commit('handoverInventory/updateState', {key: 'indexDB', value: this.indexDB}) // 更新到vuex中
  },
  methods: {
    async toPage (index) {
      let vm = this
      if (this.modeFlag) { // 在线
        index = index + 1
      }
      console.log('index', index)
      if (index !== 0 && index !== 1) { // 开始盘点/已盘任务/未盘任务/条码丟损模块
        // 判断是否有任务，否则提示用户下载任务
        this.$router.push({ // 跳转到任务汇总页
          name: 'TaskSummary',
          query: {
            index: index,
          },
        })
      } else {
        vm.allBillList = []
        vm.buildList = await indexeddb.cursorGetDataByIndex(vm.indexDB, 'buildList', 'changeFlag', 1) // 已修改的房建清单
        vm.deviceList = await indexeddb.cursorGetDataByIndex(vm.indexDB, 'deviceList', 'changeFlag', 1) // 已修改的设备清单
        vm.allBillList = vm.buildList.concat(vm.deviceList) // 所有已修改的清单数据
        console.log('vm.allBillList', vm.allBillList)
        if (vm.allBillList.length !== 0) {
          if (index === 0) { // 下载数据
            vm.$hips.dialog.confirm({
              content: '<p style="line-height:22px;font-size:16px">将会覆盖当前数据，是否先回传本地数据？</p>',
              okText: '是',
              cancelText: '否',
              closable: false,
              onOk () { // 是
                vm.$hips.dialog.confirm({
                  content: '<p style="line-height:22px;font-size:16px">确认回传？</p>',
                  okText: '是',
                  cancelText: '否',
                  closable: false,
                  onOk () {
                    // 回传数据
                    vm.currentIndex = 0
                    vm.uploadCheckTask(vm.allBillList[0])
                  },
                  onCancel () {
                  },
                })
              },
              async onCancel () { // 否
                console.log('vm.modeFlag', vm.modeFlag)
                if (vm.modeFlag) { // 在线模式
                  await vm.restartIndexedDB()
                  vm.$hips.indicator.show({
                    text: '数据加载中...',
                  })
                  storage.set('resultStatus', null)
                  vm.downLoadToIndexedDb('数据加载成功！', '数据加载失败！')
                } else { // 离线模式
                  vm.confirmDownLoad() // 下载数据
                }
                // vm.confirmDownLoad() // 下载数据
              },
            })
          }
          if (index === 1) {
            vm.$hips.dialog.confirm({
              content: '<p style="line-height:22px;font-size:16px">确认回传？</p>',
              okText: '是',
              cancelText: '否',
              closable: false,
              async onOk () {
                // 回传数据
                vm.currentIndex = 0
                vm.uploadCheckTask(vm.allBillList[0])
              },
              onCancel () {
              },
            })
          }
        } else {
          console.log('index', index === 0)
          if (index === 0) {
            console.log('下载数据')
            if (this.modeFlag) { // 在线模式
              await vm.restartIndexedDB()
              vm.$hips.indicator.show({
                text: '数据加载中...',
              })
              storage.set('resultStatus', null)
              vm.downLoadToIndexedDb('数据加载成功！', '数据加载失败！')
            } else { // 离线模式
              vm.confirmDownLoad() // 下载数据
            }
          }
          if (index === 1) {
            vm.$hips.toast('暂无可上传的数据！')
          }
        }
      }
    },
    goBack () { // 退出子应用--调用原生方法返回
      cordova.exec(null, null, 'BridgePlugin', 'closeWebView', [])
    },
    async getTaskData () { // 获取任务列表
      let params = {
        'userName': this.userNum,
      }
      this.taskList = []
      try {
        let resp = await this.$store.dispatch('handoverInventory/getTaskDataApi', params)
        let transferTaskDtoList = resp.data.transferTaskLoadServiceResponse.return.transferTaskDtoList
        if (Array.isArray(transferTaskDtoList)) {
          this.taskList = transferTaskDtoList
        } else {
          this.taskList.push(transferTaskDtoList)
        }
        let taskKeyList = [
          'codeLossQuantity',
          'countMatchQuantity',
          'invProfitQuantity',
          'incLossQuantity',
          'invDiffQuantity',
        ]
        this.taskList.forEach(ele => {
          taskKeyList.forEach(element => {
            if (!(element in ele)) {
              this.$set(ele, element, '')
            }
          })
        })
      } catch (err) {
        this.$hips.toast(err)
        this.$hips.indicator.hide()
        throw new Error(err)
      }
    },
    async downloadCheckTask (item, resultStatus) { // 下载任务清单
      let params = {
        'inventoryObject': item.inventoryObject,
        'taskId': item.taskId,
        'taskNumber': item.taskNumber,
        'taskStatus': item.taskStatus,
      }
      if (storage.get('resultStatus')) {
        params.resultStatus = storage.get('resultStatus')
      }
      try {
        let resp = await this.$store.dispatch('handoverInventory/downloadCheckTaskApi', params)
        if (item.inventoryObjectDesc === '设备') { // 设备清单
          let deviceKeyList = [
            'actualQuantity', // 实盘数量
            'combineIssues', // 组合码/层级码问题
            'conclusion', // 盘点结论
            'deviceNameIssues', // 设备名称问题
            'faIssues', // 固定资产问题
            'inventoryPersonNum', // 盘点员
            'inventoryTurn', // 盘点轮次
            'locationIssues', // 安装存放地点问题
            'objectNatureIssues', // 资产性质问题
            'objectStatusIssues', // 资产状态问题
            'quantityIssues', // 数量问题
            'resultBillId', // 结果清单id
            'resultCode', // 盘点结果
            'resultId', // 结果id
            'resultStatus', // 盘点状态
            'specificIssues', // 其他问题
            'specificationIssues', // 规格型号问题
            'tagNumIssues', // 标签编号问题
            'unitIssues', // 计量单位问题
            'taskId', // 用作索引
            'inventoryObject', // 用作索引
            'taskNumber', // 用作索引
            'tagNum', // 用作索引
            'taskName', // 任务名称
            // 'id', // 用作索引
            'changeFlag', // 用作索引
            'specificIssuesDesc', // 其他问题说明
            'resultComments', // 盘点备注
          ]
          let getDeviceBillList = []
          let taskDeviceBillList = resp.data.transferTaskDetailLoadServiceResponse.return.taskDetailLoadDto.invDeviceResultList
          if (!isEmpty(taskDeviceBillList) && Array.isArray(taskDeviceBillList)) { // 判断接收数据是否为数组
            getDeviceBillList = taskDeviceBillList
          } else if (!isEmpty(taskDeviceBillList)) { // 对象
            getDeviceBillList.push(taskDeviceBillList)
          }
          getDeviceBillList.forEach((ele, index) => {
            deviceKeyList.forEach(element => {
              if (!(element in ele)) {
                this.$set(ele, element, '')
                if (element === 'resultStatus') {
                  ele[element] = '10'
                }
                if (element === 'changeFlag') {
                  ele[element] = 0
                }
              }
            })
            ele.taskId = item.taskId // 添加taskId
            ele.inventoryObject = item.inventoryObject
            ele.taskNumber = item.taskNumber
            ele.taskName = item.taskName
            ele.tagNum = ele.taskDeviceBillDto.tagNum
            // ele.id = item.taskId + '' + ele.taskDeviceBillDto.billId // 添加id = taskId + billId
            ele.changeFlag = 0 // 添加标志--数据是否改变
          })
          if (getDeviceBillList.length !== 0) {
            this.taskDeviceBillList = this.taskDeviceBillList.concat(getDeviceBillList) // 数据连接
          }
        }
        if (item.inventoryObjectDesc === '房建') { // 房建清单
          let buildingKeyList = [
            'conclusion', // 盘点结论
            'inventoryPersonNum', // 盘点员
            'inventoryTurn', // 盘点轮次
            'resultBillId', // 结果清单
            'resultCode', // 盘点结果
            'resultId', // 结果id
            'resultStatus', // 盘点状态
            'specificIssues', // 其他问题
            'taskId',
            'id',
            'changeFlag',
            // 'billId',
            'inventoryObject',
            'taskNumber',
            'tagNum',

          ]
          let getBuildBillList = []
          let taskBuildingBillList = resp.data.transferTaskDetailLoadServiceResponse.return.taskDetailLoadDto.invBuildingResultList

          if (!isEmpty(taskBuildingBillList) && Array.isArray(taskBuildingBillList)) { // 判断接收数据是否为数组
            getBuildBillList = taskBuildingBillList
          } else if (!isEmpty(taskBuildingBillList)) { // 对象
            getBuildBillList.push(taskBuildingBillList)
          }
          let BuildingBillDtoKeys = [ // taskBuildingBillDto中字段
            'faCategoryDesc',
            'faNameDesc',
            'instanceDescription',
            'btsMajorDesc',
          ]
          getBuildBillList.forEach((ele, index) => {
            buildingKeyList.forEach(element => {
              if (!(element in ele)) {
                this.$set(ele, element, '')
                if (element === 'resultStatus') {
                  ele[element] = '10'
                }
                if (element === 'changeFlag') {
                  ele[element] = 0
                }
              }
            })
            BuildingBillDtoKeys.forEach(element => {
              if (!(element in ele.taskBuildingBillDto)) {
                this.$set(ele.taskBuildingBillDto, element, '')
              }
            })
            ele.taskId = item.taskId // 添加taskId
            ele.id = item.taskId + '' + ele.taskBuildingBillDto.billId // 添加id = taskId + billId
            ele.changeFlag = 0 // 添加标志--数据是否改变
            ele.inventoryObject = item.inventoryObject // 房建/设备标识
            ele.taskNumber = item.taskNumber // 任务编号
            ele.taskName = item.taskName // 任务名称
            ele.tagNum = ele.taskBuildingBillDto.tagNum || '' // 标签编号
            ele.checkFlag = false // 批量标签打印时单选状态
            ele.faCategoryDesc = ele.taskBuildingBillDto.faCategoryDesc || '' // 固定资产目录
            ele.faNameDesc = ele.taskBuildingBillDto.faNameDesc || '' // 固定资产名称
            ele.instanceDescription = ele.taskBuildingBillDto.instanceDescription || '' // 房建/轨道名称
            ele.btsMajorDesc = ele.taskBuildingBillDto.btsMajorDesc || '' // 专业
          })
          if (getBuildBillList.length !== 0) {
            this.taskBuildingBillList = this.taskBuildingBillList.concat(getBuildBillList) // 数据连接
          }
        }
        this.currentIndex++
        if (this.taskList.length > this.currentIndex) { // 任务长度大于当前请求的次数
          await this.downloadCheckTask(this.taskList[this.currentIndex], resultStatus) // 请求下一个任务下的清单
        }
      } catch (err) {
        this.$hips.toast('数据加载失败！')
        throw new Error(err)
      }
    },
    async getCodeValue (codeType, model) { // 获取值列表
      let params = {
        codeType,
        model,
      }
      try {
        let resp = await this.$store.dispatch('handoverInventory/getCodeValueApi', params)
        let result
        if (model === 'CODE') {
          result = resp.data.mobileCodeValueLoadServiceResponse.return.sysCodeValueDto
        }
        if (model === 'LOV') {
          result = resp.data.mobileCodeValueLoadServiceResponse.return.sysLovValueDtos
          result.forEach(ele => {
            ele.codeType = codeType
          })
        }
        return result
      } catch (err) {
        this.$hips.toast('数据加载失败！')
        throw new Error(err)
      }
    },
    async downLoadToIndexedDb (sucMess, errMess) { // 下载数据
      try {
        await this.getTaskData() // 获取盘点任务
        this.statusList = await this.getCodeValue('CUX.BT.CHECK_RESULT_STATE', 'CODE') // 盘点状态
        this.checkRoundsList = await this.getCodeValue('CUX.BT.CHECK_ROUNDS', 'CODE') // 盘点轮次
        this.resultList = await this.getCodeValue('CUX.BT.CHECK_RESULT', 'CODE') // 盘点结果
        this.specificIssuesList = await this.getCodeValue('CUX.BT.OTHER_PROBLEM', 'CODE') // 其他问题列表
        this.professionList = await this.getCodeValue('CUX_ERP_EAM_SPEC_TYPE', 'CODE') // 专业
        this.lineList = await this.getCodeValue('HAPPS_ZZM_LINE_NEW', 'LOV') // 线路
        this.departmentList = await this.getCodeValue('HAPPS_ZZM_DEPARTMENT', 'LOV') // 部门

        this.taskDeviceBillList = [] // 设备清单列表
        this.taskBuildingBillList = [] // 房建任务清单
        this.currentIndex = 0
        await this.downloadCheckTask(this.taskList[this.currentIndex]) // 下载清单
        await indexeddb.addAll(this.indexDB, 'fastCode', this.statusList) // 快码表中添加盘点状态列表
        await indexeddb.addAll(this.indexDB, 'fastCode', this.checkRoundsList) // 快码表中添加盘点轮次列表
        await indexeddb.addAll(this.indexDB, 'fastCode', this.resultList) // 快码表中添加盘点结果列表
        await indexeddb.addAll(this.indexDB, 'fastCode', this.professionList) // 快码表中添加专业列表
        await indexeddb.addAll(this.indexDB, 'fastCode', this.lineList) // 快码表中添加线路列表
        await indexeddb.addAll(this.indexDB, 'fastCode', this.departmentList) // 快码表中添加部门列表
        await indexeddb.addAll(this.indexDB, 'fastCode', this.specificIssuesList) // 快码表中添加其他问题列表

        await indexeddb.addAll(this.indexDB, 'deviceList', this.taskDeviceBillList) // 设备订单表中添加数据

        await indexeddb.addAll(this.indexDB, 'buildList', this.taskBuildingBillList) // 房建表中添加数据
        this.currentIndex = 0

        await this.addTaskQuantity(this.taskList[this.currentIndex])
        await indexeddb.addAll(this.indexDB, 'taskSummary', this.taskList) // 任务表中添加盘点任务列表
        this.$hips.indicator.hide()
        this.$hips.toast(sucMess)
      } catch (err) {
        this.$hips.toast(errMess)
        this.$hips.indicator.hide()
        throw new Error(err)
      }
    },
    async uploadCheckTask (item) { // 上传接口
      let vm = this
      this.$hips.indicator.show({
        text: '数据上传中...',
      })
      let params
      if (item.inventoryObject === '10') { // 回传设备参数
        item.inventoryPersonNum = this.userNum
        let invDeviceResultList = {
          actualQuantity: item.actualQuantity,
          combineIssues: item.combineIssues,
          conclusion: item.conclusion,
          deviceNameIssues: item.deviceNameIssues,
          faIssues: item.faIssues,
          inventoryPersonNum: item.inventoryPersonNum,
          inventoryTurn: item.inventoryTurn,
          locationIssues: item.locationIssues,
          objectNatureIssues: item.objectNatureIssues,
          objectStatusIssues: item.objectStatusIssues,
          quantityIssues: item.quantityIssues,
          resultBillId: item.resultBillId,
          resultCode: item.resultCode,
          resultId: item.resultId,
          resultStatus: item.resultStatus,
          specificIssues: item.specificIssues,
          specificIssuesDesc: item.specificIssuesDesc,
          specificationIssues: item.specificationIssues,
          tagNumIssues: item.tagNumIssues,
          taskDeviceBillDto: item.taskDeviceBillDto,
          unitIssues: item.unitIssues,
          resultComments: item.resultComments,
        }
        this.removeEmptyAtrribute(invDeviceResultList)
        params = {
          taskDetailLoadDto: {
            invDeviceResultList: invDeviceResultList,
            inventoryObject: item.inventoryObject,
            taskId: item.taskId,
            taskNumber: item.taskNumber,
          },
          userId: this.userNum,
          userName: this.userName,
        }
        console.log('params', JSON.stringify(params))
      } else if (item.inventoryObject === '30') { // 回传房建参数
        item.inventoryPersonNum = this.userNum
        const {
          batchId = '',
          billId = '',
          btsMajorDesc = '',
          buildUnitPrice = '',
          comments = '',
          contractName = '',
          contractNumber = '',
          decorationUnitPrice = '',
          departmentName = '',
          faCategoryDesc = '',
          faNameDesc = '',
          instanceDescription = '',
          linewayId = '',
          linewayName = '',
          paTaskName = '',
          poolId = '',
          projectScaleCompleted = '',
          tagNum = '',
          txnNumber = '',
          unitOfMeasure = '',
          btsMajor = '', // 专业CODE
          departmentId = '', // 部门id
        } = item.taskBuildingBillDto
        const {
          conclusion = '',
          inventoryPersonNum = '',
          inventoryTurn = '',
          resultCode = '',
          resultId = '',
          resultStatus = '',
          specificIssues = '',
          specificIssuesDesc = '',
          resultComments = '',
        } = item
        let taskDetailLoadDto = {
          invBuildingResultList: {
            conclusion,
            inventoryPersonNum,
            inventoryTurn,
            resultBillId: item.resultBillId,
            resultCode,
            resultId,
            resultStatus,
            specificIssues,
            specificIssuesDesc,
            taskBuildingBillDto: {
              batchId,
              billId,
              btsMajorDesc,
              buildUnitPrice,
              comments,
              contractName,
              contractNumber,
              decorationUnitPrice,
              departmentName,
              faCategoryDesc,
              faNameDesc,
              instanceDescription,
              linewayId,
              linewayName,
              paTaskName,
              poolId,
              projectScaleCompleted,
              tagNum,
              txnNumber,
              unitOfMeasure,
              btsMajor,
              departmentId,
            },
            resultComments,
          },
          inventoryObject: item.inventoryObject,
          taskId: item.taskId,
          taskNumber: item.taskNumber,
        }
        this.removeEmptyAtrribute(taskDetailLoadDto)
        params = {
          taskDetailLoadDto: taskDetailLoadDto,
          'userId': this.userNum,
          'userName': this.userName,
        }
        console.log('房建上传处理后', JSON.stringify(params))
      }
      try {
        let resp = await this.$store.dispatch('handoverInventory/uploadCheckTaskApi', params)
        if (resp.data.return.returnStatus === 'S') { // 回传成功
          this.currentIndex++
          if (this.allBillList.length > this.currentIndex) { // 判断是否全部回传成功
            this.uploadCheckTask(this.allBillList[this.currentIndex])
          } else { // 全部回传成功
            await vm.restartIndexedDB()
            vm.downLoadToIndexedDb('数据上传和加载成功！', '数据上传成功，加载数据失败！请重新加载任务') // 重新下载数据
          }
        } else {
          this.$hips.indicator.hide()
          this.$hips.toast('数据回传失败！')
        }
      } catch (err) {
        this.$hips.indicator.hide()
        this.$hips.toast('数据回传失败！')
        throw new Error(err)
      }
    },
    async getQuantity (storeName, indexName, indexValue) { //
      let inventoriedList = await indexeddb.cursorGetDataByIndex(this.indexDB, storeName, indexName, indexValue)
      return inventoriedList.length
    },
    async confirmDownLoad () { // 弹出框--确认下载？
      let vm = this
      vm.$hips.dialog.confirm({
        content: '<p style="line-height:22px;font-size:16px">请选择下载范围</p>',
        closable: true,
        okText: '下载全部数据',
        cancelText: '仅下载未盘点数据',
        // closable: false,
        async onOk () { // 是
          await vm.restartIndexedDB()
          vm.$hips.indicator.show({
            text: '数据下载中...',
          })
          vm.downLoadToIndexedDb('数据下载成功！', '数据下载失败！')
          storage.set('resultStatus', null)
        },
        async onCancel () {
          await vm.restartIndexedDB()
          vm.$hips.indicator.show({
            text: '数据下载中...',
          })
          storage.set('resultStatus', '10')
          vm.downLoadToIndexedDb('数据下载成功！', '数据下载失败！')
        },
      })
    },
    addTaskQuantity (element) { // 计算任务中的数量
      return new Promise(async (resolve, reject) => {
        if (element.inventoryObject === '10') {
          element.inventoriedQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus'], [element.taskId, '20']) // 已盘点数量
          element.inventorinoQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus'], [element.taskId, '10']) // 未盘点数量
          element.codeLossQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus'], [element.taskId, '30']) // 条码丟损数
          element.countMatchQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '30']) // 账实相符数
          element.invProfitQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '10']) // 盘盈数
          element.incLossQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '20']) // 盘亏数
          element.invDiffQuantity = await this.getQuantity('deviceList', ['taskId', 'resultStatus', 'resultCode'], [element.taskId, '20', '40']) // 差异数
        }
        if (element.inventoryObject === '30') {
          element.inventoriedQuantity = await this.getQuantity('buildList', 'StatusTaskId', ['20', element.taskId])
          element.inventorinoQuantity = await this.getQuantity('buildList', 'StatusTaskId', ['10', element.taskId])
          element.codeLossQuantity = await this.getQuantity('buildList', 'StatusTaskId', ['30', element.taskId])
          element.countMatchQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '30', element.taskId])
          element.invProfitQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '10', element.taskId])
          element.incLossQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '20', element.taskId])
          element.invDiffQuantity = await this.getQuantity('buildList', 'SingleTaskId', ['20', '40', element.taskId])
        }
        element.inventoryQuantity = element.inventoriedQuantity + element.inventorinoQuantity + element.codeLossQuantity
        this.currentIndex++
        if (this.taskList.length > this.currentIndex) {
          await this.addTaskQuantity(this.taskList[this.currentIndex])
        }
        resolve(true)
      })
    },
    removeEmptyAtrribute (obj) {
      for (let key in obj) {
        if (obj[key] !== undefined && obj[key].toString() === '[object Object]') {
          this.removeEmptyAtrribute(obj[key])
        } else if (obj[key] !== undefined) {
          if (!obj[key]) {
            delete obj[key]
          }
        }
      }
    },
    async restartIndexedDB () { // 重启数据库
      // await indexeddb.clearStore(this.indexDB, 'fastCode')
      // await indexeddb.clearStore(this.indexDB, 'taskSummary')
      // await indexeddb.clearStore(this.indexDB, 'deviceList')
      // await indexeddb.clearStore(this.indexDB, 'buildList')
      await indexeddb.closeDB(this.indexDB)
      await indexeddb.deletedb('inventoryDB')
      this.indexDB = await indexeddb.openDB('inventoryDB', 1, this.objStore)
      this.$store.commit('handoverInventory/updateState', {key: 'indexDB', value: this.indexDB}) // 更新到vuex中
    },
  },
}
</script>

<style scoped lang="stylus">
  .img
      img
        width 100%
        height 120px
  .mainRoute
    padding 10px
    display flex
    flex-wrap wrap
    text-align center
    .routePage
       height 70px
       width 47.5%
       margin-bottom 10px
       border-radius 4px
       background white
       .pageDetail
         display flex
         margin-left 15px
         align-items center
         height 100%
         .iconfont
            font-size 27px
         .left
            width 45px
            height 45px
            background #2697ff
            border-radius 50%
            color #fff
            line-height 45px
         p
            margin-left 20px
            font-family: PingFangSC-Regular
            font-size: 14px
            color: #4A4A4A
            letter-spacing: 0
            margin-left 7px
            font-weight 700
    .routePage:nth-child(odd)
          margin-right 2.5%
    .routePage:nth-child(even)
          margin-left 2.5%
  >>>.hips-view__content
    background #eee
.hips-dialog__content-message
  line-height 22px
.hips-view
  background #eee
</style>
