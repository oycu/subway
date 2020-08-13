/*
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 13:46:23
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 */
// import Login from '../views/login'
import Main from '../views/main' // 首页
import TaskSummary from '../views/task-summary' // 任务汇总
import FunctionSelect from '../views/function-select' // 功能选择
import HandSearch from '../views/search' // 搜索

// 设备
import AlreadyInventoryList from '../views/device/already-inventory/already-inventory-list' // 已盘任务-资产汇总页

import CodeInventoryList from '../views/device/code-loss/code-inventory-list' // 条码丟损-资产汇总页

import NoInventoryList from '../views/device/no-inventory/no-inventory-list' // 未盘任务-资产汇总页
import NoInventoryDetail from '../views/device/no-inventory/no-inventory-detail' // 未盘任务-资产汇总-资产明细页

import ScanInventoryDetail from '../views/device/start-inventory/scan-inventory-detail' // 开始盘点-扫描条码信息-资产明细页
import StartInventoryList from '../views/device/start-inventory/start-inventory-list' // 开始盘点-查看任务详情-资产汇总页
import ShowInventoryDetail from '../views/device/start-inventory/show-inventory-detail' // 开始盘点-查看任务详情-资产汇总页-资产明细页
import StartRecordInventory from '../views/device/start-inventory/start-record-inventory' // 开始盘点-盘盈信息录入-资产明细页 RecordInventoryDetail

import RecordInventoryDetail from '../views/device/oprate-inventory/record-inventory-detail' // 开始盘点-盘盈信息录入
import EditInventoryDetail from '../views/device/oprate-inventory/edit-inventory-detail' // 开始盘点-编辑清单详情
import AddNode from '../views/device/oprate-inventory/add-node' // 开始盘点-新增节点

// 房建
import HouseScanInventoryDetail from '../views/housing-construction/start-inventory/scan-inventory-detail' // 开始盘点-扫描条码信息-资产明细页
import HouseStartInventoryList from '../views/housing-construction/start-inventory/start-inventory-list' // 开始盘点-查看任务详情-资产汇总页
import HouseShowInventoryDetail from '../views/housing-construction/start-inventory/show-inventory-detail' // 开始盘点-查看任务详情-资产汇总页-资产明细页
import HouseStartRecordInventory from '../views/housing-construction/start-inventory/start-record-inventory' // 开始盘点-盘盈信息录入-资产明细页

import HouseAlreadyInventoryList from '../views/housing-construction/already-inventory/already-inventory-list.vue' // 已盘任务-资产汇总页

import HouseNoInventoryList from '../views/housing-construction/no-inventory/no-inventory-list' // 未盘任务-资产汇总页
import HouseNoInventoryDetail from '../views/housing-construction/no-inventory/no-inventory-detail' // 未盘任务-资产汇总-资产明细页

import HouseCodeInventoryList from '../views/housing-construction/code-loss/code-inventory-list' // 条码丟损-资产汇总页
let route = [
  {
    path: '/main',
    name: 'main',
    component: Main,
  },
  {
    path: '/main/task-summary',
    name: 'TaskSummary',
    component: TaskSummary,
  },
  {
    path: '/main/function-select',
    name: 'FunctionSelect',
    component: FunctionSelect,
  },
  {
    path: '/main/hand-search',
    name: 'HandSearch',
    component: HandSearch,
  },
  {
    path: '/device/already-inventory-list',
    name: 'AlreadyInventoryList',
    component: AlreadyInventoryList,
  },
  {
    path: '/device/code-inventory-list',
    name: 'CodeInventoryList',
    component: CodeInventoryList,
  },
  {
    path: '/device/no-inventory-list',
    name: 'NoInventoryList',
    component: NoInventoryList,
  },
  {
    path: '/device/no-inventory-detail',
    name: 'NoInventoryDetail',
    component: NoInventoryDetail,
  },
  {
    path: '/device/scan-inventory-detail',
    name: 'ScanInventoryDetail',
    component: ScanInventoryDetail,
  },
  {
    path: '/device/start-inventory-list',
    name: 'StartInventoryList',
    component: StartInventoryList,
  },
  {
    path: '/device/show-inventory-detail',
    name: 'ShowInventoryDetail',
    component: ShowInventoryDetail,
  },
  {
    path: '/device/start-record-inventory',
    name: 'StartRecordInventory',
    component: StartRecordInventory,
  },
  {
    path: '/device/record-inventory-detail',
    name: 'RecordInventoryDetail',
    component: RecordInventoryDetail,
  },
  {
    path: '/device/edit-inventory-detail',
    name: 'EditInventoryDetail',
    component: EditInventoryDetail,
  },
  {
    path: '/device/add-node',
    name: 'AddNode',
    component: AddNode,
  },
  // 房建
  {
    path: '/house/scan-inventory-detail',
    name: 'HouseScanInventoryDetail',
    component: HouseScanInventoryDetail,
  },
  {
    path: '/house/start-inventory-list',
    name: 'HouseStartInventoryList',
    component: HouseStartInventoryList,
  },
  {
    path: '/house/show-inventory-detail',
    name: 'HouseShowInventoryDetail',
    component: HouseShowInventoryDetail,
  },
  {
    path: '/house/start-record-inventory',
    name: 'HouseStartRecordInventory',
    component: HouseStartRecordInventory,
  },
  {
    path: '/house/already-inventory-list',
    name: 'HouseAlreadyInventoryList',
    component: HouseAlreadyInventoryList,
  },
  {
    path: '/house/code-inventory-list',
    name: 'HouseCodeInventoryList',
    component: HouseCodeInventoryList,
  },
  {
    path: '/house/no-inventory-list',
    name: 'HouseNoInventoryList',
    component: HouseNoInventoryList,
  },
  {
    path: '/house/no-inventory-detail',
    name: 'HouseNoInventoryDetail',
    component: HouseNoInventoryDetail,
  },
]

export default route
