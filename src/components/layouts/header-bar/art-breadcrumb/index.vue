<!-- 面包屑导航 -->
<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadcrumbItems" :key="item.path">
        <div :class="{ clickable: isClickable(item, index) }" @click="handleBreadcrumbClick(item, index)">
          <span>{{ item.meta?.name || item.meta?.title || "未命名页面" }}</span>
        </div>
        <div v-if="!isLastItem(index) && item.meta?.name" class="breadcrumb-separator" aria-hidden="true">/</div>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { menuItems } from "@/router/menuItems";

defineOptions({ name: "ArtBreadcrumb" });

const route = useRoute();
const router = useRouter();

// 使用computed替代watch，提高性能
const breadcrumbItems = computed(() => {
  const { matched } = route;

  // 处理首页情况
  if (!matched.length || route.path === "/") {
    return [];
  }

  // 获取当前页面信息
  const currentRoute = matched[matched.length - 1];
  const pathSegments = route.path.split("/").filter((segment) => segment);

  if (pathSegments.length >= 2) {
    // 二级页面：显示父级和子级
    const parentRoute = matched[matched.length - 2];
    return [createBreadcrumbItem(parentRoute), createBreadcrumbItem(currentRoute)];
  }

  // 一级页面：只显示当前页面
  return [createBreadcrumbItem(currentRoute)];
});

// 辅助函数：创建面包屑项目
function createBreadcrumbItem(routeItem) {
  return {
    path: routeItem.path,
    meta: routeItem.meta,
  };
}

// 辅助函数：判断是否为最后一项
function isLastItem(index) {
  return index === breadcrumbItems.value.length - 1;
}

// 辅助函数：判断是否可点击
function isClickable(item, index) {
  // 最后一项不可点击
  if (isLastItem(index)) {
    return false;
  }

  // 检查是否是有子菜单的父级菜单
  const parentMenuItem = menuItems.find(
    (menuItem) => menuItem.children && menuItem.children.some((child) => child.path === route.path)
  );

  return parentMenuItem !== undefined;
}

// 辅助函数：查找菜单项的第一个子菜单
function findFirstValidChild(parentMenuItem) {
  if (parentMenuItem && parentMenuItem.children && parentMenuItem.children.length > 0) {
    return parentMenuItem.children[0];
  }
  return null;
}

// 处理面包屑点击事件
async function handleBreadcrumbClick(item, index) {
  // 如果是最后一项，不处理
  if (isLastItem(index)) {
    return;
  }

  try {
    // 查找对应的父级菜单项
    const parentMenuItem = menuItems.find(
      (menuItem) => menuItem.children && menuItem.children.some((child) => child.path === route.path)
    );

    if (parentMenuItem) {
      // 找到第一个子菜单并跳转
      const firstChild = findFirstValidChild(parentMenuItem);
      if (firstChild && firstChild.path) {
        await router.push(firstChild.path);
      }
    } else {
      // 如果没有子菜单，直接跳转到该路径
      await router.push(item.path);
    }
  } catch (error) {
    console.error("导航失败:", error);
  }
}
</script>

<style lang="scss" scoped>
@use "./style";

.breadcrumb {
  ul {
    display: flex;
    align-items: center;
    height: 100%;

    li {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 28px;
      font-size: 14px;
      line-height: 28px;

      .clickable {
        cursor: pointer;
        border-radius: 4px;
        transition: color 0.2s ease;
        transition: all 0.2s ease;

        &:hover {
          background-color: rgba(var(--art-gray-200-rgb), 0.85);

          span {
            color: var(--art-gray-700);
          }
        }
      }

      span {
        display: block;
        max-width: 200px;
        padding: 0 6px;
        overflow: hidden;
        color: var(--art-gray-600);
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s ease;
      }

      .breadcrumb-separator {
        margin: 0 4px;
        font-style: normal;
        color: var(--art-gray-600);
      }
    }
  }
}
</style>
