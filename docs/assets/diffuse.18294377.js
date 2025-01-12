var y=Object.defineProperty;var z=(s,e,t)=>e in s?y(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var _=(s,e,t)=>(z(s,typeof e!="symbol"?e+"":e,t),t);import{_ as P}from"./OperateBox.9c1989a1.js";import{u as E,a as D,o as N,c as M,w as p,d as h,e as v}from"./index.f73e044e.js";import{E as O}from"./el-button.456a72d6.js";import{C as w}from"./constant.61d74d7e.js";class T{constructor(e){_(this,"viewer");_(this,"lastStageList");this.viewer=e,this.lastStageList=[]}add(e,t,r,a){this.lastStageList.push(this.showCircleScan(e,t,r,a))}clear(){this.lastStageList.forEach(e=>{this.clearScanEffects(e)}),this.lastStageList=[]}showCircleScan(e,t,r,a){const n=new Cesium.Cartographic(Cesium.Math.toRadians(e[0]),Cesium.Math.toRadians(e[1]),e[2]);return t=new Cesium.Color.fromCssColorString(t),this._addCircleScanPostStage(n,r,t,a)}_addCircleScanPostStage(e,t,r,a){const n=Cesium.Cartographic.toCartesian(e),c=new Cesium.Cartesian4(n.x,n.y,n.z,1),f=new Cesium.Cartographic(e.longitude,e.latitude,e.height+500),o=Cesium.Cartographic.toCartesian(f),l=new Cesium.Cartesian4(o.x,o.y,o.z,1),x=new Date().getTime(),d=new Cesium.Cartesian4,S=new Cesium.Cartesian4,i=new Cesium.Cartesian3,u=this,g=new Cesium.PostProcessStage({fragmentShader:u._getScanSegmentShader(),uniforms:{u_scanCenterEC:function(){return Cesium.Matrix4.multiplyByVector(u.viewer.camera._viewMatrix,c,d)},u_scanPlaneNormalEC:function(){const m=Cesium.Matrix4.multiplyByVector(u.viewer.camera._viewMatrix,c,d),C=Cesium.Matrix4.multiplyByVector(u.viewer.camera._viewMatrix,l,S);return i.x=C.x-m.x,i.y=C.y-m.y,i.z=C.z-m.z,Cesium.Cartesian3.normalize(i,i),i},u_radius:function(){return t*((new Date().getTime()-x)%a)/a},u_scanColor:r}});return this.viewer.scene.postProcessStages.add(g),g}_getScanSegmentShader(){return` uniform sampler2D colorTexture;
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
      `}clearScanEffects(e){this.viewer.scene.postProcessStages.remove(e)}}const k={__name:"diffuse",setup(s){const e=E(),{viewer:t}=e.state;t.camera.setView({destination:Cesium.Cartesian3.fromDegrees(...w,1e4)});const r=new T(t,"circle"),a=()=>{r.add([...w,10],"#F7EB08",2e3,5e3)};a();const n=()=>{r.clear()};return D(()=>{n()}),(c,f)=>{const o=O,l=P;return N(),M(l,null,{default:p(()=>[h(o,{type:"primary",onClick:a},{default:p(()=>[v("\u6E32\u67D3")]),_:1}),h(o,{type:"primary",onClick:n},{default:p(()=>[v("\u6E05\u9664")]),_:1})]),_:1})}}};export{k as default};
