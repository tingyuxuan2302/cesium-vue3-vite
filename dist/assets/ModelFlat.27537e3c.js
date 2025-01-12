var x=Object.defineProperty;var S=(d,o,e)=>o in d?x(d,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[o]=e;var u=(d,o,e)=>(S(d,typeof o!="symbol"?o+"":o,e),e);import{_ as C}from"./OperateBox.9c1989a1.js";import{u as w,f as M,a as b,o as T,c as D,w as _,d as g,h as y,j as P,e as E,X as v}from"./index.f73e044e.js";import{E as $}from"./el-button.456a72d6.js";import{P as R,E as V}from"./PlanishArea.d1133ab6.js";import{D as z}from"./drawGraphic.823774fb.js";class A{constructor(o){u(this,"_tileset");u(this,"_matrix");u(this,"_localMatrix");u(this,"_polygonEdits");this._tileset=o;const e=o.boundingSphere.center.clone();this._matrix=Cesium.Transforms.eastNorthUpToFixedFrame(e),this._localMatrix=Cesium.Matrix4.inverse(this._matrix,new Cesium.Matrix4),this._polygonEdits=[]}addRegionEditsData(o,e,t=0){for(let i=0;i<this._polygonEdits.length;i++)if(this._polygonEdits[i].uuid===o)return;e.length!==0&&(this._polygonEdits.push({uuid:o,show:!0,polygon:this.cartesiansToLocal(e),height:t}),this.renderShader())}addRegionEditsDataArr(o){o.forEach(e=>{const t=e.uuid,i=e.height,l=e.show;let s=[];e.area.forEach(n=>{s.push(new Cesium.Cartesian3(n.x,n.y,n.z))});for(let n=0;n<this._polygonEdits.length;n++)if(this._polygonEdits[n].uuid===t)return;s.length!==0&&(this._polygonEdits.push({uuid:t,show:l,polygon:this.cartesiansToLocal(s),height:i}),console.log(this._polygonEdits))}),this.renderShader()}cartesiansToLocal(o){let e=[];for(let t=0;t<o.length;t++){let i=o[t],l=Cesium.Matrix4.multiplyByPoint(this._localMatrix,i.clone(),new Cesium.Cartesian3);e.push([l.x,l.y])}return e}renderShader(){const o=this.getPointInPolygon(this._polygonEdits);let e="";this._polygonEdits.forEach((t,i)=>{if(t.show){const l=i;t.polygon.forEach((s,n)=>{e+=`points_${l}[${n}] = vec2(${s[0]}, ${s[1]});`}),e+=`
          if (isPointInPolygon_${l}(position2D)) {
            float ground_z = float(${t.height});
            vec4 tileset_local_position_transformed = vec4(tileset_local_position.x, tileset_local_position.y, ground_z, 1.0);
            vec4 model_local_position_transformed = czm_inverseModel * u_tileset_localToWorldMatrix * tileset_local_position_transformed;
            vsOutput.positionMC.xyz = model_local_position_transformed.xyz;
            return;
          }

        `}}),this.updateShader(o,e)}getPointInPolygon(o){let e="";return o.forEach((t,i)=>{if(t.show){const l=t.polygon.length,s=i;e+=`
        vec2 points_${s}[${l}];
        bool isPointInPolygon_${s} (vec2 point) {
          int nCross = 0; // \u4EA4\u70B9\u6570
          const int n = ${l};

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
        }`});this._tileset.customShader=t,console.log(t.vertexShaderText)}removeRegionEditsData(o){for(let e=0;e<this._polygonEdits.length;e++)this._polygonEdits[e].uuid===o&&this._polygonEdits.splice(e,1);this.renderShader()}setRegionEditsVisible(o,e){for(let t=0;t<this._polygonEdits.length;t++)this._polygonEdits[t].uuid===o&&(this._polygonEdits[t].show=e);this.renderShader()}setRegionEditsHeight(o,e){for(let t=0;t<this._polygonEdits.length;t++)this._polygonEdits[t].uuid===o&&(this._polygonEdits[t].height=e);this.renderShader()}}const L=v("div",{style:{"background-color":"red",color:"aliceblue"}},"\u6CE8\u610F\uFF1A\u5982\u679C\u4ECE\u5730\u5F62\u538B\u5E73\u8DF3\u8F6C\u8FC7\u6765\u9700\u8981\u624B\u52A8\u5237\u65B0\u4E00\u4E0B\u9875\u9762\uFF0C\u5426\u5219\u538B\u5E73\u6548\u679C\u53EF\u80FD\u4E0D\u751F\u6548",-1),F=v("div",{style:{color:"aliceblue"}},"\u9AD8\u5EA6\u8BBE\u7F6E(\u7531\u4E8E\u6D77\u62D4\u539F\u56E0\u9AD8\u5EA6\u4E3A0\u4E0D\u4E00\u5B9A\u53EF\u4EE5\u8FBE\u5230\u538B\u5E73\u6548\u679C,\u53EF\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u8C03\u8282\u9AD8\u5EA6)",-1),N={__name:"ModelFlat",setup(d){const o=w(),{viewer:e}=o.state,t=new z(e),i=new R;let l=null,s=M(-10);const n=p=>{t.clearAll(),m();const r=p.polygon.hierarchy.getValue().positions;i.name="\u6D4B\u8BD5",i.area=r,i.height=s.value,l.addRegionEditsDataArr([i])},m=()=>{l.removeRegionEditsData(i.uuid),t.clearAll()};return(()=>{let p=Cesium.Cartesian3.fromArray([0,0,0]),h={url:"http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",modelMatrix:Cesium.Matrix4.fromTranslation(p),show:!0,skipLevelOfDetail:!0,baseScreenSpaceError:1024,maximumScreenSpaceError:32,skipScreenSpaceErrorFactor:16,skipLevels:1,immediatelyLoadDesiredLevelOfDetail:!1,loadSiblings:!1,cullWithChildrenBounds:!1,cullRequestsWhileMoving:!1,cullRequestsWhileMovingMultiplier:10,preloadWhenHidden:!0,preloadFlightDestinations:!0,preferLeaves:!0,maximumMemoryUsage:2048,progressiveResolutionHeightFraction:.5,dynamicScreenSpaceErrorDensity:10,dynamicScreenSpaceErrorFactor:1,dynamicScreenSpaceErrorHeightFalloff:.25,foveatedScreenSpaceError:!0,foveatedConeSize:.1,foveatedMinimumScreenSpaceErrorRelaxation:0,luminanceAtZenith:.2,backFaceCulling:!0,debugFreezeFrame:!1,debugColorizeTiles:!1,debugWireframe:!1,debugShowBoundingVolume:!1,debugShowContentBoundingVolume:!1,debugShowViewerRequestVolume:!1,debugShowGeometricError:!1,debugShowRenderingStatistics:!1,debugShowMemoryUsage:!1,debugShowUrl:!1,dynamicScreenSpaceError:!0};const c=new Cesium.Cesium3DTileset(h);e.flyTo(c),c.readyPromise.then(function(a){e.scene.primitives.add(a)}).catch(function(a){console.log(a)}),c.allTilesLoaded.addEventListener(function(){console.log("\u6A21\u578B\u5DF2\u7ECF\u5168\u90E8\u52A0\u8F7D\u5B8C\u6210"),l=new A(c)})})(),b(()=>{t.clearAll(),m()}),(p,r)=>{const f=V,h=$,c=C;return T(),D(c,null,{default:_(()=>[L,F,g(f,{label:"\u9AD8\u5EA6\u8BBE\u7F6E",type:"number",modelValue:y(s),"onUpdate:modelValue":r[0]||(r[0]=a=>P(s)?s.value=a:s=a),style:{width:"100px"}},null,8,["modelValue"]),g(h,{type:"primary",onClick:r[1]||(r[1]=a=>y(t).activate("Polygon",n))},{default:_(()=>[E("\u5F00\u59CB\u7ED8\u5236")]),_:1}),g(h,{type:"primary",onClick:r[2]||(r[2]=a=>m())},{default:_(()=>[E("\u6E05\u9664")]),_:1})]),_:1})}}};export{N as default};
