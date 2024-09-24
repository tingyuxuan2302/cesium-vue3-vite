<!--
 * @Description: 模型压平、倾斜摄影压平以及高度自定义设置
   此功能主要利用Cesium中3dTiles模型的CustomShader自定义shader接口
   可以在顶点着色器中对顶点进行处理，判断这个顶点的x，y是否在区域范围内，如果是则修改z的高度
 * @Author: LukeSuperCoder
 * @Date: 2023-09-24 16:00:00
 * @LastEditors: LukeSuperCoder
 * @LastEditTime: 2023-09-24 16:00:00
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onMounted, onUnmounted, ref } from "vue";
import DrawTool from "@/utils/cesiumCtrl/drawGraphic";
import {PlanishArea} from "@/utils/cesiumCtrl/flat/PlanishArea";
import {TilesetPlanish} from "@/utils/cesiumCtrl/flat/TilesetPlanish";


const store = useStore();
const { viewer } = store.state;
const drawTool = new DrawTool(viewer);
const planishArea = new PlanishArea();
let tilesetPlanish = null;
let height = ref(-10);

//获取绘制完成回调，拿到绘制面数据，进行倾斜摄影压平处理
const getDrawPolygon = (e) => {
  drawTool.clearAll();
  clearPlanish();
  const coords = e.polygon.hierarchy.getValue().positions; //获取绘制区域世界坐标
  planishArea.name = '测试';
  planishArea.area = coords;
  planishArea.height = height.value;
  tilesetPlanish.addRegionEditsDataArr([planishArea]);  //添加压平数据并进行地形压平处理
}


 /**
 * 清除压平
 */
