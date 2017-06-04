 $(document).ready(function() {
     getStationNumberAndDescriptionTable();
     getSensors();
     $('#sensorStationSelect').on('change', function() {
         getSensors(this.value);
     })
 });

 function getStationNumberAndDescriptionTable() {
     getStations(stationDataToTable);
 }

 function getStations(succesFunction) {
     $.get("/station", function(data) {
         succesFunction(data)
     })
 }


 function stationDataToTable(data) {
     var result = [];
     $.each(data, function(index, value) {
         var x = value.stationsDesc;
         var y = value.stationsNumber;
         result[index] = { stationDesc: x, stationNumber: y }
     });
     addToselect("#sensorStationSelect", result);
 }


 function addToselect(selectSelector, values) {
     $(selectSelector + " option").remove();
     $.each(values, function(key, value) {
         $(selectSelector)
             .append($("<option></option>")
                 .attr("value", value.stationNumber)
                 .text("Stanowisko nr: " + value.stationNumber + " Opis: " + value.stationDesc));
     });
     $('select').material_select();
 }



 function getSensors(stationId) {
     query = "/sensor";
     if (stationId) {
         query += "?station="
         query += stationId;
     }
     $.get(query, function(data) {
         var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Nazwa</th><th>Numer stanowiska</th><th>Numer czujnika</th><th>Opis</th><th>Usuń</th></tr></thead><tbody></tbody></table>"
         $(".result").empty();
         $(".result").append(resultHtml);
         $.each(data, function(index, value) {
             $('#resultTable').append('<tr><td>' + value.sensorsName + '</td><td>' + value.stationsNumber + '</td><td>' + value.sensorsNumber + '</td><td>' + value.sensorsDesc + '</td><td> <a href="#"><span class="glyphicon glyphicon-trash removeStation" number="' + value.stationsNumber + '"></span></a></td></tr>');
         });
     }).done(function() {
         $("#resultTable").tablesorter();
     })
 }


 function validateSensorNumber(stationNumber, number) {
     var result = [];
     query = "/sensor";
     if (stationNumber) {
         query += "?station="
         query += stationNumber;
     }
     $.get(query, function(data) {
         $.each(data.sensors, function(index, value) {
             var y = value.sensorsNumber;
             result[index] = y;
         });
     }).done(function() {
         addValidClass(result.indexOf(parseInt(number)) != -1, "#addSensorModalSensorNumber", "#addSensorBtn");
     })
 }
