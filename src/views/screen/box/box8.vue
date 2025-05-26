<template>
  <div class="box8">
    <div class="title" style="margin-bottom: 50px;">专利转化项目({{ total }})</div>
    <el-carousel
      indicator-position="outside"
      height="218px"
      :autoplay="true"
      :interval="5000"
      v-if="list.length"
    >
      <el-carousel-item v-for="(group, key, index) in list" :key="index">
        <div class="list">
          <div class="item" v-for="(item, key, index2) in group" :key="index2">
            <div class="display">
              <img :src="fileUrl + item.imageUrl" alt="" class="figure" />
            </div>
            <div class="content">
              <div class="title">{{ item.projectName }}</div>
              <div class="detail">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import http from "@/utils/axios";
import { api } from "@/utils/config";
const fileUrl = ref(api + "/files");
const list = ref([]);
const total = ref(0);
// 获取列表
const getlistPage = async () => {
  let res = await http.post("/sys/screenPatentProject/getPatentProjectList", {
    pageNum: 1,
    pageSize: 9999,
  });
  console.log("res", res);
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

  console.log("group222", group);

  total.value = res.data.total;
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
.box8 {
  width: 812px;
  margin: 0 auto;
  > .title {
    font-family: YouSheBiaoTiHei;
    font-size: 24px;
    background-image: linear-gradient(
      to bottom,
      #53b5fa,
      #f7fcff
    ); // 背景线性渐变
    color: #ffffff; // 兜底颜色，防止文字裁剪不生效
    background-clip: text;
    -webkit-background-clip: text; // 背景被裁减为文字的前景色
    -webkit-text-fill-color: transparent; // 文字填充为透明，优先级比color高。
    text-align: center;
    margin-bottom: 22px;
  }
  .list {
    display: flex;
    justify-content: space-between;
    .item {
      background-image: url("@/assets/images/screen/card-bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 396px;
      height: 208px;
      display: flex;
      box-sizing: border-box;
      padding-left: 53px;
      padding-top: 55px;
      box-sizing: border-box;
      padding-right: 30px;

      .display {
        width: 87px;
        height: 105px;
        background-color: #274b76;
        // opacity: 0.63;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        flex-shrink: 0;
        .figure {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .content {
        box-sizing: border-box;
        .title {
          font-family: SourceHanSansCN-Medium;
          font-size: 16px;
          color: #dce8f7;
          // width: 200px;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
        .detail {
          font-family: SourceHanSansCN-Regular;
          font-size: 14px;
          line-height: 20px;
          color: #bcc8d3;
          height: 60px;
          // background-color: red;

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
</style>
