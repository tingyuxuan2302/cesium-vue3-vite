import { CesiumTerrainProvider, Math as CesiumMath } from 'cesium';

import * as turf from '@turf/turf';

import { LoopSubdivision } from './LoopSubdivision.js';

/**
 * 对CesiumTerrainProvider进行扩展，修改地形数据，实现场地平整功能
 */

const MAX_SHORT = 32767;

class CesiumTerrainProviderEdit extends CesiumTerrainProvider {
  constructor({ url, modelEdits }) {
    super({ url });

    // 存储多边形压平区域的数组
    this._polygonEdits = [];
  }

  /**
   * 过滤地形瓦片，如果这块地形瓦片在压平区域内则进行压平处理
   * @param {*} x 瓦片的x
   * @param {*} y 瓦片的y
   * @param {*} level 瓦片的层级
   * @param {*} terrainData 瓦片的地形数据
   * @returns
   */
  filterTerrainTile(x, y, level, terrainData) {
    if (this._polygonEdits.length === 0) {
      return terrainData;
    }

    // 获取对应瓦片的矩形数据
    const tileRectangle = this.tilingScheme.tileXYToRectangle(x, y, level);

    const tilePolygon = rectangleToPolygon(tileRectangle);

    // 通过truf提供的算法来筛选压平区域（booleanOverlap 判断是否重叠；booleanContains 判断是否包含）
    const relevantEdits = this._polygonEdits.filter(
      (edit) =>
        edit.show && (turf.booleanOverlap(edit.polygon, tilePolygon) || turf.booleanContains(edit.polygon, tilePolygon))
    );

    if (relevantEdits.length === 0) {
      return terrainData;
    }

    if (level >= 18) {
      subdivisionTerrainTile(terrainData);
    }

    // 地形瓦片细分好后，修改地形
    let modifyData = modifyTerrainTile(terrainData, tileRectangle, relevantEdits);
    return modifyData;
  }

  /**
   * 添加地形压平区域数据
   * @param {*} uuid 压平区域的uuid
   * @param {*} area 压平区域数据
   * @param {*} height 压平高度
   * @returns
   */
  addTerrainEditsData(uuid, area, height) {
    let arr = [];
    for (let i = 0; i < area.length; i += 2) {
      if (area[i]) {
        arr.push([area[i], area[i + 1]]);
      }
    }

    for (let p = 0; p < this._polygonEdits.length; p++) {
      if (this._polygonEdits[p].uuid === uuid) {
        return;
      }
    }

    if (arr.length === 0) return;

    // 把多边形压平区域的数据对象存储起来，用于后续地形处理
    this._polygonEdits.push({
      uuid: uuid,
      show: true,
      polygon: turf.polygon([arr]),
      height: height
    });
  }

  /**
   * 业务需要封装根据压平区域数据的数组添加（内部实现与addTerrainEditsData类似）
   * @param {*} dataArr 压平区域数据的对象数组
   * @returns
   */
  addTerrainEditsDataArr(dataArr) {
    for (let d = 0; d < dataArr.length; d++) {
      let item = dataArr[d];
      let arr = [];
      for (let i = 0; i < dataArr[d].area.length; i += 2) {
        if (dataArr[d].area[i]) {
          arr.push([item.area[i], item.area[i + 1]]);
        }
      }

      for (let p = 0; p < this._polygonEdits.length; p++) {
        if (this._polygonEdits[p].uuid === item.uuid) {
          return;
        }
      }

      if (arr.length === 0) return;

      this._polygonEdits.push({
        uuid: item.uuid,
        show: item.show,
        polygon: turf.polygon([arr]),
        height: item.height
      });
    }
  }

  /**
   * 删除压平区域
   * @param {*} uuid 压平区域的uuid
   */
  removeTerrainEditsData(uuid) {
    for (let i = 0; i < this._polygonEdits.length; i++) {
      if (this._polygonEdits[i].uuid === uuid) {
        this._polygonEdits.splice(i, 1);
      }
    }
  }

