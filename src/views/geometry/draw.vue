<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import { ref } from 'vue'
import DrawTool from '@/utils/cesiumCtrl/drawGraphic';

const store = useStore()
const { viewer } = store.state
const drawTool = new DrawTool(viewer)
</script>
<template>
  <operate-box>
    <el-button type='primary' @click='drawTool.activate("Point")'>点</el-button>
    <el-button type='primary' @click='drawTool.activate("Polyline")'>线</el-button>
    <el-button type='primary' @click='drawTool.activate("Polygon")'>面</el-button>
    <el-button type='primary' @click='drawTool.clearAll()'>清除</el-button>
  </operate-box>
</template>
<style scoped lang='less'>

</style>