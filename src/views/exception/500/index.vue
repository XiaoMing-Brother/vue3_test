<template>
  <div class="exception-403">
    <ArtException
      :data="{
        title: '500',
        desc: '抱歉，服务器出错了',
        btnText: '返回首页',
        imgUrl,
      }" />
  </div>
</template>

<script setup>
import imgUrl from "@/assets/images/svg/500.svg";

defineOptions({ name: "Exception500" });


</script>

<style lang="scss" scoped></style>
