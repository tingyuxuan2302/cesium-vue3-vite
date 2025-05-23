<!--
 * @Descripttion: entities各类基本要素渲染
 * @Author: LukeSuperCoder
 * @Date: 2024-09-25 10:00:00
 * @LastEditors: LukeSuperCoder
 * @LastEditTime: 2024-09-25 10:00:00
-->

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import { getGeojson } from "@/common/api/api.js";

// viewer就是cesium实例化之后的场景示例，我把他存在了vuex的store中
const { viewer } = window;
const scene = viewer.scene;

//实体一 添加多边形面
const addPolygon = () => {
  // const entities = viewer.entities.add({
  //   polygon: {
  //     hierarchy: Cesium.Cartesian3.fromDegreesArray([
  //       -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596,
  //       -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429,
  //       -107.919731, 41.003906, -109.04798, 40.998429, -111.047063, 40.998429,
  //       -111.047063, 42.000709, -111.047063, 44.476286, -111.05254, 45.002073,
  //     ]),
  //     height: 8000,
  //     material: Cesium.Color.RED.withAlpha(0.5),
  //     outline: true,
  //     outlineColor: Cesium.Color.BLACK,
  //   }
  // })
  const entities1 = viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -109.080842, 45.002073, -104.058488, 45.002073, -104.053011, 41.003906,
        -105.728954, 41.003906,
      ]),
      height: 5000,
      material: Cesium.Color.BLUE.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });
  viewer.zoomTo(entities1);
};

const addBox = () => {
  const box = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-109.080842, 45.002073),
    box: new Cesium.BoxGraphics({
      heightReference: 1, // 贴在地形上或3Dtiles上
      dimensions: new Cesium.Cartesian3(5000, 5000, 5000),
      material: Cesium.Color.RED.withAlpha(0.5),
      //在指定距离内展示
      show: true,
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
    }),
  });
  viewer.zoomTo(box);
};

const addEllipseGraphics = () => {
  const ellipse = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-105.91517, 45.002073),
    ellipse: new Cesium.EllipseGraphics({
      heightReference: "NONE",
      extrudedHeight: 5000,
      semiMinorAxis: 3000,
      semiMajorAxis: 5000,
      material: Cesium.Color.RED.withAlpha(0.5),
    }),
  });
  viewer.zoomTo(ellipse);
};

const addCorridorGraphics = () => {
  const corridor = viewer.entities.add({
    corridor: new Cesium.CorridorGraphics({
      extrudedHeight: 10000,
      height: 1000,
      width: 5000,
      material: Cesium.Color.RED.withAlpha(0.5),
      positions: Cesium.Cartesian3.fromDegreesArray([
        -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596,
        -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429,
      ]),
    }),
  });
  viewer.zoomTo(corridor);
};

const addCylinderGraphics = () => {
  const cylinder = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-104.058488, 44.996596),
    cylinder: new Cesium.CylinderGraphics({
      length: 5000,
      topRadius: 500,
      bottomRadius: 500,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      numberOfVerticalLines: 20,
    }),
  });
  viewer.zoomTo(cylinder);
};

const addPolylineGraphics = () => {
  const graphics = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596,
        -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429,
        -107.919731, 41.003906, -109.04798, 40.998429, -111.047063, 40.998429,
        -111.047063, 42.000709, -111.047063, 44.476286, -111.05254, 45.002073,
      ]),
      width: 10,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
      }),
    },
  });
  viewer.zoomTo(graphics);
};

const addPolylineVolumes = (cornerType, color = "ORANGE") => {
  const redTube = viewer.entities.add({
    name: "Red tube with rounded corners",
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        -85.0, 32.0, -85.0, 36.0, -89.0, 36.0, -87.84, 42.49,
      ]),
      shape: computeCircle(60000.0),
      material: Cesium.Color[color],
      cornerType: Cesium.CornerType[cornerType],
    },
  });
  viewer.zoomTo(redTube);
};

const addRectangle = () => {
  const rectangle = viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 25.0),
      extrudedHeight: 300000.0,
      height: 100000.0,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });
  viewer.zoomTo(rectangle);
};

const addSpheres = () => {
  const spheres = viewer.entities.add({
    name: "Spheres",
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    ellipsoid: {
      radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0),
      innerRadii: new Cesium.Cartesian3(150000.0, 150000.0, 200000.0),
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
    },
  });
  viewer.zoomTo(spheres);
};

const addWall = () => {
  const greenWall = viewer.entities.add({
    name: "Green wall from surface with outline",
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        -107.0, 43.0, 100000.0, -97.0, 43.0, 100000.0, -97.0, 40.0, 100000.0,
        -107.0, 40.0, 100000.0, -107.0, 43.0, 100000.0,
      ]),
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
    },
  });
  viewer.zoomTo(greenWall);
};
// 先获取点位的json信息
const getJson = () => {
  getGeojson("/json/chuzhong.geojson").then(({ res }) => {
    console.log(res);
    const { features } = res;
  });
};
const formatData = (features) => {
  let result = [];
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    // 每个点位的坐标
    const coordinates = feature.geometry.coordinates;
    // 将坐标处理成3D笛卡尔点
    const position = Cesium.Cartesian3.fromDegrees(
      coordinates[0],
      coordinates[1],
      5000
    );
    result.push(position);
  }
  return result;
};

const computeCircle = (radius) => {
  const positions = [];
  for (let i = 0; i < 360; i++) {
    const radians = Cesium.Math.toRadians(i);
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians)
      )
    );
  }
  return positions;
};

const clear = () => {
  viewer.entities.removeAll();
};

onMounted(() => {
  clear();
});
</script>
<template>
  <OperateBox>
    <div>
      <el-button type="primary" @click="addPolygon">添加多边形面</el-button>
      <el-button type="primary" @click="addBox">添加盒子模型</el-button>
      <el-button type="primary" @click="addEllipseGraphics"
        >添加椭圆形</el-button
      >
      <el-button type="primary" @click="addCorridorGraphics"
        >添加走廊</el-button
      >
      <el-button type="primary" @click="addCylinderGraphics"
        >添加圆柱</el-button
      >
    </div>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="addPolylineGraphics"
        >添加线段</el-button
      >
      <el-button type="primary" @click="addPolylineVolumes('ROUNDED', 'RED')"
        >线段体积(圆形)</el-button
      >
      <el-button type="primary" @click="addPolylineVolumes('MITERED', 'BLUE')"
        >线段体积(直角)</el-button
      >
      <el-button type="primary" @click="addPolylineVolumes('BEVELED')"
        >线段体积(切角)</el-button
      >
      <el-button type="primary" @click="addRectangle">添加矩形</el-button>
      <el-button type="primary" @click="addSpheres">添加球体</el-button>
      <el-button type="primary" @click="addWall">添加墙</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="clear">清除</el-button>
    </div>
  </OperateBox>
</template>
<style lang="less" scoped></style>
