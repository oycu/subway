<template>
  <div>
    <div v-if="show" class="select-item">
      <p class="name">
        {{ title }}
      </p>
      <el-select
        ref="elSelect"
        v-model="valueDesc"
        :placeholder="placeholder"
        class="value"
        size="small"
        :disabled="isDisable"
        @change="selectChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :class="{'hide':show}"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectItem',
  components: {
    // [Select.name]: Select,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    selctValue: {
      type: String,
      default: '',
    },
    keyVal: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: function () {
        return []
      },
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      show: true,
      optionFlag: true,
      valueDesc: this.selctValue,
    }
  },
  watch: {
    selctValue (val, oldVal) {
      this.valueDesc = val
      console.log('change', val)
    },
  },
  mounted () {
    let vm = this
    document.addEventListener('click', () => {
      vm.show = false
      vm.$nextTick(() => {
        vm.show = true
      })
    })
  },
  methods: {
    selectChange (val) {
      console.log('val', val)
      console.log('selectChange', this.valueDesc)
      let selectObj = {}
      selectObj = this.options.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.value === val// 筛选出匹配数据
      })
      console.log('obj', selectObj)
      this.$emit('selectChange', selectObj, this.title)
    },
  },
}
</script>

<style scoped lang="stylus">
>>>.is-disabled{
  background-color #fff
}
>>>.el-input.is-disabled {
  .el-input__inner{
    background-color #fff
  }
}
.select-item{
    // border-radius 0 15px 0 0
    // border-bottom 1px solid #ccc
    display flex
    font-size 14px
    padding 10px 10px 5px 0
    align-items center
    .name{
        flex 1
        font-weight 700
    }
    .value{
        color #333
        width 200px
        >>>.el-select {
          .el-input__inner {
            text-align right!important
            border none
          }
        }
        >>>.el-input--small .el-input__inner{
           text-align right!important
          border none
        }
    }

}

</style>
