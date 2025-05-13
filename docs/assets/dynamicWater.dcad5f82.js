import{G as D}from"./dat.gui.module.6914edc7.js";import{az as E,o as z,b as S}from"./index.76f76e18.js";const I=`
        uniform sampler2D heightMap;
        uniform float heightScale;
        uniform float maxElevation;
        uniform float minElevation;
        uniform sampler2D iChannel0;
        uniform float iTime;

        uniform float coast2water_fadedepth;
        uniform float large_waveheight; // change to adjust the "heavy" waves
        uniform float large_wavesize;  // factor to adjust the large wave size
        uniform float small_waveheight;  // change to adjust the small random waves
        uniform float small_wavesize;   // factor to ajust the small wave size
        uniform float water_softlight_fact;  // range [1..200] (should be << smaller than glossy-fact)
        uniform float water_glossylight_fact; // range [1..200]
        uniform float particle_amount;
        uniform float WATER_LEVEL; // Water level (range: 0.0 - 2.0)
        vec3 watercolor = vec3(0.0, 0.60, 0.66); // 'transparent' low-water color (RGB)
        vec3 watercolor2 = vec3(0.0,0.0,0.5); // deep-water color (RGB, should be darker than the low-water color)
        vec3 water_specularcolor = vec3(1.3, 1.3, 0.9);    // specular Color (RGB) of the water-highlights
        vec3 light;

        // calculate random value
        float hash(float n) {
            return fract(sin(n) * 43758.5453123);
        }

        // 2d noise function
        float noise1(in vec2 x) {
            vec2 p = floor(x);
            vec2 f = smoothstep(0.0, 1.0, fract(x));
            float n = p.x + p.y * 57.0;
            return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
        }

        float noise(vec2 p) {
            return textureLod(iChannel0, p * vec2(1. / 256.), 0.0).x;
        }

        float height_map(vec2 p) {
            float f = texture(heightMap,p).r;
            return clamp(f, 0., 10.);
        }

        const mat2 m = mat2(0.72, -1.60, 1.60, 0.72);

        float water_map(vec2 p, float height) {
            vec2 p2 = p * large_wavesize;
            vec2 shift1 = 0.001 * vec2(iTime * 160.0 * 2.0, iTime * 120.0 * 2.0);
            vec2 shift2 = 0.001 * vec2(iTime * 190.0 * 2.0, -iTime * 130.0 * 2.0);

        // coarse crossing 'ocean' waves...
            float f = 0.6000 * noise(p);
            f += 0.2500 * noise(p * m);
            f += 0.1666 * noise(p * m * m);
            float wave = sin(p2.x * 0.622 + p2.y * 0.622 + shift2.x * 4.269) * large_waveheight * f * height * height;

            p *= small_wavesize;
            f = 0.;
            float amp = 1.0, s = .5;
            for(int i = 0; i < 9; i++) {
                p = m * p * .947;
                f -= amp * abs(sin((noise(p + shift1 * s) - .5) * 2.));
                amp = amp * .59;
                s *= -1.329;
            }

            return wave + f * small_waveheight;
        }

        float nautic(vec2 p) {
            p *= 18.;
            float f = 0.;
            float amp = 1.0, s = .5;
            for(int i = 0; i < 3; i++) {
                p = m * p * 1.2;
                f += amp * abs(smoothstep(0., 1., noise(p + iTime * s)) - .5);
                amp = amp * .5;
                s *= -1.227;
            }
            return pow(1. - f, 5.);
        }

        float particles(vec2 p) {
            p *= 200.;
            float f = 0.;
            float amp = 1.0, s = 1.5;
            for(int i = 0; i < 3; i++) {
                p = m * p * 1.2;
                f += amp * noise(p + iTime * s);
                amp = amp * .5;
                s *= -1.227;
            }
            return pow(f * .35, 7.) * particle_amount;
        }

        float test_shadow(vec2 xy, float height) {
            vec3 r0 = vec3(xy, height);
            vec3 rd = normalize(light - r0);

            float hit = 1.0;
            float t = 0.001;
            for(int j = 1; j < 25; j++) {
                vec3 p = r0 + t * rd;
                float h = height_map(p.xy);
                float height_diff = p.z - h;
                if(height_diff < 0.0) {
                    return 0.0;
                }
                t += 0.01 + height_diff * .02;
                hit = min(hit, 2. * height_diff / t); // soft shaddow   
            }
            return hit;
        }
`;class b extends Cesium.Primitive{constructor(e){super(),this.viewer=e.viewer,this.extent=e.extent,this.maxElevation=e.maxElevation,this.minElevation=e.minElevation,this.heightMap=e.canvas,this.noise=e.noise,this.coast2water_fadedepth=.1,this.large_waveheight=.5,this.large_wavesize=4,this.small_waveheight=.9,this.small_wavesize=.12,this.water_softlight_fact=36,this.water_glossylight_fact=120,this.particle_amount=70,this.WATER_LEVEL=.34,this._showLines=!1,this.resolution=Cesium.defaultValue(e.resolution,new Cesium.Cartesian2(1024,1024))}createCommand(e){const t=new Cesium.RectangleGeometry({ellipsoid:Cesium.Ellipsoid.WGS84,rectangle:Cesium.Rectangle.fromDegrees(...this.extent),vertexFormat:Cesium.VertexFormat.POSITION_AND_ST,granularity:Cesium.Math.toRadians(1e-4),height:this.minElevation}),a=Cesium.RectangleGeometry.createGeometry(t),n=Cesium.GeometryPipeline.createAttributeLocations(a),m=Cesium.VertexArray.fromGeometry({context:e,geometry:a,attributeLocations:n}),g=`
        in vec4 position;
        in vec2 st;
        out vec2 v_st;

        const float PI = 3.141592653589793;
        const float earthRadius = 6378137.0; // WGS84 \u692D\u7403\u4F53\u7684\u5E73\u5747\u534A\u5F84
        const float angularVelocity = 180.0 / PI;

        const float RADII_X = 6378137.0;
        const float RADII_Y = 6378137.0;
        const float RADII_Z = 6356752.314245;

        vec3 worldToGeographic(vec3 worldPosition) {
            // \u6B65\u9AA41: \u4E16\u754C\u5750\u6807\u5230ECEF\u5750\u6807
            vec3 ecef = worldPosition;  // \u5047\u8BBE\u4E16\u754C\u5750\u6807\u5DF2\u7ECF\u662FECEF

            // \u6B65\u9AA42: ECEF\u5230\u5730\u7406\u5750\u6807
            float l = length(ecef.xy);
            float e2 = 1.0 - (RADII_Z * RADII_Z) / (RADII_X * RADII_X);
            float u = atan(ecef.z * RADII_X / (l * RADII_Z));
            float lat = atan((ecef.z + e2 * RADII_Z * pow(sin(u), 3.0)) / 
                            (l - e2 * RADII_X * pow(cos(u), 3.0)));
            float lon = atan(ecef.y, ecef.x);
            float N = RADII_X / sqrt(1.0 - e2 * sin(lat) * sin(lat));
            float alt = l / cos(lat) - N;

            // \u5C06\u5F27\u5EA6\u8F6C\u6362\u4E3A\u5EA6
            lat = degrees(lat);
            lon = degrees(lon);

            return vec3(lon, lat, alt);
        }

        vec3 geo2cartesian(vec3 geo){
            float cosLat=cos(geo.y);
            float snX=cosLat*cos(geo.x);
            float snY=cosLat*sin(geo.x);
            float snZ=sin(geo.y);
            vec3 sn=normalize(vec3(snX,snY,snZ));
            vec3 radiiSquared=vec3(40680631.59076899*1000000.,40680631.59076899*1000000.,40408299.98466144*1000000.);
            vec3 sk=radiiSquared*sn;
            float gamma=sqrt(dot(sn,sk));
            sk=sk/gamma;
            sn=sn*geo.z;
            return sk+sn;
        }

        vec3 deg2cartesian(vec3 deg) {
            vec2 radGeo=radians(deg.xy);
            vec3 geo=vec3(radGeo.xy,deg.z);
            return geo2cartesian(geo);
        }

        void main() {
            float normalizedHeight = 0.0;

            vec2 uv = st;
            float deepwater_fadedepth = 0.5 + coast2water_fadedepth;

            float height = height_map(uv);
            vec3 col;

            float waveheight = clamp(WATER_LEVEL * 3. - 1.5, 0., 1.);
            float level = WATER_LEVEL + .2 * water_map(uv * 15. + vec2(iTime * .1), waveheight);

            if(height <= level) {
                normalizedHeight = level;
            }else{
                normalizedHeight = height; // \u51CF\u5C11\u8FB9\u7F18\u62C9\u4F38\u7684\u5272\u88C2\u611F
            }

            float heightOffset = (maxElevation - minElevation) * normalizedHeight;
            
            // \u5C06\u9876\u70B9\u4F4D\u7F6E\u4ECE\u6A21\u578B\u7A7A\u95F4\u8F6C\u6362\u5230\u4E16\u754C\u7A7A\u95F4
            vec4 worldPosition = czm_model * position;
            
            // \u5C06\u4E16\u754C\u5750\u6807\u8F6C\u6362\u4E3A\u7ECF\u7EAC\u5EA6\u548C\u9AD8\u5EA6
            vec3 llh = worldToGeographic(worldPosition.xyz);
            
            // \u5C06\u8C03\u6574\u540E\u7684\u7ECF\u7EAC\u5EA6\u548C\u9AD8\u5EA6\u8F6C\u6362\u56DE\u7B1B\u5361\u5C14\u5750\u6807
            vec3 adjustedCartesian = deg2cartesian(vec3(llh.xy,minElevation+heightOffset));
            
            gl_Position = czm_projection * czm_view * vec4(adjustedCartesian,1.0);
            v_st = st;
        }
      `,p=`
        in vec2 v_st;

        void main(){
            light = vec3(-0., .0, 2.8); // position of the sun
            vec2 uv = v_st;

            float deepwater_fadedepth = 0.5 + coast2water_fadedepth;

            float height = height_map(uv);
            vec3 col;

            float waveheight = clamp(WATER_LEVEL * 3. - 1.5, 0., 1.);
            float level = WATER_LEVEL + .2 * water_map(uv * 15. + vec2(iTime * .1), waveheight);
            if(height <= level) {
                vec2 dif = vec2(.0, .01);
                vec2 pos = uv * 15. + vec2(iTime * .01);
                float h1 = water_map(pos - dif, waveheight);
                float h2 = water_map(pos + dif, waveheight);
                float h3 = water_map(pos - dif.yx, waveheight);
                float h4 = water_map(pos + dif.yx, waveheight);
                vec3 normwater = normalize(vec3(h3 - h4, h1 - h2, .125)); // norm-vector of the 'bumpy' water-plane
                uv += normwater.xy * .002 * (level - height);

                col = vec3(1.0);

                float coastfade = clamp((level - height) / coast2water_fadedepth, 0., 1.);
                float coastfade2 = clamp((level - height) / deepwater_fadedepth, 0., 1.);
                float intensity = col.r * .2126 + col.g * .7152 + col.b * .0722;
                watercolor = mix(watercolor * intensity, watercolor2, smoothstep(0., 1., coastfade2));

                vec3 r0 = vec3(uv, WATER_LEVEL);
                vec3 rd = normalize(light - r0); // ray-direction to the light from water-position
                float grad = dot(normwater, rd); // dot-product of norm-vector and light-direction
                float specular = pow(grad, water_softlight_fact);  // used for soft highlights                          
                float specular2 = pow(grad, water_glossylight_fact); // used for glossy highlights
                float gradpos = dot(vec3(0., 0., 1.), rd);
                float specular1 = smoothstep(0., 1., pow(gradpos, 5.));  // used for diffusity (some darker corona around light's specular reflections...)                          
                float watershade = test_shadow(uv, level);
                watercolor *= 2.2 + watershade;
                watercolor += (.2 + .8 * watershade) * ((grad - 1.0) * .5 + specular) * .25;
                watercolor /= (1. + specular1 * 1.25);
                watercolor += watershade * specular2 * water_specularcolor;
                watercolor += watershade * coastfade * (1. - coastfade2) * (vec3(.5, .6, .7) * nautic(uv) + vec3(1., 1., 1.) * particles(uv));

                col = mix(col, watercolor, coastfade);
    
                float alpha = clamp(coastfade,0.1,0.6);
                out_FragColor = vec4(col,1.0);
                return;
            }
        }
  
      `,i=Cesium.ShaderProgram.fromCache({context:e,vertexShaderSource:I+g,fragmentShaderSource:I+p,attributeLocations:n}),v=new Cesium.Texture({context:e,width:2048,height:2048,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.UNSIGNED_BYTE,flipY:!0,sampler:new Cesium.Sampler({minificationFilter:Cesium.TextureMinificationFilter.LINEAR,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT}),source:this.heightMap}),f=new Cesium.Texture({context:e,width:512,height:512,pixelFormat:Cesium.PixelFormat.RGBA,pixelDatatype:Cesium.PixelDatatype.UNSIGNED_BYTE,flipY:!0,sampler:new Cesium.Sampler({minificationFilter:Cesium.TextureMinificationFilter.LINEAR,magnificationFilter:Cesium.TextureMagnificationFilter.LINEAR,wrapS:Cesium.TextureWrap.REPEAT,wrapT:Cesium.TextureWrap.REPEAT}),source:this.noise}),w={heightMap:()=>v,heightScale:()=>1,minElevation:()=>this.minElevation,maxElevation:()=>this.maxElevation,iTime:()=>this.time,iChannel0:()=>f,coast2water_fadedepth:()=>this.coast2water_fadedepth,large_waveheight:()=>this.large_waveheight,large_wavesize:()=>this.large_wavesize,small_waveheight:()=>this.small_waveheight,small_wavesize:()=>this.small_wavesize,water_softlight_fact:()=>this.water_softlight_fact,water_glossylight_fact:()=>this.water_glossylight_fact,particle_amount:()=>this.particle_amount,WATER_LEVEL:()=>this.WATER_LEVEL},o=Cesium.RenderState.fromCache({depthTest:{enabled:!0},depthMask:{enabled:!0},blending:Cesium.BlendingState.ALPHA_BLEND,cull:{enabled:!1}});this.drawCommand=new Cesium.DrawCommand({modelMatrix:this.modelMatrix,vertexArray:m,primitiveType:Cesium.PrimitiveType.TRIANGLES,shaderProgram:i,uniformMap:w,renderState:o,pass:Cesium.Pass.OPAQUE})}set showLines(e){this._showLines=e,this.drawCommand.primitiveType=this._showLines?Cesium.PrimitiveType.LINES:Cesium.PrimitiveType.TRIANGLES}get showLines(){return this._showLines}async update(e){const t=performance.now();this.deltaTime=(t-this.lastUpdateTime)/1e3,this.lastUpdateTime=t,this.time=t/1e3,this.frame+=.02,this.drawCommand||this.createCommand(e.context),e.commandList.push(this.drawCommand)}destroy(){super.destroy(),[this.drawCommand].forEach(t=>{if(t){const a=t.vertexArray,n=t.shaderProgram;a.isDestroyed()||a.destroy(),(!n.isDestroyed||!n.isDestroyed())&&n.destroy(),t.isDestroyed=function(){return!0},t.uniformMap=void 0,t.renderState=Cesium.RenderState.removeFromCache(t.renderState)}}),this.drawCommand=null}}const W={__name:"dynamicWater",async setup(A){let e,t;const{viewer:a}=window,n=(r,u,l)=>{const c=l/6371e3*(180/Math.PI),h=c/Math.cos(u*Math.PI/180),_=r-h/2,C=r+h/2,L=u-c/2,P=u+c/2;return[_,L,C,P]},m={minElevation:1153.0408311859962,maxElevation:3158.762303474051,url:"/cesium-vue3-vite/images/texture2.png",center:[-119.5509508318,37.7379837881]},g=async()=>{const r=await Cesium.Resource.fetchImage({url:m.url});return{minElevation:m.minElevation,maxElevation:m.maxElevation,canvas:r}};a.scene.terrainProvider=([e,t]=E(()=>Cesium.CesiumTerrainProvider.fromIonAssetId(1,{requestVertexNormals:!0})),e=await e,t(),e),a.scene.msaaSamples=4,a.scene.highDynamicRange=!0,a.postProcessStages.fxaa.enabled=!0,a.scene.globe.depthTestAgainstTerrain=!0,a.scene.debugShowFramesPerSecond=!0;const p=m.center,i=n(...p,2e4);console.log(i);const v=Cesium.Rectangle.fromDegrees(...i);a.camera.flyTo({destination:v,duration:1});const f=([e,t]=E(()=>g()),e=await e,t(),e),w=([e,t]=E(()=>Cesium.Resource.fetchImage({url:"/cesium-vue3-vite/images/texture1.png"})),e=await e,t(),e),o=new b({viewer:a,extent:i,...f,noise:w}),s=new D;s.add(o,"coast2water_fadedepth",0,1),s.add(o,"large_waveheight",.01,1),s.add(o,"large_wavesize",1,10),s.add(o,"small_waveheight",0,2),s.add(o,"small_wavesize",0,1),s.add(o,"water_softlight_fact",1,200),s.add(o,"water_glossylight_fact",1,200),s.add(o,"particle_amount",1,200),s.add(o,"WATER_LEVEL",0,2),s.add(o,"showLines"),a.scene.primitives.add(o);const x=a.scene.globe,d=[new Cesium.Cartesian3.fromDegrees(i[0],i[1],f.minElevation),new Cesium.Cartesian3.fromDegrees(i[2],i[1],f.minElevation),new Cesium.Cartesian3.fromDegrees(i[2],i[3],f.minElevation),new Cesium.Cartesian3.fromDegrees(i[0],i[3],f.minElevation)],y=d.length,T=[];for(let r=0;r<y;++r){const u=(r+1)%y;let l=Cesium.Cartesian3.add(d[r],d[u],new Cesium.Cartesian3);l=Cesium.Cartesian3.multiplyByScalar(l,.5,l);const R=Cesium.Cartesian3.normalize(l,new Cesium.Cartesian3);let c=Cesium.Cartesian3.subtract(d[u],l,new Cesium.Cartesian3);c=Cesium.Cartesian3.normalize(c,c);let h=Cesium.Cartesian3.cross(c,R,new Cesium.Cartesian3);h=Cesium.Cartesian3.normalize(h,h);const _=new Cesium.Plane(h,0),C=Cesium.Plane.getPointDistance(_,l);T.push(new Cesium.ClippingPlane(h,C))}return x.clippingPlanes=new Cesium.ClippingPlaneCollection({planes:T,edgeWidth:1,edgeColor:Cesium.Color.WHITE,enabled:!1}),x.backFaceCulling=!0,(r,u)=>(z(),S("div"))}};export{W as default};
