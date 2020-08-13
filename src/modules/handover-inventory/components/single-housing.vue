<template>
  <div class="single-housing-contain">
    <i></i>
    <p class="header">{{ buildDetail.instanceDescription }}</p>
    <p-item title="固定资产目录" class="p-override" :value="buildDetail.faCategoryDesc" />
    <p-item title="固定资产名称" class="p-override" :value="buildDetail.faNameDesc" />
    <p-item title="计量单位" class="p-override" :value="buildDetail.unitOfMeasure" />
    <p-item title="竣工工程规模" class="p-override" :value="buildDetail.projectScaleCompleted" />
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
    buildDetail: {
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
  // width: 88%;
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
  font-weight bolder
  padding 0 0 10px
  corlor #ccc
}

>>>.p-override {
  padding 10px 10px 10px 0
  .value{
    color rgb(133, 133, 133)
  }
}
</style>
