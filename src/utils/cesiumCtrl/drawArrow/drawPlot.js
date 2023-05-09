import {
  StraightArrow,
  AttackArrow,
  PincerArrow,
} from "./arrowClass"
import * as Cesium from "cesium"

const arrow = {
  isActivate: false,
  drawArr: [],
  handler: null,
  viewer: null,
  init: function (viewer) {
    if (!this.isActivate) {
      this.isActivate = true;
      this.viewer = viewer;
      this.bindEdit();
    }
  },
  disable: function () {
    if (this.isActivate) {
      this.isActivate = false;
      for (var i = 0; i < this.drawArr.length; i++) {
        this.drawArr[i].disable();
      }
      this.drawArr = [];
      if (this.handler && !this.handler.isDestroyed()) {
        this.handler.destroy();
        this.handler = null;
      }
      this.viewer = null;
    }
  },
  draw: function (type) {
    for (var i = 0; i < this.drawArr.length; i++) {
      this.drawArr[i].disableHandler();
    }
    switch (type) {
      case "straightArrow":
        var straightArrow = new StraightArrow(this.viewer);
        straightArrow.disable()
        straightArrow.startDraw();
        this.drawArr.push(straightArrow);
        break;
      case "attackArrow":
        var attackArrow = new AttackArrow(this.viewer);
        attackArrow.startDraw();
        this.drawArr.push(attackArrow);
        break;
      case "pincerArrow":
        var pincerArrow = new PincerArrow(this.viewer);
        pincerArrow.startDraw();
        this.drawArr.push(pincerArrow);
      default:
        break;
    }
  },
  saveData: function () { //保存用户数据
    var jsonData = {
      straightArrowData: [],
      attackArrowData: [],
      pincerArrowData: []
    }
    for (var step = 0; step < this.drawArr.length; step++) {
      var item = this.drawArr[step];
      var positions = item.getLnglats();
      if (item.type == "StraightArrow") {
        jsonData.straightArrowData.push(positions);
      } else if (item.type == "AttackArrow") {
        jsonData.attackArrowData.push(positions);
      } else {
        jsonData.pincerArrowData.push(positions);
      }
    }
    console.log("保存的数据：" + JSON.stringify(jsonData));
  },
  showData: function (jsonData) { //展示用户保存的数据
    if (!jsonData) return;
    var straightArrowArr = jsonData.straightArrowData;
    var attackArrowArr = jsonData.attackArrowData;
    var pincerArrowArr = jsonData.pincerArrowData;
    //展示直线箭头
    for (var i = 0; i < straightArrowArr.length; i++) {
      var item = straightArrowArr[i];
      var straightArrow = new StraightArrow(this.viewer);
      straightArrow.createByData(item);
      this.drawArr.push(straightArrow);
    }
    //展示攻击箭头
    for (var j = 0; j < attackArrowArr.length; j++) {
      var item = attackArrowArr[j];
      var attackArrow = new AttackArrow(this.viewer);
      attackArrow.createByData(item);
      this.drawArr.push(attackArrow);
    }
    //展示钳击箭头
    for (var z = 0; z < pincerArrowArr.length; z++) {
      var item = pincerArrowArr[z];
      var pincerArrow = new PincerArrow(this.viewer);
      pincerArrow.createByData(item);
      this.drawArr.push(pincerArrow);
    }

  },
  nowArrowObj: null,
  bindEdit: function () {
    var $this = this;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction(function (evt) { //单机开始绘制
      var pick = $this.viewer.scene.pick(evt.position);
      console.log("单击开始绘制pick", pick)
      if (Cesium.defined(pick) && pick.id) {
        if ($this.nowArrowObj) {
          if ($this.nowArrowObj.state != -1) {
            console.log("上一步操作未结束，请继续完成上一步！");
            return;
          }
        }
        console.log('drawArr', $this.drawArr);

        for (var i = 0; i < $this.drawArr.length; i++) {
          if (pick.id.objId == $this.drawArr[i].objId) {
            $this.nowArrowObj = $this.drawArr[i];
            $this.drawArr[i].startModify();
            break;
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  clearOne: function () {
    var $this = this;
    this.handler.setInputAction(function (evt) { //单机开始绘制
      var pick = $this.viewer.scene.pick(evt.position);
      if (Cesium.defined(pick) && pick.id) {
        for (var i = 0; i < $this.drawArr.length; i++) {
          if (pick.id.objId == $this.drawArr[i].objId) {
            $this.drawArr[i].clear();
            $this.drawArr.splice(i, 1);
            break;
          }
        }
        $this.handler.destroy();
        $this.bindEdit();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  clearAll: function () {
    for (var i = 0; i < this.drawArr.length; i++) {
      this.drawArr[i].clear();
    }
  }
}

export default arrow
