<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-04 11:07:05
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-04 18:00:10
-->
<script setup>
import RainEffect from "@/utils/cesiumCtrl/rain.js"
import { useStore } from "vuex"
import { onUnmounted } from "vue"

const store = useStore()
const instance = new RainEffect(store.state.viewer, {
  tiltAngle: -0.2, //倾斜角度
  rainSize: 1.0, // 雨大小
  rainSpeed: 120.0 // 雨速
})

const hide = () => {
  instance.show(false)
}
const start = () => {
  instance.show(true)
}
onUnmounted(() => {
  instance.destroy()
})
</script>
<template>
  <div class="container">
    <el-button type="primary" @click="start">开始</el-button>
    <el-button type="primary" @click="hide">停止</el-button>
  </div>
</template>

<style lang="less" scoped>
.container {
  position: absolute;
  z-index: 100;
}
</style>