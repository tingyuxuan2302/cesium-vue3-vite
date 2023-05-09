<!--
 * @Descripttion: 
 * @Author: 笙痞
 * @Date: 2023-01-04 11:06:25
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-04 14:51:26
-->
<script setup>
import { ref, watch } from "vue";
import routes from "@/router/router.js";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isCollapse = ref(false);
const activePath = ref();
const onExpand = () => {
  isCollapse.value = !isCollapse.value;
};

const linkTo = (name, path) => {
  activePath.value = path;
  router.push({
    name,
  });
};
const defaultOpenArr = routes.map((item) => item.path);

watch(
  () => route.meta.activePath,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      activePath.value = newPath;
    }
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    text-color="#fff"
    :collapse="isCollapse"
    :default-openeds="defaultOpenArr"
    :default-active="activePath"
  >
    <el-sub-menu
      popper-class="pop-item"
      v-for="item in routes"
      :key="item.path"
      :index="item.path"
    >
      <template #title>
        <!-- <el-icon>
              <component :is="item.icon"></component>
            </el-icon> -->
        <span>{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <el-menu-item
          v-for="el in item.children"
          :key="el.meta?.activePath"
          @click="linkTo(el.name)"
          :index="el.meta?.activePath"
          >{{ el.meta?.title }}</el-menu-item
        >
      </template>
    </el-sub-menu>
    <el-icon class="expand-icon" :size="20" color="#fff" @click="onExpand">
      <Expand v-if="isCollapse" />
      <Fold v-else />
    </el-icon>
  </el-menu>
</template>
<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 100vh;
  position: relative;
  padding-bottom: 30px;
  width: 150px;
}

.el-menu--collapse {
  min-height: 100vh;
}

.expand-icon {
  display: block;
  width: 100%;
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
}
</style>
