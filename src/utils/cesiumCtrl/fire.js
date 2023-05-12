import * as Cesium from "cesium";
//火焰特效
export default class FireEffect {
  constructor(viewer) {
    this.viewer = viewer;
    this.viewModel = {
      // emissionRate: 5,
      // gravity: 0.0, //设置重力参数
      // minimumParticleLife: 1,
      // maximumParticleLife: 6,
      // minimumSpeed: 1.0, //粒子发射的最小速度
      // maximumSpeed: 4.0, //粒子发射的最大速度
      // startScale: 0.0,
      // endScale: 10.0,
      // particleSize: 25.0,

      // startScale: 3,
      // endScale: 1.5,
      // minimumParticleLife: 1.5,
      // maximumParticleLife: 1.8,
      // minimumSpeed: 7,
      // maximumSpeed: 9,
      // particleSize: 2,
      // emissionRate: 200,

      startScale: 1, // 应用于粒子生命开始时的图像的初始比例。
      endScale: 4,
      minimumParticleLife: 1,
      maximumParticleLife: 3, // 设置粒子生命可能持续时间的最大边界(以秒为单位)，在此范围内，将随机选择粒子的实际生命。
      minimumSpeed: 1,
      maximumSpeed: 8, // 设置以米/每秒为单位的粒子的实际速度将被随机选择的最大边界。
      particleSize: 20,
      emissionRate: 5,
    };
    this.emitterModelMatrix = new Cesium.Matrix4();
    this.translation = new Cesium.Cartesian3();
    this.rotation = new Cesium.Quaternion();
    this.hpr = new Cesium.HeadingPitchRoll();
    this.trs = new Cesium.TranslationRotationScale();
    this.scene = this.viewer.scene;
    this.particleSystem = "";
    this.entity = this.viewer.entities.add({
      //选择粒子放置的坐标
      position: Cesium.Cartesian3.fromDegrees(120.36, 36.09),
    });
    this.init();
  }

  init() {
    const _this = this;
    this.viewer.clock.shouldAnimate = true;
    this.viewer.scene.globe.depthTestAgainstTerrain = false;
    // this.viewer.trackedEntity = this.entity;
    const minimum = 10, maximum = 20
    var particleSystem = this.scene.primitives.add(
      new Cesium.ParticleSystem({
        // image: "/images/fire-particle.png", //生成所需粒子的图片路径
        // image: "/images/fire.png", //生成所需粒子的图片路径
        // //粒子在生命周期开始时的颜色
        // // startColor: new Cesium.Color(1, 1, 1, 1),
        // // //粒子在生命周期结束时的颜色
        // // endColor: new Cesium.Color(0.5, 0, 0, 0),
        // //粒子在生命周期开始时初始比例
        // startScale: _this.viewModel.startScale,
        // //粒子在生命周期结束时比例
        // endScale: _this.viewModel.endScale,
        // //粒子发射的最小速度
        // minimumParticleLife: 1,
        // //粒子发射的最大速度
        // maximumParticleLife: 1,
        // //粒子质量的最小界限
        // minimumSpeed: 5,
        // //粒子质量的最大界限
        // maximumSpeed: 5,
        // //以像素为单位缩放粒子图像尺寸
        // imageSize: new Cesium.Cartesian2(
        //   _this.viewModel.particleSize,
        //   _this.viewModel.particleSize
        // ),
        // //每秒发射的粒子数
        // emissionRate: _this.viewModel.emissionRate,
        // //粒子系统发射粒子的时间（秒）
        // lifetime: 16.0,
        // //粒子系统是否应该在完成时循环其爆发
        // loop: true,
        // // //设置粒子的大小是否以米或像素为单位
        // sizeInMeters: true,
        // modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(120.36, 36.09)),
        // emitterModelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(120.36, 36.09)),

        // v2版本
        // 系统的粒子发射器
        emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)), //BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器

        image: '/images/fire.png',
        startColor: Cesium.Color.RED,
        endColor: Cesium.Color.YELLOW,
        startScale: 1.0,
        endScale: 3.0,
        particleLife: 1.5,
        // minimumSpeed: 1.0,
        // maximumSpeed: 10.0,
        speed: 10.0,
        //粒子系统发射粒子的时间（秒）
        // lifetime: 16.0,
        // minimumParticleLife: 1.0,
        // maximumParticleLife: 5.0,
        // minimumMass: 1.0,
        // maximumMass: 10.0,
        emissionRate: 200.0,
        imageSize: new Cesium.Cartesian2(
          25,
          25
        ),
        bursts: [
          new Cesium.ParticleBurst({ time: 0.0, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.1, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.2, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.3, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.4, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.5, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.6, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.7, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.8, minimum, maximum }),
          new Cesium.ParticleBurst({ time: 0.9, minimum, maximum })
        ],
      })
    );
    this.particleSystem = particleSystem;
    this.preUpdateEvent();
  }

  //场景渲染事件
  preUpdateEvent() {
    let _this = this;
    this.viewer.scene.preUpdate.addEventListener(function (scene, time) {
      //发射器地理位置
      _this.particleSystem.modelMatrix = _this.computeModelMatrix(
        _this.entity,
        time
      );
      //发射器局部位置
      _this.particleSystem.emitterModelMatrix =
        _this.computeEmitterModelMatrix();
      // 将发射器旋转
      if (_this.viewModel.spin) {
        _this.viewModel.heading += 1.0;
        _this.viewModel.pitch += 1.0;
        _this.viewModel.roll += 1.0;
      }
    });
  }

  computeModelMatrix(entity, time) {
    return entity.computeModelMatrix(time, new Cesium.Matrix4());
  }

  computeEmitterModelMatrix() {
    this.hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, this.hpr);
    this.trs.translation = Cesium.Cartesian3.fromElements(
      -4.0,
      0.0,
      1.4,
      this.translation
    );
    this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(
      this.hpr,
      this.rotation
    );

    return Cesium.Matrix4.fromTranslationRotationScale(
      this.trs,
      this.emitterModelMatrix
    );
  }

  removeEvent() {
    this.viewer.scene.preUpdate.removeEventListener(this.preUpdateEvent, this);
    this.emitterModelMatrix = undefined;
    this.translation = undefined;
    this.rotation = undefined;
    this.hpr = undefined;
    this.trs = undefined;
  }

  //移除粒子特效
  remove() {
    () => {
      return this.removeEvent();
    }; //清除事件
    this.viewer.scene.primitives.remove(this.particleSystem); //删除粒子对象
    this.viewer.entities.remove(this.entity); //删除entity
  }
}


