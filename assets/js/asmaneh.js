
var currentUser = checkCookie();
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
                event.preventDefault();
                $(this).ekkoLightbox();
});
$(document).ready(function(){
  $('.fnoteBtn').on('click', function () {
    window.location.replace('#fn'+$(this).text())
  })
$('#editPost').on('click', function () {
  editPost($(this).data('slug'));
})
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
$(function ()
{
  $('.img-float-left').wrap('<figure class="figure fig-float-left"></figure>');
  $('.img-float-right').wrap('<figure class="figure fig-float-left"></figure>');
  $(".img-float-left, .img-float-right").each(function () {
    if ($(this).attr('alt')) {
      $(this).parent().append('<figcaption class="figure-caption">'+$(".img-float-left").attr('alt')+'</figcaption>');
    }
  })
});
});
