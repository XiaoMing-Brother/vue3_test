<template>
  <div class="box4">
    <heading title="专利成果"></heading>
    <div class="cards" v-if="list.length">
      <el-carousel
        indicator-position="outside"
        height="141px"
        :autoplay="true"
        :interval="5000"
      >
        <el-carousel-item v-for="(item, key, index) in list" :key="index">
          <div class="card">
            <div class="display">
              <img :src="fileUrl + item.imageUrl" alt="" class="figure" />
            </div>
            <div class="content">
              <div class="title">"{{ item.resultName }}"</div>
              <div class="detail">
                {{ item.description }}
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
  let res = await http.post("/sys/screenPatentResult/getPatentResultList", {
    pageNum: 1,
    pageSize: 9999,
  });
  list.value = res.data.list;
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
.box4 {
  width: 100%;
  margin-bottom: 35px;
  .cards {
    width: 100%;
    height: 141px;
    padding-left: 22px;
    box-sizing: border-box;
  }
  .card {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    height: 141px;

    .display {
      width: 120px;
      height: 141px;
      background-color: #274b76;
      opacity: 0.63;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 22px;
      flex-shrink: 0;
      .figure {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .content {
      padding-top: 11px;
      box-sizing: border-box;
      padding-right: 20px;
      .title {
        font-family: SourceHanSansCN-Medium;
        font-size: 16px;
        color: #dce8f7;
      }
      .detail {
        font-family: SourceHanSansCN-Regular;
        font-size: 14px;
        line-height: 20px;
        color: #bcc8d3;
        height: 80px;
        // background-color: yellow;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
