<template>
  <div class="layout">
    <div class="layout-silder">
      <SideBar></SideBar>
    </div>
    <div class="layout-content">
      <div class="layout-header">
        <TopBar></TopBar>
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
import SideBar from "@/components/layouts/SideBar.vue";
import TopBar from "@/components/layouts/TopBar.vue";
import SettingsPanel from "@/components/layouts/settings-panel/SettingsPanel.vue";
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
  background: var(--art-bg-color);

  .layout-silder {
    background: var(--art-main-bg-color);
    border-right: 1px solid var(--art-card-border) !important;
  }
  .layout-content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .layout-header {
      position: fixed;
      top: 0;
      z-index: 1;
      width: calc(100% - 200px);
    }

    .layout-page {
      flex: 1;
      margin: 60px 20px 20px;
      background: var(--art-main-bg-color);
      border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
      border: 1px solid var(--art-card-border) !important;
    }
  }
}
</style>
