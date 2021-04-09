if (urlParams.get('id')) {
  fetch(API_URL+'/api/collections/get/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          filter: {_id: urlParams.get('id')}
      })
    })
      .then(res=>res.json())
      .then(data => obj = data)
      .then(res => getPost(obj));
    $('#sendPost').submit(function () {
      event.preventDefault();
      console.log($('#postStatus').val());
      fetch(API_URL+'/api/collections/save/posts', {
          method: 'post',
          headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
          body: JSON.stringify({
              data: {
                _id: urlParams.get('id'),
                title: $('#postTitle').val(),
                type: $('#postType').val(),
                category: $('#postCategory').val(),
                content: $('#editor').val(),
                image: $('#imgPrv').attr('href'),
                published: $('#postStatus').val()
              }
          })
      })
      .then(res=>res.json())
      .then(commits => $('#alertEdited').show());

    })
} else {
  $('#sendPost').submit(function (e) {
  e.preventDefault();

  fetch(API_URL+'/api/collections/save/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          data: {
            published: '0',
            title: $('#postTitle').val(),
            content: $('#editor').val(),
            category: $('#postCategory').val(),
            type: $('#postType').val(),
            image: $('#imgPrv').attr('href'),
            author: currentUser.username
          }
      })
  })
  .then(res=>res.json())
  .then(data => {
    window.location.replace('/edit/?id='+data._id);
  })
  })

}
function getPost(object) {
  if (object.entries.length > 0) {
    $('#postTitle').val(object.entries[0].title);
    $('#postType').val(object.entries[0].type);
    $('#postCategory').val(object.entries[0].category);
    $('#editor').trumbowyg('html', object.entries[0].content);
    $('#published').attr('selected',object.entries[0].published);
    if (obj.entries[0].image != '') {
      $('#imgUrl').val(obj.entries[0].image);
      $('#imgPrv').attr('href', obj.entries[0].image);
      $('.uploadImg').hide();
      $('.uploadedImg').show();

    }

  }
}
//$('#postType').change(function() {
//$('#postCategory').find('option.'+this.value).show();
//$('#postCategory').find('option:not(.'+this.value+')').hide();
//})
//$('#postCategory').click(function () {
//  $(this).find('option.'+$('#postType').val()).show();
//})


document.querySelector(".upload").addEventListener('click',()=>{
uploadImage()
})
document.querySelector("#imgDel").addEventListener('click',()=>{
$('.uploadImg').show();
$('.uploadedImg').hide();
$('#imgUrl').val('');
})
$('#editor').trumbowyg({
  lang: 'fa',
  btnsDef: {
      // Create a new dropdown
      image: {
          dropdown: ['insertImage', 'upload'],
          ico: 'insertImage'
      }
  },
  // Redefine the button pane
  btns: [
      ['viewHTML'],
      ['formatting'],
      ['strong', 'em', 'del'],
      ['superscript', 'subscript'],
      ['link'],
      ['image'], // Our fresh created dropdown
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['unorderedList', 'orderedList'],
      ['horizontalRule'],
      ['removeformat'],
      ['fullscreen']
  ],
  plugins: {
      upload: {
        serverPath: 'https://alitayebi.com/cockpit/api/cockpit/addAssets?token=a90af541b2addebd0a6b3da1423423',
        fileFieldName: 'files[]',
        urlPropertyName: 'href',
        success: function (data, trumbowyg, _$modal, values) {
          var filePath  = 'https://alitayebi.com/cockpit/storage/uploads'+data.assets[0].path ;
          var fileName  = 'https://alitayebi.com/cockpit/storage/uploads'+data.assets[0].title ;

            if(data.assets) {
                if(data.assets[0].image) {
                  trumbowyg.doc.execCommand("insertHTML", false, "<img src='" + filePath + "' alt='" +  values.alt + "'>")
                  trumbowyg.closeModal();
                }
                else {
                    var link = $(['<a href="', filePath, '">', fileName, '</a>'].join(''));
                    //trumbowyg.range.deleteContents();
                    trumbowyg.range.insertNode(link[0]);
                }
                setTimeout(function () {
                    trumbowyg.closeModal();
                }, 250);
            }
            else {
                trumbowyg.addErrorOnModalField(
                    $('input[type=file]', $modal),
                    trumbowyg.lang[data.message]
                );
            }
        }
                   }
  }
});
