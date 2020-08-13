import Vue from 'vue'

/**
 * 封装indexedDB方法
 * */

const indexeddb = {
  indexedDB: window.indexedDB || window.webkitindexedDB, // 兼容indexedDB
  IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange, // 键范围
  // 建立或打开数据库，建立对象存储空间(ObjectStore)
  openDB: function (dbname, dbversion, objStore = {}) {
    return new Promise((resolve, reject) => {
      const _this = Vue.prototype
      var db
      var self = this
      var version = dbversion || 1
      var request = self.indexedDB.open(dbname, version)
      request.onerror = function (e) { // 数据库打开失败
        console.log(e.currentTarget.error.message)
        _this.$hips.toast('IndexedDB数据库打开错误')
      }
      request.onsuccess = function (e) {
        db = e.target.result
        resolve(db)
      }
      // 清单表：id:任务id+盘点清单id  索引：任务id  盘点状态
      // 值列表  自动生成
      // 任务表：id:任务id
      request.onupgradeneeded = function (e) {
        db = e.target.result
        console.log('onupgradeneeded')
        objStore.map((item) => {
          var store
          if (!db.objectStoreNames.contains(item.name)) {
            // 没有该对象空间时创建该对象空间
            store = db.createObjectStore(item.name, { keyPath: 'id', autoIncrement: true })
            console.log('成功建立对象存储空间：' + item.name)
            item.indexList.map((i) => {
              store.createIndex(i.indexKeyName, i.indexKey, {unique: false})
            })
          }
        })
      }
    })
  },
  // 删除数据库
  deletedb: function (dbname, pushErr = (err) => { throw new Error(err) }) {
    return new Promise((resolve, reject) => {
      var self = this
      // self.closeDB()
      let deleteRequest = self.indexedDB.deleteDatabase(dbname)
      deleteRequest.onerror = function (event) {
        console.log('删除失败')
        reject(event.target.error)
      }
      deleteRequest.onsuccess = function (event) {
        console.log('删除成功')
        resolve(true)
      }
    })
  },
  // 关闭数据库
  closeDB: function (db) {
    db.close()
    console.log('数据库已关闭')
  },
  // 清除indexedDB表中的数据  db：数据库  storename：表名称
  clearStore: function (db, storename) {
    return new Promise((resolve, reject) => {
      console.log('storename', storename)
      var store = db.transaction(storename, 'readwrite').objectStore(storename)
      store.clear()
      resolve(true)
    })
  },
  // 通过索引读取数据 storename：表名称 indexName：索引名称 indexValue：索引值
  getDataByIndex: function (db, storename, indexName, indexValue) {
    var store = db.transaction(storename, 'readwrite').objectStore(storename)
    var request = store.index(indexName).get(indexValue)
    request.onerror = function () {
      console.log('事务失败')
    }
    request.onsuccess = function (e) {
      var result = e.target.result
      console.log('result', result)
    }
  },
  // 添加数据，重复添加会报错 添加数据，重复添加会报错
  addData: function (db, storename, data) {
    return new Promise((resolve, reject) => {
      var store = db.transaction(storename, 'readwrite').objectStore(storename)
      var request
      request = store.add(data)
      request.onerror = function () {
        console.error('add添加数据库中已有该数据')
      }
      request.onsuccess = function () {
        console.log('add添加数据已存入数据库')
        resolve(true)
      }
    })
  },
  // 批量添加数据
  addAll (db, storename, data, pushErr = (err) => { throw new Error(err) }) {
    return new Promise((resolve, reject) => {
      if (db) {
        let transaction = db.transaction([storename], 'readwrite')
        let objectStore = transaction.objectStore(storename)
        if (data.length === 0) {
          resolve(true)
        } else {
          data.map((item) => {
            let request
            if (Array.isArray(item)) { // 判断item是否为数组
              item.map((ele) => {
                request = objectStore.add(ele)
              })
            } else {
              request = objectStore.add(item) // 新增数据
            }
            request.onsuccess = () => {
              console.log('add success')
              resolve(true)
            }
            request.onerror = (event) => {
              pushErr(event.target.error)
            }
          })
        }
      }
    })
  },
  // 更新数据库中的数据 db：数据库 tableName：表名称 data：需要更新的数据更新数据库中的数据
  updateData: function (db, storename, data) {
    return new Promise((resolve, reject) => {
      var request = db.transaction([storename], 'readwrite')
        .objectStore(storename)
        .put(data)

      request.onsuccess = function () {
        // console.log('数据更新成功')
        resolve(true)
      }

      request.onerror = function () {
        console.log('数据更新失败')
      }
    })
  },
  // 删除数据库中的数据 db：数据库 tableName：表名称 data：需要更新的数据更新数据库中的数据
  deleteData: function (db, storename, data) {
    return new Promise((resolve, reject) => {
      var request = db.transaction([storename], 'readwrite')
        .objectStore(storename)
        .delete(data)

      request.onsuccess = function () {
        console.log('数据删除成功')
        resolve(true)
      }

      request.onerror = function () {
        console.log('数据删除失败')
      }
    })
  },
  // 通过游标查询记录 数据库  表名称 需要更新的数据
  cursorGetData: function (db, storename, dbkeyRange) {
    return new Promise((resolve, reject) => {
      // var keyRange = dbkeyRange || ''
      let list = []
      var store = db.transaction(storename, 'readwrite').objectStore(storename)
      var request = store.openCursor()
      request.onsuccess = function (e) {
        var cursor = e.target.result
        if (cursor) { // 必须要检查
          list.push(cursor.value)
          cursor.continue()// 遍历了存储对象中的所有内容
        } else {
          resolve(list)
        }
      }
    })
  },
  // 通过索引游标查询记录  db:indexedDB数据库  storename:表名称   indexName：索引名  indexValue：索引值
  cursorGetDataByIndex: function (db, storename, indexName, indexValue, searchList, flag) {
    // var keyRange = dbkeyRange || ''
    return new Promise((resolve, reject) => {
      let list = []
      var store = db.transaction(storename, 'readwrite').objectStore(storename)
      var request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
      request.onsuccess = function (e) {
        var cursor = e.target.result
        if (cursor) { // 必须要检查
          if (Array.isArray(searchList)) {
            if (indexName === 'StatusTaskId' || indexName === 'SingleTaskId') { // 房建
              if (cursor.value.taskBuildingBillDto.faCategoryDesc.indexOf(searchList[0]) !== -1 && cursor.value.taskBuildingBillDto.faNameDesc.indexOf(searchList[1]) !== -1 && cursor.value.taskBuildingBillDto.instanceDescription.indexOf(searchList[2]) !== -1 && cursor.value.taskBuildingBillDto.btsMajorDesc.indexOf(searchList[3]) !== -1) {
                list.push(cursor.value)
                cursor.continue()
              } else {
                cursor.continue()
              }
            }
          } else if (typeof searchList === 'string') {
            if (flag) { // 房建类
              if (!list.includes(cursor.value.taskBuildingBillDto[searchList]) && cursor.value.taskBuildingBillDto[searchList]) {
                list.push(cursor.value.taskBuildingBillDto[searchList])
              }
              cursor.continue()// 遍历了存储对象中的所有内容
            } else { // 设备类
              if (!list.includes(cursor.value.taskDeviceBillDto[searchList]) && cursor.value.taskDeviceBillDto[searchList]) {
                list.push(cursor.value.taskDeviceBillDto[searchList])
              }
              cursor.continue()// 遍历了存储对象中的所有内容
            }
          } else {
            list.push(cursor.value)
            cursor.continue()// 遍历了存储对象中的所有内容
          }
        } else {
          resolve(list)
        }
      }
      request.onerror = function (e) {
        reject(e)
      }
    })
  },
  // 通过游标更新记录
  cursorUpdateData: function (db, storename) {
    var store = db.transaction(storename, 'readwrite').objectStore(storename)
    var request = store.openCursor()
    request.onsuccess = function (e) {
      console.log('游标开始查询')
      var cursor = e.target.result
      var value
      var updateRequest
      if (cursor) { // 必须要检查
        console.log(cursor)
        if (cursor.key === 1002) {
          console.log('游标开始更新')
          value = cursor.value
          value.age = 38
          updateRequest = cursor.update(value)
          updateRequest.onerror = function () {
            console.log('游标更新失败')
          }
          updateRequest.onsuccess = function () {
            console.log('游标更新成功')
          }
        } else {
          cursor.continue()
        }
      }
    }
  },
  // 通过索引和游标删除指定的数据 db:indexedDB数据库  storename:表名称   indexName：索引名  indexValue：索引值
  cursorDeleteData: function (db, storename, indexName, indexValue) {
    var store = db.transaction(storename, 'readwrite').objectStore(storename)
    var request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
    request.onsuccess = function (e) {
      var cursor = e.target.result
      // var value
      var deleteRequest
      if (cursor) {
        deleteRequest = cursor.delete()// 请求删除当前项
        deleteRequest.onerror = function () {
          console.log('游标删除该记录失败')
        }
        deleteRequest.onsuccess = function () {
          console.log('游标删除该记录成功')
        }
        cursor.continue()
      }
    }
    request.onerror = function (e) {
      var cursor = e.target.result
      var deleteRequest
      if (cursor) {
        deleteRequest = cursor.delete()
        deleteRequest.onerror = function () {
          console.log('游标删除记录失败')
        }
        deleteRequest.onsuccess = function () {
          console.log('游标删除该记录成功')
        }
      }
    }
  },
  // 创建索引
  storeIndex: function (store, indexKey) {
    var index = store.createIndex(indexKey, indexKey, {unique: false})
    console.log('index', index)
    console.log('创建索引' + indexKey + '成功')
  },
  // 通过索引游标查询记录  db:indexedDB数据库  storename:表名称   indexName：索引名  indexValue：索引值
  cursorGetDataByfilter: function (db, storename, indexName, indexValue, filter) {
    // var keyRange = dbkeyRange || ''
    return new Promise((resolve, reject) => {
      let list = []
      var store = db.transaction(storename, 'readwrite').objectStore(storename)
      var request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
      request.onsuccess = function (e) {
        var cursor = e.target.result
        if (cursor) { // 必须要检查
          let value = cursor.value.taskDeviceBillDto
          let satisfaction = true
          Object.keys(filter).forEach((ele) => {
            if (value[ele]) { // 清单存在这个字段时
              if (value[ele].indexOf(filter[ele]) === -1) {
                satisfaction = false
              }
            } else if (filter[ele] !== '') { // 如果清单不存在这个字段，并且有相应的搜索字段
              satisfaction = false
            }
          })
          if (satisfaction) {
            list.push(cursor.value)
          }
          cursor.continue()// 遍历了存储对象中的所有内容
        } else {
          resolve(list)
        }
      }
    })
  },
}

export {
  indexeddb,
}
