/*
 * @Descripttion:
 * @Author: 笙痞
 * @Date: 2022-10-13 16:54:33
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-11-22 15:30:35
 */
const EmptyRouterView = () =>
  import("@/views/routerViews/emptyRouterViews.vue");
const routes = [
  {
    path: "/particle",
    component: EmptyRouterView,
    meta: {
      title: "粒子效果",
    },
    children: [
      {
        path: "snow",
        name: "particle_snow",
        component: () => import("@/views/particle/snow.vue"),
        meta: {
          title: "下雪",
          activePath: "/particle/snow",
        },
      },
      {
        path: "rain",
        name: "particle_rain",
        component: () => import("@/views/particle/rain.vue"),
        meta: {
          title: "下雨",
          activePath: "/particle/rain",
        },
      },
      {
        path: "fog",
        name: "particle_fog",
        component: () => import("@/views/particle/fog.vue"),
        meta: {
          title: "大雾",
          activePath: "/particle/fog",
        },
      },
      {
        path: "fire",
        name: "particle_fire",
        component: () => import("@/views/particle/fire.vue"),
        meta: {
          title: "火焰",
          activePath: "/particle/fire",
        },
      },
    ],
  },
  {
    path: "/camera",
    component: EmptyRouterView,
    meta: {
      title: "相机",
    },
    children: [
      {
        path: "fly",
        name: "camera_fly",
        component: () => import("@/views/camera/fly.vue"),
        meta: {
          title: "飞行",
          activePath: "/camera/fly",
        },
      },
    ],
  },
  {
    path: "/mark",
    component: EmptyRouterView,
    meta: {
      title: "打点",
    },
    children: [
      {
        path: "primitive",
        name: "mark_primitive",
        component: () => import("@/views/mark/primitive.vue"),
        meta: {
          title: "底层打点",
          activePath: "/mark/primitive",
        },
      },
      {
        path: "combine",
        name: "mark_combine",
        component: () => import("@/views/mark/combine.vue"),
        meta: {
          title: "聚合",
          activePath: "/mark/combine",
        },
      },
    ],
  },
  {
    path: "/renderServe",
    component: EmptyRouterView,
    meta: {
      title: "服务加载",
    },
    children: [
      {
        path: "xyz",
        name: "renderServe_xyz",
        component: () => import("@/views/renderServe/xyz.vue"),
        meta: {
          title: "xyz瓦片",
          activePath: "/renderServe/xyz",
        },
      },
      {
        path: "3dtiles",
        name: "renderServe_3dtiles",
        component: () => import("@/views/renderServe/3dtiles.vue"),
        meta: {
          title: "3D Tiles",
          activePath: "/renderServe/3dtiles",
        },
      },
    ],
  },
  {
    path: "/material",
    component: EmptyRouterView,
    meta: {
      title: "材质",
    },
    children: [
      {
        path: "highlightRoad",
        name: "material_highlightRoad",
        component: () => import("@/views/material/highlightRoad.vue"),
        meta: {
          title: "道路闪烁",
          activePath: "/material/highlightRoad",
        },
      },
      {
        path: "throughRoad",
        name: "material_throughRoad",
        component: () => import("@/views/material/throughRoad.vue"),
        meta: {
          title: "道路穿梭",
          activePath: "/material/throughRoad",
        },
      },
      {
        path: "radiant",
        name: "material_radiant",
        component: () => import("@/views/material/radiant.vue"),
        meta: {
          title: "辐射圈",
          activePath: "/material/radiant",
        },
      },
      {
        path: "diffuse",
        name: "material_diffuse",
        component: () => import("@/views/material/diffuse.vue"),
        meta: {
          title: "圆扩散",
          activePath: "/material/diffuse",
        },
      },
      {
        path: "colorLayer",
        name: "material_colorLayer",
        component: () => import("@/views/material/colorLayer.vue"),
        meta: {
          title: "四色图",
          activePath: "/material/colorLayer",
        },
      },
      {
        path: "water",
        name: "material_water",
        component: () => import("@/views/material/water.vue"),
        meta: {
          title: "流动水面",
          activePath: "/material/water",
        },
      },
      {
        path: "skybox",
        name: "material_skybox",
        component: () => import("@/views/material/skybox.vue"),
        meta: {
          title: "天空盒",
          activePath: "/material/skybox",
        },
      },
    ],
  },
  {
    path: "/geometry",
    component: EmptyRouterView,
    meta: {
      title: "几何",
    },
    children: [
      {
        path: "measure",
        name: "geometry_measure",
        component: () => import("@/views/geometry/measure.vue"),
        meta: {
          title: "量测",
          activePath: "/geometry/measure",
        },
      },
      {
        path: "draw",
        name: "geometry_draw",
        component: () => import("@/views/geometry/draw.vue"),
        meta: {
          title: "绘制",
          activePath: "/geometry/draw",
        },
      },
      {
        path: "arrow",
        name: "geometry_arrow",
        component: () => import("@/views/geometry/arrow.vue"),
        meta: {
          title: "态势图",
          activePath: "/geometry/arrow",
        },
      },
    ],
  },
  {
    path: "/scene",
    component: EmptyRouterView,
    meta: {
      title: "场景",
    },
    children: [
      {
        path: "waterFlood",
        name: "scene_waterFlood",
        component: () => import("@/views/scene/waterFlood.vue"),
        meta: {
          title: "水淹模拟",
          activePath: "/scene/waterFlood",
        },
      },
      {
        path: "heatMap",
        name: "scene_heatMap",
        component: () => import("@/views/scene/heatMap.vue"),
        meta: {
          title: "热力图",
          activePath: "/scene/heatMap",
        },
      },
      {
        path: "timeLine",
        name: "scene_timeLine",
        component: () => import("@/views/scene/timeLine.vue"),
        meta: {
          title: "时间轴",
          activePath: "/scene/timeLine",
        },
      },
      {
        path: "maskReverseSelect",
        name: "scene_maskReverseSelect",
        component: () => import("@/views/scene/maskReverseSelect.vue"),
        meta: {
          title: "遮罩反选",
          activePath: "/scene/maskReverseSelect",
        },
      },
    ],
  },
  {
    path: "/analysis",
    component: EmptyRouterView,
    meta: {
      title: "分析",
    },
    children: [
      {
        path: "skyLine",
        name: "analysis_skyLine",
        component: () => import("@/views/analysis/skyLine.vue"),
        meta: {
          title: "天际线分析",
          activePath: "/analysis/skyLine",
        },
      },
      {
        path: "elevation",
        name: "analysis_elevation",
        component: () => import("@/views/analysis/elevation.vue"),
        meta: {
          title: "高程（限高）分析",
          activePath: "/analysis/elevation",
        },
      },
    ],
  },
  // {
  //   path: "/lowCode",
  //   component: EmptyRouterView,
  //   meta: {
  //     title: "低代码平台",
  //   },
  //   children: [
  //     {
  //       path: "set",
  //       name: "lowCode_set",
  //       component: () => import("@/views/lowCode/lowCode.vue"),
  //       meta: {
  //         title: "配置",
  //         activePath: "/lowCode/set",
  //       },
  //     },
  //   ],
  // },
];

export default routes;
