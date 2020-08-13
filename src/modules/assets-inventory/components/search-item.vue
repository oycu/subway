<template>
  <div class="item">
    <p class="name">
      {{ title }}
    </p>
    <div class="right" :class="{'font-override': value}">
      <p>{{ value ? value : `请选择${title}` }}</p>
      <hips-icon name="search" />
    </div>
  </div>
</template>

<script>
import { Input, Icon } from 'hips'
export default {
  name: 'SearchItem',
  components: {
    [Input.name]: Input,
    [Icon.name]: Icon,
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
      default: '请选择地点',
    },
  },
  data () {
    return {
      searchvalue: '',
    }
  },
  methods: {
  },
}
</script>

<style scoped lang="stylus">
.item{
    // height 48px
    border-top 1px solid #ccc
    display flex
    font-size 14px
    line-height 20px
    padding 15px 5px 15px 0
    .name{
        flex 1
        font-weight 700
    }
    .right{
      width 220px
      color #b4bec8
      display flex
      font-size 14px
      padding-right 5px
      text-align right
      p{
        flex 1
        padding-right 7px
      }
      i{
        line-height 20px
        width 14px
      }
    }
  .font-override{
    color #333
  }
}

</style>
