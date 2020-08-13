<!--
 * @Date: 2019-08-19 11:04:48
 * @LastEditors:
 * @LastEditTime: 2019-09-05 17:13:25
 * @Author: wengui.zhang@hand-china.com
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2019, Hand
 -->
<template>
  <hips-view
    header-height="48"
    footer-height="48"
  >
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      :title="taskStatus"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="content demo-scroll" style="height:calc(100vh)">
      <div class="scr-content">
        <Task
          v-for="item in taskList"
          :key="item.TASK_ID"
          :task="item"
          @click="goInventory(item)"
        />
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Scroll } from 'hips'
import Task from '@/components/task'
import {indicator, storage} from '@/utils'

var fromName = ''
export default {
  name: 'AssetsTaskSummary',
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    Task,
  },
  data () {
    return {
      routerParams: {}, // 路由参数
      taskList: [], // 盘点任务集合
      taskStatus: '', // 标题名称
      userNum: storage.get('empId') + '', // 用户num
    }
  },
  mounted () {
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  activated () {
    if (fromName === 'AssetsMain') {
      this.routerParams = this.$route.query
      if (this.routerParams.index === 0) { // 开始盘点
        this.getMobileTask()
        this.taskStatus = '盘点中'
      } else if (this.routerParams.index === 1) { // 已盘点
        this.getMobileTask('10')
        this.taskStatus = '已盘点'
      } else if (this.routerParams.index === 2) { // 未盘点
        this.getMobileTask('20')
        this.taskStatus = '未盘点'
      } else { // 条码丢损
        this.getMobileTask('30')
        this.taskStatus = '条码丢损'
      }
    }
  },
  methods: {
    goInventory (item) { // 点击任务卡片触发
      this.$router.pushPage({
        path: '/assets/main/function-select',
        query: {
          index: this.routerParams.index,
          task_id: item.TASK_ID,
          type: item.INVENTORY_OBJECT,
        },
      })
    },
    async getMobileTask (status) { // 任务下载
      indicator.show()
      this.taskList = []
      let params = {
        'P_EMPLOYEE_CODE': this.userNum, // 使用人
        'P_TASK_STATUS': status, // 状态--盘点中、已盘点、未盘点、条码丢损
      }
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileTaskApi', params)
        indicator.hide()
        if (!resp.data.X_MOBILE_TASK_OUT_TB) {
          this.$hips.toast('无数据')
        } else {
          this.taskList = resp.data.X_MOBILE_TASK_OUT_TB.X_MOBILE_TASK_OUT_TB_ITEM
        }
      } catch (err) {
        indicator.hide()
        console.log(err)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view
  background #fafafa!important
  >>>.hips-view__content
    overflow-y scroll
.content
  .scr-content
    padding 0 15px

</style>
