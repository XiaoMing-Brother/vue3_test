<template>
  <div class="exception-403">
    <ArtException
      :data="{
        title: '403',
        desc: '抱歉，您没有权限访问此页面',
        btnText: '返回首页',
        imgUrl,
      }" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import imgUrl from "@images/svg/403.svg";

defineOptions({ name: "Exception403" });

const router = useRouter();

// 添加返回上一页的功能
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
</script>

<style lang="scss" scoped></style>
