import{_ as u,a as w,u as l,o as d,b as f,d as t,w as n,e as r}from"./index.f76e180b.js";import{E as v}from"./el-button.55669a7a.js";class m{constructor(s,e){if(!s)throw new Error("no viewer object!");e=e||{},this.snowSize=Cesium.defaultValue(e.snowSize,.02),this.snowSpeed=Cesium.defaultValue(e.snowSpeed,60),this.viewer=s,this.init()}init(){this.snowStage=new Cesium.PostProcessStage({name:"czm_snow",fragmentShader:this.snow(),uniforms:{snowSize:()=>this.snowSize,snowSpeed:()=>this.snowSpeed}}),this.viewer.scene.postProcessStages.add(this.snowStage)}destroy(){if(!this.viewer||!this.snowStage)return;this.viewer.scene.postProcessStages.remove(this.snowStage),this.snowStage.isDestroyed()||this.snowStage.destroy(),delete this.snowSize,delete this.snowSpeed}show(s){this.snowStage.enabled=s}snow(){return`uniform sampler2D colorTexture;
          in vec2 v_textureCoordinates;
          uniform float snowSpeed;
                  uniform float snowSize;
          float snow(vec2 uv,float scale)
          {
              float time=czm_frameNumber/snowSpeed;
              float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
              uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
              uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
              p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
              k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);
              return k*w;
          }
          out vec4 fragColor;
          void main(void){
              vec2 resolution=czm_viewport.zw;
              vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
              vec3 finalColor=vec3(0);
              //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));
              float c=0.;
              c+=snow(uv,30.)*.0;
              c+=snow(uv,20.)*.0;
              c+=snow(uv,15.)*.0;
              c+=snow(uv,10.);
              c+=snow(uv,8.);
              c+=snow(uv,6.);
              c+=snow(uv,5.);
              finalColor=(vec3(c));
              fragColor=mix(texture(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);
              }
              `}}const _={class:"container"},p={__name:"snow",setup(i){w(()=>{e.destroy()});const s=l(),e=new m(s.state.viewer,{snowSize:.02,snowSpeed:60}),a=()=>{e.show(!1)},c=()=>{e.show(!0)};return(h,S)=>{const o=v;return d(),f("div",_,[t(o,{type:"primary",onClick:c},{default:n(()=>[r("\u5F00\u59CB")]),_:1}),t(o,{type:"primary",onClick:a},{default:n(()=>[r("\u505C\u6B62")]),_:1})])}}},x=u(p,[["__scopeId","data-v-496d0740"]]);export{x as default};
