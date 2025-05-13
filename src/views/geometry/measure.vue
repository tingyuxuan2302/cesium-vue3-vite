<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-16 15:06:26
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-23 11:25:44
-->
<script setup>
import * as Cesium from "cesium";
import { onMounted, onUnmounted, ref, onBeforeMount, watch } from "vue";
import MeasureTool from "@/utils/cesiumCtrl/measure.js";

const { viewer } = window;

onBeforeMount(() => {
  viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
});
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
});
const measure = new MeasureTool(viewer);

/**
 * 测距
 */
const onLineMeasure = () => {
  measure.drawLineMeasureGraphics({
    clampToGround: true,
    callback: (e) => {
      console.log("----", e);
    },
  });
};
/**
 * 测面积
 */
const onAreaMeasure = () => {
  measure.drawAreaMeasureGraphics({
    clampToGround: true,
    callback: () => {},
  });
};
/**
 * 三角量测
 */
const onTrianglesMeasure = () => {
  measure.drawTrianglesMeasureGraphics({
    callback: () => {},
  });
};
const onClear = () => {
  measure._drawLayer.entities.removeAll();
};
onUnmounted(() => {
  onClear();
  viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: "http://data.marsgis.cn/terrain",
  });
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onLineMeasure">空间距离</el-button>
    <el-button type="primary" @click="onAreaMeasure">空间面积</el-button>
    <el-button type="primary" @click="onTrianglesMeasure">三角量测</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
