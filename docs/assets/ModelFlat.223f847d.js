var x=Object.defineProperty;var S=(d,o,e)=>o in d?x(d,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[o]=e;var p=(d,o,e)=>(S(d,typeof o!="symbol"?o+"":o,e),e);import{_ as C}from"./OperateBox.66cb383c.js";import{u as w,j as M,a as b,o as T,c as D,w as g,Y as y,d as _,h as E,l as P,e as v}from"./index.bc967ea1.js";import{E as $}from"./el-button.3d1567a4.js";import{P as R,E as V}from"./PlanishArea.ac3bd86f.js";import{D as z}from"./drawGraphic.773e8670.js";class A{constructor(o){p(this,"_tileset");p(this,"_matrix");p(this,"_localMatrix");p(this,"_polygonEdits");this._tileset=o;const e=o.boundingSphere.center.clone();this._matrix=Cesium.Transforms.eastNorthUpToFixedFrame(e),this._localMatrix=Cesium.Matrix4.inverse(this._matrix,new Cesium.Matrix4),this._polygonEdits=[]}addRegionEditsData(o,e,t=0){for(let i=0;i<this._polygonEdits.length;i++)if(this._polygonEdits[i].uuid===o)return;e.length!==0&&(this._polygonEdits.push({uuid:o,show:!0,polygon:this.cartesiansToLocal(e),height:t}),this.renderShader())}addRegionEditsDataArr(o){o.forEach(e=>{const t=e.uuid,i=e.height,n=e.show;let s=[];e.area.forEach(r=>{s.push(new Cesium.Cartesian3(r.x,r.y,r.z))});for(let r=0;r<this._polygonEdits.length;r++)if(this._polygonEdits[r].uuid===t)return;s.length!==0&&(this._polygonEdits.push({uuid:t,show:n,polygon:this.cartesiansToLocal(s),height:i}),console.log(this._polygonEdits))}),this.renderShader()}cartesiansToLocal(o){let e=[];for(let t=0;t<o.length;t++){let i=o[t],n=Cesium.Matrix4.multiplyByPoint(this._localMatrix,i.clone(),new Cesium.Cartesian3);e.push([n.x,n.y])}return e}renderShader(){const o=this.getPointInPolygon(this._polygonEdits);let e="";this._polygonEdits.forEach((t,i)=>{if(t.show){const n=i;t.polygon.forEach((s,r)=>{e+=`points_${n}[${r}] = vec2(${s[0]}, ${s[1]});`}),e+=`
          if (isPointInPolygon_${n}(position2D)) {
            float ground_z = float(${t.height});
            vec4 tileset_local_position_transformed = vec4(tileset_local_position.x, tileset_local_position.y, ground_z, 1.0);
            vec4 model_local_position_transformed = czm_inverseModel * u_tileset_localToWorldMatrix * tileset_local_position_transformed;
            vsOutput.positionMC.xyz = model_local_position_transformed.xyz;
            return;
          }

        `}}),this.updateShader(o,e)}getPointInPolygon(o){let e="";return o.forEach((t,i)=>{if(t.show){const n=t.polygon.length,s=i;e+=`
        vec2 points_${s}[${n}];
        bool isPointInPolygon_${s} (vec2 point) {
          int nCross = 0; // \u4EA4\u70B9\u6570
          const int n = ${n};

          for (int i = 0; i < n; i++) {
            vec2 p1 = points_${s}[i];
            vec2 p2 = points_${s}[int(mod(float(i+1), float(n)))];
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
        }`}}),e}updateShader(o,e){let t=new Cesium.CustomShader({uniforms:{u_tileset_localToWorldMatrix:{type:Cesium.UniformType.MAT4,value:this._matrix},u_tileset_worldToLocalMatrix:{type:Cesium.UniformType.MAT4,value:this._localMatrix}},vertexShaderText:`
        ${o}
        void vertexMain (VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
          vec3 modelMC = vsInput.attributes.positionMC;
          vec4 model_local_position = vec4(modelMC.x, modelMC.y, modelMC.z, 1.0);
          vec4 tileset_local_position = u_tileset_worldToLocalMatrix * czm_model * model_local_position;
          vec2 position2D = vec2(tileset_local_position.x, tileset_local_position.y);
          ${e}
        }`});this._tileset.customShader=t,console.log(t.vertexShaderText)}removeRegionEditsData(o){for(let e=0;e<this._polygonEdits.length;e++)this._polygonEdits[e].uuid===o&&this._polygonEdits.splice(e,1);this.renderShader()}setRegionEditsVisible(o,e){for(let t=0;t<this._polygonEdits.length;t++)this._polygonEdits[t].uuid===o&&(this._polygonEdits[t].show=e);this.renderShader()}setRegionEditsHeight(o,e){for(let t=0;t<this._polygonEdits.length;t++)this._polygonEdits[t].uuid===o&&(this._polygonEdits[t].height=e);this.renderShader()}}const O={__name:"ModelFlat",setup(d){const o=w(),{viewer:e}=o.state,t=new z(e),i=new R;let n=null,s=M(-10);const r=c=>{t.clearAll(),m();const l=c.polygon.hierarchy.getValue().positions;i.name="\u6D4B\u8BD5",i.area=l,i.height=s.value,n.addRegionEditsDataArr([i])},m=()=>{n.removeRegionEditsData(i.uuid),t.clearAll()};return(()=>{let c=Cesium.Cartesian3.fromArray([0,0,0]),h={url:"http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",modelMatrix:Cesium.Matrix4.fromTranslation(c),show:!0,skipLevelOfDetail:!0,baseScreenSpaceError:1024,maximumScreenSpaceError:32,skipScreenSpaceErrorFactor:16,skipLevels:1,immediatelyLoadDesiredLevelOfDetail:!1,loadSiblings:!1,cullWithChildrenBounds:!1,cullRequestsWhileMoving:!1,cullRequestsWhileMovingMultiplier:10,preloadWhenHidden:!0,preloadFlightDestinations:!0,preferLeaves:!0,maximumMemoryUsage:2048,progressiveResolutionHeightFraction:.5,dynamicScreenSpaceErrorDensity:10,dynamicScreenSpaceErrorFactor:1,dynamicScreenSpaceErrorHeightFalloff:.25,foveatedScreenSpaceError:!0,foveatedConeSize:.1,foveatedMinimumScreenSpaceErrorRelaxation:0,luminanceAtZenith:.2,backFaceCulling:!0,debugFreezeFrame:!1,debugColorizeTiles:!1,debugWireframe:!1,debugShowBoundingVolume:!1,debugShowContentBoundingVolume:!1,debugShowViewerRequestVolume:!1,debugShowGeometricError:!1,debugShowRenderingStatistics:!1,debugShowMemoryUsage:!1,debugShowUrl:!1,dynamicScreenSpaceError:!0};const u=new Cesium.Cesium3DTileset(h);e.flyTo(u),u.readyPromise.then(function(a){e.scene.primitives.add(a)}).catch(function(a){console.log(a)}),u.allTilesLoaded.addEventListener(function(){console.log("\u6A21\u578B\u5DF2\u7ECF\u5168\u90E8\u52A0\u8F7D\u5B8C\u6210"),n=new A(u)})})(),b(()=>{t.clearAll(),m()}),(c,l)=>{const f=V,h=$,u=C;return T(),D(u,null,{default:g(()=>[l[5]||(l[5]=y("div",{style:{"background-color":"red",color:"aliceblue"}},"\u6CE8\u610F\uFF1A\u5982\u679C\u4ECE\u5730\u5F62\u538B\u5E73\u8DF3\u8F6C\u8FC7\u6765\u9700\u8981\u624B\u52A8\u5237\u65B0\u4E00\u4E0B\u9875\u9762\uFF0C\u5426\u5219\u538B\u5E73\u6548\u679C\u53EF\u80FD\u4E0D\u751F\u6548",-1)),l[6]||(l[6]=y("div",{style:{color:"aliceblue"}},"\u9AD8\u5EA6\u8BBE\u7F6E(\u7531\u4E8E\u6D77\u62D4\u539F\u56E0\u9AD8\u5EA6\u4E3A0\u4E0D\u4E00\u5B9A\u53EF\u4EE5\u8FBE\u5230\u538B\u5E73\u6548\u679C,\u53EF\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u8C03\u8282\u9AD8\u5EA6)",-1)),_(f,{label:"\u9AD8\u5EA6\u8BBE\u7F6E",type:"number",modelValue:E(s),"onUpdate:modelValue":l[0]||(l[0]=a=>P(s)?s.value=a:s=a),style:{width:"100px"}},null,8,["modelValue"]),_(h,{type:"primary",onClick:l[1]||(l[1]=a=>E(t).activate("Polygon",r))},{default:g(()=>l[3]||(l[3]=[v("\u5F00\u59CB\u7ED8\u5236")])),_:1}),_(h,{type:"primary",onClick:l[2]||(l[2]=a=>m())},{default:g(()=>l[4]||(l[4]=[v("\u6E05\u9664")])),_:1})]),_:1})}}};export{O as default};
