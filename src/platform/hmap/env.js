/**
 * 需要在全局入口文件中引入的hmap环境
 * @author momoko
 */

import { createScript } from './utils'

const env = process.env.VUE_APP_BUILD // 环境
// const platform = detectOS() // 平台

// 引入cordova
if (env === 'release') {
  // 在线子应用
  // if (platform === 'ios') {
  //   createScript('static/cordova/ios/cordova.js')
  // } else if (platform === 'android') {
  //   createScript('static/cordova/android/cordova.js')
  // }

  // 本地子应用
  createScript('../../cordova.js')
}
