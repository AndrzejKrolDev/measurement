 $(document).ready(function() {
     getStations(addStationsDataToTable);
 });


function getStations(succesFunction) {
    $.get("/station", function(data) {
        succesFunction(data)
    })
}

function getStations(succesFunction, doneFunction) {
    $.get("/station", function(data) {
        succesFunction(data)
    })
}

/*function addStations(data) {
    $.post("/station", data).done(function() {
        hideLoadIndicator();
    });
}*/



function addStationsDataToTable(data) {
    var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Nazwa</th><th>Numer</th><th>Opis</th></tr></thead><tbody></tbody></table>"
    $(".result").empty();
    $(".result").append(resultHtml);
    $.each(data, function(index, value) {
        $('#resultTable').append('<tr><td>' + value.stationsName + '</td><td>' + value.stationsNumber + '</td><td>' + value.stationsDesc + '</td></tr>');
    });
    sortTable("#resultTable");
}


