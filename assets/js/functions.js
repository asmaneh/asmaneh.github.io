const API_URL = 'https://alitayebi.com/asmaneh/cm';
const TOKEN   = '38211f8b09e9e58ec27947f1812d73';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function uploadImage(){
      const PATH      = '/api/cockpit/addAssets?token=';
      const api       = API_URL+PATH+TOKEN;
      const fileInput = document.querySelector('input[type="file"]');
      const formData  = new FormData();
      formData.append('files[]', fileInput.files[0]);
      fetch(api,{
          method : 'POST',
          body : formData
      })
      .then(e=>e.json())
      .then(res=>{
          const {assets} = res;
          if(!assets){
              alert('Upload failed!');
              return;
          }
         const image_url = API_URL+'/storage/uploads'+assets[0].path;
         $('#imgUrl').val(assets[0].path);
         $('.uploadImg').hide();
         $('.uploadedImg').show();
         $('#imgPrv').prop('href', image_url)
         alert('Successfully uploaded!');
      })
}
function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
  document.getElementById("main").style.marginLeft = "400px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}
function checkCookie() {
  var currentUser =[];
  if (localStorage.getItem('currentUser')) {
    $('.guest').hide();
    $('.user').show();
    currentUser =JSON.parse(localStorage.getItem('currentUser'));
    $('.'+currentUser.role).show()
    getUserInfo(currentUser);
    return currentUser;
  } else if (sessionStorage.getItem('currentUser')) {
    $('.guest').hide();
    $('.user').show();
    currentUser =JSON.parse(sessionStorage.getItem('currentUser'));
    $('.'+currentUser.role).show()
    getUserInfo(currentUser);
    return currentUser;
  } else {
    $('.user').hide();
  }
}
function getUserInfo(u) {
    $('.user-fullname').text(u.name);
    $('.user-title').text(u.title);

  }
function getRecentPost(user) {
  console.log('t1');
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {author: user}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => showRecentPost(obj));
  }
