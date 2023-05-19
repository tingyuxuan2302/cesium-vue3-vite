/**
 * circleDiffusion：圆扩散
 */
import * as Cesium from "cesium";
// 圆扩散
export default class CircleDiffusion {
  viewer;
  lastStageList;
  constructor(viewer) {
    this.viewer = viewer;
    this.lastStageList = [];
    // js语法的每行结尾的“分号”可写可不写
  }
  add(position, scanColor, maxRadius, duration) {
    this.lastStageList.push(
      this.showCircleScan(position, scanColor, maxRadius, duration)
    );
  }
  clear() {
    this.lastStageList.forEach((ele) => {
      this.clearScanEffects(ele);
    });
    this.lastStageList = [];
  }
  /**
   * 圆扩散
   * @param {*} position  扫描中心 如[117.270739,31.84309,32]
   * @param {*} scanColor 扫描颜色 如"rgba(0,255,0,1)"
   * @param {*} maxRadius 扫描半径，单位米 如1000米
   * @param {*} duration 持续时间，单位毫秒 如4000
   */
  showCircleScan(position, scanColor, maxRadius, duration) {
    const cartographicCenter = new Cesium.Cartographic(
      Cesium.Math.toRadians(position[0]),
      Cesium.Math.toRadians(position[1]),
      position[2]
    );
    scanColor = new Cesium.Color.fromCssColorString(scanColor);
    const lastStage = this._addCircleScanPostStage(
      cartographicCenter,
      maxRadius,
      scanColor,
      duration
    );
    return lastStage;
  }
  /**
   * 添加扩散效果扫描线
   * @param {*} cartographicCenter  扫描中心
   * @param {*} maxRadius 扫描半径
   * @param {*} scanColor  扫描颜色
   * @param {*} duration  持续时间
   */
  _addCircleScanPostStage(cartographicCenter, maxRadius, scanColor, duration) {
    const _Cartesian3Center =
      Cesium.Cartographic.toCartesian(cartographicCenter);
    const _Cartesian4Center = new Cesium.Cartesian4(
      _Cartesian3Center.x,
      _Cartesian3Center.y,
      _Cartesian3Center.z,
      1
    );
    const _CartograhpicCenter1 = new Cesium.Cartographic(
      cartographicCenter.longitude,
      cartographicCenter.latitude,
      cartographicCenter.height + 500
    );
    const _Cartesian3Center1 =
      Cesium.Cartographic.toCartesian(_CartograhpicCenter1);
    const _Cartesian4Center1 = new Cesium.Cartesian4(
      _Cartesian3Center1.x,
      _Cartesian3Center1.y,
      _Cartesian3Center1.z,
      1
    );
    const _time = new Date().getTime();
    const _scratchCartesian4Center = new Cesium.Cartesian4();
    const _scratchCartesian4Center1 = new Cesium.Cartesian4();
    const _scratchCartesian3Normal = new Cesium.Cartesian3();
    const _this = this;
    const ScanPostStage = new Cesium.PostProcessStage({
      fragmentShader: _this._getScanSegmentShader(),
      uniforms: {
        u_scanCenterEC: function () {
          const temp = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );
          return temp;
        },
        u_scanPlaneNormalEC: function () {
          const temp = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );
          const temp1 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          );
          _scratchCartesian3Normal.x = temp1.x - temp.x;
          _scratchCartesian3Normal.y = temp1.y - temp.y;
          _scratchCartesian3Normal.z = temp1.z - temp.z;
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          );
          return _scratchCartesian3Normal;
        },
        u_radius: function () {
          return (
            (maxRadius * ((new Date().getTime() - _time) % duration)) / duration
          );
        },
        u_scanColor: scanColor,
      },
    });
    this.viewer.scene.postProcessStages.add(ScanPostStage);
    return ScanPostStage;
  }
  /**
   * 扩散效果Shader
   */
  _getScanSegmentShader() {
    const inpram = 18;
    const scanSegmentShader =
      ` uniform sampler2D colorTexture;
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
              f = pow(f, float(` +
      inpram +
      `));
              fragColor = mix(fragColor,u_scanColor,f);
            }
            fragColor.a = fragColor.a / 2.0;
        }
      `;
    return scanSegmentShader;
  }
  /**
   * 清除特效对象
   * @param {*} lastStage 特效对象
   */
  clearScanEffects(lastStage) {
    this.viewer.scene.postProcessStages.remove(lastStage);
  }
}
