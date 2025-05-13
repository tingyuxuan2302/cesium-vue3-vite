import * as Cesium from "cesium";

// 定义雷达材质属性
class RadarPrimitiveMaterialProperty {
  constructor(options = {}) {
    this.opts = {
      color: Cesium.Color.RED,
      duration: 2000,
      time: new Date().getTime(),
      repeat: 30,
      offset: 0,
      thickness: 0.3,
      ...options,
    };
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = this.opts.color;
    this.duration = this.opts.duration;
    this._time = this.opts.time;
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType() {
    return "radarPrimitive";
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color
    );
    result.time =
      ((new Date().getTime() - this._time) % this.duration) /
      this.duration /
      10;
    result.repeat = this.opts.repeat;
    result.offset = this.opts.offset;
    result.thickness = this.opts.thickness;
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof RadarPrimitiveMaterialProperty &&
        Cesium.Property.equals(this._color, other._color))
    );
  }
}

Object.defineProperties(RadarPrimitiveMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
});

class RadarEmission {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.options = {
      position: [114, 35, 500000.0], // 经度、纬度、高度
      heading: 135,
      color: Cesium.Color.CORAL,
      length: 500000,
      bottomRadius: 50000,
      thickness: 0.1,
      ...options,
    };
    this.init();
  }

  init() {
    // 注册雷达材质
    this._registerRadarMaterial();
    // 创建雷达实体
    this.createRadarCone();
  }

  _registerRadarMaterial() {
    if (!Cesium.Material.radarPrimitiveType) {
      Cesium.Material.radarPrimitiveType = "radarPrimitive";
      Cesium.Material.radarPrimitiveSource = `
        uniform vec4 color;
        uniform float repeat;
        uniform float offset;
        uniform float thickness;
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          float sp = 1.0/repeat;
          vec2 st = materialInput.st;
          float dis = distance(st, vec2(0.5));
          float m = mod(dis + offset-time, sp);
          float a = step(sp*(1.0-thickness), m);
          material.diffuse = color.rgb;
          material.alpha = a * color.a;
          return material;
        }`;

      Cesium.Material._materialCache.addMaterial(
        Cesium.Material.radarPrimitiveType,
        {
          fabric: {
            type: Cesium.Material.radarPrimitiveType,
            uniforms: {
              color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
              time: 0,
              repeat: 30,
              offset: 0,
              thickness: 0.3,
            },
            source: Cesium.Material.radarPrimitiveSource,
          },
          translucent: function () {
            return true;
          },
        }
      );
    }
  }

  createRadarCone() {
    const position = Cesium.Cartesian3.fromDegrees(...this.options.position);
    const heading = Cesium.Math.toRadians(this.options.heading);
    const pitch = Cesium.Math.toRadians(0);
    const roll = Cesium.Math.toRadians(0);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );

    this.entity = this.viewer.entities.add({
      name: "Radar Cone",
      position: position,
      orientation: orientation,
      cylinder: {
        length: this.options.length,
        topRadius: 0,
        bottomRadius: this.options.bottomRadius,
        material: new RadarPrimitiveMaterialProperty({
          color: this.options.color,
          thickness: this.options.thickness,
        }),
      },
    });

    return this.entity;
  }

  // 销毁实体
  destroy() {
    if (this.entity) {
      this.viewer.entities.remove(this.entity);
      this.entity = null;
    }
  }

  // 定位到实体
  zoomTo() {
    if (this.entity) {
      this.viewer.zoomTo(this.entity);
    }
  }
}

export default RadarEmission;
