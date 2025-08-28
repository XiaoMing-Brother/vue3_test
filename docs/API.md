# API 文档

## 概述

本项目使用 Axios 作为 HTTP 客户端，并封装了统一的请求处理、错误处理和重试机制。

## HTTP 工具配置

### 基础配置

```javascript
// src/utils/http/index.js
const axiosInstance = axios.create({
  timeout: 15000, // 请求超时时间
  baseURL: VITE_API_URL, // API 基础地址
  withCredentials: VITE_WITH_CREDENTIALS === "true", // 是否携带凭证
  validateStatus: (status) => status >= 200 && status < 300, // 状态码验证
});
```

### 请求拦截器

```javascript
axiosInstance.interceptors.request.use(
  (request) => {
    // 添加认证头
    const { accessToken } = useUserStore();
    if (accessToken) request.headers.set("Authorization", accessToken);

    // 设置 Content-Type
    if (request.data && !(request.data instanceof FormData) && !request.headers["Content-Type"]) {
      request.headers.set("Content-Type", "application/json");
      request.data = JSON.stringify(request.data);
    }

    return request;
  },
  (error) => {
    showError(createHttpError("请求配置错误", ApiStatus.error));
    return Promise.reject(error);
  }
);
```

### 响应拦截器

```javascript
axiosInstance.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data;
    if (code === ApiStatus.success) return response;
    if (code === ApiStatus.unauthorized) handleUnauthorizedError(msg);
    throw createHttpError(msg || "请求失败", code);
  },
  (error) => {
    if (error.response?.status === ApiStatus.unauthorized) handleUnauthorizedError();
    return Promise.reject(handleError(error));
  }
);
```

## API 方法

### 基础方法

```javascript
import api from "@/utils/http";

// GET 请求
api.get({
  url: "/api/users",
  params: { page: 1, size: 10 },
});

// POST 请求
api.post({
  url: "/api/users",
  data: { name: "John", email: "john@example.com" },
});

// PUT 请求
api.put({
  url: "/api/users/1",
  data: { name: "John Updated" },
});

// DELETE 请求
api.del({
  url: "/api/users/1",
});

// 自定义请求
api.request({
  method: "PATCH",
  url: "/api/users/1",
  data: { status: "active" },
});
```

### 配置选项

```javascript
api.get({
  url: "/api/users",
  params: { page: 1 }, // 查询参数
  headers: { "Custom-Header": "value" }, // 自定义请求头
  timeout: 10000, // 自定义超时时间
  showErrorMessage: false, // 是否显示错误消息
});
```

## 错误处理

### 错误类型

```javascript
// src/utils/http/error.js
export class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "HttpError";
    this.code = code;
  }
}
```

### 状态码定义

```javascript
// src/utils/http/status.js
export const ApiStatus = {
  success: 200,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  requestTimeout: 408,
  internalServerError: 500,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  error: -1,
};
```

### 错误处理示例

```javascript
try {
  const data = await api.get({ url: "/api/users" });
  console.log("成功:", data);
} catch (error) {
  if (error instanceof HttpError) {
    switch (error.code) {
      case ApiStatus.unauthorized:
        // 处理未授权错误
        router.push("/login");
        break;
      case ApiStatus.forbidden:
        // 处理禁止访问错误
        ElMessage.error("没有权限访问此资源");
        break;
      default:
        // 处理其他错误
        ElMessage.error(error.message);
    }
  }
}
```

## 重试机制

### 自动重试

系统会自动对以下状态码进行重试：

- 408 (请求超时)
- 500 (内部服务器错误)
- 502 (网关错误)
- 503 (服务不可用)
- 504 (网关超时)

### 重试配置

```javascript
const MAX_RETRIES = 2; // 最大重试次数
const RETRY_DELAY = 1000; // 重试延迟时间 (ms)
```

## 认证处理

### Token 管理

```javascript
// 自动添加认证头
const { accessToken } = useUserStore();
if (accessToken) {
  request.headers.set("Authorization", accessToken);
}
```

### 401 错误处理

```javascript
function handleUnauthorizedError(message) {
  const error = createHttpError(message || "未授权访问", ApiStatus.unauthorized);

  // 防抖处理，避免重复提示
  if (!isUnauthorizedErrorShown) {
    isUnauthorizedErrorShown = true;
    logOut();

    unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME);
    showError(error, true);
    throw error;
  }

  throw error;
}
```

