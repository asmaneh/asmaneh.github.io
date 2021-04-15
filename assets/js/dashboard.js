if (currentUser === undefined || currentUser === null) {
  window.location.replace('/');
}
var recentPost = getRecentPost(currentUser.username);
function saveFile(id) {
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {_id: id}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => downloadPost(obj.entries[0]));
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

$.getJSON('/search.json', function(data) {
  $.each(data, function(i, item){
    if(item.author === currentUser.username){
      $('#alertPublishedPosts').hide();
      $('#myPublishedPostsTable').show();
      $('#myPublishedPostsList').prepend('<tr><td><a href="'+item.url+'">'+item.title+'</a></td><td class="persianDate" data-timestamp="'+item.date+'"></td></tr>')
    }
  });
});
