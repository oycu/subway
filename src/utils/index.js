import Vue from 'vue'
import BScroll from 'better-scroll' // 导入better-scroll

/**
 * 日期对象转为日期字符串
 * @param date 需要格式化的日期对象
 * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
 * @example  dateFormat(new Date())                                "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 09:24:00"
 * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
 * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
 * @returns {boolean}
 */
function dateFormat (date, sFormat) {
  if (isEmpty(sFormat)) {
    sFormat = 'yyyy-MM-dd'
  }

  if (!(date instanceof Date)) {
    try {
      if (isEmpty(date)) {
        return ''
      }
      if (date.lastIndexOf('.') !== -1) {
        date = date.substr(0, date.lastIndexOf('.'))
      }
            date = date.replace(/\-/g, '/') // eslint-disable-line
      date = new Date(date)
    } catch (e) {
      console.log(e)
    }
  }

  let time = {
    Year: 0,
    TYear: '0',
    Month: 0,
    TMonth: '0',
    Day: 0,
    TDay: '0',
    Hour: 0,
    THour: '0',
    hour: 0,
    Thour: '0',
    Minute: 0,
    TMinute: '0',
    Second: 0,
    TSecond: '0',
    Millisecond: 0,
  }
  time.Year = date.getFullYear()
  time.TYear = String(time.Year).substr(2)
  time.Month = date.getMonth() + 1
  time.TMonth = time.Month < 10 ? '0' + time.Month : String(time.Month)

  time.Day = date.getDate()
  time.TDay = time.Day < 10 ? '0' + time.Day : String(time.Day)

  time.Hour = date.getHours()
  time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour)
  time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12
  time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour)

  time.Minute = date.getMinutes()
  time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute)
  time.Second = date.getSeconds()
  time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second)
  time.Millisecond = date.getMilliseconds()

  return sFormat.replace(/yyyy/ig, String(time.Year))
    .replace(/yyy/ig, String(time.Year))
    .replace(/yy/ig, time.TYear)
    .replace(/y/ig, time.TYear)

    .replace(/MM/g, time.TMonth)
    .replace(/M/g, String(time.Month))

    .replace(/dd/ig, time.TDay)
    .replace(/d/ig, String(time.Day))

    .replace(/HH/g, time.THour)
    .replace(/H/g, String(time.Hour))
    .replace(/hh/g, time.Thour)
    .replace(/h/g, String(time.hour))

    .replace(/mm/g, time.TMinute)
    .replace(/m/g, String(time.Minute))
    .replace(/ss/ig, time.TSecond)
    .replace(/s/ig, String(time.Second))
    .replace(/fff/ig, String(time.Millisecond))
}

/**
 * 判断对象为空
 * @param v
 * @return {boolean}
 */
const isEmpty = (v) => {
  if (typeof v === 'undefined') {
    return true
  }
  if (v === undefined || v === 'undefined') {
    return true
  }
  if (v === null) {
    return true
  }
  if (v === '' || v === 'null') {
    return true
  }
  if (v === 0) {
    return true
  }
  switch (typeof v) {
    case 'string' :
      if (v.trim().length === 0) {
        return true
      }
      break
    case 'boolean' :
      if (!v) {
        return true
      }
      break
    case 'number' :
      if (v === 0) {
        return true
      }
      break
    case 'object' :
      return undefined !== v.length && v.length === 0
  }
  return false
}

/**
 * 手机号码是否正确
 * @param number 手机号码
 * @return Boolean
 * */
