import qrcodeIcon from "@images/menu/QRcode.svg?url";

export const menuItems = [
  {
    id: 1,
    path: "/workspace",
    name: "Workspace",
    component: () => import("@/views/workspace/index.vue"),
    meta: {
      name: "工作台",
      icon: qrcodeIcon,
    },
  },
  {
    id: 2,
    path: "/QRcode",
    name: "QRcode",
    component: () => import("@/views/QRcode/QRcode.vue"),
    meta: {
      name: "二维码下载",
      icon: qrcodeIcon,
    },
  },

  {
    id: 3,
    path: "/dark",
    name: "Dark",
    component: () => import("@/views/dark/dark.vue"),
    meta: {
      name: "黑暗模式",
      icon: qrcodeIcon,
    },
  },
  {
    id: 4,
    path: "/exception",
    name: "Exception",
    meta: {
      name: "异常页面",
      icon: qrcodeIcon,
    },
    children: [
      {
        id: 41,
        path: "/exception/403",
        name: "Exception403",
        component: () => import("@/views/exception/403/index.vue"),
        meta: {
          name: "403",
        },
      },
      {
        id: 42,
        path: "/exception/404",
        name: "Exception404",
        component: () => import("@/views/exception/404/index.vue"),
        meta: {
          name: "404",
        },
      },
      {
        id: 43,
        path: "/exception/500",
        name: "Exception500",
        component: () => import("@/views/exception/500/index.vue"),
        meta: {
          name: "500",
        },
      },
    ],
  },
];
