function $(id)
{
	return document.getElementById(id);
}

//禁用鼠标右键
document.oncontextmenu = function() 
{ 
	return false; 
}

function isNull( str )
{
	if ( str == "" )
	{
		return true;
	}
	
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}

/*==========================================
============================================
==										  ==
==				通道信息代码段  	      ==
==										  ==
==			2011.02.18	By angel		  ==
============================================
==========================================*/

//请求获取通道信息
var g_ChannelInfoObj = new ChannelInfoObj();
function SendGetChannelInfo()
{
	g_ChannelInfoObj.callbackfunction = function(Obj){
			
			if( Obj.result )
			{
				g_ChannelInfoObj = Obj;
				var num = 0;
				for( var i=0; i<Obj.ChannelTotal; i++ )
				{
					if( Obj.ChannelInfo[i].ChannelEnable == 1 )
					{
						$("PtzChannelNo").options[num] = new Option(Obj.ChannelInfo[i].ChannelName,Obj.ChannelInfo[i].ChannelId);
						$("AudioChannelNo").options[num] = new Option(Obj.ChannelInfo[i].ChannelName,Obj.ChannelInfo[i].ChannelId);
						num ++;
					}
				}
				
				//初始化通道参数设置页面
				InitChannelInfo();
			}
			else
			{
				//alert("get channel info fail!");
			}
		};
		
	g_ChannelInfoObj.method = "POST";
	g_ChannelInfoObj.asynchrony = true;
	g_ChannelInfoObj.username = g_UserName;
	g_ChannelInfoObj.password = g_Password;
	
	GetChannelInfo(g_ChannelInfoObj);
}

/*==========================================
============================================
==										  ==
==			云台参数设置代码段  		  ==
==										  ==
==			2011.03.08	By angel		  ==
============================================
==========================================*/

//获取云台协议列表
function SendGetPtzProtocol()
{
	var ExpPtzProtocolObj = new PtzProtocolObj();
	
	ExpPtzProtocolObj.callbackfunction = function(Obj){
			if(Obj.result )
			{
				for(var i=0; i<Obj.count; i++ )
				{
					document.getElementById("selectProtocol").options[i] = new Option(Obj.szDecoderName[i],Obj.szDecoderName[i]);
				}
				
				//获取云台参数信息
				SendGetPtzDecoderInfo();
			}
			else
			{
				//alert("get pztProtocol fail!");
			}
		};
		
	ExpPtzProtocolObj.method = "POST";
	ExpPtzProtocolObj.asynchrony = true;
	ExpPtzProtocolObj.username = g_UserName;
	ExpPtzProtocolObj.password = g_Password;
	ExpPtzProtocolObj.CurrentChannelId = $("PtzChannelNo").value;
	
	GetPtzProtocol(ExpPtzProtocolObj);	
}

//获取云台参数信息
var g_PtzDecoderInfoObj = new PtzDecoderInfoObj();
function SendGetPtzDecoderInfo()
{
	g_PtzDecoderInfoObj.callbackfunction = function(Obj){
			g_PtzDecoderInfoObj = Obj;
			
			if(Obj.result )
			{
				with(document.all)
				{    
					for(var i=0;i<PTZAddress.options.length;i++)
					{                
						if (PTZAddress.options[i].value == g_PtzDecoderInfoObj.wDecoderAddress )
						{
							PTZAddress.selectedIndex=i;
							break;
						}
					}
					
					for(var i=0;i<Parity.options.length;i++)
					{                
						if (Parity.options[i].value == g_PtzDecoderInfoObj.byParity )
						{
							Parity.selectedIndex=i;
							break;
						}
					}
					
					for(var i=0;i<selectProtocol.options.length;i++)
					{            
						if (selectProtocol.options[i].value == g_PtzDecoderInfoObj.szDecoderName )
						{
							selectProtocol.selectedIndex=i;
							break;
						}
					}
					
					for(var i=0;i<BaudRate.options.length;i++)
					{                
						if (BaudRate.options[i].value == g_PtzDecoderInfoObj.dwBaudRate )
						{
							BaudRate.selectedIndex=i;
							break;
						}
					}
					
					for(var i=0;i<DataBit.options.length;i++)
					{                
						if (DataBit.options[i].value == g_PtzDecoderInfoObj.byDataBit )
						{
							DataBit.selectedIndex=i;
							break;
						}
					}
				}
			}
			else
			{
				//alert("get PtzDecoder info fail");
			}
		};
	
	g_PtzDecoderInfoObj.method = "POST";
	g_PtzDecoderInfoObj.asynchrony = true;	
	g_PtzDecoderInfoObj.username = g_UserName;
	g_PtzDecoderInfoObj.password = g_Password;
	g_PtzDecoderInfoObj.CurrentChannelId = $("PtzChannelNo").value;
	
	GetPtzDecoderInfo(g_PtzDecoderInfoObj);	
}

