<!--
 * @Author: your name
 * @Date: 2019-10-22 15:02:57
 * @LastEditTime: 2019-10-22 15:22:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /c:\Users\dzw\zhengzhouMetro\src\modules\assets-inventory\views\material\material-detail.vue
 -->
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
      <div class="material-contain">
        <p class="header">物资信息</p>
        <p-item title="物资编号" :value="materialDetail.MATERIAL_NUMBER" />
        <p-item title="物资名称" :value="materialDetail.MATERIAL_DESCRIPTION" />
        <p-item title="公司" :value="materialDetail.COMPANY" />
        <p-item title="线路" :value="materialDetail.LINE" />
        <p-item title="实物归口部门" :value="materialDetail.MANAGEMENT_DEPARTMENT_NAME" />
        <p-item title="一级库" :value="materialDetail.FIRST_WAREHOUSE_DESCRIPTION" />
        <p-item title="二级子库" :value="materialDetail.SECOND_WAREHOUSE_DESCRIPTION" />
        <p-item title="货位" :value="materialDetail.ALLOCATION_NAME" />
        <p-item title="品牌/规格/型号" :value="materialDetail.SPECIFICATION_MODEL" />
        <p-item title="单位" :value="materialDetail.MATERIAL_UNIT_DESCRIPTION" />
        <p-item title="类别" :value="materialDetail.MATERIAL_CATEGORY_NAME" />
      </div>
      <div class="inventory-contain">
        <p class="header">盘点信息</p>
        <select-item
          title="盘点轮次"
          :options="roundsList"
          :selctValue="materialDetail.INVENTORY_TURN"
          @selectChange="selectChange"
        />
        <input-item
          keyVal="ACTUAL_QUANTITY"
          title="实盘数"
          :value="materialDetail.ACTUAL_QUANTITY"
          @updateInput="updateInput"
        />
        <input-item
          keyVal="DESCRIPTION"
          title="备注"
          :value="materialDetail.DESCRIPTION"
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
import { View, NavBar, Button, Dialog } from 'hips'
import SelectItem from '../../components/select-item'
import PItem from '../../components/p-item'
import InputItem from '../../components/input-item'
import {indicator, storage} from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'MaterialDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    SelectItem,
    PItem,
    InputItem,
  },
  data () {
    return {
      materialDetail: {},
      roundsList: [{ // 盘点轮次
        value: 'FIRST',
        label: '首盘',
      }, {
        value: 'SECOND',
        label: '复盘',
      }],
    }
  },
  mounted () {
    this.materialDetail = this.$route.query.materialDetail
  },
  methods: {
    ...mapGetters({
      getSuceessFlagType: 'assetsInventory/getSuceessFlag',
    }),
    ...mapMutations({
      setSuceessFlagType: 'assetsInventory/setSuceessFlag',
    }),
    updateInput (val, key) {
      this.materialDetail[key] = val
    },
    selectChange (selectObj, title) {
      this.materialDetail.INVENTORY_TURN_DESC = selectObj.label
      this.materialDetail.INVENTORY_TURN = selectObj.value
    },
    async submit () {
      // 盘点轮次 盘点状态不能为空
      if (!this.materialDetail.INVENTORY_TURN) {
        this.$hips.toast('请选择盘点轮次')
      } else if (!this.materialDetail.ACTUAL_QUANTITY) {
        this.$hips.toast('请填写实盘数')
      } else {
        indicator.show()
        let params = {
          'P_MOBILE_DATA_LINEITEM_IN_TB': {
            'P_MOBILE_DATA_LINEITEM_IN_TB_ITEM': [
              {
                'TASK_ID': this.$route.query.taskId, // ?
                'RESULT_ID': '',
                'MATERIAL_BILL_ID': this.materialDetail.MATERIAL_BILL_ID,
                'BILL_STATUS': this.materialDetail.BILL_STATUS,
                'COMPANY_ID': this.materialDetail.COMPANY_ID,
                'LINE_ID': this.materialDetail.LINE_ID,
                'MANAGEMENT_DEPARTMENT_ID': this.materialDetail.MANAGEMENT_DEPARTMENT_ID,
                'MATERIAL_CATEGORY_ID': this.materialDetail.MATERIAL_CATEGORY_ID,
                'FIRST_WAREHOUSE_NUMBER': this.materialDetail.FIRST_WAREHOUSE_NUMBER,
                'SECOND_WAREHOUSE_NUMBER': this.materialDetail.SECOND_WAREHOUSE_NUMBER,
                'ALLOCATION_ID': this.materialDetail.ALLOCATION_ID,
                'FIXED_ASSET_CATEGORY_ID': this.materialDetail.FIXED_ASSET_CATEGORY_ID,
                'INVENTORY_COUNT': this.materialDetail.INVENTORY_COUNT,
                'SPECIFICATION_MODEL': this.materialDetail.SPECIFICATION_MODEL,
                'MATERIAL_UNIT_CODE': this.materialDetail.MATERIAL_UNIT_CODE,
                'RESULT_CODE': this.materialDetail.RESULT_CODE,
                'ACTUAL_QUANTITY': this.materialDetail.ACTUAL_QUANTITY, // 实盘数
                'REVIEW_QUANTITY': this.materialDetail.REVIEW_QUANTITY,
                'DESCRIPTION': this.materialDetail.DESCRIPTION,
                'CHECK_TURN': this.materialDetail.INVENTORY_TURN, // 盘点轮次
                'MATERIAL_NUMBER': this.materialDetail.MATERIAL_NUMBER,
                'MATERIAL_DESC': this.materialDetail.MATERIAL_DESC,
                'CHECK_PERSON': storage.get('empId') + '',
              },
            ],
          },
        }
        try {
          let resp = await this.$store.dispatch('assetsInventory/mobileItemListBackApi', params)
          indicator.hide()
          if (resp.success) {
            this.$hips.toast({
              icon: 'success',
              message: '提交成功',
            })
            this.setSuceessFlagType(true)
            this.$router.backPage()
          } else {
            this.$hips.toast('提交失败')
          }
        } catch (err) {
          indicator.hide()
          this.$hips.toast(err.data.X_MSG_DATA)
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
  padding 10px 15px 10px 15px
  border-top .5px solid #eee
  background-color #fafafa
  .hips-button{
      background-color: #2896ff!important
      margin-bottom 10px
  }
  .material-contain {
    border 1px solid #DDDDCC
    border-radius 10px
    padding 5px 0px 0px 10px
    background-color #fff
    height 260px
    overflow-y scroll
    .header {
      color #1f8ceb
      padding 10px 0
    }
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
