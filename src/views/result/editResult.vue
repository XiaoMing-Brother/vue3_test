<template>
  <div class="page_contain contain">
    <BackHeader :title="pageName" />

    <div class="form_box">
      <el-form
        ref="ruleFormRef"
        style="max-width: 1000px"
        :model="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
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
            <div class="name">数量</div>
            <el-form-item prop="metricsValue">
              <el-input v-model="item.metricsValue" placeholder="请输入数量" />
            </el-form-item>
          </div>
          <div class="row_item">
            <div class="name">单位</div>
            <el-form-item prop="metricsUnit">
              <el-input v-model="item.metricsUnit" placeholder="请输入单位" />
            </el-form-item>
          </div>
          <div
            class="add_box"
            v-show="
              (ruleForm.length > 1 && index !== ruleForm.length - 1) ||
              ruleForm.length === 3
            "
            @click="ruleForm.splice(index, 1)"
          >
            <img src="@images/icon/del.png" alt="" class="add_icon" />
          </div>
          <div
            class="add_box"
            v-show="index == ruleForm.length - 1 && ruleForm.length < 3"
            @click="
              ruleForm.push({
                metricsName: '',
                metricsValue: '',
                metricsValue: '',
              })
            "
          >
            <img src="@images/icon/add.png" alt="" class="add_icon" />
            <div class="add_text">添加指标</div>
          </div>
        </div>

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
const pageName = ref("编辑成果转化汇总数据");

onMounted(() => {
  let { activeIndex } = route.query;

  // getlistPage();
});

const ruleFormRef = ref();
const ruleForm = ref([]);

// 获取列表
const getlistPage = async () => {
  ruleForm.value = [];

  let res = await http.post("/sys/result/listResultSum", {});
  let list = res.data;

  if (list.length == 0) {
    list = [
      {
        metricsName: "",
        metricsValue: "",
        metricsValue: "",
      },
    ];
  }

  ruleForm.value = list;
};

// 提交
const submit = async () => {
  let query = ruleForm.value;
  // 执行验证
  const ruleConfig = {
    rules: [
      { key: "metricsName", message: "指标名称不能为空" },
      { key: "metricsValue", message: "指标数量不能为空" },
      { key: "metricsUnit", message: "指标单位不能为空" },
    ],
    itemName: "指标",
  };
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
  let res = await http.post("/sys/result/saveResultSum", query);
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
    max-width: 1000px;

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
        margin-right: 30px;
        .name {
          font-size: 14px;
          color: #888888;
          margin: 0 10px;
        }
        .el-form-item {
          margin: 0;
          .el-input {
            width: 200px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 6px;
          }
        }
      }
      // 添加按钮样式
      .add_box {
        position: absolute;
        right: -60px;
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
