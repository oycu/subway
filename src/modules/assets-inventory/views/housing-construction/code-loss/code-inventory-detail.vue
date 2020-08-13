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
      <asset-info :assetDetail="inventoryItem" />
      <div class="inventory-contain">
        <p class="header">盘点信息</p>
        <select-item title="盘点轮次" :selctValue="inventoryItem.INVENTORY_TURN_DESC" :options="roundsList" />
        <!-- <select-item title="盘点状态" :selctValue="inventoryItem.PRIMARY_UNIT_OF_MEASURE" :options="checkstateList" @selectChange="selectChange" /> -->
        <select-item title="盘点状态" :selctValue="inventoryItem.BILL_STATUS_DESC" :options="checkstateList" @selectChange="selectChange" />
        <select-item title="盘点结果" :selctValue="inventoryItem.RESULT_CODE_DESC" :options="resultList" @selectChange="selectChange" />
        <div v-if="inventoryFlag">
          <select-item title="资产状态" :selctValue="inventoryItem.ACTUAL_STATUS_CODE" :options="statusList" @selectChange="selectChange" />
          <p-item title="公司" :value="inventoryItem.COMPANY" />
          <p-item title="线路" :value="inventoryItem.LINE" />
          <cell-item
            title="使用部门"
            :value="inventoryItem.ACTUAL_USE_DEPARTMENT"
            @click.native="goSearch('USE_DEPARTMENT')"
          />
          <cell-item title="实物归口部门" :value="inventoryItem.ACTUAL_MANAGE_DEPARTMENT" @click.native="goSearch('MANAGEMENT_DEPARTMENT')" />
          <search-item title="使用地点" :value="inventoryItem.ACTUAL_POSITION_NAME" @click.native="goSearch('SITE')" />
          <search-item title="使用人" :value="inventoryItem.ACTUAL_USER_NAME" @click.native="goSearch('USER')" />
          <search-item title="管理人" :value="inventoryItem.ACTUAL_MANAGER_NAME" @click.native="goSearch('MANAGEMENT')" />
          <input-item keyVal="ACTUAL_MANUFACTURER" title="制造商" :value="inventoryItem.ACTUAL_MANUFACTURER" @updateInput="updateInput" />
          <input-item keyVal="ACTUAL_SERIAL_NUMBER" title="产品序列号" :value="inventoryItem.ACTUAL_SERIAL_NUMBER" @updateInput="updateInput" />
          <input-item keyVal="ACTUAL_SPECIFICATION" title="规格型号" :value="inventoryItem.ACTUAL_SPECIFICATION" @updateInput="updateInput" />
        </div>
        <input-item keyVal="DESCRIPTION" title="备注" :value="inventoryItem.DESCRIPTION" @updateInput="updateInput" />
      </div>
    </div>
    <div slot="footer" class="footer" @click="mobileAssetListBack">
      <p>提交</p>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import AssetInfo from '../../../components/asset-information'
import EditInventory from '../../../components/inventory-informaton-edit'
import SelectItem from '../../../components/select-item'
import PItem from '../../../components/p-item'
import SearchItem from '../../../components/search-item.vue'
import InputItem from '../../../components/input-item'
import CellItem from '../../../components/cell-item'
import {indicator, storage} from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

