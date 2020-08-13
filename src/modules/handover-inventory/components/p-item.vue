<template>
  <div class="item">
    <p class="name">
      {{ title }}
    </p>
    <p class="value">
      {{ value }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'PItem',
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
}
</script>

<style scoped lang="stylus">
.item{
    border-top 1px solid #ccc
    display flex
    font-size 14px
    padding 15px 10px 15px 0
    .name{
        flex 1
        font-weight 700
    }
    .value{
        color #333
        width 200px
        text-align right
    }
    input{
        width 220px
        margin 7px 10px
        border 1px solid #eee
        outline none
    }
}
</style>
