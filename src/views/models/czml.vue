<template>
  <div></div>
</template>
<script setup>
import { ref } from 'vue'
import * as Cesium from 'cesium'

const { viewer } = window

let czmldata = new Cesium.CzmlDataSource.load('/models/wx.czml');
viewer.dataSources.add(czmldata)
viewer.clock.shouldAnimate = true;
</script>
<style lang='less' scoped></style>