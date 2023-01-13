/*
 * @Description: 点效果集合父类
 * @Author: 笙痞77
 * @Date: 2023-01-12 16:30:19
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-12 16:31:15
 */
import * as Cesium from "cesium";

export default class Effect {
  viewer;
  id;
  duration;
  maxRadius;
  pointDraged;
  leftDownFlag;
  update_position;
  constructor(viewer, id) {
    this.viewer = viewer;
    this.id = id;
    this.duration = 1000;
    this.maxRadius = 1000;
    this.pointDraged = null;
    this.leftDownFlag = false;
  }
  change_duration(d) {
    this.duration = d;
  }
  change_color(val) {
    const curEntity = this.viewer.entities.getById(this.id);
    curEntity._ellipse._material.color = new Cesium.Color.fromCssColorString(
      val
    );
  }
  change_position(p) {
    const cartesian3 = Cesium.Cartesian3.fromDegrees(
      parseFloat(p[0]),
      parseFloat(p[1]),
      parseFloat(p[2])
    );
    const curEntity = this.viewer.entities.getById(this.id);
    curEntity.position = cartesian3;
  }
  del() {
    this.viewer.entities.removeById(this.id);
  }
  add(position, color, maxRadius, duration, isEdit = false) {
    const _this = this;
    this.duration = duration;
    this.maxRadius = maxRadius;
    if (!isEdit) {
      return;
    }

    function leftDownAction(e) {
      _this.pointDraged = _this.viewer.scene.pick(e.position); // 选取当前的entity
      if (
        _this.pointDraged &&
        _this.pointDraged.id &&
        _this.pointDraged.id.id === _this.id
      ) {
        _this.leftDownFlag = true;
        _this.viewer.scene.screenSpaceCameraController.enableRotate = false; // 锁定相机
      }
    }

    function leftUpAction(e) {
      _this.leftDownFlag = false;
      _this.pointDraged = null;
      _this.viewer.scene.screenSpaceCameraController.enableRotate = true; // 解锁相机
    }

    function mouseMoveAction(e) {
      if (
        _this.leftDownFlag === true &&
        _this.pointDraged !== null &&
        _this.pointDraged !== undefined
      ) {
        const ray = _this.viewer.camera.getPickRay(e.endPosition);
        const cartesian = _this.viewer.scene.globe.pick(
          ray,
          _this.viewer.scene
        );
        _this.pointDraged.id.position = cartesian; // 此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
        // 这里笛卡尔坐标转 经纬度
        const ellipsoid = _this.viewer.scene.globe.ellipsoid;
        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        let alt = cartographic.height;
        alt = alt < 0 ? 0 : alt;
        if (_this.update_position) {
          _this.update_position([lng.toFixed(8), lat.toFixed(8), alt]);
        }
      }
    }
    this.viewer.screenSpaceEventHandler.setInputAction(
      leftDownAction,
      Cesium.ScreenSpaceEventType.LEFT_DOWN
    );
    this.viewer.screenSpaceEventHandler.setInputAction(
      leftUpAction,
      Cesium.ScreenSpaceEventType.LEFT_UP
    );
    this.viewer.screenSpaceEventHandler.setInputAction(
      mouseMoveAction,
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
  }
}
