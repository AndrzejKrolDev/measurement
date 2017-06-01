$(document).ready(function() {
    getSensors();
    getStationNumberAndDescriptionTable();

     $('#sensorStationSelect').on('change', function() {
        getSensors(this.value);
    })
});
