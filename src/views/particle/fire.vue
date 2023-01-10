<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-10 11:10:34
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-10 15:47:20
-->
<script setup>
import { ref } from 'vue'
import FireEffect from "@/helpFunc/fire.js"
import { useStore } from 'vuex';
import * as Cesium from "cesium"

const store = useStore()
const { viewer } = store.state
new FireEffect(viewer)
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 1000),
})
</script>
<template>
  <div></div>
</template>
<style lang='less' scoped>

</style>