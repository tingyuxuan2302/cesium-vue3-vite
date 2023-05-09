<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-09 10:45:51
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-04-06 14:09:06
-->
<script setup>
</script>
<template>
  <div class="container">
    <slot></slot>
  </div>
</template>
<style lang='less' scoped>
.container {
  position: absolute;
  z-index: 100;
  // width: 300px;
  // left: 0;
  // top: 0;
  // bottom: 0;
  // background: rgba(0, 0, 0, 0.8);
}
</style>