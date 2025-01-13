import{_ as w,a as l,u as d,o as f,b as v,d as n,w as r,e as i}from"./index.bc967ea1.js";import{E as m}from"./el-button.3d1567a4.js";class p{constructor(s,e){if(!s)throw new Error("no viewer object!");e=e||{},this.snowSize=Cesium.defaultValue(e.snowSize,.02),this.snowSpeed=Cesium.defaultValue(e.snowSpeed,60),this.viewer=s,this.init()}init(){this.snowStage=new Cesium.PostProcessStage({name:"czm_snow",fragmentShader:this.snow(),uniforms:{snowSize:()=>this.snowSize,snowSpeed:()=>this.snowSpeed}}),this.viewer.scene.postProcessStages.add(this.snowStage)}destroy(){if(!this.viewer||!this.snowStage)return;this.viewer.scene.postProcessStages.remove(this.snowStage),this.snowStage.isDestroyed()||this.snowStage.destroy(),delete this.snowSize,delete this.snowSpeed}show(s){this.snowStage.enabled=s}snow(){return`uniform sampler2D colorTexture;
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
              `}}const _={class:"container"},S={__name:"snow",setup(a){l(()=>{e.destroy()});const s=d(),e=new p(s.state.viewer,{snowSize:.02,snowSpeed:60}),c=()=>{e.show(!1)},u=()=>{e.show(!0)};return(h,o)=>{const t=m;return f(),v("div",_,[n(t,{type:"primary",onClick:u},{default:r(()=>o[0]||(o[0]=[i("\u5F00\u59CB")])),_:1}),n(t,{type:"primary",onClick:c},{default:r(()=>o[1]||(o[1]=[i("\u505C\u6B62")])),_:1})])}}},x=w(S,[["__scopeId","data-v-cadedcd2"]]);export{x as default};
