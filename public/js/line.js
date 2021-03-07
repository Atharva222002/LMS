var speedCanvas = document.getElementById("speedChart");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var data_segment_validated = [0, 59, 75, 20, 20, 55]  // Under an OpCo, Validated leads under each segment
var dataFirst = {
    label: "Validated leads",
    data: data_segment_validated,
    lineTension: 0,
    fill: false,
    borderColor: 'blue'
  };

var data_segment_rejected = [20, 15, 60, 60, 65, 30]   // Under an OpCo, Rejected leads under each segment
var dataSecond = {
    label: "Rejected leads",
    data: data_segment_rejected,
    lineTension: 0,
    fill: false,
  borderColor: 'red'
  };

var speedData = {
  labels: ["seg1","seg2","seg3","seg4","seg5","seg6"],
  datasets: [dataFirst, dataSecond]
};

var chartOptions = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    }
  }
};

var lineChart = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});