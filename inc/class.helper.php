<?php

	require_once( 'php/class.mail.php' );
	
	class chelp
	{	
		var $dblnk = null;
		
		var $_isIE = false;
		var $_isFF = false;
		var $_isCH = false;
		var $_isSF = false;
		var $_isOP = false;
		
		function sendMail($sender,$receiver,$content,$subject,$ebcc)
		{
			$mail  = new cmail();
			$mail->send($sender,$receiver,$content,'','',$subject,$ebcc);
		}
		
		function chelp()
		{
			$this->setUserAgent();
			@session_start();	
		}
		
		function genCID($ntype,$s)
		{
			return($ntype.'-'.substr( preg_replace( '/[a-z]*/', '', md5(uniqid(time(),true).$s)), 0, 5) );
		}
		
		function setUserAgent()
		{
			if(isset($_SERVER['HTTP_USER_AGENT']))
			{
				$UA = $_SERVER['HTTP_USER_AGENT'];
				$this->_UA = $_SERVER['HTTP_USER_AGENT'];
				
				$this->_isCH = strstr($UA, 'Chrome') ? true : false;
				$this->_isFF = !$this->_isCH && strstr($UA, 'Firefox') ? true : false;
				$this->_isIE = !$this->_isCH && !$this->_isFF && strstr($UA, 'MSIE') ? true : false;				
				$this->_isSF = !$this->_isCH && !$this->_isFF && strstr($UA, 'Safari') ? true : false;
				$this->_isOP = strstr($UA, 'Opera') ? true : false;
				
				if($this->_isCH)
				{
					$this->_CHV = preg_split('/Chrome\//i', $UA);
					$this->_CHV = explode('.',$this->_CHV[1]);
					$this->_CHV = floatval($this->_CHV[0]);
				}
				else
					$this->_CHV = false;
				
				$this->_SFV = $this->_isSF ? preg_split('/version\//i', $UA) : false;
				$this->_SFV = $this->_SFV ? floatval($this->_SFV[1]) : false;				
				
				$this->_FFV = $this->_isFF ? preg_split('/firefox\//i', $UA) : false;
				$this->_FFV = $this->_FFV ? floatval($this->_FFV[1]) : false;				
				
				$this->_IEV = $this->_isIE ? preg_split('/msie/i', $UA) : false;
				$this->_IEV = $this->_IEV ? floatval($this->_IEV[1]) : false;
			}
		}
	
		function format_date($s)
		{
			//global $_TZ_DB;
			$_TZ_DB = 'Asia/kolkata';
			$format = 'D jS M Y';
			
			$nd=(date($format, strtotime($s) )); //.' '.$_TZ_DB)));
			
			if($nd===false)
				return($s);
			else
				return($nd);
		}
		
		function formatTime($td)
		{
			$diff = time() - strtotime($td);
			
            if( $days=intval((floor($diff/86400))) )
                $diff = $diff % 86400;
            if( $hours=intval((floor($diff/3600))) )
                $diff = $diff % 3600;
            if( $minutes=intval((floor($diff/60))) )
                $diff = $diff % 60;
            $seconds = intval( $diff );
			
            //return( array('days'=>$days, 'hours'=>$hours, 'minutes'=>$minutes, 'seconds'=>$seconds) );
			
			if($hours>0)
				return( $hours.'h:'.$minutes.'m:'.$seconds.'s' );
			else
				return( $minutes.'m:'.$seconds.'s' );			
		}
		
		function getComboTransCurr($curr,$selected)
		{
			$comboTransCurr = "<select name=transcurr>";
			foreach($curr as $c)
				$comboTransCurr .= "<option value=".$c." ".(($selected == $c)?("selected"):("")).">".$c."</option>";
			$comboTransCurr .= "</select>";
			return $comboTransCurr;
		}
		
		function getComboBusinessNature($selected)
		{
			$comboBusiness = "<select name=business style='float:left;width:200px;' onchange='CHelp.toggleDisp(\"txtbus\",this)'>";
			$comboBusiness .= "<option value=sofm ".(($selected == 'sofm')?("selected"):(""))."> Supply of material </option>";
			$comboBusiness .= "<option value=cont ".(($selected == 'cont')?("selected"):(""))."> Contract </option>";
			$comboBusiness .= "<option value=advc ".(($selected == 'advc')?("selected"):(""))."> Advt Contract </option>";
			$comboBusiness .= "<option value=prof ".(($selected == 'prof')?("selected"):(""))."> Prof / Tech Services </option>";
			$comboBusiness .= "<option value=rent ".(($selected == 'rent')?("selected"):(""))."> Rent </option>";
			$comboBusiness .= "<option value=comm ".(($selected == 'comm')?("selected"):(""))."> Comm & Brokerages </option>";
			$comboBusiness .= "<option value='other' ".(($selected == 'other')?("selected"):(""))."> Other (Please specify) </option>";
			$comboBusiness .= "</select>";
			return $comboBusiness;
		}
		
		function getComboItemsNature($selected)
		{
			$comboItems = "<select name=items style='float:left;width:200px;' onchange='CHelp.toggleDisp(\"txtitem\",this)'>";
			$comboItems .= "<option value=capex ".(($selected == 'capex')?("selected"):(""))."> Capex/Assets </option>";
			$comboItems .= "<option value=fmserv ".(($selected == 'fmserv')?("selected"):(""))."> Major FM services </option>";
			$comboItems .= "<option value=catalogue ".(($selected == 'catalogue')?("selected"):(""))."> Catalogue items </option>";
			$comboItems .= "<option value=enggspares ".(($selected == 'enggspares')?("selected"):(""))."> Engg spares </option>";
			$comboItems .= "<option value=civil ".(($selected == 'civil')?("selected"):(""))."> Civil/Electrical </option>";
			$comboItems .= "<option value=hvac ".(($selected == 'hvac')?("selected"):(""))."> HVAC/Networking </option>";
			$comboItems .= "<option value=amc ".(($selected == 'amc')?("selected"):(""))."> AMC/OMC services </option>";
			$comboItems .= "<option value=logistic ".(($selected == 'logistic')?("selected"):(""))."> Logistic/OSP/Insurance </option>";
			$comboItems .= "<option value=it ".(($selected == 'it')?("selected"):(""))."> IT/Telecom/Network </option>";
			$comboItems .= "<option value=newsprint ".(($selected == 'newsprint')?("selected"):(""))."> Newsprint/Consumables </option>";
			$comboItems .= "<option value=event ".(($selected == 'event')?("selected"):(""))."> Event Mngt/Brand Promo </option>";
			$comboItems .= "<option value=gift ".(($selected == 'gift')?("selected"):(""))."> Gift/P&P related </option>";
			$comboItems .= "<option value=labsupply ".(($selected == 'labsupply')?("selected"):(""))."> Labour supply </option>";
			$comboItems .= "<option value=consult ".(($selected == 'consult')?("selected"):(""))."> Consultancy </option>";
			$comboItems .= "<option value=special ".(($selected == 'special')?("selected"):(""))."> Specialized </option>";
			$comboItems .= "<option value=other ".(($selected == 'other')?("selected"):(""))."> Other (Please specify) </option>";
			$comboItems .= "</select>";
			return $comboItems;
		}
	}
?>
