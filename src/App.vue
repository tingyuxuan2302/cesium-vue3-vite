<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2022-10-13 16:07:57
 * @LastEditors: 笙痞77
 * @LastEditTime: 2025-05-19 15:26:16
-->
<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import CesiumTerrainProviderEdit from "./utils/cesiumCtrl/flat/CesiumTerrainProviderEdit.js";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjBhMzcxMC0wNjBiLTRmYjItYjY1MC0wMzAwMzMyMGUyMmEiLCJpZCI6MzAzNzc3LCJpYXQiOjE3NDc2Mzk0NTV9.E_90aKtVdzRGlU2z48VwJ4mWvl-uuDkfQBCOO6zbzn4";

onMounted(() => {
  init();
});
const init = () => {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    infoBox: false,
    timeline: false, // 是否显示时间线控件
    // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    //   url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    // }),
    //此处使用CesiumTerrainProviderEdit替换原来的CesiumTerrainProvider类，实现指定区域地形压平处理
    // terrainProvider: new CesiumTerrainProviderEdit({
    //   url: "http://data.marsgis.cn/terrain",
    // }),
    // terrain: Cesium.Terrain.fromWorldTerrain({
    //   requestVertexNormals: true, //Needed to visualize slope
    // }),
    // 指定上下文
    // contextOptions: {
    //   requestWebgl1: true,
    // },
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromBasemapType(
        Cesium.ArcGisBaseMapType.SATELLITE
      )
    ),
  });
  // 不显示底图
  // viewer.imageryLayers.get(0).show = false;
  // 去除logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;
  viewer.scene.globe.depthTestAgainstTerrain = true;
  // 外天空盒
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: "/images/Standard-Cube-Map/px1.png",
      negativeX: "/images/Standard-Cube-Map/nx1.png",
      positiveY: "/images/Standard-Cube-Map/pz.png",
      negativeY: "/images/Standard-Cube-Map/nz1.png",
      positiveZ: "/images/Standard-Cube-Map/py.png",
      negativeZ: "/images/Standard-Cube-Map/ny1.png",
    },
  });

  // 调试使用
  window.viewer = viewer;

  // 监听点击事件，拾取坐标
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((e) => {
    const clickPosition = viewer.scene.camera.pickEllipsoid(e.position);
    const randiansPos = Cesium.Cartographic.fromCartesian(clickPosition);
    console.log(
      "经度：" +
        Cesium.Math.toDegrees(randiansPos.longitude) +
        ", 纬度：" +
        Cesium.Math.toDegrees(randiansPos.latitude)
    );
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
</script>

<template>
  <el-container>
    <el-aside>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-main>
        <div id="cesiumContainer"></div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.el-header {
  height: 30px;
}

.el-container {
  height: 100vh;
}

.el-main {
  padding: 0 !important;
  position: relative;
}

.el-aside {
  width: auto;
}
</style>
