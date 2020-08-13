<template>
  <div class="asset-contain">
    <p class="header">资产信息</p>
    <p-item title="资产编号" :value="assetDetail.ASSET_NUMBER" />
    <p-item title="资产名称" :value="assetDetail.ASSET_DESCRIPTION" />
    <p-item title="资产状态" :value="assetDetail.ASSET_INSTANCE_STATUS_NAME" />
    <p-item title="资产类别" :value="assetDetail.ASSET_CATEGORY_NAME" />
    <p-item title="财务核算类别" :value="assetDetail.FIXED_ASSET_CATEGORY_NAME" />
    <p-item title="公司" :value="assetDetail.COMPANY" />
    <p-item title="线路" :value="assetDetail.LINE" />
    <p-item title="使用部门" :value="assetDetail.USE_DEPARTMENT_NAME" />
    <p-item title="实物归口部门" :value="assetDetail.MANAGEMENT_DEPARTMENT_NAME" />
    <p-item title="使用地点" :value="assetDetail.LOCATION_NAME" />
    <p-item title="使用人" :value="assetDetail.USE_PERSON_NAME" />
    <p-item title="管理人" :value="assetDetail.MANAGE_PERSON_NAME" />
    <p-item title="金额" :value="assetDetail.TOTAL" />
    <p-item title="规格型号" :value="assetDetail.SPECIFICATION_MODEL" />
    <p-item title="产品序列号" :value="assetDetail.SERIAL_NUMBER" />
    <p-item title="生产日期" :value="assetDetail.PRODUCTION_DATE" />
    <p-item title="资产使用年限" :value="assetDetail.ASSET_USE_TIME" />
    <p-item title="制造商" :value="assetDetail.MANUFACTURER" />
  </div>
</template>

<script>
import PItem from './p-item'
export default {
  name: 'AssetInfo',
  components: {
    PItem,
  },
  props: {
    assetDetail: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
.asset-contain {
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

.header {
  color #1f8ceb
  padding 10px 0
}

</style>
