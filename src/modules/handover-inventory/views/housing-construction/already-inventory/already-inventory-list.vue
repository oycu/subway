<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 19:22:00
 * @LastEditTime: 2019-10-30 10:30:30
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
      title="已盘点"
      :right-buttons="[
        {
          buttonIcon: 'search',
          buttonLabel: ''
        },
      ]"
      @nav-bar-back-click="$router.backPage()"
      @nav-bar-right-click="search"
    />
    <hips-tabs v-model="active">
      <hips-tab title="账实相符" class="override" @click.native="select('账实相符')" />
      <hips-tab title="有差异" @click.native="select('有差异')"></hips-tab>
      <hips-tab title="盘盈" @click.native="select('盘盈')"></hips-tab>
      <hips-tab title="盘亏" @click.native="select('盘亏')"></hips-tab>
    </hips-tabs>
    <div class="task-details-contain">
      <single-housing v-for="(item, index) in buildList" :key="index" :buildDetail="item.taskBuildingBillDto" @click.native="goDetail(item)" />
    </div>
    <hips-popup v-model="showPopup" position="top" @click-overlay="cancel">
      <div class="pop-content">
        <p class="title">筛选</p>
        <input-item keyVal="faCategoryDesc" title="固定资产目录" :value="searchCollection.faCategoryDesc" @updateInput="updateInput" />
        <input-item keyVal="faNameDesc" title="固定资产名称" :value="searchCollection.faNameDesc" @updateInput="updateInput" />
        <input-item keyVal="instanceDescription" title="房建/轨道名称" :value="searchCollection.instanceDescription" @updateInput="updateInput" />
        <input-item keyVal="btsMajorDesc" title="专业" :value="searchCollection.btsMajorDesc" @updateInput="updateInput" />
        <div class="button">
          <p @click="cancel">取消</p>
          <p @click="confirm">确定</p>
        </div>
      </div>
    </hips-popup>
  </hips-view>
</template>

<script>
import { View, NavBar, Tabs, Tab, Popup } from 'hips'
import InputItem from '../../../components/input-item'
import SingleHouse from '../../../components/single-housing'
import { indexeddb } from '../../../utils'
var fromName = ''
export default {
  name: 'HouseAlreadyInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Popup.name]: Popup,
    [SingleHouse.name]: SingleHouse,
    InputItem,
  },
  props: {
    dataList: {
      type: Array,
      default: () => [1, 2, 3],
    },
  },
  data () {
    return {
      active: 0,
      showPopup: false,
      indexDB: {},
      buildDetail: {
        taskBuildingBillDto: {
          faCategoryDesc: '',
          faNameDesc: '',
          instanceDescription: '',
          btsMajorDesc: '',
        },
      },
      buildList: [],
      searchCollection: { // 搜索字段
        faCategoryDesc: '', // 固定资产目录
        faNameDesc: '', // 固定资产名称
        instanceDescription: '', // 房建/轨道名称
        btsMajorDesc: '', // 专业
      },
    }
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    console.log(fromName)
    next()
  },
  async activated () {
    if (fromName === 'TaskSummary') {
      this.routerQuery = this.$route.query
      console.log('activated route', this.routerQuery)
      this.indexDB = this.$store.state.handoverInventory.indexDB
      this.getBuildListByTaskId('20', '30')
      this.active = 0
    }
  },
  methods: {
    search () {
      this.showPopup = true
      this.searchCollection.faCategoryDesc = ''
      this.searchCollection.faNameDesc = ''
      this.searchCollection.instanceDescription = ''
      this.searchCollection.btsMajorDesc = ''
    },
    cancel () {
      this.showPopup = false
    },
    async confirm () {
      // 'faCategoryDesc', 'faNameDesc', 'instanceDescription', 'btsMajorDesc'
      this.showPopup = false
      console.log(this.searchCollection)
      let params = ['', '', '', '']
      Object.keys(this.searchCollection).forEach((item, index) => {
        params[index] = this.searchCollection[item]
      })
      console.log('搜索内容', params)
      if (this.active === 0) { // 账实相符
        try {
          this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '30', this.routerQuery.taskId], params)
          if (this.buildList.length === 0) {
            this.$hips.toast('无数据')
          }
        } catch (err) {
          console.log(err)
        }
      } else if (this.active === 1) { // 有差异
        try {
          this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '40', this.routerQuery.taskId], params)
          if (this.buildList.length === 0) {
            this.$hips.toast('无数据')
          }
        } catch (err) {
          console.log(err)
        }
      } else if (this.active === 2) { // 盘盈
        try {
          this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '10', this.routerQuery.taskId], params)
          if (this.buildList.length === 0) {
            this.$hips.toast('无数据')
          }
        } catch (err) {
          console.log(err)
        }
      } else { // 盘亏
        try {
          this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', ['20', '20', this.routerQuery.taskId], params)
          if (this.buildList.length === 0) {
            this.$hips.toast('无数据')
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    select (val) {
      if (val === '账实相符') {
        this.getBuildListByTaskId('20', '30')
      } else if (val === '有差异') {
        this.getBuildListByTaskId('20', '40')
      } else if (val === '盘盈') {
        this.getBuildListByTaskId('20', '10')
      } else {
        this.getBuildListByTaskId('20', '20')
      }
    },
    goDetail (item) {
      // 跳转到资产明细页
      console.log('即将跳转', item)
      this.$router.push({
        name: 'HouseShowInventoryDetail',
        query: {
          buildDetail: item,
          taskId: this.routerQuery.taskId,
        },
      })
    },
    /**
     * @description 获取单个taskId下的房建清单(包含盘点结果)
     * @param {String} resultStatus 盘点状态
     * @param {String} resultCode 盘点结果
     * @return:
     */
    async getBuildListByTaskId (resultStatus = '', resultCode = '') { // 盘点状态 盘点结果
      console.log('this.routerQuery.taskId', this.routerQuery.taskId)
      this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'SingleTaskId', [resultStatus, resultCode, this.routerQuery.taskId])
      console.log('buildList', resultCode, resultCode, this.buildList)
      if (this.buildList.length === 0) {
        this.$hips.toast('无数据')
      }
    },
    updateInput (val, key) {
      this.searchCollection[key] = val
    },
  },
}
</script>

<style lang="stylus" scoped>
.status {
  width: 150px;
  height: 30px;
  margin: 0 auto;
  border: 1px solid #ddc;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.hips-popup--top {
  top: 55px;
}

.pop-content {
  padding: 10px 15px 0;

  .item {
    border: none;
  }

  .button {
    display: flex;
    height: 48px;
    line-height: 48px;
    border-top: 1px solid #ccc;

    p {
      flex: 1;
      text-align: center;
      color: #108aee;
    }

    p:last-child {
      color: #48d2a0;
    }
  }

  .title {
    color: #2896ff;
    text-align: center;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
}

.select {
  background-color: #2896ff;
  color: #fff;
}

.left {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  // border 1px solid #ddc
  border-radius: 20px 0 0 20px;

  // background-color: #0079f3;
  p {
    margin: auto 0;
  }
}

.right {
  flex: 1;
  height: 100%;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column-reverse;

  p {
    margin: auto 0;
  }
}

.task-details-contain {
  margin-top: 0.5px solid #fafafa;
  padding: 0 15px 10px 15px;
  background-color: #fafafa;
  overflow: auto;
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.override {
  padding: 0 !import;
}
</style>
