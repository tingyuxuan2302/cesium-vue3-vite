<template>
  <OperateBox style="display: flex; flex-direction: row; gap: 5px">
    <el-input type="number" v-model="height" placeholder="挖洞深度" />
    <el-button type="primary" @click="startDigging">开始挖洞</el-button>
    <el-button type="danger" @click="clearDigging">清除</el-button>
  </OperateBox>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import ExcavateTerrain from "@/utils/cesiumCtrl/ExcavateTerrain";
import OperateBox from "@/components/OperateBox.vue";

const { viewer } = window;
const height = ref(30);
let excavateInstance = null;

// 固定的4个点坐标，与4.1.1、地形开挖.html中完全一致
const mr = [
  {
    x: -2409728.6420393116,
    y: 4694838.793290997,
    z: 3570221.295666795,
  },
  {
    x: -2409788.2788523836,
    y: 4694808.716559992,
    z: 3570220.598452356,
  },
  {
    x: -2409813.389689466,
    y: 4694859.279606352,
    z: 3570137.7191554685,
  },
  {
    x: -2409755.7791936737,
    y: 4694886.737790491,
    z: 3570140.4776008143,
  },
];

onMounted(() => {
  init();
});

async function init() {
  // 开启帧率
  viewer.scene.debugShowFramesPerSecond = true;

  // 设置相机位置
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3.fromDegrees(117.170434, 34.259184, 1000),
  });

  // 加载默认地形
  viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
    // requestWaterMask: true, // 请求水掩膜以实现水体效果
    requestVertexNormals: true, // 请求法线以实现光照效果
  });

  // 深度监测
  viewer.scene.globe.depthTestAgainstTerrain = true;
}

function startDigging() {
  clearDigging();

  // 直接使用固定点挖洞
  excavateInstance = new ExcavateTerrain(viewer, {
    positions: mr,
    height: Number(height.value),
    bottom: "/images/excavationregion_top.jpg",
    side: "/images/excavationregion_side.jpg",
  });
}

function clearDigging() {
  if (viewer) {
    // 清除裁剪平面
    if (viewer.scene.globe.clippingPlanes) {
      viewer.scene.globe.clippingPlanes = undefined;
    }

    // 删除实体
    viewer.entities.removeById("entityDM");
    viewer.entities.removeById("entityDMBJ");
  }
}
</script>

<style scoped></style>
