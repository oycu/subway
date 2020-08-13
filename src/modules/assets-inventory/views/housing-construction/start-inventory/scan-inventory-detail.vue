<template>
  <hips-view @scroll.native="scrollEvent">
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="资产明细"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="contain">
      <asset-info :assetDetail="assetDetail" />
      <div class="inventory-contain">
        <p class="header">盘点信息</p>
        <select-item
          title="盘点轮次"
          :selctValue="assetDetail.INVENTORY_TURN_DESC"
          :options="roundsList"
          :isDisable="selectDisable"
          @selectChange="selectChange"
        />
        <select-item
          title="盘点状态"
          :selctValue="assetDetail.PRIMARY_UNIT_OF_MEASURE"
          :options="checkstateList"
          :isDisable="selectDisable"
          @selectChange="selectChange"
        />
        <select-item
          title="盘点结果"
          :selctValue="assetDetail.RESULT_CODE_DESC"
          :options="resultList"
          :isDisable="resultCodeDisable"
          @selectChange="selectChange"
        />
        <div v-if="inventoryFlag">
          <select-item title="资产状态" :selctValue="assetDetail.ACTUAL_STATUS_DESC" :options="statusList" @selectChange="selectChange" />
          <p-item title="公司" :value="assetDetail.COMPANY_NAME" />
          <p-item title="线路" :value="assetDetail.LINE_NAME" />
          <cell-item
            title="使用部门"
            :value="assetDetail.ACTUAL_USE_DEPARTMENT"
            @click.native="goSearch('USE_DEPARTMENT')"
          />
          <cell-item title="实物归口部门" :value="assetDetail.ACTUAL_MANAGE_DEPARTMENT" @click.native="goSearch('MANAGEMENT_DEPARTMENT')" />
          <search-item title="使用地点" :value="assetDetail.ACTUAL_POSITION_NAME" @click.native="goSearch('SITE')" />
          <search-item title="使用人" :value="assetDetail.ACTUAL_USER_NAME" @click.native="goSearch('USER')" />
          <search-item title="管理人" :value="assetDetail.ACTUAL_MANAGER_NAME" @click.native="goSearch('MANAGEMENT')" />
          <input-item
            keyVal="ACTUAL_MANUFACTURER"
            title="制造商"
            :value="assetDetail.ACTUAL_MANUFACTURER"
            :placeholder="'请输入'"
            @updateInput="updateInput"
          />
          <input-item
            keyVal="ACTUAL_SERIAL_NUMBER"
            title="产品序列号"
            :value="assetDetail.ACTUAL_SERIAL_NUMBER"
            :placeholder="'请输入'"
            @updateInput="updateInput"
          />
          <input-item
            keyVal="ACTUAL_SPECIFICATION"
            title="规格型号"
            :value="assetDetail.ACTUAL_SPECIFICATION"
            :placeholder="'请输入'"
            @updateInput="updateInput"
          />
        </div>
        <input-item keyVal="DESCRIPTION" title="备注" :value="assetDetail.DESCRIPTION" @updateInput="updateInput" />
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
import Task from '@/components/task.vue'
import SelectItem from '../../../components/select-item'
import PItem from '../../../components/p-item'
import SearchItem from '../../../components/search-item.vue'
import InputItem from '../../../components/input-item'
import CellItem from '../../../components/cell-item'
import { indicator, storage } from '@/utils'
var fromName = ''
export default {
  name: 'AssetsScanInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [AssetInfo.name]: AssetInfo,
    [EditInventory.name]: EditInventory,
    [Task.name]: Task,
    SelectItem,
    PItem,
    SearchItem,
    InputItem,
    CellItem,
  },
  data () {
    return {
      assetDetail: {}, // 资产明细
      inventoryFlag: false, // 控制显示差异信息
      routerQuery: {}, // 路由参数
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
      selectDisable: false, // 盘点轮次、盘点状态是否可选
      resultCodeDisable: false, // 盘点结果是否可选
    }
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  watch: {
    'assetDetail.RESULT_CODE_DESC': function (val, oldVal) { // 监听盘点结果
      this.inventoryFlag = val === '属性差异'
    },
  },
  async activated () {
    if (fromName === 'AssetsFunctionSelect') { // 上一页面是功能选择页
      this.routerQuery = this.$route.query // 接收路由参数
      await this.getMobileAssetscan() // 查询资产
      this.getMobileView('STATUS') // 快码-资产状态
      this.getMobileView('CHECKSTATE') // 快码-盘点状态
      this.getMobileView('RESULT') // 快码-盘点结果
    } else if (this.$store.state.assetsInventory.chooseData.RETURN_DESCRIPTION) { // 上一页面为搜索页
      let chooseData = this.$store.state.assetsInventory.chooseData // 获取搜索页中选中的值
      if (this.currentTitle === 'USE_DEPARTMENT') { // 使用部门
        this.assetDetail.ACTUAL_USE_DEPARTMENT = chooseData.RETURN_DESCRIPTION
        this.assetDetail.ACTUAL_USE_DEPARTMENT_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'MANAGEMENT_DEPARTMENT') { // 实物归口部门
        this.assetDetail.ACTUAL_MANAGE_DEPARTMENT = chooseData.RETURN_DESCRIPTION
        this.assetDetail.ACTUAL_MANAGE_DEPARTMENT_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'SITE') { // 使用地点
        this.assetDetail.ACTUAL_POSITION_NAME = chooseData.RETURN_DESCRIPTION
        this.assetDetail.ACTUAL_POSITION_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'USER') { // 使用人
        this.assetDetail.ACTUAL_USER_NAME = chooseData.RETURN_DESCRIPTION
        this.assetDetail.ACTUAL_USER_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'MANAGEMENT') { // 管理人
        this.assetDetail.ACTUAL_MANAGER_NAME = chooseData.RETURN_DESCRIPTION
        this.assetDetail.ACTUAL_MANAGER_ID = chooseData.RETURN_ID
      }
      this.$store.commit('assetsInventory/updateState', {key: 'chooseData', value: {}}) // 清空选中的数据
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
    goSearch (title) { // 搜索
      this.currentTitle = title // 当前选择字段
      if (title === 'USE_DEPARTMENT' || title === 'MANAGEMENT_DEPARTMENT') { // 使用部门和管理部门
        this.$router.push({ // 跳转到搜索页面
          name: 'Search',
          query: {
            title,
            companyId: this.assetDetail.COMPANY_ID, // 公司id
            lineId: this.assetDetail.LINE_ID, // 线路id
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
      this.assetDetail[key] = val
    },
    selectChange (selectObj, title) { // 接收选择的数据
      if (title === '盘点轮次') {
        this.assetDetail.INVENTORY_TURN_DESC = selectObj.label
        this.assetDetail.INVENTORY_TURN = selectObj.value
      }
      if (title === '盘点状态') {
        this.assetDetail.PRIMARY_UNIT_OF_MEASURE = selectObj.label
        this.assetDetail.PRIMARY_UOM_CODE = selectObj.value
      }
      if (title === '盘点结果') {
        if (this.assetDetail.RESULT_CODE !== selectObj.value) {
          this.clear()
        }
        this.assetDetail.RESULT_CODE_DESC = selectObj.label
        this.assetDetail.RESULT_CODE = selectObj.value
      }
      if (title === '资产状态') {
        this.assetDetail.ACTUAL_STATUS_DESC = selectObj.label
        this.assetDetail.ACTUAL_STATUS_CODE = selectObj.value
      }
    },
    clear () { // 清除差异数据
      this.assetDetail.ACTUAL_STATUS_DESC = '' // 资产状态说明
      this.assetDetail.ACTUAL_STATUS_CODE = '' // 资产状态code
      this.assetDetail.ACTUAL_USE_DEPARTMENT = '' // 使用部门
      this.assetDetail.ACTUAL_USE_DEPARTMENT_ID = '' // 使用部门id
      this.assetDetail.ACTUAL_MANAGE_DEPARTMENT = '' // 实物归口部门
      this.assetDetail.ACTUAL_MANAGE_DEPARTMENT_ID = '' // 实物归口部门id
      this.assetDetail.ACTUAL_POSITION_NAME = '' // 使用地点
      this.assetDetail.ACTUAL_POSITION_ID = '' // 使用地点id
      this.assetDetail.ACTUAL_USER_NAME = '' // 使用人
      this.assetDetail.ACTUAL_USER_ID = '' // 使用人id
      this.assetDetail.ACTUAL_MANAGER_NAME = '' // 管理人
      this.assetDetail.ACTUAL_MANAGER_ID = '' // 管理人id
      this.assetDetail.ACTUAL_MANUFACTURER = '' // 制造商
      this.assetDetail.ACTUAL_SERIAL_NUMBER = '' // 产品序列号
      this.assetDetail.ACTUAL_SPECIFICATION = '' // 规格型号
    },
    async getMobileAssetscan () { // 查询资产
      let vm = this
      indicator.show()
      this.assetDetail = {}
      let params = {
        'P_TASK_ID': this.routerQuery.task_id, // 任务Id
        'P_ASSET_NUMBER': this.routerQuery.asset_number, // 资产编号
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileAssetscanApi', params)
        this.assetDetail = resp.data.X_MOBILE_DATA_LINEASSET_OUT_TB.X_MOBILE_DATA_LINEASSET_OUT_TB_ITEM[0]
        indicator.hide()
        if (!this.assetDetail.ASSET_BILL_ID) { // 判断该资产是否在该任务中
          this.$hips.dialog.confirm({
            title: '提示',
            content: '<p style="line-height:22px;font-size:16px">该设备不在盘点清单内, 是否继续盘点?</p>',
            okText: '确定',
            cancelText: '取消',
            onOk () {
              vm.$set(vm.assetDetail, 'INVENTORY_TURN_DESC', '首盘') // 盘点轮次des默认为首盘
              vm.$set(vm.assetDetail, 'INVENTORY_TURN', 'FIRST') // 盘点轮次code默认为10
              vm.$set(vm.assetDetail, 'PRIMARY_UNIT_OF_MEASURE', '已盘点') // 盘点状态des默认为已盘点
              vm.$set(vm.assetDetail, 'PRIMARY_UOM_CODE', '20') // 盘点状态code默认为20
              vm.$set(vm.assetDetail, 'RESULT_CODE_DESC', '盘盈') // 盘点结果为盘盈
              vm.$set(vm.assetDetail, 'RESULT_CODE', '10') // 盘点结果code为10

              vm.selectDisable = true // 盘点轮次,盘点状态不允许选择
              vm.resultCodeDisable = true // 盘点结果不允许选择
            },
            onCancel () {
              vm.$router.backPage()
            },
          })
        } else {
          if (!this.assetDetail.INVENTORY_TURN_DESC) { // 是否存在盘点轮次名称
            this.assetDetail.INVENTORY_TURN_DESC = this.roundsList[0].label // 盘点轮次默认为首盘
            this.assetDetail.INVENTORY_TURN = this.roundsList[0].value
            this.assetDetail.PRIMARY_UNIT_OF_MEASURE = '已盘点' // 盘点状态默认为已盘点
            this.assetDetail.PRIMARY_UOM_CODE = '20' // 盘点状态code默认为20
            this.selectDisable = true // 盘点轮次,盘点状态不允许选择
            // this.resultCodeDisable = false // 盘点结果允许选择
          } else {
            this.selectDisable = false
            // this.resultCodeDisable = false
          }
          this.assetDetail.RESULT_CODE === '10' ? this.resultCodeDisable = true : this.resultCodeDisable = false // 盘点结果为盘盈时，盘点结果不可选
        }
      } catch (err) {
        indicator.hide()
      }
    },
    async getMobileView (type) { // 获取值列表，资产状态list、盘点状态list、 盘点结果list
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
          listData.forEach((ele, index) => {
            if (ele.label === '属性差异') {
              this.resultList.push(ele)
            }
            if (ele.label === '账实相符') {
              this.resultList.push(ele)
            }
          })
        }
      } catch (err) {
        indicator.hide()
      }
    },
    async mobileAssetListBack (type) { // 资产上传接口
      indicator.show()
      let paramsItem = {
        'TASK_ID': this.routerQuery.task_id, // 任务id
        'RESULT_ID': this.assetDetail.RESULT_ID, // 盘点结果id  selectm没有id
        'ASSET_BILL_ID': this.assetDetail.ASSET_BILL_ID,
        // 'RESULT_CODE': '40,20',
        'RESULT_CODE': this.assetDetail.RESULT_CODE + ',' + this.assetDetail.PRIMARY_UOM_CODE, // 盘点结果code
        'ACTUAL_STATUS_CODE': this.assetDetail.ACTUAL_STATUS_CODE, // 资产状态
        'ACTUAL_POSITION_ID': this.assetDetail.ACTUAL_POSITION_ID, // 使用地点id
        'ACTUAL_USER_ID': this.assetDetail.ACTUAL_USER_ID, // 使用人id
        'ACTUAL_MANAGER_ID': this.assetDetail.ACTUAL_MANAGER_ID, // 管理人id
        'ACTUAL_USE_DEPARTMENT_ID': this.assetDetail.ACTUAL_USE_DEPARTMENT_ID, // 使用部门id
        'ACTUAL_MANAGE_DEPARTMENT_ID': this.assetDetail.ACTUAL_MANAGE_DEPARTMENT_ID, // 实物归口部门id
        'ACTUAL_MANUFACTURER': this.assetDetail.ACTUAL_MANUFACTURER, // 制造商
        'ACTUAL_SERIAL_NUMBER': this.assetDetail.ACTUAL_SERIAL_NUMBER, // 序列号
        'ACTUAL_SPECIFICATION': this.assetDetail.ACTUAL_SPECIFICATION, // 规格型号
        'DESCRIPTION': this.assetDetail.DESCRIPTION, // 备注
        'CHECK_TURN': this.assetDetail.INVENTORY_TURN, // 盘点轮次
        'ASSET_NUMBER': this.routerQuery.asset_number, // 资产编号
        'ASSET_DESC': this.assetDetail.ASSET_DESCRIPTION, // 资产名称
        'CHECK_PERSON': storage.get('empId') + '', // 操作人工号
        'COMPANY_ID': this.assetDetail.COMPANY_ID, // 公司id
        'LINE_ID': this.assetDetail.LINE_ID, // 线路id
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
.hips-view{
  >>>.hips-view__header--fixed{
    z-index 9000
  }
}

.contain {
  padding 10px
  border-top .5px solid #eee
  background-color #fafafa
  .hips-button{
      background-color: #2896ff!important
      margin-bottom 10px
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
}

.footer{
  display flex
  background-color #2896ff
  color #fff
  height 100%
  justify-content center
  align-items center
}

>>>.hips-dialog__footer-ok{
  color rgb(141, 282, 141)
}
</style>
