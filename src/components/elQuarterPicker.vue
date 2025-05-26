<template>
  <div class="el-quarter-wrap">
    <el-popover width="300" v-model="visible">
      <template #reference>
        <el-input
          v-model="displayQuarter"
          placeholder="请选择季度"
          clearable
          :prefix-icon="Calendar"
          readonly
          @change="handleInputChange"
        >
          <template #suffix>
            <el-icon
              v-if="quarterDate"
              class="el-quarter-clear"
              @click="clearData"
            >
              <Close />
            </el-icon>
          </template>
        </el-input>
      </template>

      <div class="el-quarter__header">
        <span
          class="el-quarter-btn"
          :class="{ 'is-disabled': showYear <= minYear }"
          @click="changeYear(-1)"
        >
          <el-icon><DArrowLeft /></el-icon>
        </span>
        <div class="el-quarter__header-text" @click="toggleYearMode">
          {{ quarterTitle }}
        </div>
        <span
          class="el-quarter-btn"
          :class="{ 'is-disabled': showYear >= currentYear }"
          @click="changeYear(1)"
        >
          <el-icon><DArrowRight /></el-icon>
        </span>
      </div>

      <div class="el-quarter__content" v-if="!isYearMode">
        <div
          class="el-quarter-item"
          v-for="(item, index) in quarterLabels"
          :key="index"
        >
          <div
            class="cell"
            :class="{
              'is-active': showYear === selectedYear && quarterIndex === index,
              'is-disabled': isQuarterDisabled(showYear, index + 1),
            }"
            @click="selectQuarter(index)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="el-year__content" v-else>
        <div class="el-year-item" v-for="year in yearList" :key="year">
          <div
            class="cell"
            :class="{
              'is-active': showYear == year,
              'is-disabled': isYearDisabled(year),
            }"
            @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import {
  DArrowLeft,
  DArrowRight,
  Close,
  Calendar,
} from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ref, reactive, computed, onMounted, watch } from "vue";

const emit = defineEmits(["change"]);
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  year: {
    type: Number,
    default: null,
  },
  quarterNumber: {
    type: Number,
    default: null,
  },
});

// 常量定义
const quarterLabels = ["第一季度", "第二季度", "第三季度", "第四季度"];
const currentDate = dayjs();
const currentYear = currentDate.year();
const currentQuarter = Math.ceil(currentDate.month() / 3);
// 添加最小年份常量
const minYear = 2000; // 可以根据需要调整最小年份

// 响应式数据
const visible = ref(false);
const quarterDate = ref("");
const displayQuarter = ref("");
const selectedYear = ref("");
const showYear = ref(currentYear);
const quarterIndex = ref(-1);
const isYearMode = ref(false);
const startYear = ref(Math.floor(currentYear / 10) * 10);
const yearList = reactive([]);

// 计算属性
const quarterTitle = computed(() => {
  return isYearMode.value
    ? `${startYear.value}   年 - ${startYear.value + 9}年`
    : `${showYear.value}   年`;
});

// 方法定义
const selectQuarter = (index) => {
  if (isQuarterDisabled(showYear.value, index + 1)) return;

  quarterIndex.value = index;
  selectedYear.value = showYear.value;
  quarterDate.value = `${selectedYear.value}-Q${index + 1}`;
  displayQuarter.value = `${selectedYear.value}  年${quarterLabels[index]}`;

  emit("change", {
    year: Number(selectedYear.value), // 返回年份数字
    quarterNumber: index + 1, // 返回季度数字 (1-4)
  });
};

const changeYear = (num) => {
  if (isYearMode.value) {
    const newStartYear = startYear.value + num * 10;
    if (newStartYear + 9 >= minYear && newStartYear <= currentYear) {
      startYear.value = newStartYear;
      updateYearList();
    }
  } else {
    const newYear = Number(showYear.value) + num;
    if (newYear >= minYear && newYear <= currentYear) {
      showYear.value = newYear;
    }
  }
};

const clearData = () => {
  quarterDate.value = "";
  displayQuarter.value = "";
  selectedYear.value = "";
  showYear.value = currentYear;
  quarterIndex.value = -1;
  emit("change", {
    year: null,
    quarterNumber: null,
  });
};

