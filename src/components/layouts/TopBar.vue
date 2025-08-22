<template>
  <div class="top-bar">
    <div class="page_name">{{ globalStore.pageName }}</div>

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
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;

  .page_name {
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: 0px;
    color: var(--el-color-primary);
  }

  .info {
    display: flex;
    align-items: center;
    .btn-box {
      width: 20px;
      height: 20px;
      margin: 0 10px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .user {
      width: 26px;
      height: 26px;
      margin: 0 20px;
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;

      .user_name {
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 1px;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
