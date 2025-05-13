<!-- 源代码来自（做了版本升级bug修复）：https://jiawanlong.github.io/Cesium-Examples/examples/cesiumEx/editor.html#4.1.2%E3%80%81%E5%8F%AF%E8%A7%86%E5%9F%9F%E5%88%86%E6%9E%90 -->
<script setup>
import * as Cesium from "cesium";
import "@/utils/cesiumCtrl/latlng.js";
import ViewShed from "@/utils/cesiumCtrl/ViewShed.js";

const { __viewer } = window;

__viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
  requestVertexNormals: true, // 请求法线，用于地形光照
});
// 深度监测
__viewer.scene.globe.depthTestAgainstTerrain = true;

// __viewer.camera.setView({
//   // 从以度为单位的经度和纬度值返回笛卡尔3位置。
//   destination: Cesium.Cartesian3.fromDegrees(120.58, 36.13, 4000),
// });

var viewsheds = [];

var options = {
  qdOffset: 2,
  zdOffset: 2,
};
var viewshed2 = new ViewShed(__viewer, options);
viewsheds.push(viewshed2);

// function click_clear() {
//     viewsheds.forEach((element) => {
//         element.clear();
//     });
// }

const set3Dtitle3 = () => {
  let translation = Cesium.Cartesian3.fromArray([0, 0, 0]);
  let m = Cesium.Matrix4.fromTranslation(translation);
  const url = "http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json";
  let tilesetJson = {
    url,
    modelMatrix: m,
    show: true, // 是否显示图块集(默认true)
  };
  const tileset = new Cesium.Cesium3DTileset(tilesetJson);
  __viewer.flyTo(tileset);
  // 异步加载
  tileset.readyPromise
    .then(function (tileset) {
      __viewer.scene.primitives.add(tileset);
    })
    .catch(function (error) {
      console.log(error);
    });
  tileset.allTilesLoaded.addEventListener(function () {
    console.log("模型已经全部加载完成");
  });
};
set3Dtitle3();
</script>
<template>
  <div></div>
</template>
<style scoped lang="less"></style>
