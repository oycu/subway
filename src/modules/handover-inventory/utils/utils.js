import Vue from 'vue'

/**
 * 打印标签（设备类）
 * @param inventoryList 选中的清单
 * @return Boolean
 * */
const devicePrintTag = (inventoryList) => {
  const _this = Vue.prototype

  window.bridgeLoginSuccess = function (str) {
    const res = JSON.parse(str)
    console.log('打印成功', JSON.stringify(res))
  }
  // 打印失败回调
  window.bridgeLoginFailure = function (res) {
    console.error(res)
    _this.$hips.toast('打印失败！')
  }
  let dataArr = []
  let printFlag = true // 是否满足打印条件
  this.inventoryList.forEach((ele, index) => { // 判断是否满足打印的条件--有且只有含一个.的层级码
    let limitNum = 0
    let currentIndex
    if (Array.isArray(ele.sameDevice)) {
      ele.sameDevice.forEach((element, index) => { // 判断是否满足打印的条件--有且只有含一个.的层级码
        if (element.taskDeviceBillDto.hierarchicalCode) { // 层级码是否存在
          let arrData = element.taskDeviceBillDto.hierarchicalCode.split('.')
          if (arrData.length === 2) { // 长度是否为2
            limitNum++ // 第几个长度为2的层级码
            currentIndex = index // 满足条件的当前index
          }
        }
      })
      if (limitNum === 1) { // 只有含有一个.的层级码
        let temp = { // 参数
          cardType: 0, // 0设备 1房建
          tagNum: ele.sameDevice[currentIndex].tagNum, // 标签编号
          instanceDescription: ele.sameDevice[currentIndex].taskDeviceBillDto.instanceDescription, // 设备名称
          unitOfMeasure: ele.sameDevice[currentIndex].taskDeviceBillDto.unitOfMeasure, // 计量单位
          specification: ele.sameDevice[currentIndex].taskDeviceBillDto.specification, // 规格型号
          faNameDesc: `${ele.sameDevice[currentIndex].taskDeviceBillDto.faCategoryDesc}/${ele.sameDevice[currentIndex].taskDeviceBillDto.faNameDesc}`, // 固定资产目录/名称
          isfixed: '否', // 是否为固定资产
        }
        dataArr.push(temp)
      } else { // 不满足打印条件
        printFlag = false
        _this.$hips.toast(`标签编码为${ele.sameDevice[0].tagNum}的清单不满足打印条件！`)
      }
    } else {
      if (ele.taskDeviceBillDto.hierarchicalCode) { // 层级码是否存在
        let arrData = ele.taskDeviceBillDto.hierarchicalCode.split('.')
        if (arrData.length === 2) { // 长度是否为2
          printFlag = true
          limitNum++ // 第几个长度为2的层级码
          currentIndex = index // 满足条件的当前index
        }
      }
      if (!printFlag || limitNum !== 1) {
        this.$hips.toast('该清单不满足打印条件！')
        return
      }
      dataArr = [{
        cardType: 0, // 0设备 1房建
        tagNum: this.inventoryList[currentIndex].tagNum, // 标签编号
        instanceDescription: this.inventoryList[currentIndex].taskDeviceBillDto.instanceDescription, // 设备名称
        unitOfMeasure: this.inventoryList[currentIndex].taskDeviceBillDto.unitOfMeasure, // 计量单位
        specification: this.inventoryList[currentIndex].taskDeviceBillDto.specification, // 规格型号
        faNameDesc: `${this.inventoryList[currentIndex].taskDeviceBillDto.faCategoryDesc}/${this.inventoryList[0].taskDeviceBillDto.faNameDesc}`, // 固定资产目录/名称
        isfixed: '否', // 是否为固定资产
      }]
    }
  })
  let randomNum = Math.floor(Math.random() * (999 - 100)) + 100 // 生成三位随机数
  let params = {
    filename: `${this.inventoryList[0].taskName}_${randomNum}`, // 盘点任务名称+下划线+三位流水
    data: dataArr,
  }
  console.log('params', params)
  const dict = {
    'className': 'WebBridge',
    'function': 'showCard',
    'params': params,
    'successCallBack': 'bridgeLoginSuccess',
    'failureCallBack': 'bridgeLoginFailure',
  }
  HandBridge.postMessage(JSON.stringify(dict))
}

/**
 * @description: 批量打印标签（房建类）
 * @param {Array} buildList 所有清单列表
 */
const buildPrintTag = (buildList) => {
  console.log(buildList)
  const _this = Vue.prototype
  let data = [] // 标签数据
  buildList.filter(item => item.checkFlag === true).forEach(ele => {
    data.push({
      cardType: 1, //  0 设备/1 房建
      tagNum: ele.taskBuildingBillDto.tagNum, // 标签编号
      instanceDescription: ele.taskBuildingBillDto.instanceDescription, // 房建/轨道名称
      unitOfMeasure: ele.taskBuildingBillDto.unitOfMeasure, // 计量单位
      installPlace:ele.taskDeviceBillDto.locationCode,//安装地点
      projectScaleCompleted: ele.taskBuildingBillDto.projectScaleCompleted, // 竣工工程规模
    })
  })
  if (data.length === 0) {
    _this.$hips.toast('请选择打印的标签')
    return
  }
  // 登录成功回调
  window.bridgeLoginSuccess = function (str) {
    const res = JSON.parse(str)
    console.log('登录返回', JSON.stringify(res))
  }
  // 登录失败回调
  window.bridgeLoginFailure = function (res) {
    console.error(res)
  }
  let randomNum = Math.floor(Math.random() * (999 - 100)) + 100
  const filename = `${buildList[0].taskName}_${randomNum}` // 文件名称（任务名 + _ + 三位流水）
  let params = {
    filename,
    data,
  }
  console.log('paramas', params)
  const dict = {
    'className': 'WebBridge',
    'function': 'showCard',
    'params': params,
    'successCallBack': 'bridgeLoginSuccess',
    'failureCallBack': 'bridgeLoginFailure',
  }

  HandBridge.postMessage(JSON.stringify(dict))
}

export {
  devicePrintTag,
  buildPrintTag,
}
