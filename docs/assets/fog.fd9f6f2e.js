import{_ as c,u,a as d,o as g,b as h,d as i,w as r,e as n}from"./index.bc967ea1.js";import{E as _}from"./el-button.3d1567a4.js";class m{constructor(t,e){if(!t)throw new Error("no viewer object!");e=e||{},this.visibility=Cesium.defaultValue(e.visibility,.1),this.color=Cesium.defaultValue(e.color,new Cesium.Color(.8,.8,.8,.5)),this.viewer=t,this.init()}init(){this.fogStage=new Cesium.PostProcessStage({name:"czm_fog",fragmentShader:this.fog(),uniforms:{visibility:()=>this.visibility,fogColor:()=>this.color}}),this.viewer.scene.postProcessStages.add(this.fogStage)}destroy(){if(!this.viewer||!this.fogStage)return;this.viewer.scene.postProcessStages.remove(this.fogStage),this.fogStage.isDestroyed()||this.fogStage.destroy(),delete this.visibility,delete this.color}show(t){this.fogStage.enabled=t}fog(){return`uniform sampler2D colorTexture;
       uniform sampler2D depthTexture;
       uniform float visibility;
       uniform vec4 fogColor;
       in vec2 v_textureCoordinates; 
       out vec4 fragColor;
       void main(void) 
       { 
          vec4 origcolor = texture(colorTexture, v_textureCoordinates); 
          float depth = czm_readDepth(depthTexture, v_textureCoordinates); 
          vec4 depthcolor = texture(depthTexture, v_textureCoordinates); 
          float f = visibility * (depthcolor.r - 0.3) / 0.2; 
          if (f < 0.0) f = 0.0; 
          else if (f > 1.0) f = 1.0; 
          fragColor = mix(origcolor, fogColor, f); 
       }
`}}const v={class:"container"},p={__name:"fog",setup(a){const t=u(),e=new m(t.state.viewer,{visibility:.2,color:new Cesium.Color(.8,.8,.8,.3)}),l=()=>{e.show(!1)},f=()=>{e.show(!0)};return d(()=>{e.destroy()}),(y,o)=>{const s=_;return g(),h("div",v,[i(s,{type:"primary",onClick:f},{default:r(()=>o[0]||(o[0]=[n("\u5F00\u59CB")])),_:1}),i(s,{type:"primary",onClick:l},{default:r(()=>o[1]||(o[1]=[n("\u505C\u6B62")])),_:1})])}}},w=c(p,[["__scopeId","data-v-8a28860d"]]);export{w as default};
