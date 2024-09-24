import { Cartesian3, Cesium3DTileset, CustomShader, Matrix4, Transforms, UniformType } from 'cesium';
import { PlanishArea as PlanishOsgbArea } from './planishArea.ts';

class TilesetPlanish {
  private _tileset: Cesium3DTileset;
  private _matrix: Matrix4;
  private _localMatrix: Matrix4;

  private _polygonEdits: any[];

  constructor(tileset: Cesium3DTileset) {
    this._tileset = tileset;

    const center = tileset.boundingSphere.center.clone(); // 包围盒的中心点
    this._matrix = Transforms.eastNorthUpToFixedFrame(center); // 根据向量点获取变换矩阵
    this._localMatrix = Matrix4.inverse(this._matrix, new Matrix4()); // 获取逆矩阵

    this._polygonEdits = [];
  }

  /**
   * 添加压平区域数据
   * @param uuid 压平区域的uuid
   * @param area 压平区域数据
   * @param height 压平高度
   * @returns
   */
  addRegionEditsData(uuid: string, area: Array<Cartesian3>, height: number = 0.0) {
    for (let p = 0; p < this._polygonEdits.length; p++) {
      if (this._polygonEdits[p].uuid === uuid) {
        return;
      }
    }

    if (area.length === 0) return;

    // 把多边形压平区域的数据对象存储起来，用于后续处理
    this._polygonEdits.push({
      uuid: uuid,
      show: true,
      polygon: this.cartesiansToLocal(area), // 坐标转换
      height: height
    });

    this.renderShader();
  }

  /**
   * 业务需要封装根据压平区域数据的数组添加（内部实现与addRegionEditsData类似）
   * @param {*} arr 压平区域数据的对象数组
   * @returns
   */
  addRegionEditsDataArr(arr: PlanishOsgbArea[]) {
    arr.forEach((element) => {
      const uuid = element.uuid;
      const height = element.height;
      const show = element.show;
      let area: Cartesian3[] = [];
      element.area.forEach((item: any) => {
        area.push(new Cartesian3(item.x, item.y, item.z));
      });

      for (let p = 0; p < this._polygonEdits.length; p++) {
        if (this._polygonEdits[p].uuid === uuid) {
          return;
        }
      }

      if (area.length === 0) return;

      this._polygonEdits.push({
        uuid: uuid,
        show: show,
        polygon: this.cartesiansToLocal(area),
        height: height
      });
      console.log(this._polygonEdits);
      
    });

    this.renderShader();
  }

  // 世界坐标转模型里的局部坐标
  cartesiansToLocal(positions: Array<Cartesian3>) {
    let arr = [];
    for (let i = 0; i < positions.length; i++) {
      let position = positions[i];

      let localp = Matrix4.multiplyByPoint(this._localMatrix, position.clone(), new Cartesian3()); // 将世界坐标点与之前通过包围盒中心点算得的矩阵的逆矩阵相乘，得到模型里的局部坐标

      arr.push([localp.x, localp.y]);
    }
    return arr;
  }

  /**
   * 生成对应的shader代码
   */
  renderShader() {
    const funstr = this.getPointInPolygon(this._polygonEdits);

    let str = ``;
    this._polygonEdits.forEach((item: any, index: number) => {
      if (item.show) {
        const name = index;

        item.polygon.forEach((point: Array<number>, i: number) => {
          str += `points_${name}[${i}] = vec2(${point[0]}, ${point[1]});`;
        });

        str += `
          if (isPointInPolygon_${name}(position2D)) {
            float ground_z = float(${item.height});
            vec4 tileset_local_position_transformed = vec4(tileset_local_position.x, tileset_local_position.y, ground_z, 1.0);
            vec4 model_local_position_transformed = czm_inverseModel * u_tileset_localToWorldMatrix * tileset_local_position_transformed;
            vsOutput.positionMC.xyz = model_local_position_transformed.xyz;
            return;
          }\n
        `;
      }
    });

    this.updateShader(funstr, str);
  }

  /**
   * 根据数组长度，构建 判断点是否在面内 的压平函数
   * @param polygons 压平区域的数据数组
   * @returns
   */
  getPointInPolygon(polygons: any) {
    let str = ``;
    polygons.forEach((item: any, index: number) => {
      if (item.show) {
        const length = item.polygon.length;
        const name = index;

        str += `
        vec2 points_${name}[${length}];
        bool isPointInPolygon_${name} (vec2 point) {
          int nCross = 0; // 交点数
          const int n = ${length};

          for (int i = 0; i < n; i++) {
            vec2 p1 = points_${name}[i];
            vec2 p2 = points_${name}[int(mod(float(i+1), float(n)))];
            if (p1[1] == p2[1]) {
              continue;
            }
            if (point[1] < min(p1[1], p2[1])) {
              continue;
            }
            if (point[1] >= max(p1[1], p2[1])) {
              continue;
            }
            float x = p1[0] + ((point[1] - p1[1]) * (p2[0] - p1[0])) / (p2[1] - p1[1]);
            if (x > point[0]) {
              nCross++;
            }
          }

          return int(mod(float(nCross), float(2))) == 1;
        }`;
      }
    });

    return str;
  }

  /**
   * 更新自定义shader
   * @param vtx1 判断点是否在面内的压平函数 string
   * @param vtx2 调用范围判断压平 string
   */
  updateShader(vtx1: string, vtx2: string) {
    let flatCustomShader = new CustomShader({
      uniforms: {
        u_tileset_localToWorldMatrix: {
          type: UniformType.MAT4,
          value: this._matrix
        },
        u_tileset_worldToLocalMatrix: {
          type: UniformType.MAT4,
          value: this._localMatrix
        }
      },
      vertexShaderText: `
        ${vtx1}
        void vertexMain (VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
          vec3 modelMC = vsInput.attributes.positionMC;
          vec4 model_local_position = vec4(modelMC.x, modelMC.y, modelMC.z, 1.0);
          vec4 tileset_local_position = u_tileset_worldToLocalMatrix * czm_model * model_local_position;
          vec2 position2D = vec2(tileset_local_position.x, tileset_local_position.y);
          ${vtx2}
        }`
    });
    this._tileset.customShader = flatCustomShader;

    console.log(flatCustomShader.vertexShaderText);
  }

  /**
   * 删除压平区域
   * @param {*} uuid 压平区域的uuid
   */
  removeRegionEditsData(uuid: string) {
    for (let i = 0; i < this._polygonEdits.length; i++) {
      if (this._polygonEdits[i].uuid === uuid) {
        this._polygonEdits.splice(i, 1);
      }
    }

    this.renderShader();
  }

  /**
   * 设置压平区域的显隐
   * @param {*} uuid 压平区域的uuid
   * @param {*} visible 显隐值
   */
  setRegionEditsVisible(uuid: string, visible: boolean) {
    for (let i = 0; i < this._polygonEdits.length; i++) {
      if (this._polygonEdits[i].uuid === uuid) {
        this._polygonEdits[i].show = visible;
      }
    }

    this.renderShader();
  }

  /**
   * 设置压平区域高度
   * @param {*} uuid 压平区域的uuid
   * @param {*} height 压平高度
   */
  setRegionEditsHeight(uuid: string, height: number) {
    for (let i = 0; i < this._polygonEdits.length; i++) {
      if (this._polygonEdits[i].uuid === uuid) {
        this._polygonEdits[i].height = height;
      }
    }

    this.renderShader();
  }
}

export { TilesetPlanish };

