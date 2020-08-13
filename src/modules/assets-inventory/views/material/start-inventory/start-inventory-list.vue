<!--
 * @Author: your name
 * @Date: 2019-10-09 09:32:57
 * @LastEditTime: 2019-10-22 15:24:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /c:\Users\dzw\zhengzhouMetro\src\modules\assets-inventory\views\material\start-inventory\start-inventory-list.vue
 -->
<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      @nav-bar-back-click="$router.backPage()"
    >
      <div slot="center" class="status">
        <div :class="['left', { 'select': isSelected}]" @click="handleLeft">
          <p>未盘点</p>
        </div>
        <div :class="['right', { 'select': !isSelected}]" @click="handleRight">
          <p>已盘点</p>
        </div>
      </div>
    </hips-nav-bar>
    <div class="task-details-contain">
      <div
        v-for="(item, index) in inventoryList"
        :key="index"
        class="single-housing-contain"
        @click="goDetail(item)"
      >
        <i></i>
        <div class="header">
          <p>{{ item.MATERIAL_DESCRIPTION }}</p>
          <span>{{ item.RESULT_CODE_DESC }}</span>
        </div>
        <p-item title="物资编号" class="p-override" :value="item.MATERIAL_NUMBER" />
        <p-item title="公司" class="p-override" :value="item.COMPANY" />
        <p-item title="线路" class="p-override" :value="item.LINE" />
        <p-item title="一级库" class="p-override" :value="item.FIRST_WAREHOUSE_DESCRIPTION" />
        <p-item title="二级子库" class="p-override" :value="item.SECOND_WAREHOUSE_DESCRIPTION" />
        <p-item title="货位" class="p-override" :value="item.ALLOCATION_NAME" />
        <p-item title="物资盘点状态" class="p-override" :value="item.BILL_STATUS_DESC" />
      </div>
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar, Tabs, Tab, Popup } from 'hips'
import PItem from '../../../components/p-item'
import {indicator} from '@/utils'
import { mapGetters, mapMutations } from 'vuex'
var fromName = ''
export default {
  name: 'MaterialStartInventoryList',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Popup.name]: Popup,
    PItem,
  },
  props: {
    dataList: {
      type: Array,
      default: () => [1, 2, 3],
    },
  },
  beforeRouteEnter (to, from, next) {
    fromName = from.name
    next()
  },
  data () {
    return {
      isSelected: true,
      inventoryList: [],
    }
  },
  activated () {
    if (fromName === 'AssetsFunctionSelect') {
      this.routerParams = this.$route.query
      this.handleLeft()
    } else {
      let success = this.getSuceessFlagType()
      if (success) {
        this.isSelected ? this.getMobileItemList('10') : this.getMobileItemList('20')
        this.setSuceessFlagType(false)
      }
    }
  },
  methods: {
    ...mapGetters({
      getSuceessFlagType: 'assetsInventory/getSuceessFlag',
    }),
    ...mapMutations({
      setSuceessFlagType: 'assetsInventory/setSuceessFlag',
    }),
    handleLeft () {
      this.getMobileItemList('10') // 未盘点
      this.isSelected = true
    },
    handleRight () {
      // 已完成跳转
      this.getMobileItemList('20') // 账实相符
      this.isSelected = false
    },
    goDetail (item) {
      this.$router.push({
        name: 'MaterialDetail',
        query: {
          materialDetail: item,
          taskId: this.routerParams.task_id,
        },
      })
    },
    async getMobileItemList (status) { // 物资任务下载接口
      this.inventoryList = []
      indicator.show()
      let params = {
        'P_TASK_ID': this.routerParams.task_id, // 单据头Id
        'P_CHECK_STATUS': status,
      }
      console.log(params)
      try {
        let resp = await this.$store.dispatch('assetsInventory/getMobileItemListApi', params)
        indicator.hide()
        this.inventoryList = resp.data.X_MOBILE_DATA_LINEITEM_OUT_TB.X_MOBILE_DATA_LINEITEM_OUT_TB_ITEM
        console.log('成功', resp)
        if (!this.inventoryList) {
          this.$hips.toast({
            message: '无数据',
            position: 'middle',
          })
        }
      } catch (err) {
        console.log(err)
        indicator.hide()
      }
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
  padding: 15px

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
  border-radius: 20px 0 0 20px;

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
  .single-housing-contain {
    border .5px solid #DDDDCC
    border-radius 10px
    padding 15px 0 5px 15px
    box-shadow 2px 2px 4px rgba(0, 0, 0, 0.2)
    margin 0 auto
    margin-top 16px
    background-color #fff
    position relative
    i {
      position absolute
      left 0px
      top 10px
      width 5px
      height 20px
      background-color #1f8ceb
    }
    .header {
      display flex
      justify-content space-between
      font-weight bolder
      padding 0 10px 10px 0
      corlor #ccc
      span {
        font-weight normal
        font-size 14px
      }
      p{
        width 200px
      }
    }
  }
}

>>>.p-override {
  padding 10px 10px 10px 0
  .value{
    color rgb(133, 133, 133)
  }
}

>>> .hips-tab__panel {
  padding: 1px 0;
  background-color: #fafafa;
}

.override {
  padding: 0 !import;
}
</style>
