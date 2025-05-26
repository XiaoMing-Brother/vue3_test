import * as echarts from "echarts";
let echartsNode = [];
const echartsPacking = (id, option) => {
  let echart = null;
//   if ((echart = echartsNode[id])) {
//     console.log("重绘");
//     echart.setOption(option);
//     return;
//   }

  //图表id  设置function
  var worldMapContainer = document.getElementById(id);

  var resizeWorldMapContainer = function () {
    worldMapContainer.style.width = "100%";
    worldMapContainer.style.height = "100%";
  };

  resizeWorldMapContainer();
  var myChart = echarts.init(worldMapContainer);
  echartsNode[id] = myChart;

  myChart.setOption(option);

  window.addEventListener("resize", () => {
    for (let key in echartsNode) {
      echartsNode[key].resize();
    }
  });

  return myChart;
};
export default echartsPacking;
