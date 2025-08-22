<template>
  <div class="top-bar">
    <div class="breadcrumb-container">
      <ArtBreadcrumb />
    </div>

    <div class="info">
      <div class="btn-box" @click="largeScreen">
        <el-icon><FullScreen /></el-icon>
      </div>

      <div class="btn-box" @click="handleThemeToggle($event)">
        <el-icon><Moon v-if="!settingsStore.isDarkTheme" /><Sunny v-else /></el-icon>
      </div>

      <!-- 设置 -->
      <div class="btn-box" @click="openSetting">
        <el-icon><Setting /></el-icon>
      </div>

      <img src="@images/user.png" class="user" alt="用户头像" />

      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="user_name">admin</div>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleSelect">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, useAttrs } from "vue";
import { Moon, Sunny } from "@element-plus/icons-vue";
import { isDark, themeAnimation } from "@/utils/theme/animation";
import router from "@/router";
import { useGlobalStore } from "@/store/modules/global";
import ArtBreadcrumb from "./art-breadcrumb/index.vue";

import { mittBus } from "@/utils/sys";
import { useSettingsStore } from "@/store/modules/settings";

// 全局状态
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
// const { showSettingGuide } = settingStore;

// 响应式数据
const userInfo = ref({});

// 定义事件
const emit = defineEmits(["toggled"]);

// 跳转到大屏页面
const largeScreen = () => {
  const path = "#/screen";
  window.open(path, "_blank");
};

// 处理退出登录
const handleSelect = () => {
  sessionStorage.clear();
  router.push("/login");
};

/**
 * 打开设置面板
 */
const openSetting = () => {
  // 使用 Pinia store 打开设置面板
  settingsStore.openSettingsPanel();

  // 隐藏设置引导提示
  // if (showSettingGuide.value) {
  //   settingStore.hideSettingGuide();
  // }
};

/**
 * 切换主题模式
 */
const handleThemeToggle = (event) => {
  // 循环切换主题模式：light -> dark -> auto -> light
  const currentTheme = settingsStore.theme;
  let nextTheme;

  if (currentTheme === "light") {
    nextTheme = "dark";
  } else if (currentTheme === "dark") {
    nextTheme = "auto";
  } else {
    nextTheme = "light";
  }

  // 获取当前实际主题
  const oldTheme = settingsStore.actualTheme;
  settingsStore.setTheme(nextTheme);
  const newTheme = settingsStore.actualTheme;

  // 只有当实际主题发生变化时才执行动画
  if (oldTheme !== newTheme && event) {
    themeAnimation(event);
    // 主题切换后重新计算主题色
    settingsStore.setPrimaryColor(settingsStore.primaryColor);
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  const user = JSON.parse(sessionStorage.getItem("userInfo"));
  userInfo.value = user;
});
</script>

<style lang="scss" scoped>
.top-bar {
  height: var(--layout-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;

  .breadcrumb-container {
    flex: 1;
    min-width: 0; // 允许收缩
  }

  .info {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color-lighter);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--el-color-primary);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-5);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &::before {
          opacity: 0.05;
        }

        .el-icon {
          color: var(--el-color-primary);
          transform: scale(1.1);
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .el-icon {
        font-size: 18px;
        color: var(--el-text-color-regular);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
      }
    }

    .user {
      width: 32px;
      height: 32px;
      margin: 0 12px;
      border-radius: 50%;
      border: 2px solid var(--el-color-primary-light-7);
      transition: all 0.3s ease;
      object-fit: cover;

      &:hover {
        border-color: var(--el-color-primary);
        transform: scale(1.05);
        box-shadow: 0 0 0 4px var(--el-color-primary-light-9);
      }
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      // border-radius: 8px;
      // background: var(--el-fill-color-blank);
      // border: 1px solid var(--el-border-color-lighter);
      // transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      // min-width: 120px;
      justify-content: space-between;

      &:hover {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-5);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        .user_name {
          color: var(--el-color-primary);
        }

        .el-icon {
          color: var(--el-color-primary);
          transform: rotate(180deg);
        }
      }

      .user_name {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.5px;
        color: var(--el-text-color-primary);
        transition: color 0.3s ease;
      }

      .el-icon {
        margin-left: 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
  }
}

// 深色模式优化
:deep(.el-dropdown-menu) {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);

  .el-dropdown-menu__item {
    transition: all 0.3s ease;
    border-radius: 4px;
    margin: 4px 8px;

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
}
</style>
