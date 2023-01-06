/*
 * @Descripttion: 自定义弹窗
 * @Author: 笙痞
 * @Date: 2023-01-06 10:36:19
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-06 16:59:15
 */
import * as Cesium from "cesium";
import { createApp, h } from "vue";
import Popup from "@/components/Dialog/Popup.vue";

export default class Dialog {
  constructor(opts) {
    const { viewer, position, ...rest } = opts;
    this.viewer = viewer;
    this.position = position._value;
    const { vmInstance } = createDialog({
      ...rest, // 主要是弹窗内容
      closeEvent: this.windowClose.bind(this),
    });
    if (this.vmInstance) {
      this.windowClose.bind(this);
    } else {
      this.vmInstance = vmInstance;
    }

    viewer.cesiumWidget.container.appendChild(vmInstance.$el);
    this.addPostRender();
  }
  //添加场景事件
  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRender, this);
  }
  postRender() {
    if (!this.vmInstance.$el || !this.vmInstance.$el.style) return;
    const canvasHeight = this.viewer.scene.canvas.height;
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      this.position,
      windowPosition
    );
    this.vmInstance.$el.style.bottom =
      canvasHeight - windowPosition.y + 260 + "px";
    const elWidth = this.vmInstance.$el.offsetWidth;
    this.vmInstance.$el.style.left =
      windowPosition.x - elWidth / 2 + 110 + "px";

    const camerPosition = this.viewer.camera.position;
    let height =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        camerPosition
      ).height;
    height += this.viewer.scene.globe.ellipsoid.maximumRadius;
    if (
      !(Cesium.Cartesian3.distance(camerPosition, this.position) > height) &&
      this.viewer.camera.positionCartographic.height < 50000000
    ) {
      this.vmInstance.$el.style.display = "block";
    } else {
      this.vmInstance.$el.style.display = "none";
    }
  }
  //关闭
  windowClose() {
    if (this.vmInstance) {
      this.vmInstance.$el.remove();
    }
    this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
  }
}

let parentNode = null;
/**
 * @description: 渲染弹窗组件并插入div中
 * @param {*} opts 弹窗内容
 * @return {*}
 */
const createDialog = (opts) => {
  if (parentNode) {
    document.body.removeChild(parentNode);
    parentNode = null;
  }
  const app = createApp({
    render() {
      return h(
        Popup,
        {
          ...opts,
        },
        {
          title: () => opts.slotTitle,
          content: () => opts.slotContent,
        }
      );
    },
  });

  parentNode = document.createElement("div");
  const instance = app.mount(parentNode);
  document.body.appendChild(parentNode);

  return {
    vmInstance: instance,
  };
};
