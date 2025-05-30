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

    <!-- 对话框 -->
    <QrCodeDialog v-model:show="diaShow" :qr-content="qrText" />

    <!-- 隐藏的二维码容器 -->
    <div class="hidden-qr-container">
      <div
        v-for="item in listData"
        :key="item.id"
        :id="`qr-${item.id}`"
        class="qr-item"
      >
        <QrContent :content="item.metricsName || item.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import QrCodeDialog from "@/components/QrCodeDialog.vue";
import QrContent from "@/components/QrContent.vue";
import { exportQrCode, batchDownloadQRCodes } from "@/utils/exportQrCode";

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

  .hidden-qr-container {
    position: absolute;
    left: -9999px;
    top: -9999px;
    .qr-item {
      display: inline-block; // 确保每个二维码项正确布局
      margin: 5px; // 添加一些间距防止渲染问题
    }
  }
}
</style>
