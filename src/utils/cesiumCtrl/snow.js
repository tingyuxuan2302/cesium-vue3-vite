/*
 * @Descripttion: 雪花粒子类
 * @Author: 笙痞
 * @Date: 2023-01-04 14:01:07
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-19 09:52:52
 */

import * as Cesium from "cesium";
class SnowEffect {
  constructor(viewer, options) {
    if (!viewer) throw new Error("no viewer object!");
    options = options || {};
    this.snowSize = Cesium.defaultValue(options.snowSize, 0.02); // ❄️大小，最好小于0.02
    this.snowSpeed = Cesium.defaultValue(options.snowSpeed, 60.0); // 速度
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.snowStage = new Cesium.PostProcessStage({
      name: "czm_snow",
      fragmentShader: this.snow(),
      uniforms: {
        snowSize: () => {
          return this.snowSize;
        },
        snowSpeed: () => {
          return this.snowSpeed;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.snowStage);
  }

  destroy() {
    if (!this.viewer || !this.snowStage) return;
    this.viewer.scene.postProcessStages.remove(this.snowStage);
    const isDestroyed = this.snowStage.isDestroyed();
    // 先检查是否被销毁过，如果已经被销毁过再调用destroy会报错
    if (!isDestroyed) {
      this.snowStage.destroy();
    }
    delete this.snowSize;
    delete this.snowSpeed;
  }
  show(visible) {
    this.snowStage.enabled = visible;
  }

  snow() {
    return "uniform sampler2D colorTexture;\n\
          in vec2 v_textureCoordinates;\n\
          uniform float snowSpeed;\n\
                  uniform float snowSize;\n\
          float snow(vec2 uv,float scale)\n\
          {\n\
              float time=czm_frameNumber/snowSpeed;\n\
              float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
              uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
              uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
              p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
              k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);\n\
              return k*w;\n\
          }\n\
          out vec4 fragColor;\n\
          void main(void){\n\
              vec2 resolution=czm_viewport.zw;\n\
              vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
              vec3 finalColor=vec3(0);\n\
              //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));\n\
              float c=0.;\n\
              c+=snow(uv,30.)*.0;\n\
              c+=snow(uv,20.)*.0;\n\
              c+=snow(uv,15.)*.0;\n\
              c+=snow(uv,10.);\n\
              c+=snow(uv,8.);\n\
              c+=snow(uv,6.);\n\
              c+=snow(uv,5.);\n\
              finalColor=(vec3(c));\n\
              fragColor=mix(texture(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);\n\
              }\n\
              ";
  }
}
export default SnowEffect;
