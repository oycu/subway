<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="功能选择"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="content">
      <img class="img" src="../assets/title01.png" />
      <div class="button">
        <div @click="scanCode">扫描条码信息</div>
        <div @click="seeTaskDetail">查看任务详情</div>
        <div @click="recordInventory">盘盈信息录入</div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
var fromName
export default {
  name: 'FunctionSelect',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  data () {
    return {
      routerQuery: {}, // 路由参数
    }
  },
  async activated () {
    if (fromName === 'TaskSummary') { // 上一页面为任务汇总页
      this.routerQuery = this.$route.query // 接收参数
    }
  },
  methods: {
    scanCode () { // 扫描条码明细
      let vm = this
      const env = process.env.VUE_APP_BUILD // 环境
      if (env === 'release') { // 真机
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result.text !== '' && result.text !== 'cancel') { // 扫一扫点击取消时，返回的result.text为空
              vm.goPage(result.text)
            }
          }, function () {
            console.log('失败了')
          },
          {
            preferFrontCamera: false, // iOS and Android（是否默认前置摄像头）
            showFlipCameraButton: true, // iOS and Android（是否允许转换摄像头）
            showTorchButton: true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (是否开启手电筒)
            saveHistory: true, // Android, save scan history (default false)
            prompt: 'Place a barcode inside the scan area', // Android（提示）
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500（猜测为默认扫描时间）
            formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED（格式）
            orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device（扫描框的方向，长方形或者正方形默认是长方形）
            disableAnimations: true, // iOS
            disableSuccessBeep: false, // iOS and Android
          },
        )
      } else { // 模拟
        if (vm.routerQuery.type === '设备') {
          vm.goPage('TEST_1028004')
        } else {
          vm.goPage('null00000169')
        }
      }
    },
    seeTaskDetail () { // 查看任务详情
      if (this.$route.query.type === '设备') { // 任务为设备
        this.$router.push({
          name: 'StartInventoryList',
          query: {
            taskId: this.routerQuery.taskId, // 任务id
          },
        })
      } else { // 任务为房建
        this.$router.push({
          name: 'HouseStartInventoryList',
          query: {
            taskId: this.routerQuery.taskId, // 任务id
          },
        })
      }
    },
    recordInventory () { // 盘盈信息录入
      if (this.$route.query.type === '设备') {
        this.$router.push({
          name: 'RecordInventoryDetail',
          query: {
            taskNumber: this.routerQuery.taskNumber,
            taskId: this.routerQuery.taskId,
            taskName: this.routerQuery.taskName,
          },
        })
      } else {
        this.$router.push({
          name: 'HouseStartRecordInventory',
          query: {
            taskNumber: this.routerQuery.taskNumber,
            taskId: this.routerQuery.taskId,
          },
        })
      }
    },
    goPage (text) { // 跳转页面
      let vm = this
      if (this.routerQuery.type === '设备') { // 任务为设备
        vm.$router.push({
          name: 'ScanInventoryDetail',
          query: {
            taskId: this.routerQuery.taskId, // 任务id
            text, // 扫码信息
          },
        })
      } else { // 任务为房建
        vm.$router.push({
          name: 'HouseScanInventoryDetail',
          query: {
            taskId: this.routerQuery.taskId,
            tagNum: text,
          },
        })
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view
  background #fff!important
  >>>.hips-view__content
    overflow-y scroll
    background #fff
  .hips-nav-bar__theme-default
    border-bottom 1px solid #eee
.content
  .img
    display block
    height 130px
    width 355px
    margin 0 auto
    margin-top 60px
    margin-bottom 110px
  .button
    padding 25px
    div
      background #2598ff
      display block
      width 100%
      margin 20px auto
      height 45px
      color #fff
      line-height 45px
      text-align center
      border-radius 10px
</style>
