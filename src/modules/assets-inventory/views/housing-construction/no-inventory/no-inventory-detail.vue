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
    <div class="contain">
      <asset-info :assetDetail="assetDetail" :nameFlag="false" />
      <div class="inventory-contain">
        <p class="header">盘点信息</p>
        <select-item
          title="盘点轮次"
          :options="roundsList"
          :selctValue="assetDetail.INVENTORY_TURN_DESC"
          @selectChange="selectChange"
        />
        <select-item title="盘点状态" :selctValue="assetDetail.BILL_STATUS_DESC" :options="checkstateList" @selectChange="selectChange" />
        <select-item title="盘点结果" :selctValue="assetDetail.RESULT_CODE_DESC" :options="resultList" @selectChange="selectChange" />
        <div v-if="inventoryFlag">
          <select-item title="资产状态" :selctValue="assetDetail.ACTUAL_STATUS_CODE" :options="statusList" @selectChange="selectChange" />
          <p-item title="公司" :value="assetDetail.COMPANY" />
          <p-item title="线路" :value="assetDetail.LINE" />
          <cell-item
            title="使用部门"
            :class="{'font-override': assetDetail.ACTUAL_USE_DEPARTMENT}"
            :value="assetDetail.ACTUAL_USE_DEPARTMENT"
            @click.native="goSearch('USE_DEPARTMENT')"
          />
          <cell-item
            title="实物归口部门"
            :class="{'font-override': assetDetail.ACTUAL_MANAGE_DEPARTMENT}"
            :value="assetDetail.ACTUAL_MANAGE_DEPARTMENT"
            @click.native="goSearch('MANAGEMENT_DEPARTMENT')"
          />
          <search-item
            title="使用地点"
            :class="{'font-override': assetDetail.ACTUAL_POSITION_NAME}"
            :value="assetDetail.ACTUAL_POSITION_NAME"
            @click.native="goSearch('SITE')"
          />
          <search-item
            title="使用人"
            :class="{'font-override': assetDetail.ACTUAL_USER_NAME}"
            :value="assetDetail.ACTUAL_USER_NAME"
            @click.native="goSearch('USER')"
          />
          <search-item
            title="管理人"
            :class="{'font-override': assetDetail.ACTUAL_MANAGER_NAME}"
            :value="assetDetail.ACTUAL_MANAGER_NAME"
            @click.native="goSearch('MANAGEMENT')"
          />
          <input-item keyVal="ACTUAL_MANUFACTURER" title="制造商" :value="assetDetail.ACTUAL_MANUFACTURER" @updateInput="updateInput" />
          <input-item keyVal="ACTUAL_SERIAL_NUMBER" title="产品序列号" :value="assetDetail.ACTUAL_SERIAL_NUMBER" @updateInput="updateInput" />
          <input-item keyVal="ACTUAL_SPECIFICATION" title="规格型号" :value="assetDetail.ACTUAL_SPECIFICATION" @updateInput="updateInput" />
        </div>
        <input-item keyVal="DESCRIPTION" title="备注" :value="assetDetail.DESCRIPTION" @updateInput="updateInput" />
      </div>
    </div>
    <hips-dialog v-model="visible">
      <div slot="title" class="dialog-header">提示</div>
      <div slot="content" class="dialog-content">该情况请扫码</div>
      <div slot="footer" class="dialog-footer" @click="handleOk">确定</div>
    </hips-dialog>
    <div slot="footer" class="footer" @click="submit">
      <p>提交</p>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Dialog } from 'hips'
import AssetInfo from '../../../components/asset-information'
import SelectItem from '../../../components/select-item'
import PItem from '../../../components/p-item'
import SearchItem from '../../../components/search-item.vue'
import InputItem from '../../../components/input-item'
import CellItem from '../../../components/cell-item'
import {indicator, storage} from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

