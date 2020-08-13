<template>
  <div class="task-contain" @click="handleClick">
    <div class="task-id">
      {{ task.taskNumber }}
    </div>
    <div>{{ task.taskName }}</div>
    <div class="task-line">
      <i class="iconfont iconshizhong" />
      <span> 任务时间:</span> {{ task.taskStartDate.slice(5, 10) }} ~ {{ task.taskEndDate.slice(5, 10) }}
    </div>
    <div class="task-line">
      <i class="iconfont icongongneng" />
      <span> 盘点状态:</span> {{ task.taskStatusDesc }}
    </div>
    <div class="task-line">
      <i class="iconfont icondiaodeng" />
      <span> 盘点场景:</span> {{ task.inventorySceneDesc }}
    </div>
    <!-- <div class="process-bar">
      <div class="bar-inner" :style="{width: task.percentage}">
        <p :style="{right: textRight}">{{task.percentage}}</p>
      </div>
    </div> -->
    <!-- <el-progress
      class="override-pro"
      :text-inside="true"
      :percentage="parseInt(String( task.inventoriedQuantity / task.inventoryQuantity * 100)) >100 ? 100 : parseInt(String( task.inventoriedQuantity / task.inventoryQuantity * 100))"
      color="#409eff"
      :stroke-width="18"
    ></el-progress> -->
    <el-progress
      class="override-pro"
      :text-inside="true"
      :percentage="parseInt(String(100 - (Number(task.inventorinoQuantity) / Number(task.inventoryQuantity) * 100)))"
      color="#409eff"
      :stroke-width="18"
    ></el-progress>
    <div class="status">
      <div>总数: {{ task.inventoryQuantity }}</div>
      <div>已盘: {{ task.inventoriedQuantity }}</div>
      <div>未盘: {{ task.inventorinoQuantity }}</div>
      <div>条码丢损: {{ task.codeLossQuantity }}</div>
    </div>
    <div class="result">
      <div>相符: {{ task.countMatchQuantity }}</div>
      <div>盘盈: {{ task.invProfitQuantity }}</div>
      <div>盘亏: {{ task.incLossQuantity }}</div>
      <div>属性差异: {{ task.invDiffQuantity }}</div>
    </div>
    <div class="inventory-type">{{ task.inventoryObjectDesc }}</div>
  </div>
</template>

<script>
export default {
  name: 'Task',
  props: {
    task: {
      type: Object,
      default: () => ({
        taskId: '20190802-002-0021',
        taskDesc: '资产使用范围-个人任务',
        taskFirstTime: '08-01',
        taskLastTime: '08-31',
        status: '盘点中',
        taskScene: '年中盘点',
        total: 1,
        percentage: 70,
      }),
    },
  },
  methods: {
    handleClick () {
      this.$emit('click')
    },
  },
}
</script>

<style lang="stylus" scoped>
.task-contain {
  background #fff
  margin: 15px auto;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px 20px 10px 10px;
  box-sizing: border-box;
  position: relative;
  .override-pro {
    margin-top 18px
  }

}

i {
  color #2896ff
}

.inventory-type {
  width 60px
  height 60px
  border 1px solid #2896ff
  border-radius 50%
  background-color #2896ff
  position absolute
  display flex
  justify-content center
  align-items center
  color #fff
  font-size 16px
  right 10px
  bottom  140px
}

.task-id {
  font-weight: bolder;
  margin-bottom: 10px;
  + div{
    // font-weight: bolder;
    font-size 14px
    line-height 20px
  }
}

.task-line {
  margin-top: 14px;
  font-size: 14px;
  span {
    font-size: 14px;
    font-weight  bolder
    margin-left 8px
  }
}

.process-bar {
  width: 100%;
  height: 20px;
  margin-top: 18px;
  font-size 14px
  color #fff
  // border: 1px solid darkgrey;
  border-radius: 10px;
  display: flex;
  justify-content:flex-start;
  background-color: darkgrey;
}

.bar-inner {
  background-color #2896ff
  border-radius: 10px;
  position relative
  p {
    position absolute
    right -25px
    top 3px
  }
}

.status {
  font-size: 14px;
  // height: 40px;
  margin-top 5px
  padding 10px 0
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid darkgrey;
  div {
    width 25%
  }
}

.result {
  font-size: 14px;
  // height: 40px;
  padding 10px 0
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #2896ff;
}

.result div {
  width: 25%;
}
</style>
