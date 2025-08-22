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
import imgUrl from "@/assets/images/svg/403.svg";

defineOptions({ name: "Exception403" });


</script>

<style lang="scss" scoped></style>
