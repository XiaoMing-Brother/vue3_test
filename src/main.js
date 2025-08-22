import { createApp } from "vue";
import { initStore } from "./store";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "@styles/reset.scss"; // 重置HTML样式
import "@styles/app.scss"; // 全局样式
import "@styles/el-ui.scss"; // 优化element样式
import "@styles/change.scss"; // 主题切换过渡优化
import "@styles/theme-animation.scss"; // 主题切换动画
import "@styles/el-light.scss"; // Element 自定义主题（亮色）
import "@styles/el-dark.scss"; // Element 自定义主题（暗色）
import "@styles/dark.scss"; // 系统主题

import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/theme-chalk/dark/css-vars.css";
//创建路由
import router from "./router";
import App from "./App.vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus, {
  locale: zhCn,
});

initStore(app);
app.use(router);
app.mount("#app");
