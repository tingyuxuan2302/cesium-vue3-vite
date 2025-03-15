<!-- 代码来源： https://github.com/jiawanlong/Cesium-Examples -->

<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as Cesium from "cesium";
import RadarEmission from "@/utils/cesiumCtrl/RadarEmission";

const mapContainer = ref(null);
let viewer = null;
let radarEmission = null;

onMounted(() => {
  // 初始化Cesium viewer
  viewer = new Cesium.Viewer(mapContainer.value, {
    terrainProvider: Cesium.createWorldTerrain(),
  });

  // 创建雷达发射效果
  radarEmission = new RadarEmission(viewer, {
    position: [114, 35, 500000.0],
    heading: 135,
    color: Cesium.Color.CYAN,
    length: 500000,
    bottomRadius: 50000,
    thickness: 0.1,
  });

  // 定位到雷达
  radarEmission.zoomTo();
});

onBeforeUnmount(() => {
  // 销毁实体
  if (radarEmission) {
    radarEmission.destroy();
  }
  // 销毁viewer
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
