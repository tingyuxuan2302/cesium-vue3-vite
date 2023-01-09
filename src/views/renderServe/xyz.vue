<!--
 * @Descripttion: zxy瓦片
 * @Author: 笙痞
 * @Date: 2023-01-09 09:41:20
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-09 09:57:03
-->
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex';
import * as Cesium from "cesium"

const store = useStore()
const { viewer } = store.state

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "http://114.215.136.187:8080/spatio/resource-service/4e57e9342d7244dc95e36bf5e6980eb9/63/{z}/{x}/{y}.png",
})
viewer.imageryLayers.addImageryProvider(imageryProvider)
</script>
<template>
  <div></div>
</template>
<style lang='less' scoped>

</style>