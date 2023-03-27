<!--
 * @Descripttion: zxy瓦片
 * @Author: 笙痞
 * @Date: 2023-01-09 09:41:20
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-03-21 11:06:39
-->
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";

const store = useStore();
const { viewer } = store.state;

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "http://114.215.136.187:8080/spatio/resource-service/0dc36e39755246baa761228651c03fc1/334/{z}/{x}/{y}.png",
});
viewer.imageryLayers.addImageryProvider(imageryProvider);
</script>
<template>
  <div></div>
</template>
<style lang='less' scoped>
</style>