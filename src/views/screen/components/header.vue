<template>
  <div class="header">
    <div class="left-date">{{ currentTime }}</div>
    <div class="logo-name">
      <div class="font">杭州市拱墅区工大未来技术研究院</div>
      <div class="font">科技成果交易中心</div>
    </div>
    <div class="right-user">
      <img src="@images/user.png" class="avatar" alt="" />
      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="user_name">{{ userInfo.userName }}</div>
          <el-icon class="el-icon--right" color="#ffffff">
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
import { ref, onMounted } from "vue";
import dayjs from "dayjs";

let userInfo = ref({});
// 退出登录
const handleSelect = () => {
  sessionStorage.clear();
  router.push("/login");
};

let currentTime = ref(dayjs().format("YYYY/MM/DD HH:mm:ss"));
let timer = null;

onMounted(() => {
  let user = JSON.parse(sessionStorage.getItem("userInfo"));
  userInfo.value = user;

  timer = setInterval(() => {
    currentTime.value = dayjs().format("YYYY/MM/DD HH:mm:ss");
  }, 1000);
});

//销毁
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="less" scoped>
.header {
  height: 120px;
  background-image: url("@/assets/images/screen/header.gif");
  background-size: cover;
  position: relative;
  padding-top: 21px;
  box-sizing: border-box;
  .logo-name {
    font-family: YouSheBiaoTiHei;
    font-size: 37px;
    line-height: 37px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 4px;
    text-align: center;
    .font {
      background-image: linear-gradient(
        to bottom,
        #53b5fa,
        #f7fcff
      ); // 背景线性渐变
      color: #ffffff; // 兜底颜色，防止文字裁剪不生效
      background-clip: text;
      -webkit-background-clip: text; // 背景被裁减为文字的前景色
      -webkit-text-fill-color: transparent; // 文字填充为透明，优先级比color高。
    }
  }
  .left-date {
    position: absolute;
    top: 21px;
    left: 30px;
    display: flex;
    font-family: longzhoufeng-;
    font-size: 20px;
    color: #ffffff;
  }
  .right-user {
    position: absolute;
    top: 21px;
    right: 30px;
    display: flex;
    align-items: center;

    .avatar {
      width: 26px;
      height: 26px;
      // background-color: #f7f7f7;
      margin-right: 10px;
    }
    // .name {
    //   font-family: SourceHanSansCN-Regular;
    //   font-size: 16px;
    //   color: #ffffff;
    // }

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
        color: #ffffff;
      }
    }
  }
}
</style>