## API 接口示例

### 用户管理

```javascript
// src/api/usersApi.js
import api from "@/utils/http";

export const usersApi = {
  // 获取用户列表
  getUsers(params) {
    return api.get({
      url: "/api/users",
      params,
    });
  },

  // 获取用户详情
  getUser(id) {
    return api.get({
      url: `/api/users/${id}`,
    });
  },

  // 创建用户
  createUser(data) {
    return api.post({
      url: "/api/users",
      data,
    });
  },

  // 更新用户
  updateUser(id, data) {
    return api.put({
      url: `/api/users/${id}`,
      data,
    });
  },

  // 删除用户
  deleteUser(id) {
    return api.del({
      url: `/api/users/${id}`,
    });
  },

  // 用户登录
  login(credentials) {
    return api.post({
      url: "/api/auth/login",
      data: credentials,
    });
  },

  // 用户登出
  logout() {
    return api.post({
      url: "/api/auth/logout",
    });
  },
};
```

### 菜单管理

```javascript
// src/api/menuApi.js
import api from "@/utils/http";

export const menuApi = {
  // 获取菜单列表
  getMenus() {
    return api.get({
      url: "/api/menus",
    });
  },

  // 获取用户菜单权限
  getUserMenus() {
    return api.get({
      url: "/api/user/menus",
    });
  },

  // 创建菜单
  createMenu(data) {
    return api.post({
      url: "/api/menus",
      data,
    });
  },

  // 更新菜单
  updateMenu(id, data) {
    return api.put({
      url: `/api/menus/${id}`,
      data,
    });
  },

  // 删除菜单
  deleteMenu(id) {
    return api.del({
      url: `/api/menus/${id}`,
    });
  },
};
```

## 使用示例

### 在组件中使用

```vue
<template>
  <div>
    <el-table :data="users" v-loading="loading">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="editUser(row)">编辑</el-button>
          <el-button @click="deleteUser(row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usersApi } from "@/api/usersApi";
import { ElMessage, ElMessageBox } from "element-plus";

const users = ref([]);
const loading = ref(false);

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const data = await usersApi.getUsers({ page: 1, size: 10 });
    users.value = data;
  } catch (error) {
    ElMessage.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 编辑用户
const editUser = (user) => {
  // 编辑逻辑
};

// 删除用户
const deleteUser = async (id) => {
  try {
    await ElMessageBox.confirm("确定要删除这个用户吗？", "提示", {
      type: "warning",
    });

    await usersApi.deleteUser(id);
    ElMessage.success("删除成功");
    fetchUsers(); // 重新加载列表
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
```

### 使用组合式函数

```javascript
// src/composables/useUsers.js
import { ref, onMounted } from "vue";
import { usersApi } from "@/api/usersApi";

export function useUsers() {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchUsers = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await usersApi.getUsers(params);
      users.value = data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData) => {
    try {
      const data = await usersApi.createUser(userData);
      users.value.push(data);
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const data = await usersApi.updateUser(id, userData);
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = data;
      }
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await usersApi.deleteUser(id);
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  onMounted(() => {
    fetchUsers();
  });

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
```

## 环境配置

### 开发环境

```javascript
// .env.development
VITE_API_URL=http://192.168.10.211:8001
VITE_WITH_CREDENTIALS=true
```

### 生产环境

```javascript
// .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_WITH_CREDENTIALS=true
```

## 最佳实践

### 1. 错误处理

- 始终使用 try-catch 包装 API 调用
- 根据错误类型提供不同的用户反馈
- 记录错误日志用于调试

### 2. 加载状态

- 为异步操作添加加载状态
- 使用 Element Plus 的 v-loading 指令
- 避免用户重复操作

### 3. 数据缓存

- 合理使用缓存减少重复请求
- 实现数据过期机制
- 考虑使用 Pinia 进行状态管理

### 4. 请求优化

- 使用防抖和节流优化频繁请求
- 实现请求取消机制
- 合理设置超时时间

### 5. 安全性

- 验证输入数据
- 使用 HTTPS 传输敏感数据
- 实现适当的权限控制

