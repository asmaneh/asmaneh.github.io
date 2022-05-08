const API_URL = 'https://favela.ir/asmaneh/cm';
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
    if (u.avatar !== null) {
      $('.user-photo').attr('src', u.avatar);
    }
  }
function editPost(slug) {
  console.log(slug);
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
        filter: {slug: slug}
      })
    })
      .then(res=>res.json())
      .then(data => {
        window.location.replace('/post/?id='+data.entries[0]._id)

      });

}
function getAllPosts() {
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
        filter: {published: false},
          sort: {_modified:1}
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
          filter: {author: user, published: false},
          limit: 10,
          sort: {_modified:1}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => showRecentPost(obj));
}
function showRecentPost(object) {
  if (object.entries.length>0) {
    $('#alertRecentPost').hide();
    $('#myRecentPostTable').show();
    for (var i = 0; i < object.entries.length; i++) {
      var isPostDate = new Date(object.entries[i]._created*1000);
      var isModifiedDate = new Date(object.entries[i]._modified*1000);
      var isStatus = '';
      if (object.entries[i].published == true) {
        isEdit ='display:none;';
        isDownload ='d-inline-block';
        isStatus = 'آماده انتشار';
      } else {
        isEdit = '';
        isDownload ='d-none';
        isStatus = 'پیش‌‌نویس';
      }
      if (object.entries[i].upload == true) {
        publishBtn ='btn-success';
      } else {
        publishBtn ='btn-secondary';
      }
      var delPostTag = `<button class="btn btn-danger btn-sm rounded-0 d-inline-block" data-post_id="`+object.entries[i]._id+`" data-post_title="`+object.entries[i].title+`"  data-toggle="modal" data-target="#delPostConfirm">حذف</button>`;

        $('#myRecentPostList').prepend('<tr><th scope="row" ><a href="/post/?id='+object.entries[i]._id+'" target="_blank">'+object.entries[i].title+'</a></th><td>'+object.entries[i].author+'</td><td>'+isPostDate.toLocaleDateString('fa-IR')+'</td><td>'+ isModifiedDate.toLocaleDateString('fa-IR')+'</td><td>'+ isStatus +'</td><td><a href="/post/?id='+object.entries[i]._id+'" target="_blank" class="btn btn-primary btn-sm rounded-0 d-inline-block admin reviewer" id="showPrvPost" style="'+isEdit+'">ویرایش</a>'+delPostTag+'</td></tr>');
    }
    checkCookie();
  }

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
    var characters       = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz2468';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *
 charactersLength)));
   }
   return result.join('');
}
function publishedPost(id) {
  fetch(API_URL+'/api/collections/save/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          data: {
            _id: id,
            upload: true
          }
      })
  })
  .then(res=>res.json());
}
function deletePost(id) {
  fetch(API_URL+'/api/collections/remove/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {
            _id: id
          }
      })
  })
  .then(res=>reloadPage());
}
function publishedAuthor(id) {
  fetch(API_URL+'/api/collections/save/authors', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          data: {
            _id: id,
            upload: true
          }
      })
  })
  .then(res=>res.json());
}
function deleteUser(id) {
  fetch(API_URL+'/api/collections/remove/authors', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {
            _id: id
          }
      })
  })
  .then(res=>reloadPage());
}
function reloadPage() {
  location.reload();
}
function copyToCilpboard() {
 /* Get the text field */
 var copyText = document.getElementById('shortLink');

 /* Select the text field */
 copyText.select();
 copyText.setSelectionRange(0, 99999); /* For mobile devices */

 /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}
