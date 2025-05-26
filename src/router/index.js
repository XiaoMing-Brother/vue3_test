import { createRouter, createWebHashHistory } from "vue-router";
import { useGlobalStore } from "@/store/global";
import { menuItems } from "./menuItems"; // 导入抽离的数据

// 基础路由（不需要图标的路由）
const baseRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
  },
  // 驾驶舱
  {
    path: "/screen",
    name: "screen",
    component: () => import("@/views/screen/index.vue"),
  },
];

// 带有图标的主路由和子路由
const iconRoutes = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    redirect: "/team",

    children: [
      // 1. 带图标的菜单路由
      ...menuItems,

      // 2. 不需要菜单的子路由（如 editTeam）
      {
        path: "/team/editTeam",
        name: "editTeam",
        component: () => import("@/views/team/editTeam.vue"),
        meta: {
          name: "人才团队数据",
        },
      },
      {
        path: "/science/editScience",
        name: "editScience",
        component: () => import("@/views/science/editScience.vue"),
        meta: {
          name: "科创落地介绍",
        },
      },
      {
        path: "/result/editResult",
        name: "editResult",
        component: () => import("@/views/result/editResult.vue"),
        meta: {
          name: "成果转化数据",
        },
      },
    ],
  },
];

// 合并路由
const routes = [...baseRoutes, ...iconRoutes];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeResolve(async (to) => {
  console.log(to);
  let token = sessionStorage.getItem("token");
  let login = token ? true : false;
  if (!login && to.path !== "/login") {
    router.push({
      name: "login",
    });
  }
  const globalStore = useGlobalStore();
  globalStore.setName(to.meta.name);
});

export default router;
