import Axios from "axios";
import Qs from "qs";
import { api } from "./config";
import { ElMessage } from "element-plus";
import router from "@/router";

const instance = Axios.create({
  timeout: 20000,
  headers: {
    "content-type": "application/json",
  },
});

//拦截请求
instance.interceptors.request.use(
  (config) => {
    //此处 Location.api 为动态变量 开发环境和正式环境内容不一样

    if (config.url.indexOf("http") != 0 || config.url.indexOf("https") != 0) {
      config.url = api + config.url;
    }

    if (sessionStorage.getItem("token") && !config.headers.token) {
      config.headers.Authorization = sessionStorage.getItem("token");
    }

    //在这做一些拦截操作
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    let { status, data } = response;

    if (status != 200) {
      return false;
    }
    if (status === 200) {
      if (data.code == 1) {
        ElMessage({ message: data.msg, type: "error" });
        return false;
      }
      if (data.code == 403) {
        ElMessage({ message: data.msg, type: "error" });
        return false;
      }

      if (data.code == 401) {
        ElMessage({ message: "登录信息已过期，请重新登录！", type: "error" });
        sessionStorage.setItem("quit", Date.now());
        sessionStorage.clear();
        router.push({
          name: "login",
        });
        return false;
      }
    }
    return data;
  },
  (errors) => {
    if (errors.respon) {
      let { status, data } = response;
      if (status == 401) {
        ElMessage({ message: "登录信息已过期，请重新登录！", type: "error" });
        sessionStorage.setItem("quit", Date.now());
        sessionStorage.clear();
        router.push({
          name: "login",
        });
      }
      if (data.code == 403) {
        ElMessage({ message: data.msg, type: "error" });
        return false;
      }
    }
  }
);

export default instance;
