<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      :right-buttons="[
        {
          buttonIcon: 'search',
          buttonLabel: ''
        },
      ]"
      @nav-bar-back-click="$router.backPage()"
      @nav-bar-right-click="search"
    >
      <div slot="center" class="status">
        <div :class="['left', { 'select': isSelected}]" @click="handleLeft">
          <p>未盘点</p>
        </div>
        <div :class="['right', { 'select': !isSelected}]" @click="handleRight">
          <p>已盘点</p>
        </div>
      </div>
    </hips-nav-bar>
    <hips-tabs v-if="!isSelected" v-model="active">
      <hips-tab ref="same" title="账实相符" class="override" @click.native="select(['30'])"></hips-tab>
      <hips-tab title="有差异" @click.native="select(['40', '60'])"></hips-tab>
      <hips-tab title="盘盈" @click.native="select(['10', '70'])"></hips-tab>
      <hips-tab title="盘亏" @click.native="select(['20'])"></hips-tab>
    </hips-tabs>
    <div class="content demo-scroll" style="height:calc(100vh)">
      <hips-scroll
        ref="scroll"
        :scroll-options="scrollOption"
        :data="[unDevInventoryList]"
        disable
        @pulling-down="loadRefresh"
        @pulling-up="loadMore"
      >
        <div v-if="isSelected">
          <div class="button">
            <hips-button type="primary" @click="printTag">打印标签</hips-button>
            <hips-button type="primary" @click="scanInventory">扫码盘点</hips-button>
          </div>
          <InventoryItem
            v-for="(item, index) in unDevInventoryList"
            :key="index"
            ref="inventory"
            :checked="item.checked"
            :currentIndex="index"
            :billDetailList="item.sameDevice"
            :checkstateList="checkstateList"
            :checkFlag="footeButton"
            @click.native="goDeatil(item, '未盘点', index)"
            @changeChecked="changeChecked"
          ></InventoryItem>
        </div>
        <div v-else class="discontent">
          <div class="item">
            <InventoryItem
              v-for="(item, index) in devInventoryList"
              :key="index"
              :billDetailList="item"
              :checkstateList="checkstateList"
              @click.native="goDeatil(item)"
            ></InventoryItem>
          </div>
        </div>
      </hips-scroll>
    </div>
    <div slot="footer">
      <div v-if="footeButton" class="footer">
        <div class="chosse">
          <i v-if="checked" class="iconfont iconxuanzekuang1" @click="change(false)"></i>
          <i v-if="!checked" class="iconfont iconxuanzekuang" @click="change(true)"></i>
          <p>全选</p>
        </div>
        <div class="button">
          <hips-button class="confirm" type="primary" @click="confirmPrint">确定</hips-button>
          <hips-button class="cancel" type="primary" @click="cancelPrint">取消</hips-button>
        </div>
      </div>
    </div>
    <hips-popup v-model="showPopup" position="top">
      <div class="pop-content">
        <p class="title">筛选</p>
        <InputItem
          keyVal="faCategoryDesc"
          :title="'固定资产目录'"
          :value="filter.faCategoryDesc"
          @updateInput="updateInput"
        />
        <InputItem
          keyVal="faNameDesc"
          :title="'固定资产名称'"
          :value="filter.faNameDesc"
          @updateInput="updateInput"
        />
        <InputItem
          keyVal="instanceDescription"
          :title="'设备名称'"
          :value="filter.instanceDescription"
          @updateInput="updateInput"
        />
        <InputItem
          keyVal="specification"
          :title="'规格型号'"
          :value="filter.specification"
          @updateInput="updateInput"
        />
        <InputItem
          keyVal="locationCode"
          :title="'安装（存放）地点'"
          :value="filter.locationCode"
          @updateInput="updateInput"
        />
        <InputItem
          keyVal="btsMajorDesc"
          :title="'专业'"
          :value="filter.btsMajorDesc"
          @updateInput="updateInput"
        />
        <InputItem
          keyVal="tagNum"
          :title="'标签编号'"
          :value="filter.tagNum"
          @updateInput="updateInput"
        />
        <div class="button">
          <p @click="oprate('cancle')">取消</p>
          <p @click="oprate('confirm')">确定</p>
        </div>
      </div>
    </hips-popup>
  </hips-view>
</template>

