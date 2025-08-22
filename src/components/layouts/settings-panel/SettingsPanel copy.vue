<template>
  <el-drawer
    v-model="settingsStore.settingsPanelVisible"
    title="全局设置"
    :size="400"
    direction="rtl"
    :before-close="handleClose"
    class="settings-panel">
    <div class="settings-content">
      <!-- 主题设置 -->
      <div class="setting-section">
        <div class="section-title">
          <el-icon><Sunny /></el-icon>
          <span>主题设置</span>
        </div>
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
        <div class="setting-item">
          <span class="item-label">主题色</span>
          <div class="color-picker-container">
            <div class="color-presets">
              <div
                v-for="color in predefineColors"
                :key="color"
                class="color-preset"
                :class="{ active: settingsStore.primaryColor === color }"
                :style="{ backgroundColor: color }"
                @click="handlePresetColorClick(color)"></div>
            </div>
          </div>
        </div>

        <!-- 自定义圆角设置 -->
        <div class="setting-item">
          <span class="item-label">圆角大小</span>
          <div class="radius-slider-container">
            <div class="radius-info">
              <span class="radius-value">{{ Math.round(settingsStore.customRadius * 16) }}px</span>
              <span class="radius-rem">({{ settingsStore.customRadius.toFixed(3) }}rem)</span>
            </div>
            <el-slider
              v-model="settingsStore.customRadius"
              :min="0"
              :max="1"
              :step="0.025"
              :show-tooltip="false"
              @change="handleCustomRadiusChange"
              class="radius-slider" />
            <div class="radius-preview-container">
              <div class="radius-preview-sample" :style="{ borderRadius: `${settingsStore.customRadius}rem` }">
                预览
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { mittBus } from "@/utils/sys";
import { useSettingsStore } from "@/store/modules/settings";
import { themeAnimation } from "@/utils/theme/animation";

// 使用 Pinia store
const settingsStore = useSettingsStore();

// 预定义颜色
const predefineColors = [
  "#409EFF", // Element Plus 默认蓝色
  "#67C23A", // 绿色
  "#E6A23C", // 橙色
  "#F56C6C", // 红色
  "#909399", // 灰色
  "#722ED1", // 紫色
  "#13C2C2", // 青色
  "#52C41A", // 亮绿色
  "#FA8C16", // 亮橙色
  "#F5222D", // 亮红色
  "#1890FF", // 亮蓝色
  "#FAAD14", // 黄色
];

// 打开设置面板
const openPanel = () => {
  settingsStore.openSettingsPanel();
};

// 关闭设置面板
const handleClose = (done) => {
  settingsStore.closeSettingsPanel();
  done();
};

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

// 预设颜色点击
const handlePresetColorClick = (color) => {
  try {
    settingsStore.setPrimaryColor(color);
    ElMessage.success("主题色已更新");
  } catch (error) {
    ElMessage.error("输入错误的hex颜色值");
    console.error("颜色设置失败:", error);
  }
};

// 自定义圆角设置
const handleCustomRadiusChange = (value) => {
  try {
    settingsStore.setCustomRadius(value);
    ElMessage.success(`圆角已设置为 ${Math.round(value * 16)}px`);
  } catch (error) {
    ElMessage.error("圆角设置失败");
    console.error("圆角设置失败:", error);
  }
};

// 生命周期
onMounted(() => {
  // 监听打开设置面板事件
  mittBus.on("openSetting", openPanel);
  // 加载设置
  settingsStore.loadSettings();
});

onUnmounted(() => {
  mittBus.off("openSetting", openPanel);
});
</script>

<style lang="scss" scoped>
.settings-panel {
  .settings-content {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }

  .setting-section {
    margin-bottom: 32px;

    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);

      .el-icon {
        margin-right: 8px;
        color: var(--el-color-primary);
      }
    }

    .setting-item {
      margin-bottom: 20px;

      .item-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
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

  .color-picker-container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .color-presets {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .color-preset {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        &.active {
          border-color: var(--el-color-primary);
          box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
        }
      }
    }
  }

  .radius-slider-container {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .radius-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      .radius-value {
        font-weight: 600;
        color: var(--el-color-primary);
      }

      .radius-rem {
        color: var(--el-text-color-regular);
        font-size: 12px;
      }
    }

    .radius-slider {
      margin: 8px 0;
    }

    .radius-preview-container {
      display: flex;
      justify-content: center;
      margin-top: 8px;

      .radius-preview-sample {
        width: 80px;
        height: 40px;
        background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-success) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: 500;
        transition: border-radius 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

:deep(.el-drawer__header) {
  padding: 20px 20px 0;
  margin-bottom: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style>
