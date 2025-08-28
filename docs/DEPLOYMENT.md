# 部署指南

## 概述

本文档详细说明如何将 Vue 3 管理系统部署到不同的环境中。

## 环境要求

### 开发环境

- **Node.js**: `^20.19.0` 或更高版本
- **pnpm**: `^10.14.0` 或更高版本
- **Git**: 用于版本控制

### 生产环境

- **Web 服务器**: Nginx、Apache 或 CDN
- **Node.js**: 用于构建过程
- **SSL 证书**: 用于 HTTPS 支持

## 构建流程

### 1. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 2. 环境配置

#### 开发环境配置

```bash
# .env.development
VITE_API_URL=http://192.168.10.211:8001
VITE_WITH_CREDENTIALS=true
VITE_APP_TITLE=Vue 管理系统 (开发环境)
```

#### 生产环境配置

```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_WITH_CREDENTIALS=true
VITE_APP_TITLE=Vue 管理系统
```

### 3. 构建项目

```bash
# 构建生产环境版本
pnpm build:prod

# 或构建开发环境版本
pnpm build:dev

# 预览构建结果
pnpm preview
```

构建完成后，会在 `dist` 目录生成以下文件：

```
dist/
├── index.html          # 主页面
├── assets/             # 静态资源
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript 文件
│   └── images/        # 图片资源
└── favicon.ico        # 网站图标
```

## 部署方式

### 1. 静态文件部署

#### Nginx 部署

1. **安装 Nginx**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **配置 Nginx**

```nginx
# /etc/nginx/sites-available/vue-admin
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/vue-admin;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # API 代理 (如果需要)
    location /api/ {
        proxy_pass http://your-backend-server/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

3. **启用站点**

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/vue-admin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

4. **部署文件**

```bash
# 复制构建文件到服务器
sudo cp -r dist/* /var/www/vue-admin/

# 设置权限
sudo chown -R www-data:www-data /var/www/vue-admin
sudo chmod -R 755 /var/www/vue-admin
```

#### Apache 部署

1. **配置 Apache**

```apache
# /etc/apache2/sites-available/vue-admin.conf
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/vue-admin

    <Directory /var/www/vue-admin>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # 启用重写模块
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]

    # 静态资源缓存
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </FilesMatch>

    # HTML 文件不缓存
    <FilesMatch "\.html$">
        ExpiresActive On
        ExpiresDefault "access plus 0 seconds"
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>
</VirtualHost>
```

2. **启用站点**

```bash
# 启用重写模块
sudo a2enmod rewrite

# 启用站点
sudo a2ensite vue-admin

# 重启 Apache
sudo systemctl restart apache2
```

### 2. Docker 部署

#### Dockerfile

```dockerfile
# 多阶段构建
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build:prod

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx 配置文件

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  vue-admin:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
```

#### 构建和运行

```bash
# 构建镜像
docker build -t vue-admin .

# 运行容器
docker run -d -p 80:80 --name vue-admin-app vue-admin

# 或使用 Docker Compose
docker-compose up -d
```

### 3. CDN 部署

#### 阿里云 OSS + CDN

1. **上传到 OSS**

```bash
# 安装阿里云 CLI
pip install aliyun-cli

# 配置访问密钥
aliyun configure

# 上传文件
aliyun oss cp dist/ oss://your-bucket-name/ --recursive
```

2. **配置 CDN**

- 在阿里云 CDN 控制台创建加速域名
- 配置源站为 OSS 域名
- 配置缓存策略
- 配置 HTTPS 证书

#### 腾讯云 COS + CDN

1. **上传到 COS**

```bash
# 安装腾讯云 CLI
pip install coscmd

# 配置访问密钥
coscmd config -a SecretId -s SecretKey -b BucketName -r Region

# 上传文件
coscmd upload -r dist/ /
```

2. **配置 CDN**

- 在腾讯云 CDN 控制台创建加速域名
- 配置源站为 COS 域名
- 配置缓存策略
- 配置 HTTPS 证书

### 4. 云服务器部署

#### 使用 PM2 (Node.js 服务器)

1. **安装 PM2**

```bash
npm install -g pm2
```

2. **创建服务器文件**

```javascript
// server.js
const express = require("express");
const path = require("path");
const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, "dist")));

// 处理 Vue Router 的 history 模式
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

3. **PM2 配置**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "vue-admin",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

4. **启动应用**

```bash
# 安装依赖
npm install express

# 启动应用
pm2 start ecosystem.config.js --env production

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## HTTPS 配置

### 使用 Let's Encrypt

1. **安装 Certbot**

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

2. **获取证书**

```bash
sudo certbot --nginx -d your-domain.com
```

3. **自动续期**

```bash
# 测试续期
sudo certbot renew --dry-run

# 添加到 crontab
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

### 使用自签名证书

```bash
# 生成私钥
openssl genrsa -out private.key 2048

# 生成证书
openssl req -new -x509 -key private.key -out certificate.crt -days 365
```

## 性能优化

### 1. 启用 Gzip 压缩

```nginx
# Nginx 配置
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. 配置缓存策略

```nginx
# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 3. 启用 HTTP/2

```nginx
# Nginx 配置
listen 443 ssl http2;
```

### 4. 配置 CDN

- 使用 CDN 加速静态资源
- 配置合适的缓存策略
- 启用 HTTPS

## 监控和日志

### 1. 访问日志

```nginx
# Nginx 配置
access_log /var/log/nginx/vue-admin.access.log;
error_log /var/log/nginx/vue-admin.error.log;
```

### 2. 应用监控

```javascript
// 添加错误监控
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // 发送到监控服务
});

// 添加性能监控
window.addEventListener("load", () => {
  const perfData = performance.getEntriesByType("navigation")[0];
  console.log("Page load time:", perfData.loadEventEnd - perfData.loadEventStart);
});
```

### 3. 健康检查

```nginx
# Nginx 配置
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## 故障排除

### 1. 常见问题

#### 页面刷新 404

**原因**: Vue Router 的 history 模式需要服务器配置

**解决方案**: 配置服务器将所有请求重定向到 index.html

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 静态资源加载失败

**原因**: 路径配置错误

**解决方案**: 检查 vite.config.js 中的 base 配置

```javascript
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/" : "/",
});
```

#### API 请求失败

**原因**: 跨域问题或代理配置错误

**解决方案**: 配置正确的代理或 CORS

```nginx
location /api/ {
    proxy_pass http://your-backend-server/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 2. 调试技巧

```bash
# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 检查端口占用
sudo netstat -tlnp | grep :80

# 检查文件权限
ls -la /var/www/vue-admin/
```

## 自动化部署

### 1. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install -g pnpm && pnpm install

      - name: Build
        run: pnpm build:prod

      - name: Deploy to server
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          source: "dist/*"
          target: "/var/www/vue-admin/"

      - name: Restart Nginx
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            sudo systemctl restart nginx
```

### 2. Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install -g pnpm'
                sh 'pnpm install'
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm build:prod'
            }
        }

        stage('Deploy') {
            steps {
                sh 'rsync -avz dist/ user@server:/var/www/vue-admin/'
                sh 'ssh user@server "sudo systemctl restart nginx"'
            }
        }
    }
}
```

## 安全配置

### 1. 安全头配置

```nginx
# Nginx 配置
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 2. 防火墙配置

```bash
# 只开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. SSL 配置

```nginx
# Nginx SSL 配置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```


