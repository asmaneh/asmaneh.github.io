var post_id;
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
  var idTag = "_id: "+urlParams.get('id')+",";
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

} else {
  var idTag = "";
  var postID = makeid(4);
  $('#uploadFImg').attr('data-name', postID);
  $('#uploadFPdf').attr('data-name', postID);
  $('#postAuthor').val(currentUser.username);
  if (currentUser.role != 'admin') {
    $('#postAuthor').prop('disabled', true);
  }

}
$('#send').on('click', function () {
  console.log(idTag);
  var postGallary;
  if ($('.gallary-image > .image-link').length > 0) {
    postGallary =[];
    $('.gallary-image > .image-link').each(function () {
      postGallary.push({"imageUrl": $(this).attr('href'), "imagePath": $(this).attr('data-path'), "image_title": $(this).siblings('input[type=text]').val()})
    });
  }
  if ($('#postAuthor').val() == "other") {
    var postAuthor = $('#postOtherAuthor').val();
    var postOtherAuthor = true;
  } else {
    var postAuthor = $('#postAuthor').val();
    var postOtherAuthor = false;
  };
  if ($('#embdMediaCode').val() != "") {
    var embedTag = '<!--' + $('#embdMediaCode').val() + '-->';
  } else {
    var embedTag = "";
  }
  const publishDateEn = new Date(parseInt($('#publishDateU').val()));
  fetch(API_URL+'/api/collections/save/posts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+TOKEN },
      body: JSON.stringify({
          data: {
            _id: urlParams.get('id'),
            slug: postID,
            title: $('#postTitle').val(),
            upload: false,
            date: $('#publishDateU').val(),
            type: $('#postType').val(),
            category: $('#postCategory').val(),
            tags: $("#postTags").val(),
            content: tinymce.get("editor").getContent(),
            image: $('#featureImg > .image-link').attr('href'),
            imagePath: $('#featureImg > .image-link').attr('data-path'),
            pdfRawPath: $('#attachPDF > .pdf-link').attr('href'),
            pdfPath: $('#attachPDF > .pdf-link').attr('data-path'),
            published: $('#postStatus').val(),
            gallary: postGallary,
            author: postAuthor,
            otherAuthor: postOtherAuthor,
            embedCode: embedTag,
            sort: $('#postSort').val(),
            feature: $('#featureBtn').attr('aria-pressed')
          }
      })
  })
  .then(res=>res.json())
  .then(data => {
    if ($('#postStatus').val()) {
      $('#sendPost').submit()
    } else {
      window.location.replace('/review/')
    }
  });
})
function getPost(object) {
  if (object.entries.length > 0) {
    postID = object.entries[0].slug;
    post_id= object.entries[0]._id;
    $('#uploadFImg').attr('data-name', postID);
    $('#uploadFPdf').attr('data-name', postID);
    $('#postTags').tagsinput('add', object.entries[0].tags);
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
    if (object.entries[0].sort) {
      $('#postSort').val(object.entries[0].sort);
    } else {
      $('#postSort').val('');
    }
    if (object.entries[0].otherAuthor == true) {
      $('#postAuthor').val('other').trigger('change');
      $('#postOtherAuthor').val(object.entries[0].author)
    } else {
      $('#postAuthor').val(object.entries[0].author).trigger('change');
    }
    $('#postCategory').val(object.entries[0].category);

    $('#editor').html(object.entries[0].content);
    if (object.entries[0].embedCode) {
      var embedCode = object.entries[0].embedCode;
      embedCode = embedCode.replace("<!--", "");
      embedCode = embedCode.replace("-->", "");
      $('#embdMedia').attr('checked', true).trigger('change');
      $('#embdMediaCode').val(embedCode);
    } else {
      $('#embdMedia').attr('checked', false).trigger('change');
      $('#embdMediaCode').val('');
    }
    $('#featureBtn').attr('aria-pressed', object.entries[0].feature)
    $('#published').attr('selected',object.entries[0].published);
    if (obj.entries[0].image) {
      $('#featureImg > .image-link').attr('href', obj.entries[0].image).attr('data-path', obj.entries[0].imagePath);
      $('#featureImg > .uploadImg').hide();
      $('#featureImg > .uploadedImg').show();
    } else {
      $('#featureImg > .image-link').attr('href', '').attr('data-path', '');
      $('#featureImg > .uploadImg').show();
      $('#featureImg > .uploadedImg').hide();
    }
    if (obj.entries[0].pdfPath) {
      $('#attachPDF > .pdf-link').attr('href', obj.entries[0].pdfRawPath).attr('data-path', obj.entries[0].pdfPath);
      $('#attachPDF > .uploadImg').hide();
      $('#attachPDF > .uploadedImg').show();
    } else {
      $('#attachPDF > .pdf-link').attr('href', '').attr('data-path', '');
      $('#attachPDF > .uploadImg').show();
      $('#attachPDF > .uploadedImg').hide();
    }
    if (obj.entries[0].gallary) {
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
tinymce.init({
  menubar:false,
  language: 'fa',
  directionality: 'rtl',
    plugins: 'preview autolink autosave save footnotes directionality visualblocks visualchars fullscreen image link media template table charmap hr anchor advlist lists wordcount charmap emoticons',
    toolbar: 'undo redo | rtl ltr | bold italic underline strikethrough | formatselect fontsizeselect | footnotes | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | table | forecolor backcolor casechange permanentpen formatpainter removeformat | charmap emoticons | fullscreen  preview | insertfile image media pageembed link anchor',
    selector: '#editor'
});
$("#embdMedia").change(function () {
  if ($(this).is(':checked')) {
    $('#embdMediaCode').parent().show();
  } else {
    $('#embdMediaCode').parent().hide();
  }
})
$('#postAuthor').change(function () {
  if (this.value == "other") {
    $('#postOtherAuthor').show();
  } else {
    $('#postOtherAuthor').hide();
  }
})
$('#postType').change(function () {
  if (this.value == 'bulletins') {
    $('#postSort').parent().show();
  } else {
    $('#postSort').parent().hide();
  }
})
