<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-04 11:07:05
 * @LastEditors: brown 897411954@qq.com
 * @LastEditTime: 2025-03-29 19:54:41
-->
<script setup>
import SnowEffect from "@/utils/cesiumCtrl/snow.js";

import { onUnmounted } from "vue";

const { viewer } = window;
onUnmounted(() => {
  snow.destroy();
});

const snow = new SnowEffect(viewer, {
  snowSize: 0.02, // 雪花大小
  snowSpeed: 60.0, // 雪速
});
const hide = () => {
  snow.show(false);
};
const start = () => {
  snow.show(true);
};
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
