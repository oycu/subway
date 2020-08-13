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
    <div class="task-asset-contain">
      <div class="inner-contain">
        <select-item
          title="盘点结果"
          placeholder="盘盈"
          :isDisable="true"
        />
        <search-item
          title="物资名称"
          :value="assetDetail.MATERIAL_DESCRIPTION"
          @click.native="goSearch('ITEM')"
        />
        <p-item
          title="物资编号"
          :class="{'p-font-override': !assetDetail.MATERIAL_NUMBER}"
          :value="assetDetail.MATERIAL_NUMBER ? assetDetail.MATERIAL_NUMBER : '物资编号'"
        />
        <cell-item
          title="公司"
          :value="assetDetail.COMPANY"
          @click.native="goSearch('COMPANY')"
        />
        <cell-item
          title="线路"
          :value="assetDetail.LINE"
          @click.native="goSearch('LINE')"
        />
        <cell-item
          title="一级库"
          :value="assetDetail.FIRST_WAREHOUSE_DESCRIPTION"
          @click.native="goSearch('FIRST_WAREHOUSE')"
        />
        <cell-item
          title="二级库"
          :class="{'font-override': assetDetail.SECOND_WAREHOUSE_DESCRIPTION}"
          :value="assetDetail.SECOND_WAREHOUSE_DESCRIPTION"
          @click.native="goSearch('SECOND_WAREHOUSE')"
        />
        <cell-item
          title="货位"
          :value="assetDetail.ALLOCATION_NAME"
          @click.native="goSearch('ALLOCATION')"
        />
        <input-item
          keyVal="ACTUAL_QUANTITY"
          title="实盘数"
          placeholder="请输入实盘数"
          :value="assetDetail.ACTUAL_QUANTITY"
          @updateInput="updateInput"
        />
        <input-item
          title="备注"
          keyVal="DESCRIPTION"
          placeholder="请输入备注"
          :value="assetDetail.DESCRIPTION"
          @updateInput="updateInput"
        />
      </div>
    </div>
    <div slot="footer" class="footer" @click="submit">
      <p>提交</p>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import SelectItem from '../../components/select-item'
