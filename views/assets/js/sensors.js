function getSensors() {
      $.get("/sensor", function(data) {
          var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Nazwa</th><th>Numer</th><th>Numer stanowiska</th><th>Opis</th></tr></thead><tbody></tbody></table>"
          $(".result").empty();
          $(".result").append(resultHtml);
          $.each(data.sensors, function(index, value) {
              $('#resultTable').append('<tr><td>' + value.sensorsName + '</td><td>' + value.stationsNumber + '</td><td>' + value.sensorsNumber + '</td><td>' + value.sensorsDesc + '</td></tr>');
          });
      }).done(function() {
          $("#resultTable").tablesorter();
      })
  }


function validateSensorNumber(stationNumber,number) {
    var result = [];
    $.get("/sensor?station="+stationNumber, function(data) {
        $.each(data.sensors, function(index, value) {
            var y = value.sensorsNumber;
            result[index] = y;
        });
    }).done(function() {
        addValidClass(result.indexOf(parseInt(number)) != -1, "#addSensorModalSensorNumber", "#addSensorBtn");
    })
}