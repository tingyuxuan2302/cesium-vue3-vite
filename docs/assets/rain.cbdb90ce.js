import{_ as u,a as d,o as f,b as m,d as r,w as a,e as s}from"./index.fe5814f1.js";import{E as v}from"./el-button.af2fec77.js";class h{constructor(t,e){if(!t)throw new Error("no viewer object!");e=e||{},this.tiltAngle=Cesium.defaultValue(e.tiltAngle,-.6),this.rainSize=Cesium.defaultValue(e.rainSize,.3),this.rainSpeed=Cesium.defaultValue(e.rainSpeed,60),this.viewer=t,this.init()}init(){this.rainStage=new Cesium.PostProcessStage({name:"czm_rain",fragmentShader:this.rain(),uniforms:{tiltAngle:()=>this.tiltAngle,rainSize:()=>this.rainSize,rainSpeed:()=>this.rainSpeed}}),this.viewer.scene.postProcessStages.add(this.rainStage)}destroy(){if(!this.viewer||!this.rainStage)return;this.viewer.scene.postProcessStages.remove(this.rainStage),this.rainStage.isDestroyed()||this.rainStage.destroy(),delete this.tiltAngle,delete this.rainSize,delete this.rainSpeed}show(t){this.rainStage.enabled=t}rain(){return`uniform sampler2D colorTexture;
              in vec2 v_textureCoordinates;
              uniform float tiltAngle;
              uniform float rainSize;
              uniform float rainSpeed;
              float hash(float x) {
                  return fract(sin(x * 133.3) * 13.13);
              }
              out vec4 fragColor;
              void main(void) {
                  float time = czm_frameNumber / rainSpeed;
                  vec2 resolution = czm_viewport.zw;
                  vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
                  vec3 c = vec3(.6, .7, .8);
                  float a = tiltAngle;
                  float si = sin(a), co = cos(a);
                  uv *= mat2(co, -si, si, co);
                  uv *= length(uv + vec2(0, 4.9)) * rainSize + 1.;
                  float v = 1. - sin(hash(floor(uv.x * 100.)) * 2.);
                  float b = clamp(abs(sin(20. * time * v + uv.y * (5. / (2. + v)))) - .95, 0., 1.) * 20.;
                  c *= v * b;
                  fragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c, 1), .5);
              }
              `}}const _={class:"container"},S={__name:"rain",setup(o){const{viewer:t}=window,e=new h(t,{tiltAngle:-.2,rainSize:1,rainSpeed:120}),l=()=>{e.show(!1)},c=()=>{e.show(!0)};return d(()=>{e.destroy()}),(g,n)=>{const i=v;return f(),m("div",_,[r(i,{type:"primary",onClick:c},{default:a(()=>n[0]||(n[0]=[s("\u5F00\u59CB")])),_:1}),r(i,{type:"primary",onClick:l},{default:a(()=>n[1]||(n[1]=[s("\u505C\u6B62")])),_:1})])}}},x=u(S,[["__scopeId","data-v-1628794d"]]);export{x as default};
