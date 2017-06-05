$(document).ready(function() {
    $('.modal').modal();
    $('select').material_select();
   // $("#sensorStationDropdownArea").hide();
    //$("#stationSampleDropdownArea").hide();
    //$("#sampleSensorDrodpdowArea").hide();
  
   
 

    $('.button-collapse').sideNav({
        menuWidth: '20%', // Default is 300
        edge: 'left', // Choose the horizontal origin   
        draggable: true // Choose whether you can drag to open on touch screens
    });


    $("#addStationModalStationNumber").keyup(function() {
        validateStationNumber($("#addStationModalStationNumber").val())
    });


  /*  $('#addSensorBtn').click(function() {
        var body = { name: $("#addSensorModalSensorName").val(), number: $("#addSensorModalSensorNumber").val(), description: $("#addSensorModalSensorDesc").val(), stationNumber: $("#StationSelectOnSensorModal").val() };
        $.post("sensor", body);
    })
*/
  
    $('#addSensorModalBtn').click(function() {
        getStationNumberAndDescriptionTable()
    })


   


    $('#TableOptionsSelct').on('change', function() {
        $("#sensorStationDropdownArea").hide();
        $("#stationSampleDropdownArea").hide();


        if (this.value == "stations") {
           
        }
        if (this.value == "samples") {
            getSamples();
            $("#stationSampleDropdownArea").show();
            $("#sampleSensorDrodpdowArea").show();
            getStationNumberAndDescriptionTable();
        }
        if (this.value == "sensors") {           
            $("#sensorStationDropdownArea").show();
        }
    })

 


    


    function tableToJson(table) {
        var data = [];

        // first row needs to be headers
        var headers = [];
        for (var i = 0; i < table.rows[0].cells.length; i++) {
            headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
        }

        // go through cells
        for (var i = 1; i < table.rows.length; i++) {

            var tableRow = table.rows[i];
            var rowData = {};

            for (var j = 0; j < tableRow.cells.length; j++) {

                rowData[headers[j]] = tableRow.cells[j].innerHTML;
            }

            data.push(rowData);
        }

        return data;
    }




  



    function getSamples() {
        $.get("/sample", function(data) {
            var samples = JSON.parse(data).samples;
            var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Numer stanowiska</th><th>Numer czujnika</th><th>Czas</th><th>Wartość</th></tr></thead><tbody></tbody></table>"
            $(".result").empty();
            $(".result").append(resultHtml);
            $.each(samples, function(index, value) {
                $('#resultTable').append('<tr><td>' + value.stationsNumber + '</td><td>' + value.sensorsNumber + '</td><td>' + value.sampleDate + '</td><td>' + value.sampleValue + '</td></tr>');
            });
        }).done(function() {
            $("#resultTable").tablesorter();
        })
    }

});
