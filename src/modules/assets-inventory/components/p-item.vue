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
    padding 10px 10px 10px 0
    line-height 22px
    .name{
        flex 1
        font-weight 700
    }
    .value{
        font-size 14px
        color #333
        width 220px
        text-align right
        word-wrap break-word
    }
}
</style>
