<!--
 * @Descripttion: zxy瓦片
 * @Author: 笙痞
 * @Date: 2023-01-09 09:41:20
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 14:36:12
-->
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";

const store = useStore();
const { viewer } = store.state;

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: new Cesium.Resource({
    // url: "http://114.215.136.187:8080/spatio/resource-service/0dc36e39755246baa761228651c03fc1/334/{z}/{x}/{y}.png",
    // headers: {
    //   Authorization:
    //     "",
    // },
    url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9ee992ae625e842c9f53d41257df0832",
    isCrossOriginUrl: true,
  }),
});
// viewer.scene3DOnly = true;
const imageLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);

viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
});
onUnmounted(() => {
  const layers = viewer.imageryLayers;
  const index = layers.indexOf(imageLayer);
  if (index > -1) {
    const res = layers.remove(layers.get(index));
    console.log("--删除图层--", res);
  }
});
// 渲染geojson数据
// viewer.dataSources.add(
//   Cesium.GeoJsonDataSource.load(
//     "https://geo.datav.aliyun.com/areas_v3/bound/370000_full.json",
//     {
//       stroke: Cesium.Color.HOTPINK,
//       fill: Cesium.Color.PINK,
//       strokeWidth: 3,
//       markerSymbol: "?",
//     }
//   )
// );
</script>
<template>
  <div></div>
</template>
<style lang="less" scoped></style>
