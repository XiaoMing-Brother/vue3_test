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
];
