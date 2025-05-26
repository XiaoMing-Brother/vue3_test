<template>
  <div class="page_container">
    <div class="page_top">
      <div class="tabbar_box">
        <div
          class="tabbar_item"
          :class="{ active: activeIndex === 1 }"
          @click="checkTabbar(1)"
        >
          专利转化项目
        </div>
        <div
          class="tabbar_item"
          :class="{ active: activeIndex === 2 }"
          @click="checkTabbar(2)"
        >
          专利增长趋势
        </div>
        <div
          class="tabbar_item"
          :class="{ active: activeIndex === 3 }"
          @click="checkTabbar(3)"
        >
          专利成果
        </div>
      </div>

      <div class="add_box" @click="add">
        <img src="@images/icon/add.png" alt="" class="add_icon" />
        <div class="add_text">新增</div>
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
          <template #default="scope" v-if="item.prop === 'imageUrl'">
            <el-image
              style="width: 60px; height: 60px"
              :src="fileUrl + scope.row.imageUrl"
              :preview-src-list="[fileUrl + scope.row.imageUrl]"
              hide-on-click-modal
              :zoom-rate="1.2"
              :max-scale="2"
              :min-scale="0.5"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
        <el-table-column
          fixed="right"
          prop="sort"
          label=""
          width="80"
          align="center"
          v-if="activeIndex !== 2"
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
            <el-form-item
              label="项目名称："
              prop="projectName"
              v-if="activeIndex === 1"
            >
              <el-input v-model="ruleForm.projectName" placeholder="请输入" />
            </el-form-item>
            <el-form-item
              label="成果名称："
              prop="resultName"
              v-if="activeIndex === 3"
            >
              <el-input v-model="ruleForm.resultName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="专利图片" v-if="activeIndex !== 2">
              <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                :action="fileApi"
                :data="fileData"
                :headers="header"
                multiple
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :limit="1"
                accept="image/*"
                list-type="picture"
              >
                <el-button type="primary">上传图片</el-button>
              </el-upload>
            </el-form-item>

            <el-form-item
              label="简介："
              prop="description"
              v-if="activeIndex !== 2"
            >
              <el-input
                v-model="ruleForm.description"
                :rows="4"
                type="textarea"
                placeholder="请输入简介"
              />
            </el-form-item>

            <el-form-item
              label="季度选择："
              prop="roleId"
              v-if="activeIndex == 2"
            >
              <el-quarter-picker
                ref="quarterPickerRef"
                :year="ruleForm.yearDate"
                :quarterNumber="ruleForm.quarterDate"
                @change="handleQuarterChange"
              />
            </el-form-item>

            <el-form-item
              label="申请数："
              prop="requestNum"
              v-if="activeIndex == 2"
            >
              <el-input v-model="ruleForm.requestNum" placeholder="请输入" />
            </el-form-item>
            <el-form-item
              label="授权数："
              prop="authorizeNum"
              v-if="activeIndex == 2"
            >
              <el-input v-model="ruleForm.authorizeNum" placeholder="请输入" />
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
import { ref, nextTick } from "vue";
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import ElQuarterPicker from "@/components/ElQuarterPicker.vue";
import http from "@/utils/axios";
import { useValidator } from "@/utils/useValidator";
const { validateObject } = useValidator();

import { api } from "@/utils/config";
const fileUrl = ref(api + "/files");

const activeIndex = ref(1);
const columns = ref([
  { prop: "projectName", label: "项目名称" },
  { prop: "imageUrl", label: "专利图片" },
  { prop: "description", label: "介绍" },
]);

const listData = ref([]);
onMounted(() => {
  // handleCurrentChange(1);
  initSort();
});
// 点击顶部导航栏 切换页面
const checkTabbar = (index) => {
  activeIndex.value = index;

  const columnConfigs = {
    1: [
      { prop: "projectName", label: "项目名称" },
      { prop: "imageUrl", label: "专利图片" },
      { prop: "description", label: "介绍" },
    ],
    2: [
      { prop: "quarter", label: "季度" },
      { prop: "requestNum", label: "申请数" },
      { prop: "authorizeNum", label: "授权数" },
    ],
    3: [
      { prop: "resultName", label: "成果名称" },
      { prop: "imageUrl", label: "专利图片" },
      { prop: "description", label: "介绍" },
    ],
  };

  columns.value = columnConfigs[index] || columns.value;
  handleCurrentChange(1);
};

const query = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 获取列表
const getlistPage = async () => {
  listData.value = [];
  const urlMap = {
    1: "/sys/screenPatentProject/getPatentProjectList",
    2: "/sys/screenPatentTrend/getPatentTrendList",
    3: "/sys/screenPatentResult/getPatentResultList",
  };

  let url = urlMap[activeIndex.value];
  let res = await http.post(url, query);

  let list = res.data.list;
  query.total = res.data.total;

  listData.value = list;
};

// 分页切换
const handleCurrentChange = (number) => {
  query.pageNum = number;
  getlistPage();
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
    disabled: activeIndex.value == 2, // 根据条件禁用拖动

    onStart: (item) => {
      // 如果禁用状态，阻止拖动
      if (activeIndex.value == 2) {
        return false;
      }
      console.log(item);
    },

    // 结束拖动事件
    onEnd: (item) => {
      // 如果禁用状态，不处理拖动结束事件
      if (activeIndex.value == 2) return;

      console.log(item);
      setNodeSort(item.oldIndex, item.newIndex);
    },
  });
};

