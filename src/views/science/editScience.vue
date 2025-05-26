<template>
  <div class="page_contain contain">
    <BackHeader :title="pageName" />

    <div class="form_box">
      <el-form
        ref="ruleFormRef"
        style="max-width: 900px"
        :model="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <template v-if="pageType == 1">
          <div class="row" v-for="(item, index) in ruleForm" :key="index">
            <img src="@images/icon/label.png" alt="" class="icon" />
            <div class="label">平台{{ index + 1 }}:</div>

            <div class="row_item">
              <div class="name">平台名称</div>
              <el-form-item prop="platformName">
                <el-input
                  v-model="item.platformName"
                  placeholder="请输入平台名称"
                />
              </el-form-item>
            </div>
          </div>
        </template>

        <template v-if="pageType == 2">
          <div class="row" v-for="(item, index) in ruleForm" :key="index">
            <img src="@images/icon/label.png" alt="" class="icon" />
            <div class="label">项目{{ index + 1 }}:</div>

            <div class="row_item">
              <div class="name">项目名称</div>
              <el-form-item prop="projectName">
                <el-input
                  v-model="item.projectName"
                  placeholder="请输入项目名称"
                />
              </el-form-item>
            </div>

            <div class="row_item">
              <div class="name">负责单位/负责人</div>
              <el-form-item prop="leader">
                <el-input
                  v-model="item.leader"
                  placeholder="请输入负责单位/负责人"
                />
              </el-form-item>
            </div>

            <div
              class="add_box"
              v-show="
                (ruleForm.length > 1 && index !== ruleForm.length - 1) ||
                ruleForm.length === 5
              "
              @click="ruleForm.splice(index, 1)"
            >
              <img src="@images/icon/del.png" alt="" class="add_icon" />
            </div>
            <div
              class="add_box"
              v-show="index === ruleForm.length - 1 && ruleForm.length < 5"
              @click="ruleForm.push({ projectName: '', leader: '' })"
            >
              <img src="@images/icon/add.png" alt="" class="add_icon" />
              <div class="add_text">添加指标</div>
            </div>
          </div>
        </template>

        <template v-if="pageType == 3">
          <div class="row" v-for="(item, index) in ruleForm" :key="index">
            <img src="@images/icon/label.png" alt="" class="icon" />
            <div class="label">指标{{ index + 1 }}:</div>

            <div class="row_item">
              <div class="name">指标名称</div>
              <el-form-item prop="metricsName">
                <el-input
                  v-model="item.metricsName"
                  placeholder="请输入指标名称"
                />
              </el-form-item>
            </div>

            <div class="row_item">
              <div class="name">指标数量</div>
              <el-form-item prop="metricsValue">
                <el-input
                  v-model="item.metricsValue"
                  placeholder="请输入指标数量"
                />
              </el-form-item>
            </div>

            <div
              class="add_box"
              v-show="
                (ruleForm.length > 1 && index !== ruleForm.length - 1) ||
                ruleForm.length === 12
              "
              @click="ruleForm.splice(index, 1)"
            >
              <img src="@images/icon/del.png" alt="" class="add_icon" />
            </div>
            <div
              class="add_box"
              v-show="index == ruleForm.length - 1 && ruleForm.length < 12"
              @click="ruleForm.push({ metricsName: '', metricsValue: '' })"
            >
              <img src="@images/icon/add.png" alt="" class="add_icon" />
              <div class="add_text">添加指标</div>
            </div>
          </div>
        </template>

        <div class="button_box">
          <el-button @click="back" size="large"> 取消 </el-button>
          <el-button type="primary" @click="submit" size="large">
            提交
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import http from "@/utils/axios";
import BackHeader from "@/components/BackHeader.vue";
import { ElMessage } from "element-plus";
import { useValidator } from "@/utils/useValidator";
const { validateItems } = useValidator();

// 获取页面跳转携带的参数
const route = useRoute();
const pageName = ref("编辑已建设的平台");

const pageType = ref(1);

onMounted(() => {
  let { activeIndex } = route.query;
  // 确保 activeIndex 是字符串类型
  activeIndex = String(activeIndex);

  const pageNameMap = {
    1: "编辑已建设的平台",
    2: "编辑科研项目信息",
    3: "编辑产业促进信息",
  };

  // 根据 activeIndex 获取对应的页面名称，若不存在则使用默认值
  pageName.value = pageNameMap[activeIndex] || "编辑已建设的平台";
  pageType.value = activeIndex;

  getlistPage();
});

// 获取列表
const getlistPage = async () => {
  ruleForm.value = [];
  const urlMap = {
    1: "/sys/research/listPlatform",
    2: "/sys/research/listProject",
    3: "/sys/research/listIndustry",
  };

  let url = urlMap[pageType.value];
  let res = await http.post(url, {});
  let list = res.data;
  if (list.length == 0) {
    if (pageType.value == 1) {
      list = [
        {
          platformName: "",
        },
        {
          platformName: "",
        },
      ];
    }
    if (pageType.value == 2) {
      list = [{ projectName: "", leader: "" }];
    }
    if (pageType.value == 3) {
      list = [{ metricsName: "", metricsValue: "" }];
    }
  }

  ruleForm.value = list;
};

const ruleFormRef = ref();
const ruleForm = ref([]);

// 定义验证规则
const validationRules = {
  1: {
    rules: [{ key: "platformName", message: "平台名称不能为空" }],
    itemName: "平台",
  },
  2: {
    rules: [
      { key: "projectName", message: "项目名称不能为空" },
      { key: "leader", message: "负责人不能为空" },
    ],
    itemName: "项目",
  },
  3: {
    rules: [
      { key: "metricsName", message: "指标名称不能为空" },
      { key: "metricsValue", message: "指标数量不能为空" },
    ],
    itemName: "指标",
  },
};

// 提交
const submit = async () => {
  const urlMap = {
    1: "/sys/research/savePlatform",
    2: "/sys/research/saveProject",
    3: "/sys/research/saveIndustry",
  };

  let url = urlMap[pageType.value];
  let query = ruleForm.value;

  if (pageType.value == 1) {
    query = [];
    ruleForm.value.forEach((item) => {
      query.push(item.platformName);
    });
  }

  // 执行验证
  const ruleConfig = validationRules[pageType.value];
  if (ruleConfig) {
    const result = validateItems(
      ruleForm.value, // 始终使用原始数据验证
      ruleConfig.rules,
      ruleConfig.itemName
    );

    if (!result.valid) {
      ElMessage.error(result.error.message);
      return;
    }
  }

  let res = await http.post(url, query);
  if (res.code == 0) {
    ElMessage.success(res.msg);
    back();
  }
};

const back = () => {
  history.back();
};
</script>

<style lang="less" scoped>
.contain {
  padding-top: 0;

  .form_box {
    margin: 50px auto;
    max-width: 900px;

    .row {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      position: relative;
      .icon {
        width: 12px;
        height: 15px;
      }
      .label {
        font-size: 14px;
        color: #004d94;
        margin: 0 10px;
      }

      .row_item {
        display: flex;
        align-items: center;
        margin-right: 60px;
        .name {
          font-size: 14px;
          color: #888888;
          margin: 0 10px;
        }
        .el-form-item {
          margin: 0;
          .el-input {
            width: 230px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 6px;
          }
        }
      }

      // 添加按钮样式
      .add_box {
        position: absolute;
        right: -30px;
        top: 50%;
        transform: translateY(-50%);
        width: 100px;
        display: flex;
        justify-content: flex-start;
      }
    }

    .button_box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 100px;
    }
  }
}
</style>