const isMobileNumber = (number) => {
  return /^(13[0-9]|14[579]|15[012356789]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(number)
}

const toast = {
  /**
     * toast 提示
     * @param message 提示内容
     * @param icon 添加图标
     * @param position 提示显示位置
     * @param duration 显示时间
     * */
  show (message, icon, position = 'middle', duration = 3000) {
    const _this = Vue.prototype
    _this.$hips.toast.allowMultiple()
    _this.$hips.toast({
      message,
      position,
      icon,
      duration,
    })
  },
}

const storage = {
  get (key) {
    try {
      let t = window.localStorage.getItem(key)
      try {
        return JSON.parse(t)
      } catch (e) {
        return t
      }
    } catch (e) {
      console.log(e)
    }
  },
  set (key, val) {
    if (typeof val === 'object') {
      val = JSON.stringify(val)
    }
    window.localStorage.setItem(key, val)
  },
}

/**
 * 动态修改 document title
 * @param title
 * */
const setDocumentTitle = (title) => {
  document.title = title || document.title
  let ifr = document.createElement('iframe')
  ifr.onload = function () {
    setTimeout(function () {
      ifr.remove()
    }, 0)
  }
  document.body.appendChild(ifr)
}

/**
   * indicator 弹出框
   * @param message 提示内容
   * @param icon 添加图标
   * @param position 提示显示位置
   * @param duration 显示时间
   * */
const indicator = {
  show () {
    const _this = Vue.prototype
    // _this.$hips.indicator.show({
    //   pureBackground: true,
    //   spinSize: '40px',
    //   spinColor: '#1F8CEB',
    //   overlay: true,
    // })
    _this.$hips.indicator.show({
      text: '拼命加载中...',
    })
  },
  hide () {
    const _this = Vue.prototype
    _this.$hips.indicator.hide()
  },
}

/**
 * @method
 * @desc input只能输入正数
 * @param  {String} input的值
 * @param  {String} 要改变的值的名称
 * @param  {String} 用于储存的值名称
 * @param  {String} 改变的值的作用域
 */
function limitPositiveNumber (val, valName, oldVal, scope) {
  let arr = valName.split('.')
  let length = arr.length
  // 如果是数字类型,排除xx.这种，这种在正则里会判断为false
  if (Number(val) || Number(val) === 0) {
    // 正则判断是否为正数
    let value = Number(val)
    if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
      // 如果为正数，则储存下来
      // scope[oldVal] = value
      return true
    } else {
      // 不符合就用旧值覆盖
      scope.$nextTick(() => {
        if (length === 1) {
          scope[valName] = oldVal
        } else if (length === 2) {
          scope[arr[0]][arr[1]] = oldVal
        } else if (length === 3) {
          scope[arr[0]][arr[1]][arr[2]] = oldVal
        }
      })
      return false
    }
  } else {
    scope.$nextTick(() => {
      if (length === 1) {
        scope[valName] = oldVal
      } else {
        scope[arr[0]][arr[1]] = oldVal
      }
    })
    return false
  }
}

/**
 * @method
 * @desc 使用better-scroll左右滑动
 * @param  {Object} 作业域
 */
function leftRightScroll (scope) {
  let verScroll = function (element) {
    scope.$nextTick(() => {
      scope.scroll = new BScroll(element, {
        startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
        click: false,
        scrollX: true,
        scrollY: false,
        eventPassthrough: 'vertical',
      })
    })
  }

  scope.$nextTick(() => {
    let timer = setTimeout(() => {
      if (timer) {
        clearTimeout(timer)
        let tableList = document.querySelectorAll('.table')
        let tbodyList = document.querySelectorAll('.table-header')
        tableList.forEach((ele, index) => {
          ele.style.width = tbodyList[index].scrollWidth * 1 + 'px'
        })
        let elementList = document.querySelectorAll('.inventory-item')
        elementList.forEach(ele => {
          verScroll(ele)
        })
      }
    }, 1000)
  })
}
/**
* 解决ios中输入框被遮挡问题
* @param                {HTMLElement}           输入框元素
* @param                {HTMLElement}           内容元素
* @param                {Object}}               作用域
*/
function autoKeyboardHeight (elem, content, scope) {
  var key
  var addEvent = function (type, callback) {
    elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback)
  }
  window.addEventListener('native.keyboardshow', function (e) {
    // todo 进行键盘可用时操作
    // e.keyboardHeight 表示软件盘显示的时候的高度
    key = e.keyboardHeight * 1
  })
  var u = navigator.userAgent
  var contentHeight = content.offsetHeight
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  // key = 400
  var change = function () {
    setTimeout(() => {
      if (key !== 0 && isiOS) {
        content.style.height = content.offsetHeight + key + 'px'
      }
      scope.$nextTick(function () {
        // document.querySelector('.hips-view').scrollTop = document.querySelector('.hips-view').scrollHeight
        // document.querySelector('.hips-view').scrollTo(document.querySelector('.hips-view').scrollLeft, key)
        // document.body.scrollTop = document.body.offsetHeight
        // console.log('document.querySelector(.hips-view__content.scrollTop', document.querySelector('.hips-view__content').scrollTop)
        // console.log('document.querySelector(.hips-view__content.scrollHeight', document.querySelector('.hips-view__content').scrollHeight)
        // document.activeElement.scrollIntoViewIfNeeded()
        // document.activeElement.scrollIntoView()
      })
    }, 100)
  }
  var changeBack = function () {
    content.style.height = contentHeight + 'px'
  }
  addEvent('focus', change)
  addEvent('blur', changeBack)
}

export {
  dateFormat,
  isEmpty,
  isMobileNumber,
  toast,
  storage,
  setDocumentTitle,
  indicator,
  limitPositiveNumber,
  leftRightScroll,
  autoKeyboardHeight,
}
