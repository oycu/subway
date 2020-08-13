<!--
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 17:13:25
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 -->
<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="输入搜索"
      @nav-bar-back-click="$router.backPage()"
    />
    <div slot="sub-header">
      <div class="header">
        <input v-model="inputValue" type="text" placeholder="请输入内容" @keyup.enter="search">
        <div @click="search">
          <hips-icon name="search" />
          <p>搜索</p>
        </div>
      </div>
    </div>
    <div class="demo-scroll" style="height:calc(100vh)">
      <div class="content">
        <p v-for="(item,index) in resultList" :key="index" @click="choose(item)">{{ item.RETURN_DESCRIPTION }} <span>{{ item.RETURN_CODE }}</span> </p>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Scroll, Icon } from 'hips'
import {indicator} from '@/utils'

export default {
  name: 'InputSearch',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Icon.name]: Icon,
  },
  data () {
    return {
      routerQuery: {}, // 路由参数
      inputValue: '',
      resultList: [],
    }
  },
  mounted () {
    this.routerQuery = this.$route.query
  },
  activated () {
  },
  methods: {
    loadRefresh () { // 下拉刷新
      console.log('下拉刷新')
    },
    loadMore () { // 上拉加载
      console.log('上拉加载')
    },
    search () { // 搜索
      this.getMobileView()
    },
    choose (item) {
      this.$store.commit('assetsInventory/updateState', {key: 'chooseData', value: item})
      this.$router.backPage()
    },
    async getMobileView () { // 获取值列表
      indicator.show()
      let params = {
        'P_COMPANY_ID': '',
        'P_LINE_ID': '',
        'P_DEPARTMENT_ID': '',
        'P_FIRST_WAREHOUSE': '',
        'P_SECOND_WAREHOUSE': '',
        'P_DESCRIPTION': this.inputValue,
        'P_TYPE': this.$route.query.title,
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileViewApi', params)
        indicator.hide()
        this.resultList = resp.data.X_MOBILE_DATA_VIEW_TB.X_MOBILE_DATA_VIEW_TB_ITEM
        console.log('成功', resp)
      } catch (err) {
        indicator.hide()
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view
  background #fafafa!important
  >>>.hips-view__content
    // padding 0 15px
    overflow-y scroll
.header
  padding 10px 15px
  display flex
  font-size 14px
  border-bottom 1px solid #eee
  background #fafafa
  input
    flex 1
    border 1px solid #2896ff
    border-radius 5px
    margin-right 10px
    padding-left 5px
  div
    // width 80px
    height 28px
    padding 0 20px
    border-radius 5px
    text-align center
    background #2896ff
    color #fff
    display flex
    .hips-icon
      margin auto 0
      margin-right 5px
    p
      margin auto
.content
  font-size 14px
  background-color #fff
  padding-left 15px
  border-bottom 1px solid #ccc
  span
    color gray
  p
    border-top 1px solid #ccc
    padding 10px 5px
    line-height 18px
    padding-right 10px
    word-wrap break-word
  p:first-child
    border-top none
</style>
