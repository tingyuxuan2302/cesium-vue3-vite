/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-05-19 09:58:36
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 17:15:20
 */
import * as Cesium from "cesium"

export default class SkyLineAnalysis {
  skylineAnayStages = null
  silhouette = null
  constructor(viewer) {
    this.viewer = viewer
  }
  open() {
    if (this.skylineAnayStages) {
      this.silhouette.enabled = true;
      return;
    }
    this.skylineAnayStages = this.viewer.scene.postProcessStages;
    let edgeDetection = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    let postProccessStage = new Cesium.PostProcessStage({
      //此后处理阶段的唯一名称，供组合中其他阶段参考，如果未提供名称，将自动生成GUID
      // name:name,
      //unform着色器对象 textureScale
      fragmentShader: 'uniform sampler2D colorTexture;' +
        'uniform sampler2D depthTexture;' +
        'in vec2 v_textureCoordinates;' +
        "out vec4 fragColor;" +
        'void main(void)' +
        '{' +
        'float depth = czm_readDepth(depthTexture, v_textureCoordinates);' +
        'vec4 color = texture(colorTexture, v_textureCoordinates);' +
        'if(depth<1.0 - 0.000001){' +
        'fragColor = color;' +
        '}' +
        'else{' +
        'fragColor = vec4(1.0,0.0,0.0,1.0);' +
        '}' +
        '}'
    });

    //PostProcessStage:要使用的片段着色器。默认sampler2D制服是colorTexture和depthTexture。
    let postProccesStage_1 = new Cesium.PostProcessStage({
      // name:obj.name+'_1',
      fragmentShader: 'uniform sampler2D colorTexture;' +
        'uniform sampler2D redTexture;' +
        'uniform sampler2D silhouetteTexture;' +
        'in vec2 v_textureCoordinates;' +
        "out vec4 fragColor;" +
        'void main(void)' +
        '{' +
        'vec4 redcolor=texture(redTexture, v_textureCoordinates);' +
        'vec4 silhouetteColor = texture(silhouetteTexture, v_textureCoordinates);' +
        'vec4 color = texture(colorTexture, v_textureCoordinates);' +
        'if(redcolor.r == 1.0){' +
        'fragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);' +
        '}' +
        'else{' +
        'fragColor = color;' +
        '}' +
        '}',
      //uniform着色器对象
      uniforms: {
        redTexture: postProccessStage.name,
        silhouetteTexture: edgeDetection.name
      }
    });

    //如果inputPreviousStageTexture 是 true，则每个阶段输入是场景渲染到的输出纹理或之前执行阶段的输出纹理
    //如果inputPreviousStageTexture是false，则合成中每个阶段的输入纹理都是相同的
    this.silhouette = new Cesium.PostProcessStageComposite({
      //PostProcessStage要按顺序执行 的 s 或组合的数组。
      stages: [edgeDetection, postProccessStage, postProccesStage_1],
      //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
      inputPreviousStageTexture: false,
      //后处理阶段制服的别名
      uniforms: edgeDetection.uniforms
    })
    this.skylineAnayStages.add(this.silhouette)
  }
  close() {
    this.silhouette.enabled = false
  }
}