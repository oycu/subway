<template>
  <div class="inventory-contain">
    <p class="header">盘点信息</p>
    <select-item title="盘点状态" />
    <select-item title="盘点轮次" />
    <select-item title="盘点结果" />
    <input-item title="其他问题" />
  </div>
</template>

<script>
import SelectItem from './select-item'
import InputItem from './input-item'
export default {
  name: 'EditInventory',
  components: {
    SelectItem,
    InputItem,
  },
}
</script>

<style lang="stylus" scoped>
.inventory-contain {
  border: 1px solid #DDDDCC;
  border-radius: 10px;
  padding: 5px 0px 10px 10px;
  margin-top: 10px;
  background-color #fff
}

.header {
  text-align: center;
  color: #1f8ceb;
  padding: 10px 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
}
</style>
