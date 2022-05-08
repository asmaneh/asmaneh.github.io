---
layout: default
---
<?php
$postID = $_GET['postID'];
$strJsonFileContents = file_get_contents("http://favela.ir/cockpit/api/collections/get/posts?token=a90af541b2addebd0a6b3da1423423");
// Convert to array
$array = json_decode($strJsonFileContents, true);
foreach ($array["entries"] as $row) {
  if ($row["postID"] === $postID) {
    $title = $row["title"];
    $author  = $row["author"];
    $excerpt  = $row["excerpt"];
    $text  = $row["text"];
    $post_ID = $row["_id"];
  }
}
?>
<main role="main">
  <section class="py-5 bg-black">
    <div class="container-fluid">
      <div class="col-12">
        <div class="card bg-transparent border-0">
            <div class="row no-gutters">
                <div class="col-sm-4">
                    <img class="card-img border border-3 border-dark" src="https://picsum.photos/seed/picsum/150/150?grayscale" alt="Suresh Dasari Card">
                </div>
                <div class="col-sm-8 mt-5" style="margin-right: -50px;">
                  <div class="d-flex flex-row mb-0">
                    <div class="h4 py-2 px-3 mt-auto bg-light border border-3 border-dark mb-0 border-bottom-0 border-right-0">
                      مطالعات تاریخی
                    </div>
                    <div class="h4 py-2 px-3 mt-auto bg-light border border-3 border-dark mb-0 border-bottom-0">
                      ۱۳۹۹-۹-۱۰
                    </div>
                  </div>
                  <div class="card-body border border-3 border-dark mt-0  bg-light">
                    <h1 class="card-title"><?php echo $title;  ?></h1>
                    <h4><?php echo $author;  ?></h4>
                    <p class="lead card-text"><?php echo $excerpt;  ?></p>
                  </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  </section>
  <section>
    <div class="container py-5">
      <div class="row justify-content-md-center">
        <div class="col col-lg-8" markdown="1">
          <?php echo $text;  ?>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col col-lg-8 d-flex flex-column text-center">
          <div class="h4 border border-dark border-3 mb-0 border-bottom-0 p-3">
            اشتراک مطلب
          </div>
          <div class="h5 border border-dark border-3 d-flex justify-content-around mt-0 p-3">
            <a href="#">فیسبوک</a>
            <a href="#">توئیتر</a>
            <a href="#">ایمیل</a>
          </div>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col col-lg-8 d-flex flex-column text-center">
          <div class="h4 border border-dark border-3 mb-0 border-bottom-0 p-3">
            درباره نویسنده
          </div>
          <div class="border border-dark border-3 d-flex justify-content-around mt-0 p-3">
            <p>
              <strong><?php echo $author;  ?></strong>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.

            </p>
          </div>
        </div>

    </div>
  </section>
  {% include sectionSpecial.html %}

</main>
