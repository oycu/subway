<template>
  <!-- <hips-cell
    class="item"
    :title="title"
    :class="{'font-override': value}"
    :value="value ? value : `请选择${title}`"
    value-align
    is-link
  /> -->
  <hips-cell
    class="item"
    :title="title"
    :class="{'font-override': value}"
    :value="value ? value : `请选择${title}`"
    value-align
    is-link
  />
</template>

<script>
import { Cell } from 'hips'
export default {
  name: 'PItem',
  components: {
    [Cell.name]: Cell,
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
  },
  methods: {
  },
}
</script>

<style scoped lang="stylus">
.item{
    height 48px
    border-top 1px solid #ccc
    font-size 14px
    padding 15px 10px 15px 0
}

>>>.hips-cell__title{
  span{
    font-weight 700
    color #000
  }
}

>>>.hips-cell__value{
  color rgb(180, 190, 200)
  width 220px
  flex none
}
.font-override >>>.hips-cell__value{
  color #333
}
</style>
