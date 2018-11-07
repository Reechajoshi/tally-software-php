
CWin = window.prototype = {
	_M_ALL: new Array(),
	
	_M_WIN_FIX: "WIN_",
	_M_WIN_MOVE_FIX: "WIN_MOV",
	_M_WIN_RESIZE_FIX: "WIN_REZ",
	_M_WIN_CLICK_FIX: "WIN_CLK",
	
	_M_WIN_PARENT_NAME: 'win-parent',
	_M_MODAL_DIV_NAME: 'win-modal',
	_M_WIN_MAIN_NAME: 'win-main',
	_M_WIN_CONTENT_NAME: 'win-content',
	_M_WORKER_TXT_NAME: 'wkr_block',
	_M_CAPTION_NAME: '_wcaption',
	
	_M_PROMPT_ID: '_wprompt',
	_M_ALERT_ID: '_walert',
	_M_INFORM_ID: '_winform',
	_M_BLOCK_ID: '_wblock',
	_M_LOG_ID: '_wlog',
		
	_M_SHADE_LIGHT: 'light',
	_M_SHADE_LINES: 'lines',	
	
	// MOUSE AT CONSTANTS
	_M_MAT_NOW: 0, //MOUSE AT NO WHERE
	_M_MAT_WEST: 1,
	_M_MAT_EAST: 2,
	_M_MAT_NORTH: 4,
	_M_MAT_SOUTH: 8,
	
	// TODO: THIS SHOULD ACTUALLY BE SET IN A CALL FROM APP
	_Z_INDEX_TOP: 901, 
	
	_Z_INDEX_BASE: 40,  //THE ORDER RESOLVES FROM THIS UPWORDS
	_Z_INDEX_PIN: 1,
	
	_M_OPERATE_OFF: { l: 0, t: 0 }, //TODO: Note only doing left and top for now
	
	_lastModalWinID: null,
	m_ziOrder: new Array(),
	m_ziOrderResolve: new Array(),
	
	init: function()
	{		
		CWin.winMoveCB();
		CWin.winClickCheckCB();
	},
	
	setWinOperateOffset: function(offs)
	{
		for(var oi in offs)
			{ CWin._M_OPERATE_OFF[oi] = offs[oi]; }
	},
	
	setWinZITop: function(new_top)
	{
		if(CWin.m_lastTopWin != new_top)
		{
			var topIZI = (CWin.m_ziOrder.length - 1);
			
			for( var izi = CWin.m_ziOrderResolve[new_top._wid]; izi < topIZI; izi++ )
			{
				CWin.m_ziOrder[izi] = CWin.m_ziOrder[izi + 1];
				CWin.m_ziOrderResolve[ CWin.m_ziOrder[izi] ] = izi;
				
				CWin.getMe( CWin.m_ziOrder[izi] ).setZIndex(izi);
			}
			
			CWin.m_ziOrder[ topIZI ] = new_top._wid;
			CWin.m_ziOrderResolve[ new_top._wid ] = topIZI;
			new_top.setZIndex(topIZI);
				
			CWin.m_lastTopWin = new_top;
		}
	},
	
	reOrderZIResolve: function()
	{
		CWin.m_ziOrderResolve = new Array();
		for(var izi in CWin.m_ziOrder)
		{
			CWin.m_ziOrderResolve[ CWin.m_ziOrder[izi] ] = parseInt(izi);
		}
	},
	
	getMe: function(wid)
	{
		if(CWin._M_ALL[wid])
			return(CWin._M_ALL[wid]);
		else
			return(false);
	},
	
	_M_SERIAL_SEP: String.fromCharCode(11),
	
	serialise: function(wid)
	{
		var serial = new Array(),
			w = CWin.getMe(wid);
		
		if(w)
		{
			serial.push(w.zi);
			serial.push(CUtil.serialBool(w._win_pinned));			
			serial.push(w.totalWidth);
			serial.push(w.totalHeight);
			serial.push(w._left);
			serial.push(w._top);			
		}
		
		return( serial.join( CWin._M_SERIAL_SEP ) );
	},
	
	unserialise: function(wid, state)
	{
		var serial = state.split(CWin._M_SERIAL_SEP),
			w = CWin.getMe(wid);
			
		if(w && (serial.length == 6) )
		{
			w.pin( CUtil.unSerialBool( serial[1] ) );
			w.totalWidth = parseInt(serial[2]);
			w.totalHeight = parseInt(serial[3]);
			
			w.setWinXY(parseInt(serial[4]), parseInt(serial[5]));
			w.setWinWH();
		}
	},
	
	destroy: function(wid)
	{
		var w = CWin.getMe(wid);
		if(w) w.destroy();
	},
	
	_supressWindows: false,
	
	supressWinOpens: function(doSupress)
	{
		CWin._supressWindows = doSupress;
	},
	
	openWin: function(wid,props,doref) //assumtion auto open is present for first time open else it will not open
	{
		var w = CWin.getMe(wid);
		
		if(w)
		{
			if(doref && props.title && props.html) //ONLY for content and Caption not for other props in the Window
				w.refreshContent(props.title,props.html); // ONLY works withFrills
			
			w.show();
		}
		else if(!CWin._supressWindows)
			w = new CWin.win(wid, props);
			
		return(w);
	},
	
	win: function(wid, parms)
	{
		this._wid = wid;
		this._real_wid = (CWin._M_WIN_FIX + wid);
		
		this._nameModalID = CWin._M_MODAL_DIV_NAME + this._wid;
		
		this.setupParams(parms);
		
		if(this.isOnDOM())
			CWin.destroy(wid);
		
		CWin.m_lastTopWin = null;
		
		/*if(CWin._lastModalWinID) //only one modal accepted
		{
			CWin.destroy(CWin._lastModalWinID);
			CWin._lastModalWinID = null;
		}		
		*/
		this._win_main = false; //mail element ref
		this._win_content = false; //conetent element ref
		this._win_caption = false;
		
		this._win_pinned = false;
		
		this._html = "",
		this._shtml = "",
		this._ehtml = "",
		this._scol = 13;
		
		CWin._M_ALL[this._wid] = this;
		
		if(this._def.modal)
		{			
			if(!CWin._lastModalWinID) //ONLY RECORD THIS FOR THE FIRST WINDOW WHICH IS MODAL. NOT FOR NESTED
				CWin._lastModalWinID = this._wid;
			
			//ZI = MAX (since it will be above everything except the win to be created below (which is MODAL)
			this._shtml += "<div name='" + this._nameModalID + "' class='vwin-wmax " + ((this._def.modalShade==CWin._M_SHADE_LINES)?("vwin-lines-shade"):((this._def.modalShade==CWin._M_SHADE_LIGHT)?("vwin-light-shade"):(''))) + "' style='left:" + CUi.bod.scrollLeft + "px;top:" + CUi.bod.scrollTop + "px;width:" + CUi.bod.clientWidth + ";height:" + CUi.bod.clientHeight + ";z-index:"+ (CWin._Z_INDEX_TOP) +"'>&#160;</div>";
			
			this.hookModalRePos();			
		}
		
		this.initLeftTop();	
		this.clipInXY(false);
		
		this.initZIndex();
		
		this._shtml += "<div name='" + CWin._M_WIN_MAIN_NAME + "' class='vwin-full' style=\"background-color:" + this._def.winBGColor + ";position:absolute;z-index:" + (CWin._Z_INDEX_BASE + this.zi) + ";left:" + this._left + ";top:" + this._top + ";width:" + (this.totalWidth) + ";height:" + this.totalHeight + ";\">";
		this._ehtml += '</div>';
		
		if(this._def.withFrills)
		{		
			this._html += "<table border=0 cellspacing=0 cellpadding=0 width=100% height=" + this._def.capHeight + "><tr><td valign=top align=left height="+this._def.capHeight+"><div name='" + CWin._M_CAPTION_NAME + "'>" + this.getCaptionHTML() + "</div></td></tr></table>";
			this._html += "<div name='" + CWin._M_WIN_CONTENT_NAME + "' class='vwin-content' style='overflow:auto;width:" + (this.totalWidth) + ";height:" + this._def.height + ";'>";
			this._html += ((this._def.htmlCenter)?(CUi.getAllCenterHTML(this._def.html)):(this._def.html));
			this._html += "</div>";
		}
		else
		{
			this._html += ((this._def.htmlCenter)?(CUi.getAllCenterHTML(this._def.html)):(this._def.html));
		}
		
		this._html = this._shtml + this._html + this._ehtml;
		
		var elm = CUi.createElm("div",this._real_wid);		
		elm.setAttribute("name",CWin._M_WIN_PARENT_NAME);
		
		elm.innerHTML = this._html;
		this._elm = elm;
		CUi.bod.appendChild(this._elm);
				
		if(this._def.closeOnEscape)
			this.hookEscapeClose();
		
		if(this._def.modal && this._def.positionMid) //resize modal dialogs back to the middle as nessasery
			this.hookMidPosCheck();
		
		if(this._def.winCanResize)
			this.enableWinResize();
		
		if(this._def.captureFocusFor)
		{
			var me = this; CUtil.capture(me._real_wid, function(el) {
				var ch = CUtil.getChildByName(el,me._def.captureFocusFor[0],me._def.captureFocusFor[1],true);				
				if(ch) ch.focus();
			} );
		}
		
		if(this._def.onResizeCB)
		{
			var me = this; 
			CUtil.capture(me._real_wid, function(el) {
				var elmcon = me.getWinContent();
				if(elmcon) me._def.onResizeCB(elmcon);
			} );		
		}		
		
		if(this._def.autoOpen)
			this.show();
		else
			this.hide();		
	},
	
	getMeFromDOM: function(o)
	{
		var p = CUtil.getParentByName(o,CWin._M_WIN_PARENT_NAME);
		
		var wid = p.getAttribute('id');			
		if(wid.indexOf(CWin._M_WIN_FIX)==0)
			wid = wid.substring(CWin._M_WIN_FIX.length);
		
		return(CWin.getMe(wid));	
	},
	
	winMoveCB: function()
	{
		var cur_me = this,
			off_left = 0,
			off_top = 0,
			isMDown = false,
			lastScrollLeft = -1,
			lastScrollTop = -1,
			cbMM_winMove = function(e) {
				if(isMDown)
				{
					cur_me.setWinXY((CUi._mouseX - off_left),(CUi._mouseY - off_top));
					
					// Invoke SCroll CallBack when scroll has taken plac e.. IE is the only browser that doesn't call onScroll when repositioning a div (tho also notived inconsistancies in FF and CH (when window is moved fast, so ust do this)
					if((lastScrollLeft != CUi.bod.scrollLeft) || (lastScrollTop != CUi.bod.scrollTop))
						CUi.handleScrollMain();
					
					lastScrollLeft = CUi.bod.scrollLeft; lastScrollTop = CUi.bod.scrollTop;
				}
			},
			cbMU = function(e) {
				if(isMDown)
				{					
					cur_me.setWinXY(cur_me._left,cur_me._top);
					isMDown = false;
					CUi.setNoSelectProp(false);				
				}
			}, 
			cbMD = function(e) {
				if(isMDown)
				{ 
					cbMU(e);
				}
				else
				{
					var elm = CUi.isClickInPureNest_Ignore(e,CWin._M_CAPTION_NAME, 'A');
					
					if(elm)
					{						
						cur_me = CWin.getMeFromDOM(elm);
						if(cur_me._def.winCanMove && !cur_me._win_pinned)
						{
							off_left = CUi._mouseX - cur_me._left;
							off_top = CUi._mouseY - cur_me._top;
							
							isMDown = true;
							CUi.setNoSelectProp(true);
							
							return(true);
						}
					}	
				}
			};
			
		CUi.setOnMouse(CWin._M_WIN_MOVE_FIX, cbMM_winMove, cbMD, cbMU);	
	},
	
	winClickCheckCB: function()
	{
		CUi.setOMD(CWin._M_WIN_CLICK_FIX, function(e) {
			if(!CUi._bodMouseIsSet && (el = CUi.isClickInPureNest(e,CWin._M_WIN_MAIN_NAME)))
			{
				var me = CWin.getMeFromDOM(el);
				if(!me._def.modal && !me._win_pinned)
				{
					CWin.setWinZITop(me);
				}
			}
		} );
	},
	
	destroyBlock: function()
	{
		CWin.destroy(CWin._M_BLOCK_ID);
	},
	
	showBlock: function(wm_txt)
	{
		var whtml = "<table border=0 width=100% height=100% cellpadding=0><tr><td width=30% align=right valign=middle style='padding-right:10px'>" + CUi.getImgHTML('prog_med') + "</td>";		
		whtml += "<td align=left valign=middle style='padding-left:10px'><span class=txt name='" + CWin._M_WORKER_TXT_NAME + "'>" + wm_txt + "</span></td></tr></table>";
		
		return(new CWin.win(CWin._M_BLOCK_ID, {
			withFrills: false,
			autoOpen: true,
			width: 360,
			height:50,
			modal: true,
			html: whtml,
			winCanResize: false,
			winCanMove: false,
			positionMid: true,
			fadeShade: true
		} ) );		
	},
	
	updateBlockText: function(wm_txt)
	{
		var w = CWin.getMe(CWin._M_BLOCK_ID);
		if(w)
		{			
			var telm = CUtil.getChildByName(w._elm,CWin._M_WORKER_TXT_NAME,'SPAN',true);
			if(telm)
				telm.innerHTML = wm_txt;
		}
	},
	
	inform: function(msg, txtBut, cbBut)
	{
		var f = new CForm.form_dyn(CWin._M_INFORM_ID, {
			rowHeight: false,
			rowStyle: '',
			labelStyle: 'width:100%;',
			buttonStyle: 'width:100px;margin-left:2px;margin-right:2px;',
			mainAttribTD: 'width=100% align=center'
		} );
		
		f.startRow();
		f.pushLabel(msg);
		f.endRow();
		
		f.startCenterRow('padding-top:10px;'); 
		
		f.pushButton(txtBut, function(me) {
			CWin.destroy(CWin._M_INFORM_ID);				
			cbBut();
		}, false );
	
		f.endCenterRow();
		
		var ih = 80, iw=350;
		if(msg.length>250)
		{
			ih = 200;
			iw = 450;
		}
		else if(msg.length>120)
			ih = 150;
		
		return(new CWin.win(CWin._M_INFORM_ID, {
			autoOpen: true,
			withFrills: false,
			width: iw,			
			height: ih,
			modal: true,
			positionMid: true,
			html: f.getHTML(),
			htmlCenter: true,
			captureFocusFor: new Array(txtBut,'BUTTON')
		} ) );	
	},
	
	pop: function(cap, msg, txt_1, cb_1, txt_2, cb_2, extraParams)
	{
		var f = new CForm.form_dyn(CWin._M_ALERT_ID, {
			rowHeight: false,
			rowStyle: '',
			labelStyle: 'width:100%;',
			buttonStyle: 'width:100px;margin-left:2px;margin-right:2px;',
			mainAttribTD: 'width=100% align=center'
		} );
		
		f.startRow();
		f.pushLabel(msg);
		f.endRow();
		
		f.startCenterRow('padding-top:10px;'); 
		
		var butStyle = 'margin-left:2px;margin-right:2px;',
			onDestroyCB = function(this_win) { return(true); };
		
		if(txt_1.length>10 || ( txt_2 && txt_2.length>10) )
			butStyle = 'width:150px;' + butStyle;
		else
			butStyle = 'width:100px;' + butStyle;
		
		f.setProps( { buttonStyle: butStyle } );
		
		f.pushButton(txt_1, function(me) {
			CWin.destroy(CWin._M_ALERT_ID);				
			if(cb_1)
				cb_1();
		}, false );
	
		if(txt_2)
		{
			f.pushButton(txt_2, function(me) {
				CWin.destroy(CWin._M_ALERT_ID);				
				if(cb_2)
					cb_2();
			}, false );
		}
		else if(cb_1)
			onDestroyCB = function(this_win) { cb_1(); return(true); };
		
		f.endCenterRow();
		
		var ih = 100, iw=350;
		if(msg.length>250)
		{
			ih = 220;
			iw = 450;
		}
		else if(msg.length>120)
			ih = 160;
		
		return( new CWin.win(CWin._M_ALERT_ID, CUtil.copyOB( {
			title: cap,
			autoOpen: true,
			closeOnEscape: true,
			width: iw,			
			height: ih,
			modal: true,
			positionMid: true,
			html: f.getHTML(),
			htmlCenter: true,
			captureFocusFor: new Array(txt_1,'BUTTON'),			
			onDestroyCB: onDestroyCB			
		}, extraParams ) ) );	
	},
	
	alert: function(cap, msg, cb, extraParams)
	{
		CWin.pop(cap,msg,'OK',cb, false, false, extraParams);		
	},
	
	confirm: function(cap, msg, cb)
	{
		CWin.pop(cap,msg,'Yes',cb,'No');		
	},
	
	prompt: function(question,def,validate_cb,exec_cb)
	{
		var pInputID = 'q';
		var f = new CForm.form_dyn(CWin._M_PROMPT_ID, { 
			width: '350px',
			inputStyle: 'width:240px;',
			buttonStyle: 'width:80px',			
			rowHeight: 24,
			focusInput: pInputID
		} );
		
		var cmdOK = _M_LANG_CMD_OK;
		
		f.startRow();
		f.pushInput(pInputID,def,null,cmdOK);
		f.pushButton(cmdOK,function(me) {
			var val = me.getValues()[pInputID];			
			if(validate_cb(val))
			{
				exec_cb(val);
				CWin.destroy(CWin._M_PROMPT_ID);
			}
		} );
		f.endRow();
		
		var w = new CWin.win(CWin._M_PROMPT_ID, {
			autoOpen: true,
			title: question,
			width: 360,			
			height:60,
			modal: true,
			positionMouse: true,
			html: f.getHTML(),
			closeOnEscape: true,
			winCanResize: false,
			winCanMove: true
		} );		
	},
		
	showLog: function()
	{
		(new CWin.win(CWin._M_LOG_ID, {
			autoOpen: true,
			title: "Log",
			width: 600,			
			height:300,
			modal: false,
			positionMid: true,
			html: CUtil.getLogHTML(),
			closeOnEscape: true,			
			winCanResize: true,
			winCanMove: true
		} ));
	}
};

