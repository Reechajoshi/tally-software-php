<?php

	if(isset($_GET['fl']))
	{
		if(isset($_CONTENT_OK_FILES[$_GET['fl']]))
			require($_CONTENT_DIR.$_GET['fl'].'.php');
	}
	elseif(isset($_POST['con']))
	{
		if(isset($_CONTENT_OK_FILES[$_POST['con']]))
			require($_CONTENT_DIR.$_POST['con'].'.php');
	}
	else
		require($_CONTENT_DIR.$_MENU_START.'.php');
	/*
	if(isset($_POST['con']))
	{
		if(isset($_CONTENT_OK_FILES[$_POST['con']]))
			require($_CONTENT_DIR.$_POST['con'].'.php');
	}
	else if(isset($_GET['con_direct'])) //HACKED TO THE CORE!! NO STANDARDISATION SIGHHHHH ;(
	{
		if(isset($_CONTENT_OK_FILES[$_GET['con_direct']]))
			require($_CONTENT_DIR.$_GET['con_direct'].'.php');
	}
	else
	{
		// ONLY DISPLAY CONTENT DIRECTLY IF NO JS IS SET
		if( ($_M_NOJS || $_M_FORCE_LINK_FULL_LOAD) && isset($_CONTENT_OK_FILES[$_MENU_START]) )
			require($_CONTENT_DIR.$_MENU_START.'.php');				
	}
	*/
?>