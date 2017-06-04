 $(document).ready(function() {
     getSamples(addSamplesDataToTable);
     getStationNumberAndDescriptionTable();
     getSensorNumberAndDescriptionTable();

     $('#startDate').mask('00/00/0000 00:00:00');
     $('#endDate').mask('00/00/0000 00:00:00');
     $("#filterBtn").click(function() {
         getSamples(addSamplesDataToTable, $("#stationSelect").val(), $("#senorSelect").val(), $("#startDate").val(), $("#endDate").val())
     })

     $('#stationSelect').on('change', function() {
         getSensorNumberAndDescriptionTable(this.value);
         getSamples(addSamplesDataToTable, this.value)
     })
     $('#sensorSelect').on('change', function() {
         getSamples(addSamplesDataToTable, $("#stationSelect").val(), this.value)
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
                 .text("Stanowisko nr: " + value.stationNumber + "       Opis: " + value.stationDesc));
     });
     $('select').material_select();
 }


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
     addToselect("#stationSelect", result);
 }


 function addToselect(selectSelector, values) {
     $(selectSelector + " option").remove();
     $.each(values, function(key, value) {
         $(selectSelector)
             .append($("<option></option>")
                 .attr("value", value.stationNumber)
                 .text("Stanowisko nr: " + value.stationNumber + "       Opis: " + value.stationDesc));
     });
     $('select').material_select();
 }


 //sensors
 function getSensorNumberAndDescriptionTable(station) {
     getSensors(sensorDataToTable, station);
 }

 function getSensors(succesFunction, station) {
     var query = "/sensor";
     if (station) { query += '?station=' + station }
     $.get(query, function(data) {
         succesFunction(data)
     })
 }


 function sensorDataToTable(data) {
     var result = [];
     $.each(data, function(index, value) {
         var x = value.sensorsNumber;
         var y = value.sensorsName;
         result[index] = { sensorsNumber: x, sensorsName: y }
     });
     addToselectS("#sensorSelect", result);
 }


 function addToselectS(selectSelector, values) {
     $(selectSelector + " option").remove();
     $.each(values, function(key, value) {
         $(selectSelector)
             .append($("<option></option>")
                 .attr("value", value.sensorsNumber)
                 .text("Sensor nr: " + value.sensorsNumber + "      Opis: " + value.sensorsName));
     });
     $('select').material_select();
 }





 function getSamples(succesFunction, station, sensor, startDate, endDate) {
     var query = "/sample";
     if (station) { query += '?station=' + station }
     if (sensor) { query += '&sensor=' + sensor }
     if (startDate) { query += '&startDate=' + startDate }
     if (endDate) { query += '&endDate=' + endDate }

     $.get(query, function(data) {
         succesFunction(data)
     })
 }

 // function getSamples(succesFunction, doneFunctionstation,statu) {
 //     var query = "/sample";
 //     if (station) { query += '?station=' + station }
 //     $.get(query, function(data) {
 //         succesFunction(data)
 //     })
 // }



 function addSamplesDataToTable(data) {
     var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Data</th><th>Wartość próbki</th><th>Numer sensora</th><th>Numer stacji</th></tr></thead><tbody></tbody></table>"
     $(".result").empty();
     $(".result").append(resultHtml);
     $.each(data, function(index, value) {
         $('#resultTable').append('<tr><td>' + value.sampleDate + '</td><td>' + value.sampleValue + '</td><td>' + value.sensorsNumber + '</td><td>' + value.stationsNumber + '</td></tr>');
     });
     sortTable("#resultTable");
     $('.removeStation').click(function() {
         deleteStation(this.getAttribute("number"));
     })
 }
