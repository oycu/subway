<template>
  <div class="contain">
    <div class="searchs">
      <input type="text" placeholder="固定资产目录" />
      <input type="text" placeholder="固定资产名称" />
      <input type="text" placeholder="设备名称" />
      <input type="text" placeholder="规格型号" />
      <input type="text" placeholder="安装（存放）地点" />
      <input type="text" placeholder="专业" />
    </div>
    <div class="button">
      <button class="search-btn">搜 索</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterItem',
}
</script>

<style lang="stylus" scoped>
.contain {
  padding 10px 15px
  display flex
  justify-content space-around
  align-items center
  .searchs {
    flex 1
    display flex
    justify-content space-between
    align-items center
    flex-wrap wrap
    input {
      margin-bottom 8px
      border 1px solid black
      width 125px
      padding 3px
      outline none
      text-align left
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
        text-align center
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #999;
      font-size: 16px;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #999;
      font-size: 16px;
    }
  }
  .button{
    .search-btn {
      margin-left 10px
      width 60px
      padding 7px
      background-color #1f8ceb
      color #fff
      font-size 14px
      border-radius 5px
    }
  }
}
</style>
