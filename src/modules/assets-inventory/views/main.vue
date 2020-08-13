<!--
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 17:12:33
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
      @nav-bar-back-click="goBack"
    >
      <div slot="right">
        <span style="margin-right:10px;">{{ userName }}</span><span style="margin-right:10px">{{ userNum }}</span>
      </div>
    </hips-nav-bar>

    <div class="img">
      <img src="../assets/banner.png" alt="">
    </div>
    <!-- 两端对齐 -->
    <div class="mainRoute">
      <div
        v-for="(item, index) in routeList"
        :key="index"
        class="routePage"
        @click="toPage(index)"
      >
        <div class="pageDetail">
          <div class="left">
            <i class="iconfont" :class="item.icon"></i>
          </div>
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Slide, SlideItem, Row, Col } from 'hips'
import { storage } from '@/utils'
export default {
  name: 'AssetsMain',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Slide.name]: Slide,
    [SlideItem.name]: SlideItem,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  data () {
    return {
      routeList: [ // 模块列表
        {
          icon: 'iconbianji',
          title: '开始盘点',
          key: 'start',
        },
        {
          icon: 'iconquerengongdan',
          title: '已盘任务',
          key: 'over',
        },
        {
          icon: 'iconshalou',
          title: '未盘任务',
          key: 'unstart',
        },
        {
          icon: 'iconico',
          title: '条码丢损',
          key: 'lost',
        },

      ],
      userName: storage.get('userName'), // 用户名
      userNum: storage.get('empId') + '', // 用户num
    }
  },
  mounted () {
  },
  methods: {
    toPage (index) {
      // 开始盘点/已盘任务/未盘任务/条码丟损模块
      this.$router.push({
        name: 'AssetsTaskSummary',
        query: {
          index: index,
        },
      })
    },
    goBack () { // 退出子应用--调用原生方法返回
      cordova.exec(null, null, 'BridgePlugin', 'closeWebView', [])
    },
  },
}
</script>

<style scoped lang="stylus">
  .img
      img
        width 100%
        height 120px
  .mainRoute
    padding 10px
    display flex
    flex-wrap wrap
    text-align center
    .routePage
       height 70px
       width 47.5%
       margin-bottom 10px
       border-radius 4px
       background white
       .pageDetail
         display flex
         margin-left 15px
         align-items center
         height 100%
         .iconfont
            font-size 27px
         .left
            width 45px
            height 45px
            background #2697ff
            border-radius 50%
            color #fff
            line-height 45px
         p
            margin-left 20px
            font-family: PingFangSC-Regular
            font-size: 14px
            color: #4A4A4A
            letter-spacing: 0
            margin-left 7px
            font-weight 700
    .routePage:nth-child(odd)
          margin-right 2.5%
    .routePage:nth-child(even)
          margin-left 2.5%
  >>>.hips-view__content
    background #eee
.hips-dialog__content-message
  line-height 22px
</style>
