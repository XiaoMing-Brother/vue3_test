<template>
  <div class="container">
    <div class="login_box">
      <div class="logo">科技成果交易中心</div>
      <div class="name">杭州市拱墅区工大未来技术研究院</div>

      <div class="working">
        <div class="row">
          <img src="@images/login/user.png" alt="" class="icon" />
          <el-input
            v-model="form.userName"
            placeholder="请输入用户名"
            class="input-size-blowup"
          >
          </el-input>
        </div>

        <div class="row">
          <img src="@images/login/lock.png" alt="" class="icon" />
          <el-input
            type="password"
            show-password
            v-model="form.passWord"
            placeholder="请输入密码"
            class="input-size-blowup"
            @keydown.enter="login"
          >
          </el-input>
        </div>

        <div class="verify-group">
          <div class="row">
            <img src="@images/login/code.png" alt="" class="icon" />

            <el-input
              v-model="form.captchaCode"
              class="input-size-blowup"
              style="margin-bottom: 0"
              placeholder="请输入验证码"
              @keydown.enter="login"
            >
            </el-input>
          </div>

          <div class="verify_code" @click="updateVerifyCode">
            <img :src="verifyCode" alt="" />
          </div>
        </div>

        <el-button type="primary" class="submit" @click="login">登录</el-button>
      </div>
    </div>

    <div class="bg"></div>

    <footer>
      © 2025 杭州市拱墅区工大未来技术研究院 版权所有
      <!-- <a href="https://beian.miit.gov.cn/" target="_blank"
        >浙ICP备11008661号-2
      </a>
      <br /> -->
      <!-- <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010502012082"
        style="display: flex; align-items: center; justify-content: center"
        ><img src="@images/login/batb.png" style="margin-right: 5px" />
        <p>浙公网安备 33010502012082号</p>
      </a> -->
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import http from "@/utils/axios";
import router from "@/router";
import { ElMessage } from "element-plus";
import autoFontSize from "@/utils/autoFontSize";

//自动设置根字体大小
autoFontSize();

const verifyCode = ref("");

const form = ref({
  passWord: "",
  userName: "",
  captchaCode: "",
  captchaKey: "",
});

// 更新验证码
const updateVerifyCode = async () => {
  let res = await http.get("/sys/auth/getCaptchaCode");
  verifyCode.value = res.captchaCode;
  form.value.captchaKey = res.captchaKey;
  form.value.captchaCode = "";
  // 重置提交状态
  isSubmitting.value = false;
};

const isSubmitting = ref(false);
// 登录
const login = async () => {
  const requiredFields = [
    { field: "userName", message: "请输入用户名" },
    { field: "passWord", message: "请输入密码" },
    { field: "captchaCode", message: "请输入验证码" },
  ];

  for (const { field, message } of requiredFields) {
    if (form.value[field] === "") {
      return ElMessage.error(message);
    }
  }

  if (isSubmitting.value) {
    return;
  }

  if (!isSubmitting.value) {
    let res = await http.post("/sys/auth/login", form.value);
    // 设置提交状态为正在提交
    isSubmitting.value = true;
    console.log(res);

    if (res) {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userInfo", JSON.stringify(res.data));

      setTimeout(() => {
        ElMessage.success("登录成功");
        router.push({ path: "/team" });
      }, 100);
    } else {
      form.value.captchaCode = "";
      updateVerifyCode();
    }
  }
};

onMounted(() => {
  updateVerifyCode();
});
</script>

<style lang="less" scoped>
.container {
  background-color: #ffffff;
  .bg {
    position: absolute;
    right: 0%;
    top: 0%;
    display: flex;
    height: 100vh;
    width: 60%;
    background-image: url("@images/login/bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .login_box {
    z-index: 1;
    position: absolute;
    left: 8%;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;

    .logo {
      position: absolute;
      top: 18%;
      width: 444px;

      font-size: 52px;
      font-family: "douyin";
      color: #4b4b4b;
    }

    .name {
      position: absolute;
      top: 25%;
      width: 580px;

      font-size: 36px;
      font-family: "douyin";
      color: #4b4b4b;
    }

    .working {
      position: absolute;
      top: 40%;
      height: 513px;
      border-radius: 20px;
      width: 400px;

      .row {
        display: flex;
        align-items: center;
        height: 60px;
        background: #f3f5fb;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: none;
        margin-bottom: 30px;
        .icon {
          padding: 0 20px;
        }
        .input-size-blowup {
          // margin-bottom: 25px;
          :deep(.el-input__wrapper) {
            border: none;
            padding: 0 20px 0 0;
            height: 60px;
            background: #f3f5fb;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: none;
            .el-input__inner {
              height: 60px;
              line-height: 60px;
              font-size: 16px;
              background: #f3f5fb;
            }

            //改变input自动填充背景颜色
            input:-internal-autofill-previewed,
            input:-internal-autofill-selected {
              -webkit-text-fill-color: #333333;
              transition: background-color 1000s ease-out 0.5s;
            }
          }
        }
      }

      .verify-group {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;

        .verify_code {
          flex-shrink: 0;
          width: 150px;
          height: 60px;
          background-color: #f3f5fb;
          border-radius: 30px;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 20px;
          img {
            width: 100px;
            height: 40px;
          }
        }
      }

      .submit {
        width: 400px;
        height: 60px;
        background-color: #467cfc;
        border-radius: 30px;
        border: none;
        font-family: SourceHanSansCN-Medium;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        cursor: pointer;

        &:hover {
          background-color: #467cfc;
        }

        &:active {
          opacity: 0.8;
        }
      }
    }
  }

  footer {
    position: fixed;
    bottom: 0;
    left: 10%;
    width: 100%;
    height: 65px;
    line-height: 30px;
    // text-align: center;
    color: #333333;
    a {
      color: #333333;
      text-decoration: none;
    }
  }
}
</style>
