<!-- 代码来源： https://github.com/jiawanlong/Cesium-Examples -->
<template>
  <OperateBox>
    <el-button type="primary" @click="onStart">开始运动</el-button>
    <el-button type="primary" @click="pauseOrContinue(false)">暂停</el-button>
    <el-button type="primary" @click="pauseOrContinue(true)">继续</el-button>
    <el-button type="primary" @click="endRoaming()">取消</el-button>
  </OperateBox>
</template>
<script setup>
import { ref } from "vue";
import Roaming from "@/utils/cesiumCtrl/Roaming.js";
import * as Cesium from "cesium";
import { getGeojson } from "@/common/api/api.js";

const { viewer } = window;

var roaming = new Roaming(viewer, { time: 30 });
const onStart = () => {
  getGeojson("/json/roaming.json").then(({ res }) => {
    cameraRoaming(res);
  });
};

function cameraRoaming(obj) {
  let arr = obj.features[0].geometry.coordinates;
  let a111 = [];
  arr.forEach((k) => {
    a111.push(Cesium.Cartesian3.fromDegrees(k[0], k[1], 1000));
  });
  roaming.modelRoaming({
    model: {
      uri: "/models/Cesium_Air.glb",
      scale: 30,
      silhouetteSize: 5, //边框大小
      silhouetteColor: Cesium.Color.fromCssColorString("#001aff"), //边框
    },
    Lines: a111,
    path: {
      show: true,
    },
    polyline: {
      show: true,
      material: Cesium.Color.RED,
    },
  });
}
const pauseOrContinue = (params) => {
  roaming.PauseOrContinue(params);
};
const endRoaming = () => {
  roaming.EndRoaming();
};
</script>
<style lang="less" scoped></style>
