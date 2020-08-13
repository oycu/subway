<template>
  <div class="asset-contain">
    <p class="header">资产信息</p>
    <p-item title="移交表导入标识" :value="buildDetail.batchId" />
    <p-item title="标签编号" :value="buildDetail.tagNum" />
    <p-item title="固定资产目录" :value="buildDetail.faCategoryDesc" />
    <p-item title="房建/轨道名称" :value="buildDetail.instanceDescription" />
    <p-item title="计量单位" :value="buildDetail.unitOfMeasure" />
    <p-item title="竣工工程规模" :value="buildDetail.projectScaleCompleted" />
    <p-item title="土建/轨道价格" :value="buildDetail.buildUnitPrice" />
    <p-item title="装修价格" :value="buildDetail.decorationUnitPrice" />
    <p-item title="线路" :value="buildDetail.linewayName" />
    <p-item title="专业" :value="buildDetail.btsMajorDesc" />
    <p-item title="部门" :value="buildDetail.departmentName" />
    <p-item title="备注" :value="buildDetail.comments" />
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
    buildDetail: {
      type: Object,
      default: () => {},
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
  height 237px
  overflow-y scroll
}

.header {
  color #1f8ceb
  padding 10px 0
}

</style>
