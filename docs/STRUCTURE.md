# 项目目录结构说明

## 概述

本文档详细说明 Vue 3 管理系统的目录结构，帮助开发者快速理解项目的组织方式。

## 根目录结构

```
项目根目录/
├── docs/                    # 项目文档
│   ├── API.md              # API 接口文档
│   ├── COMPONENTS.md       # 组件开发指南
│   ├── DEPLOYMENT.md       # 部署指南
│   └── STRUCTURE.md        # 目录结构说明 (本文档)
├── public/                  # 静态资源目录
│   └── favicon.ico         # 网站图标
├── src/                     # 源代码目录
├── index.html              # 主页面模板
├── package.json            # 项目配置文件
├── pnpm-lock.yaml          # pnpm 锁定文件
├── pnpm-workspace.yaml     # pnpm 工作区配置
├── README.md               # 项目说明文档
└── vite.config.js          # Vite 构建配置
```

## src 目录结构

### 核心目录

```
src/
├── api/                    # API 接口层
├── assets/                 # 静态资源
├── components/             # 公共组件
├── composables/            # 组合式函数
├── enums/                  # 枚举定义
├── router/                 # 路由配置
├── store/                  # 状态管理
├── utils/                  # 工具函数
├── views/                  # 页面视图
├── App.vue                 # 根组件
└── main.js                 # 应用入口
```

## 详细目录说明

### 1. api/ - API 接口层

```
api/
├── menuApi.js             # 菜单相关接口
└── usersApi.js            # 用户相关接口
```

**作用**: 集中管理所有后端 API 接口，提供统一的接口调用方式。

**特点**:

- 按功能模块划分文件
- 使用统一的 HTTP 工具
- 支持请求拦截和响应处理

**示例**:

```javascript
// api/usersApi.js
import api from "@/utils/http";

export const usersApi = {
  getUsers(params) {
    return api.get({
      url: "/api/users",
      params,
    });
  },
};
```

### 2. assets/ - 静态资源

```
assets/
├── fonts/                 # 字体文件
├── images/                # 图片资源
│   ├── icon/             # 图标文件
│   ├── login/            # 登录页图片
│   ├── menu/             # 菜单图标
│   └── svg/              # SVG 图标
├── styles/                # 样式文件
│   ├── app.scss          # 全局样式
│   ├── variables.scss    # 变量定义
│   ├── mixin.scss        # 混入样式
│   ├── reset.scss        # 样式重置
│   ├── el-ui.scss        # Element Plus 样式优化
│   ├── change.scss       # 主题切换过渡
│   ├── theme-animation.scss # 主题切换动画
│   ├── el-light.scss     # Element 亮色主题
│   ├── el-dark.scss      # Element 暗色主题
│   └── dark.scss         # 系统暗色主题
└── svg/                   # SVG 组件
    └── loading.js         # 加载动画组件
```

**作用**: 存放项目所需的静态资源，包括图片、样式、字体等。

**特点**:

- 按类型分类组织
- 支持主题切换
- 响应式设计支持

### 3. components/ - 公共组件

```
components/
├── layouts/               # 布局组件
│   ├── SideBar.vue       # 侧边栏组件
│   ├── header-bar/       # 头部栏组件
│   │   ├── TopBar.vue    # 顶部导航
│   │   └── art-breadcrumb/ # 面包屑导航
│   └── settings-panel/   # 设置面板
│       ├── SettingsPanel.vue # 主设置面板
│       └── widget/       # 设置组件
│           ├── ColorPicker.vue # 颜色选择器
│           ├── RadiusSettings.vue # 圆角设置
│           └── ThemeSelector.vue # 主题选择器
├── backHeader.vue         # 返回头部组件
├── imgSvg.vue            # 图片SVG组件
└── views/                # 视图组件
    └── exception/        # 异常页面组件
```

**作用**: 存放可复用的组件，提供统一的 UI 组件库。

**特点**:

- 按功能模块组织
- 支持主题定制
- 响应式设计

