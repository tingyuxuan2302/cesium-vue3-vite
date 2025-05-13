<script setup>
import * as Cesium from "cesium";
import { ref } from "vue";
import SkyBoxOnGround from "@/utils/cesiumCtrl/skyBoxOnGround.js";

// 教程：https://blog.csdn.net/qq_25519615/article/details/128063735

const { viewer } = window;

// 内天空盒
const groundSkyBox = new SkyBoxOnGround({
  sources: {
    positiveX: "/images/Standard-Cube-Map/px1.png",
    negativeX: "/images/Standard-Cube-Map/nx1.png",
    positiveY: "/images/Standard-Cube-Map/pz.png",
    negativeY: "/images/Standard-Cube-Map/nz1.png",
    positiveZ: "/images/Standard-Cube-Map/py.png",
    negativeZ: "/images/Standard-Cube-Map/ny1.png",
  },
});
groundSkyBox.setSkyBox(viewer);
</script>
<template>
  <div></div>
</template>
<style scoped lang="less"></style>
