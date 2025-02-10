<template>
  <operate-box>
    <el-button type="primary" @click="onStart">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<script setup>
import { ref } from 'vue'
import * as Cesium from 'cesium'
import WallPolygonDiffuse from '@/utils/cesiumCtrl/wallPolygonDiffuse'

let wallPolygonDiffuse = null

// 正多边形扩散
const onStart = () => {
  new WallPolygonDiffuse({
    viewer: window.__viewer,
    center: [113.9236839, 22.528061],
    radius: 1000.0,
    edge: 5,
    height: 200.0,
    speed: 15.0,
    minRadius: 50
  });

  window.__viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 1000)
  })
}

const onClear = () => {
  // if (wallPolygonDiffuse) {
  //   wallPolygonDiffuse.clear(
  // })
}


</script>
<style lang='less' scoped></style>