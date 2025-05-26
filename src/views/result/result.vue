<template>
  <div class="page_container">
    <div class="page_top">
      <div class="tabbar_box">
        <div
          class="tabbar_item"
          :class="{ active: activeIndex === 1 }"
          @click="checkTabbar(1)"
        >
          成果转化汇总数据
        </div>
        <div
          class="tabbar_item"
          :class="{ active: activeIndex === 2 }"
          @click="checkTabbar(2)"
        >
          成果转化趋势
        </div>
      </div>

      <div class="edit_box" @click="addEdit" v-show="activeIndex === 1">
        <img src="@images/icon/edit.png" alt="" class="edit_icon" />
        <div class="edit_text">编辑</div>
      </div>
      <div class="add_box" @click="add" v-show="activeIndex === 2">
        <img src="@images/icon/add.png" alt="" class="add_icon" />
        <div class="add_text">新增季度数据</div>
      </div>
    </div>

    <div class="table_box">
      <el-table class="elTable" key="id" :data="listData">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <template #default="scope" v-if="item.prop === 'quarter'">
            <div>
              {{ scope.row.yearDate }}年第{{ scope.row.quarterDate }}季度
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="sort"
          label=""
          width="80"
          align="center"
          v-if="activeIndex === 1"
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
        <el-table-column label="操作" v-if="activeIndex === 2">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确认删除?"
              :icon="InfoFilled"
              @confirm="confirmEvent(scope.row.id)"
              @cancel="cancelEvent"
            >
              <template #reference>
                <el-button type="primary" link> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination_box" v-if="activeIndex === 2">
      <div class="total">总共 {{ query.total }} 条数据</div>

      <el-pagination
        background
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        layout="prev, pager, next"
        :total="query.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 编辑新增 -->
    <el-dialog
      v-model="diaShow"
      :title="isEdit ? '编辑' : '新增'"
      width="600"
      @close="close(ruleFormRef)"
    >
      <div class="dia-info">
        <div class="form_box">
          <el-form
            ref="ruleFormRef"
            style="max-width: 500px"
            :model="ruleForm"
            label-width="auto"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item label="季度选择：" prop="roleId">
              <el-quarter-picker
                ref="quarterPickerRef"
                :year="ruleForm.yearDate"
                :quarterNumber="ruleForm.quarterDate"
                @change="handleQuarterChange"
              />
            </el-form-item>

            <el-form-item label="成果转化交易额：" prop="amount">
              <el-input v-model="ruleForm.amount" placeholder="请输入">
                <template #append>万</template>
              </el-input>
            </el-form-item>
            <el-form-item label="成果转化累计数：" prop="metricsValue">
              <el-input v-model="ruleForm.metricsValue" placeholder="请输入">
                <template #append>项</template>
              </el-input>
            </el-form-item>

            <div class="button_box">
              <el-button @click="close(ruleFormRef)" size="large">
                取消
              </el-button>
              <el-button
                type="primary"
                @click="submitForm(ruleFormRef)"
                size="large"
              >
                提交
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, nextTick } from "vue";
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import ElQuarterPicker from "@/components/ElQuarterPicker.vue";
import http from "@/utils/axios";

const activeIndex = ref(1);
const columns = ref([
  { prop: "metricsName", label: "指标名称" },
  { prop: "metricsValue", label: "数值" },
  { prop: "metricsUnit", label: "单位" },
]);

const listData = ref([]);
onMounted(() => {
  handleCurrentChange(1);
  initSort();
});
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
// 获取列表
const getlistPage = async () => {
  listData.value = [];
  const urlMap = {
    1: "/sys/result/listResultSum",
    2: "/sys/result/listResultTrend",
  };

  let url = urlMap[activeIndex.value];
  let res = await http.post(url, query);

  let list = res.data;
  if (activeIndex.value == 2) {
    list = res.data.list;
    query.total = res.data.total;
  }
  listData.value = list;
};
// 分页切换
const handleCurrentChange = (number) => {
  query.pageNum = number;
  getlistPage();
};

// 点击顶部导航栏 切换页面
const checkTabbar = (index) => {
  activeIndex.value = index;

  const columnConfigs = {
    1: [
      { prop: "metricsName", label: "指标名称" },
      { prop: "metricsValue", label: "数值" },
      { prop: "metricsUnit", label: "单位" },
    ],
    2: [
      { prop: "quarter", label: "季度" },
      { prop: "amount", label: "成果转化交易额（万)" },
      { prop: "metricsValue", label: "成果转化数（项）" },
    ],
  };

  columns.value = columnConfigs[index] || columns.value;
  handleCurrentChange(1);
};

