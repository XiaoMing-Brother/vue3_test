<template>
  <div class="top-bar">
    <div class="page_name">{{ globalStore.pageName }}</div>

    <div class="info">
      <img
        src="@images/cockpit.png"
        class="cockpit"
        alt=""
        @click="largeScreen"
      />

      <img src="@images/user.png" class="user" alt="" />

      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="user_name">{{ userInfo.userName }}</div>
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
import { nextTick, onMounted, ref } from "vue";
import router from "@/router";

import { useGlobalStore } from "@/store/global";
const globalStore = useGlobalStore();

let userInfo = ref({});

// 跳转到大屏
const largeScreen = () => {
  let path = "#/screen";
  window.open(path, "_blank");
};

// 退出登录
const handleSelect = () => {
  sessionStorage.clear();
  router.push("/login");
};

onMounted(() => {
  let user = JSON.parse(sessionStorage.getItem("userInfo"));
  userInfo.value = user;
});
</script>

<style lang="less" scoped>
.top-bar {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #fbfbfd;

  .page_name {
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: 0px;
    color: #004d94;
  }
  .info {
    display: flex;
    align-items: center;
    .cockpit {
      width: 20px;
      height: 20px;
      margin-right: 30px;
      cursor: pointer;
    }

    .user {
      width: 26px;
      height: 26px;
      margin-right: 10px;
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      .user_name {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 22px;
        letter-spacing: 1px;
        color: #333333;
      }
    }
  }
}
</style>
