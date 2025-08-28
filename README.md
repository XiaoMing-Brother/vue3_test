# Vue 3 管理系统

基于 Vue 3 + Vite + Element Plus 构建的现代化后台管理系统，支持主题切换、响应式设计和多功能模块。

## 🌟 项目特性

- 🎨 **现代化 UI 设计** - 基于 Element Plus 组件库，支持亮色/暗色主题切换
- 📱 **响应式布局** - 支持多设备适配，使用 rem 单位和自动缩放
- 🎯 **模块化架构** - 清晰的目录结构，组件化开发
- 🔧 **主题定制** - 支持自定义主题色和圆角设置
- 📊 **丰富功能** - 包含工作台、二维码生成、异常处理等多个功能模块
- 🚀 **现代化构建** - 基于 Vite 的快速构建和热更新
- 🔐 **权限管理** - 完整的路由权限和用户认证系统
- 📦 **批量导出** - 支持二维码批量下载和 ZIP 压缩
- 🎭 **拖拽排序** - 表格数据拖拽排序功能
- 💾 **状态持久化** - 使用 Pinia 进行状态管理，支持本地存储

## 🛠 技术栈

### 核心框架

- **Vue 3.5.19** - 渐进式 JavaScript 框架
- **Vite 7.1.3** - 下一代前端构建工具
- **Vue Router 4.5.1** - Vue.js 官方路由管理器
- **Pinia 3.0.3** - Vue 状态管理库

### UI 组件库

- **Element Plus 2.10.7** - 基于 Vue 3 的组件库
- **Element Plus Icons** - Element Plus 图标库

### 工具库

- **Axios 1.11.0** - HTTP 客户端
- **Day.js 1.11.13** - 轻量级日期处理库
- **QRCode.vue 3.6.0** - 二维码生成组件
- **html2canvas 1.4.1** - 网页截图工具
- **SortableJS 1.15.6** - 拖拽排序库
- **Mitt 3.0.1** - 事件总线
- **JSZip 3.10.1** - ZIP 文件处理
- **FileSaver 2.0.5** - 文件下载工具
- **NProgress 0.2.0** - 进度条组件

### 开发工具

- **Sass 1.90.0** - CSS 预处理器
- **unplugin-auto-import** - 自动导入插件
- **unplugin-vue-components** - 组件自动导入
- **postcss-pxtorem** - px 转 rem 插件
- **vite-svg-loader** - SVG 加载器
- **vite-plugin-vue-devtools** - Vue 开发工具

## 📁 项目结构

