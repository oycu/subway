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
        <select-item
          title="资产状态"
          :selctValue="assetDetail.ASSET_INSTANCE_STATUS_NAME"
          :options="statusList"
          @selectChange="selectChange"
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
          title="使用部门"
          :value="assetDetail.ACTUAL_USE_DEPARTMENT"
          @click.native="goSearch('USE_DEPARTMENT')"
        />
        <cell-item
          title="实物归口部门"
          :value="assetDetail.ACTUAL_MANAGE_DEPARTMENT"
          @click.native="goSearch('MANAGEMENT_DEPARTMENT')"
        />
        <search-item
          title="使用地点"
          :value="assetDetail.ACTUAL_POSITION_NAME"
          @click.native="goSearch('SITE')"
        />
        <search-item
          title="使用人"
          :value="assetDetail.ACTUAL_USER_NAME"
          @click.native="goSearch('USER')"
        />
        <search-item
          title="管理人"
          :value="assetDetail.ACTUAL_MANAGER_NAME"
          @click.native="goSearch('MANAGEMENT')"
        />
        <input-item
          keyVal="ASSET_DESC"
          title="资产名称"
          placeholder="请输入资产名称"
          :value="assetDetail.ASSET_DESC"
          @updateInput="updateInput"
        />
        <input-item
          keyVal="ACTUAL_SPECIFICATION"
          title="规格型号"
          placeholder="请输入规格型号"
          :value="assetDetail.ACTUAL_SPECIFICATION"
          @updateInput="updateInput"
        />
        <input-item
          keyVal="ACTUAL_SERIAL_NUMBER"
          title="产品序列号"
          placeholder="请输入产品序列号"
          :value="assetDetail.ACTUAL_SERIAL_NUMBER"
          @updateInput="updateInput"
        />
        <input-item
          keyVal="ACTUAL_MANUFACTURER"
          title="制造商"
          placeholder="请输入制造商"
          :value="assetDetail.ACTUAL_MANUFACTURER"
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
      <div class="footer" @click="submit">
        <p>提交</p>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import SelectItem from '../../../components/select-item'
