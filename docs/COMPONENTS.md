# 组件开发指南

## 概述

本项目的组件开发遵循 Vue 3 Composition API 的最佳实践，使用 TypeScript 和 SCSS 进行开发。

## 组件结构

### 基础组件结构

```vue
<template>
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<script setup>
// 导入依赖
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

// 定义 Props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [],
  },
});

// 定义 Emits
const emit = defineEmits(["update", "delete"]);

// 响应式数据
const loading = ref(false);
const list = ref([]);

// 计算属性
const filteredList = computed(() => {
  return list.value.filter((item) => item.active);
});

// 方法
const handleClick = () => {
  emit("update", { data: list.value });
};

// 生命周期
onMounted(() => {
  // 初始化逻辑
});
</script>

<style lang="scss" scoped>
.component-name {
  // 组件样式
}
</style>
```

### 组件命名规范

- **文件名**: 使用 PascalCase (如 `UserCard.vue`)
- **组件名**: 使用 PascalCase (如 `UserCard`)
- **CSS 类名**: 使用 kebab-case (如 `user-card`)

## Props 定义

### 基础 Props

```javascript
const props = defineProps({
  // 字符串类型
  title: {
    type: String,
    required: true,
    default: "",
  },

  // 数字类型
  count: {
    type: Number,
    default: 0,
  },

  // 布尔类型
  visible: {
    type: Boolean,
    default: false,
  },

  // 数组类型
  items: {
    type: Array,
    default: () => [],
  },

  // 对象类型
  config: {
    type: Object,
    default: () => ({}),
  },

  // 函数类型
  onSelect: {
    type: Function,
    default: null,
  },
});
```

### 验证器

```javascript
const props = defineProps({
  status: {
    type: String,
    validator: (value) => {
      return ["active", "inactive", "pending"].includes(value);
    },
    default: "active",
  },

  size: {
    type: String,
    validator: (value) => {
      return ["small", "medium", "large"].includes(value);
    },
    default: "medium",
  },
});
```

## Emits 定义

### 基础 Emits

```javascript
const emit = defineEmits(["update", "delete", "select"]);

// 使用 emit
const handleUpdate = (data) => {
  emit("update", data);
};

const handleDelete = (id) => {
  emit("delete", { id });
};
```

### 带验证的 Emits

```javascript
const emit = defineEmits({
  update: (payload) => {
    if (payload && typeof payload === "object") {
      return true;
    }
    console.warn("Invalid payload for update event");
    return false;
  },

  delete: (id) => {
    if (typeof id === "number" || typeof id === "string") {
      return true;
    }
    console.warn("Invalid id for delete event");
    return false;
  },
});
```

## 响应式数据

### ref 和 reactive

```javascript
// 基础类型使用 ref
const count = ref(0);
const title = ref("");
const loading = ref(false);

// 对象类型使用 reactive
const form = reactive({
  name: "",
  email: "",
  age: 0,
});

// 数组使用 ref
const list = ref([]);
const selectedItems = ref([]);
```

### 计算属性

```javascript
// 基础计算属性
const total = computed(() => {
  return list.value.reduce((sum, item) => sum + item.price, 0);
});

// 带参数的计算属性
const getItemById = computed(() => {
  return (id) => list.value.find((item) => item.id === id);
});

// 依赖多个响应式数据的计算属性
const filteredList = computed(() => {
  return list.value.filter((item) => {
    return item.name.includes(searchText.value) && item.status === selectedStatus.value;
  });
});
```

## 生命周期

### 常用生命周期钩子

```javascript
import { onMounted, onUnmounted, onUpdated, onBeforeMount, onBeforeUnmount } from "vue";

// 组件挂载后
onMounted(() => {
  // 初始化数据
  fetchData();

  // 添加事件监听
  window.addEventListener("resize", handleResize);
});

// 组件卸载前
onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener("resize", handleResize);

  // 清理定时器
  if (timer.value) {
    clearInterval(timer.value);
  }
});

// 组件更新后
onUpdated(() => {
  // 更新后的逻辑
  console.log("Component updated");
});
```

## 组合式函数 (Composables)

### 创建组合式函数

```javascript
// src/composables/useCounter.js
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const double = computed(() => count.value * 2);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    double,
    increment,
    decrement,
    reset,
  };
}
```

### 使用组合式函数

```vue
<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useCounter } from "@/composables/useCounter";

const { count, double, increment, decrement, reset } = useCounter(10);
</script>
```

## 样式开发

### SCSS 变量使用

```scss
<template>
  <div class="user-card">
    <h3 class="user-card__title">{{ title }}</h3>
    <div class="user-card__content">{{ content }}</div>
  </div>
</template>

<style lang="scss" scoped>
.user-card {
  padding: 1rem;
  background-color: var(--art-main-bg-color);
  border: 1px solid var(--art-border-color);
  border-radius: var(--custom-radius);

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: rgb(var(--art-primary));
    margin-bottom: 0.5rem;
  }

  &__content {
    color: var(--art-text-gray-600);
    line-height: 1.5;
  }

  &:hover {
    box-shadow: var(--art-box-shadow);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
}
</style>
```

