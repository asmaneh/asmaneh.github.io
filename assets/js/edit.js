var post_id;
if (currentUser === undefined || currentUser === null) {
  window.location.replace('/404.html');
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
if (urlParams.get('slug')){
  $.getJSON('/posts.json', function(json) {
    var as=$(json).filter(function (i,n){return n.slug===urlParams.get('slug')});
    if (as.length > 0) {
      getPost(as);
    } else {
      window.location.replace('/404.html');
    }
  });
}
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
  var postID = makeid(5);
  $('#uploadFImg').attr('data-name', postID);
  $('#uploadFPdf').attr('data-name', postID);
  $('#postAuthor').val(currentUser.username);
  if (currentUser.role == 'author' ) {
    $('#postAuthor').prop('disabled', true);
  }

}
$('#send').on('click', function () {
  $('#sendPost').submit()
  /*
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
  */
})
function getPost(object) {
  console.log(object.length);
  if (object.length > 0) {
    postID = object[0].slug;
    console.log(postID);
    $('#uploadFImg').attr('data-name', postID);
    $('#uploadFPdf').attr('data-name', postID);
    if (object[0].tags.length > 0){
      for (let i = 0; i < object[0].tags.length; i++) { 
        $('#postTags').tagsinput('add', object[0].tags[i]);
      }
    }
    $('#postTitle').val(object[0].title);
    $('#postType').val(object[0].type).trigger('change');
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
    }).setDate(parseInt(object[0].date)*1000);
    if (object[0].sort) {
      $('#postSort').val(object[0].sort);
    } else {
      $('#postSort').val('');
    }
    if (object[0].otherAuthor == true) {
      $('#postAuthor').val('other').trigger('change');
      $('#postOtherAuthor').val(object[0].author)
    } else {
      $('#postAuthor').val(object[0].author).trigger('change');
    }
    $('#postCategory').val(object[0].category);
    $('#postExcerpt').html(object[0].excerpt);
    tinyMCE.get('editor').setContent(object[0].content);
    $('#editor').html(object[0].content);
    if (object[0].embedCode) {
      var embedCode = object[0].embedCode;
      embedCode = embedCode.replace("<!--", "");
      embedCode = embedCode.replace("-->", "");
      $('#embdMedia').attr('checked', true).trigger('change');
      $('#embdMediaCode').val(embedCode);
    } else {
      $('#embdMedia').attr('checked', false).trigger('change');
      $('#embdMediaCode').val('');
    }
    $('#featureBtn').attr('aria-pressed', object[0].feature)
    $('#published').attr('selected',object[0].published);
    if (object[0].image) {
      $('#featureImg > .image-link').attr('href', object[0].image).attr('data-path', object[0].image);
      $('#featureImg > .uploadImg').hide();
      $('#featureImg > .uploadedImg').show();
    } else {
      $('#featureImg > .image-link').attr('href', '').attr('data-path', '');
      $('#featureImg > .uploadImg').show();
      $('#featureImg > .uploadedImg').hide();
    }
    if (object[0].pdfPath) {
      $('#attachPDF > .pdf-link').attr('href', object[0].pdfPath).attr('data-path', object[0].pdfPath);
      $('#attachPDF > .uploadImg').hide();
      $('#attachPDF > .uploadedImg').show();
    } else {
      $('#attachPDF > .pdf-link').attr('href', '').attr('data-path', '');
      $('#attachPDF > .uploadImg').show();
      $('#attachPDF > .uploadedImg').hide();
    }
    if (object[0].gallary) {
      if (object[0].gallary.length > 0) {
        $('#postGallary').empty();
        for (var i = 0; i < object[0].gallary.length; i++) {
          $('#postGallary').append(`
          <div class="row gallary-image">
              <input type="file" class="uploadImg" style="display:none;">
              <a href="javascript:void(0)" class="uploadImg btn btn-secondary" onclick="uploadImage(this)" style="display:none;">بارگذاری</a>
              <a href="`+object[0].gallary[i].image_path+`" data-path="`+object[0].gallary[i].imagePath+`" class="image-link uploadedImg btn btn-success" target="_blank">نمایش</a>
              <a href="javascript:void(0)" class="image-delete uploadedImg btn btn-danger" onclick="deleteImage(this)">حذف</a>
              <input type="text" class="uploadedImg" value="`+object[0].gallary[i].title+`" name="" placeholder="توضیح عکس" value="" style="width:400px">
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
    toolbar: 'undo redo | rtl ltr | bold italic underline strikethrough | formatselect | footnotes | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | table | forecolor backcolor casechange permanentpen formatpainter removeformat | charmap emoticons | fullscreen  preview | insertfile image media pageembed link anchor',
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
$(document).on( 'change keyup paste input', 'input[type="text"],textarea', function(){
  var value = $(this).val();
  if (value.indexOf('"') != -1) {
    $(this).val(value.replace(/\"/g, "'"));
  }
} );
