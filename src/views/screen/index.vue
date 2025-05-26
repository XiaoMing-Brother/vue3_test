<template>
  <div class="screen-container">
    <Head />
    <div class="fixed-left">
      <box1 ref="box1Ref"></box1>
      <box2 ref="box2Ref"></box2>
    </div>
    <div class="fixed-middle">
      <div class="fixed-decoration-left"></div>
      <div class="fixed-decoration-right"></div>
      <box6 ref="box6Ref"></box6>
      <box7 ref="box7Ref"></box7>
      <box8 ref="box8Ref"></box8>
    </div>
    <div class="fixed-right">
      <box3 ref="box3Ref"></box3>
      <box4 ref="box4Ref"></box4>
      <box5 ref="box5Ref"></box5>
    </div>
    <div class="floor-decoration"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Head from "./components/header.vue";
import box1 from "./box/box1.vue";
import box2 from "./box/box2.vue";
import box3 from "./box/box3.vue";
import box4 from "./box/box4.vue";
import box5 from "./box/box5.vue";
import box6 from "./box/box6.vue";
import box7 from "./box/box7.vue";
import box8 from "./box/box8.vue";

let timer = null;

const box1Ref = ref(null);
const box2Ref = ref(null);
const box3Ref = ref(null);
const box4Ref = ref(null);
const box5Ref = ref(null);
const box6Ref = ref(null);
const box7Ref = ref(null);
const box8Ref = ref(null);

onMounted(() => {
  document.body.style.overflow = "hidden";
  timer = setInterval(() => {
    box1Ref.value.update();
    box2Ref.value.update();
    box3Ref.value.update();
    box4Ref.value.update();
    box5Ref.value.update();
    box6Ref.value.update();
    box7Ref.value.update();
    box8Ref.value.update();
  }, 5000);
});

//销毁
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="less" scoped>
.screen-container {
  font-size: 12px;
  background-color: #080e40;
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/images/screen/bg-decoration.png");
  background-position: center center;
  background-repeat: no-repeat;
  // background-size: contain;

  .fixed-left {
    position: absolute;
    top: 77px;
    left: 0;
    // left: 20px;
  }
  .fixed-middle {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 938px;
    .fixed-decoration-left {
      position: absolute;
      top: 90px;
      left: -60px;
      background-image: url("@/assets/images/screen/fixed-decoration-left.png");
      background-repeat: no-repeat;
      background-size: cover;
      width: 130px;
      height: 772px;

      &::after {
        content: "";
        position: absolute;
        top: 55%;
        transform: translateY(-50%);
        right: 20px;
        background-image: url("@/assets/images/screen/fixed-decoration-left.gif");
        background-size: cover;
        background-repeat: no-repeat;
        width: 94px;
        height: 128px;
      }
    }
    .fixed-decoration-right {
      position: absolute;
      top: 90px;
      right: -60px;
      background-image: url("@/assets/images/screen/fixed-decoration-right.png");
      background-repeat: no-repeat;
      background-size: cover;
      width: 130px;
      height: 772px;

      &::after {
        content: "";
        position: absolute;
        top: 55%;
        transform: translateY(-50%);
        left: 20px;
        background-image: url("@/assets/images/screen/fixed-decoration-right.gif");
        background-size: cover;
        background-repeat: no-repeat;
        width: 94px;
        height: 128px;
      }
    }
  }
  .fixed-right {
    position: absolute;
    width: 410px;
    top: 77px;
    right: 0;
  }
  .floor-decoration {
    background-image: url("@/assets/images/screen/floor-decoration.png");
    background-repeat: no-repeat;
    background-size: cover;
    width: 1557px;
    height: 132px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    //不能选中
    user-select: none;
    opacity: 0.5;
    z-index: 1;
  }
}
</style>
