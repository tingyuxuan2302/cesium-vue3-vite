<!--
 * @Descripttion: zxy瓦片
 * @Author: 笙痞
 * @Date: 2023-01-09 09:41:20
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-04-04 11:10:02
-->
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";

const store = useStore();
const { viewer } = store.state;

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: new Cesium.Resource({
    url: "http://114.215.136.187:8080/spatio/resource-service/0dc36e39755246baa761228651c03fc1/334/{z}/{x}/{y}.png",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzUxMiJ9.eyJpc19hZG1pbiI6dHJ1ZSwidXNlcl9pZCI6NDMsInVzZXJfa2V5IjoiZWRkYWFlNzctYWRlNi00OGQ2LTlkZWEtZDE4YWQwNjRjYzA2IiwidXNlcm5hbWUiOiJSZW5haXRyZSJ9.wsWT7lmzBXeyDWeqj86aqr09CHx1Y79TXHS3ItqZHUMSoHDtiFZLs_Q8Xc7AePPNz3nvMuDvVDxSImk__mPyvw",
    },
  }),
  // url: "http://114.215.136.187:8080/spatio/resource-service/0dc36e39755246baa761228651c03fc1/334/{z}/{x}/{y}.png",
  // maximumLevel: 14,
  // minimumLevel: 13,
  // rectangle: Cesium.Rectangle.fromDegrees(114.19, 34.22, 123.43, 38.23),
});
// viewer.scene3DOnly = true;
viewer.imageryLayers.addImageryProvider(imageryProvider);
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
});
</script>
<template>
  <div></div>
</template>
<style lang='less' scoped>
</style>