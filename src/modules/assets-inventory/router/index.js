/*
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 13:46:23
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 */
// import Login from '../views/login'
import AssetsMain from '../views/main' // 首页
import AssetsTaskSummary from '../views/task-summary' // 任务汇总
import AssetsFunctionSelect from '../views/function-select' // 功能选择
import InputSearch from '../views/input-search' // 功能选择
import Search from '../views/search.vue' // 搜索

// 开始盘点
import AssetsScanInventoryDetail from '../views/housing-construction/start-inventory/scan-inventory-detail' // 开始盘点-扫描条码信息-资产明细页
import AssetsStartInventoryList from '../views/housing-construction/start-inventory/start-inventory-list' // 开始盘点-查看任务详情-资产汇总页
import AssetsShowInventoryDetail from '../views/housing-construction/start-inventory/show-inventory-detail' // 开始盘点-查看任务详情-资产汇总页-资产明细页
import AssetsStartRecordInventory from '../views/housing-construction/start-inventory/start-record-inventory' // 开始盘点-盘盈信息录入-资产明细页

// 已盘点
import AssetsAlreadyInventoryList from '../views/housing-construction/already-inventory/already-inventory-list.vue' // 已盘任务-资产汇总页

// 未盘点
import AssetsNoInventoryList from '../views/housing-construction/no-inventory/no-inventory-list' // 未盘任务-资产汇总页
import AssetsNoInventoryDetail from '../views/housing-construction/no-inventory/no-inventory-detail' // 未盘任务-资产汇总-资产明细页

// 条码丟损
import AssetsCodeInventoryList from '../views/housing-construction/code-loss/code-inventory-list' // 条码丟损-资产汇总页
import AssetsCodeInventoryDetail from '../views/housing-construction/code-loss/code-inventory-detail' // 条码丟损-资产汇总-资产明细页

// 物资
import MaterialStartInventoryList from '../views/material/start-inventory/start-inventory-list'
import MaterialInventoryList from '../views/material/inventory-list.vue'
import MaterialRecordInventory from '../views/material/record-inventory'
import MaterialDetail from '../views/material/material-detail'
let route = [
  {
    path: '/assets/main',
    name: 'AssetsMain',
    component: AssetsMain,
  },
  {
    path: '/assets/main/task-summary',
    name: 'AssetsTaskSummary',
    component: AssetsTaskSummary,
  },
  {
    path: '/assets/main/input-search',
    name: 'InputSearch',
    component: InputSearch,
  },
  {
    path: '/assets/main/function-select',
    name: 'AssetsFunctionSelect',
    component: AssetsFunctionSelect,
  },
  {
    path: '/assets/scan-inventory-detail',
    name: 'AssetsScanInventoryDetail',
    component: AssetsScanInventoryDetail,
  },
  {
    path: '/assets/start-inventory-list',
    name: 'AssetsStartInventoryList',
    component: AssetsStartInventoryList,
  },
  {
    path: '/assets/show-inventory-detail',
    name: 'AssetsShowInventoryDetail',
    component: AssetsShowInventoryDetail,
  },
  {
    path: '/assets/start-record-inventory',
    name: 'AssetsStartRecordInventory',
    component: AssetsStartRecordInventory,
  },
  {
    path: '/assets/already-inventory-list',
    name: 'AssetsAlreadyInventoryList',
    component: AssetsAlreadyInventoryList,
  },
  {
    path: '/assets/code-inventory-list',
    name: 'AssetsCodeInventoryList',
    component: AssetsCodeInventoryList,
  },
  {
    path: '/assets/code-inventory-detail',
    name: 'AssetsCodeInventoryDetail',
    component: AssetsCodeInventoryDetail,
  },
  {
    path: '/assets/no-inventory-list',
    name: 'AssetsNoInventoryList',
    component: AssetsNoInventoryList,
  },
  {
    path: '/assets/no-inventory-detail',
    name: 'AssetsNoInventoryDetail',
    component: AssetsNoInventoryDetail,
  },
  {
    path: '/assets/search',
    name: 'Search',
    component: Search,
  },
  // 物资
  {
    path: '/assets/material-start-inventory-list',
    name: 'MaterialStartInventoryList',
    component: MaterialStartInventoryList,
  },
  {
    path: '/assets/material-record-inventory',
    name: 'MaterialRecordInventory',
    component: MaterialRecordInventory,
  },
  {
    path: '/assets/material-detail',
    name: 'MaterialDetail',
    component: MaterialDetail,
  },
  {
    path: '/assets/material-inventory-list',
    name: 'MaterialInventoryList',
    component: MaterialInventoryList,
  },
]

export default route
