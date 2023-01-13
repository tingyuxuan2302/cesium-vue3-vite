<!--
 * @Description: 风险四色图
 * @Author: 笙痞77
 * @Date: 2023-01-13 10:49:26
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-13 15:27:43
-->
<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import { ref } from 'vue'
import { getGeojson } from "@/common/api/api.js"

const store = useStore()
const { viewer } = store.state
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
})
const getJson = async () => {
  const { res } = await getGeojson("/json/qingdaoArea.geojson")
  addDataToGlobe(res.features)
}
const colorArrs = ["AQUAMARINE", "BEIGE", "CORNFLOWERBLUE", "DARKORANGE", "GOLD", "GREENYELLOW", "LIGHTPINK", "ORANGERED", "YELLOWGREEN", "TOMATO"]
const addDataToGlobe = (features) => {
  let instances = [];
  for (let i = 0; i < features.length; i++) {
    for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
      const polygonArray = features[i].geometry.coordinates[j].toString().split(',').map(Number);
      const polygon = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(polygonArray)
        ),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        // 设置面的拉伸高度
        extrudedHeight: 100,
        // height: 100, // 多边形和椭球表面之间的距离（以米为单位）。
      });
      const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
      instances.push(new Cesium.GeometryInstance({
        id: `polygon-${i}`,
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromAlpha(Cesium.Color[colorArrs[i]], 0.6)),
          show: new Cesium.ShowGeometryInstanceAttribute(true)
          // color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 })),
        },
      }));
    }
  }


  // 合并单个geometry,提高渲染效率
  const primitive = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PerInstanceColorAppearance({
      translucent: true, // 当 true 时，几何体应该是半透明的，因此 PerInstanceColorAppearance#renderState 启用了 alpha 混合。
      closed: false // 当 true 时，几何体应该是关闭的，因此 PerInstanceColorAppearance#renderState 启用了背面剔除。
    }),
    asynchronous: false,
  });
  viewer.scene.primitives.add(primitive);
}

const onClear = () => {
  viewer.scene.primitives.removeAll();
}

const scene = viewer.scene
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
handler.setInputAction((e) => {
  // 获取实体
  const pick = scene.pick(e.position)
  if (Cesium.defined(pick) && pick.id.indexOf("polygon") > -1) {
    // const opts = Object.assign(pick.id, {
    //   viewer,
    //   title: pick.id.name,
    //   content: pick.id.properties.address._value
    // })
    console.log("xxx", pick,)
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

</script>
<template>
  <operate-box>
    <el-button type='primary' @click='getJson'>开始</el-button>
    <el-button type='primary' @click='onClear'>清除</el-button>
  </operate-box>
</template>
<style scoped lang='less'>

</style>