### 响应式样式

```scss
.component {
  padding: 1rem;

  // 平板设备
  @media (max-width: $device-ipad) {
    padding: 0.75rem;
  }

  // 手机设备
  @media (max-width: $device-phone) {
    padding: 0.5rem;
  }
}
```

### 主题适配

```scss
.component {
  background-color: var(--art-main-bg-color);
  border: 1px solid var(--art-border-color);
  color: var(--art-text-gray-700);

  // 深色主题适配
  html.dark & {
    background-color: var(--art-main-bg-color);
    border-color: var(--art-border-color);
    color: var(--art-text-gray-300);
  }
}
```

## 组件示例

### 表格组件

```vue
<template>
  <div class="data-table">
    <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />

      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width">
        <template #default="{ row }" v-if="column.slot">
          <slot :name="column.slot" :row="row" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button link type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-if="showPagination" :current-page="currentPage" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

// Emits
const emit = defineEmits(["edit", "delete", "selection-change", "page-change"]);

// 响应式数据
const currentPage = ref(1);
const selectedRows = ref([]);

// 计算属性
const tableData = computed(() => props.data);
const total = computed(() => props.data.length);

// 方法
const handleEdit = (row) => {
  emit("edit", row);
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      type: "warning",
    });
    emit("delete", row);
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  emit("selection-change", selection);
};

const handlePageChange = (page) => {
  currentPage.value = page;
  emit("page-change", { page, pageSize: props.pageSize });
};

const handleSizeChange = (size) => {
  emit("page-change", { page: currentPage.value, pageSize: size });
};

// 暴露方法给父组件
defineExpose({
  getSelectedRows: () => selectedRows.value,
  clearSelection: () => {
    selectedRows.value = [];
  },
});
</script>

<style lang="scss" scoped>
.data-table {
  .el-table {
    margin-bottom: 1rem;
  }

  .el-pagination {
    text-align: right;
  }
}
</style>
```

### 表单组件

```vue
<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" @submit.prevent="handleSubmit">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="loading" />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" placeholder="请输入邮箱" :disabled="loading" />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择状态" :disabled="loading">
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="loading"> 提交 </el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["submit", "reset"]);

// 响应式数据
const formRef = ref();
const formData = reactive({
  username: "",
  email: "",
  status: "active",
  ...props.initialData,
});

// 验证规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度在 2 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 方法
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    emit("submit", formData);
  } catch (error) {
    ElMessage.error("请检查表单填写是否正确");
  }
};

const handleReset = () => {
  formRef.value.resetFields();
  emit("reset");
};

// 暴露方法
defineExpose({
  validate: () => formRef.value.validate(),
  resetFields: () => formRef.value.resetFields(),
  getFormData: () => formData,
});
</script>
```

## 最佳实践

### 1. 组件设计原则

- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 设计通用的、可配置的组件
- **可测试性**: 组件逻辑清晰，易于测试
- **可维护性**: 代码结构清晰，注释完整

### 2. 性能优化

```javascript
// 使用 shallowRef 优化大对象
import { shallowRef } from 'vue'

const largeData = shallowRef({})

// 使用 v-memo 优化列表渲染
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.status]">
    {{ item.name }}
  </div>
</template>

// 使用 defineAsyncComponent 懒加载组件
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'))
```

### 3. 错误处理

```javascript
// 使用 try-catch 包装异步操作
const handleAsyncOperation = async () => {
  try {
    loading.value = true;
    const result = await apiCall();
    // 处理成功结果
  } catch (error) {
    // 处理错误
    console.error("操作失败:", error);
    ElMessage.error("操作失败，请重试");
  } finally {
    loading.value = false;
  }
};
```

### 4. 类型安全

```typescript
// 使用 TypeScript 定义类型
interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
}

interface Props {
  user: User;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});
```

### 5. 文档和注释

```javascript
/**
 * 用户卡片组件
 * @description 显示用户基本信息的卡片组件
 * @example
 * <UserCard
 *   :user="userData"
 *   @edit="handleEdit"
 *   @delete="handleDelete"
 * />
 */
export default {
  name: "UserCard",
  // 组件定义
};
```

## 测试

### 单元测试示例

```javascript
// tests/components/UserCard.test.js
import { mount } from "@vue/test-utils";
import UserCard from "@/components/UserCard.vue";

describe("UserCard", () => {
  const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  it("renders user information correctly", () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    });

    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("john@example.com");
  });

  it("emits edit event when edit button is clicked", async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    });

    await wrapper.find(".edit-btn").trigger("click");
    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")[0]).toEqual([mockUser]);
  });
});
```

