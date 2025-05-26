<template>
  <div class="box7">
    <div class="title">成果转化趋势</div>
    <div class="chart">
      <div id="chart2" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import echartsPacking from "@/utils/echartsPacking.js";
import http from "@/utils/axios";
let timer = null;
var currentIndex = -1;
//季度
let quarterDate = {
  1: "一季度",
  2: "二季度",
  3: "三季度",
  4: "四季度",
};
const renderChart = (sourceData) => {
  clearInterval(timer);
  let xData2 = [];
  let data1 = [];
  let data2 = [];

  sourceData.forEach((item, index) => {
    data1.push(parseInt(item.amount));
    data2.push(parseInt(item.metricsValue));
    xData2.push(item.yearDate + quarterDate[item.quarterDate]);
  });

  var colors = [
    [
      {
        offset: 0,
        color: "rgba(71,134,229, 0.99)",
      },
      {
        offset: 1,
        color: "rgba(49,88,140,.99)",
      },
    ],
    [
      {
        offset: 0,
        color: "rgba(90, 226, 225, 0.99)",
      },
      {
        offset: 1,
        color: "rgba(54,119,131, 0.99)",
      },
    ],
  ];

  var option = {
    // backgroundColor: "#",
    tooltip: {
      show: true,
      trigger: "axis",

      axisPointer: {
        type: "none",
      },
      position: function (point, params, dom, rect, size) {
        console.log("e", point, params, dom, rect, size);

        return [point[0] - 90, point[1] - 80];
      },
      backgroundColor: "transparent",
      borderWidth: 0,
      extraCssText:
        //额外附加到浮层的css样式，此处为为浮层添加阴影及padding
        "box-shadow:none;",
      // extraCssText: `

      // `,
      // textStyle: {
      //   color: "#ebebeb", // 金色文字
      //   fontFamily: "SourceHanSansCN-Medium",
      // },

      formatter: (val) => {
        console.log(val);
        return (
          '<div class="tooltip-box">' +
          val[0].marker +
          "<span style='color:#7bb6f5'>" +
          val[0].seriesName +
          ":&nbsp;&nbsp;&nbsp;&nbsp;" +
          val[0].value +
          "万<br /></span>" +
          val[1].marker +
          "<span style='color:#7bb6f5'>" +
          val[1].seriesName +
          ":&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
          "<span style='color:#58dcdd'>" +
          val[1].value +
          "项</span><div class='bottom-arrow'></div></div>"
        );
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: "10%",
      bottom: "20%",
    },
    xAxis: {
      gridIndex: 0,
      data: xData2,
      show: true,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(67, 126, 212,.52)",
        },
      },
      axisLabel: {
        interval: 0,
        margin: 15,
        textStyle: {
          color: "#fff",
          fontFamily: "SourceHanSansCN-Medium",
          fontSize: 14,
        },
      },
    },
    yAxis: [
      {
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
      {
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
    ],
    series: [
      //  第一组数据内容
      {
        name: "转化交易额",
        type: "bar",
        barGap: "100%",
        yAxisIndex: 1,
        barWidth: 30,
        itemStyle: {
          //lenged文本
          // opacity: 0.7,
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

      // 柱子内容
      {
        name: "成果转化数",
        type: "bar",
        barWidth: 30,
        max: 100,
        itemStyle: {
          //lenged文本
          // opacity: 0.7,
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

  var myChart = echartsPacking("chart2", option);

  // 自动切换逻辑
  var dataLength = xData2.length;
  function autoShowTip() {
    // if (currentIndex == 1) return;
    currentIndex++;
    if (currentIndex >= dataLength) {
      currentIndex = 0;
    }
    // console.log(currentIndex);
    myChart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: currentIndex,
    });
  }
  autoShowTip();
  timer = setInterval(autoShowTip, 5000);
};
// 获取列表
const getlistPage = async () => {
  let res = await http.post("/sys/result/listResultTrend", {
    pageNum: 1,
    pageSize: 4,
  });

  console.log("统计", res.data);
  renderChart(res.data.list);
};

const update = () => {
  getlistPage();
};

onMounted(() => {
  update();
});

defineExpose({
  update,
});
</script>

<style lang="less" scoped>
.box7 {
  width: 100%;
  // height: 445px;
  margin-bottom: 60px;
  .title {
    font-family: SourceHanSansCN-Medium;
    font-size: 18px;
    color: #d0e1ff;
    padding-left: 60px;
    padding-top: 50px;
  }
  .chart {
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
    height: 330px;
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
