$(document).ready(function() {
  $('input[type="date"]').change(function() {
    if ( $('#start_date').val() != "" && $('#end_date').val() != "") {
      $('#applyDateButton').css("visibility", "visible");
    } 
  });
});