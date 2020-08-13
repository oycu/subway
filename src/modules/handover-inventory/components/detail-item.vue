<template>
  <div class="detail">
    <p class="title">
      盘点信息
    </p>
    <select-item
      title="盘点状态"
      keyName="resultStatus"
      :selctValue="inventoryDetail.resultStatus"
      :options="checkstateList"
      :isDisable="selectDisable"
    />
    <SelectItem
      title="盘点轮次"
      keyName="inventoryTurn"
      :selctValue="inventoryDetail.inventoryTurn"
      :options="roundsList"
      :isDisable="selectDisable"
    />
    <SelectItem
      title="盘点结果"
      keyName="resultCode"
      :selctValue="inventoryDetail.resultCode"
      :options="resultList"
      :isDisable="selectDisable"
    />
    <div v-if="!showComment">
      <PItem v-if="showHap || showProblem" title="标签编号" :value="inventoryDetail.taskDeviceBillDto.tagNum" />
      <input-item
        v-if="showProblem"
        keyVal="tagNumIssues"
        title="标签编号问题"
        :value="inventoryDetail.tagNumIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="固定资产名称" :value="inventoryDetail.taskDeviceBillDto.faNameDesc" />
      <input-item
        v-if="showProblem"
        keyVal="faIssues"
        title="固定资产问题"
        :value="inventoryDetail.faIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="组合码/层级码" :value="`${inventoryDetail.taskDeviceBillDto.combineCode} / ${inventoryDetail.taskDeviceBillDto.hierarchicalCode}`" />
      <input-item
        v-if="showProblem"
        keyVal="combineIssues"
        title="组合码/层级码问题"
        :value="inventoryDetail.combineIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="设备名称" :value="inventoryDetail.taskDeviceBillDto.instanceDescription" />
      <input-item
        v-if="showProblem"
        keyVal="deviceNameIssues"
        title="设备名称问题"
        :value="inventoryDetail.deviceNameIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="规格型号" :value="inventoryDetail.taskDeviceBillDto.specification" />
      <input-item
        v-if="showProblem"
        keyVal="specificationIssues"
        title="规格型号问题"
        :value="inventoryDetail.specificationIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="计量单位" :value="inventoryDetail.taskDeviceBillDto.unitOfMeasure" />
      <input-item
        v-if="showProblem"
        keyVal="unitIssues"
        title="计量单位问题"
        :value="inventoryDetail.unitIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="安装（存放）地点" :value="inventoryDetail.taskDeviceBillDto.locationCode" />
      <input-item
        v-if="showProblem"
        keyVal="locationIssues"
        title="安装（存放）地点问题"
        :value="inventoryDetail.locationIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" class="border-bot" title="资产状态" :value="inventoryDetail.taskDeviceBillDto.objectStatus" />
      <input-item
        v-if="showProblem"
        keyVal="objectStatusIssues"
        title="资产状态问题"
        :value="inventoryDetail.objectStatusIssues"
        :disableFlag="true"
      />

      <PItem v-if="showHap || showProblem" title="资产性质" :value="inventoryDetail.taskDeviceBillDto.objectNature" />
      <input-item
        v-if="showProblem"
        keyVal="objectNatureIssues"
        title="资产性质问题"
        :value="inventoryDetail.objectNatureIssues"
        :disableFlag="true"
      />

      <!-- <PItem v-if="showHap || showProblem" title="备注" :value="inventoryDetail.taskDeviceBillDto.comments" /> -->
      <input-item
        v-if="showProblem"
        keyVal="conclusion"
        title="盘点结论"
        :value="inventoryDetail.conclusion"
        :disableFlag="true"
      />
    </div>
    <div v-if="!showComment || showLoss">
      <input-item
        v-if="showProblem || showLoss"
        keyVal="quantityIssues"
        title="数量问题"
        :value="inventoryDetail.quantityIssues"
        :disableFlag="true"
      />
      <input-item
        v-if="showProblem || showLoss"
        keyVal="actualQuantity"
        title="实盘数量"
        :value="inventoryDetail.actualQuantity"
        :disableFlag="true"
      />
    </div>
    <div v-if="!showComment || showOther">
      <!-- <input-item
        v-if=" showProblem || showOther"
        keyVal="specificIssues"
        title="其他问题"
        :value="inventoryDetail.specificIssues"
        :disableFlag="true"
      /> -->
      <SelectItem
        v-if=" showProblem || showOther"
        title="其他问题"
        keyName="specificIssues"
        :selctValue="inventoryDetail.specificIssues"
        :options="specificIssuesList"
        :isDisable="selectDisable"
      />
    </div>
    <input-item
      v-if="showProblem || showComment || showOther || showLoss"
      keyVal="resultComments"
      title="盘点备注"
      :value="inventoryDetail.resultComments"
      :disableFlag="true"
    />
    <div class="button">
      <p @click="operate('cancel')">取消</p>
      <p @click="operate('confirm')">确定</p>
    </div>
  </div>