const clearPlanish = () => {
  tilesetPlanish.removeRegionEditsData(planishArea.uuid);
  drawTool.clearAll();
}
const set3Dtitle3 = () => {
  let translation = Cesium.Cartesian3.fromArray([0, 0, 0]);
  let m = Cesium.Matrix4.fromTranslation(translation);
  const url = "http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json";
  let tilesetJson = {
    url,
    modelMatrix: m,
    show: true, // 是否显示图块集(默认true)
    skipLevelOfDetail: true, // --- 优化选项。确定是否应在遍历期间应用详细级别跳过(默认false)
    baseScreenSpaceError: 1024, // --- When skipLevelOfDetailis true，在跳过详细级别之前必须达到的屏幕空间错误(默认1024)
    maximumScreenSpaceError: 32, // 数值加大，能让最终成像变模糊---用于驱动细节细化级别的最大屏幕空间误差(默认16)原128
    skipScreenSpaceErrorFactor: 16, // --- 何时skipLevelOfDetail是true，定义要跳过的最小屏幕空间错误的乘数。与 一起使用skipLevels来确定要加载哪些图块(默认16)
    skipLevels: 1, // --- WhenskipLevelOfDetail是true一个常量，定义了加载图块时要跳过的最小级别数。为 0 时，不跳过任何级别。与 一起使用skipScreenSpaceErrorFactor来确定要加载哪些图块。(默认1)
    immediatelyLoadDesiredLevelOfDetail: false, // --- 当skipLevelOfDetail是时true，只会下载满足最大屏幕空间错误的图块。忽略跳过因素，只加载所需的图块(默认false)
    loadSiblings: false, // 如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋 --- 何时确定在遍历期间skipLevelOfDetail是否true始终下载可见瓦片的兄弟姐妹(默认false)
    cullWithChildrenBounds: false, // ---优化选项。是否使用子边界体积的并集来剔除瓦片（默认true）
    cullRequestsWhileMoving: false, // ---优化选项。不要请求由于相机移动而在返回时可能未使用的图块。这种优化只适用于静止的瓦片集(默认true)
    cullRequestsWhileMovingMultiplier: 10, // 值越小能够更快的剔除 ---优化选项。移动时用于剔除请求的乘数。较大的是更积极的剔除，较小的较不积极的剔除(默认60)原10
    preloadWhenHidden: true, // ---tileset.show时 预加载瓷砖false。加载图块，就好像图块集可见但不渲染它们(默认false)
    preloadFlightDestinations: true, // ---优化选项。在相机飞行时在相机的飞行目的地预加载图块(默认true)
    preferLeaves: true, // ---优化选项。最好先装载叶子(默认false)
    maximumMemoryUsage: 2048, // 内存分配变小有利于倾斜摄影数据回收，提升性能体验---瓦片集可以使用的最大内存量（以 MB 为单位）(默认512)原512 4096
    progressiveResolutionHeightFraction: 0.5, // 数值偏于0能够让初始加载变得模糊 --- 这有助于在继续加载全分辨率图块的同时快速放下图块层(默认0.3)
    dynamicScreenSpaceErrorDensity: 10, // 数值加大，能让周边加载变快 --- 用于调整动态屏幕空间误差的密度，类似于雾密度(默认0.00278)
    dynamicScreenSpaceErrorFactor: 1, // 不知道起了什么作用没，反正放着吧先 --- 用于增加计算的动态屏幕空间误差的因素(默认4.0)
    dynamicScreenSpaceErrorHeightFalloff: 0.25, // --- 密度开始下降的瓦片集高度的比率(默认0.25)
    foveatedScreenSpaceError: true, // --- 优化选项。通过暂时提高屏幕边缘周围图块的屏幕空间错误，优先加载屏幕中心的图块。一旦Cesium3DTileset#foveatedConeSize加载确定的屏幕中心的所有图块，屏幕空间错误就会恢复正常。(默认true)
    foveatedConeSize: 0.1, // --- 优化选项。当Cesium3DTileset#foveatedScreenSpaceError为 true 时使用来控制决定延迟哪些图块的锥体大小。立即加载此圆锥内的瓷砖。圆锥外的瓷砖可能会根据它们在圆锥外的距离及其屏幕空间误差而延迟。这是由Cesium3DTileset#foveatedInterpolationCallback和控制的Cesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation。将此设置为 0.0 意味着圆锥将是由相机位置及其视图方向形成的线。将此设置为 1.0 意味着锥体包含相机的整个视野,禁用效果(默认0.1)
    foveatedMinimumScreenSpaceErrorRelaxation: 0.0, // --- 优化选项。当Cesium3DTileset#foveatedScreenSpaceError为 true 时使用以控制中央凹锥之外的图块的起始屏幕空间误差松弛。屏幕空间错误将从 tileset 值开始Cesium3DTileset#maximumScreenSpaceError根据提供的Cesium3DTileset#foveatedInterpolationCallback.(默认0.0)
    // foveatedTimeDelay: 0.2, // ---优化选项。使用 whenCesium3DTileset#foveatedScreenSpaceError为 true 来控制在相机停止移动后延迟瓷砖开始加载之前等待的时间（以秒为单位）。此时间延迟可防止在相机移动时请求屏幕边缘周围的瓷砖。将此设置为 0.0 将立即请求任何给定视图中的所有图块。(默认0.2)
    luminanceAtZenith: 0.2, // --- 用于此模型的程序环境贴图的天顶处的太阳亮度（以千坎德拉每平方米为单位）(默认0.2)
    backFaceCulling: true, // --- 是否剔除背面几何体。当为 true 时，背面剔除由 glTF 材质的 doubleSided 属性确定；如果为 false，则禁用背面剔除(默认true)
    debugFreezeFrame: false, // --- 仅用于调试。确定是否应仅使用最后一帧的图块进行渲染(默认false)
    debugColorizeTiles: false, // --- 仅用于调试。如果为 true，则为每个图块分配随机颜色(默认false)
    debugWireframe: false, // --- 仅用于调试。如果为 true，则将每个图块的内容渲染为线框(默认false)
    debugShowBoundingVolume: false, // --- 仅用于调试。如果为 true，则为每个图块渲染边界体积(默认false)
    debugShowContentBoundingVolume: false, // --- 仅用于调试。如果为 true，则为每个图块的内容渲染边界体积(默认false)
    debugShowViewerRequestVolume: false, // --- 仅用于调试。如果为 true，则呈现每个图块的查看器请求量(默认false)
    debugShowGeometricError: false, // --- 仅用于调试。如果为 true，则绘制标签以指示每个图块的几何误差(默认false)
    debugShowRenderingStatistics: false, // --- 仅用于调试。如果为 true，则绘制标签以指示每个图块的命令、点、三角形和特征的数量(默认false)
    debugShowMemoryUsage: false, // --- 仅用于调试。如果为 true，则绘制标签以指示每个图块使用的纹理和几何内存（以兆字节为单位）(默认false)
    debugShowUrl: false, // --- 仅用于调试。如果为 true，则绘制标签以指示每个图块的 url(默认false)
    dynamicScreenSpaceError: true, // 根据测试，有了这个后，会在真正的全屏加载完之后才清晰化房屋 --- 优化选项。减少距离相机较远的图块的屏幕空间错误(默认false)
  };
  const tileset = new Cesium.Cesium3DTileset(tilesetJson);
  viewer.flyTo(tileset);
  // 异步加载
  tileset.readyPromise
    .then(function (tileset) {
      viewer.scene.primitives.add(tileset);
    })
    .catch(function (error) {
      console.log(error);
    });
  tileset.allTilesLoaded.addEventListener(function () {
    console.log("模型已经全部加载完成");
    tilesetPlanish = new TilesetPlanish(tileset);
  });
};
set3Dtitle3();
onUnmounted(() => {
  drawTool.clearAll();
  clearPlanish();
});
</script>
<template>
  <operate-box>
    <div style="background-color: red; color: aliceblue;">注意：如果从地形压平跳转过来需要手动刷新一下页面，否则压平效果可能不生效</div>
    <div style="color: aliceblue;">高度设置(由于海拔原因高度为0不一定可以达到压平效果,可根据实际情况调节高度)</div>
    <el-input label="高度设置" type="number" v-model="height" style="width: 100px;"></el-input>
    <el-button type="primary" @click="drawTool.activate('Polygon', getDrawPolygon)"
      >开始绘制</el-button
    >
    <el-button type="primary" @click="clearPlanish()">清除</el-button>
  </operate-box>
</template>
<style scoped lang="less"></style>
