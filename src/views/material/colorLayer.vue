<!--
 * @Description: 风险四色图
 * @Author: 笙痞77
 * @Date: 2023-01-13 10:49:26
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-23 16:38:02
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onMounted, onUnmounted, ref } from "vue";
import { getGeojson } from "@/common/api/api.js";

const store = useStore();
const { viewer } = store.state;
onMounted(() => {
  viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
});
onUnmounted(() => {
  viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: "http://data.marsgis.cn/terrain",
  });
});
viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
});
const getJson = async () => {
  const { res } = await getGeojson("/json/qingdaoArea.geojson");
  const { res: pointRes } = await getGeojson("/json/areaPoint.geojson");
  addDataToGlobe(res.features, pointRes);
};
const labelCollection = viewer.scene.primitives.add(
  new Cesium.LabelCollection()
);
const colorArrs = [
  "AQUAMARINE",
  "BEIGE",
  "CORNFLOWERBLUE",
  "DARKORANGE",
  "GOLD",
  "GREENYELLOW",
  "LIGHTPINK",
  "ORANGERED",
  "YELLOWGREEN",
  "TOMATO",
];
const areaPointCenter = [];
const addDataToGlobe = (features, pointRes) => {
  let instances = [];
  for (let i = 0; i < features.length; i++) {
    const curFeatures = features[i];
    for (let j = 0; j < curFeatures.geometry.coordinates.length; j++) {
      const polygonArray = curFeatures.geometry.coordinates[j]
        .toString()
        .split(",")
        .map(Number);
      const polygon = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(polygonArray)
        ),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        // 设置面的拉伸高度
        extrudedHeight: 100,
        // height: 100, // 多边形和椭球表面之间的距离（以米为单位）。
      });
      // console.log('---', polygon)
      // const polygonPositions = polygon.polygonHierarchy.getValue
      const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
      instances.push(
        new Cesium.GeometryInstance({
          id: `polygon-${i}`,
          geometry: geometry,
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromAlpha(Cesium.Color[colorArrs[i]], 0.6)
            ),
            show: new Cesium.ShowGeometryInstanceAttribute(true),
            // color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 })),
          },
        })
      );
    }
    // 寻找中心点位，添加标签
    const p = pointRes.features.find(
      (item) => item.properties["ID"] == curFeatures["properties"]["id"]
    );
    const carter3Position = Cesium.Cartesian3.fromDegrees(
      ...p["geometry"]["coordinates"],
      1500
    );
    areaPointCenter.push(p["geometry"]["coordinates"]);
    labelCollection.add({
      text: curFeatures["properties"]["name"],
      font: "bold 15px Microsoft YaHei",
      blendOption: Cesium.BlendOption.TRANSLUCENT, // 半透明，提高性能2倍
      position: carter3Position,
      // 竖直对齐方式
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      // 水平对齐方式
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    });
  }

  // 合并单个geometry,提高渲染效率
  const primitive = new Cesium.Primitive({
    releaseGeometryInstances: false,
    geometryInstances: instances,
    appearance: new Cesium.PerInstanceColorAppearance({
      translucent: true, // 当 true 时，几何体应该是半透明的，因此 PerInstanceColorAppearance#renderState 启用了 alpha 混合。
      closed: false, // 当 true 时，几何体应该是关闭的，因此 PerInstanceColorAppearance#renderState 启用了背面剔除。
    }),
    asynchronous: false,
  });
  viewer.scene.primitives.add(primitive);
};
const onClear = () => {
  viewer.scene.primitives.removeAll();
};

const scene = viewer.scene;
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction((e) => {
  // 获取实体
  const pick = scene.pick(e.position);
  if (Cesium.defined(pick) && pick.id.indexOf("polygon") > -1) {
    const id = pick.id.replace(/polygon-/g, "");
    console.log("xxx", pick.id, pick);

    // 单击变色(TODO:遇到多个相同id的instance会失效)
    // const attributes = pick.primitive.getGeometryInstanceAttributes(pick.id)
    // console.log("----attributes---", attributes)
    // attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.WHITE);

    viewer.camera.flyTo({
      // 从以度为单位的经度和纬度值返回笛卡尔3位置。
      destination: Cesium.Cartesian3.fromDegrees(...areaPointCenter[id], 40000),
      orientation: {
        // heading：默认方向为正北，正角度为向东旋转，即水平旋转，也叫偏航角。
        // pitch：默认角度为-90，即朝向地面，正角度在平面之上，负角度为平面下，即上下旋转，也叫俯仰角。
        // roll：默认旋转角度为0，左右旋转，正角度向右，负角度向左，也叫翻滚角
        heading: Cesium.Math.toRadians(0.0), // 正东，默认北
        pitch: Cesium.Math.toRadians(-90), // 向正下方看
        roll: 0.0, // 左右
      },
      duration: 2, // 飞行时间（s）
    });
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
onUnmounted(() => {
  onClear();
});
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="getJson">开始</el-button>
    <el-button type="primary" @click="onClear">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
