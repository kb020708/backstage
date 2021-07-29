<template>
  <div>
    <div id="main" style="width: 1000px; height: 500px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {};
  },
  mounted() {
    var myCharts = echarts.init(document.getElementById("main"));
    var option = {
      title: {
        text: "堆叠区域图",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
    };
    this.$axios.Reports().then((res) => {
      let r = res.data.data;
      let result = _.merge(r,option)
      myCharts.setOption(result);
    });
  },
};
</script>

<style>
</style>