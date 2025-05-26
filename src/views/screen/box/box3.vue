<template>
  <div class="box3">
    <heading title="专利申请/授权"></heading>
    <div class="title">专利增长趋势</div>

    <div class="chart">
      <div id="chart1" style="width: 100%; height: 100%"></div>
    </div>
    <img
      src="@/assets/images/screen/chart-bottom-bg.png"
      alt=""
      class="floor"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import heading from "../components/heading.vue";
import * as echarts from "echarts";
import echartsPacking from "@/utils/echartsPacking.js";
import http from "@/utils/axios";
//季度
let quarterDate = {
  1: "一季度",
  2: "二季度",
  3: "三季度",
  4: "四季度",
};
var currentIndex = -1;
let dataLength = null;
var timer = null;
let myChart = null;
const renderChart = (sourceData) => {
  myChart = null;
  let xData2 = [];
  let data1 = [];
  let data2 = [];

  sourceData.forEach((item, index) => {
    data1.push(parseInt(item.requestNum));
    data2.push(parseInt(item.authorizeNum));
    xData2.push(item.yearDate + quarterDate[item.quarterDate]);
  });

  var colors = [
    [
      {
        offset: 0,
        color: "rgba(56, 106, 234,.46)", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(109, 145, 245,.46)", // 100% 处的颜色
      },
    ],
    [
      {
        offset: 0,
        color: "rgba(37, 255, 140,.46)", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(109, 245, 237,.46)", // 100% 处的颜色
      },
    ],
  ];

  var option = {
    // backgroundColor: "#",
    tooltip: {
      show: true,
      trigger: "axis",
      trigger: "axis",

      axisPointer: {
        type: "none",
      },
      backgroundColor: "transparent",
      borderWidth: 0,
      extraCssText: "box-shadow:none;",
      // textStyle: {
      //   color: "#ebebeb", // 金色文字
      //   fontFamily: "SourceHanSansCN-Medium",
      // },
      position: function (point, params, dom, rect, size) {
        console.log("e", point, params, dom, rect, size);

        return [point[0] - 60, point[1] - 80];
      },

      formatter: (val) => {
        console.log(val);
        return (
          "<div class='tooltip-box'>" +
          val[0].marker +
          "<span style='color:#7bb6f5'>" +
          val[0].seriesName +
          ":&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
          val[0].value +
          "<br />" +
          val[5].marker +
          "<span style='color:#7bb6f5'>" +
          val[5].seriesName +
          ":&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
          val[5].value +
          "<div class='bottom-arrow'></div></div>"
        );
      },
    },
    grid: {
      left: 0,
      top: "20%",
      right: 0,
      bottom: "10%",
    },
    xAxis: {
      data: xData2,
      show: true,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: "#fff",
          fontSize: 12,
        },
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: [
      //  第一组数据内容
      {
        name: "申请数",
        type: "bar",
        barGap: "100%",
        barWidth: 18,
        itemStyle: {
          //lenged文本
          opacity: 0.7,
          color: function (params) {
            var a = params.name.slice(0, 2);

            return new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              colors[0],

              false
            );
          },
        },
        data: data1,
      },
      // 第一组数据底部装饰
      {
        // 柱子底部
        name: "",
        type: "pictorialBar",
        symbolSize: [18, 9.9],
        silent: true, // ← 关键配置
        symbolOffset: ["-100%", 2],
        z: 12,
        // itemStyle: "#5d89e4",
        itemStyle: {
          opacity: 1,
          color: "#5d89e4",
        },
        data: [0.5, 0.5, 0.5, 0.5],
      },
      // 第一组数据顶部装饰
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [18, 9.9],
        silent: true, // ← 关键配置
        symbolOffset: ["-100%", -4],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: "#5d89e4",
        },
        symbolPosition: "end",
        data: data1,
      },

      // 第二组数据底部装饰
      {
        // 柱子底部
        name: "",
        silent: true, // ← 关键配置
        type: "pictorialBar",
        symbolSize: [18, 9.9],
        symbolOffset: ["100%", 2],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: "#2dad99",
        },
        data: [0.5, 0.5, 0.5, 0.5],
      },
      // 第二组数据顶部装饰
      {
        name: "",
        silent: true, // ← 关键配置
        type: "pictorialBar",
        symbolSize: [18, 9.9],
        symbolOffset: ["100%", -3],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: "#2dad99",
        },
        symbolPosition: "end",
        data: data2,
      },
      // 柱子内容
      {
        name: "授权数",
        type: "bar",
        barWidth: 18,
        itemStyle: {
          //lenged文本
          opacity: 0.7,
          color: function (params) {
            var a = params.name.slice(0, 2);

            return new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              colors[1],
              false
            );
          },
        },
        data: data2,
      },
    ],
  };

  myChart = echartsPacking("chart1", option);

  // 自动切换逻辑
  dataLength = xData2.length;
  if (currentIndex == -1) {
    autoShowTip();
    timer = setInterval(autoShowTip, 5000);
  }
};
// 获取列表
const getlistPage = async () => {
  let res = await http.post("/sys/screenPatentTrend/getPatentTrendList", {
    pageNum: 1,
    pageSize: 4,
  });

  console.log("统计", res.data);
  renderChart(res.data.list);
};

const update = () => {
  getlistPage();
};
function autoShowTip() {
  if (!myChart) return;
  currentIndex++;
  if (currentIndex >= dataLength) {
    currentIndex = 0;
  }
  console.log(currentIndex);
  myChart.dispatchAction({
    type: "showTip",
    seriesIndex: 0,
    dataIndex: currentIndex,
  });
}
onMounted(() => {
  update();
});

//销毁
onUnmounted(() => {
  clearInterval(timer);
});

defineExpose({
  update,
});
</script>

<style lang="less" scoped>
.box3 {
  width: 100%;
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 33px;
  .title {
    font-family: SourceHanSansCN-Medium;
    font-size: 18px;
    background-image: linear-gradient(
      to bottom,
      #f7fcff,
      #53b5fa
    ); // 背景线性渐变
    color: #ffffff; // 兜底颜色，防止文字裁剪不生效
    background-clip: text;
    -webkit-background-clip: text; // 背景被裁减为文字的前景色
    -webkit-text-fill-color: transparent; // 文字填充为透明，优先级比color高。
    padding-left: 23px;
  }
  .chart {
    width: 100%;
    height: 220px;
    // padding: 0 20px;
    padding: 0 20px 0 25px;
    box-sizing: border-box;
    position: relative;
    z-index: 60;
  }
  .floor {
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 392px;
    height: 39px;
    z-index: 20;
  }
}
</style>
<style>
.tooltip-box {
  position: relative;
  padding: 7px;
  box-shadow: inset -6px 0px 27px 0px #4581db;
  border: solid 1px #5995f6;
  background-color: #0b1245;
  font-family: "SourceHanSansCN-Medium";
  /* font-size: 12px; */
  padding: 10px;
  border-radius: 2px;
  color: #ebebeb;
  /* :"#ebebeb" */
}
.bottom-arrow {
  width: 12px;
  height: 7px;
  background-image: url("@/assets/images/screen/bottom-arrow.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -7px;
}
</style>
