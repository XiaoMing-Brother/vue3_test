<template>
  <div class="box2">
    <heading title="科创落地"></heading>
    <div class="title" style="margin-bottom: 37px">平台建设</div>
    <div style="padding-left: 20px">
      <div class="construction">
        <div class="item">
          <img
            src="@/assets/images/screen/box2-icon1.png"
            alt=""
            class="icon"
          />
          <div class="">
            <div class="text">{{ list1[0].platformName }}</div>
            <!-- <div class="text">工作站</div> -->
          </div>
        </div>
        <div class="item">
          <img
            src="@/assets/images/screen/box2-icon2.png"
            alt=""
            class="icon"
          />
          <div class="">
            <div class="text">{{ list1[1].platformName }}</div>
            <!-- <div class="text">养研究生基地</div> -->
          </div>
        </div>
      </div>
      <div class="title" style="margin-bottom: 22px">科研项目</div>
      <div class="cards" v-if="list2.length">
        <el-carousel
          indicator-position="outside"
          height="106px"
          :autoplay="true"
          :interval="3000"
        >
          <el-carousel-item v-for="(item, key, index) in list2" :key="index">
            <div class="card">
              <div class="top">
                <img
                  src="@/assets/images/screen/base-info-icon.png"
                  alt=""
                  class="icon"
                />
                <div class="title" style="margin-bottom: 0">
                  {{ item.projectName }}
                </div>
              </div>
              <div class="name">负责单位(人)：{{ item.leader }}</div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="title">产业促进</div>
      <div class="list-group" v-if="list3.length">
        <el-carousel
          indicator-position="outside"
          height="120px"
          :autoplay="true"
          :interval="3000"
        >
          <el-carousel-item v-for="(group, key, index) in list3" :key="index">
            <div class="list">
              <div
                class="item"
                v-for="(item, key2, index2) in group"
                :key="index2"
              >
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
                <img
                  src="@/assets/images/screen/base2.png"
                  alt=""
                  class="base"
                />
                <div class="name">{{ item.metricsName }}</div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import NumberAnimation from "vue-number-animation";
import heading from "../components/heading.vue";
import http from "@/utils/axios";

const list1 = ref([
  {
    platformName: "",
  },
  {
    platformName: "",
  },
]);
const list2 = ref([]);
const list3 = ref([]);
// 获取列表
const getlistPage = async (type) => {
  const urlMap = {
    1: "/sys/research/listPlatform",
    2: "/sys/research/listProject",
    3: "/sys/research/listIndustry",
  };

  let url = urlMap[type];
  let res = await http.post(url, {});

  if (type == 1) {
    list1.value = res.data;
  }
  if (type == 2) {
    list2.value = res.data;
  }
  if (type == 3) {
    let group = [];
    let newList = [];
    let i = 0;
    let len = res.data.length;
    res.data.forEach((item, key) => {
      i++;
      newList.push(item);
      if (i == 4) {
        i = 0;
        group.push(newList);
        newList = [];
        return;
      }

      if (key == len - 1) {
        group.push(newList);
      }
    });

    console.log("group", group);

    list3.value = group;
  }
};
const update = () => {
  getlistPage(1);
  getlistPage(2);
  getlistPage(3);
};
const theFormat = (num) => {
  return Number(num).toFixed(0);
};
onMounted(() => {
  update();
});

defineExpose({
  update,
});
</script>

<style lang="less" scoped>
.box2 {
  padding-left: 27px;
  box-sizing: border-box;
  .title {
    font-family: SourceHanSansCN-Bold;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #bceafe;
    margin-bottom: 20px;
  }
  .construction {
    display: flex;
    margin-bottom: 38px;
    .item {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .icon {
        width: 60px;
        height: 56px;
        margin-right: 8px;
      }
      .text {
        font-family: SourceHanSansCN-Medium;
        font-size: 16px;
        color: #bcc8d3;
        width: 100px;
      }
    }
  }
  .cards {
    width: 338px;
    height: 106px;
    margin-bottom: 37px;
  }
  .card {
    width: 338px;
    height: 106px;

    background-color: #090f42;
    box-shadow: inset -4px 0px 43px 0px rgba(46, 115, 189);
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    padding-left: 30px;
    box-sizing: border-box;
    .top {
      display: flex;
      align-items: center;
      .icon {
        width: 17px;
        height: 17px;
        margin-right: 8px;
      }
      .title {
        font-family: SourceHanSansCN-Medium;
        font-size: 16px;

        color: #dce8f7;
      }
    }
    .name {
      font-family: SourceHanSansCN-Medium;
      font-size: 16px;
      color: #bcc8d3;
    }
  }
  .list-group {
    width: 400px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    width: 400px;
    .item {
      position: relative;
      width: 69px;
      height: 90px;
      margin-bottom: 10px;
      cursor: pointer;
      margin-right: 40px;
      &:nth-child(4n) {
        margin-right: 0;
      }
      .num {
        font-family: SourceHanSansCN-Bold;
        font-size: 24px;
        color: #ffffff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 45%;
        z-index: 22;
        display: flex;
        text-shadow: rgba(255, 255, 255, 0.9) 0px 0px 10px;
        // align-items: flex-end;

        // 文字不换行
        white-space: nowrap;
      }
      .base {
        position: absolute;
        left: 50%;
        bottom: 18%;
        transform: translateX(-50%);
        width: 68px;
        height: 45px;
        z-index: 20;
      }
      .name {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -35px;
        font-family: SourceHanSansCN-Medium;
        font-size: 14px;
        color: #bcc8d3;
        width: 80px;
        height: 50px;
        text-align: center;
      }
    }
  }
}
</style>