import CellItem from '../../../components/cell-item'
import SearchItem from '../../../components/search-item'
import InputItem from '../../../components/input-item'
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
        DESCRIPTION: '',
        ASSET_DESC: '',
      },
      resultList: [], // 快码-盘点结果list
      statusList: [], // 快码-资产状态list
      checkstateList: [], // 快码-盘点状态list
      currentTitle: '',
      TASK_ID: '',
    }
  },
  activated () {
    if (fromName === 'AssetsFunctionSelect') {
      this.clear()
      this.TASK_ID = this.$route.query.task_id
      this.getMobileView('RESULT') // 盘点结果
      this.getMobileView('STATUS') // 资产状态
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
    /**
     * @description: 获取值级
     * @param {String} type 值级字段
     * @return:
     */
    async getMobileView (type) { // 获取值列表
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
        let listData = [] // select组件接收的options
        resp.data.X_MOBILE_DATA_VIEW_TB.X_MOBILE_DATA_VIEW_TB_ITEM.forEach(element => {
          let temp = {
            value: element.RETURN_CODE,
            label: element.RETURN_DESCRIPTION,
          }
          listData.push(temp)
        })
        if (type === 'STATUS') { // 资产
          this.statusList = listData
          console.log(this.statusList)
        }
        if (type === 'CHECKSTATE') { // 盘点状态
          this.checkstateList = listData
        }
        if (type === 'RESULT') { // 盘点结果
          this.resultList = listData
        }
        console.log('成功', resp)
      } catch (err) {
        indicator.hide()
      }
    },
    /**
     * @description: 跳转搜索页面
     * @param {String} title 跳转的类型(公司、线路、使用部门、实物归口部门、使用人、管理人)
     * @return
     */
    goSearch (title) {
      this.currentTitle = title
      if (title === 'COMPANY') {
        this.$router.push({
          name: 'Search',
          query: {
            title,
          },
        })
      }
      if (title === 'LINE') {
        if (!this.assetDetail.COMPANY_ID) {
          this.$hips.toast('请先选择公司')
        } else {
          this.$router.push({
            name: 'Search',
            query: {
              title,
              companyId: this.assetDetail.COMPANY_ID,
            },
          })
        }
      }
      if (title === 'USE_DEPARTMENT' || title === 'MANAGEMENT_DEPARTMENT') {
        if (!this.assetDetail.LINE_ID || !this.assetDetail.LINE) {
          this.$hips.toast('请先选择线路')
        } else {
          this.$router.push({
            name: 'Search',
            query: {
              title,
              companyId: this.assetDetail.COMPANY_ID,
              lineId: this.assetDetail.LINE_ID,
            },
          })
        }
      }
      // if (title === 'SITE') {
      //   this.assetDetail.LINE_ID ? this.$router.push({
      //     name: 'InputSearch',
      //     query: {
      //       title,
      //     },
      //   }) : this.$hips.toast('请先选择线路')
      // }
      if (title === 'USER' || title === 'MANAGEMENT' || title === 'SITE') {
        this.$router.push({
          name: 'InputSearch',
          query: {
            title,
          },
        })
      }
    },
    /**
     * @description: 提交 盘盈信息回传
     * @param {}
     * @return:
     */
    async submit () {
      // 资产名称不能为空 资产状态不能为空 公司不能为空 线路不能为空
      if (!this.assetDetail.ASSET_DESC) {
        this.$hips.toast('请输入资产名称')
        return
      }
      if (!this.assetDetail.ASSET_INSTANCE_STATUS_NAME) {
        this.$hips.toast('请选择资产状态')
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
      let params = {
        'P_MOBILE_DATA_LINEASSET_IN_TB': {
          'P_MOBILE_DATA_LINEASSET_IN_TB_ITEM': [
            {
              TASK_ID: this.TASK_ID, // 任务Id
              RESULT_ID: '',
              ASSET_BILL_ID: '',
              RESULT_CODE: '10,20', // 盘点结果 已盘点、盘盈
              ACTUAL_STATUS_CODE: this.assetDetail.ASSET_INSTANCE_STATUS_NAME, // 资产状态
              ACTUAL_POSITION_ID: this.assetDetail.ACTUAL_POSITION_ID, // 使用地点ID
              ACTUAL_USER_ID: this.assetDetail.ACTUAL_USER_ID, // 使用人ID
              ACTUAL_MANAGER_ID: this.assetDetail.ACTUAL_MANAGER_ID, // 管理人ID
              ACTUAL_USE_DEPARTMENT_ID: this.assetDetail.ACTUAL_USE_DEPARTMENT_ID, // 使用部门ID
              ACTUAL_MANAGE_DEPARTMENT_ID: this.assetDetail.ACTUAL_MANAGE_DEPARTMENT_ID, // 实物归口部门ID
              ACTUAL_MANUFACTURER: this.assetDetail.ACTUAL_MANUFACTURER, // 制造商
              ACTUAL_SERIAL_NUMBER: this.assetDetail.ACTUAL_SERIAL_NUMBER, // 产品序列号
              ACTUAL_SPECIFICATION: this.assetDetail.ACTUAL_SPECIFICATION, // 规格型号
              DESCRIPTION: this.assetDetail.DESCRIPTION, // 备注
              CHECK_TURN: 'FIRST', // 盘点轮次 默认首盘
              ASSET_NUMBER: '',
              ASSET_DESC: this.assetDetail.ASSET_DESC, // 资产名称
              CHECK_PERSON: storage.get('empId') + '', // 当前登录用户
              COMPANY_ID: this.assetDetail.COMPANY_ID, // 公司ID
              LINE_ID: this.assetDetail.LINE_ID, // 线路ID
            },
          ],
        },
      }
      indicator.show()
      try {
        let resp = await this.$store.dispatch('assetsInventory/mobileAssetListBackApi', params)
        indicator.hide()
        if (resp.success) {
          this.$hips.toast({
            icon: 'success',
            message: '提交成功',
          })
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
    selectChange (selectObj, title) {
      this.assetDetail.ASSET_INSTANCE_STATUS_NAME = selectObj.value
    },
    clear () {
      this.assetDetail = {
        COMPANY: '',
        COMPANY_ID: '',
        LINE: '',
        LINE_ID: '',
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
        DESCRIPTION: '',
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
>>>.hips-view__content {
  background-color: #fafafa;
}
>>>.hips-view__header--fixed{
  z-index 9000
}
.task-asset-contain {
  .inner-contain {
    border 1px solid #DDDDCC
    border-radius 10px
    margin: 15px
    padding 5px 0px 0px 10px
    background-color #fff
  }
}

.footer{
  display flex
  background-color #2896ff
  color #fff
  height 48px
  justify-content center
  align-items center
}
</style>
