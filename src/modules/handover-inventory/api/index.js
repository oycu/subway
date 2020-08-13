import http from '@/request'
// 获取快码值
function getCodeValueApi ({commit}, data) {
  const url = `r/api?sysName=getMobileCodeValueService&apiName=getCodeValue&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 上传设备清单接口
function uploadCheckTaskApi ({commit}, data) {
  const url = `r/api?sysName=getMobileTaskDetailBackService&apiName=uploadCheckTask&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 下载设备清单接口
function downloadCheckTaskApi ({commit}, data) {
  const url = `r/api?sysName=getMobileTaskDetailLoadService&apiName=downloadCheckTask&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

// 任务汇总
function getTaskDataApi ({commit}, data) {
  const url = `r/api?sysName=getTurnOverCheckTaskData&apiName=getTaskData&organizationId=${window.localStorage.organizationId}`
  return http.post(url, data)
}

export default {
  getCodeValueApi,
  uploadCheckTaskApi,
  downloadCheckTaskApi,
  getTaskDataApi,
}
