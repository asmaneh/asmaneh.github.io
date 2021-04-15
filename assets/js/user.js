if (urlParams.get('id')) {
  if (urlParams.get('id') == 'me') {
    var currentUser = checkCookie();
    if (currentUser.role != 'admin') {
      $('#userUserName').attr('readonly', true);
      $('#userRole').prop('disabled', true);
    }
    var currentProfileID = currentUser._id;
  } else {
    if (currentUser.role == 'author') {
      window.location.replace('/');
    }
    var currentProfileID = urlParams.get('id');
  }
  fetch(API_URL+'/api/collections/get/authors', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {_id: currentProfileID}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => setSession('currentProfile', obj.entries));
    $('#formUser').submit(function () {
      event.preventDefault();
      var thisProfile = JSON.parse(localStorage.getItem('currentProfile'));
      if ($('input#changePassword').is(':checked')) {
        var profilePassword = $('#userNewPassword').val();
      } else {
        var profilePassword = thisProfile.password;
      }
      fetch(API_URL+'/api/collections/save/authors', {
          method: 'post',
          headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
          body: JSON.stringify({
              data: {
                _id: currentProfileID,
                name: $('#userFullName').val(),
                username: $('#userUserName').val(),
                title: $('#userTitle').val(),
                bio: $('#userBio').val(),
                role: $('#userRole').val(),
                password: profilePassword,
                avatar: $('#imgPrv').attr('href'),
                avatarPath: $('#imgPrv').attr('data-path')
              }
          })
      })
      .then(res=>res.json())
      .then(data => {
        $('#alertEditedProfile').show()
        if (data._id == currentUser._id) {
          if (localStorage.getItem('currentUser')) {
            localStorage.removeItem('currentUser')
            localStorage.setItem('currentUser', JSON.stringify(data))
          }
          if (sessionStorage.getItem('currentUser')) {
            sessionStorage.removeItem('currentUser')
            sessionStorage.setItem('currentUser', JSON.stringify(data))
          }
          checkCookie()
        }

      } );
})
} else {
  $('#changePassword').parent().hide();
  $('#changePasswordRow').show();
  $('#changePasswordRow :input').attr('disabled', false).attr('required', true);
  $('#formUser').submit(function () {
    event.preventDefault();
    fetch(API_URL+'/api/collections/save/authors', {
        method: 'post',
        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
        body: JSON.stringify({
            data: {
              name: $('#userFullName').val(),
              username: $('#userUserName').val(),
              title: $('#userTitle').val(),
              bio: $('#userBio').val(),
              role: $('#userRole').val(),
              password: $('#userNewPassword').val(),
              avatar: $('#imgPrv').attr('href'),
              avatarPath: $('#imgPrv').attr('data-path')
            }
        })
    })
    .then(res=>res.json())
    .then(commits => $('#alertEditedProfile').show());
})

}
$('#changePassword').change(function () {
  if ($(this).is(':checked')) {
    $('#changePasswordRow').show();
    $('#changePasswordRow :input').attr('disabled', false);
    $('#changePasswordRow :input').attr('required', true);
  } else {
    $('#changePasswordRow').hide();
    $('#changePasswordRow :input').attr('disabled', true);
    $('#changePasswordRow :input').attr('required', false);
  }

});
$('#userUserName').change(function () {
  $('#authorImg').attr('data-name', this.value);
})
function setSession (name, object) {
  if (object.length == 1) {
    $('#alertProfile').hide();
    $('#formUser :input').attr('disabled', false);
    localStorage.removeItem(name)
    localStorage.setItem(name, JSON.stringify(object[0]));
    getProfileInfo();
  } else {
    $('#alertProfile').show();
    $('#formUser :input').attr('disabled', true);
  }
}
function getProfileInfo() {
  var thisProfile = JSON.parse(localStorage.getItem('currentProfile'));
  $('#userFullName').val(thisProfile.name)
  $('#authorImg').attr('data-name', thisProfile.username)
  $('#userUserName').val(thisProfile.username)
  $('#userTitle').val(thisProfile.title)
  $('#userRole').val(thisProfile.role)
  if (currentUser.role != 'admin') {
    $('#userUserName').attr('readonly', true);
    $('#userRole').attr('disabled', true);
  }
  $('#userBio').val(thisProfile.bio)
  if (thisProfile.avatar !== null) {
    $('#imgUrl').val(thisProfile.avatar);
    $('#imgPrv').attr('href', thisProfile.avatar).attr('data-path', thisProfile.avatarPath);
    $('.uploadImg').hide();
    $('.uploadedImg').show();
  } else {
    $('.uploadImg').show();
    $('.uploadedImg').hide();
  }
}
