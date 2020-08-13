<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="搜索"
      @nav-bar-back-click="$router.backPage()"
    />
    <div slot="sub-header">
      <div class="input-override">
        <hips-input
          v-model="inputValue"
          placeholder="请输入内容"
          label-icon="search"
          type="text"
          label-position="left"
          input-align="left"
          @on-enter="search"
        />
      </div>
    </div>
    <div class="content demo-scroll" style="height:calc(100vh)">
      <div class="scr-content">
        <p v-for="(item,index) in departmentList" :key="index" @click="choose(item)">{{ item.RETURN_DESCRIPTION }} {{ item.RETURN_CODE }}</p>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Scroll, Input } from 'hips'
import {indicator} from '@/utils'

const i18n = {
  'zh-CN': {
    spaceTitle: '留白占位区域',
    nestScrollTitle: '嵌套滚动区域',
    backTop: '点我回到顶部',
    refreshTxt: '刷新成功',
    moreTxt: '上拉加载更多',
    noMoreTxt: '没有更多数据',
  },
  'en-US': {
    spaceTitle: 'Space Section',
    nestScrollTitle: 'Nest Scroll Section',
    backTop: 'Click Me Back To The Top',
    refreshTxt: 'Refresh Success',
    moreTxt: 'Pull Up And Load More',
    noMoreTxt: 'No More Data',
  },
}
export default {
  name: 'Search',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Input.name]: Input,
  },
  data () {
    return {
      scrollOption: {
        pullDownRefresh: {
          threshold: 60, // 触发 pullingDown 的距离
          stop: 40, // pullingDown 正在刷新 hold 时的距离
          // txt: i18n[this.$hipsLang]['refreshTxt'],
        },
        pullUpLoad: {
          txt: {
            more: i18n[this.$hipsLang]['moreTxt'],
            noMore: i18n[this.$hipsLang]['noMoreTxt'],
          },
        },
      },
      backgroundColor: '#fff',
      list: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      routerQuery: {},
      departmentList: [],
      inputValue: '',
    }
  },
  mounted () {
    this.routerQuery = this.$route.query
    this.getMobileView()
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
    choose (item) {
      this.$store.commit('assetsInventory/updateState', {key: 'chooseData', value: item})
      this.$router.backPage()
    },
    async getMobileView () { // 获取值列表
      indicator.show()
      let params = {
        'P_TYPE': this.routerQuery.title,
        'P_COMPANY_ID': this.routerQuery.companyId,
        'P_LINE_ID': this.routerQuery.lineId,
        'P_DEPARTMENT_ID': '',
        'P_FIRST_WAREHOUSE': '',
        'P_SECOND_WAREHOUSE': '',
        'P_DESCRIPTION': this.inputValue,
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileViewApi', params)
        indicator.hide()
        if (!resp.data.X_MOBILE_DATA_VIEW_TB) {
          this.$hips.toast('无数据')
        }
        this.departmentList = resp.data.X_MOBILE_DATA_VIEW_TB.X_MOBILE_DATA_VIEW_TB_ITEM
        console.log('成功', resp)
      } catch (err) {
        indicator.hide()
      }
    },
    search () {
      this.getMobileView()
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view{
  >>>.hips-view__content{
    overflow-y scroll
  }
  .hips-nav-bar__theme-default{
    border-bottom 1px solid #eee
  }
}
.content
  .scr-content
    background-color #fff
    padding-left 15px
    border-bottom 1px solid #ccc
    border-top 1px solid #ccc
    p{
      border-top 1px solid #ccc
      padding 10px 10px
      word-wrap break-word
      font-size 14px
      line-height 18px
    }
    p:first-child{
      border-top none
    }
.input-override
  padding 7px 15px
  background #fafafa
>>>.hips-input{
  border 1px solid #2896ff
  height 30px
  border-radius 5px
  margin-bottom auto 0
}

>>>.hips-input__input-value{
  input{
    height 26px
  }
}
</style>
