import teamIcon from "@images/menu/team.svg?url";
import scienceIcon from "@images/menu/science.svg?url";
import resultIcon from "@images/menu/result.svg?url";
import patentIcon from "@images/menu/patent.svg?url";
import honorIcon from "@images/menu/honor.svg?url";

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
  {
    id: 2,
    path: "/science",
    name: "science",
    component: () => import("@/views/science/science.vue"),
    meta: {
      name: "科创落地介绍",
      icon: scienceIcon,
    },
  },
  {
    id: 3,
    path: "/result",
    name: "result",
    component: () => import("@/views/result/result.vue"),
    meta: {
      name: "成果转化数据",
      icon: resultIcon,
    },
  },
  {
    id: 4,
    path: "/patent",
    name: "patent",
    component: () => import("@/views/patent/patent.vue"),
    meta: {
      name: "专利成果数据",
      icon: patentIcon,
    },
  },
  {
    id: 5,
    path: "/honor",
    name: "honor",
    component: () => import("@/views/honor/honor.vue"),
    meta: {
      name: "荣誉奖项",
      icon: honorIcon,
    },
  },
];
