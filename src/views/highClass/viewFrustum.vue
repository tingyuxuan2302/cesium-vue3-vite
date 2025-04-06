<!-- 
 * @Description: 视锥体展示
 * @Author: 参考jiawanlong的示例：https://github.com/jiawanlong/Cesium-Examples/blob/main/examples/cesiumEx/5.3.12%E3%80%81GUI%E8%A7%86%E9%94%A5%E4%BD%93.html
-->
<template>
  <div></div>
</template>

<script setup>
import * as Cesium from "cesium";
import { onMounted, onUnmounted } from "vue";
import { latlng } from "@/utils/cesiumCtrl/latlng.js";
import * as dat from "dat.gui";

const { viewer } = window;

// 初始化参数
const obj = {
  x: 120,
  y: 30,
  z: 2000,
  heading: 0,
  pitch: 180,
  roll: 0,
  fov: 30,
  near: 10,
  far: 3000,
  aspectRatio: 1.4,
};

let primitive, primitive1;
let gui;

onMounted(() => {
  // 设置相机位置
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(120, 30, 20000),
  });

  // 初始化GUI控制面板
  gui = new dat.GUI();
  gui.domElement.style = "position:absolute;top:10px;left:10px;";

  // 添加控制参数
  gui.add(obj, "x", -180, 180).name("经度").onChange(updateFrustum);
  gui.add(obj, "y", -90, 90).name("纬度").onChange(updateFrustum);
  gui.add(obj, "z", 100, 10000).name("高度").onChange(updateFrustum);
  gui.add(obj, "heading", 0, 360).name("偏航角-水平").onChange(updateFrustum);
  gui.add(obj, "pitch", 0, 360).name("俯仰角-上下").onChange(updateFrustum);
  gui.add(obj, "roll", 0, 360).name("翻滚角-侧向").onChange(updateFrustum);
  gui.add(obj, "fov", 0, 180).name("上下角度").onChange(updateFrustum);
  gui.add(obj, "near", 0, 1000).name("近距").onChange(updateFrustum);
  gui.add(obj, "far", 0, 5000).name("远距").onChange(updateFrustum);
  gui.add(obj, "aspectRatio", 0, 3).name("横向比例").onChange(updateFrustum);

  // 初始化视锥体
  initFrustum();
});

onUnmounted(() => {
  // 清除资源
  if (gui) {
    gui.destroy();
  }
  if (primitive) {
    viewer.scene.primitives.remove(primitive);
  }
  if (primitive1) {
    viewer.scene.primitives.remove(primitive1);
  }
});

// 初始化视锥体
function initFrustum() {
  var position = Cesium.Cartesian3.fromDegrees(obj.x, obj.y, obj.z);
  var heading = Cesium.Math.toRadians(obj.heading);
  var pitch = Cesium.Math.toRadians(obj.pitch);
  var roll = Cesium.Math.toRadians(obj.roll);

  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

  addFrustum(
    position,
    orientation,
    obj.fov,
    obj.near,
    obj.far,
    obj.aspectRatio
  );
}

// 更新视锥体
function updateFrustum() {
  viewer.scene.primitives.remove(primitive);
  viewer.scene.primitives.remove(primitive1);

  var position = Cesium.Cartesian3.fromDegrees(obj.x, obj.y, obj.z);
  var heading = Cesium.Math.toRadians(obj.heading);
  var pitch = Cesium.Math.toRadians(obj.pitch);
  var roll = Cesium.Math.toRadians(obj.roll);

  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

  addFrustum(
    position,
    orientation,
    obj.fov,
    obj.near,
    obj.far,
    obj.aspectRatio
  );
}

// 创建视锥体及轮廓线
function addFrustum(position, orientation, fov, near, far, aspectRatio) {
  let frustum = new Cesium.PerspectiveFrustum({
    // 查看的视场角，绕Z轴旋转，以弧度方式输入
    fov: Cesium.Math.toRadians(fov),
    // 视锥体的宽度/高度
    aspectRatio: aspectRatio,
    // 近面距视点的距离
    near: near,
    // 远面距视点的距离
    far: far,
  });

  let instanceGeo = new Cesium.GeometryInstance({
    geometry: new Cesium.FrustumGeometry({
      frustum: frustum,
      origin: position,
      orientation: orientation,
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.AQUA.withAlpha(0.3)
      ),
    },
  });

  let instanceGeoLine = new Cesium.GeometryInstance({
    geometry: new Cesium.FrustumOutlineGeometry({
      frustum: frustum,
      origin: position,
      orientation: orientation,
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        new Cesium.Color(1.0, 1.0, 1.0, 1)
      ),
    },
  });

  primitive = new Cesium.Primitive({
    geometryInstances: [instanceGeo],
    appearance: new Cesium.PerInstanceColorAppearance({
      closed: true,
      flat: true,
    }),
    asynchronous: false,
  });

  primitive1 = new Cesium.Primitive({
    geometryInstances: [instanceGeoLine],
    appearance: new Cesium.PerInstanceColorAppearance({
      closed: true,
      flat: true,
    }),
    asynchronous: false,
  });

  viewer.scene.primitives.add(primitive);
  viewer.scene.primitives.add(primitive1);

  // 获取顶点坐标
  let zb = Cesium.FrustumOutlineGeometry.createGeometry(instanceGeo.geometry);
  const positions = zb.attributes.position.values;

  const temp = [];
  for (let i = 0; i < positions.length; i += 3) {
    temp.push(positions.slice(i, i + 3));
  }

  const result = [];
  temp.forEach(function (chunk) {
    result.push(
      latlng.formatPositon(new Cesium.Cartesian3(chunk[0], chunk[1], chunk[2]))
    );
  });
  console.log("视锥体顶点坐标：", result);
}
</script>

<style lang="less">
.dg.ac {
  left: 200px;
}
</style>
