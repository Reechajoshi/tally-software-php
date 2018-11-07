	// JS Helper for mgtech
///////////////////////////////////////////////////////////////////////////////////////////////////

CHelp = {
	
	_M_LINK_COL_SPEED: 5,
	_M_LINK_RED_START: 255,
	_M_LINK_GREEN_START: 255,
	_M_LINK_BLUE_START: 255,
	
	_M_LINK_RED_END: 26,
	_M_LINK_GREEN_END: 0,
	_M_LINK_BLUE_END: 105,
	
	// LINK ANIMATION STATE ////////////////////////////////////////////////////////////////////////////////////////////////
	_mLinkLastClick: null, //USED IN OVER EVENTS TO NOT TRIGGER ON ONE WHICH HAS BEEN CLICKED
	_mLinkChangeHandle: new Array(),
	_mLinkRedMap: new Array(),
	_mLinkGreenMap: new Array(),
	_mLinkBlueMap: new Array(),
	
	// CONTENT STATE
	_mContentMap: new Array(),
	
	setContent: function(cname,chtml)
	{		
		CHelp._mContentMap[cname] = chtml;
	},
	
	clickMe: function(lk)
	{
		var lname = lk.parentNode.getAttribute('name');		
		CHelp.displayContent(lname,lk);					
		return(false);
	},
	
	setContentTitle: function(lname)
	{
		if(CUtil.varok(_M_TITLE_LIST[lname]))
			CUi.setDocumentTitle(_M_TITLE_LIST[lname]);
	},
	
	isContentOK: function(lname)
	{
		return( CUtil.varok(CHelp._mContentMap[lname]) );
	},
	
	displayContent: function(lname,lk,lname_onfail)
	{
		if(CHelp.isContentOK(lname))
		{
			//alert(lname);
			var belm = CUi.doc.getElementById('basecon');
			if(belm)
			{
				belm.innerHTML = String(CHelp._mContentMap[lname]);
				CHelp.setContentTitle(lname);
				CHelp.setCurrentTextSize();
				CHelp._setAfterClick(lk,lname);		
				location.hash = "#" + lname; 
				return(true);				
			}
		}		
		else
		{
			CUi.showWorking();
			//alert(lname +"---"+lk+"---"+lname_onfail );
			CTalk.sendPost('index.x?c=1','con',lname, function(txt) {			
				CUi.hideWorking();
				if(txt)
				{
					CHelp.setContent(lname,txt);
					CHelp.displayContent(lname,lk);
				}
				else
				{
					if(lname_onfail)
						CHelp.displayContent(lname_onfail,lk);
					else
					{
						alert('sorry, unable to load requested content. We will redirect you to the home page.');
						location.replace(location.protocol + "//" + location.hostname + location.pathname);
					}
				}
			} );			
		}

		return(false);
	},
	
	
	
	_setAfterClick: function(lk, lname)
	{
		var lkp = false, lkpp = false, nol = false;
				
		lkpp = document.getElementById('topmparent');			
		
		if(CHelp._mLinkChangeHandle[lname])
			clearInterval(CHelp._mLinkChangeHandle[lname]);
				
		CUtil.applyToChildNodes(lkpp,'DIV', false, function(ob) {			
			if(ob.childNodes.length==2)					
			{
				if(ob.getAttribute('name') == lname)
				{
					ob.style.borderBottomColor = '#000';
					ob.childNodes[0].style.display='block';
					ob.childNodes[1].style.display='none';
				}
				else
				{
					ob.style.borderBottomColor = '#fff';
					ob.childNodes[0].style.display='none';
					ob.childNodes[1].style.display='block';
				}
			}
		} );
		
		CHelp._mLinkLastClick = lname;	
	},
	
	highLink: function(lk,onover)
	{
		// COL MAX:  1A 0 69( 26 0 105)
		var pelm = lk.parentNode, lname = pelm.getAttribute('name'), ired = 0, iblue = 0, igreen = 0, ireddiff = (CHelp._M_LINK_RED_START - CHelp._M_LINK_RED_END), 
		igreendiff = (CHelp._M_LINK_GREEN_START - CHelp._M_LINK_GREEN_END), ibluediff = (CHelp._M_LINK_BLUE_START - CHelp._M_LINK_BLUE_END);						
	
		if(CHelp._mLinkLastClick == lname)
			return ;
			
		//NOTE: ASSUMTION: since green is biggest diff, do it this way, need to change if start end change; this was not made auto blah!!!
		igreen = CHelp._M_LINK_COL_SPEED;
		ired = (ireddiff / igreendiff) * igreen;
		iblue = (ibluediff / igreendiff) * igreen;						
		
		if(!onover)
			{ ired *= -1; igreen *= -1; iblue *= -1; }
		
		var initMaps = function(beFirstTime)
		{
			if(beFirstTime) //IF THIS IS THE FIRST TIME, THEN INVERT THIS SENSE ...
				onover = !onover;
				
			CHelp._mLinkRedMap[lname] = ( (onover) ? (CHelp._M_LINK_RED_END) : (CHelp._M_LINK_RED_START) );
			CHelp._mLinkGreenMap[lname] = ( (onover) ? (CHelp._M_LINK_GREEN_END) : (CHelp._M_LINK_GREEN_START) );
			CHelp._mLinkBlueMap[lname] = ( (onover) ? (CHelp._M_LINK_BLUE_END) : (CHelp._M_LINK_BLUE_START) );
			
			pelm.style.borderBottomColor = CUtil.makeRealColourHex(CHelp._mLinkRedMap[lname],CHelp._mLinkGreenMap[lname],CHelp._mLinkBlueMap[lname]);
		}, 
		stopInterval = function()
		{
			initMaps();
			clearInterval(CHelp._mLinkChangeHandle[lname]);
		}
		
		if(!CUtil.varok(CHelp._mLinkRedMap[lname]))
			initMaps(true);
		
		if(CHelp._mLinkChangeHandle[lname])
			clearInterval(CHelp._mLinkChangeHandle[lname]);
		
		if(CHelp._mLinkGreenMap[lname] <= CHelp._M_LINK_GREEN_END)
			CHelp._mLinkGreenMap[lname] = CHelp._M_LINK_GREEN_END;
		else if(CHelp._mLinkGreenMap[lname] >= CHelp._M_LINK_GREEN_START)
			CHelp._mLinkGreenMap[lname] = CHelp._M_LINK_GREEN_START;
		
		CHelp._mLinkChangeHandle[lname] = setInterval( function() {					
			pelm.style.borderBottomColor = CUtil.makeRealColourHex(CHelp._mLinkRedMap[lname],CHelp._mLinkGreenMap[lname],CHelp._mLinkBlueMap[lname]);						
			
			CHelp._mLinkRedMap[lname] -= ired;
			CHelp._mLinkGreenMap[lname] -= igreen;
			CHelp._mLinkBlueMap[lname] -= iblue;
			
			//NOTE: ASSUMTION: This needs to move in accordance with the setting of igreen above, and changes based on largest diff.
			if(CHelp._mLinkGreenMap[lname] <= CHelp._M_LINK_GREEN_END)
				{ stopInterval(); }
			else if(CHelp._mLinkGreenMap[lname] >= CHelp._M_LINK_GREEN_START)
				{ stopInterval(); }			
		}, 20 );
	},
	
	setupResizeDIM: function(specElm)
	{	
		specElm.style.width = CHelp.getMainWidth() + 'px';
		specElm.style.paddingTop = "10px";
		specElm.style.zIndex=10;

		var belm = CUi.doc.getElementById('basecon');
		if(belm)
			belm.style.height = CHelp.getConHeight();
			
		CUi.hookResize( 'main', function(e) {
			specElm.style.width = CHelp.getMainWidth() + 'px';
			belm.style.height = CHelp.getConHeight() + 'px';
		} );
	},
	
	getMainWidth: function()
	{
		var clw = CUtil.getDim(true,50);		
		if(clw > 1000) return(1000); else return(clw);
		//else return( CUtil.max( 800, clw ) );
	},
	
	getConHeight: function()
	{
		return( CUtil.getDim(false,35) - _BODY_TOP_HEIGHT );
	},
	
	_M_MAX_TEXT_SIZE: (_CONTENT_DEF_TEXT_SIZE + 5),
	_M_MIN_TEXT_SIZE: (_CONTENT_DEF_TEXT_SIZE - 2),
	
	_mCurTextSize: _CONTENT_DEF_TEXT_SIZE,
	
	initTextSize: function()
	{
		CHelp.setTextSize(_CONTENT_DEF_TEXT_SIZE);
	},
	
	decTextSize: function()
	{
		if(CHelp._mCurTextSize > CHelp._M_MIN_TEXT_SIZE)
		{
			CHelp.setTextSize( --CHelp._mCurTextSize );
		}
	},
	
	incTextSize: function()
	{
		if(CHelp._mCurTextSize < CHelp._M_MAX_TEXT_SIZE)
		{
			CHelp._mCurTextSize += 2;
			CHelp.setTextSize( CHelp._mCurTextSize);
		}
	},
	
	setCurrentTextSize: function()
	{
		CHelp.setTextSize( CHelp._mCurTextSize );
	},
	
	setTextSize: function(ts)
	{
		var elm = CUi.doc.getElementById('basecon');
		if(elm)
		{
			CHelp._mCurTextSize = ts;
			
			CUtil.applyToChildNodes(elm, 'DIV', true, function(ob) {
				ob.style.fontSize = CHelp._mCurTextSize + 'pt';
			} );
		}
	},
	
	ID_POP: '_id_pop_img',
	
	pop_img: function(ob,iw,ih)
	{
		try {
			var isrc = ob.href,
				itxt = CUtil.getOBText(ob),
				html = "<div style='height:12'><u>" + itxt + "</u></div><br/><img src=\"" + isrc + "\" border=0 width=" + iw + " />";
			
			new CWin.win(CHelp.ID_POP, {
				autoOpen: true,
				withFrills: false,
				width: iw,			
				height: ih,
				capHeight: 28,
				modal: true,
				positionMid: true,
				closeOnEscape: true,
				html: html,
				htmlCenter: true,
				fadeShade: false
			} );
			
			CUi.setOMD(CHelp.ID_POP, function() {
				var wx = CWin.getMe(CHelp.ID_POP);
				if(wx)
				{
					wx.destroy();
					CUi.clearOMD(CHelp.ID_POP);
				}
			} );
		} catch(e) {}
	},
	
	_M_SERIAL_A: String.fromCharCode(15),
	_M_SERIAL_B:  String.fromCharCode(16),
	
	_submitInProg: false,
	_submitTO: null,
	
	submitForm: function(ob,subid,oktxt,allfields,getparams)
	{
		if(!CUtil.varok(allfields))
			allfields = true;
		
		if(!CHelp._submitInProg)
		{
			var dp = ob.parentNode,
				oldDP_HTML = dp.innerHTML,
				fp = CUtil.getParentByName(dp,"iqt"),
				procIX = -1,
				fnProc = function() {				
					var txt = "Sending";
					if(++procIX>=4) procIX = -1;
					txt += CUtil.strRepeat('.',procIX);
					dp.innerHTML = txt;
				};
				
			if(fp)
			{
				var dat = new Array(),
					bcont = true;
					
				CUtil.applyToMultiChildNodes(fp, new Array('INPUT','TEXTAREA','SELECT'), true, function(elm) {
					if(bcont)
					{
						if(allfields && elm.value.length<=0)
						{
							alert("Sorry, please fill in all fields before you click send.");
							bcont=false;
						}
						else
							dat.push(elm.name + CHelp._M_SERIAL_B + elm.value);
					}
				} );
				
				if(bcont)
				{
					CTalk.sendPost( 'store.x' + ( (CUtil.varok(getparams)) ? ( '?' + getparams ) : ( '' ) ) , subid, dat.join(CHelp._M_SERIAL_A), function(resp){
						CHelp._submitInProg = false;
						clearInterval(CHelp._submitTO);
						
						if(resp=="OK")
						{
							dp.innerHTML = oktxt; //"Thank you, we will be in touch shortly.";
						}
						else
						{
							dp.innerHTML = oldDP_HTML;
							alert("Sorry something went wrong; please check your internet connection, and try again.");
						}
					} );
					
					CHelp._submitInProg = true;
					
					fnProc();
					CHelp._submitTO = setInterval( fnProc, 250 );
				}
			}
		}
	},
	
	loginForm: function(ob)
	{
		if(!CHelp._submitInProg)
		{
			var dp = ob.parentNode,
				oldDP_HTML = dp.innerHTML,
				fp = CUtil.getParentByName(dp,"login_form"),
				procIX = -1,
				fnProc = function() {				
					var txt = "Sending credentials";
					if(++procIX>=4) procIX = -1;
					txt += CUtil.strRepeat('.',procIX);
					dp.innerHTML = txt;
				};
				
			if(fp)
			{
				var dat = new Array(),
					bcont = true;
					
				CUtil.applyToMultiChildNodes(fp, new Array('INPUT'), true, function(elm) {
					if(bcont)
					{
						if(elm.value.length<=0)
						{
							alert("Sorry, please fill in login details first.");
							bcont=false;
						}
						else
							dat.push(elm.name + CHelp._M_SERIAL_B + elm.value);
					}
				} );
				
				if(bcont)
				{
					CTalk.sendPost( 'store.x' , 'req_login', dat.join(CHelp._M_SERIAL_A), function(resp)  { //STORE.X IS A MISTA-NOMA; FOR REQUESTS
						CHelp._submitInProg = false;
						clearInterval(CHelp._submitTO);
						
						if(resp.substr(0,2) == "OK")
						{
							top.location.replace(resp.substr(2));
						}
						else
						{
							if(resp.substr(0,3)=="NOK")
								resp = resp.substr(3);
								
							dp.innerHTML = oldDP_HTML;
							
							alert(resp);
						}						
					} );
					
					CHelp._submitInProg = true;
					
					fnProc();
					CHelp._submitTO = setInterval( fnProc, 250 );
				}
			}
		}
	},
	
	//NOTE: UNUSED: AND UNTESTED
	displayContentRaw: function(ob,sid)
	{
		CUi.showWorking();
		var fp = CUtil.getParentByName(ob,"iqt");
			
		if(fp)
		{
			var dat = new Array();
			
			CUtil.applyToMultiChildNodes(fp, new Array('INPUT','TEXTAREA','SELECT'), true, function(elm) {
				if(elm.value.length>0)
					dat.push(elm.name + CHelp._M_SERIAL_B + elm.value);
			} );
			
			CTalk.sendPost( 'store.x' , sid, dat.join(CHelp._M_SERIAL_A), function(resp)  {
				CUi.hideWorking();
				var belm = CUi.doc.getElementById('basecon');
				if(belm)
				{
					belm.innerHTML = resp;
				}
				return(true);				
			} );
		}
	},
	
	toggleDisp: function(txt,combo)
	{
		selected = combo.value;
		if(selected == 'other')
		{
			document.getElementById(txt).style.display = 'block';
			document.getElementById(txt).value = "";
		}	
		else
			document.getElementById(txt).style.display = 'none';
	}
	
};
