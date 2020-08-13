<template>
  <div class="contain">
    <div class="searchs">
      <input type="text" placeholder="固定资产目录" />
      <input type="text" placeholder="固定资产名称" />
      <input type="text" placeholder="房建/轨道名称" />
      <input type="text" placeholder="专业" />
    </div>
    <div>
      <button class="search-btn">搜 索</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'house-search',
  }
</script>

<style lang="stylus" scoped>
.contain {
  border 5px solid #665577
  padding 3px
  display flex
  justify-content space-around
  align-items center
}

.searchs {
  width 270px
  display flex
  justify-content space-between
  align-items center
  flex-wrap wrap
}

.searchs input {
  border 1px solid black
  width 120px
  padding 3px
  text-align center
}

.search-btn {
  width 70px
  padding 7px
  background-color #1f8ceb
  color #fff
  font-size 14px
  border 3px solid #773366
  border-radius 5px
}
</style>