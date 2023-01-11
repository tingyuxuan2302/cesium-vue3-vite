<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-04 11:07:05
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-04 18:17:07
-->
<script setup>
import FogEffect from "@/utils/cesiumCtrl/fog.js"
import { useStore } from "vuex"
import { onUnmounted } from "vue"
import { Color } from "cesium"

const store = useStore()
const instance = new FogEffect(store.state.viewer, {
  visibility: 0.2,
  color: new Color(0.8, 0.8, 0.8, 0.3)
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