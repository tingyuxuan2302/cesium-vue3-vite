import * as Cesium from "cesium";
/*
 * @Description: 动态扩散墙的墙体效果（参考开源代码）（不同高度透明度不同）
 */
export default class WallDiffuseMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this.color = options.color;
  }

  // 获取是否为常量的属性
  get isConstant() {
    // 返回false
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.WallDiffuseMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrDefault(
      this._color,
      time,
      Cesium.Color.RED,
      result.color
    );
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof WallDiffuseMaterialProperty &&
        Cesium.Property.equals(this._color, other._color))
    );
  }
}

Object.defineProperties(WallDiffuseMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
});

Cesium.Material.WallDiffuseMaterialProperty = "WallDiffuseMaterialProperty";
Cesium.Material.WallDiffuseMaterialType = "WallDiffuseMaterialType";
Cesium.Material.WallDiffuseMaterialSource = `
  uniform vec4 color;
  czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  material.diffuse = color.rgb * 2.0;
  material.alpha = color.a * (1.0-fract(st.t)) * 0.8;
  return material;
  }                                         
  `;

Cesium.Material._materialCache.addMaterial(
  Cesium.Material.WallDiffuseMaterialType,
  {
    fabric: {
      type: Cesium.Material.WallDiffuseMaterialType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      },
      source: Cesium.Material.WallDiffuseMaterialSource,
    },
    translucent: function (material) {
      return true;
    },
  }
);
