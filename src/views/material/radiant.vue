<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-12 16:18:19
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-12 17:56:07
-->
<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import { onUnmounted, ref } from 'vue'
import Radiant from "@/utils/cesiumCtrl/radiant.js"
import { COORDINATE } from "@/common/constant.js"

const store = useStore()
const { viewer } = store.state

viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(...COORDINATE, 10000),
})

// 水波纹扩散
let circleWave = new Radiant(viewer, "cirCleWave1");
circleWave.add([...COORDINATE, 10], 'red', 1000, 3000);

const onClear = () => {
  circleWave.del("cirCleWave1")
}
onUnmounted(() => {
  onClear()
})
</script>
<template>
  <operate-box>
    <el-button type='primary' @click='onStart'>开始</el-button>
    <el-button type='primary' @click='onClear'>清除</el-button>
  </operate-box>
</template>
<style scoped lang='less'>

</style>