var pieButton = document.getElementById('pie');
var abcd = document.getElementById('abcd')
pieButton.addEventListener('click', () => {
    abcd.style.display = 'block';
    var open, closed, validated, rejected;
    fetch('/api/data')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                response.json().then(function (data) {
                    //console.log(data);
                    open = data.open;
                    closed = data.closed;
                    validated = data.validated;
                    rejected = data.rejected;
                    dataFromBackend = data;
                    console.log(open, closed, validated, rejected)
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });

    setTimeout(() => {
        abcd.style.display = 'none';
        const data = [open, validated, rejected, closed]
        var chartDiv = $("#barChart");
        var myChart = new Chart(chartDiv, {
            type: 'pie',
            data: {
                labels: ["Open", "Validated", "Rejected", "Closed"],
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            "#FF6384",
                            "#4BC0C0",
                            "#FFCE56",
                            "#36A2EB"
                        ]
                    }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Pie Chart'
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }, 4000);
})

var temp = document.getElementById("temp");

temp.addEventListener('click', () => {  
    var labels = []
    var No_of_Leads = [];
    abcd.style.display = 'block';
    fetch('/api/barData')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                response.json().then(function (data) {
                    var i = 0;
                    data.forEach(element => {
                        if(i%2==0){
                            labels.push(element)
                        }else{ 
                            No_of_Leads.push(element)
                        }
                        i++;
                    });
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });

    setTimeout(() => { 
        var ctx = $("#line-chartcanvas");
        abcd.style.display = 'none'; 
               var data = {
            labels:labels,
            datasets: [
              {
                label: "Segments Vs Number of Leads",
                data: No_of_Leads,
                backgroundColor: "blue",
                borderColor: "lightblue",
                fill: false,
                lineTension: 0,
                radius: 5
              },
            ]
          };

       
          var options = {
            responsive: true,
            title: {
              display: true,
              position: "top",
              text: "Line Graph",
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

          var chart = new Chart(ctx, {
            type: "line",
            data: data,
            options: options
          });
    }, 4000);
})


