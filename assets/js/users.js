if (currentUser.role != 'admin') {
  window.location.replace('/');
}
  fetch(API_URL+'/api/collections/get/authors', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          sort: {_created:-1}
      })
    })
      .then(res=>res.json())
      .then(data => {
          if (data.entries.length > 0) {
            for (var i = 0; i < data.entries.length; i++) {
              $('#usersTableList').prepend('<tr><th scope="row" >'+data.entries[i].name+'</th><td>'+data.entries[i].username+'</td><td>'+data.entries[i].role+'</td><td><a href="/user/?id='+data.entries[i]._id+'" target="_blank" class="btn btn-primary btn-sm rounded-0 d-inline-block admin" id="showPrvPost" style="">ویرایش</a><a href="javascript:void(0)" onclick="saveUserFile(\'' +data.entries[i]._id+ '\')" class="btn btn-secondary btn-sm rounded-0 admin"  style="">دانلود</a></td></tr>');
            }
          }
      });
function saveUserFile(id) {
  fetch(API_URL+'/api/collections/get/authors', {
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
      var userBio = "";
      if (object.Bio) {
        userBio = object.Bio;
      }
      // This variable stores all the data.
      let data =
          '--- \r\n'  +
          'title: ' +object.name + ' \r\n' +
          'slug: ' +object.username + ' \r\n' +
          'image: "' + object.avatar + '" \r\n' +
          'role: ' + object.role + ' \r\n' +
          'subTitle: ' + object.title + ' \r\n' +
          '--- \r\n'  +
          userBio;
      // Convert the text to BLOB.
      const textToBLOB = new Blob([data], { type: 'text/x-markdown' });
      const sFileName = object.username+'.md';	   // The file to save the data.
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
