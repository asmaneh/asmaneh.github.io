if (currentUser) {
  window.location.replace('/dashboard/');
} else {
$('.form-signin').submit(function(){
event.preventDefault();
var user = $('#inputUsername').val();
var pass = $('#inputPassword').val();
fetch('https://alitayebi.com/asmaneh/cm/api/collections/get/authors', {
    method: 'post',
    headers: { 'Content-Type': 'application/json','Authorization': 'Bearer 38211f8b09e9e58ec27947f1812d73' },
    body: JSON.stringify({
        filter: {username: user, password: pass}
    })
  })
    .then(res=>res.json())
    .then(data => obj = data)
    .then(res => setUserCookie(obj.entries));
})
}
function setUserCookie(object) {
  if (object.length == 1) {
    var currentUser = [];
    if ($('input:checkbox[name="remmermberMe"]').is(':checked')) {
      localStorage.setItem('currentUser', JSON.stringify(object[0]) )
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(object[0]))
    };
    window.location.replace('/dashboard/');

  } else {
    $('#alertLogin').show();
  }
}
