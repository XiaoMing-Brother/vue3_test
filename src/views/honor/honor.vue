<template>
  <div class="page_container">
    <div class="add_box" @click="add">
      <img src="@images/icon/add.png" alt="" class="add_icon" />
      <div class="add_text">新增</div>
    </div>

    <div class="table_box">
      <el-table class="elTable" key="id" :data="listData">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
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

        <el-table-column label="操作"
          ><template #default="scope">
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
            <el-form-item label="荣誉奖项：" prop="fullName">
              <el-input v-model="ruleForm.honorName" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="荣誉图片：">
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

            <el-form-item label="荣誉简介：" prop="roleId">
              <el-input
                v-model="ruleForm.description"
                :rows="4"
                type="textarea"
                placeholder="请输入简介"
              />
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
import http from "@/utils/axios";
import { useValidator } from "@/utils/useValidator";
const { validateObject } = useValidator();
import { api } from "@/utils/config";
const fileUrl = ref(api + "/files");

const columns = ref([
  { prop: "honorName", label: "荣誉奖项" },
  { prop: "imageUrl", label: "荣誉图片" },
  { prop: "description", label: "介绍" },
]);

const listData = ref([]);
onMounted(() => {
  getlistPage();
  initSort();
});
// 获取列表
const getlistPage = async () => {
  listData.value = [];

  let res = await http.post("/sys/screenHonor/getHonorList", {});

  let list = res.data.list;
  listData.value = list;
};

// 确定删除
const confirmEvent = async (id) => {
  let res = await http.post("/sys/screenHonor/deleteHonor/" + id);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    getlistPage();
  }
};

// 取消删除
const cancelEvent = () => {
  console.log("取消");
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
    setSort();
  });
};

// 排序
const setSort = async () => {
  let query = listData.value.map((item, index) => ({
    id: item.id,
    sort: index + 1,
  }));

  let res = await http.post("/sys/screenHonor/sort", query);
  if (res.code === 0) {
    ElMessage.success("排序成功");
  } else {
    ElMessage.error("排序失败");
  }
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
  ruleForm.id = row.id;
  ruleForm.description = row.description;
  ruleForm.honorName = row.honorName;
  ruleForm.imageUrl = row.imageUrl;

  let str = {
    name: row.honorName + ".png",
    url: `${fileUrl.value}${row.imageUrl}`, // 使用模板字符串拼接URL
  };
  fileList.value.push(str);
};

const ruleFormRef = ref();
const ruleForm = reactive({
  description: "",
  honorName: "",
  id: 0,
  imageUrl: "",
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

// 验证函数
const validateForm = () => {
  const rules = {
    // 第三步验证规则
    fields: ["honorName", "imageUrl", "description"],
    messages: {
      honorName: "请填写荣誉奖项",
      imageUrl: "请上传荣誉图片",
      description: "请填写荣誉简介",
    },
  };

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
  let url = "/sys/screenHonor/addHonor";
  if (isEdit.value) {
    url = "/sys/screenHonor/updateHonor";
  }
  if (!validateForm()) return;

  let res = await http.post(url, ruleForm);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    close(ruleFormRef.value);
    getlistPage();
  }
};

const close = (formEl) => {
  for (let key in ruleForm) {
    ruleForm[key] = null;
  }
  fileList.value = [];
  diaShow.value = false;
  formEl.resetFields();
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

  .add_box {
    display: flex;
    justify-content: flex-start;
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
  /* 全局样式 */
  .el-image-viewer__wrapper {
    z-index: 9999 !important;
  }
}
</style>
