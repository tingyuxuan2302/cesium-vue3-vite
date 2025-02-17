<!-- 代码来源： https://github.com/jiawanlong/Cesium-Examples -->

<template>
  <div></div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as Cesium from "cesium";
import axios from "axios";
import * as turf from "@turf/turf";

const { __viewer } = window;
// 目的地带方向
__viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(117.2, 31.8, 3000),
});

onMounted(() => {
  axios
    .get("/json/hefei-road.json") //读取区域json
    .then((response) => {
      console.log(response.data.features);
      response.data.features.forEach((k) => {
        k.geometry.coordinates.forEach((m) => {
          if (m.length > 5) {
            let arr = [];

            m.forEach((mm) => {
              arr.push(Cesium.Cartesian3.fromDegrees(mm[0], mm[1], 10));
            });
            initRoad(arr);
          }
        });
      });
    });
});

function initRoad(arr) {
  // var start = Cesium.Cartesian3.fromDegrees(98.71707797694049, 27.777299704639537, 2800.0);
  // var start1 = Cesium.Cartesian3.fromDegrees(98.71507797694049, 27.777299704639537, 2800.0);
  // var end = Cesium.Cartesian3.fromDegrees(98.71707797694049, 27.907299704639537, 3500.0);
  // var arr = [start, start1, end]

  var luKuan = 30;
  var nArr2 = [];
  var ellipsoid = __viewer.scene.globe.ellipsoid;
  arr.forEach((element) => {
    var catographic = Cesium.Cartographic.fromCartesian(element);
    var height = Number(catographic.height.toFixed(2));

    var cartographic = ellipsoid.cartesianToCartographic({
      x: element.x,
      y: element.y,
      z: element.z,
    });
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    nArr2.push([lng, lat]);
  });
  var linestring1 = turf.lineString(nArr2);

  // 路最宽
  var buffered = turf.buffer(linestring1, (luKuan / 15) * 15, {
    units: "meters",
  });
  var bbb1 = buffered["geometry"]["coordinates"][0];
  var kkk1 = [];
  bbb1.forEach((v) => {
    kkk1.push(v[0]);
    kkk1.push(v[1]);
  });
  __viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(kkk1),
      material: new Cesium.Color(81 / 255, 81 / 255, 81 / 255, 1),
    },
  });

  var buffered1 = turf.buffer(linestring1, (luKuan / 15) * 14.3, {
    units: "meters",
  });
  var buffered2 = turf.buffer(linestring1, (luKuan / 15) * 14, {
    units: "meters",
  });
  var bbbb1 = buffered1["geometry"]["coordinates"][0];
  var bbbb2 = buffered2["geometry"]["coordinates"][0];
  var kkkk1 = [];
  bbbb1.forEach((v) => {
    kkkk1.push(v[0]);
    kkkk1.push(v[1]);
  });
  var kkkk2 = [];
  bbbb2.forEach((v) => {
    kkkk2.push(v[0]);
    kkkk2.push(v[1]);
  });
  __viewer.entities.add({
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray(kkkk1),
        holes: [
          {
            positions: Cesium.Cartesian3.fromDegreesArray(kkkk2),
          },
        ],
      },
      material: new Cesium.ImageMaterialProperty({
        image: "/images/qqq.png",
        repeat: new Cesium.Cartesian2((50 / luKuan) * 15, (50 / luKuan) * 15),
      }),
    },
  });

  // 黑白虚线
  var buffered3 = turf.buffer(linestring1, (luKuan / 15) * 7.5, {
    units: "meters",
  });
  var buffered4 = turf.buffer(linestring1, (luKuan / 15) * 6.8, {
    units: "meters",
  });
  var bbbb3 = buffered3["geometry"]["coordinates"][0];
  var bbbb4 = buffered4["geometry"]["coordinates"][0];
  var kkkk3 = [];
  var kkkk4 = [];
  bbbb3.forEach((v) => {
    kkkk3.push(v[0]);
    kkkk3.push(v[1]);
  });
  bbbb4.forEach((v) => {
    kkkk4.push(v[0]);
    kkkk4.push(v[1]);
  });
  __viewer.entities.add({
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray(kkkk3),
        holes: [
          {
            positions: Cesium.Cartesian3.fromDegreesArray(kkkk4),
          },
        ],
      },
      material: new Cesium.ImageMaterialProperty({
        image: "/images/3333.jpg",
        repeat: new Cesium.Cartesian2((50 / luKuan) * 15, (50 / luKuan) * 15),
      }),
      outline: false,
    },
  });

  // // 路黄色
  var buffered1 = turf.buffer(linestring1, (luKuan / 15) * 1, {
    units: "meters",
  });
  var bbbb1 = buffered1["geometry"]["coordinates"][0];
  var kkkk1 = [];
  bbbb1.forEach((v) => {
    kkkk1.push(v[0]);
    kkkk1.push(v[1]);
  });
  __viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(kkkk1),
      material: new Cesium.ImageMaterialProperty({
        image: "/images/1211.png",
        repeat: new Cesium.Cartesian2(50, 50),
      }),
    },
  });
}
</script>
