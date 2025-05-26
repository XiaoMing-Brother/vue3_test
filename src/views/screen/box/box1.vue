<template>
  <div class="box1">
    <heading title="人才团队"></heading>
    <div class="group-body">
      <div class="list">
        <div class="item" v-for="item in list">
          <div class="num">
            {{ item.metricsValue }}
            <!-- <NumberAnimation
              ref="number1"
              :from="0"
              :format="theFormat"
              :to="item.metricsValue"
              :duration="1"
              autoplay
              easing="linear"
            /> -->
          </div>
          <img src="@/assets/images/screen/base1.png" alt="" class="base" />
          <div class="name">{{ item.metricsName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import NumberAnimation from "vue-number-animation";
import heading from "../components/heading.vue";
import http from "@/utils/axios";

const list = ref([]);
// 获取列表
const getlistPage = async () => {
  let res = await http.post("/sys/screenTeam/getScreenTeamList", {});
  list.value = res.data.list;
};

const theFormat = (num) => {
  return Number(num).toFixed(0);
};
const update = () => {
  getlistPage();
};

onMounted(() => {
  update();
});

defineExpose({
  update,
});
</script>

<style lang="less" scoped>
//自然循环的渐隐渐显动画
@keyframes fadeIn {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.box1 {
  padding-left: 54px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.list {
  display: flex;
  flex-wrap: wrap;
  width: 380px;
  .item {
    position: relative;
    width: 75px;
    height: 90px;
    margin-bottom: 30px;
    cursor: pointer;
    margin-right: 60px;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .num {
      font-family: D-DIN-PRO-Bold;
      font-size: 36px;
      color: #24f5d0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 65px;
      z-index: 22;
      display: flex;
      // justify-content: center;
      // 文字不换行
      white-space: nowrap;
      // align-items: flex-end;
    }
    .base {
      position: absolute;
      left: 50%;
      bottom: 18%;
      transform: translateX(-50%);
      width: 75px;
      height: 79px;
      z-index: 20;
      //动画循环
      animation: fadeIn 2s ease-in-out infinite;
      // animation: fadeIn 1s ease-in-out ;
    }
    .name {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -25px;
      font-family: SourceHanSansCN-Medium;

      font-size: 14px;
      color: #bcc8d3;
      width: 110px;
      height: 50px;
      text-align: center;
    }
  }
}
</style>
