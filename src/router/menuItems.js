import teamIcon from "@images/menu/QRcode.svg?url";

export const menuItems = [
  {
    id: 1,
    path: "/QRcode",
    name: "QRcode",
    component: () => import("@/views/QRcode/QRcode.vue"),
    meta: {
      name: "二维码下载",
      icon: teamIcon,
    },
  },
  {
    id: 2,
    path: "/QRcode/editTeam",
    name: "EditTeam",
    component: () => import("@/views/QRcode/editTeam.vue"),
    meta: {
      name: "编辑团队",
      icon: teamIcon,
    },
  },
  {
    id: 3,
    path: "/dark",
    name: "Dark",
    component: () => import("@/views/dark/dark.vue"),
    meta: {
      name: "黑暗模式",
      icon: teamIcon,
    },
  },
];
