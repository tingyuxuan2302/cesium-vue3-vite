<!--
 * @Descripttion: 底层打点，对于大数据量的点渲染效果更佳
 * @Author: 笙痞
 * @Date: 2023-01-09 14:34:21
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-11 10:36:04
-->

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex';
import * as Cesium from "cesium"
import { getGeojson } from "@/common/api/api.js"

// 聚合实现：https://www.jianshu.com/p/80d40c447657

const store = useStore()
const { viewer } = store.state

const pointCollection = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
const billboardsCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
const labelCollection = viewer.scene.primitives.add(new Cesium.LabelCollection());

const primitives = viewer.scene.primitives.add(new Cesium.PrimitiveCollection());




const getJson = () => {
  getGeojson("/json/chuzhong.geojson").then(({res}) => {
    console.log(res)
    const { features } = res
    formatData(features)
  })
}

const formatData = (features) => {
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    const coordinates = feature.geometry.coordinates
    const position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1])
    const name = feature.properties.name
    // 画普通的点
    // pointCollection.add({
    //   position,
    //   color: Cesium.Color.CYAN,
    //   pixelSize: 36,
    // })
    // 带图片的点
    billboardsCollection.add({
      image: "/images/mark-icon.png",
      width: 32,
      height: 32,
      position,
    })
    // TODO:如果text是动态的，有性能问题；
    // labelCollection.add({
    //   position,
    //   blendOption: Cesium.BlendOption.TRANSLUCENT, // 半透明，提高性能2倍
    //   text: name,
    //   font: "bold 15px Microsoft YaHei",
    //   // 竖直对齐方式
    //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
    //   // 水平对齐方式
    //   horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    //   // 偏移量
    //   pixelOffset: new Cesium.Cartesian2(15, 0),
    // })

  }
}


viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
})

const onClear = () => {
  billboardsCollection.removeAll()
  // labelCollection.removeAll()
}
</script>
<template>
  <OperateBox>
    <el-button type="primary" @click="getJson">打点</el-button>
    <el-button type="primary" @click="onClear">清除打点</el-button>
  </OperateBox>
</template>
<style lang='less' scoped>

</style>