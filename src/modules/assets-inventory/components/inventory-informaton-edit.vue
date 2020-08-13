<template>
  <div class="inventory-contain">
    <p class="header">盘点信息</p>
    <select-item title="盘点轮次" :selctValue="assetDetail.INVENTORY_TURN_DESC" :isDisable="true" />
    <select-item title="盘点状态" :selctValue="assetDetail.BILL_STATUS_DESC" :isDisable="true" />
    <select-item title="盘点结果" :selctValue="assetDetail.RESULT_CODE_DESC" :isDisable="true" />
    <div v-if="inventoryFlag">
      <select-item title="资产状态" :selctValue="assetDetail.ACTUAL_STATUS_DESC" :isDisable="true" />
      <p-item title="公司" :value="assetDetail.COMPANY" />
      <p-item title="线路" :value="assetDetail.LINE" />
      <cell-item
        title="使用部门"
        :value="assetDetail.ACTUAL_USE_DEPARTMENT ? assetDetail.ACTUAL_USE_DEPARTMENT : '' "
      />
      <cell-item title="实物归口部门" :value="assetDetail.ACTUAL_MANAGE_DEPARTMENT ? assetDetail.ACTUAL_MANAGE_DEPARTMENT : ''" />
      <search-item title="使用地点" :value="assetDetail.ACTUAL_POSITION_NAME ? assetDetail.ACTUAL_POSITION_NAME : ''" />
      <search-item title="使用人" :value="assetDetail.ACTUAL_USER_NAME ? assetDetail.ACTUAL_USER_NAME : ''" />
      <search-item title="管理人" :value="assetDetail.ACTUAL_MANAGER_NAME ? assetDetail.ACTUAL_MANAGER_NAME : ''" />
      <input-item keyVal="ACTUAL_MANUFACTURER" title="制造商" :value="assetDetail.ACTUAL_MANUFACTURER " :disableFlag="true" />
      <input-item keyVal="ACTUAL_SERIAL_NUMBER" title="产品序列号" :value="assetDetail.ACTUAL_SERIAL_NUMBER" :disableFlag="true" />
      <input-item keyVal="ACTUAL_SPECIFICATION" title="规格型号" :value="assetDetail.ACTUAL_SPECIFICATION" :disableFlag="true" />
    </div>
    <input-item keyVal="DESCRIPTION" title="备注" :value="assetDetail.DESCRIPTION" :disableFlag="true" />
  </div>
</template>

<script>
import SelectItem from './select-item'
import PItem from './p-item'
import SearchItem from './search-item.vue'
import InputItem from './input-item'
import CellItem from './cell-item'
export default {
  name: 'EditInventory',
  components: {
    SelectItem,
    PItem,
    SearchItem,
    InputItem,
    CellItem,
  },
  props: {
    assetDetail: {
      type: Object,
      default: () => {},
    },
    inventoryFlag: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
    }
  },
}
</script>

<style lang="stylus" scoped>
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

.header {
  text-align: center;
  color: #1f8ceb;
  padding: 10px 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
}
</style>
