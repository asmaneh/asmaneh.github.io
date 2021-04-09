console.log(currentUser.username);
var recentPost = getRecentPost(currentUser.username);
function showRecentPost(object) {
  console.log('t2');
  if (object.entries.length>0) {
    for (var i = 0; i < object.entries.length; i++) {
      var isPostDate = new Date(object.entries[i]._created*1000);
      var isModifiedDate = new Date(object.entries[i]._modified*1000);
      var isStatus = '';
      if (object.entries[i].published == true) {
        isEdit ='display:none;';
        isDownload ='d-inline-block';
        isStatus = 'منتشر شده';
      } else {
        isEdit = '';
        isDownload ='d-none';
        isStatus = 'پیش‌‌نویس';
      }

        $('#myRecentPostList').prepend('<tr><th scope="row" >'+object.entries[i].title+'</th><td>'+isPostDate.toLocaleDateString('fa-IR')+'</td><td>'+ isModifiedDate.toLocaleDateString('fa-IR')+'</td><td>'+ isStatus +'</td><td><a href="/edit/?id='+object.entries[i]._id+'" target="_blank" class="btn btn-primary btn-sm rounded-0 d-inline-block admin reviewer" id="showPrvPost" style="'+isEdit+'">ویرایش</a><a href="javascript:void(0)" onclick="saveFile(\'' +object.entries[i]._id+ '\')" class="btn btn-secondary btn-sm rounded-0 admin reviewer '+isDownload+'" style="">دانلود</a></td></tr>');

    }
    checkCookie();
  }

}
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
function downloadPost(object) {
  console.log(object);
  let saveFile = () => {
      // This variable stores all the data.
      let data = 'aaa';

      // Convert the text to BLOB.
      const textToBLOB = new Blob([data], { type: 'text/plain' });
      const sFileName = 'test.md';	   // The file to save the data.

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
}
