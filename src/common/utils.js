import * as Cesium from "cesium";

/**
 * @description: 延迟函数
 * @param {*} time 单位：ms
 * @return {*}
 */
export const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

/**
 * @description: 获取相机位置
 * @param {*} viewer
 * @return {*}
 */
export const getCameraView = (viewer) => {
  viewer = viewer || window.viewer;
  if (!viewer) {
    console.error('缺少viewer对象');
    return;
  }
  var camera = viewer.camera;
  var position = camera.position;
  var heading = camera.heading;
  var pitch = camera.pitch;
  var roll = camera.roll;
  var lnglat = Cesium.Cartographic.fromCartesian(position);

  var cameraV = {
    "x": Cesium.Math.toDegrees(lnglat.longitude),
    "y": Cesium.Math.toDegrees(lnglat.latitude),
    "z": lnglat.height,
    "heading": Cesium.Math.toDegrees(heading),
    "pitch": Cesium.Math.toDegrees(pitch),
    "roll": Cesium.Math.toDegrees(roll)
  };
  return cameraV;
}