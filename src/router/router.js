/*
 * @Descripttion:
 * @Author: 笙痞
 * @Date: 2022-10-13 16:54:33
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-05 11:06:44
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
];

export default routes;