const handleInputChange = (value) => {
  if (!value) {
    clearData();
    return;
  }

  const [year, quarter] = value.split("-Q");
  if (!year || !quarter) {
    clearData();
    return;
  }

  selectedYear.value = year;
  showYear.value = year;
  quarterIndex.value = Number(quarter) - 1;
  displayQuarter.value = `${year}年${quarterLabels[quarterIndex.value]}`;

  emit("change", {
    year: Number(year), // 返回年份数字
    quarterNumber: Number(quarter), // 返回季度数字 (1-4)
  });
};

const updateYearList = () => {
  yearList.length = 0;
  for (let i = 0; i < 10; i++) {
    yearList.push(startYear.value + i);
  }
};

const toggleYearMode = () => {
  isYearMode.value = !isYearMode.value;
  if (isYearMode.value) {
    startYear.value = Math.floor(showYear.value / 10) * 10;
    updateYearList();
  }
};

const selectYear = (year) => {
  if (!isYearDisabled(year)) {
    showYear.value = year;
    isYearMode.value = false;
  }
};

const isYearDisabled = (year) => year > currentYear;
const isQuarterDisabled = (year, quarter) =>
  year > currentYear || (year === currentYear && quarter > currentQuarter);

// 设置季度显示
const setQuarterDisplay = (year, quarterNum) => {
  if (year && quarterNum && quarterNum >= 1 && quarterNum <= 4) {
    selectedYear.value = year;
    showYear.value = year;
    quarterIndex.value = quarterNum - 1;
    quarterDate.value = `${year}-Q${quarterNum}`;
    displayQuarter.value = `${year}年${quarterLabels[quarterNum - 1]}`;
  } else {
    clearData();
  }
};

// 监听props变化
watch(
  () => props.year,
  (newVal) => {
    if (newVal && props.quarterNumber) {
      setQuarterDisplay(newVal, props.quarterNumber);
    } else {
      clearData();
    }
  }
);

watch(
  () => props.quarterNumber,
  (newVal) => {
    if (props.year && newVal) {
      setQuarterDisplay(props.year, newVal);
    } else {
      clearData();
    }
  }
);

// 生命周期
onMounted(() => {
  updateYearList();
  if (props.modelValue) {
    handleInputChange(props.modelValue);
  } else if (props.year && props.quarterNumber) {
    setQuarterDisplay(props.year, props.quarterNumber);
  }
});

// 暴露 clearData 方法给父组件
defineExpose({
  clearData,
});
</script>

<style lang="less" scoped>
.el-quarter-wrap {
  width: 100%;
}

.el-quarter__header {
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-quarter-btn {
    font-size: 12px;
    cursor: pointer;
    /* 添加禁用按钮样式 */
    &.is-disabled {
      color: #c0c4cc;
      cursor: not-allowed;

      &:hover {
        color: #c0c4cc !important;
      }
    }
  }

  .el-quarter__header-text {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
  }
}

.el-quarter__content {
  min-height: 100px;
  display: flex;
  padding: 10px 0;
  flex-wrap: wrap;

  .el-quarter-item {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .cell {
      padding: 4px 10px;
      cursor: pointer;
      white-space: nowrap;

      &:hover:not(.is-disabled) {
        color: #004d94;
      }

      &.is-disabled {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.is-active {
        color: #004d94;
      }
    }
  }
}

.el-year__content {
  min-height: 100px;
  display: flex;
  padding: 10px 0;
  flex-wrap: wrap;

  .el-year-item {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;

    .cell {
      padding: 4px 10px;
      cursor: pointer;
      white-space: nowrap;

      &:hover:not(.is-disabled) {
        color: #004d94;
      }

      &.is-disabled {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.is-active {
        color: #004d94;
      }
    }
  }
}

.el-quarter-clear {
  position: relative;
  color: #909399;
  display: none;
  height: 12px;
  width: 12px;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    height: 14px;
    width: 14px;
    margin: auto;
    border-radius: 50%;
    border: 1px solid #909399;
  }
}

.el-input:hover .el-quarter-clear {
  display: flex;
}
</style>
