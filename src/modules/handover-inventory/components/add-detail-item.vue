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
      :isDisable="true"
    />
    <SelectItem
      title="盘点轮次"
      keyName="inventoryTurn"
      :selctValue="inventoryDetail.inventoryTurn"
      :options="roundsList"
      :isDisable="true"
    />
    <SelectItem
      title="盘点结果"
      keyName="resultCode"
      :selctValue="inventoryDetail.resultCode"
      :options="resultList"
      :isDisable="true"
    />
    <input-item
      keyVal="taskDeviceBillDto.tagNum"
      title="标签编号"
      :value="inventoryDetail.taskDeviceBillDto.tagNum"
      :disableFlag="true"
    />

    <input-item keyVal="taskDeviceBillDto.combineCode" title="组合码" :value="inventoryDetail.taskDeviceBillDto.combineCode" :disableFlag="true" />
    <input-item keyVal="taskDeviceBillDto.hierarchicalCode" title="层级码" :value="inventoryDetail.taskDeviceBillDto.hierarchicalCode" :disableFlag="true" />

    <input-item keyVal="taskDeviceBillDto.instanceDescription" title="设备名称" :value="inventoryDetail.taskDeviceBillDto.instanceDescription" :disableFlag="true" />

    <input-item keyVal="taskDeviceBillDto.specification" title="规格型号" :value="inventoryDetail.taskDeviceBillDto.specification" :disableFlag="true" />
    <input-item keyVal="taskDeviceBillDto.manufacturer" title="制造商" :value="inventoryDetail.taskDeviceBillDto.manufacturer" :disableFlag="true" />

    <input-item keyVal="taskDeviceBillDto.unitOfMeasure" title="计量单位" :value="inventoryDetail.taskDeviceBillDto.unitOfMeasure" :disableFlag="true" />
    <input-item keyVal="actualQuantity" title="实盘数量" :value="inventoryDetail.actualQuantity" :disableFlag="true" />

    <input-item keyVal="taskDeviceBillDto.locationCode" title="安装（存放）地点" :value="inventoryDetail.taskDeviceBillDto.locationCode" :disableFlag="true" />

    <input-item keyVal="taskDeviceBillDto.objectStatus" title="资产状态" :value="inventoryDetail.taskDeviceBillDto.objectStatus" :disableFlag="true" />

    <input-item
      keyVal="taskDeviceBillDto.objectNature"
      class="border-bot"
      title="资产性质"
      :value="inventoryDetail.taskDeviceBillDto.objectNature"
      :disableFlag="true"
    />
    <cell-item
      title="线路"
      :value="inventoryDetail.taskDeviceBillDto.linewayName ? inventoryDetail.taskDeviceBillDto.linewayName:''"
    />
    <cell-item
      title="专业"
      :value="inventoryDetail.taskDeviceBillDto.btsMajorDesc ? inventoryDetail.taskDeviceBillDto.btsMajorDesc:''"
    />
    <cell-item
      class="border-bot"
      title="部门"
      :value="inventoryDetail.taskDeviceBillDto.departmentName ? inventoryDetail.taskDeviceBillDto.departmentName:''"
    />
    <SelectItem
      title="其他问题"
      keyName="specificIssues"
      :selctValue="inventoryDetail.specificIssues"
      :options="specificIssuesList"
      :isDisable="true"
    />
    <input-item keyVal="resultComments" title="盘点备注" :value="inventoryDetail.resultComments" :disableFlag="true" />
    <div class="button">
      <p @click="operate('cancel')">取消</p>
      <p @click="operate('confirm')">确定</p>
    </div>
  </div>
</template>

<script>
import InputItem from './input-item'
// import PItem from './p-item'
import CellItem from './cell-item'
import SelectItem from './select-item'
export default {
  name: 'DetailItem',
  components: {
    SelectItem,
    InputItem,
    // PItem,
    CellItem,
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
      // showProblem: false,
      // showHap: false,
      // showComment: false,
      // showOther: false,
      // showLoss: false,
    }
  },
  // watch: {
  //   'inventoryDetail.resultCode' (val, oldVal) {
  //     console.log('盘点结果改变 val', val)
  //     val === '' ? this.showHap = true : this.showHap = false // 盘点结果为空
  //     val === '40' ? this.showProblem = true : this.showProblem = false // 盘点结果为属性差异
  //     val === '30' || val === '50' ? this.showComment = true : this.showComment = false // 盘点结果为账实相符或条码丢损时
  //     val === '60' ? this.showOther = true : this.showOther = false // 盘点结果其他
  //     val === '20' ? this.showLoss = true : this.showLoss = false // 盘点结果盘亏
  //   },
  // },
  // async mounted () {
  //   this.inventoryDetail.resultCode === '' ? this.showHap = true : this.showHap = false // 盘点结果为空
  //   this.inventoryDetail.resultCode === '40' ? this.showProblem = true : this.showProblem = false // 盘点结果为属性差异
  //   this.inventoryDetail.resultCode === '30' || this.inventoryDetail.resultCode === '50' ? this.showComment = true : this.showComment = false // 盘点结果为账实相符或条码丢损时
  //   this.inventoryDetail.resultCode === '60' ? this.showOther = true : this.showOther = false // 盘点结果其他
  //   this.inventoryDetail.resultCode === '20' ? this.showLoss = true : this.showLoss = false // 盘点结果盘亏
  // },
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
