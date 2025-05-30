<template>
  <div class="page_container">
    <div class="table_box">
      <el-table class="elTable" key="id" :data="listData">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column prop="sort" label="操作" width="200" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="showQr(scope.row)">
              查看二维码
            </el-button>
            <el-button link type="primary" @click="downloadSingle(scope.row)">
              下载二维码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 导出按钮 -->
    <el-button type="primary" @click="downloadAll">
      导出全部二维码 ({{ listData.length }}个)
    </el-button>

    <QrCodeDialog
      v-model:show="diaShow"
      :qr-content="qrText"
      :qr-size="20"
    ></QrCodeDialog>

    <!-- 隐藏的二维码容器，用于生成下载内容 -->
    <div
      class="hidden-qr-container"
      style="position: absolute; left: -9999px; top: -9999px"
    >
      <div
        v-for="item in listData"
        :key="item.id"
        class="qr-item"
        :id="`qr-${item.id}`"
      >
        <div class="qr">
          <div class="qr_div">
            <div class="title">学习强国</div>
            <img src="@images/icon/bg-icon.png" alt="" class="bg-icon1" />
            <img src="@images/icon/bg-icon.png" alt="" class="bg-icon2" />

            <div class="info">
              <div class="qr-img">
                <qrcode-vue :value="item.metricsName || item.id" :size="200" />
              </div>

              <div class="name">学习强国</div>
              <div class="company">{{ item.metricsName || item.id }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import QrCodeDialog from "@/components/QrCodeDialog.vue";

import { exportQrCode, batchDownloadQRCodes } from "@/utils/exportQrCode";
// import { batchDownloadQRCodes } from "@/utils/qrBatchDownload";

import QrcodeVue from "qrcode.vue";

const columns = ref([
  { prop: "metricsName", label: "指标名称" },
  { prop: "metricsValue", label: "数量" },
]);

const listData = ref([
  { metricsName: "指标1", metricsValue: 1, id: 1 },
  { metricsName: "指标2", metricsValue: 2, id: 2 },
  { metricsName: "指标3", metricsValue: 3, id: 3 },
  { metricsName: "指标4", metricsValue: 4, id: 4 },
  { metricsName: "指标5", metricsValue: 5, id: 5 },
  { metricsName: "指标6", metricsValue: 6, id: 6 },
  { metricsName: "指标7", metricsValue: 7, id: 7 },
  { metricsName: "指标8", metricsValue: 8, id: 8 },
  { metricsName: "指标9", metricsValue: 9, id: 9 },
  { metricsName: "指标10", metricsValue: 10, id: 10 },
]);
onMounted(() => {
  initSort();
});

// 创建拖拽实例
const initSort = () => {
  const table = document.querySelector(
    ".elTable .el-table__body-wrapper tbody"
  );
  Sortable.create(table, {
    group: "shared",
    animation: 150,
    ghostClass: "sortable-ghost", //拖拽样式
    easing: "cubic-bezier(1, 0, 0, 1)",
    onStart: (item) => {
      console.log(item);
    },

    // 结束拖动事件
    onEnd: (item) => {
      console.log(item);
      setNodeSort(item.oldIndex, item.newIndex);
    },
  });
};

// 拖拽完成修改数据排序
const setNodeSort = (oldIndex, newIndex) => {
  const arr = [...listData.value]; // 避免直接修改原数组
  const currentRow = arr.splice(oldIndex, 1)[0];
  arr.splice(newIndex, 0, currentRow);

  // 原数组置空
  listData.value = [];
  nextTick(async () => {
    listData.value = arr;
    for (let index = 0; index < listData.value.length; index++) {
      const element = listData.value[index];
      element.OrderBy = index + 1;
    }
    //提交后后台数据进行排序
    console.log(" 更新后的列表数据:", listData.value);
  });
};

const diaShow = ref(false);
const qrText = ref("");

// 显示单个二维码弹窗
const showQr = (row) => {
  qrText.value = row.metricsName;
  diaShow.value = true;
};
// 下载单个二维码
const downloadSingle = async (row) => {
  await nextTick(); // 确保DOM更新完成

  const qrElement = document.getElementById(`qr-${row.id}`);
  if (!qrElement) return;

  // 使用组件中的样式和导出方法
  exportQrCode(row.metricsName || row.id, qrElement, {
    scale: 3,
    radius: 40,
  });
};

// 批量下载所有二维码为ZIP压缩包
const downloadAll = async () => {
  try {
    const result = await batchDownloadQRCodes(listData.value, {
      prefix: "qr",
      folderName: "学习强国二维码",
      getName: (item) => `${item.metricsName}_${item.id}.png`,
    });

    if (result.failedCount > 0) {
      ElMessage.warning(
        `成功下载 ${result.successCount} 个二维码，${result.failedCount} 个失败`
      );
    } else {
      ElMessage.success(`成功下载 ${result.successCount} 个二维码`);
    }
  } catch (error) {
    ElMessage.error("批量下载失败，请重试");
  }
};
</script>

<style lang="less" scoped>
.page_container {
  padding: 25px;
  /* 添加组件中的样式 */
  .hidden-qr-container {
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
  }
}
</style>
