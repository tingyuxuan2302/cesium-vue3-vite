var y=Object.defineProperty;var z=(s,e,t)=>e in s?y(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var p=(s,e,t)=>(z(s,typeof e!="symbol"?e+"":e,t),t);import{_ as P}from"./OperateBox.66cb383c.js";import{u as E,a as D,o as N,c as M,w as f,d as v,e as h}from"./index.bc967ea1.js";import{E as O}from"./el-button.3d1567a4.js";import{C as w}from"./constant.b790157a.js";class T{constructor(e){p(this,"viewer");p(this,"lastStageList");this.viewer=e,this.lastStageList=[]}add(e,t,r,a){this.lastStageList.push(this.showCircleScan(e,t,r,a))}clear(){this.lastStageList.forEach(e=>{this.clearScanEffects(e)}),this.lastStageList=[]}showCircleScan(e,t,r,a){const n=new Cesium.Cartographic(Cesium.Math.toRadians(e[0]),Cesium.Math.toRadians(e[1]),e[2]);return t=new Cesium.Color.fromCssColorString(t),this._addCircleScanPostStage(n,r,t,a)}_addCircleScanPostStage(e,t,r,a){const n=Cesium.Cartographic.toCartesian(e),u=new Cesium.Cartesian4(n.x,n.y,n.z,1),o=new Cesium.Cartographic(e.longitude,e.latitude,e.height+500),i=Cesium.Cartographic.toCartesian(o),C=new Cesium.Cartesian4(i.x,i.y,i.z,1),x=new Date().getTime(),d=new Cesium.Cartesian4,S=new Cesium.Cartesian4,c=new Cesium.Cartesian3,m=this,g=new Cesium.PostProcessStage({fragmentShader:m._getScanSegmentShader(),uniforms:{u_scanCenterEC:function(){return Cesium.Matrix4.multiplyByVector(m.viewer.camera._viewMatrix,u,d)},u_scanPlaneNormalEC:function(){const l=Cesium.Matrix4.multiplyByVector(m.viewer.camera._viewMatrix,u,d),_=Cesium.Matrix4.multiplyByVector(m.viewer.camera._viewMatrix,C,S);return c.x=_.x-l.x,c.y=_.y-l.y,c.z=_.z-l.z,Cesium.Cartesian3.normalize(c,c),c},u_radius:function(){return t*((new Date().getTime()-x)%a)/a},u_scanColor:r}});return this.viewer.scene.postProcessStages.add(g),g}_getScanSegmentShader(){return` uniform sampler2D colorTexture;
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
      `}clearScanEffects(e){this.viewer.scene.postProcessStages.remove(e)}}const k={__name:"diffuse",setup(s){const e=E(),{viewer:t}=e.state;t.camera.setView({destination:Cesium.Cartesian3.fromDegrees(...w,1e4)});const r=new T(t,"circle"),a=()=>{r.add([...w,10],"#F7EB08",2e3,5e3)};a();const n=()=>{r.clear()};return D(()=>{n()}),(u,o)=>{const i=O,C=P;return N(),M(C,null,{default:f(()=>[v(i,{type:"primary",onClick:a},{default:f(()=>o[0]||(o[0]=[h("\u6E32\u67D3")])),_:1}),v(i,{type:"primary",onClick:n},{default:f(()=>o[1]||(o[1]=[h("\u6E05\u9664")])),_:1})]),_:1})}}};export{k as default};
