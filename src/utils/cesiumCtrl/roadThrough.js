/*
 * @Description:穿梭路光效果(entity的材质使用MaterialProperty,而primitive使用的是material)
 * @Author: 笙痞77
 * @Date: 2023-01-11 11:19:55
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-01-12 15:48:32
 */
import * as Cesium from "cesium";

function Spriteline1MaterialProperty(duration, image) {
  this._definitionChanged = new Cesium.Event();
  this.duration = duration;
  this.image = image;
  this._time = performance.now();
}
Object.defineProperties(Spriteline1MaterialProperty.prototype, {
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
});
Spriteline1MaterialProperty.prototype.getType = function (time) {
  return "Spriteline1";
};
Spriteline1MaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.image = this.image;
  result.time =
    ((performance.now() - this._time) % this.duration) / this.duration;
  return result;
};
Spriteline1MaterialProperty.prototype.equals = function (e) {
  return (
    this === e ||
    (e instanceof Spriteline1MaterialProperty && this.duration === e.duration)
  );
};
// Cesium.Spriteline1MaterialProperty = Spriteline1MaterialProperty
Cesium.Material.Spriteline1Type = "Spriteline1";
Cesium.Material.Spriteline1Source = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
vec2 st = materialInput.st;
vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
material.alpha = colorImage.a;
material.diffuse = colorImage.rgb * 1.5 ;
return material;
}
`;
// st :二维纹理坐标
// czm_material：保存可用于照明的材质信息
Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type, {
  fabric: {
    type: Cesium.Material.Spriteline1Type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: "",
      transparent: true,
      time: 20,
    },
    source: Cesium.Material.Spriteline1Source,
  },
  translucent: function (material) {
    return true;
  },
});

export default Spriteline1MaterialProperty;

// import * as Cesium from 'cesium'
// export default class SpritelineMaterialProperty {
//   name: string
//   img: string

//   definitionChanged = new Cesium.Event()
//   isConstant = false

//   constructor(name: string = 'spriteline1') {
//     this.name = name
//     this.img = '/api/textures/spriteline1.png'
//     ;(Cesium.Material as any)._materialCache.addMaterial(
//       'SpritelineMaterialProperty',
//       {
//         fabric: {
//           type: 'SpritelineMaterialProperty',
//           uniforms: {
//             img: this.img
//           },
//           source: `
//         czm_material czm_getMaterial(czm_materialInput materialInput)
//         {
//           // 生成默认的基础材质
//           czm_material material = czm_getDefaultMaterial(materialInput);
//           vec2 st = materialInput.st;
//           // 定义动画持续时间,从0到1
//           float durationTime = 2.0;
//           // 获取当前帧数,fract(x) 返回x的小数部分
//           float time = fract(czm_frameNumber / (60.0 * durationTime));
//           // 根据uv采样颜色
//           vec4 color = texture(img,vec2(fract(st.s - time),st.t));
//           material.alpha = color.a;
//           material.diffuse = color.rgb;
//           return material;
//         }
//         `
//         }
//       }
//     )
//   }
//   getType(time?: Cesium.JulianDate) {
//     return 'SpritelineMaterialProperty'
//   }
//   getValue(time: Cesium.JulianDate, result: { [key: string]: number }) {
//     return result
//   }
//   equals(other: Cesium.Property): boolean {
//     // 判断两个材质是否相等
//     return (
//       other instanceof SpritelineMaterialProperty && this.name === other.name
//     )
//   }
// }