```
src/
├── api/                    # API 接口
│   ├── menuApi.js         # 菜单相关接口
│   └── usersApi.js        # 用户相关接口
├── assets/                # 静态资源
│   ├── fonts/            # 字体文件
│   ├── images/           # 图片资源
│   │   ├── icon/        # 图标
│   │   ├── login/       # 登录页图片
│   │   ├── menu/        # 菜单图标
│   │   └── svg/         # SVG 图标
│   ├── styles/          # 样式文件
│   │   ├── app.scss     # 全局样式
│   │   ├── variables.scss # 变量定义
│   │   ├── mixin.scss   # 混入样式
│   │   ├── reset.scss   # 样式重置
│   │   ├── el-ui.scss   # Element Plus 样式优化
│   │   ├── change.scss  # 主题切换过渡
│   │   ├── theme-animation.scss # 主题切换动画
│   │   ├── el-light.scss # Element 亮色主题
│   │   ├── el-dark.scss  # Element 暗色主题
│   │   └── dark.scss     # 系统暗色主题
│   └── svg/             # SVG 组件
├── components/            # 公共组件
│   ├── layouts/          # 布局组件
│   │   ├── SideBar.vue  # 侧边栏
│   │   ├── header-bar/  # 头部栏
│   │   │   ├── TopBar.vue # 顶部导航
│   │   │   └── art-breadcrumb/ # 面包屑导航
│   │   └── settings-panel/ # 设置面板
│   │       ├── SettingsPanel.vue # 主设置面板
│   │       └── widget/   # 设置组件
│   │           ├── ColorPicker.vue # 颜色选择器
│   │           ├── RadiusSettings.vue # 圆角设置
│   │           └── ThemeSelector.vue # 主题选择器
│   ├── backHeader.vue   # 返回头部组件
│   ├── imgSvg.vue       # 图片SVG组件
│   └── views/           # 视图组件
│       └── exception/   # 异常页面组件
├── composables/          # 组合式函数
│   ├── useChart.js      # 图表相关
│   ├── useCommon.js     # 通用功能
│   ├── useTable.js      # 表格相关
│   ├── useTableColumns.js # 表格列配置
│   └── useTheme.js      # 主题相关
├── enums/               # 枚举定义
│   ├── appEnum.js       # 应用枚举
│   └── formEnum.js      # 表单枚举
├── router/              # 路由配置
│   ├── index.js        # 路由主配置
│   └── menuItems.js    # 菜单项配置
├── store/               # 状态管理
│   ├── index.js        # Store 初始化
│   └── modules/        # Store 模块
│       ├── global.js   # 全局状态
│       └── settings.js # 设置状态
├── utils/               # 工具函数
│   ├── axios.js        # Axios 配置
│   ├── config.js       # 配置文件
│   ├── dataprocess/    # 数据处理
│   │   ├── array.js    # 数组处理
│   │   ├── format.js   # 格式化工具
│   │   └── index.js    # 数据处理入口
│   ├── echartsPacking.js # ECharts 打包配置
│   ├── exportQrCode.js # 二维码导出工具
│   ├── http/           # HTTP 请求
│   │   ├── index.js    # HTTP 主配置
│   │   ├── error.js    # 错误处理
│   │   └── status.js   # 状态码定义
│   ├── navigation/     # 导航工具
│   │   ├── index.js    # 导航主工具
│   │   ├── jump.js     # 跳转工具
│   │   ├── route.js    # 路由工具
│   │   └── worktab.js  # 工作标签页
│   ├── storage/        # 存储工具
│   ├── sys/            # 系统工具
│   │   ├── console.js  # 控制台工具
│   │   ├── index.js    # 系统主工具
│   │   ├── mittBus.js  # 事件总线
│   │   └── upgrade.js  # 升级工具
│   ├── table/          # 表格工具
│   │   ├── tableCache.js # 表格缓存
│   │   └── tableUtils.js # 表格工具
│   ├── theme/          # 主题工具
│   │   ├── animation.js # 主题动画
│   │   └── index.js    # 主题主工具
│   ├── ui/             # UI 工具
│   │   ├── colors.js   # 颜色工具
│   │   └── index.js    # UI 主工具
│   ├── index.js        # 工具入口
│   └── useValidator.js # 验证工具
└── views/               # 页面视图
    ├── index/          # 主页
    │   ├── index.vue   # 主页面
    │   └── style.scss  # 主页样式
    ├── login/          # 登录页
    │   └── login.vue   # 登录页面
    ├── workspace/      # 工作台
    │   └── index.vue   # 工作台页面
    ├── QRcode/         # 二维码功能
    │   ├── QRcode.vue  # 二维码主页面
    │   └── components/ # 二维码组件
    │       ├── QrCodeDialog.vue # 二维码弹窗
    │       └── QrContent.vue   # 二维码内容
    ├── dark/           # 暗色主题演示
    │   └── dark.vue    # 暗色主题页面
    └── exception/      # 异常页面 (403/404/500)
        ├── 403/        # 403 权限不足
        ├── 404/        # 404 页面未找到
        └── 500/        # 500 服务器错误
```

## 🎯 主要功能

### 🏠 工作台 (Workspace)

- 系统概览和数据展示
- 快速操作入口
- 数据统计卡片
- 文档管理入口
- 系统设置快捷方式
- 用户管理入口

### 🔲 二维码生成 (QRCode)

- 支持文本转二维码
- 二维码预览功能
- 单个二维码下载
- 批量二维码导出
- ZIP 压缩包下载
- 自定义样式设置
- 拖拽排序功能
- 圆角效果支持

### 🌙 主题切换 (Dark Mode)

- 亮色/暗色主题切换
- 自动跟随系统主题
- 自定义主题色
- 自定义圆角设置
- 主题切换动画
- 设置本地持久化

### ❌ 异常页面处理

- 403 权限不足页面
- 404 页面未找到
- 500 服务器错误页面
- 统一的异常处理组件

### 🎨 设置面板

- 主题模式切换 (亮色/暗色/自动)
- 主题色自定义
- 圆角大小调节
- 设置本地持久化
- 实时预览效果

### 🔐 权限管理

- 路由权限控制
- 用户认证系统
- 登录状态管理
- 权限验证中间件

## 运行环境要求

- **Node.js**: `^20.19.0` 或更高版本
- **pnpm**: `^10.14.0` 或更高版本
- **浏览器**: 支持 ES6+ 的现代浏览器

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd 测试工程
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 启动开发服务器

```bash
# 默认启动连接到测试服务器
pnpm dev
```

### 4. 构建项目

```bash
# 构建用于生产环境的版本
pnpm build:prod

# 预览构建结果
pnpm preview
```

## 📜 可用脚本

### 🚀 开发相关

```bash
# 启动开发服务器 (默认端口: 10086)
pnpm dev

# 启动开发服务器 (指定端口)
pnpm dev --port 3000

# 启动开发服务器 (指定主机)
pnpm dev --host 0.0.0.0
```

