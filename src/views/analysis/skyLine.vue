<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-05-16 09:39:11
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 20:10:11
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onUnmounted, ref, onMounted } from "vue";
import SkyLineAnalysis from "@/utils/cesiumCtrl/skyLineAnalysis.js";
import { sleep } from "@/common/utils.js";

const store = useStore();
const { viewer } = store.state;

let skyLineIns;

onMounted(async () => {
  viewer.camera.flyTo({
    // 从以度为单位的经度和纬度值返回笛卡尔3位置。
    destination: Cesium.Cartesian3.fromDegrees(
      120.58193064609729,
      36.125460378632766,
      200
    ),
    orientation: {
      // heading：默认方向为正北，正角度为向东旋转，即水平旋转，也叫偏航角。
      // pitch：默认角度为-90，即朝向地面，正角度在平面之上，负角度为平面下，即上下旋转，也叫俯仰角。
      // roll：默认旋转角度为0，左右旋转，正角度向右，负角度向左，也叫翻滚角
      heading: Cesium.Math.toRadians(0.0), // 正东，默认北
      pitch: Cesium.Math.toRadians(0),
      roll: 0.0, // 左右
    },
    duration: 3, // 飞行时间（s）
  });
});

const openSkylineAnay = async () => {
  skyLineIns = new SkyLineAnalysis(viewer);
  // await sleep(3000);
  skyLineIns.open();
};

const closeSkylineAnay = () => {
  skyLineIns.close();
};
onUnmounted(() => {
  closeSkylineAnay();
});
</script>
<template>
  <operate-box>
    <el-button @click="openSkylineAnay" type="primary">打开天际线</el-button>
    <el-button @click="closeSkylineAnay" type="primary">关闭天际线</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
