 function addValidClass(isValid, fieldSelector, btnSelector) {
     if (isValid) {
         $(fieldSelector).removeClass("valid");
         $(fieldSelector).addClass("invalid");
         $(btnSelector).attr("disabled", true);
     } else {
         $(fieldSelector).addClass("valid");
         $(fieldSelector).removeClass("invalid");
         $(btnSelector).attr("disabled", false);
     }
 }

 function sortTable(tableSelector) {
     $(tableSelector).tablesorter();
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

 function clearAllInputs() {
     $(":input").each(function() {
         $(this).val('');
     });
 }

 function displayLoadIndicator(){
    $('.progress').show();
 }
 function hideLoadIndicator(){
    $('.progress').hide();
 }

function showOkModal(){

}