import CellItem from '../../components/cell-item'
import SearchItem from '../../components/search-item'
import InputItem from '../../components/input-item'
import PItem from '../../components/p-item'
import {indicator, storage} from '@/utils'
var fromName = ''
export default {
  name: 'AssetsStartRecordInventory',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    SelectItem,
    CellItem,
    SearchItem,
    InputItem,
    PItem,
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  data () {
    return {
      assetDetail: {
        COMPANY: '',
        COMPANY_ID: '',
        LINE: '',
        LINE_ID: '',
        MATERIAL_DESCRIPTION: '', // 物资名称
        MATERIAL_NUMBER: '', // 物资编号
        FIRST_WAREHOUSE_DESCRIPTION: '', // 一级库名称
        FIRST_WAREHOUSE_NUMBER: '', // 一级库编码
        SECOND_WAREHOUSE_DESCRIPTION: '', // 二级库名称
        SECOND_WAREHOUSE_NUMBER: '', // 二级库编码
        ALLOCATION_NAME: '', // 货位名称
        ALLOCATION_ID: '', // 货位ID
        ACTUAL_QUANTITY: '', // 实盘数
        DESCRIPTION: '', // 备注
        ACTUAL_USE_DEPARTMENT: '',
        ACTUAL_USE_DEPARTMENT_ID: '',
        ACTUAL_MANAGE_DEPARTMENT: '',
        ACTUAL_MANAGE_DEPARTMENT_ID: '',
        ACTUAL_POSITION_NAME: '',
        ACTUAL_POSITION_ID: '',
        ACTUAL_USER_NAME: '',
        ACTUAL_USER_ID: '',
        ACTUAL_MANAGER_NAME: '',
        ACTUAL_MANAGER_ID: '',
        ASSET_INSTANCE_STATUS_NAME: '',
        ACTUAL_MANUFACTURER: '',
        ACTUAL_SERIAL_NUMBER: '',
        ACTUAL_SPECIFICATION: '',
        ASSET_DESC: '',
      },
      resultList: [], // 快码-盘点结果list
      statusList: [], // 快码-资产状态list
      checkstateList: [], // 快码-盘点状态list
      currentTitle: '',
      TASK_ID: '',
    }
  },
  watch: {
    'assetDetail.COMPANY_ID': function (val, oldVal) {
      this.assetDetail.LINE_ID = ''
      this.assetDetail.LINE = ''
      this.assetDetail.FIRST_WAREHOUSE_DESCRIPTION = ''
      this.assetDetail.FIRST_WAREHOUSE_NUMBER = ''
      this.assetDetail.SECOND_WAREHOUSE_DESCRIPTION = ''
      this.assetDetail.SECOND_WAREHOUSE_NUMBER = ''
      this.assetDetail.ALLOCATION_NAME = ''
      this.assetDetail.ALLOCATION_ID = ''
    },
    'assetDetail.LINE_ID': function (val, oldVal) {
      this.assetDetail.FIRST_WAREHOUSE_DESCRIPTION = ''
      this.assetDetail.FIRST_WAREHOUSE_NUMBER = ''
      this.assetDetail.SECOND_WAREHOUSE_DESCRIPTION = ''
      this.assetDetail.SECOND_WAREHOUSE_NUMBER = ''
      this.assetDetail.ALLOCATION_NAME = ''
      this.assetDetail.ALLOCATION_ID = ''
    },
  },
  activated () {
    if (fromName === 'AssetsFunctionSelect') {
      this.clear()
      this.TASK_ID = this.$route.query.task_id
      // this.getMobileView('CHECK_TURN')
      // this.getMobileView('RESULT') // 盘点结果
      // this.getMobileView('STATUS') // 资产状态
    } else if (this.$store.state.assetsInventory.chooseData.RETURN_DESCRIPTION) {
      let chooseData = this.$store.state.assetsInventory.chooseData
      if (this.currentTitle === 'COMPANY') { // 公司
        this.assetDetail.COMPANY = chooseData.RETURN_DESCRIPTION
        this.assetDetail.COMPANY_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'LINE') { // 线路
        this.assetDetail.LINE = chooseData.RETURN_DESCRIPTION
        this.assetDetail.LINE_ID = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'ITEM') { // 物资名称
        this.assetDetail.MATERIAL_DESCRIPTION = chooseData.RETURN_DESCRIPTION
        this.assetDetail.MATERIAL_NUMBER = chooseData.RETURN_CODE
      }
      if (this.currentTitle === 'FIRST_WAREHOUSE') { // 一级库
        this.assetDetail.FIRST_WAREHOUSE_DESCRIPTION = chooseData.RETURN_DESCRIPTION
        this.assetDetail.FIRST_WAREHOUSE_NUMBER = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'SECOND_WAREHOUSE') { // 二级库
        this.assetDetail.SECOND_WAREHOUSE_DESCRIPTION = chooseData.RETURN_DESCRIPTION
        this.assetDetail.SECOND_WAREHOUSE_NUMBER = chooseData.RETURN_ID
      }
      if (this.currentTitle === 'ALLOCATION') { // 货位
        this.assetDetail.ALLOCATION_NAME = chooseData.RETURN_DESCRIPTION
        this.assetDetail.ALLOCATION_ID = chooseData.RETURN_ID
      }
      this.$store.commit('assetsInventory/updateState', {key: 'chooseData', value: {}})
    }
  },
  methods: {
    /**
     * @description: 获取值级列表
     * @param {type} String 值类型
     * @return
     */
    async getMobileView (type) {
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
        if (type === 'STATUS') { // 资产
          this.statusList = listData
        }
        if (type === 'CHECKSTATE') { // 盘点状态
          this.checkstateList = listData
        }
        if (type === 'RESULT') { // 盘点结果
          this.resultList = listData
        }
      } catch (err) {
        indicator.hide()
      }
    },
    /**
     * @description: 跳转搜索页面
     * @param {String} title 搜索的字段
     * @return
     */
    goSearch (title) {
      this.currentTitle = title
      if (title === 'COMPANY') { // 公司
        this.$router.push({
          name: 'Search',
          query: {
            title,
          },
        })
        return
      }
      if (title === 'LINE') { // 线路
        if (!this.assetDetail.COMPANY_ID) {
          this.$hips.toast('请先选择公司')
          return
        }
        this.$router.push({
          name: 'Search',
          query: {
            title,
            companyId: this.assetDetail.COMPANY_ID,
          },
        })
        return
      }
      if (title === 'FIRST_WAREHOUSE' || title === 'SECOND_WAREHOUSE') { // 一级库或二级库
        // if (!this.assetDetail.COMPANY_ID || !this.assetDetail.COMPANY) {
        //   this.$hips.toast('请先选择公司')
        //   return
        // }
        if (!this.assetDetail.LINE_ID || !this.assetDetail.LINE) {
          this.$hips.toast('请先选择线路')
          return
        }
        if (title === 'SECOND_WAREHOUSE' && this.assetDetail.FIRST_WAREHOUSE_DESCRIPTION) {
          this.$hips.toast('一级库二级库只能选其一')
          this.assetDetail.FIRST_WAREHOUSE_DESCRIPTION = ''
          this.assetDetail.FIRST_WAREHOUSE_NUMBER = ''
          return
        }
        this.$router.push({
          name: 'Search',
          query: {
            title,
            companyId: this.assetDetail.COMPANY_ID,
            lineId: this.assetDetail.LINE_ID,
          },
        })
        return
      }
      if (title === 'ALLOCATION') { // 货位
        if (!this.assetDetail.SECOND_WAREHOUSE_NUMBER && !this.assetDetail.FIRST_WAREHOUSE_NUMBER) {
          this.$hips.toast('请先选择库')
          // return
        }
        this.$router.push({
          name: 'Search',
          query: {
            title,
            companyId: this.assetDetail.COMPANY_ID,
            lineId: this.assetDetail.LINE_ID,
          },
        })
        return
      }
      // 物资名称
      this.$router.push({
        name: 'InputSearch',
        query: {
          title,
        },
      })
    },
    async submit () { // 提交
      // 资产名称不能为空 资产状态不能为空 公司不能为空 线路不能为空
      if (!this.assetDetail.MATERIAL_DESCRIPTION) {
        this.$hips.toast('请选择物资名称')
        return
      }
      if (!this.assetDetail.COMPANY) {
        this.$hips.toast('请选择公司')
        return
      }
      if (!this.assetDetail.LINE) {
        this.$hips.toast('请选择线路')
        return
      }
      if (!this.assetDetail.FIRST_WAREHOUSE_DESCRIPTION && !this.assetDetail.SECOND_WAREHOUSE_DESCRIPTION) {
        this.$hips.toast('请选择库')
        return
      }
      if (!this.assetDetail.ALLOCATION_NAME) {
        this.$hips.toast('请选择货位')
        return
      }
      indicator.show()
      let params = {
        'P_MOBILE_DATA_LINEITEM_IN_TB': {
          'P_MOBILE_DATA_LINEITEM_IN_TB_ITEM': [
            {
              'TASK_ID': this.TASK_ID, // 任务ID
              'RESULT_ID': '',
              'MATERIAL_BILL_ID': '',
              'BILL_STATUS': '',
              'COMPANY_ID': this.assetDetail.COMPANY_ID, // 公司ID
              'LINE_ID': this.assetDetail.LINE_ID, // 线路ID
              'MANAGEMENT_DEPARTMENT_ID': '',
              'MATERIAL_CATEGORY_ID': '',
              'FIRST_WAREHOUSE_NUMBER': '',
              'SECOND_WAREHOUSE_NUMBER': '',
              'ALLOCATION_ID': this.assetDetail.ALLOCATION_ID, // 货位ID
              'FIXED_ASSET_CATEGORY_ID': '',
              'INVENTORY_COUNT': '',
              'SPECIFICATION_MODEL': '',
              'MATERIAL_UNIT_CODE': '',
              'RESULT_CODE': '',
              'ACTUAL_QUANTITY': this.assetDetail.ACTUAL_QUANTITY, // 实盘数
              'REVIEW_QUANTITY': '',
              'DIFF_QUANTITY': '',
              'DESCRIPTION': this.assetDetail.DESCRIPTION, // 备注
              'CHECK_TURN': '',
              'MATERIAL_NUMBER': this.assetDetail.MATERIAL_NUMBER, // 物资编号
              'MATERIAL_DESC': this.assetDetail.MATERIAL_DESCRIPTION, // 物资名称
              'CHECK_PERSON': storage.get('empId') + '', // 当前用户
            },
          ],
        },
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/mobileItemListBackApi', params)
        indicator.hide()
        if (resp.success) {
          this.$hips.toast('提交成功')
          this.$router.backPage()
        } else {
          this.$hips.toast('提交失败')
        }
      } catch (err) {
        indicator.hide()
        this.$hips.toast(err.data.X_MSG_DATA)
      }
    },
    updateInput (val, key) {
      this.assetDetail[key] = val
    },
    clear () {
      this.assetDetail = {
        COMPANY: '',
        COMPANY_ID: '',
        LINE: '',
        LINE_ID: '',
        MATERIAL_DESCRIPTION: '', // 物资名称
        MATERIAL_NUMBER: '', // 物资编号
        FIRST_WAREHOUSE_DESCRIPTION: '', // 一级库名称
        FIRST_WAREHOUSE_NUMBER: '', // 一级库编码
        SECOND_WAREHOUSE_DESCRIPTION: '', // 二级库名称
        SECOND_WAREHOUSE_NUMBER: '', // 二级库编码
        ALLOCATION_NAME: '', // 货位名称
        ALLOCATION_ID: '', // 货位ID
        ACTUAL_QUANTITY: '', // 实盘数
        DESCRIPTION: '', // 备注
        ACTUAL_USE_DEPARTMENT: '',
        ACTUAL_USE_DEPARTMENT_ID: '',
        ACTUAL_MANAGE_DEPARTMENT: '',
        ACTUAL_MANAGE_DEPARTMENT_ID: '',
        ACTUAL_POSITION_NAME: '',
        ACTUAL_POSITION_ID: '',
        ACTUAL_USER_NAME: '',
        ACTUAL_USER_ID: '',
        ACTUAL_MANAGER_NAME: '',
        ACTUAL_MANAGER_ID: '',
        ASSET_INSTANCE_STATUS_NAME: '',
        ACTUAL_MANUFACTURER: '',
        ACTUAL_SERIAL_NUMBER: '',
        ACTUAL_SPECIFICATION: '',
        ASSET_DESC: '',
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
>>>.p-font-override{
  .value{
    color #b4bec8
  }
}
>>>.hips-view__content {
  background-color: #fafafa;
}
>>>.hips-view__header--fixed{
  z-index 9000
}
.task-asset-contain {
  padding: 15px
  .inner-contain {
    border 1px solid #DDDDCC
    border-radius 10px
    padding 5px 0px 0px 10px
    background-color #fff
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
</style>
