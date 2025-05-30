<template>
  <div class="qr" :ref="qrRef">
    <div class="qr_div">
      <div class="title">学习强国</div>
      <img src="@images/icon/bg-icon.png" alt="" class="bg-icon1" />
      <img src="@images/icon/bg-icon.png" alt="" class="bg-icon2" />
      <div class="info">
        <div class="qr-img">
          <qrcode-vue :value="content" :size="size" />
        </div>
        <div class="name">学习强国</div>
        <div class="company">{{ content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from "qrcode.vue";

defineProps({
  content: { type: String, default: "学习强国" },
  size: { type: Number, default: 200 },
  qrRef: { type: String, default: "qr_cord" },
});
</script>

<style lang="less" scoped>
.qr {
  width: 360px;
  height: 540px;
  background-color: transparent;
  margin: 0 auto;
  box-shadow: 0px 2px 10px 0px rgba(9, 59, 117, 0.24);

  .qr_div {
    width: 100%;
    height: 100%;
    background-color: #004d94;
    position: relative;

    .title {
      font-size: 28px;
      color: #ffffff;
      padding: 30px;
    }

    .bg-icon1 {
      width: 151px;
      height: 180px;
      position: absolute;
      top: 20px;
      right: 35px;
      z-index: 0;
    }

    .bg-icon2 {
      width: 151px;
      height: 180px;
      position: absolute;
      top: 5px;
      right: -40px;
      z-index: 0;
    }

    .info {
      width: 360px;
      height: 430px;
      background-image: linear-gradient(0deg, #ffffff 0%, #cae4fc 100%),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      border-radius: 20px 20px 0 0;
      overflow: hidden;
      position: absolute;
      bottom: 0;
      z-index: 1;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .qr-img {
        width: 230px;
        height: 230px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 20px;
        img {
          width: 210px;
          height: 210px;
        }
      }

      .name {
        font-size: 22px;
        margin: 20px 0;
        color: #333333;
      }

      .company {
        font-size: 17px;
        color: #333333;
      }
    }
  }
}
</style>
