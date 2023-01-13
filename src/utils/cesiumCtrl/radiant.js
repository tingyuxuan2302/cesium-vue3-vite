/*
 * @Description:辐射圈
 * @Author: 笙痞77
 * @Date: 2023-01-12 16:14:53
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-12 17:17:49
 */

import * as Cesium from "cesium";
import Effect from "@/utils/cesiumCtrl/pointEffect";

function CircleWaveMaterialProperty(ob) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = ob.color;
  this.duration = Cesium.defaultValue(ob.duration, 1000);
  this.count = Cesium.defaultValue(ob.count, 2);
  if (this.count <= 0) {
    this.count = 1;
  }
  this.gradient = Cesium.defaultValue(ob.gradient, 0.1);
  if (this.gradient === 0) {
    this.gradient = 0;
  }
  if (this.gradient > 1) {
    this.gradient = 1;
  }
  this._time = new Date().getTime();
}
Object.defineProperties(CircleWaveMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor("color"),
  duration: Cesium.createPropertyDescriptor("duration"),
  count: Cesium.createPropertyDescriptor("count"),
});
CircleWaveMaterialProperty.prototype.getType = function (_time) {
  return Cesium.Material.CircleWaveMaterialType;
};
CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
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
    ((new Date().getTime() - this._time) % this.duration) / this.duration;
  result.count = this.count;
  result.gradient = 1 + 10 * (1 - this.gradient);
  return result;
};
CircleWaveMaterialProperty.prototype.equals = function (other) {
  const reData =
    this === other ||
    (other instanceof CircleWaveMaterialProperty &&
      Cesium.Property.equals(this._color, other._color));
  return reData;
};
// Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
Cesium.Material.CircleWaveMaterialType = "CircleWaveMaterial";
Cesium.Material.CircleWaveSource = `
                                  czm_material czm_getMaterial(czm_materialInput materialInput) {
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    material.diffuse = 1.5 * color.rgb;
                                    vec2 st = materialInput.st;
                                    vec3 str = materialInput.str;
                                    float dis = distance(st, vec2(0.5, 0.5));
                                    float per = fract(time);
                                    if (abs(str.z) > 0.001) {
                                      discard;
                                    }
                                    if (dis > 0.5) {
                                      discard;
                                    } else {
                                      float perDis = 0.5 / count;
                                      float disNum;
                                      float bl = .0;
                                      for (int i = 0; i <= 9; i++) {
                                        if (float(i) <= count) {
                                          disNum = perDis *float(i) - dis + per / count;
                                          if (disNum > 0.0) {
                                            if (disNum < perDis) {
                                              bl = 1.0 - disNum / perDis;
                                            } else if(disNum - perDis < perDis) {
                                              bl = 1.0 - abs(1.0 - disNum / perDis);
                                            }
                                            material.alpha = pow(bl, gradient);
                                          }
                                        }
                                      }
                                    }
                                    return material;
                                  }
                                  `;
Cesium.Material._materialCache.addMaterial(
  Cesium.Material.CircleWaveMaterialType,
  {
    fabric: {
      type: Cesium.Material.CircleWaveMaterialType,
      uniforms: {
        color: new Cesium.Color(1, 0, 0, 1),
        time: 1,
        count: 1,
        gradient: 0.1,
      },
      source: Cesium.Material.CircleWaveSource,
    },
    translucent: function (material) {
      return true;
    },
  }
);

// 水波纹
export default class CircleWave extends Effect {
  count;
  constructor(viewer, id) {
    super(viewer, id);
  }
  change_duration(d) {
    super.change_duration(d);
    const curEntity = this.viewer.entities.getById(this.id);
    curEntity._ellipse._material.duration = d;
  }
  change_waveCount(d) {
    const curEntity = this.viewer.entities.getById(this.id);
    curEntity._ellipse._material.count = d;
  }
  /**
   * @description:
   * @param {*} position 位置
   * @param {*} color 颜色
   * @param {*} maxRadius 最大半径
   * @param {*} duration 扩散间隔
   * @param {*} isedit 是否已经编辑
   * @param {*} count 扩散圆数量
   * @return {*}
   */
  add(position, color, maxRadius, duration, isedit = false, count = 3) {
    super.add(position, color, maxRadius, duration, isedit);
    const _this = this;
    this.count = count;
    this.viewer.entities.add({
      id: _this.id,
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      ellipse: {
        // height: position[2],
        semiMinorAxis: new Cesium.CallbackProperty(function (n) {
          return _this.maxRadius;
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty(function (n) {
          return _this.maxRadius;
        }, false),
        material: new CircleWaveMaterialProperty({
          duration: duration,
          gradient: 0.5,
          color: new Cesium.Color.fromCssColorString(color),
          count: count,
        }),
      },
    });
  }
}
