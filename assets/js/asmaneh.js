$('#editor').trumbowyg();
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
                event.preventDefault();
                $(this).ekkoLightbox();
});
$(document).ready(function(){

$(".persianDate").each(function(){
  console.log('test');
  var date = $(this).text();
  moment.loadPersian(true);
  var jalaliDate = moment(date, 'YYYY-M-D HH:mm:ss TZD').format('jD jMMMM jYYYY');
  $(this).text(jalaliDate)
});
});
