import teamIcon from "@images/menu/QRcode.svg?url";

export const menuItems = [
  {
    id: 1,
    path: "/team",
    name: "team",
    component: () => import("@/views/team/team.vue"),
    meta: {
      name: "二维码下载",
      icon: teamIcon,
    },
  },
];
