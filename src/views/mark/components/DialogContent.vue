<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-06 16:19:56
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-06 16:24:31
-->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  onClose: Function
})
</script>
<template>
  <div>
    <slot name="content"></slot>
    <el-button type="primary" @click="props.onClose">关闭</el-button>
  </div>
</template>
<style lang='less' scoped>

</style>