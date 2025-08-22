<template>
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
</template>

<script setup>
import { ElMessage } from "element-plus";
import { useSettingsStore } from "@/store/modules/settings";

// 使用 Pinia store
const settingsStore = useSettingsStore();

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
</style>