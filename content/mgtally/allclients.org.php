<?php
	// Database variable declaration...
	$_db = new dbc('mgtally','mgtally','mgtally');
	
	echo(" Welcome to all clients page...<br/> ");
	
	$cnt = 1;	
	$selQuery = " select cid,name from client; ";	
	$res = $_db->db_query($selQuery);
	if( $_db->db_num_rows($res) !== 0 )
	{
		while( ( $row = $_db->db_result( $res ) ) !== false )
		{
			$cid = $row['cid'];
			$name = $row['name'];
			
			echo('
					<div style="margin-top:3px;">'.$cnt++.') <a href="index.x?fl=newclient&cid='.$cid.'">'.$name.'</a></div>
				');
			
		}
	}
	else
		echo('No users present...');
?>

