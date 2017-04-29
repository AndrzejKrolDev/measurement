$(document).ready(function() {
    $('.modal').modal();
    $('select').material_select();
    $("#sensorStationDropdownArea").hide();


    $('#addStationBtn').click(function() {
        var body = { name: $("#addStationModalStationName").val(), number: $("#addStationModalStationNumber").val(), description: $("#addStationModalStationDescription").val() };
        $.post("station", body);
        getStations(addStationsDataToTable, sortTable("#resultTable"));
    })

    $("#addStationModalStationNumber").keyup(function() {
        validateStationNumber($("#addStationModalStationNumber").val())
    });


    $('#addSensorBtn').click(function() {
        var body = { name: $("#addSensorModalSensorName").val(), number: $("#addSensorModalSensorNumber").val(), description: $("#addSensorModalSensorDesc").val(), stationNumber: $("#StationSelect").val() };
        $.post("sensor", body);
    })

    $("#addSensorModalSensorNumber").keyup(function() {
        validateSensorNumber(this.value, $("#StationSelectOnSensorModal").val());
    });

    $('#addSensorModalBtn').click(function() {
        getStationNumberAndDescriptionTable()
    })


    $('#addSampleBtn').click(function() {
        var body = { stationNumber: $("#addSampleModalStationNumber").val(), sensorNumber: $("#addSampleModalSensorNumber").val(), sampleValue: $("#addSampleModalValue").val(), time: new Date().toISOString().slice(0, 19).replace('T', ' ') };
        $.post("sample", body);
    })

    function csvToHtmlTable(csvData) {
        var data = csvData;
        var lines = data.split("\n"),
            output = [],
            i;
        for (i = 0; i < lines.length - 1; i++)
            output.push("<tr><td>" + lines[i].slice(0, -1).split(";").join("</td><td>") + "</td></tr>");
        output = "<table>" + output.join("") + "</table>";
        return output;
    }



    function postPreviewData() {
        var lines = $("#importpreview table tr");
        for (i = 1; i < lines.length; i++) {
            var body = { stationNumber: lines[i].cells[0].innerText, sensorNumber: lines[i].cells[1].innerText, sampleValue: lines[i].cells[4].innerText, time: lines[i].cells[2].innerText + " " + lines[i].cells[3].innerText };
            $.post("sample", body);
        }
        return true;
    }


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


    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        // use the 1st file from the list
        f = files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                $("#importPreview").append(csvToHtmlTable(e.target.result));
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }

    document.getElementById('importFileInput').addEventListener('change', handleFileSelect, false);



    $('#importFileBtn').click(function() {
        alert('');
    })









    $('#TableOptionsSelct').on('change', function() {
        if (this.value == "stations") {
            getStations(addStationsDataToTable, sortTable("#resultTable"));
        }
        if (this.value == "samples") {
            getSamples();
        }
        if (this.value == "sensors") {
            getSensors();
            getStationNumberAndDescriptionTable();
            $("#sensorStationDropdownArea").show();
        }
    })
    $("#importFileBtn").click(function() {
        postPreviewData();
    })







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
