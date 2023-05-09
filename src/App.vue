<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2022-10-13 16:07:57
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-09 16:38:02
-->
<script setup>
import { onMounted } from "vue";
import store from "@/store/store.js";
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYWE5M2QzNy1hNGFjLTQ3YzItYmU0ZS05MDkyODc1MzVhNzAiLCJpZCI6MTE1MDQwLCJpYXQiOjE2Njg1OTA2NDh9.oW-_utGumUSPqYzlWGjhG8hbda-b4UxZdL0_2t4ASig";

onMounted(() => {
  init();
});
const init = () => {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    infoBox: false,
    timeline: false, // 是否显示时间线控件
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }),
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: "http://data.marsgis.cn/terrain",
    })
    // // 指定上下文
    // contextOptions: {
    //   requestWebgl1: true,
    // },
  });
  // 不显示底图
  // viewer.imageryLayers.get(0).show = false;
  // viewer.scene.globe.show = false
  // 去除logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;
  viewer.scene.globe.depthTestAgainstTerrain = true;

  // const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  //   url: "http://114.215.136.187:8080/spatio/resource-service/4e57e9342d7244dc95e36bf5e6980eb9/63/{z}/{x}/{y}.png",
  // })
  // viewer.imageryLayers.addImageryProvider(imageryProvider)
  // viewer.camera.setView({
  //   // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  //   destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
  // })

  store.commit("initViewer", viewer);
  // 外天空盒 
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: '/images/Standard-Cube-Map/px1.png',
      negativeX: '/images/Standard-Cube-Map/nx1.png',
      positiveY: '/images/Standard-Cube-Map/pz.png',
      negativeY: '/images/Standard-Cube-Map/nz1.png',
      positiveZ: '/images/Standard-Cube-Map/py.png',
      negativeZ: '/images/Standard-Cube-Map/ny1.png'
    }
  })

  // 监听点击事件，拾取坐标
  // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // handler.setInputAction((e) => {
  //   const clickPosition = viewer.scene.camera.pickEllipsoid(e.position);
  //   const randiansPos = Cesium.Cartographic.fromCartesian(clickPosition);
  //   console.log(
  //     "经度：" +
  //     Cesium.Math.toDegrees(randiansPos.longitude) +
  //     ", 纬度：" +
  //     Cesium.Math.toDegrees(randiansPos.latitude)
  //   );
  // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
