<template>
  <div class="layout" :class="{ 'layout-collapsed': isCollapsed }">
    <div class="layout-sidebar" ref="sidebarRef">
      <SideBar @toggle-collapse="handleSidebarToggle"></SideBar>
    </div>
    <div class="layout-content">
      <div class="layout-header" :style="headerStyles">
        <TopBar @toggle-sidebar="handleSidebarToggle"></TopBar>
      </div>
      <div class="layout-page">
        <router-view></router-view>
      </div>
    </div>

    <!-- 全局设置面板 -->
    <SettingsPanel />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import SideBar from "@/components/layouts/SideBar.vue";
import TopBar from "@/components/layouts/header-bar/TopBar.vue";
import SettingsPanel from "@/components/layouts/settings-panel/SettingsPanel.vue";

// 响应式状态
const isCollapsed = ref(false);
const sidebarRef = ref(null);
const sidebarWidth = ref(240); // 默认侧边栏宽度
const collapsedWidth = ref(64); // 折叠后宽度

// 计算头部样式
const headerStyles = computed(() => {
  const currentWidth = isCollapsed.value ? collapsedWidth.value : sidebarWidth.value;
  return {
    width: `calc(100% - ${currentWidth}px)`,
    left: `${currentWidth}px`,
  };
});

// 处理侧边栏折叠
const handleSidebarToggle = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 响应式处理
const handleResize = () => {
  const width = window.innerWidth;
  if (width <= 768) {
    // 移动端自动折叠
    isCollapsed.value = true;
  } else if (width <= 1024) {
    // 平板端保持当前状态
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize(); // 初始化检查
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
@use "./style";
</style>
