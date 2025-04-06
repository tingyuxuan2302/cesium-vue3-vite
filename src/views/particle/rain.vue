<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-04 11:07:05
 * @LastEditors: brown 897411954@qq.com
 * @LastEditTime: 2025-03-29 20:00:24
-->
<script setup>
import RainEffect from "@/utils/cesiumCtrl/rain.js";

import { onUnmounted } from "vue";

const { viewer } = window;
const instance = new RainEffect(viewer, {
  tiltAngle: -0.2, //倾斜角度
  rainSize: 1.0, // 雨大小
  rainSpeed: 120.0, // 雨速
});

const hide = () => {
  instance.show(false);
};
const start = () => {
  instance.show(true);
};
onUnmounted(() => {
  instance.destroy();
});
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
