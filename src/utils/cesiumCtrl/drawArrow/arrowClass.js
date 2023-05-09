import * as Cesium from "cesium"
import { xp } from "./algorithm"

var StraightArrow = function (viewer) {
  this.type = "StraightArrow";
  this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0)); //用于区分多个相同箭头时
  this.viewer = viewer;
  this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  this.pointImageUrl = "/images/point.png";
  this.fillMaterial = Cesium.Color.fromCssColorString('#0000FF').withAlpha(0.8);
  this.outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
  });
  this.positions = [];
  this.firstPoint = null;
  this.floatPoint = null;
  this.arrowEntity = null;
  this.state = -1; //state用于区分当前的状态 0 为删除 1为添加 2为编辑 
  this.selectPoint = null;
  this.clickStep = 0;
  this.modifyHandler = null;
}
StraightArrow.prototype = {
  disable: function () {
    this.positions = [];
    if (this.firstPoint) {
      this.viewer.entities.remove(this.firstPoint);
      this.firstPoint = null;
    }
    if (this.floatPoint) {
      this.viewer.entities.remove(this.floatPoint);
      this.floatPoint = null;
    }
    if (this.arrowEntity) {
      this.viewer.entities.remove(this.arrowEntity);
      this.arrowEntity = null;
    }
    this.state = -1;
    if (this.handler) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.selectPoint) {
      this.viewer.entities.remove(this.selectPoint);
      this.selectPoint = null;
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
    this.clickStep = 0;
  },
  disableHandler: function () {
    if (this.handler && !this.handler.isDestroyed()) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.modifyHandler && !this.modifyHandler.isDestroyed()) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
  },
  startDraw: function () {
    var $this = this;
    this.state = 1;
    this.handler.setInputAction(function (evt) { //单机开始绘制
      var cartesian;
      cartesian = getCatesian3FromPX(evt.position, $this.viewer);
      if (!cartesian) return;
      if ($this.positions.length == 0) {
        $this.firstPoint = $this.creatPoint(cartesian);
        $this.firstPoint.type = "firstPoint";
        $this.floatPoint = $this.creatPoint(cartesian);
        $this.floatPoint.type = "floatPoint";
        $this.positions.push(cartesian);
      }
      if ($this.positions.length == 3) {
        $this.firstPoint.show = false;
        $this.floatPoint.show = false;
        $this.handler.destroy();
        $this.arrowEntity.objId = $this.objId;
        $this.state = -1;
      }
      $this.positions.push(cartesian.clone());
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction(function (evt) { //移动时绘制面
      if ($this.positions.length < 1) return;
      var cartesian;
      cartesian = getCatesian3FromPX(evt.endPosition, $this.viewer);
      if (!cartesian) return;

      $this.floatPoint.position.setValue(cartesian);
      if ($this.positions.length >= 2) {
        if (!Cesium.defined($this.arrowEntity)) {
          $this.positions.push(cartesian);
          $this.arrowEntity = $this.showArrowOnMap($this.positions);
        } else {
          $this.positions.pop();
          $this.positions.push(cartesian);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  startModify: function () { //修改箭头
    this.state = 2;
    this.firstPoint.show = true;
    this.floatPoint.show = true;
    var $this = this;
    this.clickStep = 0;
    if (!this.modifyHandler) this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.modifyHandler.setInputAction(function (evt) { //单机开始绘制
      var pick = $this.viewer.scene.pick(evt.position);
      if (Cesium.defined(pick) && pick.id) {
        $this.clickStep++;
        if (!pick.id.objId)
          $this.selectPoint = pick.id;
      } else { //激活移动点之后 单机面之外 移除这个事件
        $this.modifyHandler.destroy();
        $this.modifyHandler = null;
        $this.firstPoint.show = false;
        $this.floatPoint.show = false;
        $this.state = -1;
      }

      //选中点后 第二次点击 则重新定位该点
      if ($this.clickStep == 2) {
        $this.clickStep = 0;
        var cartesian;
        cartesian = getCatesian3FromPX(evt.position, $this.viewer);
        if (!cartesian) return;
        if ($this.selectPoint) {
          $this.selectPoint.position.setValue(cartesian);
          $this.selectPoint = null;
        }
      };
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.modifyHandler.setInputAction(function (evt) {
      if ($this.selectPoint) {
        var cartesian;
        cartesian = getCatesian3FromPX(evt.endPosition, $this.viewer);
        if (!cartesian) return;
        $this.selectPoint.position.setValue(cartesian);
        if ($this.selectPoint.type == "firstPoint") {
          $this.positions[1] = cartesian;
        }
        if ($this.selectPoint.type == "floatPoint") {
          $this.positions[2] = cartesian;
        }
      } else {
        return;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  createByData: function (data) { //通过传入的经纬度数组 构建箭头
    this.state = -1;
    this.positions = [];
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      var cart3 = Cesium.Cartesian3.fromDegrees(data[i][0], data[i][1]);
      arr.push(cart3);
    }
    this.positions = arr;
    this.firstPoint = this.creatPoint(this.positions[1]);
    this.firstPoint.type = "firstPoint";
    this.floatPoint = this.creatPoint(this.positions[2]);
    this.floatPoint.type = "floatPoint";
    this.arrowEntity = this.showArrowOnMap(this.positions);
    this.firstPoint.show = false;
    this.floatPoint.show = false;
    this.arrowEntity.objId = this.objId;
  },
  clear: function () { //清除绘制箭头
    this.state = 0;
    if (this.firstPoint) this.viewer.entities.remove(this.firstPoint);
    if (this.floatPoint) this.viewer.entities.remove(this.floatPoint);
    if (this.arrowEntity) this.viewer.entities.remove(this.arrowEntity);
    this.state = -1;
  },
  getLnglats: function () {
    var arr = [];
    for (var i = 0; i < this.positions.length; i++) {
      var item = this.cartesianToLatlng(this.positions[i]);
      arr.push(item);
    }
    return arr;
  },
  getPositions: function () { //获取直角箭头中的关键点
    return this.positions;
  },
  creatPoint: function (cartesian) {
    var point = this.viewer.entities.add({
      position: cartesian,
      billboard: {
        image: this.pointImageUrl,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
    point.attr = "editPoint";
    return point;
  },
  showArrowOnMap: function (positions) {
    var $this = this;
    var update = function () {
      if (positions.length < 2) {
        return null;
      }
      var p1 = positions[1];
      var p2 = positions[2];
      var firstPoint = $this.cartesianToLatlng(p1);
      var endPoints = $this.cartesianToLatlng(p2);
      var arrow = [];
      var res = xp.algorithm.fineArrow([firstPoint[0], firstPoint[1]], [endPoints[0], endPoints[1]]);
      var index = JSON.stringify(res).indexOf("null");
      if (index != -1) return [];
      for (var i = 0; i < res.length; i++) {
        var c3 = new Cesium.Cartesian3(res[i].x, res[i].y, res[i].z);
        arrow.push(c3);
      }
      return new Cesium.PolygonHierarchy(arrow);
    }
    return this.viewer.entities.add({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(update, false),
        show: true,
        fill: true,
        material: $this.fillMaterial
      })
    });
  },
  cartesianToLatlng: function (cartesian) {
    var latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    var lat = Cesium.Math.toDegrees(latlng.latitude);
    var lng = Cesium.Math.toDegrees(latlng.longitude);
    return [lng, lat];
  }
}

///====================================================================================================
//攻击箭头
var AttackArrow = function (viewer) {
  this.type = "AttackArrow";
  this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0))
  this.viewer = viewer;
  this.pointImageUrl = "/images/point.png";
  this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  this.fillMaterial = Cesium.Color.RED.withAlpha(0.8);
  this.outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
  });
  this.positions = []; //控制点
  this.state = -1; //state用于区分当前的状态 0 为删除 1为添加 2为编辑 
  this.floatPoint = null;
  this.arrowEntity = null;
  this.pointArr = []; //中间各点
  this.selectPoint = null;
  this.clickStep = 0; //用于控制点的移动结束
  this.modifyHandler = null;
}

AttackArrow.prototype = {
  disable: function () {
    this.positions = [];
    if (this.arrowEntity) {
      this.viewer.entities.remove(this.arrowEntity);
      this.arrowEntity = null;
    }
    this.state = -1;
    if (this.handler) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.floatPoint) {
      this.viewer.entities.remove(this.floatPoint);
      this.floatPoint = null;
    }
    if (this.selectPoint) {
      this.viewer.entities.remove(this.selectPoint);
      this.selectPoint = null;
    }
    for (var i = 0; i < this.pointArr.length; i++) {
      if (this.pointArr[i]) this.viewer.entities.remove(this.pointArr[i]);
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
    this.clickStep = 0;
  },
  disableHandler: function () {
    if (this.handler && !this.handler.isDestroyed()) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.modifyHandler && !this.modifyHandler.isDestroyed()) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
  },
  startDraw: function () {
    var $this = this;
    this.state = 1;
    this.handler.setInputAction(function (evt) { //单机开始绘制
      var cartesian;
      cartesian = getCatesian3FromPX(evt.position, $this.viewer);
      if (!cartesian) return;
      // var ray = viewer.camera.getPickRay(evt.position);
      // if (!ray) return;
      // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
      if ($this.positions.length == 0) {
        $this.floatPoint = $this.creatPoint(cartesian);
        $this.floatPoint.wz = -1;
      }
      $this.positions.push(cartesian);
      var point = $this.creatPoint(cartesian);
      if ($this.positions.length > 2) {
        point.wz = $this.positions.length - 1; //点对应的在positions中的位置  屏蔽mouseMove里往postions添加时 未创建点
      } else {
        point.wz = $this.positions.length; //点对应的在positions中的位置 
      }
      $this.pointArr.push(point);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction(function (evt) { //移动时绘制面
      if ($this.positions.length < 2) return;
      // var ray = viewer.camera.getPickRay(evt.endPosition);
      // if (!ray) return;
      // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
      var cartesian;
      cartesian = getCatesian3FromPX(evt.endPosition, $this.viewer);
      if (!cartesian) return;
      $this.floatPoint.position.setValue(cartesian);
      if ($this.positions.length >= 2) {
        if (!Cesium.defined($this.arrowEntity)) {
          $this.positions.push(cartesian);
          $this.arrowEntity = $this.showArrowOnMap($this.positions);
          $this.arrowEntity.objId = $this.objId;
        } else {
          $this.positions.pop();
          $this.positions.push(cartesian);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.setInputAction(function (evt) { //右击结束绘制
      // var ray = viewer.camera.getPickRay(evt.position);
      // if (!ray) return;
      // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
      var cartesian;
      cartesian = getCatesian3FromPX(evt.position, $this.viewer);
      if (!cartesian) return;
      for (var i = 0; i < $this.pointArr.length; i++) {
        $this.pointArr[i].show = false;
      }
      $this.floatPoint.show = false;
      $this.viewer.entities.remove($this.floatPoint);
      $this.floatPoint = null;
      var point = $this.creatPoint(cartesian);
      point.show = false;
      point.wz = $this.positions.length;
      $this.pointArr.push(point);
      $this.handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  },
  createByData: function (data) { //根据传入的数据构建箭头
    this.positions = []; //控制点
    this.state = -1; //state用于区分当前的状态 0 为删除 1为添加 2为编辑 
    this.floatPoint = null;
    this.pointArr = []; //中间各点
    this.selectPoint = null;
    this.clickStep = 0; //用于控制点的移动结束
    this.modifyHandler = null;
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      var cart3 = Cesium.Cartesian3.fromDegrees(data[i][0], data[i][1]);
      arr.push(cart3);
    }
    this.positions = arr;
    //构建控制点
    for (var i = 0; i < this.positions.length; i++) {
      var point = this.creatPoint(this.positions[i]);
      point.show = false;
      point.wz = i + 1;
      this.pointArr.push(point);
    }
    this.arrowEntity = this.showArrowOnMap(this.positions);
    this.arrowEntity.objId = this.objId;
  },
  startModify: function () { //修改箭头
    this.state = 2;
    var $this = this;
    for (var i = 0; i < $this.pointArr.length; i++) {
      $this.pointArr[i].show = true;
    }
    if (!this.modifyHandler) this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.modifyHandler.setInputAction(function (evt) { //单机开始绘制
      var pick = $this.viewer.scene.pick(evt.position);
      if (Cesium.defined(pick) && pick.id) {
        $this.clickStep++;
        if (!pick.id.objId)
          $this.selectPoint = pick.id;
      } else { //激活移动点之后 单机面之外 移除这个事件
        for (var i = 0; i < $this.pointArr.length; i++) {
          $this.pointArr[i].show = false;
        }
        if ($this.floatPoint) $this.floatPoint.show = false;
        $this.state = -1;
        $this.modifyHandler.destroy();
        $this.modifyHandler = null;
      }
      if ($this.clickStep == 2) {
        $this.clickStep = 0;
        // var ray = $this.viewer.camera.getPickRay(evt.position);
        // if (!ray) return;
        // var cartesian = $this.viewer.scene.globe.pick(ray, $this.viewer.scene);
        var cartesian;
        cartesian = getCatesian3FromPX(evt.position, $this.viewer);
        if (!cartesian) return;
        if ($this.selectPoint) {
          $this.selectPoint.position.setValue(cartesian);
          $this.selectPoint = null;
        }

      };
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.modifyHandler.setInputAction(function (evt) { //单机开始绘制
      // var ray = $this.viewer.camera.getPickRay(evt.endPosition);
      // if (!ray) return;
      // var cartesian = $this.viewer.scene.globe.pick(ray, $this.viewer.scene);
      var cartesian;
      cartesian = getCatesian3FromPX(evt.endPosition, $this.viewer);
      if (!cartesian) return;
      if ($this.selectPoint) {
        $this.selectPoint.position.setValue(cartesian);
        $this.positions[$this.selectPoint.wz - 1] = cartesian; //上方的wz用于此处辨识修改positions数组里的哪个元素
      } else {
        return;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  clear: function () { //清除绘制箭头
    this.state = 0;
    for (var i = 0; i < this.pointArr.length; i++) {
      if (this.pointArr[i]) this.viewer.entities.remove(this.pointArr[i]);
    }
    if (this.floatPoint) this.viewer.entities.remove(this.floatPoint);
    if (this.arrowEntity) this.viewer.entities.remove(this.arrowEntity);
    this.state = -1;
  },
  getLnglats: function () {
    var arr = [];
    for (var i = 0; i < this.positions.length; i++) {
      var item = this.cartesianToLatlng(this.positions[i]);
      arr.push(item);
    }
    return arr;
  },
  getPositions: function () { //获取直角箭头中的控制点 世界坐标
    return this.positions;
  },
  creatPoint: function (cartesian) {
    var point = this.viewer.entities.add({
      position: cartesian,
      billboard: {
        image: this.pointImageUrl,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }
    });
    point.attr = "editPoint";
    return point;
  },
  showArrowOnMap: function (positions) {
    var $this = this;
    var update = function () {
      //计算面
      if (positions.length < 3) {
        return null;
      }
      var lnglatArr = [];
      for (var i = 0; i < positions.length; i++) {
        var lnglat = $this.cartesianToLatlng(positions[i]);
        lnglatArr.push(lnglat)
      }
      var res = xp.algorithm.tailedAttackArrow(lnglatArr);
      var index = JSON.stringify(res.polygonalPoint).indexOf("null");
      var returnData = [];
      if (index == -1) returnData = res.polygonalPoint;
      return new Cesium.PolygonHierarchy(returnData);
    }
    return this.viewer.entities.add({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(update, false),
        show: true,
        fill: true,
        material: $this.fillMaterial
      })
    });
  },
  cartesianToLatlng: function (cartesian) {
    var latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    var lat = Cesium.Math.toDegrees(latlng.latitude);
    var lng = Cesium.Math.toDegrees(latlng.longitude);
    return [lng, lat];
  }
}

///====================================================================================================
//钳击箭头
var PincerArrow = function (viewer) {
  this.type = "PincerArrow";
  this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0))
  this.viewer = viewer;
  this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  this.pointImageUrl = "/images/point.png";
  this.fillMaterial = Cesium.Color.YELLOW.withAlpha(0.8);
  this.outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString('#f00').withAlpha(0.7)
  });
  this.positions = [];
  this.state = -1; //state用于区分当前的状态 0 为删除 1为添加 2为编辑 
  this.floatPoint = null;
  this.pointArr = [];
  this.selectPoint = null;
  this.clickStep = 0; //用于控制点的移动结束
  this.modifyHandler = null;
}

PincerArrow.prototype = {
  disable: function () {
    this.positions = [];
    if (this.arrowEntity) {
      this.viewer.entities.remove(this.arrowEntity);
      this.arrowEntity = null;
    }
    this.state = -1;
    if (this.handler) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.floatPoint) {
      this.viewer.entities.remove(this.floatPoint);
      this.floatPoint = null;
    }
    if (this.selectPoint) {
      this.viewer.entities.remove(this.selectPoint);
      this.selectPoint = null;
    }
    for (var i = 0; i < this.pointArr.length; i++) {
      if (this.pointArr[i]) this.viewer.entities.remove(this.pointArr[i]);
    }
    if (this.modifyHandler) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
    this.clickStep = 0;
  },
  disableHandler: function () {
    if (this.handler && !this.handler.isDestroyed()) {
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    if (this.modifyHandler && !this.modifyHandler.isDestroyed()) {
      this.modifyHandler.destroy();
      this.modifyHandler = null;
    }
  },
  startDraw: function () {
    var $this = this;
    this.state = 1;
    this.handler.setInputAction(function (evt) { //单机开始绘制
      // var ray = viewer.camera.getPickRay(evt.position);
      // if (!ray) return;
      // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
      var cartesian;
      cartesian = getCatesian3FromPX(evt.position, $this.viewer);
      if (!cartesian) return;

      if ($this.positions.length == 0) {
        $this.floatPoint = $this.creatPoint(cartesian);
      }
      if ($this.positions.length > 4) { //结束绘制
        var point = $this.creatPoint(cartesian);
        point.wz = $this.positions.length;
        $this.pointArr.push(point);
        for (var i = 0; i < $this.pointArr.length; i++) {
          $this.pointArr[i].show = false;
        }
        if ($this.floatPoint) { //移除动态点
          $this.floatPoint.show = false;
          $this.viewer.entities.remove($this.floatPoint);
          $this.floatPoint = null;
        }
        $this.handler.destroy();
        return;
      } else {
        $this.positions.push(cartesian);
        var point = $this.creatPoint(cartesian);
        if ($this.positions.length > 2) {
          point.wz = $this.positions.length - 1; //点对应的在positions中的位置  屏蔽mouseMove里往postions添加时 未创建点
        } else {
          point.wz = $this.positions.length; //点对应的在positions中的位置 
        }
        $this.pointArr.push(point);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(function (evt) { //移动时绘制面
      if ($this.positions.length < 2) return;
      // var ray = viewer.camera.getPickRay(evt.endPosition);
      // if (!ray) return;
      // var cartesian = viewer.scene.globe.pick(ray, $this.viewer.scene);
      var cartesian;
      cartesian = getCatesian3FromPX(evt.endPosition, $this.viewer);
      if (!cartesian) return;
      $this.floatPoint.position.setValue(cartesian);
      if ($this.positions.length >= 2) {
        if (!Cesium.defined($this.arrowEntity)) {
          $this.positions.push(cartesian);
          $this.arrowEntity = $this.showArrowOnMap($this.positions);
          $this.arrowEntity.objId = $this.objId;
        } else {
          $this.positions.pop();
          $this.positions.push(cartesian);
        }
      }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  },
  createByData: function (data) { //根据传入的数据构建箭头
    this.positions = []; //控制点
    this.state = -1; //state用于区分当前的状态 0 为删除 1为添加 2为编辑 
    this.floatPoint = null;
    this.pointArr = []; //中间各点
    this.selectPoint = null;
    this.clickStep = 0; //用于控制点的移动结束
    this.modifyHandler = null;
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      var cart3 = Cesium.Cartesian3.fromDegrees(data[i][0], data[i][1]);
      arr.push(cart3);
    }
    this.positions = arr;
    //构建控制点
    for (var i = 0; i < this.positions.length; i++) {
      var point = this.creatPoint(this.positions[i]);
      point.show = false;
      point.wz = i + 1;
      this.pointArr.push(point);
    }
    this.arrowEntity = this.showArrowOnMap(this.positions);
    this.arrowEntity.objId = this.objId;
  },
  startModify: function () { //修改箭头
    this.state = 2;
    var $this = this;
    for (var i = 0; i < $this.pointArr.length; i++) {
      $this.pointArr[i].show = true;
    }
    if (!this.modifyHandler) this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.modifyHandler.setInputAction(function (evt) { //单机开始绘制
      var pick = $this.viewer.scene.pick(evt.position);
      if (Cesium.defined(pick) && pick.id) {
        $this.clickStep++;
        if (!pick.id.objId)
          $this.selectPoint = pick.id;
      } else {
        for (var i = 0; i < $this.pointArr.length; i++) {
          $this.pointArr[i].show = false;
        }
        $this.state = -1;
        $this.modifyHandler.destroy(); //激活移动点之后 单机面之外 移除这个事件
        $this.modifyHandler = null;
      }
      if ($this.clickStep == 2) {
        $this.clickStep = 0;
        // var ray = $this.viewer.camera.getPickRay(evt.position);
        // if (!ray) return;
        // var cartesian = $this.viewer.scene.globe.pick(ray, $this.viewer.scene);
        var cartesian;
        cartesian = getCatesian3FromPX(evt.position, $this.viewer);
        if (!cartesian) return;
        if ($this.selectPoint) {
          $this.selectPoint.position.setValue(cartesian);
          $this.selectPoint = null;
        }

      };
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.modifyHandler.setInputAction(function (evt) { //单机开始绘制
      // var ray = $this.viewer.camera.getPickRay(evt.endPosition);
      // if (!ray) return;
      // var cartesian = $this.viewer.scene.globe.pick(ray, $this.viewer.scene);
      var cartesian;
      cartesian = getCatesian3FromPX(evt.endPosition, $this.viewer);
      if (!cartesian) return;
      if ($this.selectPoint) {
        $this.selectPoint.position.setValue(cartesian);
        $this.positions[$this.selectPoint.wz - 1] = cartesian; //上方的wz用于此处辨识修改positions数组里的哪个元素
      } else {
        return;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  clear: function () { //清除绘制箭头
    this.state = 0;
    for (var i = 0; i < this.pointArr.length; i++) {
      if (this.pointArr[i]) this.viewer.entities.remove(this.pointArr[i]);
    }
    if (this.floatPoint) this.viewer.entities.remove(this.floatPoint);
    if (this.arrowEntity) this.viewer.entities.remove(this.arrowEntity);
    this.state = -1;
  },
  getLnglats: function () { //获取直角箭头中的关键点 经纬度
    var arr = [];
    for (var i = 0; i < this.positions.length; i++) {
      var item = this.cartesianToLatlng(this.positions[i]);
      arr.push(item);
    }
    return arr;
  },
  getPositions: function () { //获取直角箭头中的关键点 世界坐标
    return this.positions;
  },
  creatPoint: function (cartesian) {
    return this.viewer.entities.add({
      position: cartesian,
      billboard: {
        image: this.pointImageUrl,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
  },
  showArrowOnMap: function (positions) {
    var $this = this;
    var update = function () {
      //计算面
      if (positions.length < 3) {
        return null;
      }
      var lnglatArr = [];
      for (var i = 0; i < positions.length; i++) {
        var lnglat = $this.cartesianToLatlng(positions[i]);
        lnglatArr.push(lnglat)
      }
      var res = xp.algorithm.doubleArrow(lnglatArr);
      var returnData = [];
      var index = JSON.stringify(res.polygonalPoint).indexOf("null");
      if (index == -1) returnData = res.polygonalPoint;
      return new Cesium.PolygonHierarchy(returnData);
    }
    return this.viewer.entities.add({
      polygon: new Cesium.PolygonGraphics({
        hierarchy: new Cesium.CallbackProperty(update, false),
        show: true,
        fill: true,
        material: $this.fillMaterial
      })
    });
  },
  cartesianToLatlng: function (cartesian) {
    var latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    var lat = Cesium.Math.toDegrees(latlng.latitude);
    var lng = Cesium.Math.toDegrees(latlng.longitude);
    return [lng, lat];
  }
}

function getCatesian3FromPX(px, viewer) {
  var picks = viewer.scene.drillPick(px);
  // viewer.render();
  var cartesian;
  var isOn3dtiles = true;
  for (var i = 0; i < picks.length; i++) {
    if ((picks[i] && picks[i].primitive) || picks[i] instanceof Cesium.Cesium3DTileFeature) { //模型上拾取
      isOn3dtiles = true;
    }
  }
  if (isOn3dtiles) {
    cartesian = viewer.scene.pickPosition(px);
  } else {
    var ray = viewer.camera.getPickRay(px);
    if (!ray) return null;
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  }
  return cartesian;
}

export {
  StraightArrow,
  AttackArrow,
  PincerArrow,
}

