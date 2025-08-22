<template>
  <div class="sidebar">
    <div class="logo-group">
      <img src="@images/logo.png" alt="" class="logo" />
      <div class="logo_name">学习强国管理平台</div>
      <!-- <div class="logo_name">科技成果管理平台</div> -->
    </div>

    <div class="menu_list">
      <div class="menu_item" v-for="item in menuItems" :key="item.id">
        <!-- 父级菜单 -->
        <div
          @click="toggleMenu(item)"
          class="menu"
          :class="{
            active: item.id == menuParentId || (item.children && isChildActive(item)),
            'has-children': item.children && item.children.length > 0,
          }">
          <div class="icon_box">
            <imgSvg
              :src="item.meta.icon"
              :active="item.id == menuParentId || (item.children && isChildActive(item))"
              class="imgSvg" />
          </div>
          <span class="name">{{ item.meta.name }}</span>
          <!-- 展开/收起箭头 -->
          <div class="arrow" v-if="item.children && item.children.length > 0">
            <el-icon :class="{ 'is-active': expandedMenus.includes(item.id) }">
              <ArrowDown />
            </el-icon>
          </div>
        </div>

        <!-- 子菜单 -->
        <div
          class="submenu"
          v-if="item.children && item.children.length > 0"
          :class="{ 'is-expanded': expandedMenus.includes(item.id) }">
          <div
            class="submenu-item"
            v-for="child in item.children"
            :key="child.id"
            @click="toPath(child)"
            :class="{ active: child.id == menuParentId }">
            <span class="submenu-name">{{ child.meta.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import imgSvg from "@/components/layouts/imgSvg.vue";

import { ArrowDown } from "@element-plus/icons-vue";

import { menuItems } from "@/router/menuItems"; // 导入菜单路由数据
import { useRouter } from "vue-router";
const router = useRouter();

import { api } from "@/utils/config";
const fileUrl = ref(api + "/files");

// 展开的菜单列表
const expandedMenus = ref([]);

onMounted(() => {
  let menuId = sessionStorage.getItem("menuParentId");
  if (menuId) {
    menuParentId.value = parseInt(menuId);
    // 如果当前激活的是子菜单，自动展开父菜单
    autoExpandParentMenu();
  }
});

const menuParentId = ref(1);

// 自动展开包含激活子菜单的父菜单
const autoExpandParentMenu = () => {
  menuItems.forEach((item) => {
    if (item.children && item.children.some((child) => child.id == menuParentId.value)) {
      if (!expandedMenus.value.includes(item.id)) {
        expandedMenus.value.push(item.id);
      }
    }
  });
};

// 检查是否有子菜单处于激活状态
const isChildActive = (item) => {
  if (!item.children) return false;
  return item.children.some((child) => child.id == menuParentId.value);
};

// 切换菜单展开/收起
const toggleMenu = (item) => {
  if (item.children && item.children.length > 0) {
    // 有子菜单，切换展开状态
    const index = expandedMenus.value.indexOf(item.id);
    if (index > -1) {
      expandedMenus.value.splice(index, 1);
    } else {
      // 关闭其他展开的菜单，只保持当前菜单展开
      expandedMenus.value = [item.id];
    }
  } else {
    // 没有子菜单，直接跳转并关闭所有展开的菜单
    expandedMenus.value = [];
    toPath(item);
  }
};

// 点击菜单跳转路由
const toPath = (row) => {
  let { id, path } = row;

  sessionStorage.setItem("menuParentId", id);
  sessionStorage.removeItem("pageType");
  menuParentId.value = id;

  // 如果点击的是子菜单，保持父菜单展开状态
  if (path) {
    // 检查是否是子菜单项
    const parentMenu = menuItems.find((item) => item.children && item.children.some((child) => child.id === id));

    if (parentMenu) {
      // 是子菜单，保持父菜单展开
      expandedMenus.value = [parentMenu.id];
    } else {
      // 不是子菜单，关闭所有展开的菜单
      expandedMenus.value = [];
    }

    router.push({ path });
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  width: 220px;
  position: relative;
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
      color: var(--el-color-primary);
      display: block;
      font-family: "douyin";
    }
    .none {
      display: none;
    }
  }

  .menu_list {
    padding: 20px 10px;
    height: calc(100vh - 240px);
    overflow-y: auto;

    .menu_item {
      .menu {
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 0 10px;
        cursor: pointer;
        position: relative;

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
          }
        }

        .name {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 22px;
          letter-spacing: 1px;
          color: #6b6b6b;
          flex: 1;
        }

        .arrow {
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.3s ease;

          .el-icon {
            font-size: 14px;
            color: #6b6b6b;
            transition: transform 0.3s ease;

            &.is-active {
              transform: rotate(180deg);
            }
          }
        }

        &.has-children:hover {
          .arrow .el-icon {
            color: var(--el-color-primary);
          }
        }
      }

      .active {
        background-color: var(--el-color-primary-light-9);
        .name {
          color: var(--el-color-primary);
        }
        .arrow .el-icon {
          color: var(--el-color-primary);
        }
      }

      // 子菜单样式
      .submenu {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;

        &.is-expanded {
          max-height: 200px; // 根据子菜单数量调整
        }

        .submenu-item {
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          margin: 5px 0;
          padding: 0 10px 0 40px; // 左侧缩进
          cursor: pointer;
          transition: background-color 0.2s ease;

          .submenu-name {
            font-size: 13px;
            font-weight: normal;
            line-height: 20px;
            letter-spacing: 0.5px;
            color: #8b8b8b;
          }

          &:hover {
            background-color: var(--el-color-primary-light-9);
            .submenu-name {
              color: var(--el-color-primary);
            }
          }

          &.active {
            background-color: var(--el-color-primary-light-8);
            .submenu-name {
              color: var(--el-color-primary);
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}
</style>
