<template>
  <div class="inventory-item" @scroll="scrollEvent">
    <table class="table">
      <thead class="table-header">
        <tr>
          <td v-if="checkFlag">
            <i
              v-if="checkbox"
              class="iconfont iconxuanzekuang1"
              @click.stop.prevent="change(false)"
            ></i>
            <i v-if="!checkbox" class="iconfont iconxuanzekuang" @click.stop.prevent="change(true)"></i>
          </td>
          <td>安装地点</td>
          <td>设备名称</td>
          <td>标签编码</td>
          <td>组合码（盘点）</td>
          <td>层级码（盘点）</td>
          <td>导入标识</td>
          <td>事务处理单号</td>
          <td>盘点状态</td>
        </tr>
      </thead>
      <tbody
        v-for="(item,index) in billDetailList"
        :key="index"
        :class="{'change':item.changeFlag}"
      >
        <tr>
          <td v-if="checkFlag">{{ index+1 }}</td>
          <td>{{item.taskDeviceBillDto.locationCode}}</td>
          <td>{{item.taskDeviceBillDto.instanceDescription}}</td>
          <td>{{ item.taskDeviceBillDto.tagNum }}</td>
          <td>{{ item.taskDeviceBillDto.combineCode }}</td>
          <td>{{ item.taskDeviceBillDto.hierarchicalCode }}</td>
          <td>{{ item.taskDeviceBillDto.batchId }}</td>
          <td>{{ item.taskDeviceBillDto.txnNumber }}</td>
          <td v-if="item.resultStatus">
            {{filterLable(item) ? filterLable(item).label : ''}}          
          </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup, Checkbox } from "hips";

export default {
  name: "InventoryItem",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
  },

  props: {
    billDetailList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    checkstateList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    checkFlag: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    currentIndex: {
      type: Number,
      default: null,
    },
  },computed: {
    filterLable () {
      return function (item) {
        return this.checkstateList.filter(ele => {
          return ele.value === item.resultStatus })[0]
      }
    }
  },
  data() {
    return {
      checkbox: this.checked,
    };
  },
  // created(){
  //   console.log(this.billDetailList)
  // },
  watch: {
    checked(val, oldVal) {
      this.checkbox = val;
    },
    checkbox(val, oldVal) {
      this.$emit("changeChecked", this.checkbox, this.currentIndex);
    },
  },
  activated() {
    // this.scrollEvent()
  },
  methods: {
    // changeChecked () {
    //   this.$emit('changeChecked', this.checkbox, this.currentIndex)
    // },
    change(val) {
      console.log("val111", val);
      this.checkbox = val;
    },
    scrollEvent(e) {
      // 监听popup滚动，将选择框隐藏
      // console.log('e', e)
      // e.preventDefault()
      // e.preventDefault = false
      // console.log('e111', e)
      // this.$hips.toast('2')
      // e.preventDefault()
      // console.log('e', e)
      // e.preventDefault = false
      // let elementList
      // elementList = document.querySelectorAll('.inventory-item') // 获取所有的弹出框DOM
      // console.log('elementList', elementList[0].preventDefault)
      // elementList = document.querySelectorAll('input') // 获取所有的弹出框DOM
      // elementList.forEach(element => {
      //   element.blur()
      // })
      // console.log('elementList', elementList)
    },
  },
};
</script>

<style scoped lang="stylus">
.inventory-item {
  overflow: auto;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 10px;
  display: block;
  margin-bottom: 15px;

  .table {
    font-size: 14px;
    display: block;
  }

  tr {
    height: 25px;

    td {
      padding: 6px 10px;
      border: 1px solid #eee;
      text-align: center;
      white-space: nowrap;
    }
  }

  .table-header {
    width: 100%;
    overflow: hidden;

    td {
      // background #eee
      background: #dbebf9;
      color: black;
    }

    >>>.hips-cell {
      border-radius: 50%;
      padding: 0;
    }

    >>>.hips-group {
      border-radius: 50%;
    }

    >>>.hips-checkbox__label {
      display: none;
    }

    >>>.hips-checkbox__checked {
      margin-right: 0px;
    }
  }

  .iconxuanzekuang1 {
    font-size: 20px;
    color: #108aee;
  }

  .iconxuanzekuang {
    font-size: 20px;
    color: #aaa;
  }

  .boder {
    border: 1px solid #eee !important;

    + td {
      border: 1px solid #eee !important;
    }
  }

  .change {
    background: #ddd !important;
  }
}
</style>
