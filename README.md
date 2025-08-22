# Vue 3 管理系统

基于 Vue 3 + Vite + Element Plus 构建的现代化后台管理系统，支持主题切换、响应式设计和多功能模块。

## 🌟 项目特性

- 🎨 **现代化 UI 设计** - 基于 Element Plus 组件库，支持亮色/暗色主题切换
- 📱 **响应式布局** - 支持多设备适配，使用 rem 单位和自动缩放
- 🎯 **模块化架构** - 清晰的目录结构，组件化开发
- 🔧 **主题定制** - 支持自定义主题色和圆角设置
- 📊 **丰富功能** - 包含工作台、二维码生成、异常处理等多个功能模块
- 🚀 **现代化构建** - 基于 Vite 的快速构建和热更新

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

### 开发工具

- **Sass 1.90.0** - CSS 预处理器
- **unplugin-auto-import** - 自动导入插件
- **unplugin-vue-components** - 组件自动导入
- **postcss-pxtorem** - px 转 rem 插件

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
│   │   └── theme-*.scss # 主题样式
│   └── svg/             # SVG 组件
├── components/            # 公共组件
│   ├── layouts/          # 布局组件
│   │   ├── SideBar.vue  # 侧边栏
│   │   ├── header-bar/  # 头部栏
│   │   └── settings-panel/ # 设置面板
│   └── views/           # 视图组件
├── composables/          # 组合式函数
│   ├── useChart.js      # 图表相关
│   ├── useTable.js      # 表格相关
│   └── useTheme.js      # 主题相关
├── enums/               # 枚举定义
├── router/              # 路由配置
│   ├── index.js        # 路由主配置
│   └── menuItems.js    # 菜单项配置
├── store/               # 状态管理
│   └── modules/        # Store 模块
│       ├── global.js   # 全局状态
│       └── settings.js # 设置状态
├── utils/               # 工具函数
│   ├── http/           # HTTP 请求
│   ├── navigation/     # 导航工具
│   ├── theme/          # 主题工具
│   └── ui/             # UI 工具
└── views/               # 页面视图
    ├── index/          # 主页
    ├── login/          # 登录页
    ├── workspace/      # 工作台
    ├── QRcode/         # 二维码功能
    ├── dark/           # 暗色主题演示
    └── exception/      # 异常页面 (403/404/500)
```

## 🎯 主要功能

### 🏠 工作台 (Workspace)

- 系统概览和数据展示
- 快速操作入口

### 🔲 二维码生成 (QRCode)

- 支持文本转二维码
- 二维码下载功能
- 自定义样式设置

### 🌙 主题切换 (Dark Mode)

- 亮色/暗色主题切换
- 自动跟随系统主题
- 自定义主题色
- 自定义圆角设置

### ❌ 异常页面处理

- 403 权限不足页面
- 404 页面未找到
- 500 服务器错误页面

### 🎨 设置面板

- 主题模式切换 (亮色/暗色/自动)
- 主题色自定义
- 圆角大小调节
- 设置本地持久化

## 运行环境要求

- Node.js `^20.19.0` 或更高版本
- pnpm `^10.14.0` 或更高版本

## 快速开始

1.  **安装依赖**

    ```bash
    pnpm install
    ```

2.  **启动开发服务器**

    ```bash
    # 默认启动连接到测试服务器
    pnpm dev
    ```

3.  **构建项目**
    ```bash
    # 构建用于生产环境的版本
    pnpm build:prod
    ```

## 📜 可用脚本

### 🚀 启动开发服务器

```bash
# 启动开发服务器 (默认端口: 10086)
pnpm dev
```

开发服务器配置：

- **端口**: 10086
- **自动打开浏览器**: 是
- **热更新**: 支持
- **代理配置**: API 请求代理到测试服务器

### 🏗 构建项目

```bash
# 构建生产环境版本
pnpm build

# 预览构建结果
pnpm preview
```

### 🔧 其他脚本

```bash
# 批准构建脚本 (解决 esbuild 权限问题)
pnpm approve-builds
```

## ⚙️ 配置说明

### Vite 配置特性

- **路径别名**: 配置了 `@`、`@views`、`@images`、`@utils`、`@stores`、`@styles` 等别名
- **自动导入**: 支持 Vue 3 Composition API 和 Element Plus 组件自动导入
- **SVG 支持**: 集成 SVG 加载器，支持 SVG 作为组件使用
- **SCSS 预处理**: 全局注入变量和混入文件
- **px 转 rem**: 自动将 px 单位转换为 rem (根值: 16px)
- **代码压缩**: 生产环境自动移除 console 和 debugger

### 代理配置

开发环境下，所有 `/api` 请求会被代理到 `http://192.168.10.211:8001/`

### 主题系统

项目支持完整的主题定制系统：

- **主题模式**: `light` | `dark` | `auto`
- **主题色**: 支持 HEX、RGB、RGBA 格式
- **圆角设置**: 0-1rem 范围内自定义
- **本地存储**: 设置自动保存到 localStorage

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/menuItems.js` 中添加路由配置
3. 添加对应的图标和元信息

### 自定义主题

1. 修改 `src/assets/styles/variables.scss` 中的 CSS 变量
2. 在设置面板中调整主题色和圆角
3. 主题设置会自动持久化到本地存储

### 添加新的 API

1. 在 `src/api/` 下创建对应的 API 文件
2. 使用 `src/utils/http/` 中的 HTTP 工具
3. 在组件中通过 composables 使用 API

## ⚠️ 注意事项

### 开发环境

- 确保 Node.js 版本 >= 16.0
- 推荐使用 pnpm 作为包管理器
- 开发服务器默认运行在 10086 端口

### 构建相关

- 构建前确保所有依赖已正确安装
- 如遇到 `esbuild` 相关错误，运行 `pnpm approve-builds`
- 生产构建会自动移除 console 和 debugger 语句

### 样式开发

- 使用 SCSS 预处理器
- 支持 CSS 变量和混入
- 推荐使用 rem 单位以支持响应式
- 全局样式变量在 `src/assets/styles/variables.scss`

### 组件开发

- 优先使用 Composition API
- 支持 Element Plus 组件自动导入
- 图标使用 Element Plus Icons
- SVG 图标可直接作为组件导入

## 🐛 常见问题

### Q: 构建时出现 esbuild 错误？

**A**: 运行 `pnpm approve-builds` 命令批准构建脚本执行权限。

### Q: 样式不生效？

**A**: 检查是否正确导入了 SCSS 文件，确认路径别名配置正确。

### Q: 组件自动导入失败？

**A**: 确认组件名称符合 Element Plus 命名规范，重启开发服务器。

### Q: 主题切换不生效？

**A**: 检查浏览器 localStorage，清除 `app-settings` 缓存后重试。

### Q: API 请求失败？

**A**: 确认代理配置正确，检查后端服务器是否正常运行。

## 📄 许可证

本项目仅供学习和参考使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

---

**开发愉快！** 🎉
