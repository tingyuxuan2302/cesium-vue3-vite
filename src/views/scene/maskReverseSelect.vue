<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-04-04 11:19:51
 * @LastEditors: 不浪
 * @LastEditTime: 2024-07-13 13:43:57
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onMounted, onUnmounted, ref } from "vue";
import { getGeojson } from "@/common/api/api.js";
import modifyMap from "@/utils/cesiumCtrl/modifyMap.js";

const store = useStore();
const { viewer } = store.state;
// viewer.scene.terrainProvider = Cesium.createWorldTerrain(); // 提供地形

onMounted(() => {
  modifyMap({
    viewer,
    style: "normal",
    changeColor: false,
  });
});

const onStart = async () => {
  const { res } = await getGeojson("/json/laixi.geojson");
  const { features } = res;
  const maskpointArray = [];
  const arr = features[0].geometry.coordinates[0][0];
  for (let i = 0, l = arr.length; i < l; i++) {
    maskpointArray.push(arr[i][0]);
    maskpointArray.push(arr[i][1]);
  }
  var maskspoint = Cesium.Cartesian3.fromDegreesArray(maskpointArray);
  console.log("---maskspoint", maskspoint);
  const area = new Cesium.Entity({
    id: 1,
    polygon: {
      hierarchy: {
        // 定义多边形的环区域
        positions: Cesium.Cartesian3.fromDegreesArray([
          100, 0, 100, 89, 160, 89, 160, 0,
        ]),
        // 定义多边形的孔
        holes: [
          {
            positions: maskspoint,
          },
        ],
      },
      material: Cesium.Color.BLACK.withAlpha(0.9), //外部颜色
    },
  });
  const line = new Cesium.Entity({
    id: 2,
    polyline: {
      positions: maskspoint,
      width: 4, //边界线宽
      material: Cesium.Color.fromCssColorString("#6dcdeb"), //边界线颜色
      clampToGround: true, // 贴地
    },
  });
  viewer.entities.add(area);
  viewer.entities.add(line);
  viewer.flyTo(line, { duration: 3 });
};

const onClear = () => {
  viewer.entities.removeAll();
};
onUnmounted(() => {
  onClear();
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onStart">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
