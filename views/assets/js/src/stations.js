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


 function deleteStation(id) {
     $.ajax({
         url: '/station/' + id,
         type: 'DELETE',
         success: function(result) {
             
         }
     });
 }




 function addStationsDataToTable(data) {
     var resultHtml = "<table class='highlight' id='resultTable'><thead><tr><th>Nazwa</th><th>Numer</th><th>Opis</th><th>Usuń</th></tr></thead><tbody></tbody></table>"
     $(".result").empty();
     $(".result").append(resultHtml);
     $.each(data, function(index, value) {
         $('#resultTable').append('<tr><td>' + value.stationsName + '</td><td>' + value.stationsNumber + '</td><td>' + value.stationsDesc + '</td><td> <a href="#"><span class="glyphicon glyphicon-trash removeStation" number="' + value.stationsNumber + '"></span></a></td></tr>');
     });
     sortTable("#resultTable");
     $('.removeStation').click(function() {
         deleteStation(this.getAttribute("number"));
     })
 }
