var recentPost = getAllPosts();
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
$(document).ready(function(){
  $("#searchPost").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myRecentPostList tr").filter(function() {
      $(this).toggle($(this).find("th, td:eq(0),td:eq(1),td:eq(2),td:eq(3)").text().toLowerCase().indexOf(value) > -1)
    });
  });
});
