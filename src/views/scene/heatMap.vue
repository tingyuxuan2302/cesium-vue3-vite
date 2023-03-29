<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-30 17:13:36
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-03-28 09:39:33
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onUnmounted, ref } from "vue";
import { getGeojson } from "@/common/api/api.js";
import { CesiumHeatmap } from "@/utils/cesiumCtrl/cesiumHeatMap.js";
// import { CesiumHeatmap } from "cesium-heatmap-es6";

const store = useStore();
const { viewer } = store.state;
let cesiumHeatMap = null;
const getData = async () => {
  const { res } = await getGeojson("/json/heatMap.json");
  const { features } = res;
  console.log(res);
  let heatData = [];
  if (features?.length) {
    heatData = features.map((item) => {
      return {
        x: item.properties.lng - 0.05,
        y: item.properties.lat - 0.04,
        value: item.properties.num,
      };
    });
  }
  cesiumHeatMap = new CesiumHeatmap(viewer, {
    zoomToLayer: true,
    points: heatData,
    heatmapDataOptions: { max: 1, min: 0 },
    heatmapOptions: {
      maxOpacity: 1,
      minOpacity: 0,
    },
  });
};

const onClear = () => {
  cesiumHeatMap?.remove();
};
onUnmounted(() => {
  onClear();
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="getData">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>

<style scoped lang='less'>
</style>

