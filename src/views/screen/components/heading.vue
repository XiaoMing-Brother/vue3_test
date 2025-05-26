<template>
  <div class="heading">
    <span> {{ title }}</span>
    <div class="bg"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="less" scoped>
.heading {
  width: 100%;
  margin-bottom: 26px;

  span {
    font-family: YouSheBiaoTiHei;
    font-size: 22px;
    background-image: linear-gradient(
      to bottom,
      #53b5fa,
      #f7fcff
    ); // 背景线性渐变
    color: #ffffff; // 兜底颜色，防止文字裁剪不生效
    background-clip: text;
    -webkit-background-clip: text; // 背景被裁减为文字的前景色
    -webkit-text-fill-color: transparent; // 文字填充为透明，优先级比color高。
    padding-left: 14px;
  }
  .bg {
    width: 100%;
    height: 33px;
    background-image: url("@/assets/images/screen/heading-bg.gif");
    background-size: cover;
  }
}
</style>