var fromName = ''
export default {
  name: 'AssetsNoInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [AssetInfo.name]: AssetInfo,
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
      assetDetail: {},
      inventoryFlag: true,
      resultList: [], // 快码-盘点结果list
      statusList: [], // 快码-资产状态list
      checkstateList: [], // 快码-盘点状态list
      currentTitle: '',
      TASK_ID: '',
      roundsList: [{
        value: 'FIRST',
        label: '首盘',
      }, {
        value: 'SECOND',
        label: '复盘',
      }],
      visible: false, // dialog
    }
  },
  watch: {
    'assetDetail.RESULT_CODE_DESC': function (val, oldVal) {
      this.inventoryFlag = val === '属性差异'
      // this.clear()
    },
  },
  activated () {
    if (fromName === 'AssetsNoInventoryList') {
      this.TASK_ID = this.$route.query.TASK_ID
      this.assetDetail = this.$route.query.inventoryItem
      this.getMobileView('STATUS') // 快码-资产状态
      this.getMobileView('CHECKSTATE') // 快码-盘点状态
      this.getMobileView('RESULT') // 快码-盘点结果
    } else if (this.$store.state.assetsInventory.chooseData.RETURN_DESCRIPTION) {
      let chooseData = this.$store.state.assetsInventory.chooseData
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
      this.$store.commit('assetsInventory/updateState', {key: 'chooseData', value: {}})
    }
  },
  methods: {
    ...mapGetters({
      getSuceessFlagType: 'assetsInventory/getSuceessFlag',
    }),
    ...mapMutations({
      setSuceessFlagType: 'assetsInventory/setSuceessFlag',
    }),
    handleOk () {
      this.visible = false
    },
    async getMobileView (type) { // 获取值列表
      // if (!this.shipOrderHeaderId) {
      //   this.$hips.toast('单据头id为空！')
      //   return
      // }
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
        // this.taskList = resp.data.X_MOBILE_TASK_OUT_TB.X_MOBILE_TASK_OUT_TB_ITEM
        let listData = []
        resp.data.X_MOBILE_DATA_VIEW_TB.X_MOBILE_DATA_VIEW_TB_ITEM.forEach(element => {
          let temp = {
            value: element.RETURN_CODE,
            label: element.RETURN_DESCRIPTION,
          }
          listData.push(temp)
        })
        if (type === 'STATUS') {
          this.statusList = listData
        }
        if (type === 'CHECKSTATE') {
          this.checkstateList = listData
        }
        if (type === 'RESULT') { // 盘点结果
          this.resultList = listData.filter((item) => item.label === '账实相符' || item.label === '属性差异' || item.label === '盘亏')
        }
        console.log('成功', resp)
      } catch (err) {
        indicator.hide()
        this.$hips.toast(err.data.X_MSG_DATA)
      }
    },
    goSearch (title) {
      this.currentTitle = title
      if (title === 'USE_DEPARTMENT' || title === 'MANAGEMENT_DEPARTMENT') {
        this.$router.push({
          name: 'Search',
          query: {
            title,
            companyId: this.assetDetail.COMPANY_ID,
            lineId: this.assetDetail.LINE_ID,
          },
        })
      } else {
        this.$router.push({
          name: 'InputSearch',
          query: {
            title,
          },
        })
      }
    },
    updateInput (val, key) {
      this.assetDetail[key] = val
    },
    selectChange (selectObj, title) {
      if (title === '盘点轮次') {
        this.assetDetail.INVENTORY_TURN_DESC = selectObj.label
        this.assetDetail.INVENTORY_TURN = selectObj.value
      }
      if (title === '盘点状态') {
        this.assetDetail.BILL_STATUS_DESC = selectObj.label
        this.assetDetail.BILL_STATUS = selectObj.value
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
    clear () { // 不选择属性差异时清空
      this.assetDetail.ACTUAL_USE_DEPARTMENT = '' // 使用部门
      this.assetDetail.ACTUAL_USE_DEPARTMENT_ID = '' // 使用部门id
      this.assetDetail.ACTUAL_MANAGE_DEPARTMENT = '' // 实物归口部门
      this.assetDetail.ACTUAL_MANAGE_DEPARTMENT_ID = '' // 实物归口部门id
      this.assetDetail.ACTUAL_POSITION_NAME = '' // 使用地点name
      this.assetDetail.ACTUAL_POSITION_ID = '' // 使用地点id
      this.assetDetail.ACTUAL_USER_NAME = '' // 使用人name
      this.assetDetail.ACTUAL_USER_ID = '' // 使用人id
      this.assetDetail.ACTUAL_MANAGER_NAME = '' // 管理人
      this.assetDetail.ACTUAL_MANAGER_ID = '' // 管理人id

      this.assetDetail.ACTUAL_MANUFACTURER = '' // 制造商
      this.assetDetail.ACTUAL_SERIAL_NUMBER = '' // 产品序列号
      this.assetDetail.ACTUAL_SPECIFICATION = '' // 规格型号
    },
    async submit () {
      // 盘点轮次 盘点状态不能为空
      if (!this.assetDetail.INVENTORY_TURN_DESC) {
        this.$hips.toast('请选择盘点轮次')
      } else if (!this.assetDetail.BILL_STATUS_DESC) {
        this.$hips.toast('请选择盘点状态')
      } else {
        if (this.assetDetail.RESULT_CODE === '30' && this.assetDetail.BILL_STATUS === '20') {
          // 该情况请扫码
          this.visible = true
        } else {
          indicator.show()
          let params = {
            'P_MOBILE_DATA_LINEASSET_IN_TB': {
              'P_MOBILE_DATA_LINEASSET_IN_TB_ITEM': [
                {
                  'RESULT_ID': '',
                  'ASSET_BILL_ID': this.assetDetail.ASSET_BILL_ID,
                  'RESULT_CODE': `${this.assetDetail.RESULT_CODE},${this.assetDetail.BILL_STATUS}`,
                  'ACTUAL_STATUS_CODE': this.assetDetail.ACTUAL_STATUS_CODE,
                  'ACTUAL_POSITION_ID': this.assetDetail.ACTUAL_POSITION_ID,
                  'ACTUAL_USER_ID': this.assetDetail.ACTUAL_USER_ID,
                  'ACTUAL_MANAGER_ID': this.assetDetail.ACTUAL_MANAGER_ID,
                  'ACTUAL_USE_DEPARTMENT_ID': this.assetDetail.ACTUAL_USE_DEPARTMENT_ID,
                  'ACTUAL_MANAGE_DEPARTMENT_ID': this.assetDetail.ACTUAL_MANAGE_DEPARTMENT_ID,
                  'ACTUAL_MANUFACTURER': this.assetDetail.ACTUAL_MANUFACTURER,
                  'ACTUAL_SERIAL_NUMBER': this.assetDetail.ACTUAL_SERIAL_NUMBER,
                  'ACTUAL_SPECIFICATION': this.assetDetail.ACTUAL_SPECIFICATION,
                  'DESCRIPTION': this.assetDetail.DESCRIPTION,
                  'CHECK_TURN': this.assetDetail.INVENTORY_TURN,
                  'ASSET_NUMBER': this.assetDetail.ASSET_NUMBER,
                  'ASSET_DESC': this.assetDetail.ASSET_DESC,
                  'CHECK_PERSON': storage.get('empId') + '',
                  'COMPANY_ID': this.assetDetail.COMPANY_ID,
                  'LINE_ID': this.assetDetail.LINE_ID,
                },
              ],
            },
          }
          console.log(params)
          try {
            let resp = await this.$store.dispatch('assetsInventory/mobileAssetListBackApi', params)
            indicator.hide()
            if (resp.success) {
              this.setSuceessFlagType(true)
              this.$hips.toast({
                icon: 'success',
                message: '提交成功',
              })
              this.$router.backPage()
            }
          } catch (err) {
            indicator.hide()
            this.$hips.toast(err.data.X_MSG_DATA)
          }
        }
      }
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

.hips-view{
  >>>.hips-view__header--fixed{
    z-index 9000
  }
}

.contain {
  padding 15px
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

>>>.hips-view__header--fixed{
  z-index 9000
}

>>>.hips-dialog{
  span{
    display: none
  }
  .hips-dialog__footer{
    padding 15px 0
    border-top 1px solid #ccc
    .dialog-footer{
      color rgb(10, 178, 10)
      // height 30px
      vertical-align center
    }
  }
}

</style>
