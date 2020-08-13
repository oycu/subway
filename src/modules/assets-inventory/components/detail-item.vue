<template>
  <div class="detail">
    <p class="title">
      盘点信息
    </p>
    <SelectItem :title="'盘点状态'" />
    <SelectItem :title="'盘点轮次'" />
    <SelectItem :title="'盘点结果'" />
    <PItem :title="'标签编号'" :value="'123456'" />
    <InputItem :title="'标签编号问题'" />
    <PItem :title="'固定资产名称'" :value="'123456'" />
    <InputItem :title="'固定资产问题'" />
    <PItem :title="'组合码/层级码'" :value="'123456'" />
    <InputItem :title="'组合码/层级码问题'" />
    <PItem :title="'设备名称'" :value="'123456'" />
    <InputItem :title="'设备名称问题'" />
    <PItem :title="'规格型号'" :value="'123456'" />
    <InputItem :title="'规格型号问题'" />
    <PItem :title="'计量单位'" :value="'123456'" />
    <InputItem :title="'计量单位问题'" />
    <PItem :title="'安装（存放）地点'" :value="'123456'" />
    <InputItem :title="'安装（存放）地点问题'" />
    <PItem :title="'资产状态'" :value="'123456'" />
    <InputItem :title="'资产状态问题'" />
    <PItem :title="'资产性质'" :value="'123456'" />
    <InputItem :title="'资产性质问题'" />
    <PItem :title="'备注'" :value="'123456'" />
    <InputItem :title="'数量问题'" />
    <InputItem :title="'实盘数量'" />
    <InputItem :title="'其他问题'" />
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
    border-radius 15px
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
