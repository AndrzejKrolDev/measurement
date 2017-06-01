 $(document).ready(function() {
     $("#addStationModalStationNumber").keyup(function() {
         validateStationNumber($("#addStationModalStationNumber").val())
     });

     $('#addStationBtn').click(function() {
         var body = { name: $("#addStationModalStationName").val(), number: $("#addStationModalStationNumber").val(), description: $("#addStationModalStationDescription").val() };
         $.post("station", body);
         clearAllInputs();
         Materialize.toast('Stanowisko dodane', 4000);
     })

 });


 function validateStationNumber(number) {
     var result = [];
     $.get("/station", function(data) {
         $.each(data.stations, function(index, value) {
             var y = value.stationsNumber;
             result[index] = y;
         });
     }).done(function() {
         addValidClass(result.indexOf(parseInt(number)) != -1, "#addStationModalStationNumber", "#addStationBtn");
     })
 }
