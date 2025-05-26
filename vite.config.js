import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import VueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite"; // 按需自动加载API插件

import postCssPxToRem from "postcss-pxtorem";

export default defineConfig({
  root: process.cwd(), // 项目根目录（index.html 文件所在的位置）
  base: "./", // 开发或生产环境服务的公共基础路径。
  // 插件配置
  plugins: [
    VueDevTools(),
    vue(),
    svgLoader(), // 添加 SVG Loader
    AutoImport({ imports: ["vue", "vue-router"] }),
  ],

  assetsInclude: ["**/*.svg"],
  server: {
    host: "0.0.0.0", // 指定服务器应该监听哪个 IP 地址，默认localhost，可设置为'0.0.0.0'或 tru
    port: 10086, // 端口号，默认5173
    open: true, // 开发服务器启动时，自动在浏览器中打开应用程序
    proxy: {
      "/api": {
        target: "http://192.168.10.211:8001/", //测试
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    // "/ws": {
    //   // target: "ws://192.168.10.34:8090/", // zw
    //   // target: "ws://192.168.10.70:8090/", //lqz
    //   target: "ws://119.45.247.57/", //测试
    //   ws: true, // 启用 WebSocket 代理
    //   changeOrigin: true,
    // },
  },
  resolve: {
    // 文件路径别名，当使用文件系统路径的别名时，请始终使用绝对路径。
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@style": path.resolve(__dirname, "./src/assets/style"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
      "@audio": path.resolve(__dirname, "./src/assets/audio"),
    },
    // 导入时想要省略的扩展名列表。 vite官方不建议忽略自定义导入类型的扩展名（例如：.vue），因为它会影响 IDE 和类型支持。
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    // devSourcemap: true, // 可以查看 CSS 的源码
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 16, // 1rem的大小
          propList: ["*"], // 需要转换的属性，*代表全部转换
        }),
      ],
    },
  },
  build: {
    outDir: "dist", // 默认dist，打包后输出文件
    assetsDir: "assets", // 默认assets，指定静态资源存放路径
    sourcemap: false, // 默认false，是否构建sourcemap文件（生产不需要）
    emptyOutDir: false,
    terserOptions: {
      // 生产环境移除console、debugger
      compress: {
        drop_console: true, // 默认false
        drop_debugger: true, // 默认true
      },
    },
  },
});
