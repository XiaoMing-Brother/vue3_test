# 使用 pnpm 运行项目

本项目已配置为使用 pnpm 作为包管理器。

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 安装 pnpm

如果还没有安装 pnpm，请先安装：

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 yarn 安装
yarn global add pnpm

# 或使用官方安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 项目运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式运行

```bash
pnpm dev
```

### 3. 构建项目

```bash
pnpm build
```

### 4. 预览构建结果

```bash
pnpm preview
```

## 常用命令

```bash
# 安装依赖
pnpm install

# 添加新依赖
pnpm add <package-name>

# 添加开发依赖
pnpm add -D <package-name>

# 删除依赖
pnpm remove <package-name>

# 更新依赖
pnpm update

# 清理缓存
pnpm clean

# 运行脚本
pnpm <script-name>
```

## 项目配置

- `package.json`: 包含 pnpm 相关配置和脚本
- `.npmrc`: pnpm 特定配置
- `pnpm-workspace.yaml`: 工作区配置

## 注意事项

1. 项目使用 pnpm 的 workspace 功能
2. 依赖存储在本地 `.pnpm-store` 目录
3. 启用了 `shamefully-hoist` 以确保兼容性
4. 自动安装 peer dependencies

