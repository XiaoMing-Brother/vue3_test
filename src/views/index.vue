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
  </div>
</template>

<script setup>
import SideBar from "@/components/SideBar.vue";
import TopBar from "@/components/TopBar.vue";
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;

  .layout-silder {
  }
  .layout-content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background-color: #edf6ff;

    .layout-header {
      position: fixed;
      top: 0;
      z-index: 1;
      width: calc(100% - 200px);
      background-color: #eff8f7;
    }

    .layout-page {
      flex: 1;
      margin: 80px 20px 20px;
      background-color: #fff;
      border-radius: 10px;
    }
  }
}
</style>