开发服务器配置：

- **端口**: 10086
- **自动打开浏览器**: 是
- **热更新**: 支持
- **代理配置**: API 请求代理到测试服务器
- **源码映射**: 支持

### 🏗 构建相关

```bash
# 构建生产环境版本
pnpm build

# 构建并预览
pnpm build && pnpm preview

# 构建开发环境版本
pnpm build:dev
```

### 🔧 其他脚本

```bash
# 批准构建脚本 (解决 esbuild 权限问题)
pnpm approve-builds

# 清理构建缓存
pnpm clean

# 类型检查
pnpm type-check
```

## ⚙️ 配置说明

### Vite 配置特性

#### 路径别名配置

```javascript
alias: {
  "@": path.resolve(__dirname, "./src"),
  "@views": path.resolve(__dirname, "./src/views"),
  "@images": path.resolve(__dirname, "./src/assets/images"),
  "@utils": path.resolve(__dirname, "./src/utils"),
  "@stores": path.resolve(__dirname, "./src/store"),
  "@styles": path.resolve(__dirname, "./src/assets/styles"),
}
```

#### 自动导入配置

- **Vue 3 Composition API**: 自动导入 `ref`, `reactive`, `computed` 等
- **Vue Router**: 自动导入路由相关 API
- **Element Plus**: 自动导入组件和样式

#### SVG 支持

```javascript
// 支持 SVG 作为组件使用
import svgLoader from "vite-svg-loader";

plugins: [svgLoader()];
```

#### SCSS 预处理

```javascript
scss: {
  api: "modern-compiler",
  additionalData: `
    @use "@styles/variables.scss" as *;
    @use "@styles/mixin.scss" as *;
  `,
}
```

#### px 转 rem

```javascript
postCssPxToRem({
  rootValue: 16, // 1rem = 16px
  propList: ["*"], // 转换所有属性
});
```

### 代理配置

开发环境下，所有 `/api` 请求会被代理到 `http://192.168.10.211:8001/`

```javascript
proxy: {
  "/api": {
    target: "http://192.168.10.211:8001/",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
}
```

### 主题系统

项目支持完整的主题定制系统：

#### 主题模式

- **light**: 亮色主题
- **dark**: 暗色主题
- **auto**: 自动跟随系统

#### 主题色设置

- 支持 HEX、RGB、RGBA 格式
- 实时预览效果
- 自动应用到 Element Plus 组件

#### 圆角设置

- 范围: 0-1rem
- 实时应用到全局样式
- 支持自定义组件圆角

#### 本地存储

- 设置自动保存到 localStorage
- 页面刷新后保持设置
- 支持设置重置功能

## 🔧 开发指南

### 添加新页面

1. **创建页面组件**

```vue
<!-- src/views/example/index.vue -->
<template>
  <div class="example-page">
    <h1>示例页面</h1>
  </div>
</template>

<script setup>
// 页面逻辑
</script>

<style lang="scss" scoped>
.example-page {
  padding: 20px;
}
</style>
```

2. **添加路由配置**

```javascript
// src/router/menuItems.js
import exampleIcon from "@images/menu/example.svg?url";

export const menuItems = [
  // ... 现有路由
  {
    id: 5,
    path: "/example",
    name: "Example",
    component: () => import("@/views/example/index.vue"),
    meta: {
      name: "示例页面",
      icon: exampleIcon,
    },
  },
];
```

3. **添加图标**

将图标文件放在 `src/assets/images/menu/` 目录下。

### 自定义主题

1. **修改 CSS 变量**

```scss
// src/assets/styles/variables.scss
:root {
  --art-primary: 93, 135, 255; // 主题色
  --custom-radius: 0.375rem; // 圆角
}
```

2. **在设置面板中调整**

```javascript
// 使用设置 Store
const settingsStore = useSettingsStore();
settingsStore.setPrimaryColor("#5D87FF");
settingsStore.setCustomRadius(0.5);
```

3. **主题设置持久化**

设置会自动保存到 localStorage，无需手动处理。

### 添加新的 API

1. **创建 API 文件**

```javascript
// src/api/exampleApi.js
import api from "@/utils/http";

export const exampleApi = {
  // 获取列表
  getList(params) {
    return api.get({
      url: "/api/example/list",
      params,
    });
  },

  // 创建项目
  create(data) {
    return api.post({
      url: "/api/example/create",
      data,
    });
  },

  // 更新项目
  update(id, data) {
    return api.put({
      url: `/api/example/${id}`,
      data,
    });
  },

  // 删除项目
  delete(id) {
    return api.del({
      url: `/api/example/${id}`,
    });
  },
};
```

2. **在组件中使用**

