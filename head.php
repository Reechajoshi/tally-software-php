<?php
	echo( '<head>
		
	<title>');
	
	if(isset($_CONTENT_TITLE_MAP[$_MENU_START]))
		echo($_CONTENT_TITLE_MAP[$_MENU_START]);
	
	echo("</title>
		
		<style type='text/css'>\n\n" );

	require( 'styles/all.php' );
	
	echo("\n\n");
	
	if(isset($_HEAD_STYLE))
		require($_CONTENT_DIR.'/styles/'.$_HEAD_STYLE.'.css');
		
	echo( "\n</style>");
	
	if(isset($_HEAD_EXTRA))
	{
		echo("\n".$_HEAD_EXTRA."\n");
	}
?>

<?php

	if(isset($_G_ANALYTIC_CODE) && strlen($_G_ANALYTIC_CODE)>0)
	{
		echo('<script type=\'text/javascript\'> <!--
				var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
				document.write(unescape("%3Cscript src=\'" + gaJsHost + "google-analytics.com/ga.js\' type=\'text/javascript\'%3E%3C/script%3E"));
			//--> </script>

			<script type="text/javascript">
			
			');
			
			echo('try {
					var pageTracker = _gat._getTracker("');
					
		echo($_G_ANALYTIC_CODE);
		
		echo('"); pageTracker._trackPageview();
				} catch(err) {}
			//--> </script>
		');
	}
	
	echo( "<script type='text/javascript'>
		var _BODY_TOP_HEIGHT = $_BODY_TOP_HEIGHT;
		var _CONTENT_DEF_TEXT_SIZE = $_CONTENT_DEF_TEXT_SIZE;
		var _MENU_START = '$_MENU_START'; 
		var _BODY_WSPEC_ID = '$_BODY_WSPEC_ID';
		</script><script type='text/javascript'> <!-- \n\n" );
	
		echo( $_TITLE_LIST_JS );
		echo( $_MENU_LIST_JS );
	
		require( 'jsloader.php' );
	
	echo(" \n\n //--> </script>	

	</head>");
?>
