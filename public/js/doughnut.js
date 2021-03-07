$(function(){

    //get the doughnut chart canvas
    var ctx1 = $("#doughnut-chartcanvas-1");
 
  
    //doughnut chart data
    var data2 = {
        labels: ["OpCo1","OpCo2","OpCo3"],
        datasets: [
          {
            label: "TeamB Score",
            data: [40, 34, 26],
            backgroundColor: [
              "#FAEBD7",
              "#DCDCDC",
              "#E9967A",
            ],
            borderColor: [
              "#E9DAC6",
              "#CBCBCB",
              "#D88569",
              "#E4CDA2",
              "#89BC21"
            ],
            borderWidth: [1, 1, 1, 1, 1]
          }
        ]
      };
  
    var options = {
      responsive: true,
      title: {
        display: true,
        position: "top",
        text: "Profit per OpCo",
        fontSize: 18,
        fontColor: "#111"
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          fontColor: "#333",
          fontSize: 16
        }
      }
    };

    var chart2 = new Chart(ctx1, {
      type: "doughnut",
      data: data2,
      options: options
    });
  });
