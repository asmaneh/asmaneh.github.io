if (currentUser === undefined || currentUser === null) {
  window.location.replace('/');
}
$("#publishDate").persianDatepicker({
  initialValue: false,
  responsive: true,
  format: 'L',
  autoClose: true,
  altField: '#publishDateU',
  calendar:{
    persian:{
      showHint: true
    },
    gregorian:{
      showHint: true
    }
  }
});
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
      var postGallary =[];
      $('.gallary-image > .image-link').each(function () {
        postGallary.push({"imageUrl": $(this).attr('href'), "imagePath": $(this).attr('data-path'), "image_title": $(this).siblings('input[type=text]').val()})
      })
      const publishDateEn = new Date(parseInt($('#publishDateU').val()));
      fetch(API_URL+'/api/collections/save/posts', {
          method: 'post',
          headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
          body: JSON.stringify({
              data: {
                _id: urlParams.get('id'),
                title: $('#postTitle').val(),
                date: $('#publishDateU').val(),
                type: $('#postType').val(),
                category: $('#postCategory').val(),
                content: $('#editor').val(),
                image: $('#featureImg > .image-link').attr('href'),
                published: $('#postStatus').val(),
                gallary: postGallary,
                author: $('#postAuthor').val()
              }
          })
      })
      .then(res=>res.json())
      .then(commits => $('#alertEdited').show());
    })
} else {
  var postID = makeid(4);
  $('#uploadFImg').attr('data-name', postID);
  $('#postAuthor').val(currentUser.username);
  if (currentUser.role != 'admin') {
    $('#postAuthor').prop('disabled', true);
  }

  $('#sendPost').submit(function (e) {
  e.preventDefault();

  fetch(API_URL+'/api/collections/save/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          data: {
            published: '0',
            title: $('#postTitle').val(),
            slug: postID,
            date: $('#publishDateU').val(),
            content: $('#editor').val(),
            category: $('#postCategory').val(),
            type: $('#postType').val(),
            image: $('#imgPrv').attr('href'),
            imagePath: $('#imgPrv').attr('data-path'),
            author: $('#postAuthor').val()
          }
      })
  })
  .then(res=>res.json())
  .then(data => {
    window.location.replace('/post/?id='+data._id);
  })
  })

}
function getPost(object) {
  if (object.entries.length > 0) {
    postID = object.entries[0].slug;
    $('#uploadFImg').attr('data-name', postID);
    $('#postTitle').val(object.entries[0].title);
    $('#postType').val(object.entries[0].type).trigger('change');
    $('#publishDate').persianDatepicker({
      responsive: true,
      format: 'L',
      autoClose: true,
      altField: '#publishDateU',
      calendar:{
        persian:{
          showHint: true
        },
        gregorian:{
          showHint: true
        }
      }
    }).setDate(parseInt(object.entries[0].date));
    $('#postCategory').val(object.entries[0].category);
    $('#editor').html(object.entries[0].content);

    $('#published').attr('selected',object.entries[0].published);
    if (obj.entries[0].image != '') {
      $('#featureImg > .image-link').attr('href', obj.entries[0].image).attr('data-path', obj.entries[0].imagePath);
      $('#featureImg > .uploadImg').hide();
      $('#featureImg > .uploadedImg').show();
    }
    if (obj.entries[0].gallary.length > 0) {
      $('#postGallary').empty();
      for (var i = 0; i < obj.entries[0].gallary.length; i++) {
        $('#postGallary').append(`
        <div class="row gallary-image">
            <input type="file" class="uploadImg" style="display:none;">
            <a href="javascript:void(0)" class="uploadImg btn btn-secondary" onclick="uploadImage(this)" style="display:none;">بارگذاری</a>
            <a href="`+obj.entries[0].gallary[i].imageUrl+`" data-path="`+obj.entries[0].gallary[i].imagePath+`" class="image-link uploadedImg btn btn-success" target="_blank">نمایش</a>
            <a href="javascript:void(0)" class="image-delete uploadedImg btn btn-danger" onclick="deleteImage(this)">حذف</a>
            <input type="text" class="uploadedImg" value="`+obj.entries[0].gallary[i].image_title+`" name="" placeholder="توضیح عکس" value="" style="width:400px">
        </div>
        `)
      }

    }
  }
}
$('#postType').change(function() {
$('#postCategory').find('option.'+this.value).show();
$('#postCategory').find('option:not(.'+this.value+')').hide();
})
$('.image-delete').click(function () {
  $(this).hide();
  $(this).siblings('.uploadImg').show();
  $(this).siblings('.uploadedImg').hide();
  $(this).siblings('.btn-success').attr('href', '');
})
function addImage2Gallary() {
  var imageNo = $('#postGallary').children().length +1
  $('#postGallary').append(`
  <div class="row gallary-image">
      <input type="file" class="uploadImg">
      <a href="javascript:void(0)" class="uploadGit uploadImg btn btn-secondary" data-commit="upload post gallary images" data-path="assets/img/posts/" data-name="`+postID+`-`+imageNo+`">بارگذاری</a>
      <a href="" class="image-link uploadedImg btn btn-success" target="_blank" style="display: none;">نمایش</a>
      <a href="javascript:void(0)" class="image-delete uploadedImg btn btn-danger" onclick="deleteImage(this)" style="display: none">حذف</a>
      <input type="text" class="uploadedImg" name="" placeholder="توضیح عکس" value="" style="display:none;; width:400px">
  </div>
  `)

}
function deleteImage(e) {
  $(e).parent().remove();
  if ($('#postGallary').children().length == 0) {
    addImage2Gallary();
  }
}
$("#editor").markdown({
  iconlibrary: 'fa',
  fullscreen: 'false',
  language: 'fa'
})
