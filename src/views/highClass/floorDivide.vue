<template>
  <OperateBox style="display: flex; flex-direction: row; gap: 5px">
    <el-input type="number" id="floor" v-model="floorNum" />
    <span style="color: white"> 层</span>
    <el-button type="primary" @click="initFloor">生成</el-button>
    <el-button type="primary" @click="openFloorModel">展开</el-button>
    <el-button type="primary" @click="closeFloorModel">合并</el-button>
  </OperateBox>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const floorNum = ref(10);
const { viewer } = window;
let floorArr = [];

const x = 114.268997;
const y = 30.541476;

onMounted(() => {
  init();
});

function init() {
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );

  // 设置相机视角
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(114.270556, 30.540943, 97.4),
    orientation: {
      heading: Cesium.Math.toRadians(291.9),
      pitch: Cesium.Math.toRadians(-26.2),
      roll: Cesium.Math.toRadians(360),
    },
  });

  // 初始化楼层
  initFloor();
}

function initFloor() {
  if (!viewer) return;

  viewer.entities.removeAll();
  floorArr = [];

  const floor = parseInt(floorNum.value);

  // 创建楼层
  for (let i = 0; i < floor; i++) {
    const position = Cesium.Cartesian3.fromDegrees(x, y, i * 3);
    const entity = viewer.entities.add({
      position: position,
      model: {
        uri: "/models/floor.glb",
        scale: 1,
      },
    });

    floorArr.push({
      pos: [x, y, i * 3],
      entity: entity,
    });
  }

  // 创建楼顶
  const position1 = Cesium.Cartesian3.fromDegrees(x, y, floor * 3);
  const entity1 = viewer.entities.add({
    position: position1,
    model: {
      uri: "//data.mars3d.cn/gltf/mars/floor/top.glb",
      scale: 1,
    },
  });

  floorArr.push({
    pos: [x, y, floor * 3],
    entity: entity1,
  });
}

function closeFloorModel() {
  for (let i = 0; i < floorArr.length; i++) {
    const element = floorArr[i];
    element.entity.position = Cesium.Cartesian3.fromDegrees(
      element.pos[0],
      element.pos[1],
      element.pos[2] / 1
    );
  }
}

function openFloorModel() {
  for (let i = 0; i < floorArr.length; i++) {
    const element = floorArr[i];
    element.entity.position = Cesium.Cartesian3.fromDegrees(
      element.pos[0],
      element.pos[1],
      element.pos[2] * 2
    );
  }
}
</script>

<style scoped></style>
