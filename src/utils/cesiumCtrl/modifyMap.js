/*
 * @Description:
 * @Author: 笙痞77
 * @Date: 2024-06-23 19:53:32
 * @LastEditors: 笙痞77
 * @LastEditTime: 2024-06-23 19:58:22
 */
import * as Cesium from "cesium";
export default function modifyMap(viewer) {
  // 获取地图影像图层
  const baseLayer = viewer.imageryLayers.get(0);
  // 设置两个变量，用来判断是否进行颜色的翻转和过滤
  const options = {
    invertColor: true,
    filterRGB: [0, 50, 100],
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