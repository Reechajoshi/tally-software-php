// Java script utilities

//////////////////////////////////////////////////////////////////////////////////////////

CUtil = {

	M_KEY_CODE_BACK: 8,
	M_KEY_CODE_TAB: 9,
	M_KEY_CODE_ENTER: 13,
	M_KEY_CODE_ESCAPE: 27,
	M_KEY_CODE_LEFT_ARROW: 37,
	M_KEY_CODE_TOP_ARROW: 38,
	M_KEY_CODE_RIGHT_ARROW: 39,
	M_KEY_CODE_BOTTOM_ARROW: 40,
	M_KEY_CODE_DEL: 46,
	M_KEY_CODE_FUNCTION_1: 112,
	M_KEY_CODE_FUNCTION_2: 113,
	
	initCommonGround: function()
	{
		if(CUi._isIE)
		{
			window.cust_addEvent = function(element, type, handler) {
				element.attachEvent("on" + type, handler);
			};
		}
		else
		{
			window.cust_addEvent = function(element, type, handler) {
				element.addEventListener(type, handler, false);
			};
		}
	},
	
	//xarr: original array; oi: old index name; ni: new index name; nv: new index value
	swapNamedIndex: function(xarr,oi,ni,nv)
	{
		var narr = new Array();
		
		for(i in xarr)
		{
			if(i==oi)
				narr[ni] = nv;
			else
				narr[i] = xarr[i]; 
		}	
				
		return(narr);
	},
	
	removeFromArray: function(xarr,v)
	{
		for(var i = 0; i < xarr.length; i++)
		{
			if(xarr[i]==v)
			{
				xarr.splice(i,1);
				break;
			}
		}
		
		return(xarr);
	},
	
	removeNamedIndex: function(x,ni)
	{
		var na = new Array();
		
		for(i in x)
		{
			if(i!=ni) 
				na[i]=x[i]; 
		}	
		
		return(na);
	},

	delCookie: function(name)
	{
		CUtil.setCookie(name,"",-1);
	},

	setCookie: function( name, value, expires, path, domain, secure ) 
	{
		// set time, it's in milliseconds
		var today = new Date();
		today.setTime( today.getTime() );

		//day to ms = expires * 1000 * 60 * 60 * 24;
		if (expires)
			expires = new Date( today.getTime() + (expires) ); 

		document.cookie = name + "=" +escape( value ) +
		( ( expires ) ? ";expires=" + expires.toGMTString() : "" ) + 
		( ( path ) ? ";path=" + path : "" ) + 
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
	},

	getCookie: function(check_name)
	{
		var a_all_cookies = document.cookie.split( ';' );
		var a_temp_cookie = '';
		var cookie_name = '';
		var cookie_value = '';
		var b_cookie_found = false;
		
		for ( i = 0; i < a_all_cookies.length; i++ )
		{
			a_temp_cookie = a_all_cookies[i].split( '=' );
			
			cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		
			if ( cookie_name == check_name )
			{
				b_cookie_found = true;
				if ( a_temp_cookie.length > 1 )
				{
					cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
				}
				return cookie_value;
				break;
			}
			a_temp_cookie = null;
			cookie_name = '';
		}

		if ( !b_cookie_found )
			return null;
	},

	getElementsById: function(sId)
	{
		var outArray = new Array();	
		
		if(typeof(sId)!='string' || !sId)
		{
			return outArray;
		};
		
		if(document.evaluate)
		{
			var xpathString = "//*[@id='" + sId.toString() + "']";
			var xpathResult = document.evaluate(xpathString, document, null, 0, null);
			while ((outArray[outArray.length] = xpathResult.iterateNext())) { }
			outArray.pop();
		}
		else if(document.all)
		{
			if(document.all[sId])
			{
				if(document.all[sId].length)
				{
					for(var i=0,j=document.all[sId].length;i<j;i+=1)
						{ outArray[i] =  document.all[sId][i]; }
				}
				else
				{
					outArray.push(document.all[sId]);
				}
			}		
		}
		else if(document.getElementsByTagName)
		{	
			var aEl = document.getElementsByTagName( '*' );	
			for(var i=0,j=aEl.length;i<j;i+=1)
			{	
				if(aEl[i].id == sId )
				{
					outArray.push(aEl[i]);
				};
			};	
			
		};
		
		return outArray;
	},
	
	isMM: function(e) { return(e.type=="mousemove") },
	isMD: function(e) { return(e.type=="mousedown") },
	isMU: function(e) { return(e.type=="mouseup") },
		 
	ensureRealEvent: function(e)
	{
		if(window.event)
			return(window.event);
		else
			return(e);
	},
	 
	getEventSrc: function(e)
	{
		if(e.target)
			return(e.target);
		else if(e.srcElement)
			return(e.srcElement);
		else
			return(false);
	},
	
	setClass: function(ob,c)
	{
		//ob.setAttribute("ClassName",c);
		ob.setAttribute("class",c);
	},
	
	getClassName: function(ob)
	 {
		var c = ob.getAttribute("ClassName");
		return(((c) ? (c) : (ob.getAttribute("class"))));
	 },
	 
	getNeighbourByName: function(ob,nm,tagn,nests,depth)
	{

		if(!nests) nests = 1;
		if(!depth) depth = true;
		try { for(var x=0;(x<nests); x++) { ob=ob.parentNode; } } catch(e) {}
		return(CUtil.getChildByName(ob,nm,tagn,depth));
	},

	max: function(a,b)
	{
		return( ( (parseInt(a) > parseInt(b))?(a):(b) ) );
	},
	
	min: function(a,b)
	{
		return( ( (parseInt(a) < parseInt(b))?(a):(b) ) );
	},
	
	roundFloat: function(f, p)
	{
		var base10P = Math.pow(10, p);
		return((Math.round(f*base10P)/ base10P).toFixed(p));
	} ,

	strRepeat: function(str,times)
	{
		var ret = str;
		for(var i=1; i<times; i++)
			ret += str;
		
		return(ret);
	},
	
	getParentByName: function(ob,nm,maxup)
	 {
		try
		{
			if(!maxup) maxup=-1;
			if((maxup!=0) && (ob.parentNode))
			{
				if(ob.parentNode.getAttribute("name")==nm)
					return(ob.parentNode);
				
				return(CUtil.getParentByName(ob.parentNode,nm,(maxup-1)));
			}			
		} catch(err) {}
		
		return(false);
	 },
	 
	getChildByName: function(ob,nm,tagn,depth)
	{
		try
		{
			for( var x = 0; ob.childNodes[x]; x++ )
			{
				//if(ob.childNodes[x].tagName==tagn) alert(ob.childNodes[x].getAttribute("name"));
				if( ((tagn==false) || (ob.childNodes[x].tagName==tagn)) && ob.childNodes[x].getAttribute("name")==nm)
					return(ob.childNodes[x]);
				else if(depth)
				{
					var ret = CUtil.getChildByName(ob.childNodes[x],nm,tagn,depth);
					if(ret!=false) return(ret);
				}
			}
		} catch(err) {}
		
		return(false);
	},

	applyToChildNodes: function(ob,tagn,depth,func)
	{
		for( var x = 0; ob.childNodes[x]; x++ )
		{			
			if(ob.childNodes[x].tagName==tagn)
			{
				func(ob.childNodes[x]);
			}
			
			if(depth)
				CUtil.applyToChildNodes(ob.childNodes[x],tagn,depth,func);
		}		
	},

	applyToMultiChildNodes: function(ob,tags,depth,func)
	{
		try
		{
			for( var x = 0; ob.childNodes[x]; x++ )
			{			
				for( var i in tags)
				{
					if(ob.childNodes[x].tagName==tags[i])
						func(ob.childNodes[x]);
				}
				
				if(depth)
					CUtil.applyToMultiChildNodes(ob.childNodes[x],tags,depth,func);
			}
		} catch(e) {CUtil.log('applyToMultiChildNodes: ' + e.message);}	
	},

	applyToAllChildNodes: function(ob,depth,func)
	{
		try
		{			
			for( var x = 0; ob.childNodes[x]; x++ )
			{			
				func(ob.childNodes[x]);			
				if(depth) CUtil.applyToAllChildNodes(ob.childNodes[x],depth,func);
			}
		} catch(e) {}	
	},

	getChildById: function(ob,id,tagn,depth)
	{
		try
		{
			for( var x = 0; ob.childNodes[x]; x++ )
			{
				if(ob.childNodes[x].tagName==tagn && ob.childNodes[x].getAttribute("id")==id)
					return(ob.childNodes[x]);
				else if(depth)
				{
					var ret = CUtil.getChildById(ob.childNodes[x],id,tagn,depth);
					if(ret!=false) return(ret);
				}
			}
		} catch(e) {}
		
		return(false);
	},

	isChildOf: function(child_ob,parent_ob, includeMe)
	{
		if(includeMe)
		{
			if(child_ob && child_ob == parent_ob)
				return(true);
			else
				return(CUtil.isChildOf(child_ob,parent_ob,false));
		}
		else if(child_ob && child_ob.parentNode)
		{
			var p = child_ob.parentNode;
			if(p && p == parent_ob)
				return(true);
			else
				return(CUtil.isChildOf(p,parent_ob,false));			
		}
		else
			return(false);
	},
		
	getAllParentTopOffset: function(o,parent_exclude)
	{		
		var ot = 0,
			lastParent = false;
			
		while(o)
		{
			if(o.tagName == 'DIV' && o.offsetTop && parent_exclude != o.offsetParent && lastParent != o.offsetParent)
			{				
				lastParent = o.offsetParent;
				ot += o.offsetTop
			}
			
			o = o.parentNode;
		}
	
		return(ot);
	},
	
	getAllParentLeftOffset: function(o,parent_exclude)
	{		
		var ot = 0,
			lastParent = false;
			
		while(o)
		{
			if(o.tagName == 'DIV' && o.offsetLeft && parent_exclude != o.offsetParent && lastParent != o.offsetParent)
			{				
				lastParent = o.offsetParent;
				ot += o.offsetLeft
			}
			
			o = o.parentNode;
		}
	
		return(ot);
	},
	
	getObjXY: function(obj)
	{
		var curleft = 0,
			curtop = 0;
		
		if (obj.offsetParent)
		{
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		
		return( { x: curleft, y: curtop } );
	},
	
	setHand: function(ob,doit)
	{
		if(doit)
		{
			ob.style.cursor=((CUi._isIE)?('hand'):('pointer'));
		}
		else
			ob.style.cursor='default';
	},

	getWorthyID: function(iid)
	{
		return(iid.replace(' ','').replace('&',''));
	},	
	
	forwardPadByZeros: function(n,pc)
	{
		n = String(n);
		for(var i=n.length;i<pc;i++)
			n ="0" + n;
		
		return(n);
	},

	getNow: function()
	{
		var now = new Date(), hh = String(now.getHours()), mm = String(now.getMinutes()), ss = String(now.getSeconds());
			
		if(hh.length == 1) hh = "0" + hh;
		if(mm.length == 1) mm = "0" + mm;
		if(ss.length == 1) ss = "0" + ss;
		
		return(hh + ":" + mm + ":" + ss);
	},

	getEventKeyCode: function(e)
	{
		return(e.keyCode);
	},

	isKeyEnterPressed: function(e)
	{
		return(CUtil.getEventKeyCode(e)==CUtil.M_KEY_CODE_ENTER);
	},
	
	isKeyNum: function(e)
	{
		var range = "09",
			kc = CUtil.getEventKeyCode(e);
		
		return((kc >= range.charCodeAt(0)) && (kc <= range.charCodeAt(1)));
	},
	
	varok: function(v)
	{	
		return((typeof(v) != "undefined") && (v!=null));
	},

	isfunc: function(f)
	{
		return(typeof(f) == 'function');
	},
	
	getval: function(v)
	{
		if(v) return(v); else return('');
	},
	
	hexMap: "0123456789ABCDEF",
	dec2hex: function(d)
	{
		var h = CUtil.hexMap.substr(d&15,1);
		while(d>15) {d>>=4;h=CUtil.hexMap.substr(d&15,1)+h;}		
		return(h);
	},
 
	hex2dec: function (h)
	{
		return(parseInt(h,16));
	}, 
	
	makeRealColourHex: function(r,g,b)
	{
		return('#' + CUtil.forwardPadByZeros(CUtil.dec2hex(r),2) + CUtil.forwardPadByZeros(CUtil.dec2hex(g),2) + CUtil.forwardPadByZeros(CUtil.dec2hex(b),2));
	},
	
	getRealColourHex: function(c)
	{
		if(c.slice(0,3) == 'rgb')
		{
			var rgb = c.slice(4).split(',');
			return('#'+CUtil.dec2hex(parseInt(rgb[0]))+CUtil.dec2hex(parseInt(rgb[1]))+CUtil.dec2hex(parseInt(rgb[2])));
		}
		else
			return(c.toUpperCase());
	},

	strTrim: function(str)
	{
		while (str.substring(0,1) == ' ') // check for white spaces from beginning
	        str = str.substring(1, str.length);
	    while (str.substring(str.length-1, str.length) == ' ') // check white space from end
	        str = str.substring(0,str.length-1);
	    return str;
	},

	
	isTimeStr: function(s)
	{
		return(s.match(/[0-9]+[:][0-9]+[:][0-9]+/)==s);
	},

	getSafeVal: function(s)
	{
		return( ((CUtil.isNumber(s)) ? (s) : ('')) );
	},

	// This will return true even if the first part of n is a number; i.e: 1234AA will eq true
	isNumber: function(n)
	{
	   var _n=parseInt(n);
	   return(!isNaN(_n));
	},

	logHist: new Array(),
	
	log: function(msg)
	{
		CUtil.logHist.push(CUtil.getNow() + ': ' + msg);
		
		if(CUtil.logHist.length>1000)
			CUtil.logHist.splice(0,1);		
	},

	getLogHTML: function()
	{
		var ln = CUtil.logHist.length, ih = '';
		
		for(var ix=(ln-1); ix>=0; ix--)
			ih += CUtil.logHist[ix] + '<br/>';
		
		return(ih);
	},

	getNewWinHTML: function(docTitle,bodyHTML)
	{ //assumtion: current doc has no title defined in the html
		return('<html><head>' + CUi.doc.getElementsByTagName('head')[0].innerHTML + '<title>' + docTitle + '</title></head><body>' + bodyHTML + '</body></html>');
	},
	
	dynLinkScrip: function(scripSrc,cb) //TODO: FIX function for IE
	{
		var head= document.getElementsByTagName('head')[0];
		
			CUtil.applyToChildNodes(head,"SCRIPT",false,function(ob) { 
			if(ob.getAttribute('src')==scripSrc)
				head.removeChild(ob);
		} );
		
	   var script = document.createElement('script');
	   script.type = 'text/javascript';
	   script.src = scripSrc;   
	   
	   //TODO: current only supported in FF; use onreadystatechange for IE.
	   script.onload=function() { cb(); }   
	   head.appendChild(script);
	},

	arrKeyJoin: function(arr,glue)
	{
		var ret = "";
		for(var key in arr)
			ret += key + glue;
		
		if(ret=="")
			ret = ret.slice(0,-1);
			
		return(ret);
	},

	arrKeySplit: function(ser,glue,allval)
	{
		var parts = ser.split(glue);
		var ret = new Array();
		for(var i in parts)
		{
			if((parts[i]!="") && (parts[i].length!=0))
				ret[parts[i]] = allval;
		}
		
		return(ret);
	},

	toBool: function(v) //Boolean(String(false))!=false the madness that is JS!
	{
		if(v=="false")
			return(false);
		else if(v=="true")
			return(true);
		else
			return(Boolean(v));
	},

	getCleanArray: function(asrc)
	{
		var adst = new Array();
		for(var i in asrc)
		{
			if((i.length>0) && (asrc[i].length>0) && (asrc[i]!=""))
				adst[i] = asrc[i];
		}
		return(adst);
	},

	cloneHeadEx: function(src,dst)
	{
		var head_src = src.document.getElementsByTagName('head')[0];
		var head_dst = dst.document.getElementsByTagName('head')[0];
		
		for(var x=0; head_src.childNodes[x]; x++)
			head_dst.appendChild(head_src.childNodes[x].cloneNode(true));	
	},

	callBack: function(cb,param)
	{
		if(typeof(cb)=='function')
		{
			return(cb(param));			
		}
		
		return(null);
	},
	
	multiCallBack: function(cbs,param)
	{
		var ret;
		for(var x in cbs)
		{
			ret = CUtil.callBack(cbs[x],param);
			if(ret==true) //false and undef continue
			{
				//CUtil.log('Callback Exited on: ' + x);			
				return ;
			}
		}		
	},
	
	spawnx: function(ev)
	{
		try {
			setTimeout( ev, 1 );
		} catch(e) {}
	},
	
	startsWith: function(str,chk)
	{
		return(str.slice(0,chk.length) == chk);
	},

	waitForIt: function(mlto,cb)
	{
		try
		{
			var exitNow = false;
			
			setTimeout( function() {
				exitNow = (cb());
				if(!exitNow)
					CUtil.waitForIt(mlto,cb);
			}, mlto);
		}
		catch(e)
		{
			CUtil.log('waitForIt: ' + e.message);
		}
	},
	
	idOnDOM: function(i)
	{
		return(CUtil.varok(CUi.doc.getElementById(i)));
	},
	
	cloneOB: function(obj)
	{
		if(typeof(obj) == 'object')
		{
			var temp = {};
			for(var key in obj)
				{ temp[key] = obj[key]; }
				
			return temp;
		}
		else
			return(obj);
	},
	
	isNoSelection: function(ob) //returns true if selection of text is not permitted
	{		
		if((ob.getAttribute)&&(ob.getAttribute("name")=="no-selection"))
			return(true);
		else
			return(CUtil.getParentByName(ob,"no-selection")!=false);
	},
	
	getDim: function(bwidth,safety)
	{
		if(!safety)
			safety = 0;
		
		if(bwidth)
			return(CUi.doc.body.clientWidth-safety);
		else
			return(CUi.doc.body.clientHeight-safety);
	},

	markAll: function(ids,m)
	{
		var els = CUtil.getElementsById(ids);

		for(var x=0; x< els.length;x++)
		{
			els[x].checked = m;
		}
	},
	
	getOBText: function(ob)
	{
		if(CUtil.varok(ob.innerText))
			return(ob.innerText);
		else if(CUtil.varok(ob.textContent))
			return(ob.textContent);
		else
			return(ob.innerHTML);
	},
	
	capture: function(oid, cb)
	{
		CUtil.waitForIt( 100, function() {
			var el = CUi.doc.getElementById(oid);
			if(el)
			{
				cb(el);
				return(true);
			}
			else
				return(false);
		} );
	},
	
	serialBool: function(b) { return( ( (b) ? ('1') : ('0') ) ); },
	unSerialBool: function(b) { return( ( (b=='1') ? (true) : (false) ) ); },
	
	isdef: function(v)
	{	
		return(typeof(v) != "undefined");
	},
	
	isNumerPart: function(kc, bAllowDecimal, numRange)
	{
		if( bAllowDecimal && (kc == ".".charCodeAt(0) || kc == "-".charCodeAt(0)))
			return(true);
		else
		{
			if(!CUtil.isdef(numRange))
				numRange = "09";
			
			return( (kc >= numRange.charCodeAt(0)) && (kc <= numRange.charCodeAt(1)) );
		}
	},
	
	isInputControlKey: function(kc)
	{
		//TODO: DEL KEY AND DECIMAL KEY SAME KEYCODE ; NEED  TO DISTINGUISH!
		return( (kc==CUtil.M_KEY_CODE_BACK) || (kc == CUtil.M_KEY_CODE_TAB) || (kc==CUtil.M_KEY_CODE_DEL) || (kc==CUtil.M_KEY_CODE_LEFT_ARROW) || (kc==CUtil.M_KEY_CODE_RIGHT_ARROW) );
	},
	
	getEventCharCode: function(e)
	{
		return(e.charCode || e.keyCode);
	},
	
	_decimalNumersOnlyCB: function(e)
	{
		e = CUtil.ensureRealEvent(e);
		return( CUtil.isNumerPart( CUtil.getEventCharCode( e ), true ) || CUtil.isInputControlKey( CUtil.getEventKeyCode( e ) ) );
	},
	
	_numersOnlyCB: function(e)
	{	
		e = CUtil.ensureRealEvent(e);
		return( CUtil.isNumerPart( CUtil.getEventCharCode( e ), false ) || CUtil.isInputControlKey( CUtil.getEventKeyCode( e ) ) );
	},
	
	// number formatting function
	// copyright Stephen Chapman 24th March 2006, 22nd August 2008
	// permission to use this function is granted provided
	// that this copyright notice is retained intact

	formatNumber: function(num,dec,thou,pnt,curr1,curr2,n1,n2) {
		var x = Math.round(num * Math.pow(10,dec));
		if (x >= 0) n1=n2='';
		var y = (''+Math.abs(x)).split('');
		var z = y.length - dec;
		if (z<0) z--;
		for(var i = z; i < 0; i++) y.unshift('0');
		if (z<0) z = 1; y.splice(z, 0, pnt);
		if(y[0] == pnt) y.unshift('0');
		while (z > 3) {z-=3; y.splice(z,0,thou);}
		var r = curr1+n1+y.join('')+n2+curr2;
		return ( (num<0)?('-'):('') )+r;
	}
};