// 创建拖拽实例
const initSort = () => {
  const table = document.querySelector(
    ".elTable  .el-table__body-wrapper tbody"
  );

  // 如果已经存在 Sortable 实例，先销毁
  if (window.currentSortable) {
    window.currentSortable.destroy();
  }

  window.currentSortable = Sortable.create(table, {
    group: "shared",
    animation: 150,
    ghostClass: "sortable-ghost", //拖拽样式
    easing: "cubic-bezier(1, 0, 0, 1)",
    disabled: activeIndex.value !== 1, // 根据条件禁用拖动

    onStart: (item) => {
      // 如果禁用状态，阻止拖动
      if (activeIndex.value !== 1) {
        return false;
      }
      console.log(item);
    },

    // 结束拖动事件
    onEnd: (item) => {
      // 如果禁用状态，不处理拖动结束事件
      if (activeIndex.value !== 1) return;

      console.log(item);
      setNodeSort(item.oldIndex, item.newIndex);
    },
  });
};

// 监听 activeIndex 变化
watch(activeIndex, (newVal) => {
  if (window.currentSortable) {
    // 动态更新禁用状态
    window.currentSortable.option("disabled", newVal !== 1);
  }
});

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
    // console.log("  更新后的列表数据:", listData.value);
    setSort();
  });
};

// 排序
const setSort = async () => {
  let query = listData.value.map((item, index) => ({
    id: item.id,
    sort: index + 1,
  }));

  let res = await http.post("/sys/result/sortResultSum", query);
  if (res.code === 0) {
    ElMessage.success("排序成功");
  } else {
    ElMessage.error("排序失败");
  }
};

const addEdit = () => {
  router.push({
    path: "/result/editResult",
    // query: {
    //   activeIndex: activeIndex.value,
    // },
  });
};

// 新增编辑
const diaShow = ref(false);
const isEdit = ref(false);
const add = () => {
  diaShow.value = true;
  isEdit.value = false;
  for (let key in ruleForm) {
    ruleForm[key] = null;
  }
};
const edit = (row) => {
  diaShow.value = true;
  isEdit.value = true;
  ruleForm.amount = row.amount;
  ruleForm.id = row.id;
  ruleForm.metricsValue = row.metricsValue;
  ruleForm.quarterDate = row.quarterDate;
  ruleForm.yearDate = row.yearDate;
};

const quarterPickerRef = ref(null);
// 季度选择器
const handleQuarterChange = ({ year, quarterNumber }) => {
  console.log(" 年份:", year); // "2024"
  console.log(" 季度:", quarterNumber); // "1"

  ruleForm.yearDate = year;
  ruleForm.quarterDate = quarterNumber;
};

// 清空季度选择器
const clearQuarterPicker = () => {
  if (quarterPickerRef.value) {
    quarterPickerRef.value.clearData();
  }
};

const ruleForm = reactive({
  amount: "",
  id: 0,
  metricsValue: "",
  quarterDate: 0,
  yearDate: 0,
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      submit();
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 提交
const submit = async () => {
  let url = "/sys/result/addResultTrend";
  if (isEdit.value) {
    url = "/sys/result/editResultTrend";
  }

  if (!ruleForm.yearDate || !ruleForm.quarterDate) {
    ElMessage.error("请选择季度");
    return;
  }
  if (!ruleForm.amount || !ruleForm.metricsValue) {
    ElMessage.error("请填写数据");
    return;
  }

  let res = await http.post(url, ruleForm);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    close(ruleFormRef.value);
    getlistPage();
  }
};
const ruleFormRef = ref();

const close = (formEl) => {
  for (let key in ruleForm) {
    ruleForm[key] = null;
  }
  diaShow.value = false;
  formEl.resetFields();
  clearQuarterPicker();
};

// 确定删除
const confirmEvent = async (id) => {
  let res = await http.post("/sys/result/delResultTrend/" + id);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    getlistPage();
  }
};

// 取消删除
const cancelEvent = () => {
  console.log("取消");
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

  .dia-info {
    .form_box {
      margin: 50px auto;
      width: 500px;
      .el-form-item__content {
        width: 100%;
      }
      .button_box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 100px;
      }
    }
  }
}
</style>