<script>
import {
  View,
  NavBar,
  Tabs,
  Tab,
  Picker,
  Popup,
  Button,
  Checkbox,
  CheckboxGroup,
  Scroll,
} from "hips";
import InventoryItem from "../../../components/inventory-item";
import SingleHouse from "../../../components/single-housing";
import InputItem from "../../../components/input-item";
import { indexeddb } from "../../../utils";
import { leftRightScroll } from "@/utils";

var fromName;
const i18n = {
  "zh-CN": {
    spaceTitle: "留白占位区域",
    nestScrollTitle: "嵌套滚动区域",
    backTop: "点我回到顶部",
    refreshTxt: "刷新成功",
    moreTxt: "",
    noMoreTxt: "",
  },
  "en-US": {
    spaceTitle: "Space Section",
    nestScrollTitle: "Nest Scroll Section",
    backTop: "Click Me Back To The Top",
    refreshTxt: "Refresh Success",
    moreTxt: "Pull Up And Load More",
    noMoreTxt: "No More Data",
  },
};
export default {
  name: "StartInventoryList",
  components: {
    [View.name]: View,
    [Scroll.name]: Scroll,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
    InventoryItem,
    InputItem,
    [SingleHouse.name]: SingleHouse,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  data() {
    return {
      scrollOption: {
        pullDownRefresh: false,
        pullUpLoad: {
          txt: {
            more: i18n[this.$hipsLang]["moreTxt"],
            noMore: i18n[this.$hipsLang]["noMoreTxt"],
          },
        },
      },
      isSelected: true, // 已盘点或未盘点是否选中
      active: 0,
      showPopup: false, // 控制显示筛选框
      routerQuery: {}, // 路由参数路由参数
      indexDB: {}, // 数据库db
      tagNumList: [], // 该任务下tagNum集合
      unDevInventoryList: [], // 未盘点清单
      devInventoryList: [], // 已盘点清单
      checkstateList: [], // 快码-盘点结果list
      currentIndex: 0,
      footeButton: false, // 是否显示全选等按钮
      checked: false, // 全选是否选中
      filter: {
        // 筛选字段
        faCategoryDesc: "", // 固定资产目录
        faNameDesc: "", // 固定资产名称
        instanceDescription: "", // 设备名称
        specification: "", // 规格型号
        locationCode: "", // 安装（存放）地点
        btsMajorDesc: "", // 专业
      },
    };
  },
  watch: {
    checked(val, oldVal) {
      // 监听全选状态
      if (val) {
        this.unDevInventoryList.forEach((ele) => {
          ele.checked = true;
        });
      } else {
        this.unDevInventoryList.forEach((ele) => {
          ele.checked = false;
        });
      }
    },
  },
  beforeRouteEnter(to, form, next) {
    fromName = form.name;
    next(() => {});
  },
  async activated() {
    this.footeButton = false; // 底部按钮隐藏
    if (fromName === "FunctionSelect") {
      this.routerQuery = this.$route.query;
    }
    this.indexDB = this.$store.state.handoverInventory.indexDB;
    let allDeviceBillList = await indexeddb.cursorGetDataByIndex(
      this.indexDB,
      "deviceList",
      "taskId",
      this.routerQuery.taskId
    ); // 获取该任务下所有清单
    this.tagNumList = [];
    allDeviceBillList.forEach((element) => {
      // 获取该任务下所有的tagNum
      if (!this.tagNumList.includes(element.tagNum)) {
        this.tagNumList.push(element.tagNum);
      }
    });
    this.getUnDevInventoryList(); // 获取该任务下所有未盘点清单
    this.getFastCode(); // 获取快码值
  },
  methods: {
    loadRefresh() {
      // 下拉刷新
    },
    loadMore() {
      // 上拉加载
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate();
      });
    },
    handleLeft() {
      // 未盘点页签
      this.isSelected = true;
      this.getUnDevInventoryList();
    },
    handleRight() {
      // 已盘点页签
      this.footeButton = false; // 底部按钮隐藏
      this.isSelected = false;
      this.active = 0;
      this.resultStatus = ["30"]; // 状态默认为账实相符
      this.getDevInventoryList(); // 获取该任务下已盘点 账实相符清单
    },
    search() {
      // 筛选任务
      this.showPopup = true;
    },
    goDeatil(item, val, index) {
      // 跳转到资产明细页
      let inventoryList = item;
      if (val === "未盘点") {
        inventoryList = item.sameDevice;
      }
      if (!this.footeButton) {
        // 打印标签是否取消
        this.$router.push({
          name: "ShowInventoryDetail",
          query: {
            inventoryList,
            taskId: this.routerQuery.taskId,
          },
        });
      }
    },
    oprate(val) {
      // 筛选框确定事件
      this.showPopup = false;
      if (val === "confirm") {
        if (this.isSelected) {
          this.getUnDevInventoryList(); // 获取该任务下未盘点清单
        } else {
          this.getDevInventoryList(); // 获取该任务下已盘点清单
        }
      }
    },
    select(val) {
      // 点击页签
      this.resultStatus = val;
      this.getDevInventoryList(); // 获取该任务下已盘点清单
    },
    updateInput(val, key) {
      // 更新input框的值
      this.filter[key] = val;
    },
    printTag() {
      // 打印标签
      if (this.unDevInventoryList.length) {
        this.footeButton = true;
      } else {
        this.$hips.toast("暂无可打印的清单！");
      }
    },
    scanInventory() {
      // 扫描盘点
      let vm = this;
      const env = process.env.VUE_APP_BUILD; // 环境
      if (env === "release") {
        // 真机
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if (result.text !== "" && result.text !== "cancel") {
              // 扫一扫点击取消时，返回的result.text为空
              vm.$router.push({
                name: "ScanInventoryDetail",
                query: {
                  taskId: vm.routerQuery.taskId,
                  text: result.text,
                },
              });
            }
          },
          function () {
            console.log("失败了");
          },
          {
            preferFrontCamera: false, // iOS and Android（是否默认前置摄像头）
            showFlipCameraButton: true, // iOS and Android（是否允许转换摄像头）
            showTorchButton: true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (是否开启手电筒)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android（提示）
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500（猜测为默认扫描时间）
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED（格式）
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device（扫描框的方向，长方形或者正方形默认是长方形）
            disableAnimations: true, // iOS
            disableSuccessBeep: false, // iOS and Android
          }
        );
      } else {
        // 模拟
        vm.$router.push({
          name: "ScanInventoryDetail",
          query: {
            taskId: '12041',
            text: 'TEST1021001',
          },
        });
      }
    },
    changeChecked(val, currentIndex) {
      // 改变清单选择状态
      this.unDevInventoryList[currentIndex].checked = val;
    },
    confirmPrint() {
      // 确认打印
      let vm = this;
      // 打印成功回调
      window.bridgeLoginSuccess = function (str) {
        const res = JSON.parse(str);
        console.log("打印成功", JSON.stringify(res));
      };
      // 打印失败回调
      window.bridgeLoginFailure = function (res) {
        console.error(res);
        vm.$hips.toast("打印失败！");
      };
      let randomNum = Math.floor(Math.random() * (999 - 100)) + 100; // 生成三位随机数
      let dataArr = [];
      let printFlag = true; // 是否满足打印条件
      let checkFlag = false; // 是否有选中的数据
      this.unDevInventoryList.forEach((ele) => {
        let limitNum = 0;
        let currentIndex;
        if (ele.checked) {
          // 判断是否被选中
          checkFlag = true;
          ele.sameDevice.forEach((element, index) => {
            // 判断是否满足打印的条件--有且只有含一个.的层级码
            if (element.taskDeviceBillDto.hierarchicalCode) {
              // 层级码是否存在
              let arrData = element.taskDeviceBillDto.hierarchicalCode.split(
                "."
              );
              if (arrData.length === 2) {
                // 长度是否为2
                limitNum++; // 第几个长度为2的层级码
                currentIndex = index; // 满足条件的当前index
              }
            }
          });
          if (limitNum === 1) {
            // 只有含有一个.的层级码
            let faCategoryDesc = ele.sameDevice[currentIndex].taskDeviceBillDto
              .faCategoryDesc
              ? ele.sameDevice[currentIndex].taskDeviceBillDto.faCategoryDesc
              : "";
            let faNameDesc = ele.sameDevice[currentIndex].taskDeviceBillDto
              .faNameDesc
              ? ele.sameDevice[currentIndex].taskDeviceBillDto.faNameDesc
              : "";
            let temp = {
              // 参数
              cardType: 0, // 0设备 1房建
              tagNum: ele.sameDevice[currentIndex].tagNum, // 标签编号
              instanceDescription:
                ele.sameDevice[currentIndex].taskDeviceBillDto
                  .instanceDescription, // 设备名称
              unitOfMeasure:
                ele.sameDevice[currentIndex].taskDeviceBillDto.unitOfMeasure, // 计量单位
              specification:
                ele.sameDevice[currentIndex].taskDeviceBillDto.specification, // 规格型号
              faNameDesc: `${faCategoryDesc}${
                faNameDesc ? "/" : ""
              }${faNameDesc}`, // 固定资产目录/名称
              isfixed: "否", // 是否为固定资产
            };
            dataArr.push(temp);
          } else {
            // 不满足打印条件
            printFlag = false;
            this.$hips.toast(
              `标签编码为${ele.sameDevice[0].tagNum}的清单不满足打印条件！`
            );
          }
        }
      });
      if (!checkFlag) {
        this.$hips.toast("暂无选中的清单！");
        return;
      }
      let params = {
        filename: `${this.unDevInventoryList[0].sameDevice[0].taskName}_${randomNum}`, // 盘点任务名称+下划线+三位流水
        data: dataArr,
      };
      const dict = {
        className: "WebBridge",
        function: "showCard",
        params: params,
        successCallBack: "bridgeLoginSuccess",
        failureCallBack: "bridgeLoginFailure",
      };
      if (!printFlag) {
        // 不满足打印条件
        return;
      }
      HandBridge.postMessage(JSON.stringify(dict));
    },
    cancelPrint() {
      // 取消打印
      this.footeButton = false;
    },
    change(val) {
      // 改变选择状态
      this.checked = val;
    },
    async getDeviceListByTaskId(indexName, indexValue) {
      // 筛选满足条件的清单
      let dataList = await indexeddb.cursorGetDataByfilter(
        this.indexDB,
        "deviceList",
        indexName,
        indexValue,
        this.filter
      );
      return dataList;
    },
    async getUnDevInventoryList() {
      // 获取未盘点的数据
      this.unDevInventoryList = [];
      this.tagNumList.forEach(async (element) => {
        let sameDevice = await this.getDeviceListByTaskId(
          ["taskId", "resultStatus", "tagNum"],
          [this.routerQuery.taskId, "10", element]
        ); // 获取该任务下标签编号为element的未盘点清单
        // console.log(sameDevice[0].taskDeviceBillDto.hierarchicalCode)
        if (sameDevice.length !== 0) {
          let temp = {
            checked: false,
            sameDevice,
          };
          this.unDevInventoryList.push(temp); // 所有标签的未盘点清单
        }
        var Arr = JSON.parse(JSON.stringify(this.unDevInventoryList))
        for(let i in Arr){
          let item = Arr[i].sameDevice
          for(let j=0;j<item.length;j++){
            let a = item[j].taskDeviceBillDto.hierarchicalCode
            for(let o=j+1;o<item.length;o++){
              let b = item[o].taskDeviceBillDto.hierarchicalCode
              let temp 
              if(a>b){
                temp = item[o]
                item[o] = item[j]
                item[j] = temp
              }
            }
          }
        }
        // console.log(Arr)
        this.unDevInventoryList = Arr
      }); 
      leftRightScroll(this); // 表格左右滑动

      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate();
      });
    },
    async getDevInventoryList() {
      // 获取已盘点的数据
      this.devInventoryList = [];
      this.currentIndex = 0;
      await this.sameDevice(this.tagNumList[this.currentIndex]); // 获取指定tagNum的设备清单
      leftRightScroll(this);
      // 禁用上拉加载
      this.$nextTick(() => {
        this.$refs.scroll.forceUpdate();
      });
    },
    async sameDevice(tagNum) {
      // 获取标签编号为tagNum的已盘点清单
      let sameDeviceList; // 设备list
      let tagNumListLen = this.tagNumList.length;
      if (this.resultStatus.length === 2) {
        let sameDeviceOne = await this.getDeviceListByTaskId(
          ["taskId", "resultStatus", "resultCode", "tagNum"],
          [this.routerQuery.taskId, "20", this.resultStatus[0], tagNum]
        ); // 获取该任务下 资产编号为tagNum 盘点状态为 this.resultStatus[0]的清单--单套设备
        let sameDeviceTwo = await this.getDeviceListByTaskId(
          ["taskId", "resultStatus", "resultCode", "tagNum"],
          [this.routerQuery.taskId, "20", this.resultStatus[1], tagNum]
        ); // 获取该任务下 资产编号为tagNum 盘点状态为 this.resultStatus[0]的清单--单套设备
        sameDeviceList = sameDeviceOne.concat(sameDeviceTwo);
      } else if (this.resultStatus.length === 1) {
        let sameDevice = await this.getDeviceListByTaskId(
          ["taskId", "resultStatus", "resultCode", "tagNum"],
          [this.routerQuery.taskId, "20", this.resultStatus[0], tagNum]
        ); // 获取该任务下 资产编号为tagNum 盘点状态为 this.resultStatus[0]的清单--单套设备
        sameDeviceList = sameDevice;
      }
      if (sameDeviceList.length !== 0) {
        this.devInventoryList.push(sameDeviceList);
      }
      this.currentIndex++;
      if (tagNumListLen > this.currentIndex) {
        await this.sameDevice(this.tagNumList[this.currentIndex]); // 继续获取下一个tagNum的设备清单
      }
    },
    async getFastCode() {
      // 获取快码值 盘点状态 盘点轮次 盘点结果
      let checkstateList = await indexeddb.cursorGetDataByIndex(
        this.indexDB,
        "fastCode",
        "codeType",
        "CUX.BT.CHECK_RESULT_STATE"
      ); // 获取盘点状态快码值
      this.transte(checkstateList, "checkstateList"); // 盘点结果
    },
    transte(list, listName) {
      // 将快码值转换为select组件接收的类型
      this[listName] = [];
      list.forEach((element) => {
        let temp = {
          value: element.codeValue,
          label: element.meaning,
        };
        this[listName].push(temp);
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.hips-view {
  background: #fafafa !important;

  >>>.hips-view__content {
    // overflow-y scroll
  }

  .hips-nav-bar__theme-default {
    border-bottom: 1px solid #eee;
  }

  >>>.hips-scroll__content {
    padding: 0 15px 15px;
  }
}

.status {
  color: #6d7a80;
  width: 150px;
  height: 30px;
  margin: 0 auto;
  border: 1px solid #ddc;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.content {
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  >>>.table {
    tbody {
      background: #fff;
    }
  }

  .button {
    margin-top: 10px;

    .hips-button {
      background-color: #2896ff !important;
      flex: 1;
      margin-bottom: 10px;
      margin-right: 15px;
    }

    .hips-button:last-child {
      margin-right: 0;
    }
  }
}

.discontent {
  .item {
    // padding 0 15px
    // padding 15px
  }
}

.hips-popup--top {
  top: 65px;
}

.pop-content {
  padding: 10px 15px 0;

  .item {
    border: none;
  }

  .button {
    display: flex;
    height: 48px;
    line-height: 48px;
    border-top: 1px solid #ccc;

    p {
      flex: 1;
      text-align: center;
      color: #108aee;
    }

    p:last-child {
      color: #48d2a0;
    }
  }

  .title {
    color: #2896ff;
    text-align: center;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
}

.select {
  background-color: #2896ff;
  color: #fff;
}

.left {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  border-radius: 20px 0 0 20px;

  p {
    margin: auto 0;
  }
}

.right {
  flex: 1;
  height: 100%;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column-reverse;

  p {
    margin: auto 0;
  }
}

.layout {
  width: 80%;
  margin: 20px auto;
}

.override {
  padding: 0 !import;
}

>>>.hips-view__footer {
  height: auto !important;
}

.iconxuanzekuang1 {
  display: inline-block;
  margin: auto 0;
  font-size: 24px;
  color: #108aee;
}

.iconxuanzekuang {
  display: inline-block;
  margin: auto 0;
  font-size: 24px;
  color: #aaa;
}

.footer {
  display: flex;
  height: 13.333vw;
  width: 100%;
  text-align: center;
  color: #108AEE;
  padding: 0 15px;

  .chosse {
    display: flex;
    flex: 1;

    p {
      margin: auto 0;
    }
  }

  .button {
    margin: auto;
    flex: 1;
    display: flex;
  }

  .confirm {
    flex: 1;
    margin: auto;
    margin-right: 15px;
  }

  .cancel {
    flex: 1;
    margin: auto;
  }

  i {
    margin-right: 5px;
  }
}
</style>
