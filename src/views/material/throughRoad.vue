<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-11 13:39:25
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-11 18:25:57
-->
<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import { onUnmounted, ref } from 'vue'
import RoadThroughLine from "@/utils/cesiumCtrl/roadThrough.js"
import { getGeojson } from "@/common/api/api.js"

const store = useStore()
const { viewer } = store.state

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "http://114.215.136.187:8080/spatio/resource-service/4e57e9342d7244dc95e36bf5e6980eb9/63/{z}/{x}/{y}.png",
})
viewer.imageryLayers.addImageryProvider(imageryProvider)
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
})

// const onStart = () => {
//   // 道路闪烁线
//   Cesium.GeoJsonDataSource.load("/json/qingdaoRoad.geojson").then(function (dataSource) {
//     viewer.dataSources.add(dataSource);
//     const entities = dataSource.entities.values;
//     // 聚焦
//     // viewer.zoomTo(entities);
//     for (let i = 0; i < entities.length; i++) {
//       let entity = entities[i];
//       entity.polyline.width = 1.7;
//       entity.polyline.material = new RoadThroughLine(1000, '/images/spriteline.png');
//     }
//   });
// }
const onStart = async () => {
  const { res } = await getGeojson("/json/qingdaoRoad.geojson")
  console.log("---", res)
  const { features } = res
  const instance = []
  if (features?.length) {
    features.forEach(item => {
      const arr = item.geometry.coordinates
      arr.forEach(el => {
        let arr1 = []

        el.forEach(_el => {
          arr1 = arr1.concat(_el)
        })
        const polyline = new Cesium.PolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(arr1),
          width: 1.7,
          vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
        });
        const geometry = Cesium.PolylineGeometry.createGeometry(polyline)
        instance.push(new Cesium.GeometryInstance({
          geometry,
          // attributes: {
          //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED),
          // },
        }));
      })

    })
    const ins = new RoadThroughLine(1000, '/images/spriteline.png')
    console.log("-----instance-----", ins)

    const primitive = new Cesium.Primitive({
      geometryInstances: instance,
      appearance: new Cesium.PolylineMaterialAppearance({
        flat: true,
        material: Cesium.Material.fromType(ins.getType(), ins.getValue()),
      }),
      asynchronous: false,
    })
    viewer.scene.primitives.add(primitive);
  }
}

const onClear = () => {
  viewer.dataSources.removeAll()
}
onUnmounted(() => {
  onClear()
})
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onStart">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang='less'>

</style>