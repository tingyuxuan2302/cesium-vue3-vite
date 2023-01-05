<!--
 * @Descripttion: 聚合点位
 * @Author: 笙痞
 * @Date: 2023-01-05 11:05:00
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-05 17:53:32
-->
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex';
import * as Cesium from "cesium"

const store = useStore()
const { viewer } = store.state
const initCluster = () => {
  new Cesium.GeoJsonDataSource().load("/json/chuzhong.geojson").then(async dataSource => {
    await viewer.dataSources.add(dataSource)
    // 设置聚合参数
    dataSource.clustering.enabled = true;
    dataSource.clustering.pixelRange = 60;
    dataSource.clustering.minimumClusterSize = 2;

    dataSource.entities.values.forEach((entity) => {
      console.log('xxx', entity)
      // 将点拉伸一定高度，防止被地形压盖
      entity.position._value.z += 50
      entity._id = `mark-${entity.id}`
      entity.billboard = {
        image: "/images/mark-icon.png",
        width: 32,
        height: 32,
      }
      entity.label = {
        text: "POI",
        font: "bold 15px Microsoft YaHei",
        // 竖直对齐方式
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        // 水平对齐方式
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        // 偏移量
        pixelOffset: new Cesium.Cartesian2(15, 0),
      }
    })
    dataSource.clustering.clusterEvent.addEventListener(
      (clusteredEntities, cluster) => {
        // 关闭自带的显示聚合数量的标签
        cluster.label.show = false;
        cluster.billboard.show = true;
        cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

        // 根据聚合数量的多少设置不同层级的图片以及大小
        // if (clusteredEntities.length >= 4) {
        //   cluster.billboard.image = combineIconAndLabel('/images/express-icon.png', clusteredEntities.length, 64);
        //   cluster.billboard.width = 72;
        //   cluster.billboard.height = 72;
        // } else if (clusteredEntities.length >= 3) {
        //   cluster.billboard.image = combineIconAndLabel('/images/garden-icon.png', clusteredEntities.length, 64);
        //   cluster.billboard.width = 56;
        //   cluster.billboard.height = 56;
        // } else if (clusteredEntities.length >= 2) {
        //   cluster.billboard.image = combineIconAndLabel('/images/school-icon.png', clusteredEntities.length, 64);
        //   cluster.billboard.width = 48;
        //   cluster.billboard.height = 48;
        // } else {
        cluster.billboard.image = combineIconAndLabel('/images/mark-icon.png', clusteredEntities.length, 64);
        cluster.billboard.width = 40;
        cluster.billboard.height = 40;
        // }
      }
    )
  })
}
/**
 * @description: 将图片和文字合成新图标使用（参考Cesium源码）
 * @param {*} url：图片地址
 * @param {*} label：文字
 * @param {*} size：画布大小
 * @return {*} 返回canvas
 */
function combineIconAndLabel(url, label, size) {
  // 创建画布对象
  let canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  let ctx = canvas.getContext("2d");

  let promise = new Cesium.Resource.fetchImage(url).then(image => {
    // 异常判断
    try {
      ctx.drawImage(image, 0, 0);
    } catch (e) {
      console.log(e);
    }

    // 渲染字体
    // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
    ctx.fillStyle = Cesium.Color.BLACK.toCssColorString();
    ctx.font = 'bold 20px Microsoft YaHei';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2);

    return canvas;
  });
  return promise;
}

viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
})
initCluster()

const scene = viewer.scene
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
handler.setInputAction((e) => {
  // 获取实体
  const pick = scene.pick(e.position)
  if (Cesium.defined(pick) && pick.id.id.indexOf("mark") > -1) {
    console.log('---', pick.id.name)
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

</script>
<template>
  <div></div>
</template>
<style lang='less' scoped>

</style>