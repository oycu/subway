<!--
 * @Description: In User Settings Edit}
 * @Author: your name
 * @Date: 2019-09-16 11:15:10
 * @LastEditTime: 2019-10-22 09:15:02
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
      title="条码丢损"
      :right-buttons="[
        {
          buttonIcon: 'search',
          buttonLabel: ''
        },
      ]"
      @nav-bar-back-click="$router.backPage()"
      @nav-bar-right-click="search"
    ></hips-nav-bar>
    <div class="task-details-contain">
      <single-housing v-for="item in buildList" :key="item.id" :buildDetail="item.taskBuildingBillDto" @click.native="goDetail(item)" />
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
import { View, NavBar, Popup } from 'hips'
import InputItem from '../../../components/input-item'
import SingleHouse from '../../../components/single-housing'
import { indexeddb } from '../../../utils'

var fromName = ''
export default {
  name: 'HouseCodeInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
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
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    console.log(fromName)
    next()
  },
  data () {
    return {
      active: 0,
      showPopup: false,
      indexDB: {},
      buildList: [
        {
          taskBuildingBillDto: {},
        },
      ],
      searchCollection: {
        // 'faCategoryDesc', 'faNameDesc', 'instanceDescription', 'btsMajorDesc', 'taskId'
        faCategoryDesc: '',
        faNameDesc: '',
        instanceDescription: '',
        btsMajorDesc: '',
      },
    }
  },
  async activated () {
    console.log('actived')
    this.indexDB = this.$store.state.handoverInventory.indexDB
    if (fromName === 'TaskSummary') {
      this.routerParams = this.$route.query
      console.log('routerParams', this.routerParams)
    }
    this.getBuildList()
    console.log(fromName)
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
      // db, storename, indexName, indexValue
      this.showPopup = false
      console.log(this.searchCollection)
      let params = ['', '', '', '']
      Object.keys(this.searchCollection).forEach((item, index) => {
        params[index] = this.searchCollection[item]
      })
      console.log('搜索内容', params)
      try {
        this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'StatusTaskId', ['30', this.routerParams.taskId], params)
        if (this.buildList.length === 0) {
          this.$hips.toast('无数据')
        }
      } catch (err) {
        console.log(err)
      }
    },
    goDetail (item) {
      this.$router.push({
        name: 'HouseShowInventoryDetail',
        query: {
          buildDetail: item,
          taskId: this.routerParams.taskId,
        },
      })
    },
    async getBuildList () {
      try {
        this.buildList = await indexeddb.cursorGetDataByIndex(this.indexDB, 'buildList', 'StatusTaskId', ['30', this.routerParams.taskId])
        console.log('任务列表', this.buildList)
        if (this.buildList.length === 0) {
          this.$hips.toast('无数据')
        }
      } catch (err) {
        console.log(err)
      }
    },
    updateInput (val, key) {
      this.searchCollection[key] = val
    },
  },

}
</script>

<style lang="stylus" scoped>
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

.task-details-contain {
  margin-top: 0.5px solid #fafafa;
  background-color: #fafafa;
  overflow: auto;
  padding 0 15px 10px 15px
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.override {
  padding: 0 !import;
}
</style>
