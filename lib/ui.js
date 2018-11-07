CUi = {
	doc: false,
	bod: false,
	
	_mouseBut: 0, _mouseX: 0, _mouseY: 0,
		
	_userEventOSS: function() { return(true); },
	_forceNoSelect: false,
	_bodMouseIsSet: false, //used to indicate some callback has  set the mouse, so other actions which could should not (ONUS is on callback to check this as needed)
	
	_M_USER_EVENTS_OMM: new Array(),
	_M_USER_EVENTS_OMD: new Array(),
	_M_USER_EVENTS_OMU: new Array(),
	
	_M_ACCEL_SHIFT_DEF: new Array(),
	_M_RETR_IMG_STORE: new Array(),
	
	init: function(doc)
	{
		CUi.doc = doc;
		CUi.bod = CUi.doc.body;			
		
		CUi.browserDetect();
				
		CUtil.initCommonGround();		
		
		doc.onkeydown = CUi.keyPress;
		doc.onmousemove = CUi.mouseMove;
		doc.onmousedown = CUi.mouseDown;
		doc.onmouseup = CUi.mouseUp;
		
		if(typeof(CUi.doc.onselectstart)!='undefined')
			{ doc.onselectstart = CUi.onSelectStart; }
		
		window.onresize = CUi.onResize;
		
		cust_addEvent(window,'scroll', CUi.handleScrollMain);		
	},

	_M_AGENT_FF: "Firefox",
	_M_AGENT_CH: "Chrome",
	_M_AGENT_IE: "MSIE",
	_M_AGENT_SF: "Safari",
	_M_AGENT_SF_VVDET: "Version",
	
	browserDetect: function()
	{
		CUi._isCH = false; CUi._isIE = false; CUi._isFF = false;  CUi._isSF = false;
		
		if( ( chi = navigator.userAgent.indexOf(CUi._M_AGENT_CH) ) !=-1 )
		{
			var spi = navigator.userAgent.indexOf( " " , chi ),
				chver = navigator.userAgent.substring(CUi._M_AGENT_CH.length + chi + 1, spi).split('.');
				
			if(chver.length>=1)
				CUi._CH_Version = chver[0];
			
			CUi._isCH = true;
		}
		else if ( ( iei = navigator.userAgent.indexOf(CUi._M_AGENT_IE) ) !=-1)
		{
			var spi1 = navigator.userAgent.indexOf( " " , iei ),
				spi2 = navigator.userAgent.indexOf( ";" , spi1 ),
				iever = navigator.userAgent.substring(spi1+1, spi2).split('.');
				
			if(iever.length>=1)
				CUi._IE_Version = iever[0];
			
			CUi._isIE = true;
		}
		else if ( ( ffi = navigator.userAgent.indexOf(CUi._M_AGENT_FF) ) !=-1 )
		{
			var spi = navigator.userAgent.indexOf(" ",ffi),
				ffver = navigator.userAgent.substring(CUi._M_AGENT_FF.length + ffi + 1, spi).split('.');
				
			if(ffver.length>=1)
				CUi._FF_Version = ffver[0];
				
			CUi._isFF = true;			
		}
		else if( navigator.userAgent.indexOf(CUi._M_AGENT_SF) !=-1 )
		{
			var vi = navigator.userAgent.indexOf( CUi._M_AGENT_SF_VVDET ),
				spi = navigator.userAgent.indexOf( " " , vi ),
				sfver = navigator.userAgent.substring(vi + CUi._M_AGENT_SF_VVDET.length + 1, spi).split('.');
				
			if(sfver.length >= 1)
				CUi._SF_Version = sfver[0];
			
			CUi._isSF = true;			
		}
		else
		{
		        // TODO: Prevent web app from starting here as nessasery
		        // alert("ERROR");
		}
	},
	
	getAgentVal: function(ie,ff,ch)
	{		
		return( ( ( CUi._isIE )?( ie ):( ( CUi._isFF )?( ff ):( ((ch)?(ch):(ff)) ) ) ) );		
	},

	_M_UI_SCROLL_MAPS: new Array(),
	
	hookScroll: function(sid,cb)
	{
		CUi._M_UI_SCROLL_MAPS[sid] = cb;
	},
	
	destroyScroll_Hook: function(sid)
	{
		CUi._M_UI_SCROLL_MAPS = CUtil.removeNamedIndex(CUi._M_UI_SCROLL_MAPS,sid);
	},
	
	handleScrollMain: function()
	{
		for(var i in CUi._M_UI_SCROLL_MAPS)
		{
			if(typeof(CUi._M_UI_SCROLL_MAPS[i])=='function')
				CUi._M_UI_SCROLL_MAPS[i]();
		}		
	},
				
	setDocumentTitle: function(docTitle)
	{
		CUi.doc.title = docTitle;
	},
	
	openWin: function(wid,wprops,docTitle,bodyHTML)
	{ 	
		var w = window.open('about:blank',wid,wprops);		
		if(w)
		{
			w.document.open();
			w.document.write(CUtil.getNewWinHTML(docTitle,bodyHTML));
			w.document.close();
		}
		return(w);		
	},
	
	setWinCloseCB: function(cb)
	{		
		cust_addEvent(window,'unload',function() { cb(this); } );
	},

	setWinQueryCloseMsg: function(msg)
	{		
		cust_addEvent(window,'beforeunload',function() { return(msg); } );
	},

	setUserKeyHandlers: function(ukd)
	{
		for(var k in ukd)
			CUi._M_ACCEL_SHIFT_DEF[k] = (ukd[k]);
	},
                                                                                     
	getPushUpHTML: function(ihtml)
	{
		return("<span style=\"position:relative;top:-" + CUi.getAgentVal('2px','1px') + ";\">"+ihtml+"</span>");
	},

	getPushUpTextNode: function(txt) //todo: fix grid resizeing to be able to handle this.
	{
		return("<div style=\"position:relative;top:-" + CUi.getAgentVal('2px','1px') + ";\">"+txt+"</div>");
	},

	clearAll: function()
	{ 
		CUi.doc.body.innerHTML="";
	},
	
	setBodyAll: function(html)
	{
		CUi.bod.innerHTML = (html);
	},
		
	_M_KEYS_MAP: new Array(),
	
	hookKeyCode: function(kcode, cid, cb)
	{
		if(!CUi._M_KEYS_MAP[kcode])
			CUi._M_KEYS_MAP[kcode] = new Array();
			
		CUi._M_KEYS_MAP[kcode].push( { id: cid, cb: cb } );
	},

	destroyKeyCode_Hook: function(kcode, cid)
	{
		if(CUi._M_KEYS_MAP[kcode])
		{
			for(var i in CUi._M_KEYS_MAP[kcode])
			{
				if(CUi._M_KEYS_MAP[kcode][i].id == cid)
				{
					CUi._M_KEYS_MAP[kcode].splice(i,1);
					break;
				}
			}
		}
		
		if(CUi._M_KEYS_MAP[kcode].length == 0)
			CUi._M_KEYS_MAP = CUtil.removeNamedIndex(CUi._M_KEYS_MAP , kcode);		
	},
	
	keyPress: function(e)
	{
		e = CUtil.ensureRealEvent(e);
		if(e.shiftKey)
		{
			if(e.keyCode > 31 && e.keyCode < 250) //space plus printable keys approx
			{
				for(var kc in CUi._M_ACCEL_SHIFT_DEF)
				{			
					if(String.fromCharCode(e.keyCode).toUpperCase().charAt(0)==kc.toUpperCase().charAt(0))
						{ CUi.safeRun(CUi._M_ACCEL_SHIFT_DEF[kc]); }
				}
			}
		}
		else if(!e.ctrlKey && !e.altKey) 
		{
			//TODO: special meaning of keys hardwired			
		}

		if( (CUi._M_KEYS_MAP[e.keyCode]) && CUi._M_KEYS_MAP[e.keyCode].length>0 )
		{
			try
			{ 
				var kc = e.keyCode;		
				CUi._M_KEYS_MAP[ kc ][ CUi._M_KEYS_MAP[kc].length - 1 ].cb( e );
			} 
			catch(e) {}
		}
	},

	setMouseXY: function(e)
	{
		try
		{
			if (CUi.doc.all)
			{
				CUi._mouseX = event.clientX;
				CUi._mouseY = event.clientY;
			}
			else
			{
				CUi._mouseX = e.pageX - CUi.bod.scrollLeft;
				CUi._mouseY = e.pageY - CUi.bod.scrollTop;
			}
		} catch(err) {}
		
		if (CUi._mouseX < 0) CUi._mouseX = 0;
		if (CUi._mouseY < 0) CUi._mouseY = 0;
	},

	//but: 1:2:3=l:m:r & ie= 1:4:2 l:m:r		
	isMMButtonReleased: function(e) //only works in IE (FF doesn't give us this info)
	{
		return((CUi._isIE)&&(e.button==0));
	},

	eventRelatedElm: function(e)
	{		
		return(e.relatedTarget || ((e.type=='mouseover')?(e.fromElement):(e.toElement)));		
	},
	
	eventTarget: function(e)
	{
		return(e.target || e.srcElement);
	},
	
	// Did a click occour on any element which is a child of element named NM in the object hyrachy
	// Even if this is true, but an anchor exists in the hyrachy, ignore that click.
	isClickInPureNest_Ignore: function(e,nm,ignoreTag)
	{
		if(CUi.isLeftClick(e))
		{
			var runCheck = function(ob,nm)
			{
				try
				{
					if(ob && ob.tagName != ignoreTag)
					{
						if(ob.getAttribute && ob.getAttribute("name")==nm)
							return(ob);
						else
							return(runCheck(ob.parentNode,nm));
					}
				}
				catch(e) {}
				
				return(false);
			}
			
			return(runCheck(CUi.eventTarget(e),nm));
		}
		else
			return(false);
	},
	
	isClickInPureNest: function(e,nm)
	{
		if(CUi.isLeftClick(e))
		{
			var runCheck = function(ob,nm)
			{
				if(ob)
				{					
					if(ob.getAttribute && ob.getAttribute("name")==nm)
						return(ob);
					else
						return(runCheck(ob.parentNode,nm));
				}
				
				return(false);
			}
			
			return(runCheck(CUi.eventTarget(e),nm));
		}
		else
			return(false);
	},
	
	isHoverOver: function(e,nm)
	{
		var ob = CUi.eventTarget(e);
		
		while(ob)
		{
			if(ob.getAttribute && (ob.getAttribute("name") == nm))
				return(ob);
			else
				ob = ob.parentNode;
		}
		
		return(null);
	},
	
	isLeftClick: function(e)
	{
		return(e.button==CUi.getAgentVal(1,0))
	},
	
	isLeftClick_Ignore: function(e,ignoreTag)
	{
		if(CUi.isLeftClick(e))
		{
			var o = CUi.eventTarget(e);
			while(o)
			{
				if(o.tagName == ignoreTag)
					return(false);
				else
					o = o.parentNode;
			}

			return(true);
		}
		else
			return(false);
	},
	
	setMouseCB: function(cbar, fid, cb)
	{
		var ncbar = new Array();
		
		ncbar[fid] = cb;
		for(var ci in cbar)
			{ ncbar[ci] = cbar[ci]; }
		
		return(ncbar);
	},
	
	setOnMouse: function(fid,omm,omd,omu)
	{
		CUi.setOMM(fid,omm);
		CUi.setOMD(fid,omd);
		CUi.setOMU(fid,omu);	
	},
	
	setOMM: function(fid,cb) { CUi._M_USER_EVENTS_OMM = CUi.setMouseCB(CUi._M_USER_EVENTS_OMM, fid, cb); },
	setOMD: function(fid,cb) { CUi._M_USER_EVENTS_OMD = CUi.setMouseCB(CUi._M_USER_EVENTS_OMD, fid, cb); }, 
	setOMU: function(fid,cb) { CUi._M_USER_EVENTS_OMU = CUi.setMouseCB(CUi._M_USER_EVENTS_OMU, fid, cb); },
	
	clearOMM: function(fid) { CUi._M_USER_EVENTS_OMM = CUtil.removeNamedIndex(CUi._M_USER_EVENTS_OMM, fid); },
	clearOMD: function(fid) { CUi._M_USER_EVENTS_OMD = CUtil.removeNamedIndex(CUi._M_USER_EVENTS_OMD, fid); },
	clearOMU: function(fid) { CUi._M_USER_EVENTS_OMU = CUtil.removeNamedIndex(CUi._M_USER_EVENTS_OMU, fid); },
	
	clearOnMouse: function(fid)
	{
		CUi.clearOMM(fid);
		CUi.clearOMD(fid);
		CUi.clearOMU(fid);
	},
	
	mouseMove: function(e)
	{
		e = CUtil.ensureRealEvent(e);
		CUi.setMouseXY(e);
		CUtil.multiCallBack(CUi._M_USER_EVENTS_OMM,e);
	},

	mouseUp: function(e)
	{
		e = CUtil.ensureRealEvent(e);
		CUtil.multiCallBack(CUi._M_USER_EVENTS_OMU,e);		
	},

	mouseDown: function(e)
	{
		e = CUtil.ensureRealEvent(e);		
		CUtil.multiCallBack(CUi._M_USER_EVENTS_OMD,e);
		e.cancelBubble=true;
	},

	setNoSelectProp: function(prop)
	{
		CUi._forceNoSelect = prop;
	},
	
	onSelectStart: function()
	{						
		var e = window.event;
		var t = CUi.eventTarget(e);
		
		if(CUi._forceNoSelect)
			return(false);
		else
		{
			var ret = CUi._userEventOSS(); //should run either way
		
			if(CUtil.isNoSelection(t))
				return(false);
			else
				return(ret);
		}
	},

	_M_RESIZE_MAPS: new Array(),
	
	hookResize: function(cbid,cb)
	{
		CUi._M_RESIZE_MAPS[cbid] = cb;
	},
	
	destroyResize_Hook: function(cbid)
	{
		CUi._M_RESIZE_MAPS = CUtil.removeNamedIndex(CUi._M_RESIZE_MAPS,cbid);		
	},
	
	onResize: function(e)
	{
		e = CUtil.ensureRealEvent(e);
		
		for(var i in CUi._M_RESIZE_MAPS)
		{
			if(typeof(CUi._M_RESIZE_MAPS[i])=='function')
				CUi._M_RESIZE_MAPS[i](e);
		}
	},
	
	getJSAnchorHTML: function(onc,inhtml)
	{
		return("<a href=# onMouseDown='"+onc+"' onClick='return(false);'>" + inhtml + "</a>");
	},

	getAllCenterHTML: function(ihtml)
	{
		return("<table border=0 cellspacing=0 cellpadding=0 width=100% height=100%><tr><td align=center valign=middle>" + ihtml + "</td></tr></table>");
	},
	
	createElm: function(el,elid)
	{
		var elm = CUi.doc.createElement(el);
		if((elid) && elid!="")
			elm.setAttribute("id",elid);
		return(elm);
	},
		
	_M_WORKING_EID: '_working',
	
	showWorking: function()
	{
		var el = CUi.createElm('div',CUi._M_WORKING_EID);
		
		el.innerHTML = "downloading,&#160;please&#160;wait...";
		el.style.backgroundColor = '#940C12';
		el.style.color='#fff';
		el.style.padding = '4px';
		
		el.style.position = 'absolute';
		el.style.left = -300;
		el.style.top = -300;
		
		CUi.bod.appendChild(el);
		
		CUtil.capture( CUi._M_WORKING_EID, function(el) {
			el.style.left = (CUtil.getDim(true, 0) / 2) - (el.offsetWidth / 2);
			el.style.top = 0;
		} );
	},
	
	hideWorking: function()
	{
		var el = CUi.doc.getElementById(CUi._M_WORKING_EID);
		
		try {
		if(el)
			CUi.bod.removeChild(el);
		} catch(e) { alert(e.message); }
	},
	
	doWorkingWithCursor: function(cb)
	{
		CUi.setFullCursor('wait');
		CUtil.spawnx( function() {
			cb();
			CUi.setFullCursor('default');
		} );
	},
	
	setFullCursor: function(cur,ob)
	{		
		CUi.bod.style.cursor = cur;
		if(ob)
			ob.style.cursor = cur;
		
		CUi._bodMouseIsSet = (cur!='default');
	},
	
	showCenterHTML: function(html)
	{
		var html ="<table border=0 cellpadding=0 cellspacing=0 width=100% height=80%><tr><td align=center valign=middle>" + html + "</td></tr></table>";
		CUi.setBodyAll(html);		
	},

	boxSplit: function(rows,cols,inhtml,tblprops,cellprops,bnolines)
	{
		if(!tblprops) tblprops="border=0 width=100% cellpadding=5px";
		if(!cellprops) cellprops=new Array();
		
		var cn = ( (bnolines) ? ('') : ( ((rows>cols)?("box-v"):("box-h")) )),
			html = "<table " + tblprops + " class="+cn+" >",
			ih = 0;
		
		for(ir=0;ir<rows;ir++)
		{
			html += "<tr>";
			for(ic=0;ic<cols;ic++)
			{
				if( (cellprops[ih]) && cellprops[ih].length>0) 
					prop=cellprops[ih]; 
				else 
					prop="align=center valign=top";
					
				html += "<td " + prop + " >" + inhtml[ih++] + "</td>";										
			}
			
			html += "</tr>";
		}
		
		html += "</table>";	
		return(html);
	},

	getImgHTML: function(iname,iattrib)
	{
		if(!iattrib)
			iattrib = '';
			
		return("<img src='"+CUi.getImgSrc(iname)+"' border=0 " + iattrib + " />");		
	},
	
	retrImg: function(iname,isrc)
	{
		CUi._M_RETR_IMG_STORE[iname] = CUi.doc.createElement('img');		
		CUi._M_RETR_IMG_STORE[iname].setAttribute("name",iname);
		CUi._M_RETR_IMG_STORE[iname].src = (isrc);
		CUi._M_RETR_IMG_STORE[iname].border=0;					
		return(CUi._M_RETR_IMG_STORE[iname]);
	},
	
	setImgOB: function(iname,ob)
	{
		CUi._M_RETR_IMG_STORE[iname] = ob;
	},
	
	getImgOB: function(iname)
	{
		if(CUi._M_RETR_IMG_STORE[iname])
			return(CUi._M_RETR_IMG_STORE[iname]);
		else
			return(null);
	},
	
	getImgSrc: function(iname)
	{
		if(CUi._M_RETR_IMG_STORE[iname])
			return(CUi._M_RETR_IMG_STORE[iname].src);
		else
			return('');
	},
	
	getShiftImgHTML: function(iname,itip,bl,bt,bclass)
	{
		src = CUi.getImgSrc(iname);
		if((!bl) || (!bt)) { bl = 0; bt = 0; }
		if(!bclass) bclass='box-icon-sm';
		
		var sbl = bl-1, sbt = bt-1;
		
		return("<div class='box-icon-backdrop' ><img class='" + bclass + CUi.getAgentVal(' ie-cursor-hand',' ff-cursor-hand') + "' title='" + itip + "' alt='" + itip.slice(0,1) + "' class='"+iname+"' name='"+iname+"' src='"+src+"' border=0 style='position:relative;left:" + bl + ";top:" + bt + ";' onMouseOver='CUi.shiftImg(this," + sbl + "," + sbt + ");' onMouseOut='CUi.shiftImg(this," + bl +"," + bt + ");'/></div>");
	},

	shiftImg: function(ob,x,y)
	{
		ob.style.left = x;
		ob.style.top = y;
	},

	_M_WIN_RESIZE_MAP: Array(),
	winResize: function(e)
	{
		e = CUtil.ensureRealEvent(e);

		for(i in CUi._M_WIN_RESIZE_MAP)
		{
			var info = CUi._M_WIN_RESIZE_MAP[i];
			var elms = CUtil.getElementsById(info.id);

			for(ei in elms)
			{
				try {
					if(info.doWidth)
						elms[ei].style.width=(CUtil.getDim(true) - info.widthOffset) + 'px';

					if(info.doHeight)
						elms[ei].style.height=(CUtil.getDim(false) - info.heightOffset) + 'px';
				} catch(e) { }
			}
		}
	},

	regWinResize: function(info)
	{
		var def = {
			doWidth: false, doHeight: false
		};

		for(var i in info)
				def[i] = info[i];

		CUi._M_WIN_RESIZE_MAP.push(def);	        
	},
		
	// CUI Point X,Y cords
	point: function(xw,yh)
	{
		this._xw = xw;
		this._yh = yh;
	},
	
	_M_MENUS: new Array(),
	_M_MENU_FIX_ID: '_menu_',
	
	// bit wise constants
	_M_MENU_POS_TOP: 1, 
	_M_MENU_POS_WIN_MID: 2,
	_M_MENU_POS_MOUSE_MID: 4,
	
	_M_MENU_PIN_IMAGE_CON_NAME: 'pin_image',
	
	getRunOnMenu: function(mid,cb)
	{
		return("CUi._M_MENUS['"+mid+"']." + cb + ";");
	},
	
	menu: function(mid, props, menus)
	{
		this._mid = mid;
		this._real_mid = CUi._M_MENU_FIX_ID + mid;
		this.setupParams(props);
		
		if(CUtil.idOnDOM(this._real_mid))
			return(false);
		
		this._elm = CUi.createElm("div",this._real_mid);		
		this._elm.setAttribute("name",this._mid);

		this._elm.style.display='block';
		this._elm.style.position='absolute';
		this._elm.style.left='-1000px'; this._elm.style.top='-1000px';
		this._elm.style.overflow = 'hidden';
		this._elm.style.zIndex = this._def.zIndex;
		
		this._menus = menus;
		var html = "<div style='position:relative;left:0px;top:0px;z-index:" + this._def.zIndex + "' onmouseover=\"" + CUi.getRunOnMenu(mid,"slideEvent(event)") + "\" onmouseout=\"" + CUi.getRunOnMenu(mid,"slideEvent(event)") + "\"><table class='menutb' id='"+mid+"' name='"+mid+"' cellpadding=0 cellspacing=0 ><tr>",
			isPinDone = false;
		
		for(var i in this._menus)
		{
			if(CUtil.varok(this._menus[i].cb))
			{
				html += "<td align=left witdth=1px><a class='menu-txt' href=# onClick=\"" +  CUi.getRunOnMenu(mid, "runMenu(" + i + ")" ) + ";return(false);\"><div class='cursor-hand menu-item'>";
				html += "<img src='" + this._menus[i].img + "' title='" + this._menus[i].title + "' border=0 /></div></a></td>";			
			}
			else if(!isPinDone && CUtil.varok(this._menus[i].isPinCB))
			{				
				html += "<td align=left witdth=1px><a class='menu-txt' href=# onClick=\"" + CUi.getRunOnMenu(mid,"togglePin(this)") + ";return(false);\"><div name='" + CUi._M_MENU_PIN_IMAGE_CON_NAME + "' class='cursor-hand menu-item'>";
				html += "<img src='" + this._menus[i].img + "' title='" + this._menus[i].title + "' border=0 /></div></a></td>";
				
				this._pinMenu = i;
				isPinDone = true;
			}
		}
		
		html += "</tr></table></div>";	

		this._elm.innerHTML = html;
		
		CUi.bod.appendChild(this._elm);
		
		CUi._M_MENUS[this._mid] = this;
		this._curSlide = 0;
		
		var me = this;
		
		CUtil.capture(this._real_mid, function(elm) {		
			me._elm = elm;
			me._elm_sub = elm.childNodes[0];
						
			me._width = elm.clientWidth;
			me._height = elm.clientHeight;
			me._slideOutHeight = elm.clientHeight;
			
			me.hookPositionCB();		
			
			if(me._def.autoShow)
			{
				me.position();
			}
		} );
	}	
};

