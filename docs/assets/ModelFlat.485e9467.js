var v=Object.defineProperty;var x=(d,t,e)=>t in d?v(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var p=(d,t,e)=>(x(d,typeof t!="symbol"?t+"":t,e),e);import{_ as S}from"./OperateBox.0986405a.js";import{h as C,a as w,o as M,c as b,w as m,X as _,d as g,u as y,k as T,e as E}from"./index.fe5814f1.js";import{E as D}from"./el-button.af2fec77.js";import{E as P}from"./el-input.8edf05c7.js";import{D as $}from"./drawGraphic.773e8670.js";import{P as R}from"./PlanishArea.3e6fd96f.js";class V{constructor(t){p(this,"_tileset");p(this,"_matrix");p(this,"_localMatrix");p(this,"_polygonEdits");this._tileset=t;const e=t.boundingSphere.center.clone();this._matrix=Cesium.Transforms.eastNorthUpToFixedFrame(e),this._localMatrix=Cesium.Matrix4.inverse(this._matrix,new Cesium.Matrix4),this._polygonEdits=[]}addRegionEditsData(t,e,o=0){for(let l=0;l<this._polygonEdits.length;l++)if(this._polygonEdits[l].uuid===t)return;e.length!==0&&(this._polygonEdits.push({uuid:t,show:!0,polygon:this.cartesiansToLocal(e),height:o}),this.renderShader())}addRegionEditsDataArr(t){t.forEach(e=>{const o=e.uuid,l=e.height,s=e.show;let n=[];e.area.forEach(r=>{n.push(new Cesium.Cartesian3(r.x,r.y,r.z))});for(let r=0;r<this._polygonEdits.length;r++)if(this._polygonEdits[r].uuid===o)return;n.length!==0&&(this._polygonEdits.push({uuid:o,show:s,polygon:this.cartesiansToLocal(n),height:l}),console.log(this._polygonEdits))}),this.renderShader()}cartesiansToLocal(t){let e=[];for(let o=0;o<t.length;o++){let l=t[o],s=Cesium.Matrix4.multiplyByPoint(this._localMatrix,l.clone(),new Cesium.Cartesian3);e.push([s.x,s.y])}return e}renderShader(){const t=this.getPointInPolygon(this._polygonEdits);let e="";this._polygonEdits.forEach((o,l)=>{if(o.show){const s=l;o.polygon.forEach((n,r)=>{e+=`points_${s}[${r}] = vec2(${n[0]}, ${n[1]});`}),e+=`
          if (isPointInPolygon_${s}(position2D)) {
            float ground_z = float(${o.height});
            vec4 tileset_local_position_transformed = vec4(tileset_local_position.x, tileset_local_position.y, ground_z, 1.0);
            vec4 model_local_position_transformed = czm_inverseModel * u_tileset_localToWorldMatrix * tileset_local_position_transformed;
            vsOutput.positionMC.xyz = model_local_position_transformed.xyz;
            return;
          }

        `}}),this.updateShader(t,e)}getPointInPolygon(t){let e="";return t.forEach((o,l)=>{if(o.show){const s=o.polygon.length,n=l;e+=`
        vec2 points_${n}[${s}];
        bool isPointInPolygon_${n} (vec2 point) {
          int nCross = 0; // \u4EA4\u70B9\u6570
          const int n = ${s};

          for (int i = 0; i < n; i++) {
            vec2 p1 = points_${n}[i];
            vec2 p2 = points_${n}[int(mod(float(i+1), float(n)))];
            if (p1[1] == p2[1]) {
              continue;
            }
            if (point[1] < min(p1[1], p2[1])) {
              continue;
            }
            if (point[1] >= max(p1[1], p2[1])) {
              continue;
            }
            float x = p1[0] + ((point[1] - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]);
            if (x > point[0]) {
              nCross++;
            }
          }

          return int(mod(float(nCross), float(2))) == 1;
        }`}}),e}updateShader(t,e){let o=new Cesium.CustomShader({uniforms:{u_tileset_localToWorldMatrix:{type:Cesium.UniformType.MAT4,value:this._matrix},u_tileset_worldToLocalMatrix:{type:Cesium.UniformType.MAT4,value:this._localMatrix}},vertexShaderText:`
        ${t}
        void vertexMain (VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
          vec3 modelMC = vsInput.attributes.positionMC;
          vec4 model_local_position = vec4(modelMC.x, modelMC.y, modelMC.z, 1.0);
          vec4 tileset_local_position = u_tileset_worldToLocalMatrix * czm_model * model_local_position;
          vec2 position2D = vec2(tileset_local_position.x, tileset_local_position.y);
          ${e}
        }`});this._tileset.customShader=o,console.log(o.vertexShaderText)}removeRegionEditsData(t){for(let e=0;e<this._polygonEdits.length;e++)this._polygonEdits[e].uuid===t&&this._polygonEdits.splice(e,1);this.renderShader()}setRegionEditsVisible(t,e){for(let o=0;o<this._polygonEdits.length;o++)this._polygonEdits[o].uuid===t&&(this._polygonEdits[o].show=e);this.renderShader()}setRegionEditsHeight(t,e){for(let o=0;o<this._polygonEdits.length;o++)this._polygonEdits[o].uuid===t&&(this._polygonEdits[o].height=e);this.renderShader()}}const W={__name:"ModelFlat",setup(d){const{viewer:t}=window,e=new $(t),o=new R;let l=null,s=C(-10);const n=c=>{e.clearAll(),r();const i=c.polygon.hierarchy.getValue().positions;o.name="\u6D4B\u8BD5",o.area=i,o.height=s.value,l.addRegionEditsDataArr([o])},r=()=>{l.removeRegionEditsData(o.uuid),e.clearAll()};return(()=>{let c=Cesium.Cartesian3.fromArray([0,0,0]),h={url:"http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",modelMatrix:Cesium.Matrix4.fromTranslation(c),show:!0,skipLevelOfDetail:!0,baseScreenSpaceError:1024,maximumScreenSpaceError:32,skipScreenSpaceErrorFactor:16,skipLevels:1,immediatelyLoadDesiredLevelOfDetail:!1,loadSiblings:!1,cullWithChildrenBounds:!1,cullRequestsWhileMoving:!1,cullRequestsWhileMovingMultiplier:10,preloadWhenHidden:!0,preloadFlightDestinations:!0,preferLeaves:!0,maximumMemoryUsage:2048,progressiveResolutionHeightFraction:.5,dynamicScreenSpaceErrorDensity:10,dynamicScreenSpaceErrorFactor:1,dynamicScreenSpaceErrorHeightFalloff:.25,foveatedScreenSpaceError:!0,foveatedConeSize:.1,foveatedMinimumScreenSpaceErrorRelaxation:0,luminanceAtZenith:.2,backFaceCulling:!0,debugFreezeFrame:!1,debugColorizeTiles:!1,debugWireframe:!1,debugShowBoundingVolume:!1,debugShowContentBoundingVolume:!1,debugShowViewerRequestVolume:!1,debugShowGeometricError:!1,debugShowRenderingStatistics:!1,debugShowMemoryUsage:!1,debugShowUrl:!1,dynamicScreenSpaceError:!0};const u=new Cesium.Cesium3DTileset(h);t.flyTo(u),u.readyPromise.then(function(a){t.scene.primitives.add(a)}).catch(function(a){console.log(a)}),u.allTilesLoaded.addEventListener(function(){console.log("\u6A21\u578B\u5DF2\u7ECF\u5168\u90E8\u52A0\u8F7D\u5B8C\u6210"),l=new V(u)})})(),w(()=>{e.clearAll(),r()}),(c,i)=>{const f=P,h=D,u=S;return M(),b(u,null,{default:m(()=>[i[5]||(i[5]=_("div",{style:{"background-color":"red",color:"aliceblue"}}," \u6CE8\u610F\uFF1A\u5982\u679C\u4ECE\u5730\u5F62\u538B\u5E73\u8DF3\u8F6C\u8FC7\u6765\u9700\u8981\u624B\u52A8\u5237\u65B0\u4E00\u4E0B\u9875\u9762\uFF0C\u5426\u5219\u538B\u5E73\u6548\u679C\u53EF\u80FD\u4E0D\u751F\u6548 ",-1)),i[6]||(i[6]=_("div",{style:{color:"aliceblue"}}," \u9AD8\u5EA6\u8BBE\u7F6E(\u7531\u4E8E\u6D77\u62D4\u539F\u56E0\u9AD8\u5EA6\u4E3A0\u4E0D\u4E00\u5B9A\u53EF\u4EE5\u8FBE\u5230\u538B\u5E73\u6548\u679C,\u53EF\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u8C03\u8282\u9AD8\u5EA6) ",-1)),g(f,{label:"\u9AD8\u5EA6\u8BBE\u7F6E",type:"number",modelValue:y(s),"onUpdate:modelValue":i[0]||(i[0]=a=>T(s)?s.value=a:s=a),style:{width:"100px"}},null,8,["modelValue"]),g(h,{type:"primary",onClick:i[1]||(i[1]=a=>y(e).activate("Polygon",n))},{default:m(()=>i[3]||(i[3]=[E("\u5F00\u59CB\u7ED8\u5236")])),_:1}),g(h,{type:"primary",onClick:i[2]||(i[2]=a=>r())},{default:m(()=>i[4]||(i[4]=[E("\u6E05\u9664")])),_:1})]),_:1})}}};export{W as default};