```vue
<script setup>
import { exampleApi } from "@/api/exampleApi";

const list = ref([]);

const fetchList = async () => {
  try {
    const data = await exampleApi.getList();
    list.value = data;
  } catch (error) {
    console.error("获取列表失败:", error);
  }
};
</script>
```

### 使用组合式函数

1. **创建组合式函数**

```javascript
// src/composables/useExample.js
import { ref, onMounted } from "vue";
import { exampleApi } from "@/api/exampleApi";

export function useExample() {
  const list = ref([]);
  const loading = ref(false);

  const fetchList = async () => {
    loading.value = true;
    try {
      const data = await exampleApi.getList();
      list.value = data;
    } catch (error) {
      console.error("获取列表失败:", error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchList();
  });

  return {
    list,
    loading,
    fetchList,
  };
}
```

2. **在组件中使用**

```vue
<script setup>
import { useExample } from "@/composables/useExample";

const { list, loading, fetchList } = useExample();
</script>
```

### 样式开发规范

1. **使用 SCSS 变量**

```scss
.my-component {
  color: rgb(var(--art-primary));
  background-color: var(--art-main-bg-color);
  border-radius: var(--custom-radius);
}
```

2. **响应式设计**

```scss
.my-component {
  padding: 1rem;

  @media (max-width: $device-ipad) {
    padding: 0.5rem;
  }
}
```

3. **主题适配**

```scss
.my-component {
  background-color: var(--art-main-bg-color);
  border: 1px solid var(--art-border-color);

  &:hover {
    background-color: rgb(var(--art-hoverColor));
  }
}
```

## 🚀 部署指南

### 开发环境部署

1. **构建项目**

```bash
pnpm build
```

2. **预览构建结果**

```bash
pnpm preview
```

### 生产环境部署

1. **构建生产版本**

```bash
pnpm build:prod
```

2. **部署到服务器**

将 `dist` 目录下的文件部署到 Web 服务器。

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api/ {
        proxy_pass http://your-backend-server/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Docker 部署

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制构建文件
COPY dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t vue-admin .

# 运行容器
docker run -d -p 80:80 vue-admin
```

## ⚠️ 注意事项

### 开发环境

- 确保 Node.js 版本 >= 16.0
- 推荐使用 pnpm 作为包管理器
- 开发服务器默认运行在 10086 端口
- 确保后端 API 服务器正常运行

### 构建相关

- 构建前确保所有依赖已正确安装
- 如遇到 `esbuild` 相关错误，运行 `pnpm approve-builds`
- 生产构建会自动移除 console 和 debugger 语句
- 构建后的文件在 `dist` 目录

### 样式开发

- 使用 SCSS 预处理器
- 支持 CSS 变量和混入
- 推荐使用 rem 单位以支持响应式
- 全局样式变量在 `src/assets/styles/variables.scss`
- 主题切换时注意样式兼容性

### 组件开发

- 优先使用 Composition API
- 支持 Element Plus 组件自动导入
- 图标使用 Element Plus Icons
- SVG 图标可直接作为组件导入
- 组件命名使用 PascalCase

### 性能优化

- 使用路由懒加载
- 图片资源优化
- 代码分割和按需加载
- 合理使用缓存策略

## 🐛 常见问题

### Q: 构建时出现 esbuild 错误？

**A**: 运行 `pnpm approve-builds` 命令批准构建脚本执行权限。

### Q: 样式不生效？

**A**:

1. 检查是否正确导入了 SCSS 文件
2. 确认路径别名配置正确
3. 检查浏览器开发者工具中的样式加载情况

### Q: 组件自动导入失败？

**A**:

1. 确认组件名称符合 Element Plus 命名规范
2. 重启开发服务器
3. 检查 `vite.config.js` 中的自动导入配置

### Q: 主题切换不生效？

**A**:

1. 检查浏览器 localStorage，清除 `app-settings` 缓存后重试
2. 确认 CSS 变量定义正确
3. 检查主题切换逻辑是否正常执行

### Q: API 请求失败？

**A**:

1. 确认代理配置正确
2. 检查后端服务器是否正常运行
3. 查看浏览器网络面板的请求详情
4. 检查请求头和认证信息

### Q: 二维码导出失败？

**A**:

1. 确认 html2canvas 依赖已正确安装
2. 检查 DOM 元素是否存在
3. 确认浏览器支持 Canvas API
4. 检查文件下载权限

### Q: 拖拽排序不工作？

**A**:

1. 确认 SortableJS 依赖已正确安装
2. 检查表格 DOM 结构是否正确
3. 确认拖拽事件绑定成功

## 📄 许可证

本项目仅供学习和参考使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue 3 官方风格指南
- 使用 TypeScript 类型注解（可选）
- 编写单元测试（推荐）

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**开发愉快！** 🎉

_最后更新时间: 2024 年 12 月_
