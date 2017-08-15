$(document).ready(function() {
  $('input[type="date"]').change(function(){
    if (document.forms["dateForm"]["start_date"].value == "" || document.forms["dateForm"]["end_date"].value == "") 
      {
      } else {
        document.getElementById("applyDateButton").style.visibility = 'visible';
          }  
  });
});