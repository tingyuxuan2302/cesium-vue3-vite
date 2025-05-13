<!-- 代码来源： https://github.com/jiawanlong/Cesium-Examples -->
<template>
  <OperateBox>
    <el-button type="primary" @click="onStart">开始投射</el-button>
  </OperateBox>
  <video id="video_dom" ref="video_dom" preload="auto" autoPlay loop>
    <source src="/videos/video.mp4" type="video/mp4" />
    Your browser does not support the <code>video</code> element.
  </video>
</template>
<script setup>
import CesiumVideo from "@/utils/cesiumCtrl/Video.js";
import * as Cesium from "cesium";
import { ref } from "vue";

const { __viewer } = window;
const video_dom = ref(null);
const onStart = () => {
  __viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(85.788705, 45.163394, 2000),
  });
  var options = {
    horizontalViewAngle: 60,
    verticalViewAngle: 40,
    video: "video_dom",
    viewPosition: Cesium.Cartesian3.fromDegrees(85.788705, 45.161394, 900),
    viewPositionEnd: Cesium.Cartesian3.fromDegrees(85.788705, 45.167394, 500),
  };
  const v = new CesiumVideo(__viewer, options);
  v.drawVideo();

  // 播放
  video_dom.value.play();
};
</script>
<style lang="less" scoped>
#video_dom {
  display: none;
  position: absolute;
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
</style>
