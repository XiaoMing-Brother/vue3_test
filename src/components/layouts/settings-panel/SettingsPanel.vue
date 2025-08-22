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
        <!-- 主题选择器组件 -->
        <ThemeSelector />

        <!-- 颜色选择器组件 -->
        <ColorPicker />

        <!-- 圆角设置组件 -->
        <RadiusSettings />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { Sunny } from "@element-plus/icons-vue";
import { mittBus } from "@/utils/sys";
import { useSettingsStore } from "@/store/modules/settings";

// 导入子组件
import ThemeSelector from "./widget/ThemeSelector.vue";
import ColorPicker from "./widget/ColorPicker.vue";
import RadiusSettings from "./widget/RadiusSettings.vue";

// 使用 Pinia store
const settingsStore = useSettingsStore();

// 打开设置面板
const openPanel = () => {
  settingsStore.openSettingsPanel();
};

// 关闭设置面板
const handleClose = (done) => {
  settingsStore.closeSettingsPanel();
  done();
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
    padding: 0 20px;
    height: 100%;
    overflow-y: auto;
  }

  .setting-section {
    margin-bottom: 32px;
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
