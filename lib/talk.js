// JS chat with server
///////////////////////////////////////////////////////////////////////////////////////////////////

CTalk = {
	_M_IO_UNIX_BYTE_NL: String.fromCharCode(10),
	_WAIT_ASYNC_REQ: 15000, //TODO: change this to 15 since 5 is unrealistic for net in india
	
	_M_IFR_DIV_ID: '_ifr_div_hid',
	
	inAsyncReq: false,
	postFailTO: false,
	
	getHTTPReq: function()
	{
		var req = false;
		
		try
		{
			req = new XMLHttpRequest();
		}
		catch(err)
		{
			try
			{
				req = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(err)
			{
				try
				{
					req = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(err) {}				
			}
		}
		
		return(req);
	},

	_M_POST_BACKLOG: new Array(),
	
	sendSimplePost: function(url, cb)
	{
		CTalk.sendPost(url,null,null, cb);
	},
	
	sendPost: function(url,dname,dvalue,cb)
	{
		if(CTalk.inAsyncReq == false)
			CTalk.__sendPost(url,dname,dvalue,cb);
		else
			CTalk._M_POST_BACKLOG.push( { url: url, dname: dname, dvalue: dvalue, cb: cb } );
	},	
		
	__checkPostMore: function()
	{
		if(CTalk._M_POST_BACKLOG.length>0)
		{
			var nt = CTalk._M_POST_BACKLOG[0];			
			CTalk._M_POST_BACKLOG.splice(0,1); //removeed index zero
		
			CTalk.__sendPost(nt.url,nt.dname,nt.dvalue,nt.cb);
		}
		else
			CTalk.inAsyncReq = false; 
	},
	
	__sendPost: function(url,dname,dvalue,cb)
	{
		CTalk.inAsyncReq = true; 
		CTalk.postCBDone = false; 
		
		var postCB = function(resp,param) {
			if(CTalk.postCBDone == false)
			{
				CTalk.postCBDone = true;
				try { cb(resp,param); } catch(e) {}
			
				CTalk.__checkPostMore();
			}
		}
				
		CTalk.__sendPost_XHR(url,dname,dvalue,postCB);	
	},
	
	__sendPost_XHR: function(url,dname,dvalue,postCB)
	{
		try
		{			
			var reqStage1OK = false;
			var req = CTalk.getHTTPReq();
			
			CTalk.postFailTO = setTimeout( function() { 
				postCB(false);
				req.abort();
			}, CTalk._WAIT_ASYNC_REQ);
							
			req.onreadystatechange = function()
			{
				try
				{
					if(req) 
					{ 
						if(req.readyState==1)
							reqStage1OK = true;
						else if(req.readyState==4)						
						{
							if(CTalk.postFailTO)
								{ clearTimeout(CTalk.postFailTO); CTalk.postFailTO = false }			
						
							if(req.status==200)
							{			
								postCB(req.responseText);
							}
							else
							{
								postCB(false)
							}
						}
					}
				} catch(e) { 
					if(CTalk.postFailTO)
						{ clearTimeout(CTalk.postFailTO); CTalk.postFailTO = false }		
										
					postCB(false);
				} 
			}
						
			req.open("POST", url, true);
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			
			if(dname && dvalue)
				req.send(dname+"="+escape(dvalue));
			else			
				req.send('dummy=0');					
		}
		catch(e)
		{	
			if(CTalk.postFailTO)
				{ clearTimeout(CTalk.postFailTO); CTalk.postFailTO = false }			
				
			postCB(false);
		} 
	}
};
