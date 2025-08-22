<template>
  <div class="setting-item">
    <span class="item-label">主题模式</span>
    <div class="theme-options">
      <div
        class="theme-option"
        :class="{ active: settingsStore.theme === 'light' }"
        @click="handleThemeChange('light', $event)">
        <div class="theme-preview light-theme"></div>
        <span>浅色</span>
      </div>
      <div
        class="theme-option"
        :class="{ active: settingsStore.theme === 'dark' }"
        @click="handleThemeChange('dark', $event)">
        <div class="theme-preview dark-theme"></div>
        <span>深色</span>
      </div>
      <div
        class="theme-option"
        :class="{ active: settingsStore.theme === 'auto' }"
        @click="handleThemeChange('auto', $event)">
        <div class="theme-preview auto-theme"></div>
        <span>跟随系统</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { useSettingsStore } from "@/store/modules/settings";
import { themeAnimation } from "@/utils/theme/animation";

// 使用 Pinia store
const settingsStore = useSettingsStore();

// 主题设置
const handleThemeChange = (theme, event) => {
  // 如果传递了事件，使用动画效果
  if (event && event.target) {
    // 创建一个模拟的点击事件用于动画
    const mockEvent = {
      clientX: event.target.getBoundingClientRect().left + event.target.offsetWidth / 2,
      clientY: event.target.getBoundingClientRect().top + event.target.offsetHeight / 2,
    };

    // 先设置主题，然后执行动画
    const oldTheme = settingsStore.actualTheme;
    settingsStore.setTheme(theme);
    const newTheme = settingsStore.actualTheme;

    // 只有当实际主题发生变化时才执行动画
    if (oldTheme !== newTheme) {
      themeAnimation(mockEvent);
      // 主题切换后重新计算主题色
      settingsStore.setPrimaryColor(settingsStore.primaryColor);
    }
  } else {
    settingsStore.setTheme(theme);
    // 主题切换后重新计算主题色
    settingsStore.setPrimaryColor(settingsStore.primaryColor);
  }

  ElMessage.success(`已切换到${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "自动"}主题`);
};
</script>

<style lang="scss" scoped>
.setting-item {
  margin-bottom: 20px;

  .item-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}

.theme-options {
  display: flex;
  gap: 12px;

  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border: 2px solid var(--el-border-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--el-color-primary-light-3);
    }

    &.active {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    .theme-preview {
      width: 40px;
      height: 30px;
      border-radius: 4px;
      margin-bottom: 6px;
      position: relative;

      &.light-theme {
        background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
        border: 1px solid #e0e0e0;
      }

      &.dark-theme {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        border: 1px solid #404040;
      }

      &.auto-theme {
        background: linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #1a1a1a 50%, #1a1a1a 100%);
        border: 1px solid #e0e0e0;
      }
    }

    span {
      font-size: 12px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>