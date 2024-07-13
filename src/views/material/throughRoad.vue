<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-01-11 13:39:25
 * @LastEditors: 不浪
 * @LastEditTime: 2024-07-13 21:10:47
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import RoadThroughLine from "@/utils/cesiumCtrl/roadThrough.js";
import { getGeojson } from "@/common/api/api.js";
import modifyMap from "@/utils/cesiumCtrl/modifyMap.js";

const store = useStore();
const { viewer } = store.state;

// const jsonUrl = "/json/qdRoad_less.geojson";
const jsonUrl = "/json/qingdaoRoad.geojson";

onMounted(() => {
  viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
  modifyMap({ viewer });
});
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.188, 36.67, 200000),
});

let _dataSource = null;
const material = new RoadThroughLine(1000, "/images/spriteline.png");
const onStartEntity = () => {
  // 道路闪烁线
  _dataSource = new Cesium.GeoJsonDataSource();
  _dataSource.load(jsonUrl).then(function (dataSource) {
    const entities = dataSource.entities.values;
    // 聚焦
    // viewer.zoomTo(entities);
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity.polyline.width = 1.7;
      entity.polyline.material = material;
    }
  });
  viewer.dataSources.add(_dataSource);
};
let primitives = null;
const onStartPimitive = async () => {
  const { res } = await getGeojson(jsonUrl);
  const { features } = res;
  const instance = [];
  if (features?.length) {
    features.forEach((item) => {
      const arr = item.geometry.coordinates;
      arr.forEach((el) => {
        let arr1 = [];

        el.forEach((_el) => {
          arr1 = arr1.concat(_el);
        });
        const polyline = new Cesium.PolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(arr1),
          width: 1.7,
          vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
        });
        const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
        instance.push(
          new Cesium.GeometryInstance({
            geometry,
            // attributes: {
            //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED),
            // },
          })
        );
      });
    });
    console.log("-----instance-----", Cesium.Material.Spriteline1Source);
    let source = `czm_material czm_getMaterial(czm_materialInput materialInput)
                          {
                             czm_material material = czm_getDefaultMaterial(materialInput);
                             vec2 st = materialInput.st;
                             vec4 colorImage = texture(image, vec2(fract((st.s - speed * czm_frameNumber * 0.001)), st.t));
                             material.alpha = colorImage.a * color.a;
                             material.diffuse = colorImage.rgb * 1.5 ;
                             return material;
                          }`;

    const material = new Cesium.Material({
      fabric: {
        uniforms: {
          color: Cesium.Color.fromCssColorString("#7ffeff"),
          image: "/images/spriteline.png",
          speed: 10,
        },
        source,
      },
      translucent: function () {
        return true;
      },
    });
    const appearance = new Cesium.PolylineMaterialAppearance();
    appearance.material = material;
    const primitive = new Cesium.Primitive({
      geometryInstances: instance,
      appearance,
      asynchronous: false,
    });

    primitives = viewer.scene.primitives.add(primitive);
  }
};
const onClear = () => {
  // 此处注意不要使用removeAll，将实例都删除的话，再次添加会报错
  _dataSource && viewer.dataSources.remove(_dataSource, false);
  primitives && viewer.scene.primitives.remove(primitives);
};
onUnmounted(() => {
  onClear();
  viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: "http://data.marsgis.cn/terrain",
  });
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="onStartEntity"
      >开始(entity渲染)</el-button
    >
    <el-button type="primary" @click="onStartPimitive"
      >开始(primitive渲染)</el-button
    >
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
