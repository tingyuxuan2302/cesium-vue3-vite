<!--
 * @Descripttion: 底层打点，对于大数据量的点渲染效果更佳
 * @Author: 笙痞
 * @Date: 2023-01-09 14:34:21
 * @LastEditors: 笙痞77
 * @LastEditTime: 2024-06-02 21:31:46
-->

<script setup>
import { nextTick, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { getGeojson } from "@/common/api/api.js";
import PrimitiveCluster from "@/utils/cesiumCtrl/primitiveCluster";
import Dialog from "@/utils/cesiumCtrl/dialog";

// 聚合实现：https://blog.csdn.net/qq_53979889/article/details/126173439#comments_24834053
// 聚合实现：https://www.jianshu.com/p/80d40c447657

const store = useStore();
// viewer就是cesium实例化之后的场景示例，我把他存在了vuex的store中
const { viewer } = store.state;
const dialogs = ref();
// 先把广告牌实例化，然后再添加到场景中
const billboardsCollection = viewer.scene.primitives.add(
  new Cesium.BillboardCollection()
);
let billboardsCollectionCombine = new Cesium.BillboardCollection();

let primitivesCollection = null;
let primitives = null;
// 点位特性信息集合
let pointFeatures = [];
// 先获取点位的json信息
const getJson = () => {
  getGeojson("/json/chuzhong.geojson").then(({ res }) => {
    console.log(res);
    const { features } = res;
    pointFeatures = features;
    formatData(features);
  });
};

const formatData = (features) => {
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    // 每个点位的坐标
    const coordinates = feature.geometry.coordinates;
    // 将坐标处理成3D笛卡尔点
    const position = Cesium.Cartesian3.fromDegrees(
      coordinates[0],
      coordinates[1],
      1000
    );
    const name = feature.properties.name;
    // 画普通的点
    // pointCollection.add({
    //   position,
    //   color: Cesium.Color.CYAN,
    //   pixelSize: 36,
    // })
    // 带图片的点
    billboardsCollection._id = `mark`;
    // add的是Billboard，将一个个Billboard添加到集合当中
    billboardsCollection.add({
      image: "/images/mark-icon.png",
      width: 32,
      height: 32,
      position,
    });
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
};
const scene = viewer.scene;
// ScreenSpaceEventHandler的参数是要添加事件的元素，直接给整个画布添加
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction((e) => {
  console.log("xxxx", e);
  // 获取点击的实体
  const pick = scene.pick(e.position);
  // 判断点击的是不是点位
  if (Cesium.defined(pick) && pick.collection._id.indexOf("mark") > -1) {
    // 拿到点位的属性信息
    const property = pointFeatures[pick.primitive._index];
    // 弹窗所需的参数
    const opts = {
      viewer,
      position: {
        _value: pick.primitive.position,
      },
      title: property.properties.name,
      content: property.properties.address,
      // slotTitle: h('span', {
      //   innerHTML: pick.id.name,
      // })
      // slotContent: h(DialogContent, {
      //   onClose: handleClose
      // }, {
      //   content: () => pick.id.properties.address._value
      // })
    };
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

viewer.camera.setView({
  // 从以度为单位的经度和纬度值返回笛卡尔3位置。
  destination: Cesium.Cartesian3.fromDegrees(120.36, 36.09, 40000),
});

const onClear = () => {
  handleClose();
  billboardsCollection?.removeAll();
  primitives?.removeAll();
  primitivesCollection = null;
  billboardsCollectionCombine = null;
};

onUnmounted(() => {
  onClear();
});

const onCluster = () => {
  getGeojson("/json/schools.geojson").then(({ res }) => {
    console.log(res);
    const { features } = res;
    formatClusterPoint(features);
  });
};
const formatClusterPoint = (features) => {
  primitivesCollection = new Cesium.PrimitiveCollection();
  billboardsCollectionCombine = new Cesium.BillboardCollection();
  var scene = viewer.scene;
  let primitivecluster = null;
  primitivecluster = new PrimitiveCluster();

  //与entitycluster相同设置其是否聚合 以及最大最小值
  primitivecluster.enabled = true;
  primitivecluster.pixelRange = 60;
  primitivecluster.minimumClusterSize = 2;
  // primitivecluster._pointCollection = pointCollection;
  // primitivecluster._labelCollection = labelCollection;

  //后面设置聚合的距离及聚合后的图标颜色显示与官方案例一样
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const coordinates = feature.geometry.coordinates;
    const position = Cesium.Cartesian3.fromDegrees(
      coordinates[0],
      coordinates[1],
      2000
    );

    // 带图片的点
    billboardsCollectionCombine.add({
      image: "/images/mark-icon.png",
      width: 32,
      height: 32,
      position,
    });
  }
  primitivecluster._billboardCollection = billboardsCollectionCombine;
  // 同时在赋值时调用_initialize方法
  primitivecluster._initialize(scene);

  primitivesCollection.add(primitivecluster);
  primitives = viewer.scene.primitives.add(primitivesCollection);

  primitivecluster.clusterEvent.addEventListener(
    (clusteredEntities, cluster) => {
      // console.log("clusteredEntities", clusteredEntities);
      // console.log("cluster", cluster);
      // 关闭自带的显示聚合数量的标签
      cluster.label.show = false;
      cluster.billboard.show = true;
      cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

      // 根据聚合数量的多少设置不同层级的图片以及大小
      cluster.billboard.image = combineIconAndLabel(
        "/images/school-icon.png",
        clusteredEntities.length,
        64
      );
      // cluster.billboard.image = "/images/school-icon.png";
      cluster.billboard._imageHeight = 60;
      cluster.billboard._imageWidth = 60;
      cluster.billboard._dirty = false;
      cluster.billboard.width = 40;
      cluster.billboard.height = 40;
    }
  );
  return primitivecluster;
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
</script>
<template>
  <OperateBox>
    <el-button type="primary" @click="getJson">打点</el-button>

    <el-button type="primary" @click="onCluster">primitive打点聚合</el-button>

    <el-button type="primary" @click="onClear">清除打点</el-button>
  </OperateBox>
</template>
<style lang="less" scoped></style>
