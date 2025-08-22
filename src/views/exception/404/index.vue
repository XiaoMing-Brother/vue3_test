<template>
  <div class="exception-403">
    <ArtException
      :data="{
        title: '404',
        desc: '抱歉，您访问的页面不存在',
        btnText: '返回首页',
        imgUrl,
      }" />
  </div>
</template>

<script setup>
import imgUrl from "@/assets/images/svg/404.svg";

defineOptions({ name: "Exception404" });
</script>

<style lang="scss" scoped></style>
