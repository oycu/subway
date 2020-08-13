<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 19:22:00
 * @LastEditTime: 2019-10-16 09:47:14
 * @LastEditors: Please set LastEditors
 -->
<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="资产明细"
      @nav-bar-back-click="$router.backPage()"
    />
    <div class="contain">
      <hips-button type="primary">查看设备树</hips-button>
      <asset-info :buildDetail="buildDetail.taskBuildingBillDto" />
      <div class="inventory-contain">
        <p class="header">盘点信息</p>
        <select-item
          title="盘点状态"
          :options="stateList"
          keyName="resultStatus"
          :selctValue="buildDetail.resultStatus"
          @selectChange="selectChange"
        />
        <select-item
          title="盘点轮次"
          :options="roundsList"
          keyName="inventoryTurn"
          :selctValue="buildDetail.inventoryTurn"
          @selectChange="selectChange"
        />
        <select-item
          title="盘点结果"
          :options="resultList"
          keyName="resultCode"
          :selctValue="buildDetail.resultCode"
          @selectChange="selectChange"
        />
        <select-item
          title="其他问题"
          :options="specificIssuesList"
          keyName="specificIssues"
          :selctValue="buildDetail.specificIssues"
          @selectChange="selectChange"
        />
        <input-item keyVal="resultComments" title="盘点备注" :value="buildDetail.resultComments" @updateInput="updateInput" />
        <input-item keyVal="conclusion" title="盘点结论" :value="buildDetail.conclusion" @updateInput="updateInput" />
      </div>
    </div>
    <div
      slot="footer"
      class="footer"
    >
      <div class="chosse" @click="save">
        保存
      </div>
      <div @click="cancle">取消</div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Button } from 'hips'
import AssetInfo from '../../../components/asset-information'
import EditInventory from '../../../components/inventory-informaton-edit'
import Task from '@/components/task.vue'
import SelectItem from '../../../components/select-item'
import InputItem from '../../../components/input-item'
import { indexeddb } from '../../../utils'
export default {
  name: 'HouseScanInventoryDetail',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [AssetInfo.name]: AssetInfo,
    [EditInventory.name]: EditInventory,
    [Task.name]: Task,
    SelectItem,
    InputItem,
  },
  data () {
    return {
      taskId: '',
      buildDetail: {
        taskBuildingBillDto: {
          billId: '',
          comments: '',
          contractName: '',
          contractNumber: '',
          faCategoryDesc: '',
          faNameDesc: '',
          instanceDescription: '',
          linewayName: '',
          paTaskName: '',
          poolId: '',
          projectScaleCompleted: '',
          txnNumber: '',
          unitOfMeasure: '',
        },
      },
      stateList: [],
      roundsList: [],
      resultList: [],
      specificIssuesList: [],
    }
  },
  async mounted () {
    console.log('this', this.$route.query)
    this.taskId = this.$route.query.taskId
    this.tagNum = this.$route.query.tagNum
    this.indexDB = this.$store.state.handoverInventory.indexDB
    this.getFastCode('CUX.BT.CHECK_RESULT_STATE')
    this.getFastCode('CUX.BT.CHECK_ROUNDS')
    this.getFastCode('CUX.BT.CHECK_RESULT')
    this.getFastCode('CUX.BT.OTHER_PROBLEM')
    this.getBuildDetail()
  },
  methods: {
    async getBuildDetail () { // 根据扫码的标签编号信息搜索任务清单
      try {
        let vm = this
        let queryList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'taskId,tagNum', [this.taskId, this.tagNum])
        console.log(`${this.taskId}下的查询信息`, queryList)
        if (queryList.length === 0) {
          this.$hips.dialog.alert({
            title: '提示',
            content: '<p style="line-height:22px;font-size:16px">该房建不属于此盘点任务</p>',
            okText: '确定',
            closable: false,
            onOk () {
              vm.$router.backPage()
            },
          })
        } else {
          this.buildDetail = queryList[0]
          if (!this.buildDetail.inventoryTurn) {
            this.buildDetail.inventoryTurn = 'FIRST' // 默认为首盘
          }
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async getFastCode (codeType) { // 获取值列表
      try {
        let list = []
        let stateCodeList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'fastCode', 'codeType', codeType) // 盘点状态
        // 转换成下拉框组件option接收的值
        stateCodeList.forEach(element => {
          let temp = {
            value: element.codeValue,
            label: element.meaning,
          }
          list.push(temp)
        })
        if (codeType === 'CUX.BT.CHECK_RESULT_STATE') { // 盘点状态
          this.stateList = list.filter(ele => ele.value !== '30')
        }
        if (codeType === 'CUX.BT.CHECK_ROUNDS') { // 盘点轮次 不选择条码丟损
          this.roundsList = list
        }
        if (codeType === 'CUX.BT.CHECK_RESULT') { // 盘点结果 不选择条码丟损
          this.resultList = list.filter(ele => ele.value !== '50' && ele.label !== '盘盈' && ele.label !== '增加子项')
        }
        if (codeType === 'CUX.BT.OTHER_PROBLEM') { // 其他问题
          this.specificIssuesList = list
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    /**
     * @description: 下拉框选中
     * @param {Object} selectObj 选择的对象
     * @param {String} title 选择的类型
     * @param {String} keyName 字段名称
     */
    selectChange (selectObj, title, keyName) {
      this.buildDetail[keyName] = selectObj.value
      if (keyName === 'specificIssues') {
        this.buildDetail.specificIssuesDesc = selectObj.label
      }
    },
    updateInput (val, key) { // 输入框更新
      this.buildDetail[key] = val
    },
    async save () { // 保存信息 更新数据到indexedDB中 changeFlag(数据更新标识)
      if (this.buildDetail.resultStatus === '20' && this.buildDetail.resultCode === '') {
        this.$hips.toast('需填写盘点结果')
        return
      }
      this.buildDetail.changeFlag = 1
      console.log(this.buildDetail)
      let flag = await indexeddb.updateData(this.indexDB, 'buildList', this.buildDetail)
      if (flag) {
        this.$hips.toast('提交成功')
        this.$router.backPage()
      } else {
        this.$hips.toast('提交失败')
      }
    },
    cancle () { // 取消操作
      this.buildDetail.resultStatus = ''
      this.buildDetail.inventoryTurn = ''
      this.buildDetail.resultCode = ''
      this.buildDetail.specificIssues = ''
      this.buildDetail.specificIssuesDesc = ''
      this.buildDetail.conclusion = ''
      this.buildDetail.resultComments = ''
    },
  },
}
</script>

<style scoped lang="stylus">
.hips-view{
  background #fafafa!important
  >>>.hips-view__content{
    // overflow-y scroll
  }
}

.contain {
  padding 10px 15px 10px 15px
  border-top .5px solid #eee
  background-color #fafafa
  .hips-button{
      background-color: #2896ff!important
      margin-bottom 10px
  }
}

.inventory-contain {
  border: 1px solid #DDDDCC;
  border-radius: 10px;
  padding: 5px 0px 10px 10px;
  margin-top: 10px;
  background-color #fff
  .header {
    text-align: center;
    color: #1f8ceb;
    padding: 10px 0;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
  }
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
