const API_URL = 'https://alitayebi.com/asmaneh/cm';
const TOKEN   = '38211f8b09e9e58ec27947f1812d73';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
function uploadImage(e, fname){
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
    console.log(u.avatar);
    if (u.avatar !== null) {

      $('.user-photo').attr('src', u.avatar);
    }

  }
function getAllPosts() {
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          sort: {date:-1}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => showRecentPost(obj));
  }

function getRecentPost(user) {
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {author: user},
          limit: 10,
          sort: {date:-1}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => showRecentPost(obj));
  }
function logout() {
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  window.location.replace('/');

}
function downloadPost(object) {
  const publishDateEn = new Date(parseInt(object.date));
var gallaryTag = ""
if (object.gallary.length > 0) {
  var dataGallary ="";
  for (var i = 0; i < object.gallary.length; i++) {
    dataGallary +=
    '- image_path: '+object.gallary[i].image_path+ ' \r\n'+
    '  title: '+object.gallary[i].image_title+ ' \r\n';
  }
  var gallaryTag =
      'gallary: \r\n'+
      dataGallary;
}
      // This variable stores all the data.
      let data =
          '--- \r\n'  +
          'title: ' +object.title + ' \r\n' +
          'authors: ' +object.author + ' \r\n' +
          'types: "' + object.type + '" \r\n' +
          'categories: "' + object.category + '" \r\n' +
          'featureImg: "' + object.image + '" \r\n' +
          gallaryTag+' \r\n' +
          '--- \r\n'  +
          object.content;
      // Convert the text to BLOB.
      const textToBLOB = new Blob([data], { type: 'text/x-markdown' });
      const sFileName = publishDateEn.toISOString().split("T")[0]+'-'+object.title+'.md';	   // The file to save the data.
      let newLink = document.createElement("a");
      newLink.download = sFileName;

      if (window.webkitURL != null) {
          newLink.href = window.webkitURL.createObjectURL(textToBLOB);
      }
      else {
          newLink.href = window.URL.createObjectURL(textToBLOB);
          newLink.style.display = "none";
          document.body.appendChild(newLink);
      }

      newLink.click();

}
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *
 charactersLength)));
   }
   return result.join('');
}
