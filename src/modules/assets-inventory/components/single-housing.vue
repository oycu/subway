<template>
  <div class="single-housing-contain">
    <i></i>
    <div class="header">
      <p>{{ item.ASSET_DESCRIPTION }}</p>
      <span>{{ item.RESULT_CODE_DESC }}</span>
    </div>
    <p-item title="资产编号" class="p-override" :value="item.ASSET_NUMBER" />
    <p-item title="资产盘点状态" class="p-override" :value="item.BILL_STATUS_DESC" />
    <p-item title="使用地点" class="p-override" :value="item.LOCATION_NAME" />
    <p-item title="资产状态" class="p-override" :value="item.ASSET_INSTANCE_STATUS_NAME" />
  </div>
</template>

<script>
import PItem from './p-item'
export default {
  name: 'SingleHousing',
  components: {
    [PItem.name]: PItem,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="stylus" scoped>
.single-housing-contain {
  border .5px solid #DDDDCC
  border-radius 10px
  padding 15px 0 5px 15px
  box-shadow 2px 2px 4px rgba(0, 0, 0, 0.2)
  margin: 0 auto;
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
}

>>>.p-override {
  padding 10px 10px 10px 0
  .value{
    color rgb(133, 133, 133)
  }
}
</style>
