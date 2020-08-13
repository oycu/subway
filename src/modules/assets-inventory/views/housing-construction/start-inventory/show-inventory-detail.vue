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
      <edit-inventory :assetDetail="inventoryItem" :inventoryFlag="inventoryFlag" />
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import AssetInfo from '../../../components/asset-information'
import EditInventory from '../../../components/inventory-informaton-edit'

export default {
  name: 'AssetsShowInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [AssetInfo.name]: AssetInfo,
    [EditInventory.name]: EditInventory,
  },
  data () {
    return {
      isEditable: true, // 是否允许编辑
      inventoryItem: {}, // 资产信息
      inventoryFlag: false, // 是否显示其他信息
    }
  },
  mounted () {
    this.inventoryItem = this.$route.query.inventoryItem
    if (this.inventoryItem.RESULT_CODE_DESC === '属性差异' || this.inventoryItem.RESULT_CODE_DESC === '') {
      this.inventoryFlag = true
    }
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

</style>
