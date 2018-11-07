<?php
	require_once( 'htmlMimeMail5.php' );
	class cmail
	{
		var $_m;
		var $_attachData;
		
		function cmail()
		{
			$this->_m = new htmlMimeMail5();
		}
		
		function addAttachment($data,$name,$contentType = 'application/octet-stream',$encoding=null)//receives data stored in variable and not in file
		{
			$this->_attachData = new stringAttachment( $data,$name,$contentType,$encoding );
			$this->_m->addAttachment( $this->_attachData );
		}
		
		function send($from,$to,$html,$imgs,$img_dir,$subject,$ebcc)
		{
			$this->_m->setFrom( $from );
			$this->_m->setSubject( $subject );
			$this->_m->setText( strip_tags( $html ) );
			
			if( $ebcc != null && $ebcc != false && $ebcc != '' )
				$this->_m->setBcc($ebcc);
				
			if( $imgs )
			{
				foreach( $imgs as $img )
					$this->_m->addEmbeddedImage( new fileEmbeddedImage( $img ) );
			}	
			
			$this->_m->setHTMLCharset( 'UTF-8' );
			
			$this->_m->setHTML( $html, $img_dir );
				
			return( $this->_m->send( $to, 'mail' ) );
		}
		
		function sub_in_first_name($jhtml,$nn)
		{
			global $_COMP_FIRST_NAME;
			return(str_replace($_COMP_FIRST_NAME,$nn,$jhtml));
		}
		
		function sub_in_last_name($jhtml,$nn)
		{
			global $_COMP_LAST_NAME;
			return(str_replace($_COMP_LAST_NAME,$nn,$jhtml));
		}
		
		function sub_in_extraA($jhtml,$extra)
		{
			global $_COMP_EXTRA_A;
			return(str_replace($_COMP_EXTRA_A,$extra,$jhtml));
		}

		function sub_in_extraB($jhtml,$extra)
		{
			global $_COMP_EXTRA_B;
			return(str_replace($_COMP_EXTRA_B,$extra,$jhtml));
		}

		function sub_in_extraC($jhtml,$extra)
		{
			global $_COMP_EXTRA_C;
			return(str_replace($_COMP_EXTRA_C,$extra,$jhtml));
		}
		
		function sub_in_name($jhtml,$nn)
		{
			global $_COMP_NAME;
			return(str_replace($_COMP_NAME,$nn,$jhtml));
		}
		
		function sub_img_names($jhtml,&$rimgs)
		{
			global $WDIR_IMG, $FB_ICON_PATH;
			
			$regx='/src[ ]*?[=][ ]*?[\'"](.)*?(img\.x)(.)*?(fnqx[=])([^\'"]+?)([\'"])/i';
			preg_match_all($regx, $jhtml, $mt, PREG_PATTERN_ORDER ); //0x5C === back slash

			$rimgs = array();

			if(isset($mt[5]))
			{
				$qsz=$mt[6][0];
				foreach($mt[5] as $i => $m)
				{
					$iname=base64_decode($m);
					if($iname!==false)
					{
						$full_iname = $WDIR_IMG.$iname;
						if(file_exists($full_iname))
						{
							$jhtml=str_replace($mt[0][$i],'src='.$qsz.$iname.$qsz,$jhtml);
							$rimgs []= $full_iname;
						}
						else if(file_exists($iname))
						{
							$jhtml=str_replace($mt[0][$i],'src='.$qsz.basename($iname).$qsz,$jhtml);
							$rimgs []= $iname;
						}
					}
				}
			}

			return($jhtml);
		}
		
		function sub_img_to_public($jhtml,$jid,$emaddr)
		{
			GLOBAL $S_URI;
			
			$regx='/src[ ]*?[=][ ]*?[\'"](.)*?(img\.x)[\?]([^\'"]+?)([\'"])/i';
			preg_match_all($regx, $jhtml, $mt, PREG_PATTERN_ORDER ); //0x5C === back slash
			
			if(isset($mt[3]))
			{
				foreach($mt[3] as $i => $m)
				{
					$img_file_name=$mt[2][$i];
					$jhtml=str_replace($mt[0][$i],'src="'.$S_URI.$img_file_name.'?'.$m."&ffg=".base64_encode($jid)."&tazx=".base64_encode($emaddr).'"',$jhtml);
				}
			}
			
			return($jhtml);
		}
		
		function sub_link_passes($sdb,$jid,$jhtml)
		{
			global $S_URI, $S_HOST, $NOK_CGI, $_EMSUB_ID, $_UNSUB_IID, $_MANAGE_SUB_IID, $_COMP_MAIL_TO_FRND, $FACEBOOK_SHARE_URL, $LINKEDIN_SHARE_URI, $TWITTER_SHARE_URI;

			$regx='/[<][a][ ].*?href[ ]*?[=][ ]*?[\'"]([^\'"]+?)[\'"][^>]*?[>]/i';
			preg_match_all($regx, $jhtml, $mt, PREG_PATTERN_ORDER );
		
			if(isset($mt[1]))
			{
				$l_uri = $S_URI.$NOK_CGI.'?e='.$_EMSUB_ID.'&j='.base64_encode($jid).'&s='.base64_encode($sdb).'&l=';
				foreach($mt[1] as $i => $l)
				{
					if($l!=$_UNSUB_IID && $l!=$_COMP_MAIL_TO_FRND && $l!=$_MANAGE_SUB_IID && (strpos($l,$FACEBOOK_SHARE_URL)===false) && (strpos($l,$LINKEDIN_SHARE_URI)===false) && (strpos($l,$TWITTER_SHARE_URI)===false) && (strpos($l,'mailto')!==0) && (strpos($l,'#')!==0) )
					{
						$ltol = (html_entity_decode($l));
                        $l_uri_full = $l_uri.urlencode($ltol);

                        $mtit = array();
                        preg_match_all( '/title[ ]*?[=][ ]*?[\'"]([^\'"]+?)[\'"]/i', $mt[0][$i], $mtit, PREG_PATTERN_ORDER );

                        if(isset($mtit[1][0]))
                            $l_uri_full .= '&t='.base64_encode($mtit[1][0]);

                        $link_full = str_replace($l,$l_uri_full,$mt[0][$i]);
                        $jhtml = str_replace($mt[0][$i],$link_full,$jhtml);
					}
				}
			}

			return($jhtml);
		}
		
	}
?>