</template>

<script>
import InputItem from './input-item'
import PItem from './p-item'
import SelectItem from './select-item'
export default {
  name: 'DetailItem',
  components: {
    SelectItem,
    InputItem,
    PItem,
  },
  props: {
    inventoryDetail: {
      type: Object,
      default: function () {
        return {}
      },
    },
    checkstateList: {
      type: Array,
      default: function () {
        return []
      },
    },
    roundsList: {
      type: Array,
      default: function () {
        return []
      },
    },
    resultList: {
      type: Array,
      default: function () {
        return []
      },
    },
    specificIssuesList: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data () {
    return {
      selectDisable: true,
      showProblem: false,
      showHap: false,
      showComment: false,
      showOther: false,
      showLoss: false,
    }
  },
  watch: {
    'inventoryDetail.resultCode' (val, oldVal) {
      console.log('盘点结果改变 val', val)
      val === '' ? this.showHap = true : this.showHap = false // 盘点结果为空
      val === '40' ? this.showProblem = true : this.showProblem = false // 盘点结果为属性差异
      val === '30' || val === '50' ? this.showComment = true : this.showComment = false // 盘点结果为账实相符或条码丢损时
      val === '60' ? this.showOther = true : this.showOther = false // 盘点结果其他
      val === '20' ? this.showLoss = true : this.showLoss = false // 盘点结果盘亏
    },
  },
  async mounted () {
    this.inventoryDetail.resultCode === '' ? this.showHap = true : this.showHap = false // 盘点结果为空
    this.inventoryDetail.resultCode === '40' ? this.showProblem = true : this.showProblem = false // 盘点结果为属性差异
    this.inventoryDetail.resultCode === '30' || this.inventoryDetail.resultCode === '50' ? this.showComment = true : this.showComment = false // 盘点结果为账实相符或条码丢损时
    this.inventoryDetail.resultCode === '60' ? this.showOther = true : this.showOther = false // 盘点结果其他
    this.inventoryDetail.resultCode === '20' ? this.showLoss = true : this.showLoss = false // 盘点结果盘亏
  },
  methods: {
    operate (val) {
      this.$emit('operate', val)
    },
  },
}
</script>

<style scoped lang="stylus">
.detail{
    padding-left 10px
    margin 10px 10px 0 10px
    background #fff
    // border 1px solid #ccc
    border-radius 15px
    // margin-top 20px
    z-index 9
    >>>.item{
       z-index 1
    }
    .select-item:last-child{
      border none
    }
    .item:last-child{
        border none
        border-radius 0 0 15px 0
    }
    .title{
        color #2896ff
        text-align center
        padding 10px 0
        border-bottom 1px solid #ccc
    }
    .border-bot{
      border-bottom 1px solid #ccc!important
    }
    .button{
        display flex
        height 48px
        line-height 48px
        border-top 1px solid #ccc
        p{
            flex 1
            text-align center
            color: #108aee
        }
        p:last-child{
           color #48d2a0
        }
    }
}
</style>
