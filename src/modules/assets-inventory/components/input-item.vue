<template>
  <div class="item">
    <p class="name">
      {{ title }}
    </p>
    <input
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disableFlag"
      @input="updateInput"
    >
  </div>
</template>

<script>
export default {
  name: 'InputItem',
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
  },
  data () {
    return {
      inputValue: this.value,
    }
  },
  watch: {
    value (val, oldVal) {
      this.inputValue = val
      console.log('change', val)
    },
  },
  methods: {
    updateInput () {
      this.$emit('updateInput', this.inputValue, this.keyVal)
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
        // background-color #fafafa
        text-align right
    }
    input:disabled{
      background-color #fafafa
      color #c0c4cc
    }
}
</style>
