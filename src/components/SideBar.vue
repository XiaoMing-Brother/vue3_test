<template>
  <div class="sidebar">
    <div class="logo-group">
      <img src="@images/logo.png" alt="" class="logo" />
      <div class="logo_name">学习强国管理平台</div>
      <!-- <div class="logo_name">科技成果管理平台</div> -->
    </div>

    <div class="menu_list">
      <div class="menu_item" v-for="item in menuItems" :key="item.id">
        <div
          @click="toPath(item)"
          class="menu"
          :class="{ active: item.id == menuParentId }"
        >
          <div class="icon_box">
            <img :src="item.meta.icon" class="imgSvg" />
            <!-- <imgSvg
              :src="item.meta.icon"
              :active="item.id == menuParentId"
              class="imgSvg"
            /> -->
          </div>
          <span class="name">{{ item.meta.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import imgSvg from "./imgSvg.vue";

import { menuItems } from "@/router/menuItems"; // 导入菜单路由数据
import { useRouter } from "vue-router";
const router = useRouter();

import { api } from "@/utils/config";
const fileUrl = ref(api + "/files");

onMounted(() => {
  let menuId = sessionStorage.getItem("menuParentId");
  if (menuId) {
    menuParentId.value = menuId;
  }
});

const menuParentId = ref(1);
// 点击菜单跳转路由
const toPath = (row) => {
  let { id, path } = row;

  sessionStorage.setItem("menuParentId", id);
  sessionStorage.removeItem("pageType");
  menuParentId.value = id;

  router.push({ path });
};
</script>

<style lang="less" scoped>
.sidebar {
  background-color: #e9f4fe;
  height: 100%;
  width: 200px;
  position: relative;
  background-image: url("@images/menu/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .logo-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 30px;
    height: 100px;
    .logo {
      width: 87px;
      height: 42px;
      margin-bottom: 13px;
    }
    .logo_name {
      font-size: 18px;
      font-weight: bold;
      line-height: 22px;
      letter-spacing: 2px;
      color: #004d94;
      display: block;
      font-family: "douyin";
    }
    .none {
      display: none;
    }
  }

  .menu_list {
    padding: 20px;

    height: calc(100vh - 240px);

    .menu_item {
      .menu {
        width: 130px;
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 0 10px;
        cursor: pointer;
        .icon_box {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;

          .imgSvg {
            width: 20px;
            height: 20px;
            filter: brightness(0) invert(15%) sepia(99%) saturate(2044%)
              hue-rotate(195deg) brightness(95%) contrast(104%);
          }
        }
        .name {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 22px;
          letter-spacing: 1px;
          color: #043562;
        }
      }

      .active {
        background-color: #004d94;
        .icon_box {
          .imgSvg {
            filter: brightness(0) invert(1);
          }
        }
        .name {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
