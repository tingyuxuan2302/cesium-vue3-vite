<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-03-29 10:56:57
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-03-29 14:48:26
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { ref } from "vue";
import dayjs from "dayjs";
import Clock from "@/utils/cesiumCtrl/clock.js";
const store = useStore();
const { viewer } = store.state;

new Clock(viewer);

// // 昼夜交替
// updateLighting(viewer);

// /**
//  * @description: 昼夜交替效果
//  * @param {*} _viewer
//  * @return {*}
//  */
// function updateLighting(_viewer) {
//   // OSM标准风格地图
//   const dayLayer = _viewer.imageryLayers.addImageryProvider(
//     new Cesium.UrlTemplateImageryProvider({
//       url: "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
//       subdomains: ["a", "b", "c", "d"],
//     })
//   );

//   // OSM暗色系地图
//   const nightLayer = _viewer.imageryLayers.addImageryProvider(
//     new Cesium.UrlTemplateImageryProvider({
//       url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
//       subdomains: ["a", "b", "c", "d"],
//     })
//   );
//   // 启用光照
//   _viewer.scene.globe.enableLighting = true;
//   _viewer.clock.shouldAnimate = true;
//   _viewer.clock.multiplier = 5000;
//   nightLayer.dayAlpha = 0.0;
// }
</script>
<template>
  <operate-box>
    <!-- <el-button type="primary" @click="onStart">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button> -->
  </operate-box>
</template>
<style scoped lang='less'>
</style>