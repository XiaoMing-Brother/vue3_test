import { defineStore } from "pinia";

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useGlobalStore = defineStore("global", {
  state: () => {
    return {
      pageName: "人才团队数据",
      menuList: [],
      authList: [],
      diashow: false,
      list: [],
    };
  },
  actions: {
    setName(name) {
      this.pageName = name;
    },
    // setMenuParentId(id) {
    //   this.menuParentId = id;
    // },
    setMenuList(data) {
      this.menuList = data;
    },
    setModuleList(data) {
      this.authList = data;
    },
    setDiashow(data, show) {
      this.list = data;
      this.diashow = show;
    },
  },
});
