<?php
	class dbc
	{
		var $dblnk =null;
		
		function dbc($dbn,$dbu,$dbp)
		{
			$this->dblnk = mysql_connect( 'localhost', $dbu, $dbp ) or die ("ERROR: ".mysql_error($this->dblnk));			
			mysql_select_db($dbn,$this->dblnk) or die ("ERROR : ".mysql_error($this->dblnk));
		}
		
		function db_query($q)
		{
			return (mysql_query($q, $this->dblnk)); 
		}
		
		function db_result($res)
		{
			return (mysql_fetch_assoc($res)); 
		}
		
		function db_affected_rows()
		{
			return (mysql_affected_rows()); 
		}
		
		function db_num_rows($res)
		{
			return (mysql_num_rows($res)); 
		}
		
		function db_insert_id()
		{
			return (mysql_insert_id($this->dblnk)); 
		}
		
		function db_error()
		{
			return(mysql_error($this->dblnk));
		}
		
		function db_return($q,$k)
		{
			$res = $this->db_query($q);
			if(($res)&&($row = $this->db_result($res))&&isset($row[$k]))
				return($row[$k]);
			else
				return(false);
		}
		
		function db_goto($res,$rownum)
		{
			return( mysql_data_seek( $res,$rownum ) );
		}	
		
		function escapeQuote($str)
		{
			return(addslashes($str));			
		}		
		
		function db_begin() { return($this->db_query('BEGIN')); }
		function db_done() { return($this->db_query('COMMIT')); }
		function db_undo() { return($this->db_query('ROLLBACK')); }
	}
?>