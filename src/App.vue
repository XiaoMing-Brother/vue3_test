<template>
  <router-view></router-view>
</template>

<script setup>
import { onBeforeMount, onMounted } from "vue";
import autofit from "autofit.js";
import { setThemeTransitionClass } from "./utils/theme/animation";
import { useSettingsStore } from "@/store/modules/settings";

// 初始化设置store
const settingsStore = useSettingsStore();

onBeforeMount(() => {
  setThemeTransitionClass(true);
  // 在应用启动前加载保存的设置
  settingsStore.loadSettings();
});

onMounted(() => {
  // 提升暗黑主题下页面刷新视觉体验
  setThemeTransitionClass(false);
});
</script>

<style scoped></style>
