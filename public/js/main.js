// $(document).ready(function (){
//   $.getJSON("https://api.covid19india.org/data.json",function(data){
//       var states = [];
//       var confirmed = [];
//       var recovered = [];
//       var deaths = [];


//       var total_active;
//       var total_confirmed;
//       var total_recovered;
//       var total_deaths;

//       total_active = data.statewise[0].active;
//       total_confirmed = data.statewise[0].confirmed;
//       total_recovered = data.statewise[0].recovered;
//       total_deaths = data.statewise[0].deaths;

//       //console.log(data.statewise);
//       $.each(data.statewise, function (id, obj) {
//           states.push(obj.state);
//           confirmed.push(obj.confirmed);
//           recovered.push(obj.recovered);
//           deaths.push(obj.deaths);
//         });
//     // console.log(states);  
    
//     states.shift();
//     confirmed.shift();
//     recovered.shift();
//     deaths.shift();

//     $("#confirmed").append(total_confirmed);
//     $("#active").append(total_active);
//     $("#recovered").append(total_recovered);
//     $("#deaths").append(total_deaths);

    // Chart initialization
  

jQuery(document).ready(function() {
  const data = [40,35,25,50] // get data dynamically from the database 
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
}); 


