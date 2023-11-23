<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-06-05 11:16:24
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 16:08:27
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onUnmounted, ref } from "vue";
import DrawTool from "@/utils/cesiumCtrl/drawGraphic";

const store = useStore();
const { viewer } = store.state;
const drawTool = new DrawTool(viewer);

onUnmounted(() => {
  drawTool.clearAll();
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="drawTool.activate('Point')">点</el-button>
    <el-button type="primary" @click="drawTool.activate('Polyline')"
      >线</el-button
    >
    <el-button type="primary" @click="drawTool.activate('Polygon')"
      >面</el-button
    >
    <el-button type="primary" @click="drawTool.clearAll()">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
