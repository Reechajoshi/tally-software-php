<?php
	require('inc/class.helper.php');
	require("inc/class.dbfuncs.x");
	
	$hlp = new chelp();
	
	/*require('captcha/securimage.php');
	$img = new Securimage();
	*/
	$_M_NOJS = isset($_GET['nojs']);
	$_M_FORCE_LINK_FULL_LOAD = true; //THIS WILL NOT USE JS TO PROC MENU LINKS, BUT USE A FULL RELOAD, def use JS
	$_M_HIDE_TEXT_SIZE_CHANGE = false;
	
	$_BODY_TOP_IMG_HEIGHT = 45;
	$_BODY_TOP_TXT_HEIGHT = 30;
	$_MAIN_IMG_WIDTH=300;
	
	$_CONTENT_DEF_TEXT_SIZE = 11;
			
	/* IF NOT A REGULAR BROWSER MAYBE A CRAWLER SO TREAT AS SUCH
	if( !$_M_NOJS && !( $hlp->_isIE || $hlp->_isFF || $hlp->_isCH || $hlp->_isSF || $hlp->_isOP ) )
		$_M_FORCE_LINK_FULL_LOAD = true;	
	else if( isset($_GET['flfl'] ) ) //force server full load
		$_M_FORCE_LINK_FULL_LOAD = true;
		
	if( isset( $_GET['cpim'] ) )
	{
		$img->show();
	}
*/
	
	include('direction.php');

	require($_CONTENT_DIR.'/list.php');
	
	if(isset($_GET['c']))
	{
		require('content.php');
	}
	else if(isset($_GET['i']))
	{
		$_IMAGE_REQ = $_GET['i'];
		require('image.php');
	}
	else
	{
		$_BODY_WSPEC_ID = 'wcon';		
		
		$_BODY_TOP_HEIGHT = ($_BODY_TOP_IMG_HEIGHT + $_BODY_TOP_TXT_HEIGHT);
		
		if( isset($_GET['fl']) && isset($_CONTENT_OK_FILES[ $_GET['fl'] ]) )
		{
			$_MENU_START = $_GET['fl'];
		}
			
		// INCLUDED FROM MAIN AND SETUP MENUS AND MAIN IMAGE
		$_MENU_HTML = '<div id=topmparent class=gc>';
		$_MENU_LIST_JS = "\n\nvar _M_MENU_LIST = new Array(";
		
		$noDis = 'style="display:none;"';
		$doDis = 'style="display:block;"';
		
		foreach ($_MENUS as $n => $m)
		{
			$_MENU_LIST_JS .= '"'.$n.'",';		
			$isSelt = ($n == $_MENU_START);
			
			$_MENU_HTML .= '<div name="'.$n.'" class="tlg gsc" style="border-bottom: '.( ($isSelt)?('#000'):('#fff') ).' 3px solid">';
			$_MENU_HTML .= '<div class="btxt" name=nol '.( ($isSelt)?($doDis):($noDis) ).'>'.$m.'</div>';			
			$_MENU_HTML .= '<a class="btxt txt-def-color tl" name=isl '.( ($isSelt)?($noDis):($doDis) ).' href="index.x?'.( ($_M_NOJS)?('nojs&'):('') ).'fl='.$n.'" '.( ($_M_NOJS || $_M_FORCE_LINK_FULL_LOAD)?(''):('onclick="return(CHelp.clickMe(this))" onmouseover="CHelp.highLink(this,true);" onmouseout="CHelp.highLink(this,false);"') ).' >'.$m.'</a>';
			$_MENU_HTML .= '</div>';
		}
		
		$_MENU_LIST_JS = substr($_MENU_LIST_JS,0,strlen($_MENU_LIST_JS)-1).");\n";
		$_MENU_HTML .= '</div>';
		
		$_TITLE_LIST_JS = "\n\nvar _M_TITLE_LIST = new Array();\n";
		
		foreach ($_CONTENT_TITLE_MAP as $n => $t)
		{
			$_TITLE_LIST_JS .= '_M_TITLE_LIST["'.$n.'"] = "'.$t."\";\n";
		}
		
		require('submenu.php');
		
		echo('<html>');
		require('head.php');
		echo('<body '.( ($_M_FORCE_LINK_FULL_LOAD) ? ('') : ('onload="CLoad.init();"') ).' >');
		
		if($_M_NOJS)
		{
			$js_link = $_SERVER["PHP_SELF"];
			
			$qs = preg_replace("/nojs([=])*([0-9])*/",'',$_SERVER["QUERY_STRING"]);
			
			if(strlen($qs)>0)
			{
				if($qs[0]=='&')
					$js_link .= '?'.substr($qs,1);
				else
					$js_link .= '?'.$qs;
			}
			
			echo("<script type='text/javascript'> <!-- ".chr(10)." top.location.replace('$js_link'); ".chr(10)." //--> </script>");
		}				
		else
		{
			$nojs_link = $_SERVER["PHP_SELF"].'?nojs';
			
			
			if(isset($_SERVER["QUERY_STRING"]) && strlen($_SERVER["QUERY_STRING"])>0)
				$nojs_link .= '&'.$_SERVER["QUERY_STRING"];
				
			echo('<noscript>Your Javascript is disabled; Javascript is normally needed to make this website work. Please enable Javascript or <a href="'.$nojs_link.'" target=_self>click here</a>, to continue without javascript.</noscript>');
		}				
		
		//echo('<div id=bodyall style="'.( ($_M_NOJS)?('padding-top:10px;'):('display:none') ).';position:absolute;left:0px;top:0px;width:100%;height:100%">');
		echo('<div id=bodyall style="width:100%;height:100%">');			
		require('main.php');
		echo('</div>');
		
		echo('</body></html>');
	}
	
?>
