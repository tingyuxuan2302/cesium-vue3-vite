/*
 * @Description: 线赋材质
 * @Author: 笙痞77
 * @Date: 2023-01-11 09:42:16
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-11 10:07:17
 */
import * as Cesium from "cesium"

export default class LineFlickerMaterialProperty {
  constructor(options) {
      this._definitionChanged = new Cesium.Event();
      this._color = undefined;
      this._speed = undefined;
      this.color = options.color;
      this.speed = options.speed;
  };

  get isConstant() {
      return false;
  }

  get definitionChanged() {
      return this._definitionChanged;
  }

  getType(time) {
      return Cesium.Material.LineFlickerMaterialType;
  }

  getValue(time, result) {
      if (!Cesium.defined(result)) {
          result = {};
      }

      result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
      result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
      return result
  }

  equals(other) {
      return (this === other ||
          (other instanceof LineFlickerMaterialProperty &&
              Cesium.Property.equals(this._color, other._color) &&
              Cesium.Property.equals(this._speed, other._speed))
      )
  }
}

Object.defineProperties(LineFlickerMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
})

// Cesium.Material.LineFlickerMaterialProperty = LineFlickerMaterialProperty;
Cesium.Material.LineFlickerMaterialProperty = 'LineFlickerMaterialProperty';
Cesium.Material.LineFlickerMaterialType = 'LineFlickerMaterialType';
Cesium.Material.LineFlickerMaterialSource =
  `
uniform vec4 color;
uniform float speed;
czm_material czm_getMaterial(czm_materialInput materialInput){
czm_material material = czm_getDefaultMaterial(materialInput);
float time = fract( czm_frameNumber  *  speed / 1000.0);
vec2 st = materialInput.st;
float scalar = smoothstep(0.0,1.0,time);
material.diffuse = color.rgb * scalar;
material.alpha = color.a * scalar ;
return material;
}
`

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlickerMaterialType, {
  fabric: {
      type: Cesium.Material.LineFlickerMaterialType,
      uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
          speed: 5.0,
      },
      source: Cesium.Material.LineFlickerMaterialSource
  },
  translucent: function(material) {
      return true;
  }
})
