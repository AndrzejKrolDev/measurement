$(document).ready(function() {
    getStationNumberAndDescriptionTable();

    $('#addSensorBtn').click(function() {
        displayLoadIndicator();
        var body = { name: $("#addSensorModalSensorName").val(), number: $("#addSensorModalSensorNumber").val(), description: $("#addStationModalStationDescription").val(), stationsNumber: $('#sensorStationSelect').val() };
        $.post("sensor", body);
        clearAllInputs();
        Materialize.toast('Stanowisko dodane', 4000);
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


function validateSensorNumber(stationNumber, number) {
     var result = [];
     query = "/sensor";
     if (stationNumber) {
         query += "?station="
         query += stationNumber;
     }
     $.get(query, function(data) {
         $.each(data, function(index, value) {
             var y = value.sensorsNumber;
             result[index] = y;
         });
     }).done(function() {
         addValidClass(result.indexOf(parseInt(number)) != -1, "#addSensorModalSensorNumber", "#addSensorBtn");
     })
 }