<template>
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
</template>

<script setup>
import { ElMessage } from "element-plus";
import { useSettingsStore } from "@/store/modules/settings";

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
</style>