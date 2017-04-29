function getStations(succesFunction, doneFunction) {
    $.get("/station", function(data) {
        succesFunction(data)
    }).done(doneFunction)
}

function getStations(succesFunction) {
    $.get("/station", function(data) {
        succesFunction(data)
    })
}

function getStationNumberAndDescriptionTable() {
    getStations(stationDataToTable);
}


function addStationsDataToTable(data) {
    var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Nazwa</th><th>Numer</th><th>Opis</th></tr></thead><tbody></tbody></table>"
    $(".result").empty();
    $(".result").append(resultHtml);
    $.each(data.stations, function(index, value) {
        $('#resultTable').append('<tr><td>' + value.stationsName + '</td><td>' + value.stationsNumber + '</td><td>' + value.stationsDesc + '</td></tr>');
    });
    sortTable("#resultTable");
}

function stationDataToTable(data) {
    var result = [];
    $.each(data.stations, function(index, value) {
        var x = value.stationsDesc;
        var y = value.stationsNumber;
        result[index] = { stationDesc: x, stationNumber: y }
    });
    addToselect("#sensorsStation",result);
    addToselect("#StationSelectOnSensorModal",result);
}

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
