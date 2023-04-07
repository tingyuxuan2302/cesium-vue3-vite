<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-04-06 14:09:48
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-04-06 14:29:44
-->
<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { ref } from "vue";

import Marks from "./components/marks.vue";

const store = useStore();
const { viewer } = store.state;
</script>
<template>
  <div class="set-box">
    <Marks></Marks>
  </div>
</template>
<style scoped lang='less'>
.set-box {
  position: absolute;
  z-index: 100;
  width: 400px;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
}
</style>