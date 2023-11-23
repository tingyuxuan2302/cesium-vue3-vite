<!--
 * @Descripttion: 聚合点位，entity，适用于少量点位
 * @Author: 笙痞
 * @Date: 2023-01-05 11:05:00
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 20:04:20
-->
<script setup>
import { ref, h, onUnmounted } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import Dialog from "@/utils/cesiumCtrl/dialog";
import DialogContent from "./components/DialogContent.vue";

const store = useStore();
const dialogs = ref();
const { viewer } = store.state;
const initCluster = () => {
  viewer.dataSources.add(
    new Cesium.GeoJsonDataSource()
      .load("/json/chuzhong.geojson")
      .then((dataSource) => {
        // await viewer.dataSources.add(dataSource)
        // 设置聚合参数
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = 60;
        dataSource.clustering.minimumClusterSize = 2;

        dataSource.entities.values.forEach((entity) => {
          // 将点拉伸一定高度，防止被地形压盖
          entity.position._value.z += 2000;
          entity._id = `mark-${entity.id}`;
          entity.billboard = {
            image: "/images/mark-icon.png",
            width: 32,
            height: 32,
          };
          // entity.label = {
          //   text: entity.name,
          //   font: "bold 15px Microsoft YaHei",
          //   // 竖直对齐方式
          //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
          //   // 水平对齐方式
          //   horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          //   // 偏移量
          //   pixelOffset: new Cesium.Cartesian2(15, 0),
          // }
        });
        dataSource.clustering.clusterEvent.addEventListener(
          (clusteredEntities, cluster) => {
            // 关闭自带的显示聚合数量的标签
            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

            console.log("clusteredEntities", clusteredEntities);
            console.log("cluster", cluster);

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
            cluster.billboard.image = combineIconAndLabel(
              "/images/mark-icon.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 40;
            cluster.billboard.height = 40;
            // }
          }
        );
        return dataSource;
      })
  );
};
/**
 * @description: 将图片和文字合成新图标使用（参考Cesium源码）
 * @param {*} url：图片地址
 * @param {*} label：文字
 * @param {*} size：画布大小
 * @return {*} 返回canvas
 */
function combineIconAndLabel(url, label, size) {
  // 创建画布对象
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  let ctx = canvas.getContext("2d");

  let promise = new Cesium.Resource.fetchImage(url).then((image) => {
    // 异常判断
    try {
      ctx.drawImage(image, 0, 0);
    } catch (e) {
      console.log(e);
    }

    // 渲染字体
    // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
    ctx.fillStyle = Cesium.Color.BLACK.toCssColorString();
    ctx.font = "bold 20px Microsoft YaHei";
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
});

const scene = viewer.scene;
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction((e) => {
  const clickPosition = viewer.scene.camera.pickEllipsoid(e.position);
  const randiansPos = Cesium.Cartographic.fromCartesian(clickPosition);
  // console.log("经度：" + Cesium.Math.toDegrees(randiansPos.longitude) + ", 纬度：" + Cesium.Math.toDegrees(randiansPos.latitude))
  // 获取实体
  const pick = scene.pick(e.position);
  if (Cesium.defined(pick) && pick.id?.id.indexOf("mark") > -1) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        Cesium.Math.toDegrees(randiansPos.longitude),
        Cesium.Math.toDegrees(randiansPos.latitude),
        10000
      ),
      duration: 1,
    });
    const opts = Object.assign(pick.id, {
      viewer,
      title: pick.id.name,
      content: pick.id.properties.address._value,
      // slotTitle: h('span', {
      //   innerHTML: pick.id.name,
      // })
      // slotContent: h(DialogContent, {
      //   onClose: handleClose
      // }, {
      //   content: () => pick.id.properties.address._value
      // })
    });
    console.log("---", pick.id, opts);
    if (dialogs.value) {
      // 只允许一个弹窗出现
      dialogs.value.windowClose();
    }
    dialogs.value = new Dialog(opts);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

const handleClose = () => {
  dialogs.value?.windowClose();
};
const onClear = () => {
  handleClose();
  viewer.dataSources?.removeAll();
};
onUnmounted(() => {
  onClear();
});
</script>
<template>
  <OperateBox>
    <el-button type="primary" @click="initCluster">打点</el-button>
    <el-button type="primary" @click="onClear">清除打点</el-button>
  </OperateBox>
</template>
<style lang="less" scoped></style>
