CLoad = {

	init: function()
	{
		CLoad._startup();
		
		/*
		CLoad.showProg();
		
		CTalk.sendSimplePost( 'jsinc.x', function(jssrc) {
			
			var screlm = document.createElement('script');			
				head = document.getElementsByTagName('head')[0];
				
			screlm.setAttribute('type',"text/javascript");
			screlm.text = jssrc; 
			//srctxt = document.createTextNode(jssrc), srelm.appendChild(srctxt);
			
		 	head.appendChild(screlm);
		
		for( var m in _M_MENU_LIST)
		{			
			CTalk.sendPost('index.x?c=1',_M_MENU_LIST[m],"1", function(txt, lname) {				
				CHelp.setContent(lname,txt);
			} );
		}
		
		if(directOn)
		{			
			CLoad.fadeProg(0);
			CLoad._startup();
		}
		else
			CLoad.startup();
		*/
	},
	
	/*
	startup: function()
	{
		CTalk.sendSimplePost('index.x?m=1', function(html) {
			var elm = document.createElement('div');			
			
			elm.style.position = "absolute"; elm.style.zIndex=50;			
			elm.style.left = "0px"; elm.style.top = "0px";	
			elm.style.width = "100%"; elm.style.height = "100%";
						
			elm.innerHTML = html;
			
			document.body.appendChild(elm);
			
			CLoad._startup();
			CLoad.fadeProg(0);
		} );
	},
	
	*/
	
	_startup: function()
	{		
		CUi.init(document);	 //INIT UI WHICH WAS LOADED ON LAST ASYNC
		
		CLoad._M_W_SPEC_ID = _BODY_WSPEC_ID;			
		
		CUtil.capture( CLoad._M_W_SPEC_ID, function(elm) {		
			CHelp.setupResizeDIM(elm);
			
			if(location.hash.length > 1)	
			{
				//alert(location.hash.substr(1)+"---"+_MENU_START);
				CHelp.displayContent( location.hash.substr(1), null, _MENU_START );
			}
			else
				CHelp.displayContent( _MENU_START );						
		} );
		
		var bodyall = CUi.doc.getElementById('bodyall');
		if(bodyall) bodyall.style.display='block';
	}
	
	/*
	_mLastOpacity: 1, //START OFF AS TOTALY OPACHE
	
	showProg: function(txt, op, doOnTop)
	{
		if(op)
			CLoad._mLastOpacity = parseFloat(op);
				
		if(!txt) txt = "Loading, please wait...";
		
		var belm = document.getElementById('prog_parent'),
			onDOM = false;
			
		if(!belm)
		{
			belm = document.createElement('div');
			belm.setAttribute('id','prog_parent');
			belm.style.position = "absolute";
			belm.style.left = "0px";
			belm.style.top = "0px";	
			belm.style.width = "100%";
			belm.style.height = "100%";
			belm.style.zIndex=100;
		}
		else
		{
			belm.style.display = 'block';
			onDOM = true;
		}
		
		var ophtml = "<div id=prog style='background-color:#fff; opacity: " + CLoad._mLastOpacity + "; filter:Alpha(Opacity=" + (CLoad._mLastOpacity * 100) + "); position:absolute;z-index:100;left:0;top:0;width:100%;height:100%;' >",
		inhtml = "<table border=0 width=100% height=50%><tr><td width=40% align=right valign=middle style='padding-right:10px'><img src='images/prog.gif' border=0 /></td><td align=left valign=middle style='padding-left:10px'><span class=txt>" + txt + "</span></td></tr></table>",
		finalhtml = '';
		
		if(doOnTop)
			finalhtml = ophtml + "</div><div style='position:absolute;z-index:101;left:0;top:0;width:100%;height:100%;'>" + inhtml + "</div>";
		else
			finalhtml = ophtml + inhtml + "</div>";
		
		belm.innerHTML = finalhtml;
		
		if(!onDOM)
			document.body.appendChild(belm);
	},

	fadeProg: function(fdTo)
	{
		if(CLoad._progIHandle)
			clearInterval(CLoad._progIHandle);
			
		// OUT if true = fade to op 0 that is transporent
		var elm = document.getElementById('prog'),
			sob = CUi.getAgentVal( (CLoad._mLastOpacity * 100) , CLoad._mLastOpacity), 
			sob_end = CUi.getAgentVal( (fdTo * 100) ,fdTo), sob_inc = ( (CLoad._mLastOpacity > fdTo)?(-2):(2) ) * CUi.getAgentVal(2,0.02);
		
		if(CUi._isIE)
			elm.style.filter='progid:DXImageTransform.Microsoft.Alpha(Opacity='+sob+')';			
		else
			elm.style.opacity = sob; 
		
		CLoad._progIHandle = setInterval( function() {							
			sob += sob_inc;
			if(((sob_inc<0)?(sob<=sob_end):(sob>=sob_end)))
			{ 
				if(fdTo==0)
				{	// ONLY IF WE ARE FAIDING TOTALLY OUT DO WE PROPERLY HIDE THIS
					var progp = document.getElementById('prog_parent');
					progp.style.display='none';					
				}
				
				CLoad._mLastOpacity = fdTo;
				
				clearInterval(CLoad._progIHandle);
				CLoad._progIHandle = false;
			}
			else
			{ 
				if(CUi._isIE)
					elm.style.filter='progid:DXImageTransform.Microsoft.Alpha(Opacity='+sob+')';
				else
					elm.style.opacity = sob;
				
				CLoad._mLastOpacity = sob;				
			}
		}, 20 );
	}
	*/
};