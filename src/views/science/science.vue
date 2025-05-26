<template>
  <div class="page_container">
    <div class="page_top">
      <div class="tabbar_box">
        <div
          class="tabbar_item"
          :class="{ active: activeIndex == 1 }"
          @click="checkTabbar(1)"
        >
          平台建设
        </div>
        <div
          class="tabbar_item"
          :class="{ active: activeIndex == 2 }"
          @click="checkTabbar(2)"
        >
          科研项目
        </div>
        <div
          class="tabbar_item"
          :class="{ active: activeIndex == 3 }"
          @click="checkTabbar(3)"
        >
          产业促进
        </div>
      </div>

      <div class="edit_box" @click="addEdit">
        <img src="@images/icon/edit.png" alt="" class="edit_icon" />
        <div class="edit_text">编辑</div>
      </div>
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
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, nextTick } from "vue";
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import http from "@/utils/axios";

const activeIndex = ref(1);
const columns = ref([{ prop: "platformName", label: "平台名称" }]);
const listData = ref([]);

onMounted(() => {
  let pageType = sessionStorage.getItem("pageType");

  if (pageType) {
    activeIndex.value = pageType;
    checkTabbar(pageType);
  } else {
    // getlistPage();
  }

  initSort();
});

// 点击顶部导航栏 切换页面
const checkTabbar = (index) => {
  activeIndex.value = index;

  const columnConfigs = {
    1: [{ prop: "platformName", label: "平台名称" }],
    2: [
      { prop: "projectName", label: "项目名称" },
      { prop: "leader", label: "负责单位/负责人" },
    ],
    3: [
      { prop: "metricsName", label: "指标名称" },
      { prop: "metricsValue", label: "数量" },
    ],
  };

  columns.value = columnConfigs[index] || columns.value;
  // getlistPage();
};

// 获取列表
const getlistPage = async () => {
  listData.value = [];
  const urlMap = {
    1: "/sys/research/listPlatform",
    2: "/sys/research/listProject",
    3: "/sys/research/listIndustry",
  };

  let url = urlMap[activeIndex.value];
  let res = await http.post(url, {});
  let list = res.data;

  listData.value = list;
};

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
      console.log("拖拽开始", item);
    },

    // 结束拖动事件
    onEnd: (item) => {
      console.log("拖拽结束", item);
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
    // console.log(" 更新后的列表数据:", listData.value);
    setSort();
  });
};

// 排序
const setSort = async () => {
  const urlMap = {
    1: "/sys/research/sortPlatform",
    2: "/sys/research/sortProject",
    3: "/sys/research/sortIndustry",
  };
  let url = urlMap[activeIndex.value];

  let query = listData.value.map((item, index) => ({
    id: item.id,
    sort: index + 1,
  }));

  let res = await http.post(url, query);
  if (res.code === 0) {
    ElMessage.success("排序成功");
  } else {
    ElMessage.error("排序失败");
  }
};

const addEdit = () => {
  router.push({
    path: "/science/editScience",
    query: {
      activeIndex: activeIndex.value,
    },
  });
  sessionStorage.setItem("pageType", activeIndex.value);
};
</script>

<style lang="less" scoped>
.page_container {
  padding: 25px;

  .page_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
