<template>
  <div class="page_container">
    <div class="edit_box" @click="addEdit">
      <img src="@images/icon/edit.png" alt="" class="edit_icon" />
      <div class="edit_text">编辑</div>
    </div>

    <div class="table_box">
      <el-table class="elTable" key="id" :data="listData">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
        <el-table-column
          fixed="right"
          prop="sort"
          label="操作"
          width="80"
          align="center"
        >
          <template #default="scope">
            <el-button link type="primary" @click="showQr(scope.row)"
              >二维码</el-button
            >
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          prop="sort"
          label=""
          width="80"
          align="center"
        >
          <template #default="scope">
            <el-popover
              class="box-item"
              title="提示"
              content="长按上下拖动排序"
              placement="right"
            >
              <template #reference>
                <img src="@images/icon/sort.png" alt="" class="sort_icon" />
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <qrCode v-model:show="diaShow" :qr-content="qrText" :qr-size="20"></qrCode>
  </div>
</template>

<script setup>
// import http from "@/utils/axios";
import router from "@/router";
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import qrCode from "@/components/qRCode.vue";

const diaShow = ref(false);
const qrText = ref("");
const showQr = (row) => {
  diaShow.value = true;
  qrText.value = row.metricsName;
};

const columns = ref([
  { prop: "metricsName", label: "指标名称" },
  { prop: "metricsValue", label: "数量" },
]);

const listData = ref([
  { metricsName: "指标1", metricsValue: 1 },
  { metricsName: "指标2", metricsValue: 2 },
  { metricsName: "指标3", metricsValue: 3 },
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

const addEdit = () => {
  router.push({
    path: "/team/editTeam",
    query: {},
  });
};
</script>

<style lang="less" scoped>
.page_container {
  padding: 25px;
}
</style>
