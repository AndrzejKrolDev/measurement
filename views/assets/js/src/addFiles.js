$(document).ready(function() {
    $('#importFileBtn').click(postPreviewData);
})

function postPreviewData() {
    var lines = $("#importpreview table tr");
    for (i = 1; i < lines.length; i++) {
        var body = { stationsNumber: lines[i].cells[0].innerText, sensorsNumber: lines[i].cells[1].innerText, sampleValue: lines[i].cells[4].innerText, time: lines[i].cells[2].innerText + " " + lines[i].cells[3].innerText };
        $.post("sample", body);
    }
    clearAllInputs();
    Materialize.toast('Wyniki dodane', 4000);
    $('#importPreview').empty();
    return true;
}
