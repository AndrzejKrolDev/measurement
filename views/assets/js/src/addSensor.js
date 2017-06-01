$(document).ready(function() {
    getStationNumberAndDescriptionTable();

    $('#addSensorBtn').click(function() {
        displayLoadIndicator();
        var body = { name: $("#addSensorModalSensorName").val(), number: $("#addSensorModalSensorNumber").val(), description: $("#addStationModalStationDescription").val() };
        $.post("sensors", body);
        clearAllInputs();
        Materialize.toast('Stanowisko dodane', 4000);
    })
});

