<!--
 * @Description: 地形压平（此功能需要修改cesium源码）
  修改位置：
    cesium-vue3-vite/node_modules/@cesium/engine/Source/Scene/GlobeSurfaceTile.js 790行
      terrainData = terrainProvider.filterTerrainTile(x,y,level,terrainData);
  替换为：
      // 这里需要修改源码，过滤需要压平的范围内的地形数据
      if(terrainProvider.filterTerrainTile) {
        terrainData = terrainProvider.filterTerrainTile(x,y,level,terrainData);
      }
  注：
    需要在初始化cesium.viewer时,使用CesiumTerrainProviderEdit替换原来的CesiumTerrainProvider类，实现指定区域地形压平处理
      terrainProvider: new CesiumTerrainProviderEdit({
        url: "http://data.marsgis.cn/terrain",
      })
 * @Author: LukeSuperCoder
 * @Date: 2023-09-12 10:00:00
 * @LastEditors: LukeSuperCoder
 * @LastEditTime: 2023-09-12 10:00:00
-->
<script setup>
import * as Cesium from "cesium";
import { onMounted, onUnmounted, ref } from "vue";
import DrawTool from "@/utils/cesiumCtrl/drawGraphic";
import { PlanishArea } from "@/utils/cesiumCtrl/flat/PlanishArea";

const { viewer } = window;
const drawTool = new DrawTool(viewer);
const planishArea = new PlanishArea();
let height = ref(0);
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(114.26116, 22.965522, 5000),
  orientation: {
    heading: Cesium.Math.toRadians(175.0),
    pitch: Cesium.Math.toRadians(-35.0),
    roll: 0.0,
  },
});
//获取绘制完成回调，拿到绘制面数据
const getDrawPolygon = (e) => {
  drawTool.clearAll();
  clearPlanish();
  const coords = e.polygon.hierarchy
    .getValue()
    .positions.map((position) => Cesium.Cartographic.fromCartesian(position));
  let areaData = [];
  coords.forEach((cartographic) => {
    // 弧度转为经纬度
    let lon = Cesium.Math.toDegrees(cartographic.longitude);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    areaData.push(lon);
    areaData.push(lat);
  });
  planishArea.name = "测试";
  planishArea.area = areaData;
  planishArea.height = height.value;
  savePlanish(planishArea.uuid, areaData, planishArea.height);
};

/**
 * 进行地形压平处理
 * @param uuid 唯一标识符
 * @param areaData 压平区域数据
 * @param height 压平高度
 */
const savePlanish = (uuid, areaData, height) => {
  let terrainProvider = viewer.scene.terrainProvider;
  // 进行压平处理
  terrainProvider.addTerrainEditsData(uuid, areaData, height);
  viewer.scene.globe._surface.invalidateAllTiles();
};
/**
 * 清除压平
 */
const clearPlanish = () => {
  let terrainProvider = viewer.scene.terrainProvider;
  terrainProvider.removeTerrainEditsData(planishArea.uuid);
  viewer.scene.globe._surface.invalidateAllTiles();
  drawTool.clearAll();
};
onUnmounted(() => {
  drawTool.clearAll();
  clearPlanish();
});
</script>
<template>
  <operate-box>
    <div style="color: aliceblue">高度设置(默认设置为0代表压平处理)</div>
    <el-input
      label="高度设置"
      type="number"
      v-model="height"
      style="width: 100px"
    ></el-input>
    <el-button
      type="primary"
      @click="drawTool.activate('Polygon', getDrawPolygon)"
      >开始绘制</el-button
    >
    <el-button type="primary" @click="clearPlanish()">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
