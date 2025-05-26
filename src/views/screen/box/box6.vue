<template>
  <div class="box6">
    <div class="list">
      <div class="item" v-for="item in list">
        <div class="num-box">
          <div class="num">
            <NumberAnimation
              ref="number1"
              :from="0"
              :format="theFormat"
              :to="item.metricsValue"
              :duration="1"
              autoplay
              easing="linear"
            />
          </div>
          <div class="unit">{{ item.metricsUnit }}</div>
        </div>
        <div class="title">{{ item.metricsName }}</div>
      </div>
      <!-- <div class="item">
        <div class="num-box">
          <div class="num">{{ item.metricsValue }}</div>
          <div class="unit">{{ item.metricsUnit }}</div>
        </div>
        <div class="title">成果转化累计交易额</div>
      </div>
      <div class="item">
        <div class="num-box">
          <div class="num">700.13</div>
          <div class="unit">万</div>
        </div>
        <div class="title">成果转化累计数</div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import NumberAnimation from "vue-number-animation";
import http from "@/utils/axios";

let list = ref({});
// 获取列表
const getlistPage = async () => {
  let res = await http.post("/sys/result/listResultSum", {});
  list.value = res.data;
};
const theFormat = (num) => {
  //判断是否有小数
  if (num.toString().indexOf(".") > -1) {
    return parseFloat(num).toFixed(2);
  } else {
    return parseFloat(num).toFixed(0);
  }

  // return parseFloat(num).toFixed(2);
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
.box6 {
  background-image: url("@/assets/images/screen/middle-top-decoration.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom;
  padding: 0 60px;
  padding-bottom: 30px;
  box-sizing: border-box;
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .num-box {
        display: flex;
        align-items: flex-end;
        .num {
          font-family: D-DIN-PRO-SemiBold;
          font-size: 60px;
          background-image: linear-gradient(
            to bottom,
            #f7fcff,
            #53b5fa
          ); // 背景线性渐变
          color: #ffffff; // 兜底颜色，防止文字裁剪不生效
          background-clip: text;
          -webkit-background-clip: text; // 背景被裁减为文字的前景色
          -webkit-text-fill-color: transparent; // 文字填充为透明，优先级比color高。
        }
        .unit {
          font-family: SourceHanSansCN-Medium;
          font-size: 28px;

          color: #d0e1ff;
        }
      }
      .title {
        font-family: SourceHanSansCN-Medium;
        font-size: 23px;
        color: #d0e1ff;
      }
    }
  }
}
</style>
