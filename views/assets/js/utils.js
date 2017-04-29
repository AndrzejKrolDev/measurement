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