  /**
   * 设置压平区域的显隐
   * @param {*} uuid 压平区域的uuid
   * @param {*} visible 显隐值
   */
  setTerrainEditsVisible(uuid, visible) {
    for (let i = 0; i < this._polygonEdits.length; i++) {
      if (this._polygonEdits[i].uuid === uuid) {
        this._polygonEdits[i].show = visible;
      }
    }
  }

  /**
   * 设置压平区域高度
   * @param {*} uuid 压平区域的uuid
   * @param {*} height 压平高度
   */
  setTerrainEditsHeight(uuid, height) {
    for (let i = 0; i < this._polygonEdits.length; i++) {
      if (this._polygonEdits[i].uuid === uuid) {
        this._polygonEdits[i].height = height;
      }
    }
  }
}

/**
 *
 * @param {*} tileRectangle 经度和纬度坐标的二维区域
 * @returns
 */
function rectangleToPolygon(tileRectangle) {
  // 将弧度转换为度数
  let westD = CesiumMath.toDegrees(tileRectangle.west);
  let southD = CesiumMath.toDegrees(tileRectangle.south);
  let eastD = CesiumMath.toDegrees(tileRectangle.east);
  let northD = CesiumMath.toDegrees(tileRectangle.north);
  // 使用turf.js进行构造多边形
  let polygon = turf.polygon([
    [
      [westD, northD],
      [eastD, northD],
      [eastD, southD],
      [westD, southD],
      [westD, northD]
    ]
  ]);
  return polygon;
}

/**
 * 细分地形瓦片（进行细分的目的是解决压平的多边形区域的边缘处粗糙问题）
 * @param {*} terrainData 瓦片的地形数据
 */
function subdivisionTerrainTile(terrainData) {
  // 对地形数据中的position和index进行处理，改成便于网格化细分的数据
  positionToNonIndexed(terrainData);

  // 进行网格化细分（LoopSubdivision是我封装好的网格化细分算法）
  let quantizedVerticesNew = LoopSubdivision.modify(terrainData._quantizedVertices, 4, 2500);
  terrainData._quantizedVertices = quantizedVerticesNew;

  let indicesLength = quantizedVerticesNew.length / 3;
  let newIndices = new Uint16Array(indicesLength);
  for (let i = 0; i < indicesLength; i++) {
    newIndices[i] = i;
  }
  terrainData._indices = newIndices;
}

/**
 * 将postion与index对应的这种优化方式改为position与index无索引优化的方式
 * @param {*} terrainData 瓦片的地形数据
 */
function positionToNonIndexed(terrainData) {
  // position与index的这种索引优化可以复用position数据，减少内存，但是在后续进行网格化细分的时候不好计算处理，所以先进行这步处理。
  let quantizedVertices = terrainData._quantizedVertices;
  let indices = terrainData._indices;

  let itemSize = 3;
  let indicesLength = indices.length;
  let quanLength = quantizedVertices.length / 3;

  const quantizedVerticesNew = new Uint16Array(indicesLength * itemSize);
  const indicesNew = new Uint16Array(indicesLength);

  for (let i = 0, len = indicesLength; i < len; i++) {
    let index = indices[i];

    quantizedVerticesNew[i] = quantizedVertices[index];
    quantizedVerticesNew[i + indicesLength] = quantizedVertices[index + quanLength];
    quantizedVerticesNew[i + indicesLength * 2] = quantizedVertices[index + quanLength * 2];

    indicesNew[i] = i;
  }

  let westIndices = changeWsenIndices(terrainData._westIndices, quantizedVertices, quantizedVerticesNew);
  let southIndices = changeWsenIndices(terrainData._southIndices, quantizedVertices, quantizedVerticesNew);
  let eastIndices = changeWsenIndices(terrainData._eastIndices, quantizedVertices, quantizedVerticesNew);
  let northIndices = changeWsenIndices(terrainData._northIndices, quantizedVertices, quantizedVerticesNew);

  terrainData._quantizedVertices = quantizedVerticesNew;
  terrainData._indices = indicesNew;
  terrainData._westIndices = westIndices;
  terrainData._southIndices = southIndices;
  terrainData._eastIndices = eastIndices;
  terrainData._northIndices = northIndices;
}

