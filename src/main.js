import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "@/assets/style/style.css";
import "@/assets/style/global.less";

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

app.use(createPinia());
app.use(router);
app.mount("#app");