// 监听 activeIndex 变化
watch(activeIndex, (newVal) => {
  if (window.currentSortable) {
    // 动态更新禁用状态
    window.currentSortable.option("disabled", newVal == 2);
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
  const urlMap = {
    1: "/sys/screenPatentProject/sort",
    // 2: "",
    3: "/sys/screenPatentResult/sort",
  };

  let url = urlMap[activeIndex.value];

  let res = await http.post(url, query);
  if (res.code === 0) {
    ElMessage.success("排序成功");
  } else {
    ElMessage.error("排序失败");
  }
};

// 确定删除
const confirmEvent = async (id) => {
  const urlMap = {
    1: "/sys/screenPatentProject/deletePatentProject/",
    2: "/sys/screenPatentTrend/deletePatentTrend/",
    3: "/sys/screenPatentResult/deletePatentResult/",
  };

  let url = urlMap[activeIndex.value];
  let res = await http.post(url + id);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    getlistPage();
  }
};

// 取消删除
const cancelEvent = () => {
  console.log("取消");
};

// 编辑新增弹窗
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
  diaShow.value = true; // 显示弹窗
  isEdit.value = true; // 设置为编辑模式
  ruleForm.id = row.id; // 设置ID

  // 非 case 2 的情况，设置公共字段
  if (activeIndex.value !== 2) {
    ruleForm.description = row.description;
    ruleForm.imageUrl = row.imageUrl;
    fileList.value.push({
      name: "专利图片.png",
      url: `${fileUrl.value}${row.imageUrl}`, // 使用模板字符串拼接URL
    });
  }

  // 根据不同 activeIndex 设置特定字段
  switch (activeIndex.value) {
    case 1: // 项目名称
      ruleForm.projectName = row.projectName;
      break;
    case 2: // 季度/年度数据
      ruleForm.quarterDate = row.quarterDate;
      ruleForm.yearDate = row.yearDate;
      ruleForm.requestNum = row.requestNum;
      ruleForm.authorizeNum = row.authorizeNum;
      break;
    case 3: // 成果名称
      ruleForm.resultName = row.resultName;
      break;
  }
};
const ruleFormRef = ref();
const ruleForm = reactive({
  description: "",
  id: 0,
  imageUrl: "",
  projectName: "",

  authorizeNum: "",
  quarterDate: 0,
  requestNum: "",
  yearDate: 0,

  resultName: "",
});

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

// 验证规则配置
const validationRules = {
  1: {
    // 第一步验证规则
    fields: ["projectName", "imageUrl", "description"],
    messages: {
      projectName: "请填写项目名称",
      imageUrl: "请上传专利图片",
      description: "请填写简介",
    },
  },
  2: {
    // 第二步验证规则
    fields: ["yearDate", "quarterDate", "requestNum", "authorizeNum"],
    messages: {
      yearDate: "请选择季度",
      quarterDate: "请选择季度",
      requestNum: "请填写申请数",
      authorizeNum: "请填写授权数",
    },
  },
  3: {
    // 第三步验证规则
    fields: ["resultName", "imageUrl", "description"],
    messages: {
      resultName: "请填写成果名称",
      imageUrl: "请上传专利图片",
      description: "请填写简介",
    },
  },
};
// 验证函数
const validateForm = () => {
  const currentStep = activeIndex.value;
  const rules = validationRules[currentStep];

  if (!rules) return true; // 如果没有配置规则，默认通过

  const { valid, error } = validateObject(
    ruleForm,
    rules.fields,
    rules.messages
  );

  if (!valid) {
    ElMessage.error(error.message);
    return false;
  }

  return true;
};
// 提交
const submit = async () => {
  let urlMap = {
    1: "/sys/screenPatentProject/addPatentProject",
    2: "/sys/screenPatentTrend/addPatentTrend",
    3: "/sys/screenPatentResult/addPatentResult",
  };
  if (isEdit.value) {
    urlMap = {
      1: "/sys/screenPatentProject/updatePatentProject",
      2: "/sys/screenPatentTrend/updatePatentTrend",
      3: "/sys/screenPatentResult/updatePatentResult",
    };
  }

  let url = urlMap[activeIndex.value];

  if (!validateForm()) return;

  let res = await http.post(url, ruleForm);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    close(ruleFormRef.value);
    handleCurrentChange(1);
  }
};

const close = (formEl) => {
  for (let key in ruleForm) {
    ruleForm[key] = null;
  }
  fileList.value = [];
  diaShow.value = false;
  formEl.resetFields();
  clearQuarterPicker();
};

// 图片上传部分
const fileList = ref([]);
const fileApi = ref(api + "/sys/file/upload");
const fileData = ref({
  type: 0,
});
// 图片上传部分
const header = ref({
  Authorization: sessionStorage.getItem("token"),
});

// 上传成功
const handleAvatarSuccess = (res, uploadFile) => {
  ruleForm.imageUrl = res.data.fileUrl;
};
// 删除
const handleRemove = (file, fileList) => {
  ruleForm.imageUrl = null;
  fileList.value = [];
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
