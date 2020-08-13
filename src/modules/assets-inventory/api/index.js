import http from '@/request'
// 任务下载接口
function getMobileTaskApi ({commit}, data) {
  const url = `r/api?sysName=getMobileTask&apiName=getMobileTask&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 资产下载接口
function getMobileAssetListApi ({commit}, data) {
  const url = `r/api?sysName=getMobileAssetList&apiName=getMobileAssetList&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 物资下载接口
function getMobileItemListApi ({commit}, data) {
  const url = `r/api?sysName=getMobileItemList&apiName=getMobileItemList&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 资产上传接口
function mobileAssetListBackApi ({commit}, data) {
  const url = `r/api?sysName=mobileAssetListBack&apiName=mobileAssetListBack&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 物资上传接口
function mobileItemListBackApi ({commit}, data) {
  const url = `r/api?sysName=mobileItemListBack&apiName=mobileItemListBack&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 值列表接口
function getMobileViewApi ({commit}, data) {
  const url = `r/api?sysName=getMobileView&apiName=getMobileView&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 扫码下载接口
function getMobileAssetscanApi ({commit}, data) {
  const url = `r/api?sysName=getMobileAssetscan&apiName=getMobileAssetscan&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 扫码下载接口
function getMobileItemscanApi ({commit}, data) {
  const url = `r/api?sysName=getMobileItemscan&apiName=getMobileItemscan&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}
export default {
  getMobileTaskApi,
  getMobileAssetListApi,
  getMobileItemListApi,
  mobileAssetListBackApi,
  mobileItemListBackApi,
  getMobileViewApi,
  getMobileAssetscanApi,
  getMobileItemscanApi,
}
