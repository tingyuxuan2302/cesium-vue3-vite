<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2022-10-13 16:07:57
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-09 14:11:00
-->
<script setup>
import { Viewer, Ion } from 'cesium';
import { onMounted } from "vue"
import store from "@/store/store.js";

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYWE5M2QzNy1hNGFjLTQ3YzItYmU0ZS05MDkyODc1MzVhNzAiLCJpZCI6MTE1MDQwLCJpYXQiOjE2Njg1OTA2NDh9.oW-_utGumUSPqYzlWGjhG8hbda-b4UxZdL0_2t4ASig';

onMounted(() => {
  init()
})
const init = () => {
  const viewer = new Viewer('cesiumContainer', {
    infoBox: false
  });
  // 去除logo
  viewer.cesiumWidget.creditContainer.style.display = "none"
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;

  store.commit("initViewer", viewer)
}
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
