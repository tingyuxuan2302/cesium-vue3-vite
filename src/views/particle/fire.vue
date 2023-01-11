<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-10 11:10:34
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-11 09:41:04
-->
<script setup>
import { onUnmounted, ref } from 'vue'
import FireEffect from "@/utils/cesiumCtrl/fire.js"
import { useStore } from 'vuex';
import * as Cesium from "cesium"

const store = useStore()
const { viewer } = store.state
const fire = new FireEffect(viewer)
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 1000),
})
const onClear = () => {
  fire.remove()
}
onUnmounted(() => {
  fire.remove()
})
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style lang='less' scoped>

</style>