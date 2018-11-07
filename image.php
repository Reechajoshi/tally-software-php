<?php
	$ifile = $_IMAGE_REQ.'.png';
	$ipath = $_CONTENT_DIR.'images/'.$ifile;
	
	if(file_exists($ipath))
	{
		header("Content-Type: image/png" );
		header("Content-Disposition: inline; filename=\"$ifile\";");
		header("Content-Transfer-Encoding:­ binary");
		header("Content-Length: ".filesize($ipath));
		readfile($ipath);
	}
?>