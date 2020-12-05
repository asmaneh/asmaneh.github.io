---
layout: default
---
<script type="text/javascript">
</script>
<?php
$postID = $_GET['postID'];
include 'cockpit/bootstrap.php';
$posts = cockpit('collections')->find('posts', [
  'filter' => [
    'postID' => $postID,
  ]
]);
$title = $posts[0]["title"];
$author  = $posts[0]["author"];
$excerpt  = $posts[0]["excerpt"];
$text  = $posts[0]["text"];
$post_ID = $posts[0]["_id"];

?>
<main role="main">
  <section class="py-5">
    <form>
      <div class="container">
        <div class="row">
          <div class="col-12 form-group">
            <label for="postTitle">عنوان</label>
            <input type="text" class="form-control" id="postTitle" placeholder="عنوان یادداشت" value="<?php echo $title; ?>">
          </div>
          <div class="col-12">
            <label for="featureImg">تصویر شاخص</label>
            <input type="file" class="uploadImg" id="featureImg" name="myFile" id="myFile">
            <a href="javascript:void(0)" class="upload uploadImg btn btn-secondary">بارگزاری</a>
            <a href="" id="imgPrv" class="uploadedImg btn btn-success" target="_blank" style="display: none;">نمایش</a>
            <a href="javascript:void(0)" id="imgDel" class="uploadedImg btn btn-danger" style="display: none;">حذف</a>
          </div>
          <div class="col-12 form-group d-none">
            <label for="imgUrl">آدرس تصویر شاخص</label>
            <input type="text" class="form-control" id="imgUrl" placeholder="تصویر شاخص">
          </div>
          <div class="col-12 form-group">
            <label for="postText">متن</label>
            <textarea  id="editor" class="form-control" id="postText" placeholder="متن"><?php echo $text; ?></textarea>
          </div>
        </div>
      </div>
    </form>
  </section>
</main>





<script type="text/javascript">
const API_URL = 'https://alitayebi.com/cockpit';
const TOKEN   = 'a90af541b2addebd0a6b3da1423423';

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
</script>
