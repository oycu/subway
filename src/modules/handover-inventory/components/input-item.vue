<template>
  <div class="item">
    <p class="name">
      {{ title }}
    </p>
    <input
      v-model="inputValue"
      class="input"
      type="text"
      :placeholder="placeholder"
      :disabled="disableFlag"
    >
    <!-- <hips-input
      v-if="refresh"
      v-model="inputValue"
      :placeholder="placeholder"
      type="text"
      :disabled="disableFlag"
      input-align="right"
      on-focus="focusEvent"
    /> -->
  </div>
</template>

<script>
import { Input } from 'hips'
import { limitPositiveNumber } from '@/utils'
export default {
  name: 'InputItem',
  components: {
    [Input.name]: Input,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    keyVal: {
      type: String,
      default: '',
    },
    disableFlag: {
      type: Boolean,
      default: false,
    },
    typeNum: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      inputValue: this.value,
      refresh: true,
    }
  },
  watch: {
    value (val, oldVal) {
      this.inputValue = this.value
    },
    inputValue (val, oldVal) {
      if (this.typeNum) {
        let successFlag = limitPositiveNumber.call(this, val, 'inputValue', oldVal, this)
        if (successFlag) {
          this.$emit('updateInput', this.inputValue, this.keyVal)
        }
      } else {
        this.$emit('updateInput', this.inputValue, this.keyVal)
      }
    },
  },
  methods: {
    focusEvent () {
      // document.body.addEventListener('native.keyboardshow', function () { // 软键盘弹起事件
      // var node = document.activeElement // 当前focus的dom元素
      console.log('获取焦点')
      setTimeout(function () {
        // console.log('node.nodeName', node.nodeName)
        // if (node) {
        // if (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT') { // 如果是input或textarea
        // this.refresh = false
        // this.refresh = true
        // }
        // }
        this.$emit('focusEvent')
      }, 1000)
      // })
    },
  },
}
</script>

<style scoped lang="stylus">
.item{
    border-top 1px solid #ccc
    display flex
    font-size 14px
    .name{
        padding 15px 10px 15px 0
        flex 1
        font-weight 700
        line-height 18px
    }
    .value{
        padding 15px 10px 15px 0
        color #333
        width 200px
        text-align right
    }
    input{
        padding-right 10px
        width 220px
        margin 7px 10px 7px 0
        border 1px solid #e6e6e6
        outline none
        border-radius 5px
        text-align right
        padding 0 5px
    }
    input:disabled{
      background #f7f7f7
    }
    >>>.hips-input{
      padding 0
      input:disabled{
        color #000
        background #f7f7f7
      }
      input{
        padding-right 10px
        width 220px
        margin 5px 10px 5px 0
        border 1px solid #e6e6e6
        outline none
        border-radius 5px
        text-align right
        padding 0 5px
        height 45px
      }
      // color #333
      // padding-right 10px
      // width 220px
      // margin 7px 10px 7px 0
      // border 1px solid #e6e6e6
      // outline none
      // border-radius 5px
      // text-align right
      // padding 0 5px
      // height 30px
    }
}
</style>
