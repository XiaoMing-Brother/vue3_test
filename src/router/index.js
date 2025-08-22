import { createRouter, createWebHashHistory } from "vue-router";
import { menuItems } from "./menuItems";

// 基础路由
const baseRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
  },
];

// 主路由和子路由
const mainRoutes = [
  {
    path: "/",
    component: () => import("@/views/index/index.vue"),

    redirect: "/workspace",
    children: [...menuItems],
  },
];

// 合并所有路由
const routes = [...baseRoutes, ...mainRoutes];

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
  // 动态导入避免循环依赖
  const { useGlobalStore } = await import("@/store/modules/global");

  const globalStore = useGlobalStore();
  globalStore.setName(to.meta.name);
});

export default router;
