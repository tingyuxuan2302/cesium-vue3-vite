<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import SuperGif from "@/utils/cesiumCtrl/LoadGif.js";

const { viewer } = window;

onMounted(() => {
  let div = document.createElement("div");
  let img = document.createElement("img");
  div.appendChild(img);
  img.src = "/images/boom2.gif";

  img.onload = () => {
    let rub = new SuperGif({
      gif: img,
    });
    rub.load(() => {
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
        billboard: {
          image: new Cesium.CallbackProperty(() => {
            return rub.get_canvas().toDataURL("image/png");
          }, false),
          scale: 2,
        },
      });
    });
  };
});
</script>

<style scoped></style>
