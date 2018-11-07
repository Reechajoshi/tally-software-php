<?php	
	echo('<table border=0 width=100%><tr><td align=center><div id="'.$_BODY_WSPEC_ID.'" style="width:1000px">
		<table border=0 width=100% height=100% cellpadding=0 cellspacing=0 >
		<tr><td align=left valign=top height='.$_BODY_TOP_IMG_HEIGHT.'>
			<table border=0 width=100% height=37 cellpadding=0 cellspacing=5><tr>
			<td align=left valign=bottom>');
			
				if(isset($_MENU_HTML)) //MENU OUTPUT
					echo($_MENU_HTML);
				
				echo('</td><td align=right valign=top>
			<img '.( ($_M_NOJS)?(''):('style="display:none;"') ).' src="index.x?i='.$_MAIN_LOGO.'" border=0 width='.$_MAIN_IMG_WIDTH.'px onload="this.style.display=\'block\';" />				
		</td>
		</tr>
		<tr><td>');
			echo($_SUBMENU_HTML);
		echo('</td></tr>
		</table>
	</td></tr>
	
	<tr><td align=left valign=top><div class="gc-scroll" id=basecon>');
	
	require('content.php');		
		
	echo('</div></td></tr>
		</table>
	</div></td></tr></table>');
?>