### 4. composables/ - 组合式函数

```
composables/
├── useChart.js           # 图表相关
├── useCommon.js          # 通用功能
├── useTable.js           # 表格相关
├── useTableColumns.js    # 表格列配置
└── useTheme.js           # 主题相关
```

**作用**: 提供可复用的逻辑函数，遵循 Vue 3 Composition API 规范。

**特点**:

- 逻辑复用
- 响应式支持
- 易于测试

**示例**:

```javascript
// composables/useTheme.js
import { ref, computed } from "vue";
import { useSettingsStore } from "@/store/modules/settings";

export function useTheme() {
  const settingsStore = useSettingsStore();

  const isDark = computed(() => settingsStore.isDarkTheme);

  const toggleTheme = () => {
    settingsStore.setTheme(isDark.value ? "light" : "dark");
  };

  return {
    isDark,
    toggleTheme,
  };
}
```

### 5. enums/ - 枚举定义

```
enums/
├── appEnum.js            # 应用枚举
└── formEnum.js           # 表单枚举
```

**作用**: 定义项目中使用的常量枚举，提供类型安全和代码提示。

**示例**:

```javascript
// enums/appEnum.js
export const AppStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
};

export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};
```

### 6. router/ - 路由配置

```
router/
├── index.js              # 路由主配置
└── menuItems.js          # 菜单项配置
```

**作用**: 管理应用的路由配置和菜单结构。

**特点**:

- 支持路由懒加载
- 菜单权限控制
- 面包屑导航

**示例**:

```javascript
// router/menuItems.js
export const menuItems = [
  {
    id: 1,
    path: "/workspace",
    name: "Workspace",
    component: () => import("@/views/workspace/index.vue"),
    meta: {
      name: "工作台",
      icon: qrcodeIcon,
    },
  },
];
```

### 7. store/ - 状态管理

```
store/
├── index.js              # Store 初始化
└── modules/              # Store 模块
    ├── global.js         # 全局状态
    └── settings.js       # 设置状态
```

**作用**: 使用 Pinia 进行状态管理，支持持久化存储。

**特点**:

- 模块化状态管理
- 支持持久化
- TypeScript 支持

**示例**:

```javascript
// store/modules/settings.js
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    theme: "light",
    primaryColor: "#5D87FF",
  }),

  actions: {
    setTheme(theme) {
      this.theme = theme;
    },
  },
});
```

### 8. utils/ - 工具函数

```
utils/
├── axios.js              # Axios 配置
├── config.js             # 配置文件
├── dataprocess/          # 数据处理
│   ├── array.js         # 数组处理
│   ├── format.js        # 格式化工具
│   └── index.js         # 数据处理入口
├── echartsPacking.js     # ECharts 打包配置
├── exportQrCode.js       # 二维码导出工具
├── http/                 # HTTP 请求
│   ├── index.js         # HTTP 主配置
│   ├── error.js         # 错误处理
│   └── status.js        # 状态码定义
├── navigation/           # 导航工具
│   ├── index.js         # 导航主工具
│   ├── jump.js          # 跳转工具
│   ├── route.js         # 路由工具
│   └── worktab.js       # 工作标签页
├── storage/              # 存储工具
├── sys/                  # 系统工具
│   ├── console.js       # 控制台工具
│   ├── index.js         # 系统主工具
│   ├── mittBus.js       # 事件总线
│   └── upgrade.js       # 升级工具
├── table/                # 表格工具
│   ├── tableCache.js    # 表格缓存
│   └── tableUtils.js    # 表格工具
├── theme/                # 主题工具
│   ├── animation.js     # 主题动画
│   └── index.js         # 主题主工具
├── ui/                   # UI 工具
│   ├── colors.js        # 颜色工具
│   └── index.js         # UI 主工具
├── index.js              # 工具入口
└── useValidator.js       # 验证工具
```

**作用**: 提供各种工具函数，包括 HTTP 请求、数据处理、主题管理等。

**特点**:

