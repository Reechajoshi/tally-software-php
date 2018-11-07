<?php

	$_SUBMENU_HTML = '<div id=topmparent class=gc style="margin-top:5px;margin-bottom:5px;">';
	foreach ($_SUB_MENUS as $n => $m)
	{
		$_SUBMENU_HTML .= '<div name="'.$n.'" class="tlg gsc" >';
		$_SUBMENU_HTML .= '<a class="btxt txt-def-color tl" name=isl href="index.x?'.( ($_M_NOJS)?('nojs&'):('') ).'fl='.$n.'" '.( ($_M_NOJS || $_M_FORCE_LINK_FULL_LOAD)?(''):('onclick="return(CHelp.clickMe(this))" onmouseover="CHelp.highLink(this,true);" onmouseout="CHelp.highLink(this,false);"') ).' >'.$m.'</a>';
		$_SUBMENU_HTML .= '</div>';
	}
	$_SUBMENU_HTML .= '</div>';
	
?>