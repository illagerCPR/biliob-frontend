var format = require("date-fns/format");
var { convertDateToUTC } = require("./util/convertDateToUTC");

function drawChart(data) {
  data = data.data;

  for (let index = 0; index < data.length; index++) {
    data[index]["datetime"] = new Date(data[index].datetime);
  }
  data = data
    .filter(function(item) {
      return item.fans != null && item.articleView != null;
    })
    .sort((a, b) => {
      return a.datetime - b.datetime;
    });

  let fansEfficiency = [];
  for (let index = 1; index < data.length; index++) {
    var efficiency = Math.round(
      (10000 * (data[index].fans - data[index - 1].fans)) /
        (data[index].archiveView - data[index - 1].archiveView)
    );
    if (efficiency != Infinity && efficiency != -Infinity) {
      fansEfficiency.push([data[index].datetime, efficiency]);
    }
  }

  let Chart = {
    legend: {
      data: ["万播放涨粉数"],
      bottom: "5px"
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: {
        label: {
          formatter: function(params) {
            return Math.round(params.value);
          }
        }
      }
    },
    grid: {
      left: "60px",
      right: "40px",
      top: "10px",
      bottom: "90px"
    },
    dataZoom: [
      {
        type: "inside",
        filterMode: "weakFilter"
      },
      {
        handleSize: "100%",
        handleStyle: {},
        bottom: "20px"
      }
    ],
    xAxis: {
      type: "time",
      axisPointer: {
        label: {
          formatter: function(params) {
            return (
              "日期：" +
              format(convertDateToUTC(new Date(params.value)), "YYYY-MM-DD")
            );
          }
        }
      }
    },
    yAxis: [
      {
        type: "value",
        min: function(value) {
          if (value.min > 0) {
            return 0;
          } else {
            return value.min;
          }
        },
        splitLine: {
          show: true
        }
      }
    ],
    series: [
      {
        name: "万播放涨粉数",
        data: fansEfficiency,
        smooth: true,
        showSymbol: false,
        type: "line",
        smoothMonotone: "x",
        areaStyle: {},
        markLine: {
          label: {
            position: "middle",
            formatter: "平均吸粉率 {c}",

            show: true
          },
          symbol: "",
          data: [
            {
              name: "平均线",
              // 支持 'average', 'min', 'max'
              type: "average",
              lineStyle: { color: "#666" }
            }
          ]
        }
      }
    ]
  };
  return Chart;
}
export default drawChart;
