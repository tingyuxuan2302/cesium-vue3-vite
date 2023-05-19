/*
 * @Descripttion: 雾粒子
 * @Author: 笙痞
 * @Date: 2023-01-04 18:11:32
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-19 09:56:16
 */
import * as Cesium from "cesium";
class FogEffect {
  constructor(viewer, options) {
    if (!viewer) throw new Error("no viewer object!");
    options = options || {};
    this.visibility = Cesium.defaultValue(options.visibility, 0.1); // 能见度
    this.color = Cesium.defaultValue(
      options.color,
      new Cesium.Color(0.8, 0.8, 0.8, 0.5)
    );
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.fogStage = new Cesium.PostProcessStage({
      name: "czm_fog",
      fragmentShader: this.fog(),
      uniforms: {
        visibility: () => {
          return this.visibility;
        },
        fogColor: () => {
          return this.color;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.fogStage);
  }

  destroy() {
    if (!this.viewer || !this.fogStage) return;
    this.viewer.scene.postProcessStages.remove(this.fogStage);
    const isDestroyed = this.fogStage.isDestroyed();
    // 先检查是否被销毁过，如果已经被销毁过再调用destroy会报错
    if (!isDestroyed) {
      this.fogStage.destroy();
    }
    delete this.visibility;
    delete this.color;
  }

  show(visible) {
    this.fogStage.enabled = visible;
  }

  fog() {
    return "uniform sampler2D colorTexture;\n\
       uniform sampler2D depthTexture;\n\
       uniform float visibility;\n\
       uniform vec4 fogColor;\n\
       in vec2 v_textureCoordinates; \n\
       out vec4 fragColor;\n\
       void main(void) \n\
       { \n\
          vec4 origcolor = texture(colorTexture, v_textureCoordinates); \n\
          float depth = czm_readDepth(depthTexture, v_textureCoordinates); \n\
          vec4 depthcolor = texture(depthTexture, v_textureCoordinates); \n\
          float f = visibility * (depthcolor.r - 0.3) / 0.2; \n\
          if (f < 0.0) f = 0.0; \n\
          else if (f > 1.0) f = 1.0; \n\
          fragColor = mix(origcolor, fogColor, f); \n\
       }\n";
  }
}

export default FogEffect;
