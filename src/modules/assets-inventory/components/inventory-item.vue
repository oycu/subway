<template>
  <div class="inventory-item">
    <div class="table">
      <thead class="table-header">
        <tr>
          <td>标签编码</td>
          <td>组合码（盘点）</td>
          <td>层级码（盘点）</td>
          <td>导入标识</td>
          <td>事务处理单号</td>
          <td>盘点状态</td>
        </tr>
      </thead>
      <tbody>
        <tr @click="showMore">
          <td>1</td>
          <td>1.1</td>
          <td>1001</td>
          <td>201908001</td>
          <td>已盘</td>
          <td>1</td>
        </tr>
      </tbody>
      <tbody>
        <tr @click="showMore">
          <td>1</td>
          <td>1.1</td>
          <td>1001</td>
          <td>201908001</td>
          <td>已盘</td>
          <td>1</td>
        </tr>
      </tbody>
    </div>
  </div>
</template>

<script>
import { View, NavBar, Button, Scroll, Picker, Popup } from 'hips'
export default {
  name: 'InventoryItem',
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Scroll.name]: Scroll,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
  },
  data () {
    return {
      backgroundColor: '#fff',
      detailFlag: true,
      defaultIndex: 0,
      showPopup: false,
      columns: [ 1, 2, 3 ],
    }
  },
  methods: {
    showMore () {
      this.showPopup = true
    },
    handleConfirm () {
    },
    handleCancel () {

    },
    select () {
    },
  },
}
</script>

<style scoped lang="stylus">
.inventory-item{
  font-size 14px
  margin-top 10px
  // background #fff
  overflow scroll
  margin-bottom 15px
  border 1px solid #eeeeee
  border-radius 10px
}
tr{
  // display flex
  height 25px
  td{
    padding 6px 10px
    border 1px solid #eee
    text-align center
    white-space nowrap
  }
}
.table-header{
    width 100%
    overflow hidden
    // overflow scroll
    tr{
      overflow scroll
    }
    td{
        background #eee
        color black
    }
}
.boder{
    border 1px solid #eee!important
    + td{
        border 1px solid #eee!important
    }
}
.table{
  overflow-y scroll
}
</style>
