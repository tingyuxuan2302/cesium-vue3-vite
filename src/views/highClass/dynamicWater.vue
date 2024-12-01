<template>
  <div></div>
</template>
<script setup>
import { ref } from 'vue'
import * as Cesium from 'cesium'
import Erosion from "@/utils/cesiumCtrl/Erosion.js";
import * as dat from "dat.gui";
import { useStore } from "vuex";

const store = useStore();
const { viewer } = store.state;

const createSquareRectangle = (centerLon, centerLat, sideLength) => {
  // 将边长转换为度
  const earthRadius = 6371000; // 地球平均半径，单位：米
  const angularDistance = (sideLength / earthRadius) * (180 / Math.PI);

  // 计算经度差
  const lonDiff = angularDistance / Math.cos((centerLat * Math.PI) / 180);

  // 计算矩形的边界
  const west = centerLon - lonDiff / 2;
  const east = centerLon + lonDiff / 2;
  const south = centerLat - angularDistance / 2;
  const north = centerLat + angularDistance / 2;

  // 返回[west, south, east, north]格式的数组
  return [west, south, east, north];
}

const config = {
  minElevation: 1153.0408311859962,
  maxElevation: 3158.762303474051,
  url: "/images/texture2.png",
  center: [-119.5509508318, 37.7379837881],
};

const getImageSource = async () => {
  const image = await Cesium.Resource.fetchImage({
    url: config.url,
  });
  return {
    minElevation: config.minElevation,
    maxElevation: config.maxElevation,
    canvas: image,
  };
}

// const viewer = new Cesium.Viewer("cesiumContainer", {
//   terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
//     requestVertexNormals: true,
//   }),
// });
viewer.scene.terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
  requestVertexNormals: true,
})
viewer.scene.msaaSamples = 4;
viewer.scene.highDynamicRange = true;
viewer.postProcessStages.fxaa.enabled = true;
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.debugShowFramesPerSecond = true;
const center = config.center;
const extent = createSquareRectangle(...center, 20000);
console.log(extent);
const rectangle = Cesium.Rectangle.fromDegrees(...extent);
viewer.camera.flyTo({
  destination: rectangle,
  duration: 1.0,
});

const terrainInfo = await getImageSource(viewer, extent, 2048, 2048); // getImageSource() await getImage(viewer, extent);
const noise = await Cesium.Resource.fetchImage({
  url: "/images/texture1.png",
});
const test = new Erosion({
  viewer,
  extent,
  ...terrainInfo,
  noise,
});

const gui = new dat.GUI();
gui.add(test, "coast2water_fadedepth", 0.0, 1);
gui.add(test, "large_waveheight", 0.01, 1);
gui.add(test, "large_wavesize", 1, 10);
gui.add(test, "small_waveheight", 0, 2);
gui.add(test, "small_wavesize", 0, 1);
gui.add(test, "water_softlight_fact", 1, 200);
gui.add(test, "water_glossylight_fact", 1, 200);
gui.add(test, "particle_amount", 1, 200);
gui.add(test, "WATER_LEVEL", 0, 2);
gui.add(test, "showLines");

viewer.scene.primitives.add(test);

const globe = viewer.scene.globe;

const points = [
  new Cesium.Cartesian3.fromDegrees(
    extent[0],
    extent[1],
    terrainInfo.minElevation
  ),
  new Cesium.Cartesian3.fromDegrees(
    extent[2],
    extent[1],
    terrainInfo.minElevation
  ),
  new Cesium.Cartesian3.fromDegrees(
    extent[2],
    extent[3],
    terrainInfo.minElevation
  ),
  new Cesium.Cartesian3.fromDegrees(
    extent[0],
    extent[3],
    terrainInfo.minElevation
  ),
];
const pointsLength = points.length;

const clippingPlanes = [];
for (let i = 0; i < pointsLength; ++i) {
  const nextIndex = (i + 1) % pointsLength;
  let midpoint = Cesium.Cartesian3.add(
    points[i],
    points[nextIndex],
    new Cesium.Cartesian3()
  );
  midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

  const up = Cesium.Cartesian3.normalize(
    midpoint,
    new Cesium.Cartesian3()
  );
  let right = Cesium.Cartesian3.subtract(
    points[nextIndex],
    midpoint,
    new Cesium.Cartesian3()
  );
  right = Cesium.Cartesian3.normalize(right, right);

  let normal = Cesium.Cartesian3.cross(
    right,
    up,
    new Cesium.Cartesian3()
  );
  normal = Cesium.Cartesian3.normalize(normal, normal);

  // Compute distance by pretending the plane is at the origin
  const originCenteredPlane = new Cesium.Plane(normal, 0.0);
  const distance = Cesium.Plane.getPointDistance(
    originCenteredPlane,
    midpoint
  );

  clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
}
globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
  planes: clippingPlanes,
  edgeWidth: 1.0,
  edgeColor: Cesium.Color.WHITE,
  enabled: false,
});
globe.backFaceCulling = true;
</script>
<style lang='less' scoped></style>