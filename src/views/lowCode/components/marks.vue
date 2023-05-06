<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { ref, watch } from "vue";
import { getMarksJson } from "@/common/api/marks.js";
import { ElMessage } from "element-plus";
import { BASE_URL } from "@/common/constant";

const store = useStore();
const { viewer } = store.state;
const dialogShow = ref(false);
const fileList = ref([]);
const photoList = ref([]);
const fileName = ref();
const photoName = ref();
const openDialog = () => {
  dialogShow.value = true;
};

const uploadSuccess = (res, uploadFile) => {
  console.log("-----", res, uploadFile);
  fileName.value = uploadFile.name;
};
const startMarks = async () => {
  const { res } = await getMarksJson({
    fileName: fileName.value,
  });
  const { code, data, msg } = res;
  if (code !== 1) {
    return ElMessage.error(msg);
  }
  if (data?.features?.length) {
    formatData(data.features);
    dialogShow.value = false;
    clearData();
    viewer.camera.flyTo({
      // 从以度为单位的经度和纬度值返回笛卡尔3位置。
      destination: Cesium.Cartesian3.fromDegrees(
        ...data.features[0]["geometry"]["coordinates"],
        40000
      ),
      orientation: {
        // heading：默认方向为正北，正角度为向东旋转，即水平旋转，也叫偏航角。
        // pitch：默认角度为-90，即朝向地面，正角度在平面之上，负角度为平面下，即上下旋转，也叫俯仰角。
        // roll：默认旋转角度为0，左右旋转，正角度向右，负角度向左，也叫翻滚角
        heading: Cesium.Math.toRadians(0.0), // 正东，默认北
        pitch: Cesium.Math.toRadians(-90), // 向正下方看
        roll: 0.0, // 左右
      },
      duration: 3, // 飞行时间（s）
    });
  }
};

const clearData = () => {
  fileName.value = undefined;
  photoName.value = undefined;
  photoList.value = [];
  fileList.value = [];
};

watch(
  () => dialogShow.value,
  (newShow) => {
    if (!newShow) {
      clearData();
    }
  }
);

const billboardsCollection = viewer.scene.primitives.add(
  new Cesium.BillboardCollection()
);
const formatData = (features) => {
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const coordinates = feature.geometry.coordinates;
    const position = Cesium.Cartesian3.fromDegrees(
      coordinates[0],
      coordinates[1]
    );
    const name = feature.properties.name;
    // 带图片的点
    billboardsCollection.add({
      image: photoName.value
        ? `../../../../upload/${photoName.value}`
        : "/images/mark-icon.png",
      width: 32,
      height: 32,
      position,
    });
  }
};

const photoSuccess = (res, file) => {
  console.log("图片上传成功", res, file);
  photoName.value = file.name;
};
</script>
<template>
  <el-button type="primary" @click="openDialog">打点</el-button>
  <el-dialog v-model="dialogShow" title="打点配置">
    <el-form label-width="120px">
      <el-form-item label="点数据上传：">
        <el-upload
          class="upload-demo"
          drag
          v-model:file-list="fileList"
          :action="`${BASE_URL}/common/uploadFile`"
          name="file"
          @success="uploadSuccess"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">请上传点位数据geojson文件</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="图标：">
        <el-upload
          v-model:file-list="photoList"
          :action="`${BASE_URL}/common/uploadFile`"
          @success="photoSuccess"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="操作：">
        <el-button type="primary" @click="startMarks">开始打点</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style scoped lang='less'>
</style>