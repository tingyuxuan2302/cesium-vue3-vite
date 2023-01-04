/*
 * @Descripttion:
 * @Author: 笙痞
 * @Date: 2022-10-13 16:54:33
 * @LastEditors: 笙痞
 * @LastEditTime: 2023-01-04 18:15:24
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
];

export default routes;
