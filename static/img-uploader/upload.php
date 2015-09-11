<?php
if (!empty($_FILES['img'])) {
	// 验证略
	if (!is_array($_FILES['img']['name']))
	{
		$_FILES['img']['name'] = array($_FILES['img']['name']);
		$_FILES['img']['tmp_name'] = array($_FILES['img']['tmp_name']);
	}
	$len = count($_FILES['img']['name']);
	$exts = array();
	for ($i = 0; $i < $len; $i++)
	{
		$name = $_FILES['img']['name'][$i];
		$tmp = $_FILES['img']['tmp_name'][$i];
		$ext = substr($name, strrpos($name, '.')+1);
		move_uploaded_file($tmp, "uploads/{$_POST['uuid']}".($len>1?"-{$i}":'').".{$ext}");
		$exts[] = $ext;
	}

	echo "<script>parent.imgUploader.afterupload('{$_POST['uuid']}',".json_encode($exts).")</script>";
}
