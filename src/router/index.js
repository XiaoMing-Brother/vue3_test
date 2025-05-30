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
  // let token = sessionStorage.getItem("token");
  // let login = token ? true : false;
  // if (!login && to.path !== "/login") {
  //   router.push({
  //     name: "login",
  //   });
  // }
  const globalStore = useGlobalStore();
  globalStore.setName(to.meta.name);
});

export default router;
