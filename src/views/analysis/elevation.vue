<script setup>
import * as Cesium from "cesium";
import { useStore } from "vuex";
import { onMounted, onUnmounted, ref } from "vue";

const store = useStore();
const { viewer } = store.state;

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    120.58193064609729,
    36.125460378632766,
    2000
  ),
  orientation: {
    heading: 4.747266966349747,
    pitch: -0.2206998858596192,
    roll: 6.280340554587955,
  },
});

const viewModel = {
  gradient: false, // 渐变
  band1Position: 300,
  band2Position: 500,
  band3Position: 1000,
  bandThickness: 100, // 厚度
  bandTransparency: 0.5, // 透明度
  backgroundTransparency: 0.75, // 背景透明度
};
onMounted(() => {
  Cesium.knockout.track(viewModel); // 响应式绑定
  const toolBar = document.getElementById("toolBar");
  Cesium.knockout.applyBindings(viewModel, toolBar);
  for (const name in viewModel) {
    if (viewModel.hasOwnProperty(name)) {
      Cesium.knockout.getObservable(viewModel, name).subscribe(updateMaterial);
    }
  }
  viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: "http://data.marsgis.cn/terrain",
  });
});
onUnmounted(() => {
  clearMaterial();
  viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
});

const updateMaterial = () => {
  const gradient = Boolean(viewModel.gradient);
  const band1Position = Number(viewModel.band1Position);
  const band2Position = Number(viewModel.band2Position);
  const band3Position = Number(viewModel.band3Position);
  const bandThickness = Number(viewModel.bandThickness);
  const bandTransparency = Number(viewModel.bandTransparency);
  const backgroundTransparency = Number(viewModel.backgroundTransparency);

  const layers = [];
  const backgroundLayer = {
    entries: [
      {
        height: 200.0,
        color: new Cesium.Color(0.0, 0.0, 0.2, backgroundTransparency),
      },
      {
        height: 800.0,
        color: new Cesium.Color(1.0, 1.0, 1.0, backgroundTransparency),
      },
      {
        height: 1500.0,
        color: new Cesium.Color(1.0, 0.0, 0.0, backgroundTransparency),
      },
    ],
    extendDownwards: true,
    extendUpwards: true,
  };
  layers.push(backgroundLayer);
  const gridStartHeight = 200.0;
  const gridEndHeight = 1500.0;
  const gridCount = 50;

  for (let i = 0; i < gridCount; i++) {
    const lerper = i / (gridCount - 1);
    // 计算两个高度的线性插值
    const heightBelow = Cesium.Math.lerp(
      gridStartHeight,
      gridEndHeight,
      lerper
    );
    const heightAbove = heightBelow + 10.0;
    const alpha = Cesium.Math.lerp(0.2, 0.4, lerper) * backgroundTransparency;
    layers.push({
      entries: [
        {
          height: heightBelow,
          color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
        },
        {
          height: heightAbove,
          color: new Cesium.Color(1.0, 1.0, 1.0, alpha),
        },
      ],
    });
  }

  const antialias = Math.min(10.0, bandThickness * 0.1);
  if (!gradient) {
    const band1 = {
      entries: [
        {
          height: band1Position - bandThickness * 0.5 - antialias,
          color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
        },
        {
          height: band1Position - bandThickness * 0.5,
          color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
        },
        {
          height: band1Position + bandThickness * 0.5,
          color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
        },
        {
          height: band1Position + bandThickness * 0.5 + antialias,
          color: new Cesium.Color(0.0, 0.0, 1.0, 0.0),
        },
      ],
    };

    const band2 = {
      entries: [
        {
          height: band2Position - bandThickness * 0.5 - antialias,
          color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
        },
        {
          height: band2Position - bandThickness * 0.5,
          color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
        },
        {
          height: band2Position + bandThickness * 0.5,
          color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
        },
        {
          height: band2Position + bandThickness * 0.5 + antialias,
          color: new Cesium.Color(0.0, 1.0, 0.0, 0.0),
        },
      ],
    };

    const band3 = {
      entries: [
        {
          height: band3Position - bandThickness * 0.5 - antialias,
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
        },
        {
          height: band3Position - bandThickness * 0.5,
          color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
        },
        {
          height: band3Position + bandThickness * 0.5,
          color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
        },
        {
          height: band3Position + bandThickness * 0.5 + antialias,
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.0),
        },
      ],
    };

    layers.push(band1);
    layers.push(band2);
    layers.push(band3);
  } else {
    const combinedBand = {
      entries: [
        {
          height: band1Position - bandThickness * 0.5,
          color: new Cesium.Color(0.0, 0.0, 1.0, bandTransparency),
        },
        {
          height: band2Position,
          color: new Cesium.Color(0.0, 1.0, 0.0, bandTransparency),
        },
        {
          height: band3Position + bandThickness * 0.5,
          color: new Cesium.Color(1.0, 0.0, 0.0, bandTransparency),
        },
      ],
    };

    layers.push(combinedBand);
  }
  const material = Cesium.createElevationBandMaterial({
    scene: viewer.scene,
    layers,
  });
  viewer.scene.globe.material = material;
};

const clearMaterial = () => {
  viewer.scene.globe.material = null;
};
</script>
<template>
  <operate-box>
    <el-button type="primary" @click="updateMaterial">开始分析</el-button>
    <el-button type="primary" @click="clearMaterial">结束分析</el-button>
    <div id="toolBar">
      <table>
        <tbody>
          <tr>
            <td>Background Transparency</td>
            <td>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                data-bind="value: backgroundTransparency, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>Band Transparency</td>
            <td>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                data-bind="value: bandTransparency, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>Band Thickness</td>
            <td>
              <input
                type="range"
                min="10"
                max="1000"
                step="1"
                data-bind="value: bandThickness, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>Band 1 Position</td>
            <td>
              <input
                type="range"
                min="200"
                max="1500"
                step="1"
                data-bind="value: band1Position, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>Band 2 Position</td>
            <td>
              <input
                type="range"
                min="200"
                max="1500"
                step="1"
                data-bind="value: band2Position, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>Band 3 Position</td>
            <td>
              <input
                type="range"
                min="200"
                max="1500"
                step="1"
                data-bind="value: band3Position, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>Gradient</td>
            <td>
              <input type="checkbox" data-bind="checked: gradient" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </operate-box>
</template>
<style scoped lang="less"></style>