- 功能模块化
- 高度复用
- 易于维护

### 9. views/ - 页面视图

```
views/
├── index/                # 主页
│   ├── index.vue        # 主页面
│   └── style.scss       # 主页样式
├── login/               # 登录页
│   └── login.vue        # 登录页面
├── workspace/           # 工作台
│   └── index.vue        # 工作台页面
├── QRcode/              # 二维码功能
│   ├── QRcode.vue       # 二维码主页面
│   └── components/      # 二维码组件
│       ├── QrCodeDialog.vue # 二维码弹窗
│       └── QrContent.vue   # 二维码内容
├── dark/                # 暗色主题演示
│   └── dark.vue         # 暗色主题页面
└── exception/           # 异常页面
    ├── 403/             # 403 权限不足
    ├── 404/             # 404 页面未找到
    └── 500/             # 500 服务器错误
```

**作用**: 存放应用的页面组件，按功能模块组织。

**特点**:

- 按功能模块划分
- 支持路由懒加载
- 组件化开发

## 配置文件说明

### 1. package.json

```json
{
  "name": "my-vue-app",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.19",
    "element-plus": "^2.10.7",
    "pinia": "^3.0.3"
  }
}
```

**作用**: 定义项目的基本信息、依赖和脚本命令。

### 2. vite.config.js

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**作用**: Vite 构建工具的配置文件，定义构建选项和插件。

### 3. pnpm-workspace.yaml

```yaml
packages:
  - "."
```

**作用**: 定义 pnpm 工作区配置，支持 monorepo 项目结构。

## 命名规范

### 1. 文件命名

- **组件文件**: 使用 PascalCase (如 `UserCard.vue`)
- **工具文件**: 使用 camelCase (如 `useTheme.js`)
- **样式文件**: 使用 kebab-case (如 `app.scss`)
- **配置文件**: 使用 camelCase (如 `vite.config.js`)

### 2. 目录命名

- **功能目录**: 使用 camelCase (如 `headerBar`)
- **资源目录**: 使用 kebab-case (如 `assets/images`)
- **工具目录**: 使用 camelCase (如 `utils/http`)

### 3. 变量命名

- **常量**: 使用 UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- **变量**: 使用 camelCase (如 `userName`)
- **组件**: 使用 PascalCase (如 `UserCard`)

## 最佳实践

### 1. 目录组织

- 按功能模块组织文件
- 保持目录结构清晰
- 避免过深的嵌套

### 2. 文件命名

- 使用有意义的名称
- 保持命名一致性
- 遵循项目规范

### 3. 代码组织

- 单一职责原则
- 高内聚低耦合
- 易于维护和扩展

### 4. 文档维护

- 及时更新文档
- 添加必要的注释
- 保持文档同步

## 扩展建议

### 1. 新增功能模块

```
src/
├── views/
│   └── newModule/        # 新功能模块
│       ├── index.vue     # 主页面
│       ├── components/   # 模块组件
│       └── api/          # 模块 API
├── api/
│   └── newModuleApi.js   # 新模块 API
└── store/modules/
    └── newModule.js      # 新模块状态
```

### 2. 新增工具函数

```
utils/
├── newTool/              # 新工具目录
│   ├── index.js         # 工具入口
│   └── helper.js        # 辅助函数
└── newTool.js           # 简单工具文件
```

### 3. 新增组件

```
components/
├── newComponent/         # 新组件目录
│   ├── index.vue        # 主组件
│   ├── components/      # 子组件
│   └── style.scss       # 组件样式
└── NewComponent.vue     # 简单组件文件
```

## 总结

项目的目录结构遵循以下原则：

1. **模块化**: 按功能模块组织代码
2. **可维护性**: 清晰的文件结构和命名规范
3. **可扩展性**: 易于添加新功能和组件
4. **可复用性**: 公共组件和工具函数
5. **一致性**: 统一的代码风格和规范

通过合理的目录结构，可以提高开发效率，降低维护成本，确保项目的可持续发展。


