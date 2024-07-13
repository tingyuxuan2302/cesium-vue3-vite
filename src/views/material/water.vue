<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-29 10:14:51
 * @LastEditors: 不浪
 * @LastEditTime: 2024-07-07 11:11:35
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onUnmounted, ref, onMounted } from "vue";

const store = useStore();
const { viewer } = store.state;

onUnmounted(() => {
  onClear();
});
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
});
// 流动水面效果
const create = () => {
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(
            120.388,
            36.071,
            120.449,
            36.118
          ),
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          height: 100,
        }),
      }),
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Water",
            uniforms: {
              baseWaterColor: new Cesium.Color(
                64 / 255.0,
                157 / 255.0,
                253 / 255.0,
                0.6
              ),
              normalMap: "/images/waterNormals.jpg",
              frequency: 1000.0,
              animationSpeed: 0.1,
              amplitude: 10,
              specularIntensity: 8,
            },
          },
        }),
      }),
    })
  );
};

const onClear = () => {
  viewer.scene.primitives.removeAll();
};
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="create">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
