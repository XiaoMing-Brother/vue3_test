import teamIcon from "@images/menu/team.svg?url";

export const menuItems = [
  {
    id: 1,
    path: "/team",
    name: "team",
    component: () => import("@/views/team/team.vue"),
    meta: {
      name: "人才团队数据",
      icon: teamIcon,
    },
  },
];
