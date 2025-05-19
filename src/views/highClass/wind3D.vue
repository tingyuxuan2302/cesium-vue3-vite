<!-- 代码来源： https://github.com/jiawanlong/Cesium-Examples -->
<template>
  <div></div>
</template>
<script setup>
import { ref } from "vue";
import { CesiumWind } from "@/utils/cesiumCtrl/cesium-wind.js";

const windOptions = {
  colorScale: [
    "rgb(36,104, 180)",
    "rgb(60,157, 194)",
    "rgb(128,205,193 )",
    "rgb(151,218,168 )",
    "rgb(198,231,181)",
    "rgb(238,247,217)",
    "rgb(255,238,159)",
    "rgb(252,217,125)",
    "rgb(255,182,100)",
    "rgb(252,150,75)",
    "rgb(250,112,52)",
    "rgb(245,64,32)",
    "rgb(237,45,28)",
    "rgb(220,24,32)",
    "rgb(180,0,35)",
  ],
  frameRate: 16,
  maxAge: 60,
  globalAlpha: 0.9,
  velocityScale: 1 / 30,
  paths: 2000,
};
let windLayer;
fetch("/json/2024122600.json")
  .then((res) => res.json())
  .then((res) => {
    windLayer = new CesiumWind(res, { windOptions });
    windLayer.addTo(window.viewer);
    // windLayer.remove();
  });
</script>
<style lang="less" scoped></style>
