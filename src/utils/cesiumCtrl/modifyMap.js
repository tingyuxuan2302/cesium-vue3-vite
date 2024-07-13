/*
 * @Description:
 * @Author: 笙痞77
 * @Date: 2024-06-23 19:53:32
 * @LastEditors: 笙痞77
 * @LastEditTime: 2024-06-27 22:23:18
 */
import * as Cesium from "cesium";
import { AMapImageryProvider } from "@dvgis/cesium-map";

export default function modifyMap(viewer) {
  viewer.imageryLayers.add(
    new Cesium.ImageryLayer(
      new AMapImageryProvider({
        style: "dark", // style: img、vec、normal、dark
        crs: "WGS84", // 使用84坐标系，默认为：BD09
      })
    )
  );
  // 获取地图影像图层
  const baseLayer = viewer.imageryLayers.get(0);
  // 设置两个变量，用来判断是否进行颜色的翻转和过滤
  const options = {
    invertColor: true,
    filterRGB: [255.0, 255.0, 255.0],
  };

  // 更改地图着色器代码
  const baseFragShader =
    viewer.scene._globe._surfaceShaderSet.baseFragmentShaderSource.sources;
  for (let i = 0; i < baseFragShader.length; i++) {
    // console.log(baseFragShader[i])
    // console.log('------')

    const strS = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    let strT = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    if (options.invertColor) {
      strT += `
      color.r = 1.0 - color.r;
      color.g = 1.0 - color.g;
      color.b = 1.0 - color.b;
      `;
    }
    if (options.filterRGB.length > 0) {
      strT += `
      color.r = color.r * ${options.filterRGB[0]}.0/255.0;
      color.g = color.g * ${options.filterRGB[1]}.0/255.0;
      color.b = color.b * ${options.filterRGB[2]}.0/255.0;
      `;
    }
    baseFragShader[i] = baseFragShader[i].replace(strS, strT);
  }
}

const colorRgb = (inColor) => {
  // 16进制颜色值的正则
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  let color = inColor.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    const colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    return colorChange;
  }
  return [];
};
