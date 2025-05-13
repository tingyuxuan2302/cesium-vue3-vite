import{_ as f,a as d,o as u,b as g,d as r,w as s,e as n}from"./index.76f76e18.js";import{E as h}from"./el-button.46cdb001.js";class _{constructor(t,e){if(!t)throw new Error("no viewer object!");e=e||{},this.visibility=Cesium.defaultValue(e.visibility,.1),this.color=Cesium.defaultValue(e.color,new Cesium.Color(.8,.8,.8,.5)),this.viewer=t,this.init()}init(){this.fogStage=new Cesium.PostProcessStage({name:"czm_fog",fragmentShader:this.fog(),uniforms:{visibility:()=>this.visibility,fogColor:()=>this.color}}),this.viewer.scene.postProcessStages.add(this.fogStage)}destroy(){if(!this.viewer||!this.fogStage)return;this.viewer.scene.postProcessStages.remove(this.fogStage),this.fogStage.isDestroyed()||this.fogStage.destroy(),delete this.visibility,delete this.color}show(t){this.fogStage.enabled=t}fog(){return`uniform sampler2D colorTexture;
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
`}}const m={class:"container"},v={__name:"fog",setup(a){const{viewer:t}=window,e=new _(t,{visibility:.2,color:new Cesium.Color(.8,.8,.8,.3)}),l=()=>{e.show(!1)},c=()=>{e.show(!0)};return d(()=>{e.destroy()}),(p,o)=>{const i=h;return u(),g("div",m,[r(i,{type:"primary",onClick:c},{default:s(()=>o[0]||(o[0]=[n("\u5F00\u59CB")])),_:1}),r(i,{type:"primary",onClick:l},{default:s(()=>o[1]||(o[1]=[n("\u505C\u6B62")])),_:1})])}}},w=f(v,[["__scopeId","data-v-e8d53cbd"]]);export{w as default};