var fromName = ''
export default {
  name: 'AssetsCodeInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [AssetInfo.name]: AssetInfo,
    [EditInventory.name]: EditInventory,
    SelectItem,
    PItem,
    SearchItem,
    InputItem,
    CellItem,
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  data () {
    return {
      inventoryItem: {}, // 资产明细
      inventoryFlag: false, // 控制显示差异信息
      resultList: [], // 快码-盘点结果list
      statusList: [], // 快码-资产状态list
      checkstateList: [], // 快码-盘点状态list
      roundsList: [{ // 快码-盘点轮次list
        value: 'FIRST',
        label: '首盘',
      }, {
        value: 'SECOND',
        label: '复盘',
      }],
      currentTitle: '', // 当前选择字段
      taskId: '', // 任务id
    }
  },
  watch: {
    'inventoryItem.RESULT_CODE_DESC': function (val, oldVal) { // 监听盘点结果
      this.inventoryFlag = val === '属性差异'
    },
  },
  activated () {
    if (fromName === 'AssetsCodeInventoryList') { // 上一页面是列表页
      this.taskId = this.$route.query.taskId // 任务id
      this.inventoryItem = this.$route.query.inventoryItem
      this.inventoryFlag = this.inventoryItem.RESULT_CODE_DESC === '属性差异'
      this.getMobileView('STATUS') // 快码-资产状态
      this.getMobileView('CHECKSTATE') // 快码-盘点状态
      this.getMobileView('RESULT') // 快码-盘点结果
    } else if (this.$store.state.assetsInventory.chooseData.RETURN_DESCRIPTION) { // 上一页面为搜索页
      let chooseData = this.$store.state.assetsInventory.chooseData // 获取搜索页中选中的值
      if (this.currentTitle === 'USE_DEPARTMENT') { // 使用部门
        this.inventoryItem.ACTUAL_USE_DEPARTMENT = chooseData.RETURN_DESCRIPTION
        this.inventoryItem.ACTUAL_USE_DEPARTMENT_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'MANAGEMENT_DEPARTMENT') { // 实物归口部门
        this.inventoryItem.ACTUAL_MANAGE_DEPARTMENT = chooseData.RETURN_DESCRIPTION
        this.inventoryItem.ACTUAL_MANAGE_DEPARTMENT_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'SITE') { // 使用地点
        this.inventoryItem.ACTUAL_POSITION_NAME = chooseData.RETURN_DESCRIPTION
        this.inventoryItem.ACTUAL_POSITION_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'USER') { // 使用人
        this.inventoryItem.ACTUAL_USER_NAME = chooseData.RETURN_DESCRIPTION
        this.inventoryItem.ACTUAL_USER_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'MANAGEMENT') { // 管理人
        this.inventoryItem.ACTUAL_MANAGER_NAME = chooseData.RETURN_DESCRIPTION
        this.inventoryItem.ACTUAL_MANAGER_ID = chooseData.RETURN_ID
      }
      this.$store.commit('assetsInventory/updateState', {key: 'chooseData', value: {}}) // 清空选中的数据
    }
  },
  methods: {
    ...mapGetters({
      getSuceessFlagType: 'assetsInventory/getSuceessFlag',
    }),
    ...mapMutations({
      setSuceessFlagType: 'assetsInventory/setSuceessFlag',
    }),
    goSearch (title) { // 搜索
      this.currentTitle = title // 当前选择字段
      if (title === 'USE_DEPARTMENT' || title === 'MANAGEMENT_DEPARTMENT') { // 使用部门和管理部门
        this.$router.push({ // 跳转到搜索页面
          name: 'Search',
          query: {
            title,
            companyId: this.inventoryItem.COMPANY_ID, // 公司id
            lineId: this.inventoryItem.LINE_ID, // 线路id
          },
        })
      } else {
        this.$router.push({ // 跳转到搜索页面
          name: 'InputSearch',
          query: {
            title,
          },
        })
      }
    },
    updateInput (val, key) { // 更新input框中的字段
      this.inventoryItem[key] = val
    },
    selectChange (selectObj, title) { // 接收选择的数据
      if (title === '盘点轮次') {
        this.inventoryItem.INVENTORY_TURN_DESC = selectObj.label
        this.inventoryItem.INVENTORY_TURN = selectObj.value
      }
      if (title === '盘点状态') {
        this.inventoryItem.BILL_STATUS_DESC = selectObj.label
        this.inventoryItem.BILL_STATUS = selectObj.value
      }
      if (title === '盘点结果') {
        if (this.assetDetail.RESULT_CODE !== selectObj.value) {
          this.clear()
        }
        this.inventoryItem.RESULT_CODE_DESC = selectObj.label
        this.inventoryItem.RESULT_CODE = selectObj.value
      }
      if (title === '资产状态') {
        this.inventoryItem.ACTUAL_STATUS_DESC = selectObj.label
        this.inventoryItem.ACTUAL_STATUS_CODE = selectObj.value
      }
    },
    clear () { // 清除差异数据
      this.inventoryItem.ACTUAL_STATUS_DESC = '' // 资产状态说明
      this.inventoryItem.ACTUAL_STATUS_CODE = '' // 资产状态code
      this.inventoryItem.ACTUAL_USE_DEPARTMENT = '' // 使用部门
      this.inventoryItem.ACTUAL_USE_DEPARTMENT_ID = '' // 使用部门id
      this.inventoryItem.ACTUAL_MANAGE_DEPARTMENT = '' // 实物归口部门
      this.inventoryItem.ACTUAL_MANAGE_DEPARTMENT_ID = '' // 实物归口部门id
      this.inventoryItem.ACTUAL_POSITION_NAME = '' // 使用地点
      this.inventoryItem.ACTUAL_POSITION_ID = '' // 使用地点id
      this.inventoryItem.ACTUAL_USER_NAME = '' // 使用人
      this.inventoryItem.ACTUAL_USER_ID = '' // 使用人id
      this.inventoryItem.ACTUAL_MANAGER_NAME = '' // 管理人
      this.inventoryItem.ACTUAL_MANAGER_ID = '' // 管理人id
      this.inventoryItem.ACTUAL_MANUFACTURER = '' // 制造商
      this.inventoryItem.ACTUAL_SERIAL_NUMBER = '' // 产品序列号
      this.inventoryItem.ACTUAL_SPECIFICATION = '' // 规格型号
    },
    async getMobileView (type) { // 获取值列表, 资产状态list、盘点状态list、 盘点结果list
      indicator.show()
      let params = {
        'P_TYPE': type,
        'P_DEPARTMENT_ID': '',
        'P_FIRST_WAREHOUSE': '',
        'P_SECOND_WAREHOUSE': '',
        'P_DESCRIPTION': '',
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileViewApi', params)
        indicator.hide()
        let listData = []
        resp.data.X_MOBILE_DATA_VIEW_TB.X_MOBILE_DATA_VIEW_TB_ITEM.forEach(element => {
          let temp = {
            value: element.RETURN_CODE,
            label: element.RETURN_DESCRIPTION,
          }
          listData.push(temp)
        })
        if (type === 'STATUS') { // 资产状态
          this.statusList = listData
        }
        if (type === 'CHECKSTATE') { // 盘点状态
          this.checkstateList = listData
        }
        if (type === 'RESULT') { // 盘点结果
          this.resultList = []
          listData.forEach(element => {
            if (element.label === '账实相符' || element.label === '属性差异' || element.label === '盘亏') {
              this.resultList.push(element)
            }
          })
        }
      } catch (err) {
        indicator.hide()
        this.$hips.toast(err.data.X_MSG_DATA)
      }
    },
    async mobileAssetListBack (type) { // 资产上传接口
      indicator.show()
      let BILL_STATUS = this.inventoryItem.BILL_STATUS ? this.inventoryItem.BILL_STATUS : ''
      let RESULT_CODE = this.inventoryItem.RESULT_CODE ? this.inventoryItem.RESULT_CODE : ''
      let paramsItem = {
        // 'TASK_ID': this.taskId,
        'RESULT_ID': this.inventoryItem.RESULT_ID, // 盘点结果id  selectm没有id
        'ASSET_BILL_ID': this.inventoryItem.ASSET_BILL_ID,
        // 'RESULT_CODE': '40,20',
        'RESULT_CODE': RESULT_CODE + ',' + BILL_STATUS, // 盘点结果code
        // 'RESULT_CODE': ',' + this.inventoryItem.RESULT_CODE, // 盘点结果code
        'ACTUAL_STATUS_CODE': this.inventoryItem.ACTUAL_STATUS_CODE, // 资产状态
        'ACTUAL_POSITION_ID': this.inventoryItem.ACTUAL_POSITION_ID, // 使用地点id
        'ACTUAL_USER_ID': this.inventoryItem.ACTUAL_USER_ID, // 使用人id
        'ACTUAL_MANAGER_ID': this.inventoryItem.ACTUAL_MANAGER_ID, // 管理人id
        'ACTUAL_USE_DEPARTMENT_ID': this.inventoryItem.ACTUAL_USE_DEPARTMENT_ID, // 使用部门id
        'ACTUAL_MANAGE_DEPARTMENT_ID': this.inventoryItem.ACTUAL_MANAGE_DEPARTMENT_ID, // 实物归口部门id
        'ACTUAL_MANUFACTURER': this.inventoryItem.ACTUAL_MANUFACTURER, // 制造商
        'ACTUAL_SERIAL_NUMBER': this.inventoryItem.ACTUAL_SERIAL_NUMBER, // 序列号
        'ACTUAL_SPECIFICATION': this.inventoryItem.ACTUAL_SPECIFICATION, // 规格型号
        'DESCRIPTION': this.inventoryItem.DESCRIPTION, // 备注
        'CHECK_TURN': this.inventoryItem.INVENTORY_TURN, // 盘点轮次
        'ASSET_NUMBER': this.inventoryItem.ASSET_NUMBER,
        'ASSET_DESC': this.inventoryItem.ASSET_DESCRIPTION,
        'CHECK_PERSON': storage.get('empId') + '', // 操作人工号
        'COMPANY_ID': this.inventoryItem.COMPANY_ID, // 公司id
        'LINE_ID': this.inventoryItem.LINE_ID, // 线路id
      }
      let params = {
        'P_MOBILE_DATA_LINEASSET_IN_TB': {
          'P_MOBILE_DATA_LINEASSET_IN_TB_ITEM': [paramsItem],
        },
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/mobileAssetListBackApi', params)
        indicator.hide()
        console.log('成功', resp)
        this.setSuceessFlagType(true)
        this.$hips.toast({
          icon: 'success',
          message: '提交成功',
        })
        this.$router.backPage()
      } catch (err) {
        indicator.hide()
        this.$hips.toast(err.data.X_MSG_DATA)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.task-asset-contain {
  padding: 15px
  background-color: #fafafa;
}
>>>.hips-view__header--fixed{
  z-index 9000
}
.footer{
  display flex
  background-color #2896ff
  color #fff
  height 100%
  justify-content center
  align-items center
}
.inventory-contain {
    border: 1px solid #DDDDCC;
    border-radius: 10px;
    padding: 5px 0px 0px 10px;
    margin-top: 10px;
    background-color #fff
    .header {
      text-align: center;
      color: #1f8ceb;
      padding: 10px 0;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
    }
  }

</style>
