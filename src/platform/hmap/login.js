/**
 * hmap子应用登录逻辑
 * @author momoko 2018/05/08
 */

import axios from 'axios'
import { getUrlParam, createScript } from './utils'
import { storage } from '@/utils'

// 模拟登录
export async function analogLogin () {
  // const url = `${process.env.VUE_APP_BASE_URL}/oauth/token?client_id=a765ff3f-8d33-49b4-a9c9-48e991544242&client_secret=ec2a9a5d-8b21-40fb-b20b-fa846b944e7b&grant_type=password&authType=TEL&username=101892&password=Welcome11!`
  const url = `${process.env.VUE_APP_BASE_URL}/oauth/token?client_id=client&client_secret=secret&grant_type=password&authType=TEL&username=101892&password=Welcome11!`
  const res = await axios.post(url)
  return {
    token: res.data.access_token,
    tokenType: res.data.token_type,
    expires: res.data.expires_in,
    userId: res.data.userId,
    organizationId: res.data.organizationId,
    userName: '李翔',
    account: '101892',
  }
}

// 授权码登录
export async function authorizedLogin () {
  const code = getUrlParam('code')

  const url = `${process.env.VUE_APP_BASE_URL}/oauth/token?client_id=a765ff3f-8d33-49b4-a9c9-48e991544242&client_secret=ec2a9a5d-8b21-40fb-b20b-fa846b944e7b&grant_type=authorization_code&code=${encodeURIComponent(code)}`

  const res = await axios.post(url)

  return {
    token: res.data.access_token,
    tokenType: res.data.token_type,
    expires: res.data.expires_in,
    userId: res.data.userId,
    organizationId: res.data.organizationId,
  }
}

// 桥登录
export function bridgeLogin () {
  return new Promise((resolve, reject) => {
    // 登录成功回调
    window.bridgeLoginSuccess = function (str) {
      const res = JSON.parse(str)
      console.log('登录返回', JSON.stringify(res))
      const data = {
        token: res.token,
        // tokenType: res.tokenType,
        // expires: res.expiresIn,
        account: res.account,
        userName: res.userName,
        userId: res.userId,
        organizationId: res.organizationId,
      }

      resolve(data)
    }
    // 登录失败回调
    window.bridgeLoginFailure = function (res) {
      console.error(res)
      reject(res)
    }

    const dict = {
      'className': 'BaseBridge',
      'function': 'getBaseInfo',
      'successCallBack': 'bridgeLoginSuccess',
      'failureCallBack': 'bridgeLoginFailure',
    }

    HandBridge.postMessage(JSON.stringify(dict))
  })
}

// 获取用户详细信息
export async function getUserInfo (userId) {
  const url = `${process.env.VUE_APP_BASE_URL}/i/api/staff/customDetail`
  const data = {
    userId,
  }
  const options = {
    headers: {
      Authorization: `Bearer ${window.localStorage.token}`,
    },
  }
  const res = await axios.post(url, data, options)

  return res.data
}

/**
 * 登录总成
 * @param  {String}  [type] 可选:'online''local'
 * @param  {Boolean} [needInfo] 是否需要获取用户详细信息
 * @return {Object.Promise} 若登录成功PromiseValue为数据对象/登录失败PromiseValue 为 false
 */
export default async function login (type = 'online') { // 登录
  const env = process.env.VUE_APP_BUILD // 环境

  try {
    let result = {}

    if (env === 'release') { // 真机
      console.log('这里是release')
      // 本地子应用
      createScript('../../../cordova.js')
      // if (type === 'online') result = await authorizedLogin() // 在线子应用
      if (type === 'local') result = await bridgeLogin() // 本地子应用
    } else { // 开发
      result = await analogLogin()
    }
    storage.set('result', result)
    window.localStorage.token = result.token
    window.localStorage.organizationId = result.organizationId
    window.localStorage.userName = result.userName
    window.localStorage.empId = result.account
    // const platform = detectOS() // 平台
    // if (needInfo) result.userInfo = await getUserInfo(result.userId)
    // console.log(result.userInfo)
    // window.localStorage.user = result.userInfo.accountNumber
    return result
  } catch (e) {
    console.error(e)
    return false
  }
}
