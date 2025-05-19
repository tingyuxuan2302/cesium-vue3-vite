var y=Object.defineProperty;var z=(o,e,t)=>e in o?y(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var _=(o,e,t)=>(z(o,typeof e!="symbol"?e+"":e,t),t);import{_ as P}from"./OperateBox.0986405a.js";import{a as E,o as D,c as N,w as p,d as g,e as v}from"./index.fe5814f1.js";import{E as M}from"./el-button.af2fec77.js";import{C as h}from"./constant.b790157a.js";class O{constructor(e){_(this,"viewer");_(this,"lastStageList");this.viewer=e,this.lastStageList=[]}add(e,t,n,a){this.lastStageList.push(this.showCircleScan(e,t,n,a))}clear(){this.lastStageList.forEach(e=>{this.clearScanEffects(e)}),this.lastStageList=[]}showCircleScan(e,t,n,a){const s=new Cesium.Cartographic(Cesium.Math.toRadians(e[0]),Cesium.Math.toRadians(e[1]),e[2]);return t=new Cesium.Color.fromCssColorString(t),this._addCircleScanPostStage(s,n,t,a)}_addCircleScanPostStage(e,t,n,a){const s=Cesium.Cartographic.toCartesian(e),r=new Cesium.Cartesian4(s.x,s.y,s.z,1),u=new Cesium.Cartographic(e.longitude,e.latitude,e.height+500),c=Cesium.Cartographic.toCartesian(u),w=new Cesium.Cartesian4(c.x,c.y,c.z,1),x=new Date().getTime(),d=new Cesium.Cartesian4,S=new Cesium.Cartesian4,i=new Cesium.Cartesian3,m=this,f=new Cesium.PostProcessStage({fragmentShader:m._getScanSegmentShader(),uniforms:{u_scanCenterEC:function(){return Cesium.Matrix4.multiplyByVector(m.viewer.camera._viewMatrix,r,d)},u_scanPlaneNormalEC:function(){const l=Cesium.Matrix4.multiplyByVector(m.viewer.camera._viewMatrix,r,d),C=Cesium.Matrix4.multiplyByVector(m.viewer.camera._viewMatrix,w,S);return i.x=C.x-l.x,i.y=C.y-l.y,i.z=C.z-l.z,Cesium.Cartesian3.normalize(i,i),i},u_radius:function(){return t*((new Date().getTime()-x)%a)/a},u_scanColor:n}});return this.viewer.scene.postProcessStages.add(f),f}_getScanSegmentShader(){return` uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        in vec2 v_textureCoordinates;
        uniform vec4 u_scanCenterEC;
        uniform vec3 u_scanPlaneNormalEC;
        uniform float u_radius;
        uniform vec4 u_scanColor;
        out vec4 fragColor;
        vec4 toEye(in vec2 uv, in float depth){
          vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));
          vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
          posInCamera =posInCamera / posInCamera.w;
          return posInCamera;
        }
        vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){
            vec3 v01 = point - planeOrigin;
            float d = dot(planeNormal, v01) ;
            return (point - planeNormal * d);
        }
        float getDepth(in vec4 depth){
            float z_window = czm_unpackDepth(depth);
            z_window = czm_reverseLogDepth(z_window);
            float n_range = czm_depthRange.near;
            float f_range = czm_depthRange.far;
            return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
        }
        void main(){
          fragColor = texture(colorTexture, v_textureCoordinates);
            float depth = getDepth(texture(depthTexture, v_textureCoordinates));
            vec4 viewPos = toEye(v_textureCoordinates, depth);
            vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
            float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
            if(dis < u_radius){
              float f = 1.0 - abs(u_radius - dis) / u_radius;
              f = pow(f, float(`+18+`));
              fragColor = mix(fragColor,u_scanColor,f);
            }
            fragColor.a = fragColor.a / 2.0;
        }
      `}clearScanEffects(e){this.viewer.scene.postProcessStages.remove(e)}}const j={__name:"diffuse",setup(o){const{viewer:e}=window;e.camera.setView({destination:Cesium.Cartesian3.fromDegrees(...h,1e4)});const t=new O(e,"circle"),n=()=>{t.add([...h,10],"#F7EB08",2e3,5e3)};n();const a=()=>{t.clear()};return E(()=>{a()}),(s,r)=>{const u=M,c=P;return D(),N(c,null,{default:p(()=>[g(u,{type:"primary",onClick:n},{default:p(()=>r[0]||(r[0]=[v("\u6E32\u67D3")])),_:1}),g(u,{type:"primary",onClick:a},{default:p(()=>r[1]||(r[1]=[v("\u6E05\u9664")])),_:1})]),_:1})}}};export{j as default};