function SendSetPtzDecoderInfo()
{
	g_PtzDecoderInfoObj.wDecoderAddress = document.getElementById("PTZAddress").value;
	g_PtzDecoderInfoObj.byParity = document.getElementById("Parity").value;
	g_PtzDecoderInfoObj.szDecoderName = document.getElementById("selectProtocol").value;
	g_PtzDecoderInfoObj.dwBaudRate = document.getElementById("BaudRate").value;
	g_PtzDecoderInfoObj.byDataBit = document.getElementById("DataBit").value;
	
	g_PtzDecoderInfoObj.callbackfunction = function(Obj){
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_PtzDecoderInfoObj.method = "POST";
	g_PtzDecoderInfoObj.asynchrony = true;	
	g_PtzDecoderInfoObj.username = g_UserName;
	g_PtzDecoderInfoObj.password = g_Password;
	g_PtzDecoderInfoObj.CurrentChannelId = $("PtzChannelNo").value;
	
	SetPtzDecoderInfo(g_PtzDecoderInfoObj);	
}


/*==========================================
============================================
==										  ==
==			音频参数设置代码段  		  ==
==										  ==
==			2011.03.08	By angel		  ==
============================================
==========================================*/

//获取音频参数
var g_AudioInfoObj = new AudioInfoObj();
function SendGetAudioInfo()
{
	g_AudioInfoObj.callbackfunction = function(Obj){
			 g_AudioInfoObj = Obj;
			 
			if(g_AudioInfoObj.result )
			{
				//音频放大倍数
				if( g_AudioInfoObj.dwLampFactor >=1 && g_AudioInfoObj.dwLampFactor <=10)
				{
					document.getElementById("Audio").value = g_AudioInfoObj.dwLampFactor;
				}
				else
				{
					document.getElementById("Audio").value = 1;
				}
				
				//语音格式
				for(j=0; j< document.getElementById("AudioFormat").options.length; j++ )
				{
					if( document.getElementById("AudioFormat").options[j].value == g_AudioInfoObj.byCompressFormat )
					{
						document.getElementById("AudioFormat").selectedIndex = j ;
						break;
					}
				}
				
				document.getElementById("AudioMode").selectedIndex = g_AudioInfoObj.byChannelMode;	//音频模式
			}
			else
			{
				//alert("get PtzDecoder info fail!");
			}
		};
	
	g_AudioInfoObj.method = "POST";
	g_AudioInfoObj.asynchrony = true;
	g_AudioInfoObj.username = g_UserName;
	g_AudioInfoObj.password = g_Password;
	g_AudioInfoObj.channel = $("AudioChannelNo").value;
	
	GetAudioInfo(g_AudioInfoObj);	
}

function SendSetAudioInfo()
{
	
	g_AudioInfoObj.dwLampFactor = document.getElementById("Audio").value;
	g_AudioInfoObj.byCompressFormat = document.getElementById("AudioFormat").value;
	g_AudioInfoObj.byChannelMode = document.getElementById("AudioMode").selectedIndex;
	
	g_AudioInfoObj.callbackfunction = function(Obj){
			if( Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
			
		};
	
	g_AudioInfoObj.method = "POST";
	g_AudioInfoObj.asynchrony = true;
	g_AudioInfoObj.username = g_UserName;
	g_AudioInfoObj.password = g_Password;
	g_AudioInfoObj.channel = $("AudioChannelNo").value;
	
	SetAudioInfo(g_AudioInfoObj);

}

/*==========================================
============================================
==										  ==
==				模拟输出代码段  		  ==
==										  ==
==			2011.03.08	By angel		  ==
============================================
==========================================*/

var g_VideoOutObj = new VideoOutObj();
function SendGetVideoOut()
{
	g_VideoOutObj.callbackfunction = function(Obj){
			 g_VideoOutObj = Obj;
			
			if(g_VideoOutObj.result )
			{
				var EnableOut   = g_VideoOutObj.byEnableVideoOut;
				var OutMode     = g_VideoOutObj.byVideoOutMode;
				
				if( EnableOut == 1 )
				{
					document.getElementById("EnableOut").checked = "checked";
					document.getElementById("OutMode").disabled = "";
				}
				else
				{
					document.getElementById("EnableOut").checked = "";
					document.getElementById("OutMode").disabled = "disabled";
				}
			
				for(j=0; j< document.getElementById("OutMode").options.length; j++ )
				{
					if( document.getElementById("OutMode").options[j].value == OutMode )
					{
						document.getElementById("OutMode").selectedIndex = j ;
						break;
					}
				}
				
				
			}
			else
			{
				//alert("get VideoOut info fail!");
			}
		};
	
	g_VideoOutObj.method = "POST";
	g_VideoOutObj.asynchrony = true;
	g_VideoOutObj.username = g_UserName;
	g_VideoOutObj.password = g_Password;
	g_VideoOutObj.CurrentChannelId = $("VideoOutChannel").value;
	
	GetVideoOut(g_VideoOutObj);
}

function SendSetVideoOut()
{
	g_VideoOutObj.byEnableVideoOut = (document.getElementById("EnableOut").checked == true ) ? 1 : 0;
	g_VideoOutObj.byVideoOutMode = document.getElementById("OutMode").value;
	
	g_VideoOutObj.callbackfunction = function(Obj){
		
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_VideoOutObj.method = "POST";
	g_VideoOutObj.asynchrony = true;
	g_VideoOutObj.username = g_UserName;
	g_VideoOutObj.password = g_Password;
	g_VideoOutObj.CurrentChannelId = $("VideoOutChannel").value;
	
	SetVideoOut(g_VideoOutObj);
}


function RefreshVideoOut()
{
	if( document.getElementById("EnableOut").checked )
	{
		document.getElementById("OutMode").disabled = "";
	}
	else
	{
		document.getElementById("OutMode").disabled = "disabled";
	}
}

/*==========================================
============================================
==										  ==
==			通道参数设置代码段  	      ==
==										  ==
==			2011.03.17	By angel		  ==
============================================
==========================================*/

function InitChannelInfo()
{
	var str = '<table width="100%" height="100%" border="1" cellspacing="0">\
		<tr><td width="10%" height="30" align="center"><span id="ChannelId">ID</span></td>\
		<td width="20%" align="center"><span id="ChannelName">'+ a_ChannelName +'</span></td>\
		<td width="25%" align="center"><span id="ChannelAddress">'+ a_ChannelAddress +'</span></td>\
		<td align="center"><span id="ChannelPort">'+ a_ChannelPort +'</span></td>\
		<td width="" align="center"><span id="ChannelUsername">'+ a_ChannelUsername +'</span></td>\
		<td width="" align="center"><span id="ChannelPassword">'+ a_ChannelPassword +'</span></td>\
		<td width="" align="center"><span id="ChannelSubStream">'+ a_ChannelSubStream +'</span><input id="selectsubstream" type="checkbox" onclick="SelectAllChannel(\'SubStream\');" /></td>\
		<td width="" align="center"><span id="ChannelEnable">'+ a_ChannelEnable +'</span><input id="selectchannel" type="checkbox" onclick="SelectAllChannel(\'Channel\');" /></td>\
		</tr>';
	
	for(var i=0; i<g_ChannelInfoObj.ChannelTotal; i++ )
	{
		str += '<tr onmouseover="ShowShadowsEx(0,\'trChannelInfo'+ i +'\');" onmouseout="ShowShadowsEx(1,\'trChannelInfo'+ i +'\');" onclick="ShowShadowsEx(2,\'trChannelInfo'+ i +'\');" id="trChannelInfo'+ i +'">'
		str += '<td align="center" style="width:30px;" id="ChannelId'+ i +'">'+ (g_ChannelInfoObj.ChannelInfo[i].ChannelId+1) +'</td>';	
		str += '<td align="center"><input type="text" maxlength="15" style="width:100px; height:20px;" class="TextBoxNone" onfocus="this.className=\'ShowBorder\';" onblur="this.className=\'TextBoxNone\';" id="inputChannelName'+ i +'" value="'+ g_ChannelInfoObj.ChannelInfo[i].ChannelName +'" /></td>';	
		str += '<td align="center"><input type="text" maxlength="15" style="width:100px; height:20px;" class="TextBoxNone" onfocus="this.className=\'ShowBorder\';" onblur="this.className=\'TextBoxNone\';" id="inputChannelAddress'+ i +'" value="'+ g_ChannelInfoObj.ChannelInfo[i].sAddress +'" /></td>';	
		str += '<td align="center"><input type="text" maxlength="5" style="width:40px; height:20px;" class="TextBoxNone" onfocus="this.className=\'ShowBorder\';" onblur="this.className=\'TextBoxNone\';" id="inputChannelPort'+ i +'" value="'+ g_ChannelInfoObj.ChannelInfo[i].wPort +'" /></td>';	
		str += '<td align="center"><input type="text" maxlength="20" style="width:80px; height:20px;" class="TextBoxNone" onfocus="this.className=\'ShowBorder\';" onblur="this.className=\'TextBoxNone\';" id="inputChannelUsername'+ i +'" value="'+ g_ChannelInfoObj.ChannelInfo[i].sUserName +'" /></td>';
		str += '<td align="center"><input type="password" style="width:80px; height:20px;" class="TextBoxNone" onfocus="this.className=\'ShowBorder\';" onblur="this.className=\'TextBoxNone\';" id="inputChannelPassword'+ i +'" value="'+ g_ChannelInfoObj.ChannelInfo[i].sPassword +'" /></td>';
		
		//判断是否带从码流
		if( g_ChannelInfoObj.ChannelInfo[i].bySubStream == "1" )
		{
			str += '<td width="22%" align="center"><input type="checkbox" id="inputChannelSubStream'+ i +'" checked="checked" /></td>';
		}
		else
		{
			str += '<td width="22%" align="center"><input type="checkbox" id="inputChannelSubStream'+ i +'" / ></td>';
		}
		
		//判断该通道是否已经启用
		if( g_ChannelInfoObj.ChannelInfo[i].ChannelEnable == "1" )
		{
			str += '<td width="20%" align="center"><input type="checkbox" id="inputChannelEnable'+ i +'" checked="checked" /></td></tr>';	
		}
		else
		{
			str += '<td width="20%" align="center"><input type="checkbox" id="inputChannelEnable'+ i +'" / ></td></tr>';	
		}
	}
	
	document.getElementById("trChannelInfo").innerHTML = str + '</table>';	
}

function SelectAllChannel(flag)
{
	if(flag == "Channel")
	{
		if( document.getElementById("selectchannel").checked )
		{
			for(var i=0; i<g_ChannelInfoObj.ChannelTotal; i++)
			{
				document.getElementById("inputChannelEnable"+i).checked = "checked";
			}
		}
		else
		{
			for(var i=0; i<g_ChannelInfoObj.ChannelTotal; i++)
			{
				document.getElementById("inputChannelEnable"+i).checked = "";
			}
		}
	}
	
	if(flag == "SubStream")
	{
		if( document.getElementById("selectsubstream").checked )
		{
			for(var i=0; i<g_ChannelInfoObj.ChannelTotal; i++)
			{
				document.getElementById("inputChannelSubStream"+i).checked = "checked";
			}
		}
		else
		{
			for(var i=0; i<g_ChannelInfoObj.ChannelTotal; i++)
			{
				document.getElementById("inputChannelSubStream"+i).checked = "";
			}
		}
	}
}

function SendSetChannelInfo()
{
	for(var i=0; i<g_ChannelInfoObj.ChannelTotal; i++ )
	{
		g_ChannelInfoObj.ChannelInfo[i].ChannelName = (document.getElementById("inputChannelName"+i).value != "") ? document.getElementById("inputChannelName"+i).value : " ";
		g_ChannelInfoObj.ChannelInfo[i].sAddress = (document.getElementById("inputChannelAddress"+i).value != "") ? document.getElementById("inputChannelAddress"+i).value : " ";
		g_ChannelInfoObj.ChannelInfo[i].wPort = (document.getElementById("inputChannelPort"+i).value != "") ? document.getElementById("inputChannelPort"+i).value : " ";
		g_ChannelInfoObj.ChannelInfo[i].sUserName = (document.getElementById("inputChannelUsername"+i).value != "") ? document.getElementById("inputChannelUsername"+i).value : " ";
		g_ChannelInfoObj.ChannelInfo[i].sPassword = (document.getElementById("inputChannelPassword"+i).value != "") ? document.getElementById("inputChannelPassword"+i).value : " ";
		
		if(document.getElementById("inputChannelSubStream"+i).checked)		//是否带从码流  1--用   0--不用
		{
			g_ChannelInfoObj.ChannelInfo[i].bySubStream = 1;
		}
		else
		{
			g_ChannelInfoObj.ChannelInfo[i].bySubStream = 0;
		}
		
		if(document.getElementById("inputChannelEnable"+i).checked)		//是否启用通道  1--启用   0--不启用
		{
			g_ChannelInfoObj.ChannelInfo[i].ChannelEnable = 1;
		}
		else
		{
			g_ChannelInfoObj.ChannelInfo[i].ChannelEnable = 0;
		}
	}
		
	g_ChannelInfoObj.callbackfunction = function(Obj){
			
			if( Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
		
	g_ChannelInfoObj.method = "POST";
	g_ChannelInfoObj.asynchrony = true;
	g_ChannelInfoObj.username = g_UserName;
	g_ChannelInfoObj.password = g_Password;
	
	SetChannelInfo(g_ChannelInfoObj);
}

//响应鼠标事件  实时改变表格颜色
var SelectedTr = "";
function ShowShadowsEx(way,which)
{
	var WhichTr = document.getElementById(which);
	switch(way)
	{
		case 0:		//onmouseover
			WhichTr.className = "color1";
			WhichTr.style.cursor = "hand";
			
			break;	
		case 1:		//onmouseout
			if( which != SelectedTr )
			{
				WhichTr.className = "color2";
			}
			break;	
		case 2:		//onclick
			if( SelectedTr != "" )
			{
				document.getElementById(SelectedTr).className = "color2";
			}
			SelectedTr = which;
			WhichTr.className = "color1";
			document.getElementById("btnSaveChannel").disabled = "";
			break;			
	}
}



