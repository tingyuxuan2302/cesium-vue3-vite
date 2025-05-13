<!--
 * @Description:
 * @Author: 笙痞77
 * @Date: 2025-01-13 17:44:07
 * @LastEditors: 笙痞77
 * @LastEditTime: 2025-05-06 16:01:09
-->

# 教程

如有需要《Cesium 从入门到实战》教程的请 + 微信：brown_7778 课程 V1.0 版本已完结，详情请戳：https://ww7rybwvygd.feishu.cn/docx/PG1TdAhK0oASyZxluGqciO7BnSg

可以优先锁定早鸟价格，后续会阶梯式涨价！

# Vue 3 + Vite

项目基于 vue3 + vite + cesium，已实现常见三维动画场景，效果浏览：[https://tingyuxuan2302.github.io/cesium-vue3-vite/#/](https://tingyuxuan2302.github.io/cesium-vue3-vite/#/)

# 欢迎交流

> 微信：**brown_7778**

## 项目启动

```
npm i
npm run dev

// 安装失败的把node_modules删掉，用yarn安装
yarn install
```

## 功能（已完成）

- 粒子效果
  - [x] 下雨
  - [x] 下雪
  - [x] 雾天
  - [x] 火焰
- POI 点位
  - [x] 基础打点
  - [x] 聚合
  - [x] primitive 底层打点（性能佳）
  - [x] primitive 聚合（性能佳）
  - [x] 点位动态弹窗
- 第三方服务加载
  - [x] xyz 瓦片
  - [x] 3D Tiles
- 材质
  - [x] 道路闪烁
  - [x] 道路流光效果
  - [x] 辐射圈
  - [x] 圆扩散
  - [x] 四色图
  - [x] 流动的水面
  - [x] 天空盒
  - [x] 电子围栏
  - [x] 多边形扩散墙
- 几何
  - [x] 基本要素
  - [x] 量测
  - [x] 点线面绘制
  - [x] 态势图、箭头
  - [x] 地形压平
  - [x] 模型压平
- 场景
  - [x] 水淹模拟
  - [x] 热力图
  - [x] 时间轴
  - [x] 遮罩反选（边界）
- 分析
  - [x] 天际线分析
  - [x] 等高线分析
  - [x] 可视域分析
  - [x] 方量（填挖方）分析
- 模型

  - [x] 卫星轨道 czml

- 进阶功能
  - [x] 动态网格水
  - [x] 3D 风场
  - [x] 模型插值运动
  - [x] 视频投射
  - [x] 数据自动化生成道路模型
  - [x] 雷达发射波
  - [x] GUI 视锥体
  - [x] 楼栋分层
  - [x] 地形挖洞
  - [x] gif 动图
  - [x] 台风气象模拟

## TODO

### 计划（需求收集中...）

- [ ] 三维动画网格热图

### 优化

- [ ] 量测工具性能卡顿
- [x] 火焰粒子效果不太好看（虽然已经优化过一版，但是感觉还是差点意思，如有更好效果欢迎交流）
- [x] 基于 primitive 实现点聚合效果
- [x] 3dtiles 加载缓慢，尝试使用异步方法优化
