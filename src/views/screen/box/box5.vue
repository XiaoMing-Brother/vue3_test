<template>
  <div class="box5">
    <heading title="荣誉奖项"></heading>
    <div class="cards" v-if="list.length">
      <el-carousel
        indicator-position="outside"
        height="220px"
        :autoplay="true"
        :interval="5000"
      >
        <el-carousel-item v-for="(group, key, index) in list" :key="index">
          <div class="card-group">
            <div
              class="card"
              v-for="(item, key2, index2) in group"
              :key="index2"
            >
              <div class="display">
                <img :src="fileUrl + item.imageUrl" alt="" class="figure" />
                <img
                  src="@/assets/images/screen/honor-pallet.png"
                  alt=""
                  class="honor-pallet"
                />
              </div>
              <div class="content">
                <div class="title">{{ item.honorName }}</div>
                <div class="detail">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import heading from "../components/heading.vue";
import http from "@/utils/axios";
import { api } from "@/utils/config";
const fileUrl = ref(api + "/files");

const list = ref([]);
// 获取列表
const getlistPage = async () => {
  let res = await http.post("/sys/screenHonor/getHonorList", {
    pageNum: 1,
    pageSize: 9999,
  });
  let group = [];
  let newList = [];
  let i = 0;
  let len = res.data.list.length;
  res.data.list.forEach((item, key) => {
    i++;
    newList.push(item);
    if (i == 2) {
      i = 0;
      group.push(newList);
      newList = [];
      return;
    }

    if (key == len - 1) {
      group.push(newList);
    }
  });
  console.log("荣誉", group);
  list.value = group;
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
.box5 {
  width: 100%;
  .cards {
    width: 100%;
    height: 110px;
    .card-group {
      .card:first-child {
        margin-bottom: 10px;
      }
      .card {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        height: 110px;

        .display {
          width: 81px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 22px;
          flex-shrink: 0;
          position: relative;
          .honor-pallet {
            position: absolute;
            left: 50%;
            bottom: 10px;
            width: 81px;
            height: 37px;
            flex-shrink: 0;
            transform: translateX(-50%);
          }
          .figure {
            position: absolute;
            left: 50%;
            bottom: 30px;
            transform: translateX(-50%);
            width: 45px;
            height: 62px;
            background-color: #fffdfa;
            position: absolute;
          }
        }

        .content {
          padding-top: 11px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .title {
            font-family: SourceHanSansCN-Medium;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 26px;
            letter-spacing: 0px;
            background-image: linear-gradient(
              to bottom,
              #53b5fa,
              #f7fcff
            ); // 背景线性渐变
            color: #ffffff; // 兜底颜色，防止文字裁剪不生效
            background-clip: text;
            -webkit-background-clip: text; // 背景被裁减为文字的前景色
            -webkit-text-fill-color: transparent; // 文字填充为透明，优先级比color高。
          }
          .detail {
            font-family: SourceHanSansCN-Medium;
            font-size: 14px;
            line-height: 20px;
            color: #d0e1ff;
            height: 63px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>
