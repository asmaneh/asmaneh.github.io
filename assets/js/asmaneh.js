
var currentUser = checkCookie();
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
                event.preventDefault();
                $(this).ekkoLightbox();
});
$(document).ready(function(){
$('.persianDate').each(function () {
  var postDate = new Date(parseInt($(this).attr('data-timestamp'))*1000);
  $(this).text(postDate.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }));
})
$('.header').on('click', '.search-toggle', function(e) {
  var selector = $(this).data('selector');

  $(selector).toggleClass('show').find('.search-input').focus();
  $(this).toggleClass('active');

  e.preventDefault();
});

});