CUi.menu.prototype = {

	setupParams: function(p)
	{
		this._def = {
			autoShow: true,
			position: (CUi._M_MENU_POS_TOP | CUi._M_MENU_POS_WIN_MID),  
			isMenuPinned: false,
			positionTopOffset: 0,			
			slideShow: 10,
			height: 50,
			zIndex: 1
		};
		
		for(var i in p)
			this._def[i] = p[i];
	},
	
	hookPositionCB: function()
	{
		if((this._def.position & CUi._M_MENU_POS_WIN_MID) == CUi._M_MENU_POS_WIN_MID)
		{
			var me = this, cb = function() { me.position(); };
			CUi.hookScroll(this._real_mid, cb);
			CUi.hookResize(this._real_mid, cb);
		}
	},
	
	setPosition: function()
	{
		if(this._def.position == CUi._M_MENU_POS_MOUSE_MID)
		{
			this._left = CUi.bod.scrollLeft + (CUi._mouseX - (this._width / 2));
			this._top = CUi.bod.scrollTop + CUi._mouseY + this._def.positionTopOffset;
		}
		else
		{
			if((this._def.position & CUi._M_MENU_POS_TOP) == CUi._M_MENU_POS_TOP)
				this._top = CUi.bod.scrollTop + this._def.positionTopOffset;
			
			if((this._def.position & CUi._M_MENU_POS_WIN_MID) == CUi._M_MENU_POS_WIN_MID)			
				this._left = CUi.bod.scrollLeft + ((CUi.bod.clientWidth / 2) - (this._width / 2));
		}
		
		this._elm.style.top = this._top;
		this._elm.style.left = this._left;
	},
	
	runMenu: function(i)
	{
		if(CUtil.varok(this._menus[i]))
		{			
			this._menus[i].cb();
			
			if(this._def.isMenuPinned && this._def.slideShow <= 0)
				this.slide(true);	//HIDE A MENU WHICH IS PINNED BUT OTHERWISE WOULD BE HIDDEN FROM VIEW AFTER A MENU IS CLICKED
		}
	},
	
	togglePin: function(elanc)
	{
		var elimg = CUtil.getNeighbourByName(elanc,CUi._M_MENU_PIN_IMAGE_CON_NAME,'DIV',1,true),
			newImgOb = null;
			
		if(elimg && this._pinMenu)
		{
			var pinMenu = this._menus[this._pinMenu];
			this._def.isMenuPinned = !this._def.isMenuPinned; //TOGGLE SENSE
			
			elimg.removeChild(elimg.childNodes[0]);
			
			if(this._def.isMenuPinned)
				elimg.appendChild( pinMenu.imgPinInOB );								
			else
				elimg.appendChild( pinMenu.imgPinOutOB );			
			
			if(pinMenu.onPinChangeCB)
				pinMenu.onPinChangeCB(this._def.isMenuPinned);
				
			this.slide(!this._def.isMenuPinned); //SLIDE DOWN IF IT IS UP FOR WHATEVER REASON and visa versa			
		}
	},
	
	slideEvent: function(e)
	{
		try 
		{
			if(!this._def.isMenuPinned)
			{
				e = CUtil.ensureRealEvent(e);
				var t = CUi.eventTarget(e);
				var r = CUi.eventRelatedElm(e);
			
				if(CUtil.isChildOf(t,this._elm,true)) //IF Moving To and From the menu
				{				
					if(!CUtil.isChildOf(r,this._elm,true)) // FF cannot handle the other check which provides better detection (since the related target is sometimes not accurate as is with other browsers.
					{
						this.slide(e.type != 'mouseover');			
					}
				}
			}
		} 
		catch(ex) { }
	},
	
	slide: function(doUp)
	{					
		var hide_height = (this._height - this._def.slideShow);
		var inc = 0;
		
		if(CUtil.varok(doUp))
		{
			if(doUp != (parseInt(this._elm_sub.style.top) == 0))
				{ return ; }
		}
		else
			doUp = (parseInt(this._elm_sub.style.top) == 0);
		
		var curSlide = ++this._curSlide,
			me = this;
		
		CUtil.waitForIt(20,function() {
			if(curSlide != me._curSlide)
				{ return(true); }
				
			var t = parseInt(me._elm_sub.style.top);
			me._slideTop = t;
					
			if(doUp)
			{
				if(Math.abs(t) < (hide_height))
				{			
					inc += 0.1;
					t -= (inc);
					me._slideTop = t;
					me._elm_sub.style.top = t;					
					me._elm.style.height = me._height + t + 1;
					
					return(false);
				}
				else
				{
					me._curSlide = 0;
					return(true);				
				}				
			}
			else
			{
				if(t<0)
				{									
					inc += 0.1;
					t += (inc);
					me._slideTop = t;
					me._elm_sub.style.top = t;
					me._elm.style.height = me._height + t + 1;
					return(false);
				}
				else
				{
					me._elm_sub.style.top = 0;
					me._curSlide = 0;
					return(true);				
				}				
			}				
		} );
	},
	
	show: function()
	{
		this._height = this._slideOutHeight;
		
		this._elm.style.display='block';
		this._elm_sub.style.top = '0px';
		this._elm.style.height = this._height;
		
		this.position();	
	},
	
	hide: function()
	{
		this._elm.style.display='none';
	}
};