function changeWsenIndices(indices, quantizedVertices, quantizedVerticesNew) {
  let quanLength = quantizedVertices.length / 3;
  let quanNewLength = quantizedVerticesNew.length / 3;

  let indicesNew = [];
  for (let w = 0, wl = indices.length; w < wl; w++) {
    let index = indices[w];

    let p1 = quantizedVertices[index];
    let p2 = quantizedVertices[index + quanLength];
    let p3 = quantizedVertices[index + quanLength * 2];

    for (let p = 0; p < quanNewLength; p++) {
      if (
        p1 === quantizedVerticesNew[p] &&
        p2 === quantizedVerticesNew[p + quanNewLength] &&
        p3 === quantizedVerticesNew[p + quanNewLength * 2]
      ) {
        indicesNew.push(p);
        break;
      }
    }
  }

  return indicesNew;
}

/**
 * 对瓦片数据进行修改，实现压平（对瓦片和压平区域进行范围判断处理，范围内的顶点修改高度值）
 * @param {*} terrainData 瓦片的地形数据
 * @param {*} tileRectangle 经度和纬度坐标的二维区域
 * @param {*} relevantEdits 要压平的区域
 * @returns
 */
function modifyTerrainTile(terrainData, tileRectangle, relevantEdits) {
  const data = terrainData;
  const minimumHeight = data._minimumHeight;
  const maximumHeight = data._maximumHeight;

  const quantizedVertices = data._quantizedVertices;
  const vertexCount = quantizedVertices.length / 3;

  const positions = [];
  for (let i = 0; i < vertexCount; i++) {
    const rawU = quantizedVertices[i];
    const rawV = quantizedVertices[i + vertexCount];
    const rawH = quantizedVertices[i + vertexCount * 2];

    const u = rawU / MAX_SHORT;
    const v = rawV / MAX_SHORT;
    const longitude = CesiumMath.toDegrees(CesiumMath.lerp(tileRectangle.west, tileRectangle.east, u));
    const latitude = CesiumMath.toDegrees(CesiumMath.lerp(tileRectangle.south, tileRectangle.north, v));

    let height = CesiumMath.lerp(minimumHeight, maximumHeight, rawH / MAX_SHORT);

    const currentPoint = turf.point([longitude, latitude]);

    const relevantEdit = relevantEdits.find((edit) => turf.booleanPointInPolygon(currentPoint, edit.polygon));
    if (relevantEdit) {
      if (relevantEdit.height !== null) {
        height = relevantEdit.height;
      }
    }
    positions.push([longitude, latitude, height]);
  }

  const heights = positions.map((p) => p[2]);
  const newMinHeight = Math.min(...heights);
  const newMaxHeight = Math.max(...heights);

  if (newMaxHeight - newMinHeight === 0) {
    positions.forEach((p, i) => {
      const relativeHeight = Math.round(CesiumMath.lerp(0, MAX_SHORT, (p[2] - newMinHeight) / 1));
      quantizedVertices[i + positions.length * 2] = relativeHeight;
    });
  } else {
    positions.forEach((p, i) => {
      const relativeHeight = Math.round(
        CesiumMath.lerp(0, MAX_SHORT, (p[2] - newMinHeight) / (newMaxHeight - newMinHeight))
      );
      quantizedVertices[i + positions.length * 2] = relativeHeight;
    });
  }

  data._minimumHeight = newMinHeight;
  data._maximumHeight = newMaxHeight;

  return data;
}

export default CesiumTerrainProviderEdit;

// https://community.cesium.com/t/terrain-editing-on-the-fly/9695/6

