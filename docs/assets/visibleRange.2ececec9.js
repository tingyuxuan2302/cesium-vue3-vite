import{l as w}from"./latlng.6bf76edf.js";import{az as C,o as v,b as p}from"./index.76f76e18.js";class f{constructor(e){this._viewer=e,this.BEYONANALYSER_STATE={PREPARE:0,OPERATING:1,END:2},this.init()}init(){this.handler=new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas)}showTip(e,i,t,o,s){if(e.show=i,i&&(t&&(e.position=t),o&&(e.label.text=o),s))for(let a in s)e.key&&(e.key=s[a])}getIntersectObj(e,i,t=[],o=!1){var s=this._viewer,a=Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(i,e,new Cesium.Cartesian3),new Cesium.Cartesian3),r=new Cesium.Ray(e,a),n=[];if(o)n=s.scene.drillPickFromRay(r,10,t);else{var h=s.scene.pickFromRay(r,t);Cesium.defined(h)&&(n=[h])}return n}}class g extends f{constructor(e,i){super(e),this.viewer=e,this.viewPosition=i.viewPosition,this.viewPositionEnd=i.viewPositionEnd,this.viewDistance=this.viewPositionEnd?Cesium.Cartesian3.distance(this.viewPosition,this.viewPositionEnd):i.viewDistance||100,this.viewHeading=this.viewPositionEnd?c(this.viewPosition,this.viewPositionEnd):i.viewHeading||0,this.viewPitch=this.viewPositionEnd?u(this.viewPosition,this.viewPositionEnd):i.viewPitch||0,this.horizontalViewAngle=i.horizontalViewAngle||90,this.verticalViewAngle=i.verticalViewAngle||60,this.visibleAreaColor=i.visibleAreaColor||Cesium.Color.GREEN,this.invisibleAreaColor=i.invisibleAreaColor||Cesium.Color.RED,this.enabled=typeof i.enabled=="boolean"?i.enabled:!0,this.softShadows=typeof i.softShadows=="boolean"?i.softShadows:!0,this.size=i.size||2048,this.options=i,this.id=Cesium.createGuid(),this._resultTip=this.viewer.entities.add({id:this.id,label:{fillColor:Cesium.Color.YELLOW,showBackground:!0,font:"14px monospace",horizontalOrigin:Cesium.HorizontalOrigin.LEFT,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,pixelOffset:new Cesium.Cartesian2(0,-10)}}),this.posArray=[],this._markers=[],this.state=this.BEYONANALYSER_STATE.PREPARE,this.action()}action(){let e=this;var i=this.viewer.scene.globe.ellipsoid;e.handler.setInputAction(function(o){var s=w.getCurrentMousePosition(e.viewer.scene,o.position);if(e._markers.length==0){var a=Cesium.Cartographic.fromCartesian(s),r;e.options.qdOffset?r=a.height+e.options.qdOffset:r=a.height+1;var n=Cesium.Cartographic.fromDegrees(a.longitude/Math.PI*180,a.latitude/Math.PI*180,r);s=i.cartographicToCartesian(n)}else if(e._markers.length==1){var a=Cesium.Cartographic.fromCartesian(s),r;e.options.zdOffset?r=a.height+e.options.qdOffset:r=a.height+1;var n=Cesium.Cartographic.fromDegrees(a.longitude/Math.PI*180,a.latitude/Math.PI*180,r);s=i.cartographicToCartesian(n)}if(!!s){if(e.posArray.push(s),e._markers.length==0){var h=e.viewer.entities.add({position:s,ellipsoid:{radii:new Cesium.Cartesian3(1,1,1),material:Cesium.Color.BLUE},label:{text:"\u89C6\u7EBF\u8D77\u70B9",fillColor:Cesium.Color.YELLOW,pixelOffset:{x:0,y:-20},scale:.5}});e._markers.push(h),e.state=e.BEYONANALYSER_STATE.OPERATING}else if(e._markers.length==1){var m=e.viewer.entities.add({position:s,ellipsoid:{radii:new Cesium.Cartesian3(1,1,1),material:Cesium.Color.RED},label:{text:"\u89C6\u7EBF\u7EC8\u70B9",fillColor:Cesium.Color.YELLOW,pixelOffset:{x:0,y:-20},scale:.5}});e._markers.push(m),e.viewPosition=e.posArray[0],e.viewPositionEnd=s,e.viewDistance=e.viewPositionEnd?Cesium.Cartesian3.distance(e.viewPosition,e.viewPositionEnd):e.options.viewDistance||100,e.viewHeading=e.viewPositionEnd?c(e.viewPosition,e.viewPositionEnd):e.options.viewHeading||0,e.viewPitch=e.viewPositionEnd?u(e.viewPosition,e.viewPositionEnd):e.options.viewPitch||0,e.state=e.BEYONANALYSER_STATE.END,e.handler.destroy(),e.handler=null,e.remove(),e.update()}}},Cesium.ScreenSpaceEventType.LEFT_CLICK);var t;e.handler.setInputAction(function(o){var s=e.viewer.scene.pickPosition(o.endPosition);e.state===e.BEYONANALYSER_STATE.PREPARE?(t="\u70B9\u51FB\u8BBE\u5B9A\u8D77\u70B9",e.showTip(e._resultTip,!0,s,t)):e.state===e.BEYONANALYSER_STATE.OPERATING&&(t="\u70B9\u51FB\u8BBE\u5B9A\u7EC8\u70B9",e.showTip(e._resultTip,!0,s,t))},Cesium.ScreenSpaceEventType.MOUSE_MOVE)}remove(){if(this._markers.length==0)return!1;for(let i=0;i<this._markers.length;i++){var e=this._markers[i];this.viewer.entities.remove(e)}this._markers.length=0,this.viewer.entities.remove(this._resultTip),this._resultTip=void 0}add(){this.createLightCamera(),this.createShadowMap(),this.createPostStage(),this.drawFrustumOutline(),this.drawSketch()}update(){this.clear(),this.add()}clear(){this.sketch&&(this.viewer.entities.removeById(this.sketch.id),this.sketch=null),this.frustumOutline&&(this.frustumOutline.destroy(),this.frustumOutline=null),this.postStage&&(this.viewer.scene.postProcessStages.remove(this.postStage),this.postStage=null)}createLightCamera(){this.lightCamera=new Cesium.Camera(this.viewer.scene),this.lightCamera.position=this.viewPosition,this.lightCamera.frustum.near=this.viewDistance*.001,this.lightCamera.frustum.far=this.viewDistance;const e=Cesium.Math.toRadians(this.horizontalViewAngle),i=Cesium.Math.toRadians(this.verticalViewAngle),t=this.viewDistance*Math.tan(e/2)*2/(this.viewDistance*Math.tan(i/2)*2);this.lightCamera.frustum.aspectRatio=t,e>i?this.lightCamera.frustum.fov=e:this.lightCamera.frustum.fov=i,this.lightCamera.setView({destination:this.viewPosition,orientation:{heading:Cesium.Math.toRadians(this.viewHeading||0),pitch:Cesium.Math.toRadians(this.viewPitch||0),roll:0}})}createShadowMap(){this.shadowMap=new Cesium.ShadowMap({context:this.viewer.scene.context,lightCamera:this.lightCamera,enabled:this.enabled,isPointLight:!0,pointLightRadius:this.viewDistance,cascadesEnabled:!1,size:this.size,softShadows:this.softShadows,normalOffset:!1,fromLightSource:!1}),this.viewer.scene.shadowMap=this.shadowMap}createPostStage(){const e=`
      #define USE_CUBE_MAP_SHADOW true
      uniform sampler2D colorTexture;
      uniform sampler2D depthTexture;
      in vec2 v_textureCoordinates;
      uniform mat4 camera_projection_matrix;
      uniform mat4 camera_view_matrix;
      uniform samplerCube shadowMap_textureCube;
      uniform mat4 shadowMap_matrix;
      uniform vec4 shadowMap_lightPositionEC;
      uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
      uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;
      uniform float helsing_viewDistance; 
      uniform vec4 helsing_visibleAreaColor;
      uniform vec4 helsing_invisibleAreaColor;
      struct zx_shadowParameters
      {
          vec3 texCoords;
          float depthBias;
          float depth;
          float nDotL;
          vec2 texelStepSize;
          float normalShadingSmooth;
          float darkness;
      };
      float czm_shadowVisibility(samplerCube shadowMap, zx_shadowParameters shadowParameters)
      {
          float depthBias = shadowParameters.depthBias;
          float depth = shadowParameters.depth;
          float nDotL = shadowParameters.nDotL;
          float normalShadingSmooth = shadowParameters.normalShadingSmooth;
          float darkness = shadowParameters.darkness;
          vec3 uvw = shadowParameters.texCoords;
          depth -= depthBias;
          float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
          return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
      }
      vec4 getPositionEC(){
          return czm_windowToEyeCoordinates(gl_FragCoord);
      }
      vec3 getNormalEC(){
          return vec3(1.);
      }
      vec4 toEye( vec2 uv, float depth){
          vec2 xy=vec2((uv.x*2.-1.),(uv.y*2.-1.));
          vec4 posInCamera=czm_inverseProjection*vec4(xy,depth,1.);
          posInCamera=posInCamera/posInCamera.w;
          return posInCamera;
      }
      vec3 pointProjectOnPlane( vec3 planeNormal, vec3 planeOrigin, vec3 point){
          vec3 v01=point-planeOrigin;
          float d=dot(planeNormal,v01);
          return(point-planeNormal*d);
      }
      float getDepth( vec4 depth){
          float z_window=czm_unpackDepth(depth);
          z_window=czm_reverseLogDepth(z_window);
          float n_range=czm_depthRange.near;
          float f_range=czm_depthRange.far;
          return(2.*z_window-n_range-f_range)/(f_range-n_range);
      }
      float shadow( vec4 positionEC){
          vec3 normalEC=getNormalEC();
          zx_shadowParameters shadowParameters;
          shadowParameters.texelStepSize=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
          shadowParameters.depthBias=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
          shadowParameters.normalShadingSmooth=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
          shadowParameters.darkness=shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
          vec3 directionEC=positionEC.xyz-shadowMap_lightPositionEC.xyz;
          float distance=length(directionEC);
          directionEC=normalize(directionEC);
          float radius=shadowMap_lightPositionEC.w;
          if(distance>radius)
          {
              return 2.0;
          }
          vec3 directionWC=czm_inverseViewRotation*directionEC;
          shadowParameters.depth=distance/radius-0.0003;
          shadowParameters.nDotL=clamp(dot(normalEC,-directionEC),0.,1.);
          shadowParameters.texCoords=directionWC;
          float visibility=czm_shadowVisibility(shadowMap_textureCube,shadowParameters);
          return visibility;
      }
      bool visible( vec4 result)
      {
          result.x/=result.w;
          result.y/=result.w;
          result.z/=result.w;
          return result.x>=-1.&&result.x<=1.
          &&result.y>=-1.&&result.y<=1.
          &&result.z>=-1.&&result.z<=1.;
      }
      void main(){
          // \u91C9\u8272 = \u7ED3\u6784\u4E8C\u7EF4(\u989C\u8272\u7EB9\u7406, \u7EB9\u7406\u5750\u6807)
          out_FragColor = texture(colorTexture, v_textureCoordinates);
          // \u6DF1\u5EA6 = \u83B7\u53D6\u6DF1\u5EA6(\u7ED3\u6784\u4E8C\u7EF4(\u6DF1\u5EA6\u7EB9\u7406, \u7EB9\u7406\u5750\u6807))
          float depth = getDepth(texture(depthTexture, v_textureCoordinates));
          // \u89C6\u89D2 = (\u7EB9\u7406\u5750\u6807, \u6DF1\u5EA6)
          vec4 viewPos = toEye(v_textureCoordinates, depth);
          // \u4E16\u754C\u5750\u6807
          vec4 wordPos = czm_inverseView * viewPos;
          // \u865A\u62DF\u76F8\u673A\u4E2D\u5750\u6807
          vec4 vcPos = camera_view_matrix * wordPos;
          float near = .001 * helsing_viewDistance;
          float dis = length(vcPos.xyz);
          if(dis > near && dis < helsing_viewDistance){
              // \u900F\u89C6\u6295\u5F71
              vec4 posInEye = camera_projection_matrix * vcPos;
              // \u53EF\u89C6\u533A\u989C\u8272
              // vec4 helsing_visibleAreaColor=vec4(0.,1.,0.,.5);
              // vec4 helsing_invisibleAreaColor=vec4(1.,0.,0.,.5);
              if(visible(posInEye)){
                  float vis = shadow(viewPos);
                  if(vis > 0.3){
                      out_FragColor = mix(out_FragColor,helsing_visibleAreaColor,.5);
                  } else{
                      out_FragColor = mix(out_FragColor,helsing_invisibleAreaColor,.5);
                  }
              }
          }
      }`,i=new Cesium.PostProcessStage({fragmentShader:e,uniforms:{shadowMap_textureCube:()=>(this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState")),Reflect.get(this.shadowMap,"_shadowMapTexture")),shadowMap_matrix:()=>(this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState")),Reflect.get(this.shadowMap,"_shadowMapMatrix")),shadowMap_lightPositionEC:()=>(this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState")),Reflect.get(this.shadowMap,"_lightPositionEC")),shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness:()=>{this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState"));const t=this.shadowMap._pointBias;return Cesium.Cartesian4.fromElements(t.normalOffsetScale,this.shadowMap._distance,this.shadowMap.maximumDistance,0,new Cesium.Cartesian4)},shadowMap_texelSizeDepthBiasAndNormalShadingSmooth:()=>{this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState"));const t=this.shadowMap._pointBias,s=new Cesium.Cartesian2;return s.x=1/this.shadowMap._textureSize.x,s.y=1/this.shadowMap._textureSize.y,Cesium.Cartesian4.fromElements(s.x,s.y,t.depthBias,t.normalShadingSmooth,new Cesium.Cartesian4)},camera_projection_matrix:this.lightCamera.frustum.projectionMatrix,camera_view_matrix:this.lightCamera.viewMatrix,helsing_viewDistance:()=>this.viewDistance,helsing_visibleAreaColor:this.visibleAreaColor,helsing_invisibleAreaColor:this.invisibleAreaColor}});this.postStage=this.viewer.scene.postProcessStages.add(i)}drawFrustumOutline(){const e=new Cesium.Cartesian3,i=new Cesium.Matrix3,t=new Cesium.Quaternion;this.lightCamera.positionWC;const o=this.lightCamera.directionWC,s=this.lightCamera.upWC;let a=this.lightCamera.rightWC;a=Cesium.Cartesian3.negate(a,e);let r=i;Cesium.Matrix3.setColumn(r,0,a,r),Cesium.Matrix3.setColumn(r,1,s,r),Cesium.Matrix3.setColumn(r,2,o,r);let n=Cesium.Quaternion.fromRotationMatrix(r,t),h=new Cesium.GeometryInstance({geometry:new Cesium.FrustumOutlineGeometry({frustum:this.lightCamera.frustum,origin:this.viewPosition,orientation:n}),id:Math.random().toString(36).substr(2),attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOWGREEN),show:new Cesium.ShowGeometryInstanceAttribute(!0)}});this.frustumOutline=this.viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:[h],appearance:new Cesium.PerInstanceColorAppearance({flat:!0,translucent:!1})}))}drawSketch(){this.sketch=this.viewer.entities.add({name:"sketch",position:this.viewPosition,orientation:Cesium.Transforms.headingPitchRollQuaternion(this.viewPosition,Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading-this.horizontalViewAngle,this.viewPitch,0)),ellipsoid:{radii:new Cesium.Cartesian3(this.viewDistance,this.viewDistance,this.viewDistance),minimumClock:Cesium.Math.toRadians(-this.horizontalViewAngle/2),maximumClock:Cesium.Math.toRadians(this.horizontalViewAngle/2),minimumCone:Cesium.Math.toRadians(this.verticalViewAngle+7.75),maximumCone:Cesium.Math.toRadians(180-this.verticalViewAngle-7.75),fill:!1,outline:!0,subdivisions:256,stackPartitions:64,slicePartitions:64,outlineColor:Cesium.Color.YELLOWGREEN}})}}function c(l,e){let i=new Cesium.Cartesian3,t=Cesium.Transforms.eastNorthUpToFixedFrame(l);return Cesium.Matrix4.inverse(t,t),Cesium.Matrix4.multiplyByPoint(t,e,i),Cesium.Cartesian3.normalize(i,i),Cesium.Math.toDegrees(Math.atan2(i.x,i.y))}function u(l,e){let i=new Cesium.Cartesian3,t=Cesium.Transforms.eastNorthUpToFixedFrame(l);return Cesium.Matrix4.inverse(t,t),Cesium.Matrix4.multiplyByPoint(t,e,i),Cesium.Cartesian3.normalize(i,i),Cesium.Math.toDegrees(Math.asin(i.z))}const x={__name:"visibleRange",async setup(l){let e,i;const{__viewer:t}=window;t.terrainProvider=([e,i]=C(()=>Cesium.createWorldTerrainAsync({requestVertexNormals:!0})),e=await e,i(),e),t.scene.globe.depthTestAgainstTerrain=!0;var o={qdOffset:2,zdOffset:2};return new g(t,o),(()=>{let a=Cesium.Cartesian3.fromArray([0,0,0]),h={url:"http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",modelMatrix:Cesium.Matrix4.fromTranslation(a),show:!0};const m=new Cesium.Cesium3DTileset(h);t.flyTo(m),m.readyPromise.then(function(d){t.scene.primitives.add(d)}).catch(function(d){console.log(d)}),m.allTilesLoaded.addEventListener(function(){console.log("\u6A21\u578B\u5DF2\u7ECF\u5168\u90E8\u52A0\u8F7D\u5B8C\u6210")})})(),(a,r)=>(v(),p("div"))}};export{x as default};
