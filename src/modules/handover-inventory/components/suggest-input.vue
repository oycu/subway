<template>
  <div class="item">
    <el-row class="demo-autocomplete">
      <el-col>
        <div class="sub-title name">{{ title }}</div>
        <el-autocomplete
          v-model="inputValue"
          class="inline-input input"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @blur="handleChange"
          @focus="handleFocus"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { limitPositiveNumber, storage, isEmpty } from '@/utils'

export default {
  name: 'SuggestInput',
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    keyVal: {
      type: String,
      default: '',
    },
    disableFlag: {
      type: Boolean,
      default: false,
    },
    typeNum: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      inputValue: this.value,
      restaurants: [],
      state1: '',
      state2: '',
      timeout: null,
    }
  },
  watch: {
    value (val, oldVal) {
      this.inputValue = this.value
    },
    inputValue (val, oldVal) {
      if (this.typeNum) {
        let successFlag = limitPositiveNumber.call(this, val, 'inputValue', oldVal, this)
        if (successFlag) {
          this.$emit('updateInput', this.inputValue, this.keyVal)
        }
      } else {
        this.$emit('updateInput', this.inputValue, this.keyVal)
      }
    },
  },
  mounted () {
    this.restaurants = this.loadAll()
  },
  methods: {
    querySearchAsync (queryString, cb) {
      var restaurants = this.restaurants

      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      // clearTimeout(this.timeout)
      // this.timeout = setTimeout(() => {
      cb(results)
      // }, 500 * Math.random())
    },
    createStateFilter (queryString) {
      return (inputValue) => {
        return (inputValue.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      let keyName = this.keyVal.indexOf('.') !== -1 ? this.keyVal.split('.')[1] : this.keyVal
      let restaurants = isEmpty(storage.get(`${keyName}List`)) ? [] : storage.get(`${keyName}List`)
      return restaurants
    },
    handleSelect (item) {
    },
    handleChange () {
      if (!isEmpty(this.inputValue)) {
        let temp = {
          value: this.inputValue,
        }
        let keyName = this.keyVal.indexOf('.') !== -1 ? this.keyVal.split('.')[1] : this.keyVal

        let restaurants = storage.get(`${keyName}List`)
        if (isEmpty(restaurants)) {
          restaurants = [temp]
        } else if (Array.isArray(restaurants)) {
          restaurants.forEach((ele, index) => {
            if (ele.value === temp.value) {
              restaurants.splice(index, 1)
            }
          })
          restaurants.unshift(temp)
          if (restaurants.length === 21) {
            restaurants.pop()
          }
        }
        storage.set(`${keyName}List`, restaurants)
      }
    },
    handleFocus () {
      this.restaurants = this.loadAll()
      this.$emit('handleFocus')
    },
  },
}
</script>

<style scoped lang="stylus">
.item{
    border-top 1px solid #ccc
    display flex
    font-size 14px
    >>>.demo-autocomplete>div{
      display flex
    }
    >>>.demo-autocomplete{
      width 100%
    }
    .name{
        padding 15px 10px 15px 0
        flex 1
        font-weight 700
        line-height 18px
    }
    >>>.el-autocomplete{
        width 220px
        margin 7px 10px 7px 0
        outline none
        border-radius 5px
        text-align right
        input{
          height 34px
          text-align right
        }
    }
    input:disabled{
      background #f7f7f7
    }
}

</style>
