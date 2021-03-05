var socket = io();
var element = document.getElementById('send');
var receive = document.getElementById('receive');


var notification = document.getElementById("notification");

element.addEventListener('click', function(data) {
    var leadobj = {name:document.getElementById("name").value,value:document.getElementById("value").value,
                   segment:document.getElementById("segment").value,to:document.getElementById("to").value,from:document.getElementById("from").value};
    socket.emit('LeadSent',leadobj);
});

socket.on('LeadReceived', function() {
    console.log("Lead received")
    document.getElementById("alert").innerHTML=Swal.fire("New lead is assigned for you!")
});