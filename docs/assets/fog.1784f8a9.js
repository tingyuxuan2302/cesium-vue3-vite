import{_ as l,u as f,a as u,o as d,b as h,d as s,w as i,e as r}from"./index.f73e044e.js";import{E as _}from"./el-button.456a72d6.js";class g{constructor(t,e){if(!t)throw new Error("no viewer object!");e=e||{},this.visibility=Cesium.defaultValue(e.visibility,.1),this.color=Cesium.defaultValue(e.color,new Cesium.Color(.8,.8,.8,.5)),this.viewer=t,this.init()}init(){this.fogStage=new Cesium.PostProcessStage({name:"czm_fog",fragmentShader:this.fog(),uniforms:{visibility:()=>this.visibility,fogColor:()=>this.color}}),this.viewer.scene.postProcessStages.add(this.fogStage)}destroy(){if(!this.viewer||!this.fogStage)return;this.viewer.scene.postProcessStages.remove(this.fogStage),this.fogStage.isDestroyed()||this.fogStage.destroy(),delete this.visibility,delete this.color}show(t){this.fogStage.enabled=t}fog(){return`uniform sampler2D colorTexture;
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
`}}const m={class:"container"},v={__name:"fog",setup(n){const t=f(),e=new g(t.state.viewer,{visibility:.2,color:new Cesium.Color(.8,.8,.8,.3)}),a=()=>{e.show(!1)},c=()=>{e.show(!0)};return u(()=>{e.destroy()}),(p,y)=>{const o=_;return d(),h("div",m,[s(o,{type:"primary",onClick:c},{default:i(()=>[r("\u5F00\u59CB")]),_:1}),s(o,{type:"primary",onClick:a},{default:i(()=>[r("\u505C\u6B62")]),_:1})])}}},w=l(v,[["__scopeId","data-v-c1d2736f"]]);export{w as default};
