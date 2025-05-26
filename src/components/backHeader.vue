<template>
  <div class="back_header">
    <div class="back">
      <img src="@images/icon/back.png" alt="" @click="back" class="back_img" />
    </div>

    <div class="header">{{ title }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const back = () => {
  history.back();
};
</script>

<style lang="less" scoped>
.back_header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #cdcdcd58;
  position: relative;
  .back {
    position: absolute;
    left: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    .back_img {
      width: 20px;
      height: 16px;
    }
  }
  .header {
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 22px;
    letter-spacing: 0px;
    color: #043563;
  }
}
</style>
