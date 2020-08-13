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
      title="资产明细"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="content" style="height:calc(100vh)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[deviceList]"
        @pulling-up="loadMore"
      >
        <div class="button">
          <hips-button type="primary">查看设备树</hips-button>
          <hips-button type="primary" @click="addNode">增加节点</hips-button>
          <hips-button type="primary" @click="addSurplus">一键盘盈</hips-button>
        </div>
        <div class="inventory-item">
          <div class="table">
            <thead class="table-header">
              <tr>
                <td class="boder">序号</td>
                <td>导入标识</td>
                <td>安装地点</td>
                <td>设备名称</td>
                <td>标签编号</td>
                <td>固定资产目录</td>
                <td>固定资产名称</td>
                <td>组合码</td>
                <td>层级码</td>
                <td>设备名称</td>
                <td>规格型号</td>
                <td>制造商</td>
                <td>计量单位</td>
                <td>合同数量（变更后）</td>
                <td>四方验收单数量</td>
                <td>安装数量</td>
                <td>合同设备单价(元）</td>
                <td>安装（存放）地点</td>
                <td>资产状态</td>
                <td>资产性质</td>
                <td>其他问题</td>
                <td>盘点结论</td>
                <td>备注</td>
              </tr>
            </thead>
            <tbody v-for="(item,index) in deviceList" :key="index" :class="{'checked':index === currentIndex,'change':item.changeFlag}">
              <tr @click="showMore(item,index)">
                <td class="boder">{{ index+1 }}</td>
                <td>{{ item.taskDeviceBillDto.batchId }}</td>
                <td>{{ item.taskDeviceBillDto.locationCode }}</td>
                <td>{{ item.taskDeviceBillDto.instanceDescription }}</td>
                <td>{{ item.taskDeviceBillDto.tagNum }}</td>
                <td>{{ item.taskDeviceBillDto.faCategoryDesc }}</td>
                <td>{{ item.taskDeviceBillDto.faNameDesc }}</td>
                <td>{{ item.taskDeviceBillDto.combineCode }}</td>
                <td>{{ item.taskDeviceBillDto.hierarchicalCode }}</td>
                <td>{{ item.taskDeviceBillDto.instanceDescription }}</td>
                <td>{{ item.taskDeviceBillDto.specification }}</td>
                <td>{{ item.taskDeviceBillDto.manufacturer }}</td>
                <td>{{ item.taskDeviceBillDto.unitOfMeasure }}</td>
                <td>{{ item.taskDeviceBillDto.conItemQuantity }}</td>
                <td>{{ item.taskDeviceBillDto.inspectionQuantity }}</td>
                <td>{{ item.taskDeviceBillDto.installationQuantity }}</td>
                <td>{{ item.taskDeviceBillDto.conItemUnitPrice }}</td>
                <td>{{ item.taskDeviceBillDto.locationCode }}</td>
                <td>{{ item.taskDeviceBillDto.objectStatus }}</td>
                <td>{{ item.taskDeviceBillDto.objectNature }}</td>
                <td>{{ item.specificIssuesDesc }}</td>
                <td>{{ item.conclusion }}</td>
                <td>{{ item.taskDeviceBillDto.comments }}</td>
              </tr>
            </tbody>
          </div>
        </div>
      </hips-scroll>
    </div>
    <div slot="footer" class="footer">
      <div class="chosse" @click="$router.backPage()">返回</div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'

import { indexeddb } from '../../../utils'
import { leftRightScroll } from '@/utils'
import { mapGetters, mapMutations } from 'vuex'

var fromName = ''
const i18n = {
  'zh-CN': {
    spaceTitle: '留白占位区域',
    nestScrollTitle: '嵌套滚动区域',
    backTop: '点我回到顶部',
    refreshTxt: '刷新成功',
    moreTxt: '',
    noMoreTxt: '',
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
  name: 'ScanInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
  },
  beforeRouteEnter (to, form, next) {
    fromName = form.name
    next(() => {
    })
  },
  data () {
    return {
      scrollOption: {
        pullDownRefresh: false,
        pullUpLoad: {
          txt: {
            more: i18n[this.$hipsLang]['moreTxt'],
            noMore: i18n[this.$hipsLang]['noMoreTxt'],
          },
        },
      },
      routerQuery: {}, // 路由信息
      indexDB: {},
      deviceList: [], // 设备列表
      inventoryDetail: {}, // 清单信息
      deviceBill: {}, // 清单基本信息
      currentIndex: null, // 当前索引值
    }
  },
  async activated () {
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.currentIndex = null
    if (fromName !== 'EditInventoryDetail') {
      this.routerQuery = this.$route.query // 接收路由参数
    }
    this.getDeviceListByBillId() // 根据taskId tagNum匹配清单信息
  },
  methods: {
    ...mapGetters({
      getDeviceList: 'handoverInventory/getDeviceList',
    }),
    ...mapMutations({
      setDeviceList: 'handoverInventory/setDeviceList',
    }),
    loadMore () { // 上拉加载
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate()
      })
    },
    addNode () { // 增加节点
      this.$router.push({
        name: 'AddNode',
        query: {
          taskId: this.routerQuery.taskId, // 任务id
          taskNumber: this.deviceList[0].taskNumber, // 任务编号
          taskName: this.deviceList[0].taskName, // 任务名
          tagNum: this.deviceList[0].tagNum}, // 清单编号
      })
    },
    addSurplus () {
      let vm = this
      vm.$hips.dialog.confirm({
        content: '<p style="line-height:22px;font-size:16px">确认一键盘盈？</p>',
        // closable: true,
        okText: '确认',
        cancelText: '取消',
        // closable: false,
        async onOk () { // 是
          vm.setDeviceList(vm.deviceList)
          vm.$router.push({
            name: 'StartRecordInventory',
            query: {
              taskId: vm.routerQuery.taskId, // 任务id
              taskNumber: vm.deviceList[0].taskNumber, // 任务编号
              taskName: vm.deviceList[0].taskName, // 任务名
              tagNum: vm.deviceList[0].tagNum}, // 清单编号
          })
        },
        onCancel () {
        },
      })
    },
    async showMore (item, index) { // 查看盘点信息
      this.currentIndex = index
      let info = await this.getDeviceListByBillId() // 重新获取表中的清单信息

      if (item.resultCode === '70' || item.resultCode === '10') {
        this.addInventory = this.deviceList[index]
        this.$router.push({
          name: 'AddNode',
          query: {
            taskId: this.routerQuery.taskId,
            addInventory: this.addInventory },
        })
      } else {
        this.inventoryDetail = this.deviceList[index] // 清单盘点信息
        if (this.inventoryDetail.resultStatus === '10') { // 盘点状态默认为已盘点
          this.inventoryDetail.resultStatus = '20'
        }
        if (this.inventoryDetail.inventoryTurn === '') { // 盘点轮次默认为首盘
          this.inventoryDetail.inventoryTurn = 'FIRST'
        }
        this.deviceBill = item.taskDeviceBillDto // 清单基本信息
        this.$router.push({
          name: 'EditInventoryDetail',
          query: {
            inventoryDetail: this.inventoryDetail },
        })
      }
    },
    async getDeviceListByBillId () { // 根据taskId tagNum匹配清单信息
      let vm = this
      // console.log('this.routerQuery', this.routerQuery)
      // console.log('this.indexDB', this.indexDB)

      this.deviceList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'deviceList', ['taskId', 'tagNum'], [this.routerQuery.taskId, this.routerQuery.text])
      // console.log('deviceList', deviceList)
      var Arr = JSON.parse(JSON.stringify(this.deviceList))
      // let str = ''
      // for(var i in Arr){
      //   str += '---'+ Arr[i].taskDeviceBillDto.hierarchicalCode      
      // }
      // console.log('str',str)
      for(let j=0;j<Arr.length;j++){
        let a = Arr[j].taskDeviceBillDto.hierarchicalCode
        for(let o=j+1;o<Arr.length;o++){
          let b = Arr[o].taskDeviceBillDto.hierarchicalCode
          let temp 
          if(a>b){
            temp = Arr[o]
            Arr[o] = Arr[j]
            Arr[j] = temp
          }
        }
      }
      // let str1 = ''
      // for(var i in Arr){
      //   str1 += '---'+ Arr[i].taskDeviceBillDto.hierarchicalCode      
      // }
      // console.log('str1',str1)
      this.deviceList = Arr
      if (this.deviceList.length === 0) {
        vm.$hips.dialog.alert({
          content: '<p style="line-height:22px;font-size:16px">该设备不属于此盘点任务！</p>',
          okText: '确定',
          closable: false,
          onOk () {
            // on OK
            vm.$router.backPage()
          },
        })
      } else {
        // 禁用上拉加载
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate()
        })
        leftRightScroll(this)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view{
  background #fafafa!important
  >>>.hips-view__content{
    overflow-y scroll
  }
  .hips-nav-bar__theme-default{
    border-bottom 1px solid #eee
  }
  >>>.hips-scroll__content{
    padding 0 15px 15px
  }
}
.content{
  margin-top 10px
  overflow scroll
  .button{
    .hips-button{
      background-color: #2896ff!important
      flex 1
      margin-right 15px
    }
    .hips-button:last-child{
      margin-right 0
    }
  }
  .checked{
    background #ffe4d4!important
  }
}
tr{
  height 25px
  td{
    padding 6px 10px
    border 1px solid #eee
    text-align center
    white-space nowrap
  }
  td:first-child{
      border none
  }
  .detail{
      width 100%
  }
}
.table-header{
    width 100%
    overflow hidden
    td{
        background #dbebf9
        color black
    }
}
.boder{
    border 1px solid #eee!important
    + td{
        border 1px solid #eee!important
    }
}
input{
    outline none
}
.button{
    td{
        background red
    }
    tr td:first-child{
        background #fff
    }
    margin-bottom 15px
}
.inventory-item{
  overflow auto
  border 1px solid #eeeeee
  border-radius 10px
}
.table{
  font-size 14px
}
.hips-popup--bottom{
  max-height 520px
  height auto
  border-radius 15px 15px 0 0
}
.border-bot{
  border-bottom 1px solid #ccc!important
}
.footer{
  display flex
  height 100%
  text-align center
  color: #48D2A0;
  div{
    flex 1
    margin auto 0
  }
  div:first-child{
    color #108AEE
  }
  i{
    margin-right 10px
  }
}

</style>
