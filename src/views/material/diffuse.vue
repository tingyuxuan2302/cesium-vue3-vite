<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-12 16:18:19
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 15:43:30
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onUnmounted, ref } from "vue";
import CircleDiffusion from "@/utils/cesiumCtrl/diffuse.js";
import { COORDINATE } from "@/common/constant.js";

const store = useStore();
const { viewer } = store.state;

viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(...COORDINATE, 10000),
});

// 圆扩散
const circleDiffusion = new CircleDiffusion(viewer, "circle");
const start = () => {
  circleDiffusion.add([...COORDINATE, 10], "#F7EB08", 2000, 5000);
};
start();
const onClear = () => {
  circleDiffusion.clear();
};
onUnmounted(() => {
  onClear();
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="start">渲染</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
