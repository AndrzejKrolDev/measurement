 $(document).ready(function() {
     getStationNumberAndDescriptionTable();
     getSensorNumberAndDescriptionTable();

     $('#sampleDate').mask('0000/00/00 00:00:00');
     $('#sampleDate').val('2017/03/03 15:31:12')
 });





 $('#addResultBtn').click(function() {
     var body = { stationsNumber: $("#stationSelect").val(), sensorsNumber: $("#sensorSelect").val(), sampleValue: $("#sampleValue").val(), time: $("#sampleDate").val() };
     $.post("sample", body);
 })

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