CMsg = {
	_M_D_ID: "MSG_DIV_",
	
	_ALL: new Array(),
	
	get: function(tid)
	{
		try {
			return(CMsg._ALL[tid]);
		} catch(e) { return(null); }
	},
	
	kill: function(tid)
	{
		var otid = CMsg.get(tid);
		if(otid) { otid.kill(); }		
	},
	
	working: function( wid, params )
	{
		CMsg.kill(wid); //no dupes
		var elm = this.initElm(wid, params);
		
		var html = "<table width=100% cellpadding=0 cellspacing=0><tr><td align=right valign=top><span name='no-selection' class='txt-nowrap msg-err txt no-selection above-all-2'>" + this._def.text + "</span></td></tr></table>";
		
		this.finaliseElm(elm,html);
	},
	
	infoex: function( wid, params )
	{
		CMsg.kill(wid); //no dupes
		var elm = this.initElm(wid, params);
		
		var html = "<table width=100% cellpadding=0 cellspacing=0><tr><td align=center valign=top><span name='no-selection' style='padding-left:5px;padding-right:5px;padding-bottom:2px' class='no-selection txt-nowrap txt msg-info above-all-1'>" + this._def.text + "</span></td></tr></table>";
		
		var me = this;		
		cust_addEvent(elm,'click',function() { me.kill(); } );
		
		this.finaliseElm(elm,html);
	}
};