CWin.prototype = CWin.win.prototype = {
	
	setupParams: function(p)
	{
		this._def = {
			autoOpen: false,
			onOpenScrollTo: true,
			title: '',
			titleStyle: '',
			html: '',
			htmlCenter: false,
			width: 0,
			height: 0,
			captureFocusFor: false,
			captionBackDrop: true,
			
			onResizeCB: false,
			
			winCanResize: true,
			winMinResizeWH: new CUi.point(100,100),
			winCanMove: true,			
			winBGColor: '#fff',
			
			capHeight: 22,
			
			positionMouse: false,
			positionMouseOffsetY: 5,
			
			positionMid: false,
			positionMidOffsetXY: 0,
			
			modal: false,
			modalShade: CWin._M_SHADE_LIGHT,
			modalPosMouse: false,
			
			closeOnEscape: false,
			
			capIconHTML: false,
			
			capCloseIconOn: true,
			capPinIconOn: false,
			capCustomIcons: new Array(),
			
			onDestroyCB: false,
			
			withFrills: true, 	
			fadeShade: false
		};
		
		// FADE SHADE = CUtil.varok(CUi._isSF) //ONLY HAVE THIS EFFECT FOR SAFARI
		
		this.applyParams(p);
	},
	
	isOnDOM: function()
	{
		return(CUtil.idOnDOM(this._real_wid));
	},
	
	applyParams: function(p)
	{
		for(var i in p)
		{
			this._def[i] = p[i];
		}
		
		this.totalWidth = this._def.width;
		this.totalHeight = this._def.capHeight + this._def.height;
	},
	
	refreshContent: function(title, ihtml)
	{
		this._def.title = title;
		this._def.html = ihtml;
		this.updateCaptionTitle();
		this.updateContent();
	},
	
	updateContent: function() // ONLY works withFrills
	{
		var wcon = this.getWinContent();
		wcon.innerHTML = ((this._def.htmlCenter)?(CUi.getAllCenterHTML(this._def.html)):(this._def.html));
	},
	
	updateCaptionTitle: function()
	{
		this.getWinCaption().innerHTML = this.getCaptionHTML();
	},
	
	initLeftTop: function()
	{
		if(this._def.positionMid)
		{			
			this._left = CUi.bod.scrollLeft + ((CUi.bod.clientWidth / 2) - (this.totalWidth / 2)) + this._def.positionMidOffsetXY;
			this._top = CUi.bod.scrollTop + ((CUi.bod.clientHeight / 2) - (this.totalHeight / 2)) + this._def.positionMidOffsetXY;		
		}
		else if(this._def.positionMouse)
		{
			this._left = CUi.bod.scrollLeft + CUi._mouseX - (this.totalWidth / 2);
			this._top = CUi.bod.scrollTop + CUi._mouseY + this._def.positionMouseOffsetY;
		}
		else
		{
			this._left = CUi.bod.scrollLeft;
			this._top = CUi.bod.scrollTop;
		}
		
		//if((this._left < 0) this._left = 0;		
		this._right = (this._left + this.totalWidth);
		this._bottom = (this._top + this.totalHeight);
	},
	
	setZIndex: function(zi) //RAW METHOD TO SET ZINDEX ONCE THE ELM IS ON DOCUMENT
	{
		this.zi = zi;		
		this.getWinMain().style.zIndex = (CWin._Z_INDEX_BASE + this.zi);
	},
	
	initZIndex: function()	
	{
		if(this._def.modal)
			this.zi = (CWin._Z_INDEX_TOP);
		else
		{
			CWin.m_ziOrder.push(this._wid);
			CWin.m_ziOrderResolve[this._wid] = (CWin.m_ziOrder.length - 1);
				
			this.zi = CWin.m_ziOrderResolve[this._wid];
			
			CWin.m_lastTopWin = this;					
		}
	},
	
	getCaptionHTML: function()
	{
		var html = '';
		
		html += "<div class='vwin-caption-bar " + ((!this._win_pinned && this._def.captionBackDrop)?('vwin-caption-bar-back'):('vwin-content')) + ((!this._win_pinned && this._def.winCanMove)?(' vwin-move'):('')) + "'>";
			
		html += "<table width=100% height='"+this._def.capHeight+"' ><tr>"; //<tr><td align=center valign=middle>";
		
		if(this._def.capIconHTML)
		{
			html += "<td align=left valign=middle>" + this._def.capIconHTML + "'</td>";			
		}
		
		html += "<td align=left valign=top><div name='no-selection' unselectable='on' class='gc " + ((!this._win_pinned && this._def.captionBackDrop)?('vwin-caption-light-txt'):('vwin-caption-dark-txt')) + ((!this._win_pinned && this._def.winCanMove)?(' vwin-move'):('')) + " no-selection' style='"+this._def.titleStyle+"'>" + this._def.title + "</div></td>";
		
		for(var ci in this._def.capCustomIcons)
		{			
			html += "<td width=1px align=left valign=middle style='padding-right:3px'><a href=# onclick='"+ this.getRunJS('runCustomCap(' + ci + ',this)') + "return(false);'>" + this._def.capCustomIcons[ci].imageHTML + "</a></td>";
		}
		
		if(this._def.capPinIconOn)
			html += "<td width=1px align=left valign=middle style='padding-right:3px'><a href=# onclick='"+ this.getRunJS('pin()') + "return(false);'>" + ((this._win_pinned)?(CUi.getShiftImgHTML('ipinout',_M_LANG_TIP_PINOUT)):(CUi.getShiftImgHTML('ipinin',_M_LANG_TIP_PININ))) + "</a></td>";
			
		if(this._def.capCloseIconOn)
			html += "<td width=1px align=left valign=middle style='padding-right:3px'><a href=# onclick='"+ this.getRunJS('destroy()') + "return(false);'>" + CUi.getShiftImgHTML('iclose',_M_LANG_TIP_CLOSE) + "</a></td>";
		
		html += "</tr></table>";		
		html += "</div>";
				
		return(html);
	},
	
	getRunJS: function(cb)
	{
		return("CWin.getMe(\""+this._wid+"\")." + cb + ";");
	},
	
	
	hookModalRePos: function()
	{
		var me = this, cb = function() {
			if(me._elm.childNodes)
			{
				me._elm.childNodes[0].style.left = CUi.bod.scrollLeft;
				me._elm.childNodes[0].style.top = CUi.bod.scrollTop;
				me._elm.childNodes[0].style.width = CUi.bod.clientWidth;
				me._elm.childNodes[0].style.height = CUi.bod.clientHeight;			
			}
			else
			{
				CUi.destroyScroll_Hook(me._nameModalID);
				CUi.destroyResize_Hook(me._nameModalID);				
			}
		};
		
		CUi.hookScroll(this._nameModalID, cb);	
		CUi.hookResize(this._nameModalID, cb);					
	},
		
	fadeShade: function(doin)
	{
		if(!this._elm_shade)
			this._elm_shade = CUtil.getChildByName(this._elm,this._nameModalID,'DIV');
		
		var sob = 0, sob_end = 0, sob_inc=0;
		
		if(doin)
			{ sob=0; sob_end = CUi.getAgentVal(50,.5); sob_inc = CUi.getAgentVal(1,.01); }
		else
			{ sob = CUi.getAgentVal(50,.5); sob_end=0; sob_inc = CUi.getAgentVal(-1,-.01); }
		
		if(CUi._isIE)
			this._elm_shade.style.filter='progid:DXImageTransform.Microsoft.Alpha(Opacity='+sob+')';			
		else
			this._elm_shade.style.opacity = sob; 
		
		var me = this;
		CUtil.waitForIt(20,function() {
			sob += sob_inc;
			
			if(((sob_inc<0)?(sob<=sob_end):(sob>=sob_end)))
				{ return(true); }
			else
			{ 
				if(CUi._isIE)
					me._elm_shade.style.filter='progid:DXImageTransform.Microsoft.Alpha(Opacity='+sob+')';
				else
					me._elm_shade.style.opacity = sob;
					
				return(false);
			}
		} );
	},
	
	getWinMain: function()
	{
		if(!this._win_main)
			this._win_main = CUtil.getChildByName(this._elm,CWin._M_WIN_MAIN_NAME,'DIV');
		
		return(this._win_main);
	},
	
	getWinContent: function()
	{
		if(!this._win_content)
			this._win_content = CUtil.getChildByName(this._elm,CWin._M_WIN_CONTENT_NAME,'DIV',true);
		
		return(this._win_content);
	},
	 
	getWinCaption: function()
	{
		if(!this._win_caption)
			this._win_caption = CUtil.getChildByName(this._elm,CWin._M_CAPTION_NAME,'DIV',true);
		
		return(this._win_caption);
	},
	
	clipInXY: function(doAdjustWH)
	{
		
		if( this._left < CWin._M_OPERATE_OFF.l )
		{
			if(doAdjustWH)
				this.totalWidth  = (this.totalWidth - (CWin._M_OPERATE_OFF.l - this._left));
				
			this._left = CWin._M_OPERATE_OFF.l;
			this._right = (this._left + this.totalWidth);
		}
		
		if( this._top < CWin._M_OPERATE_OFF.t )
		{
			if(doAdjustWH)
				this.totalHeight  = (this.totalHeight - (CWin._M_OPERATE_OFF.t - this._top));
				
			this._top = CWin._M_OPERATE_OFF.t; 
			this._bottom = (this._top + this.totalHeight);			
		}	
	},
	
	setWinXY: function(x,y)
	{		
		this._left = x; this._top = y;
		
		this._right = (this._left + this.totalWidth);
		this._bottom = (this._top + this.totalHeight);
				
		this.clipInXY(false);
		
		wmain = this.getWinMain();
		
		wmain.style.left = this._left;
		wmain.style.top = this._top;
	},
	
	setWinWH: function()
	{
		wmain = this.getWinMain();
		wcon = this.getWinContent();
		
		wmain.style.width = this.totalWidth;
		wcon.style.width = this.totalWidth;
		
		wmain.style.height = this.totalHeight;
		wcon.style.height = (this.totalHeight - this._def.capHeight);		
	},
	
	hookEscapeClose: function()
	{
		var me = this;		
		CUi.hookKeyCode(CUtil.M_KEY_CODE_ESCAPE, this._real_wid, function(e) { me.destroy(); } );
	},
	
	enableWinResize: function()
	{
		var mfix = this._real_wid + CWin._M_WIN_RESIZE_FIX,
			me = this,
			wmain = this.getWinMain(),
			wcon = this.getWinContent(),
			wconLScroll = -1,
			wconTScroll = -1,
			detectSafty = 10,
			lastMat = CWin._M_MAT_NOW,
			isMDown = false,
			cbMU = function(e)
			{
				isMDown = false;
				CUi.setNoSelectProp(false);
								
				if(me._def.onResizeCB)
					me._def.onResizeCB( wcon );
			}, 
			cbMD = function(e)
			{
				if(isMDown)
				{
					cbMU(e);
				}
				else if(CUi.isLeftClick_Ignore(e,'A') && lastMat!=CWin._M_MAT_NOW)
				{
					isMDown = true;				
					CUi.setNoSelectProp(true);
					
					// RECORD the position of scroll on Click
					wconLScroll = wcon.scrollLeft;
					wconTScroll = wcon.scrollTop;
					
					return(true);
				}	
			}, 
			cbMM_winResize = function(e)
			{
				var mx = CUi._mouseX;
					my = CUi._mouseY;
				
				if((mx < CUi.bod.clientWidth) && (my < CUi.bod.clientHeight)) //in Chrome event is fired during body scroll bar usage; which is outside client Area, we dont need this event.
				{
					mx += CUi.bod.scrollLeft;
					my += CUi.bod.scrollTop;
						
					if(isMDown)
					{
						//if( (wconLScroll == wcon.scrollLeft) && (wconTScroll == wcon.scrollTop) )
						{						
							if(lastMat & CWin._M_MAT_WEST)
							{
								me.totalWidth = me.totalWidth + (me._left - mx);
								me._left = mx;					
							}
							else if(lastMat & CWin._M_MAT_EAST)
							{
								me.totalWidth = me.totalWidth + (mx - me._right);
							}				
							
							if(lastMat & CWin._M_MAT_NORTH)
							{
								me.totalHeight = me.totalHeight + (me._top - my);
								me._top = my;					
							}
							else if(lastMat & CWin._M_MAT_SOUTH)
							{
								me.totalHeight = me.totalHeight + (my - me._bottom);
							}
							
							if(me.totalWidth < me._def.winMinResizeWH._xw)
							{
								if(lastMat & CWin._M_MAT_WEST)
									me._left -= (me._def.winMinResizeWH._xw - me.totalWidth);
									
								me.totalWidth = me._def.winMinResizeWH._xw;							
							}
								
							if(me.totalHeight < me._def.winMinResizeWH._yh)
							{
								if(lastMat & CWin._M_MAT_NORTH)
									me._top -= (me._def.winMinResizeWH._yh - me.totalHeight);
									
								me.totalHeight = me._def.winMinResizeWH._yh;							
							}												
				
							me.clipInXY(true);
							me.setWinXY(me._left,me._top);
							me.setWinWH();												
						}
					}
					else
					{
						if((CWin.m_lastTopWin == me) && (!me._win_pinned))
						{
							//window.status = '( ' + me._left + ' , ' + me._top + ' ) - ( ' + me._right + ' , ' + me._bottom + ' )';
							
							if((my >= (me._top - detectSafty)) && (my <= (me._bottom + detectSafty)))
							{
								if((mx >= (me._left - detectSafty)) && (mx <= (me._left + detectSafty)))
								{
									if(my <= (me._top + detectSafty))
									{
										CUi.setFullCursor('nw-resize'); 
										lastMat = CWin._M_MAT_WEST + CWin._M_MAT_NORTH;							
									}
									else if(my >= me._bottom)
									{
										CUi.setFullCursor('sw-resize'); 
										lastMat = CWin._M_MAT_WEST + CWin._M_MAT_SOUTH;
									}
									else
									{
										CUi.setFullCursor('w-resize');
										lastMat = CWin._M_MAT_WEST;
									}
										
									return(true);
								}
								else if((mx >= me._right) && (mx <= (me._right + CUi.getAgentVal(detectSafty,detectSafty,2*detectSafty))))
								{
									if(my <= me._top)
									{
										CUi.setFullCursor('ne-resize'); 
										lastMat = CWin._M_MAT_EAST + CWin._M_MAT_NORTH;
									}
									else if(my >= me._bottom)
									{
										CUi.setFullCursor('se-resize'); 
										lastMat = CWin._M_MAT_EAST + CWin._M_MAT_SOUTH;
									}
									else
									{
										CUi.setFullCursor('e-resize');
										lastMat = CWin._M_MAT_EAST;
									}
										
									return(true);
								}
							}
							
							if((mx >= (me._left - detectSafty)) && (mx <= (me._right + detectSafty)))
							{
								if((my >= (me._top - detectSafty)) && (my <= (me._top)))
								{ 
									CUi.setFullCursor('n-resize');
									lastMat = CWin._M_MAT_NORTH;
									return(true);
								}
								else if((my >= me._bottom) && (my <= (me._bottom + detectSafty)))
								{
									CUi.setFullCursor('s-resize');
									lastMat = CWin._M_MAT_SOUTH;
									return(true);
								}
							}						
						}
						
						if(lastMat != CWin._M_MAT_NOW)
						{
							CUi.setFullCursor('default');
							lastMat = CWin._M_MAT_NOW;
						}
					}
				}				
			};
				
		//cust_addEvent(wcon,'scroll', function() { cbMU(); } ); //MESSY HACK to force MouseUp event which is not propigated during mouseUp event after a scroll in IE and Safari!!
		CUi.setOnMouse(mfix, cbMM_winResize, cbMD, cbMU);
	},
	
	// Check main win is always in center and modal shade is resized as needed.
	hookMidPosCheck: function()
	{
		var me = this;
		this.resizeHooked = true;
		CUi.hookResize(this._wid, function(e) {
			var oldL = me._left, oldT = me._top;
			me.initLeftTop();
			if((oldL != me._left)||(oldT != me._top))
			{
				me.setWinXY(me._left,me._top);				
			}
		} );
	},
	
	runCustomCap: function(ci,ob)
	{
		if(this._def.capCustomIcons[ci])
			this._def.capCustomIcons[ci].callback(this,ob);		
	},
	
	pin: function(isPined)
	{
		if(CUtil.varok(isPined))
			this._win_pinned = isPined;
		else
			this._win_pinned = !this._win_pinned;
	
		this.updateCaptionTitle();
		
		if(this._win_pinned)
		{
			this.getWinMain().style.border = '0px';
			
			if(CWin.m_lastTopWin == this)
				CWin.m_lastTopWin = null;
				
			this.setZIndex(CWin._Z_INDEX_PIN)
		}
		else
		{
			//TODO: Zindex Handle
			this.getWinMain().style.border = _M_BORDER_PART_1;
		}
	},
	
	show: function()
	{
		if(this._def.modal)
		{
			if(this._def.fadeShade)
				this.fadeShade(true);
		}
		else
			CWin.setWinZITop(this);
		
		this._elm.style.display='block';
		
		if(this._def.onOpenScrollTo)
		{
			var sX = CUi.bod.scrollLeft,
				sY = CUi.bod.scrollTop; 
			
			if(this._bottom > CUi.bod.clientHeight)
				sY = this._top - CWin._M_OPERATE_OFF.t;
			
			if(this._right > CUi.bod.clientWidth)
				sX = this._left - CWin._M_OPERATE_OFF.l;
			
			scrollTo(sX, sY);	
		}		
	},
	
	hide: function()
	{		
		this._elm.style.display='none';
	},
	
	destroy: function()
	{
		try
		{
			var doDestroy = true;
			
			if(this._def.onDestroyCB)
				doDestroy = this._def.onDestroyCB(this);
			
			if(doDestroy)
			{
				if(CWin.m_lastTopWin == this)
					{ CWin.m_lastTopWin = null; }
				
				if(CUtil.varok(CWin.m_ziOrderResolve[ this._wid ]))
				{
					CWin.m_ziOrder.splice( CWin.m_ziOrderResolve[ this._wid ], 1); //REMOVE THIS WIN FROM ZI ORDER
					CWin.reOrderZIResolve();
				}
				
				if(this._def.winCanResize)
					CUi.clearOnMouse(this._real_wid + CWin._M_WIN_RESIZE_FIX);
			
				if(this.resizeHooked)
					CUi.destroyResize_Hook(this._wid);
				
				if(this._def.closeOnEscape)
					CUi.destroyKeyCode_Hook(CUtil.M_KEY_CODE_ESCAPE, this._real_wid);
				
				CUi.bod.removeChild(this._elm);
				
				if(this._def.modal)	
				{
					CUi.destroyScroll_Hook(this._nameModalID);
					CUi.destroyResize_Hook(this._nameModalID);
					
					if(CWin._lastModalWinID == this._wid)
						CWin._lastModalWinID = null;			
				}
			
				CWin._M_ALL = CUtil.removeNamedIndex(CWin._M_ALL, this._wid);
				
				CUi.handleScrollMain(); //Incase the destroy changes client working area, this needs to be done callbacks				
			}
		}
		catch(e) {}
	}	
};
