<template>
  <div class="task-contain" @click="handleClick">
    <div class="task-id">
      {{ task.TASK_NUMBER }}
    </div>
    <div>{{ task.TASK_NAME }}</div>
    <div class="task-line">
      <i class="iconfont iconshizhong" />
      <span> 任务时间:</span> {{ task.TASK_START_DATE.slice(5, 10) }} ~ {{ task.TASK_START_DATE.slice(5, 10) }}
    </div>
    <div class="task-line">
      <i class="iconfont icongongneng" />
      <span> 盘点状态:</span> {{ task.TASK_STATUS }}
    </div>
    <div class="task-line">
      <i class="iconfont icondiaodeng" />
      <span> 盘点场景:</span> {{ task.INVENTORY_SCENE }}
    </div>
    <!-- <div class="process-bar">
      <div class="bar-inner" :style="{width: task.percentage}">
        <p :style="{right: textRight}">{{task.percentage}}</p>
      </div>
    </div> -->
    <!-- :percentage="parseInt(String( task.ASSET_CHECKED_QUANTITY / (task.ASSET_TOTAL_QUANTITY === 0 ? 1 : task.ASSET_TOTAL_QUANTITY) * 100)) >100 ? 100 : parseInt(String( task.ASSET_CHECKED_QUANTITY / task.ASSET_TOTAL_QUANTITY ? task.ASSET_TOTAL_QUANTITY : 1 * 100))" -->
    <!-- :percentage="parseInt(String( 100 - (Number(task.ASSET_NOCHECKED_QUANTITY ? task.ASSET_NOCHECKED_QUANTITY : 1) / Number(task.ASSET_TOTAL_QUANTITY ? task.ASSET_TOTAL_QUANTITY : 1) * 100)))" -->

    <el-progress
      class="override-pro"
      :percentage="parseInt(String( isNaN(100 - (Number(task.ASSET_NOCHECKED_QUANTITY) / Number(task.ASSET_TOTAL_QUANTITY ? task.ASSET_TOTAL_QUANTITY : 1) * 100)) ? 0 : 100 - (Number(task.ASSET_NOCHECKED_QUANTITY) / Number(task.ASSET_TOTAL_QUANTITY ? task.ASSET_TOTAL_QUANTITY : 1) * 100) ))"
      :text-inside="true"
      color="#409eff"
      :stroke-width="18"
    ></el-progress>
    <div class="status">
      <div>总数: {{ task.ASSET_TOTAL_QUANTITY }}</div>
      <div>已盘: {{ task.ASSET_CHECKED_QUANTITY }}</div>
      <div>未盘: {{ task.ASSET_NOCHECKED_QUANTITY }}</div>
      <div>条码丢损: {{ task.ASSET_BARLOSS_QUANTITY }}</div>
    </div>
    <div class="result">
      <div>相符: {{ task.ASSET_DECREASE_QUANTITY }}</div>
      <div>盘盈: {{ task.ASSET_AGREE_QUANTITY }}</div>
      <div>盘亏: {{ task.ASSET_BARLOSS_QUANTITY }}</div>
      <div>属性差异: {{ task.ASSET_DIFFERENCE_QUANTITY }}</div>
    </div>
    <div class="inventory-type">{{ task.INVENTORY_OBJECT }}</div>
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