CMsg.working.prototype = CMsg.infoex.prototype = CMsg.prototype = {	
	initElm: function(oid, params)
	{
		this._def = { text: '', hide: true, timeout: false, zi: 1 };		
		for(var p in params) { this._def[p] = params[p]; }
			
		this._oid = oid;
		this._did = CMsg._M_D_ID + oid;
		CMsg._ALL[this._oid] = this;	
		
		var elm = CUi.doc.getElementById(this._did);
		if(!elm) elm = CUi.createElm("div",this._did);		
		
		if(this._def.hide)
			elm.style.display='none';		
		
		elm.style.position='absolute';
		elm.style.left=0; elm.style.top=0; elm.style.width='100%';
		elm.style.zIndex = this._def.zi;
		
		//TODO: RESZE IS NOT WORKING PROPERLY; when a window forces the resize
		/*
		var hookResizeID = this._did;
		CUi.hookResize(hookResizeID, function() {
			var el = CUi.doc.getElementById(hookResizeID);
			if(el)
				el.style.width = CUi.bod.clientWidth;
			else
				CUi.destroyResize_Hook(hookResizeID);
		} );
		*/
		return(elm);		
	},
	
	finaliseElm: function(elm,html)
	{
		elm.innerHTML = html;
		this._elm = elm;
		CUi.bod.appendChild(this._elm);
	},
	
	getRunJS: function(f)
	{
		return('CMsg._ALL["'+this._oid+'"].' + f + ';');
	},
	
	hide: function()
	{
		this._elm.style.display='none';
	},
	
	show: function()
	{
		this._elm.style.display='block';
		if(this._def.timeout)
		{
			var me = this;
			setTimeout(function() { me.kill(); }, this._def.timeout * 1000);
		}
	},
	
	kill: function()
	{
		try {
			if(this._elm.parentNode)
				this._elm.parentNode.removeChild(this._elm);			
		} catch(e) {}
	}
};
