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
        <div v-if="routerQuery.type === '设备'" @click="scanCode">扫描条码信息</div>
        <div @click="seeTaskDetail">查看任务详情</div>
        <div @click="recordInventory">盘盈信息录入</div>
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import { storage } from '@/utils'
var fromName
export default {
  name: 'AssetsFunctionSelect',
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
      routerQuery: {}, // 路由参数  路由参数
    }
  },
  activated () {
    if (fromName === 'AssetsTaskSummary') {
      this.routerQuery = this.$route.query
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
              storage.set('scanresult', result)
              let resultText = result.text
              let rule = /\n\r/
              resultText = resultText.replace(rule, '') // 扫码得到的数据可能有空格和回车
              storage.set('resultText', resultText)
              vm.$router.push({
                name: 'AssetsScanInventoryDetail',
                query: {
                  task_id: vm.routerQuery.task_id,
                  asset_number: resultText,
                },
              })
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
        let resultText = 'null00000148'
        let rule = /\n\r/
        resultText = resultText.replace(rule, '')
        vm.$router.push({
          name: 'AssetsScanInventoryDetail',
          query: {
            task_id: this.routerQuery.task_id,
            asset_number: resultText,
          },
        })
      }
    },
    seeTaskDetail () { // 查看任务详情
      if (this.routerQuery.type === '设备') {
        if (Number(this.routerQuery.index) === 0) {
          this.$router.pushPage({
            name: 'AssetsStartInventoryList',
            query: {
              task_id: this.routerQuery.task_id,
              index: this.routerQuery.index,
            },
          })
        }
        if (Number(this.routerQuery.index) === 1) {
          this.$router.pushPage({
            name: 'AssetsAlreadyInventoryList',
            query: {
              task_id: this.routerQuery.task_id,
              index: this.routerQuery.index,
            },
          })
        }
        if (Number(this.routerQuery.index) === 2) {
          this.$router.pushPage({
            name: 'AssetsNoInventoryList',
            query: {
              task_id: this.routerQuery.task_id,
              index: this.routerQuery.index,
            },
          })
        }
        if (Number(this.routerQuery.index) === 3) {
          this.$router.pushPage({
            name: 'AssetsCodeInventoryList',
            query: {
              task_id: this.routerQuery.task_id,
            },
          })
        }
      }
      if (this.routerQuery.type === '物资') {
        if (Number(this.routerQuery.index) === 0) {
          this.$router.pushPage({
            name: 'MaterialStartInventoryList',
            query: {
              task_id: this.routerQuery.task_id,
              index: this.routerQuery.index,
            },
          })
        } else {
          this.$router.pushPage({
            name: 'MaterialInventoryList',
            query: {
              task_id: this.routerQuery.task_id,
              index: this.routerQuery.index,
            },
          })
        }
      }
    },
    recordInventory () { // 盘盈信息录入
      if (this.routerQuery.type === '设备') {
        this.$router.push({
          name: 'AssetsStartRecordInventory',
          query: {
            task_id: this.routerQuery.task_id,
          },
        })
      }
      if (this.routerQuery.type === '物资') {
        this.$router.push({
          name: 'MaterialRecordInventory',
          query: {
            task_id: this.routerQuery.task_id,
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
.content
  .img
    display block
    height 130px
    width 355px
    margin 0 auto
    margin-top 60px
    // margin-bottom 110px
  .button
    position absolute
    bottom 70px
    padding 25px
    width 100%
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
