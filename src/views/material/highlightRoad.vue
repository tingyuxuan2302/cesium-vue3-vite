<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-11 09:18:28
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-11 11:18:39
-->
<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import { ref } from 'vue'
import "@/utils/cesiumCtrl/lineMaterial.js"
import LineFlickerMaterialProperty from "@/utils/cesiumCtrl/lineMaterial.js"
import { getGeojson } from "@/common/api/api.js"

const store = useStore()
const { viewer } = store.state


const onStart = () => {
  // 道路闪烁线
  Cesium.GeoJsonDataSource.load("/json/qingdaoRoad.geojson").then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    const entities = dataSource.entities.values;
    // 聚焦
    viewer.zoomTo(entities);
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity.polyline.width = 3.0;
      // 设置材质
      entity.polyline.material = new LineFlickerMaterialProperty({
        color: Cesium.Color.YELLOW,
        // 设置随机变化速度
        speed: 20 * Math.random(),
      })
    }
  });
}

// const onStart = () => {
//   getGeojson("/json/qingdaoRoad.geojson").then(({res}) => {

//   })
// }

const onClear = () => {
  viewer.dataSources.removeAll()
}
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onStart">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang='less'>

</style>