/*
 * @Description: 绘制工具
 * @Author: 笙痞77
 * @Date: 2023-02-02 11:28:21
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-02-02 14:52:35
 */
import * as Cesium from "cesium";

export default class DrawTool {
  /**
   * 构造函数
   * @param viewer
   */
  constructor(viewer) {
    this.viewer = viewer;
    this._drawHandler = null; //事件
    this._dataSource = null; //存储entities
    this._tempPositions = []; //存储点集合
    this._mousePos = null; //移动点
    this._drawType = null; //类型
  }

  /**
   * 激活点线面
   * @param drawType
   */
  activate(drawType) {
    this.clearAll();
    this._drawType = drawType;
    this._dataSource = new Cesium.CustomDataSource("_dataSource");
    this.viewer.dataSources.add(this._dataSource);
    this._registerEvents(); //注册鼠标事件
  }

  /**
   * 注册鼠标事件
   */
  _registerEvents() {
    this._drawHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度测试
    switch (this._drawType) {
      case "Point": {
        this._leftClickEventForPoint();
        break;
      }
      case "Polyline": {
        this._leftClickEventForPolyline();
        this._mouseMoveEventForPolyline();
        this._rightClickEventForPolyline();
        break;
      }
      case "Polygon": {
        this._leftClickEventForPolygon();
        this._mouseMoveEventForPolygon();
        this._rightClickEventForPolygon();
        break;
      }
    }
  }

  /**
   * 鼠标事件之绘制点的左击事件
   * @private
   */
  _leftClickEventForPoint() {
    this._drawHandler.setInputAction((e) => {
      // this.viewer._element.style.cursor = 'default';
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      //手动给他提高50m，也可以取消哈
      let carto_pt = Cesium.Cartographic.fromCartesian(p);
      let p1 = [
        Cesium.Math.toDegrees(carto_pt.longitude),
        Cesium.Math.toDegrees(carto_pt.latitude),
        carto_pt.height + 50,
      ];
      this._addPoint(p1);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 鼠标事件之绘制线的左击事件
   * @private
   */
  _leftClickEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      this._tempPositions.push(p);
      this._addPolyline();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 鼠标事件之绘制线的移动事件
   * @private
   */
  _mouseMoveEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.endPosition);
      if (!p) return;
      this._mousePos = p;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 鼠标事件之绘制线的右击事件
   * @private
   */
  _rightClickEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      this._removeAllEvent();
      this._dataSource.entities.removeAll();
      this._dataSource.entities.add({
        polyline: {
          positions: this._tempPositions,
          clampToGround: true, //贴地
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
        },
      });
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 鼠标事件之绘制面的左击事件
   * @private
   */
  _leftClickEventForPolygon() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      this._tempPositions.push(p);
      this._addPolygon();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 鼠标事件之绘制面的移动事件
   * @private
   */
  _mouseMoveEventForPolygon() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.endPosition);
      if (!p) return;
      this._mousePos = p;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 鼠标事件之绘制面的右击事件
   * @private
   */
  _rightClickEventForPolygon() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      this._tempPositions.push(this._tempPositions[0]);
      this._removeAllEvent();
      this._dataSource.entities.removeAll();
      this._dataSource.entities.add({
        polyline: {
          positions: this._tempPositions,
          clampToGround: true, //贴地
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
        },
        polygon: {
          hierarchy: this._tempPositions,
          extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          material: Cesium.Color.RED.withAlpha(0.4),
          clampToGround: true,
        },
      });
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 移除所有鼠标事件
   * @private
   */
  _removeAllEvent() {
    this._drawHandler &&
      (this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      ),
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      ),
      this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      ),
      this._drawHandler.destroy(),
      (this._drawHandler = null));
  }

  /**
   * 重置所有参数
   * @private
   */
  _resetParams() {
    if (this._dataSource != null) {
      this._dataSource.entities.removeAll();
      this.viewer.dataSources.remove(this._dataSource);
    }
    this._dataSource = null;
    this._tempPositions = [];
    this._mousePos = null;
    this._drawType = null;
  }

  /**
   * 清除
   */
  clearAll() {
    this._removeAllEvent();
    this._resetParams();
  }

  /**
   * 画点
   * @param p
   * @private
   */
  _addPoint(p) {
    this._dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2]),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2,
        // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
      },
    });
  }

  /**
   * 画线
   * @private
   */
  _addPolyline() {
    this._dataSource.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          let c = Array.from(this._tempPositions);
          if (this._mousePos) {
            c.push(this._mousePos);
          }
          return c;
        }, false),
        clampToGround: true, //贴地
        width: 3,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
      },
    });
  }

  /**
   * 画面
   * @private
   */
  _addPolygon() {
    if (this._tempPositions.length == 1) {
      //一个顶点+移动点
      this._dataSource.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            let c = Array.from(this._tempPositions);
            if (this._mousePos) {
              c.push(this._mousePos);
            }
            return c;
          }, false),
          clampToGround: true, //贴地
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
        },
      });
    } else {
      this._dataSource.entities.removeAll();
      //两个顶点+移动点
      this._dataSource.entities.add({
        polygon: {
          hierarchy: new Cesium.CallbackProperty(() => {
            let poss = Array.from(this._tempPositions);
            if (this._mousePos) {
              poss.push(this._mousePos);
            }
            return new Cesium.PolygonHierarchy(poss);
          }, false),
          extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          material: Cesium.Color.RED.withAlpha(0.4),
          clampToGround: true,
        },
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            let c = Array.from(this._tempPositions);
            if (this._mousePos) {
              c.push(this._mousePos);
              c.push(c[0]); //与第一个点相连
            }
            return c;
          }, false),
          clampToGround: true, //贴地
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
        },
      });
    }
  }
}
