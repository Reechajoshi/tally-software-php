<?php
	// Database variable declaration...
	$_db = new dbc('mgtally','mgtally','mgtally');
	
	if( isset($_GET['fl']) )
		$tabname = $_GET['fl'];
		
	$cid = false;	
	
	// Collecting data into variables after submit...
	if( isset($_GET['flfl']))
	{
		$name = $_POST['name'];
		$addr = $_POST['addr'];
		$pcode = $_POST['pcode'];
		$city = $_POST['city'];
		$region = $_POST['region'];
		$tel = $_POST['tel'];
		$fax = $_POST['fax'];
		$email = $_POST['email'];
		$bname = $_POST['bname'];
		$branch = $_POST['branch'];
		$acnum = $_POST['acnum'];
		$ifsc = $_POST['ifsc'];
		$transcurr = $_POST['transcurr'];
		if( $_POST['business'] == 'other' )
		{
			$otherBus = 1;
			$business = $_POST['txtbusiness'];
		}
		else	
		{
			$otherBus = 0;
			$business = $_POST['business'];
		}
		if( $_POST['items'] == 'other' )
		{
			$otherItem = 1;
			$items = $_POST['txtitem'];
		}
		else
		{
			$otherItem = 0;	
			$items = $_POST['items'];
		}
		$panno = $_POST['panno'];
		$pfno = $_POST['pfno'];
		$wctno = $_POST['wctno'];
		$esicno = $_POST['esicno'];
		$vatno = $_POST['vatno'];
		$csaltaxno = $_POST['csaltaxno'];
		$staxno = $_POST['staxno'];
		
		if( isset($_GET['save']) )
			$cid = substr(md5($panno),0,10);
		else	
			$cid = $_POST['cid'];
		
		$q1 = "insert into client values ('$cid','$name','$addr','$pcode','$city','$region','$tel','$fax','$email','$bname','$branch','$acnum','$ifsc','$transcurr','$business',$otherBus,'$items',$otherItem,'$panno','$pfno','$wctno','$esicno','$vatno','$csaltaxno','$staxno') ";
		$q2 = "on duplicate key update name='$name',addr='$addr',pcode='$pcode',city='$city',region='$region',tel='$tel',fax='$fax',email='$email',bname='$bname',branch='$branch',acnum='$acnum',ifsc='$ifsc',transcurr='$transcurr',business='$business',otherBus=$otherBus,items='$items',otherItem=$otherItem,panno='$panno',pfno='$pfno',wctno='$wctno',esicno='$esicno',vatno='$vatno',csaltaxno='$csaltaxno',staxno='$staxno' ; ";
		$insQuery = $q1.$q2;
		//echo($insQuery);	// For debugging whenever required.
		if( $_db->db_query($insQuery) )
			echo("Saved successfully...");
		else
			echo("Error while saving...");
	}
	else if( isset($_GET['cid']) )
	{
		$cid = $_GET['cid'];
		
		$selQuery = " select * from client where cid='$cid'; ";
		$res = $_db->db_query( $selQuery );
		if( $row = $_db->db_result($res) )
		{
			$name = $row['name'];
			$addr = $row['addr'];
			$pcode = $row['pcode'];
			$city = $row['city'];
			$region = $row['region'];
			$tel = $row['tel'];
			$fax = $row['fax'];
			$email = $row['email'];
			$bname = $row['bname'];
			$branch = $row['branch'];
			$acnum = $row['acnum'];
			$ifsc = $row['ifsc'];
			$transcurr = $row['transcurr'];
			$business = $row['business'];
			$otherBus = $row['otherBus'];
			$items = $row['items'];
			$otherItem = $row['otherItem'];
			$panno = $row['panno'];
			$pfno = $row['pfno'];
			$wctno = $row['wctno'];
			$esicno = $row['esicno'];
			$vatno = $row['vatno'];
			$csaltaxno = $row['csaltaxno'];
			$staxno = $row['staxno'];
		}
	}
	
	// Array to store different currencies...
	$curr = array("INR","USD");

	echo(" Welcome to create new clients page... ");
	
	echo('
			<br/>
			<div class="gc wtxt box-complete light-shade" style="width:75%;">
				
				<div class="gc wtxt" >Please fill out the form below and we\'ll send you a welcome e-mail with your username & password.</div>
		');	
		
	echo('		<form method="post" action="index.x?fl='.$tabname.'&flfl&'.(($cid == false)?("save"):("")).'">
					<table>
		');
	echo('				<tr>
							<td colspan=3><input type=hidden name=cid value="'.$cid.'"><hr/></td>
						</tr>
		');
	echo('	
						<tr>
							<td> A. </td>
							<td> Name : </td>
							<td> <input style=width:400px type=text name=name value="'.$name.'"> </td>
						</tr>
							
		');
	echo('				<tr>
							<td colspan=3><hr/></td>
						</tr>
		');	
	echo('
						<tr>
							<td> B. </td>
							<td> Address : </td>
							<td> <textarea rows=2 style=width:400px name=addr>'.$addr.'</textarea> </td>
						</tr>
		');
		
	echo('				<tr>
							<td>  </td>
							<td> Postal Code : </td>
							<td> <input style=width:400px type=text name=pcode value="'.$pcode.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> City : </td>
							<td> <input style=width:400px type=text name=city value="'.$city.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Region(State/Union Territory) : </td>
							<td> <input style=width:400px type=text name=region value="'.$region.'"> </td>
						</tr>
		');
		
	echo('				<tr>
							<td>  </td>
							<td> Telephone : </td>
							<td> <input style=width:400px type=text name=tel value="'.$tel.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Fax : </td>
							<td> <input style=width:400px type=text name=fax value="'.$fax.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Email : </td>
							<td> <input style=width:400px type=text name=email value="'.$email.'"> </td>
						</tr>
		');
	echo('				<tr>
							<td colspan=3><hr/></td>
						</tr>
		');
	echo('				<tr>
							<td> C. </td>
							<td> Payment Transaction : </td>
							<td> (Enclose a cancelled Cheque/ Letter from your banker) </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Bank Name : </td>
							<td> <input style=width:400px type=text name=bname value="'.$bname.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Branch : </td>
							<td> <input style=width:400px type=text name=branch value="'.$branch.'"> </td>
						</tr>
		');
	echo('				<tr>
							<td>  </td>
							<td> Bank A/C : </td>
							<td> <input style=width:400px type=text name=acnum value="'.$acnum.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> IFSC No : </td>
							<td> <input style=width:400px type=text name=ifsc value="'.$ifsc.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Transaction Currency : </td>
							<td> '.$hlp->getComboTransCurr($curr,$transcurr).' </td>
						</tr>
		');
	echo('				<tr>
							<td colspan=3><hr/></td>
						</tr>
		');
	echo('				<tr>
							<td> D. </td>
							<td> Nature of Business : </td>
							<td> '.(($otherBus == 1)?($hlp->getComboBusinessNature("other")):($hlp->getComboBusinessNature($business))).' 
								<input id=txtbus style="width:200px;display:'.(($otherBus == 1)?("block"):("none")).'" type=text name=txtbusiness value="'.$business.'"> 
							</td>
							
						</tr>
		');
	echo('				<tr>
							<td colspan=3><hr/></td>
						</tr>
		');	
	echo('				<tr>
							<td> E. </td>
							<td> Nature of Items : </td>
							<td> '.(($otherItem == 1)?($hlp->getComboItemsNature("other")):($hlp->getComboItemsNature($items))).' 
								<input id=txtitem style="width:200px;display:'.(($otherItem == 1)?("block"):("none")).'" type=text name=txtitem value="'.$items.'"> 
							</td>
						</tr>
		');
	echo('				<tr>
							<td colspan=3><hr/></td>
						</tr>
		');	
	echo('				<tr>
							<td> F. </td>
							<td> Registration Details : </td>
							<td> (Copies of Relevant Registration Certificates to be attached) </td>
						</tr>
						<tr>
							<td>  </td>
							<td> PAN No. : </td>
							<td> <input style=width:400px type=text name=panno value="'.$panno.'"> </td>
						</tr>
		');
	echo('				<tr>
							<td>  </td>
							<td> P.F. Regn. No. : </td>
							<td> <input style=width:400px type=text name=pfno value="'.$pfno.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> WCT Regn. No. : </td>
							<td> <input style=width:400px type=text name=wctno value="'.$wctno.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> ESIC Regn. No. : </td>
							<td> <input style=width:400px type=text name=esicno value="'.$esicno.'"> </td>
						</tr>
		');	
	echo('				<tr>
							<td>  </td>
							<td> VAT/ST Regn. No. : </td>
							<td> <input style=width:400px type=text name=vatno value="'.$vatno.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Central Sales Tax No./date : </td>
							<td> <input style=width:400px type=text name=csaltaxno value="'.$csaltaxno.'"> </td>
						</tr>
						<tr>
							<td>  </td>
							<td> Service Tax Regn No./date : </td>
							<td> <input style=width:400px type=text name=staxno value="'.$staxno.'"> </td>
						</tr>
		');	
	echo('				<tr>
							<td colspan=3><hr/></td>
						</tr>
		');
	echo('				<tr>
							<td colspan=3 align=center> <button type=submit>'.(($cid !== false)?("Update"):("Submit")).'</button> </td>
						</tr>
		');
	echo('
					</table>
				</form>
			</div>
		');
	
	
?>