function $(id)
{
	return document.getElementById(id);
}

//禁用鼠标右键
document.oncontextmenu = function() 
{ 
	return false; 
};

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
==				显示帮助信息代码段  		  		==
==										  ==
==			2011.12.27	By angel		  ==
============================================
==========================================*/
//显示帮助信息
var g_HelpInfoInterval = "";
var g_clientW = 0;
var g_clientH = 0;
function ShowHelpInfoDiv(str)
{
	if( $("HelpInfoDiv").style.display != "none")
	{
		return false;
	}
	
	g_bHelpDivFlag = false;
	clearInterval(g_HelpInfoInterval);
	
	g_clientW = parseInt(document.body.clientWidth);
	g_clientH = parseInt( document.documentElement.clientHeight);
	var div = "<div style='width:100%; height:16px; margin:-6px 0 0 0; text-align:right;'><img src='images/closehelpinfodiv.gif' style='cursor:pointer;' height=18 width=18 onclick='g_bHelpDivFlag=true;' /></div>";
	var img = "<img src='images/helpico1.gif' />";
	var obj = $("HelpInfoDiv");
	var string = "";
		
	switch(str)
	{
		case "imgManageCenter":
			string = g_sManageCenter;
			break;
			
		case "imgNetworkParameter" :
			string = g_sNetworkParameter;
			break;
			
		case "imgRemoteWebport" :
			string = g_sRemoteWebport;
			break;
			
		case "imgNtpAddress" :
			string = g_sNtpAddress;
			break;
			
		default:
			obj.style.display = "none";
			return false;
			break;
	}
	
	g_HelpInfoInterval = setInterval("MoveHelpInfoDiv()",10);
	
	$("HelpInfoDivShow").innerHTML = div + img + "&nbsp;" + string;
	//obj.style.pixelLeft = (g_clientW-obj.style.pixelWidth)/2;
	obj.style.pixelLeft = 100;
	obj.style.pixelTop	= -obj.style.pixelHeight;
	obj.style.display = "";
	g_iHelpDivHeight = obj.style.pixelTop;
}

var g_iHelpDivHeight = 0;
var g_HideHelpInfoInterval = "";
function MoveHelpInfoDiv()
{
	g_iHelpDivHeight = g_iHelpDivHeight + 5;
	g_bHelpDivFlag = false;
	
	$("HelpInfoDiv").style.pixelTop	= g_iHelpDivHeight;
	
	if( g_iHelpDivHeight >= 0)
	{
		clearInterval(g_HelpInfoInterval);
		
		setTimeout('CheckHelpDivFlag()',500);
	}
}

function CheckHelpDivFlag()
{
	if( g_bHelpDivFlag )
	{
		g_HideHelpInfoInterval = setInterval("TriggerTimerHideDiv()",10);
	}
	else
	{
		if( $("HelpInfoDiv").style.display != "none")
		{
			setTimeout('CheckHelpDivFlag()',500);
		}
	}
}

var g_bHelpDivFlag = false;
function TriggerTimerHideDiv()
{
	var obj = $("HelpInfoDiv");
	
	if( obj.style.pixelTop <= 200 && g_bHelpDivFlag)
	{
		
		g_iHelpDivHeight = g_iHelpDivHeight + 25;
		obj.style.pixelTop	= g_iHelpDivHeight;
	}
	else if(g_bHelpDivFlag)
	{
		clearInterval(g_HideHelpInfoInterval);
		g_bHelpDivFlag = false;
		obj.style.display = "none";
	}		
}

function ChangelTheHelpDivFalg(flag)
{
	if(flag == 1)
	{
		g_bHelpDivFlag = true;
	}
	else
	{
		g_bHelpDivFlag = false;
	}
}

/*==========================================
============================================
==										  ==
==				RTSP代码段  	     	  ==
==										  ==
==			2011.03.04	By angel		  ==
============================================
==========================================*/

//获取RTSP参数
var g_RtspInfoObj = new NetWorkObj();
function SendGetRtspInfo()
{
	g_RtspInfoObj.callbackfunction = function(Obj){
			g_RtspInfoObj = Obj;
			
			if(Obj.result )
			{
				//初始化RTSP页面参数
				InitRtspInfo();
			}
			else
			{
				//alert("get rtsp info fail");
			}
		};
	
	g_RtspInfoObj.method = "POST";
	g_RtspInfoObj.asynchrony = true;
	g_RtspInfoObj.username = g_UserName;
	g_RtspInfoObj.password = g_Password;
	g_RtspInfoObj.CurrentChannelId = g_CurrentChannelNum;
	
	GetNetWorkInfo(g_RtspInfoObj);
}

function SendSetRtspInfo()
{
	if( isNaN($("RtspPort").value) ) 
	{
		alert(a_ParameterInvalid);
		$("RtspPort").value = "";
		$("RtspPort").focus();
		return false;
	}
	
	g_RtspInfoObj.dwEnableRtsp = $("EnableRtsp").checked ? 1:0;
	g_RtspInfoObj.wRtspMode = $("RtspMode").selectedIndex;
	g_RtspInfoObj.wRtspPort = $("RtspPort").value;
	g_RtspInfoObj.sMajorStream = $("MainStream").value;
	g_RtspInfoObj.sMinorStream = $("MinorStream").value;

	g_RtspInfoObj.callbackfunction = function(Obj){
		
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_RtspInfoObj.method = "POST";
	g_RtspInfoObj.asynchrony = true;
	g_RtspInfoObj.username = g_UserName;
	g_RtspInfoObj.password = g_Password;
	g_RtspInfoObj.CurrentChannelId = g_CurrentChannelNum;
	
	SetNetWorkInfo(g_RtspInfoObj);
}

function InitRtspInfo()
{
	if(g_RtspInfoObj.dwEnableRtsp == 1)
	{
		$("EnableRtsp").checked = true;
	}
	else
	{
		$("EnableRtsp").checked = "";
		$("RtspMode").disabled = "disabled";
		$("RtspPort").disabled = "disabled";
		$("MainStream").disabled = "disabled";
		$("MinorStream").disabled = "disabled";					
	}

	if(g_RtspInfoObj.wRtspPort == 0)
	{
		g_RtspInfoObj.wRtspPort = 554;
	}
	$("RtspMode").selectedIndex = g_RtspInfoObj.wRtspMode;
	
	$("RtspPort").value = g_RtspInfoObj.wRtspPort;
	
	$("MainStream").value = g_RtspInfoObj.sMajorStream;
	
	$("MinorStream").value = g_RtspInfoObj.sMinorStream;
}

function SetRtsp()
{
	if( $("EnableRtsp").checked == false )
	{
		$("RtspPort").disabled = "disabled";
		$("RtspMode").disabled = "disabled";
		$("MainStream").disabled = "disabled";
		$("MinorStream").disabled = "disabled";
	}
	else
	{
		$("RtspPort").disabled = "";
		$("RtspMode").disabled = "";	
		$("MainStream").disabled = "";
		$("MinorStream").disabled = "";
	}
}


/*==========================================
============================================
==										  ==
==			网络参数设置代码段  		  ==
==										  ==
==			2011.03.07	By angel		  ==
============================================
==========================================*/

//获取网络参数
var g_NetWorkInfoObj = new NetWorkObj();
function SendGetNetWorkInfo()
{
	g_NetWorkInfoObj.callbackfunction = function(Obj){
			g_NetWorkInfoObj = Obj;
			
			if(Obj.result )
			{
				//初始化RTSP页面参数
				InitNetWorkInfo();	
			}
			else
			{
				//alert("get net info fail");
			}
		};
	
	g_NetWorkInfoObj.method = "POST";
	g_NetWorkInfoObj.asynchrony = true;
	g_NetWorkInfoObj.username = g_UserName;
	g_NetWorkInfoObj.password = g_Password;
	g_NetWorkInfoObj.CurrentChannelId = g_CurrentChannelNum;
	
	GetNetWorkInfo(g_NetWorkInfoObj);
}

function SendSetNetWorkInfo()
{
	//检查IP是否有效
	var strIp = $("Ip").value;
	if( Ipv4IsValid(strIp) == false )
	{
		alert(a_ParameterInvalid);
		$("Ip").value = "";
		$("Ip").focus();
		return false;
	}
	
	//checke the gateway
	strIp = $("GateWay").value ;
	if( Ipv4IsValid(strIp) == false )
	{
		alert(a_ParameterInvalid);
		$("GateWay").value = "";
		$("GateWay").focus();
		return false;
	}
	
	//check the manager ip 
	strIp = $("CenterIp").value ;
	if( Ipv4IsValid(strIp) == false )
	{
		alert(a_ParameterInvalid);
		$("CenterIp").value = "";
		$("CenterIp").focus();
		return false;
	}	
	
	//check the submask
	strIp = $("Mask").value ;
	if( GateWayIsValid(strIp) == false )
	{
		alert(a_ParameterInvalid);
		$("Mask").value = "";
		$("Mask").focus();
		return false;
	}
	
	strIp = $("DNS").value;
	if(Ipv4IsValid(strIp) == false)
	{
		alert(a_ParameterInvalid);
		$("DNS").value = "";
		$("DNS").focus();
		return false;
	}
	
	strIp = $("DNS2").value;
	if(Ipv4IsValid(strIp) == false)
	{
		alert(a_ParameterInvalid);
		$("DNS2").value = "";
		$("DNS2").focus();
		return false;
	}
	
	if( $("EnableCenter").checked && isNaN($("CenterPort").value) )
	{
		alert(a_ParameterInvalid);
		$("CenterPort").value = "";
		$("CenterPort").focus();
		return false;
	}
	
	if( ($("CenterPort").value <= 0 || $("CenterPort").value >65535) && $("EnableCenter").checked || $("CenterPort").value.indexOf(".")>=0 )
	{
		alert(a_ParameterInvalid);
		$("CenterPort").value = "";
		$("CenterPort").focus();
		return false;
	}
	
	if( isNaN($("DataPort").value) )
	{
		alert(a_ParameterInvalid);
		$("DataPort").value = "";
		$("DataPort").focus();
		return false;
	}
	
	if( isNaN($("Webport").value) )
	{
		alert(a_ParameterInvalid);
		$("Webport").value = "";
		$("Webport").focus();
		return false;
	}
	
	if( isNull( $("CenterPort").value) && $("EnableCenter").checked  )
	{
		alert(a_ParameterInvalid);
		 $("CenterPort").focus();
		 return false;
	}
	
	if( $("CenterPort").value.indexOf(".") >=0 && $("EnableCenter").checked )
	{
		alert(a_ParameterInvalid);
		$("CenterPort").value = "";
		$("CenterPort").focus();
		return false;
	}
		
	if( isNull($("DataPort").value) )
	{
		alert(a_ParameterInvalid);
		$("DataPort").value = "";
		$("DataPort").focus();
		return false;
	}
	
	if( $("DataPort").value.indexOf(".") >= 0 )
	{
		alert(a_ParameterInvalid);
		$("DataPort").value = "";
		$("DataPort").focus();
		return false;
	}
	
	if( isNull($("Webport").value) )
	{
		alert(a_ParameterInvalid);
		$("Webport").value = "";
		$("Webport").focus();
		return false;
	}
	
	if( $("DataPort").value <=0 ||  $("DataPort").value >65535  )
	{
		alert(a_ParameterInvalid);
		$("DataPort").value = "";
		$("DataPort").focus();
		return false;
	}
	
	if( $("Webport").value <=0 ||  $("Webport").value >65535  || $("Webport").value.indexOf(".") >= 0)
	{
		alert(a_ParameterInvalid);
		$("Webport").value = "";
		$("Webport").focus();
		return false;
	}
	
	var EnableCenter = 0;
	var EnableDDNS = 0;
	var EnablePPPOE = 0;
	if( $("EnableCenter").checked )
	{
		EnableCenter = 1;
	}
	
	if( $("EnablePPPOE").checked)
	{
		EnablePPPOE = 1;
	}
	if( $("EnableDDNS").checked )
	{
		EnableDDNS = 1;
	}
	
	g_NetWorkInfoObj.sDVSIP 			= ($("Ip").value != "") ? $("Ip").value : " ";
	g_NetWorkInfoObj.sDVSIPMask 		= $("Mask").value;
	g_NetWorkInfoObj.wDHCP				= $("UseDhcp").checked ? 1 : 0;
	g_NetWorkInfoObj.sDNSIP 			= $("DNS").value;
	g_NetWorkInfoObj.sDNSIP2 			= $("DNS2").value;
	g_NetWorkInfoObj.sGatewayIP 		= $("GateWay").value;
	g_NetWorkInfoObj.dwManageHost 		= EnableCenter;
	g_NetWorkInfoObj.sManageHostIP 		= $("CenterIp").value;
	g_NetWorkInfoObj.wManageHostPort 	= $("CenterPort").value;
	g_NetWorkInfoObj.dwPPPOE 			= EnablePPPOE;
	g_NetWorkInfoObj.sPPPoEUser 		= $("PPPOEUser").value;
	g_NetWorkInfoObj.dwDDNS 			= EnableDDNS;
	g_NetWorkInfoObj.sDDNSServerName 	= $("DDNSName").value;
	g_NetWorkInfoObj.sDDNSServerName2 	= $("DDNSName2").value;
	g_NetWorkInfoObj.sDDNSUser 			= $("DDNSUser").value;
	g_NetWorkInfoObj.sDDNSPassword 		= $("DDNSPwd").value;
	g_NetWorkInfoObj.sDDNSName 			= $("DDNSHost").value;
	g_NetWorkInfoObj.sPPPoEUser 		= $("ConnectInterval").value;
	g_NetWorkInfoObj.wDVSPort 			= $("DataPort").value;
	g_NetWorkInfoObj.wHttpPort 			= $("Webport").value;
	
	g_NetWorkInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_NetWorkInfoObj.method = "POST";
	g_NetWorkInfoObj.asynchrony = true;
	g_NetWorkInfoObj.username = g_UserName;
	g_NetWorkInfoObj.password = g_Password;
	g_NetWorkInfoObj.CurrentChannelId = g_CurrentChannelNum;
	
	SetNetWorkInfo(g_NetWorkInfoObj);
}

function InitNetWorkInfo()
{
	$("Ip").value 				= g_NetWorkInfoObj.sDVSIP;
	$("Mask").value 			= g_NetWorkInfoObj.sDVSIPMask;
	$("DNS").value 				= g_NetWorkInfoObj.sDNSIP;
	$("DNS2").value 			= g_NetWorkInfoObj.sDNSIP2;
	$("GateWay").value 			= g_NetWorkInfoObj.sGatewayIP;
	$("CenterIp").value 		= g_NetWorkInfoObj.sManageHostIP;
	$("CenterPort").value 		= g_NetWorkInfoObj.wManageHostPort;
	$("PPPOEUser").value 		= g_NetWorkInfoObj.sPPPoEUser;
	$("DDNSName").value 		= g_NetWorkInfoObj.sDDNSServerName;
	$("DDNSName2").value 		= g_NetWorkInfoObj.sDDNSServerName2;
	$("DDNSUser").value 		= g_NetWorkInfoObj.sDDNSUser;
	$("DDNSPwd").value 			= g_NetWorkInfoObj.sDDNSPassword;
	$("DDNSHost").value 		= g_NetWorkInfoObj.sDDNSName;
	$("ConnectInterval").value 	= g_NetWorkInfoObj.sPPPoEUser;
	$("DataPort").value 		= g_NetWorkInfoObj.wDVSPort;
	$("Webport").value 			= g_NetWorkInfoObj.wHttpPort;
	
	if(g_NetWorkInfoObj.dwManageHost == 1)
	{
		$("EnableCenter").checked = true;
	}
	else
	{
		$("EnableCenter").checked = false;
	}
	
	if(g_NetWorkInfoObj.dwPPPOE == 1)
	{
		$("EnablePPPOE").checked = true;
	}
	else
	{
		$("EnablePPPOE").checked = false;
	}
		
	if(g_NetWorkInfoObj.dwDDNS == 1)
	{
		$("EnableDDNS").checked = true;
	}
	else
	{
		$("EnableDDNS").checked = false;
	}
	
	if(g_NetWorkInfoObj.wDHCP == 1)
	{
		$("UseDhcp").checked = true;
	}
	else
	{
		$("UseDhcp").checked = false;
	}
	
	//初始化页面
	RefreshDDNS();
	RefreshCenter();
	RefreshNetwork();
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

function RefreshNetwork()
{
	if( $("UseDhcp").checked )
	{
		$("DNS2").disabled = true;
		$("DNS").disabled = true;
		$("GateWay").disabled = true;
		$("Mask").disabled = true;
		$("Ip").disabled = true;
	}
	else
	{
		$("DNS2").disabled = false;
		$("DNS").disabled = false;
		$("GateWay").disabled = false;
		$("Mask").disabled = false;
		$("Ip").disabled = false;
	}
}

function RefreshCenter()
{
	if( $("EnableCenter").checked )
	{
		$("CenterIp").disabled="";
		$("CenterPort").disabled="";
	}
	else
	{
		$("CenterIp").disabled="disabled";
		$("CenterPort").disabled="disabled";
	}
}

function RefreshPPPOE()
{
	if( $("EnablePPPOE").checked )
	{
		$("PPPOEUser").disabled="";
		$("PPPOEPwd").disabled="";
	}
	else
	{
		$("PPPOEUser").disabled="disabled";
		$("PPPOEPwd").disabled="disabled";
	}
}

function RefreshDDNS()
{
 	var TimeOut = 0;
	if( $("EnableDDNS").checked )
	{
		$("DDNSName").disabled="";
		$("DDNSName2").disabled="";
		$("DDNSUser").disabled="";
		$("DDNSPwd").disabled="";
		$("DDNSHost").disabled="";
		$("ConnectInterval").disabled="";
		
		for( var i = 0; i< $("ConnectInterval").options.length; i++ )
		{
			if( $("ConnectInterval").options[i].value == (TimeOut/60) )
			{
				$("ConnectInterval").selectedIndex = i;
				//alert(TimeOut);
				break;
			}
		}
	}
	else
	{
		$("DDNSName").disabled="disabled";
		$("DDNSName2").disabled="disabled";
		$("DDNSUser").disabled="disabled";
		$("DDNSPwd").disabled="disabled";
		$("DDNSHost").disabled="disabled";
		$("ConnectInterval").disabled="disabled";
	}
}

/*==========================================
============================================
==										  ==
==			NTP参数设置代码段  			  ==
==										  ==
==			2011.03.09	By angel		  ==
============================================
==========================================*/

var g_NtpInfoObj = new NtpInfoObj();
function SendGetNtpInfo()
{
	g_NtpInfoObj.callbackfunction = function(Obj){
			g_NtpInfoObj = Obj;
			if(Obj.result )
			{
				if(g_NtpInfoObj.dwEnableNtp > 0 )
				{
					$("EnableNtp").checked = true;
					$("NtpAddress").disabled = "";
					$("TimeInterval").disabled = "";
				}
				else
				{
					$("EnableNtp").checked = false;
					$("NtpAddress").disabled = "disabled";
					$("TimeInterval").disabled = "disabled";
				}
				
				$("NtpAddress").value = g_NtpInfoObj.strNTPServer;
				
				for(var t=0;t<$("TimeInterval").options.length; t++)
				{
					if($("TimeInterval").options[t].value == g_NtpInfoObj.dwNtpTime)
					{
						$("TimeInterval").selectedIndex = t;
						break;
					}
				}
			}
			else
			{
				//alert("get Restore fail!");
			}
		};
	
	g_NtpInfoObj.method = "POST";
	g_NtpInfoObj.asynchrony = true;
	g_NtpInfoObj.username = g_UserName;
	g_NtpInfoObj.password = g_Password;

	GetNtpInfo(g_NtpInfoObj);
}

function SendSetNtpInfo()
{
	var EnableNtp = $("EnableNtp").checked ? 1:0;
	
	if(EnableNtp)
	{
		if( Ipv4IsValid($("NtpAddress").value) == false )
		{
			alert(a_ParameterInvalid);
			$("NtpAddress").value = "";
			if(!$("NtpAddress").disabled)
			{
				$("NtpAddress").focus();
			}
			return false;
		}	
	}
	
	g_NtpInfoObj.dwEnableNtp = EnableNtp;
	g_NtpInfoObj.strNTPServer = $("NtpAddress").value;
	g_NtpInfoObj.dwNtpTime = $("TimeInterval").value;
	
	g_NtpInfoObj.callbackfunction = function(Obj){
		
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_NtpInfoObj.method = "POST";
	g_NtpInfoObj.asynchrony = true;
	g_NtpInfoObj.username = g_UserName;
	g_NtpInfoObj.password = g_Password;
	
	SetNtpInfo(g_NtpInfoObj);
}

function SetNtp()
{
	if( $("EnableNtp").checked == false )
	{
		$("NtpAddress").disabled = "disabled";
		$("TimeInterval").disabled = "disabled";
	}
	else
	{
		$("NtpAddress").disabled = "";
		$("TimeInterval").disabled = "";
	}
}

//检测ntp服务ip与本机ip是否相同
function CheckTheNtpValue()
{
	if($("NtpAddress").value == g_NetWorkInfoObj.sDVSIP )
	{
		alert(a_NtpNote);
		$("NtpAddress").value = g_NtpInfoObj.strNTPServer;
	}
}

/*==========================================
============================================
==										  ==
==			心跳包参数设置代码段 		  ==
==										  ==
==			2011.06.01	By angel		  ==
============================================
==========================================*/

var g_LiveHeartInfoObj = new LiveHeartInfoObj();
function SendGetLiveHeartInfo()
{
	g_LiveHeartInfoObj.callbackfunction = function(Obj){
			g_LiveHeartInfoObj = Obj;
			
			if(Obj.result )
			{
				//是否启用心跳包
				if( Obj.byEnableLiveHeart == 1 )
				{
					$("EnableLiveHeart").checked = true;
				}
				else
				{
					$("EnableLiveHeart").checked = false;
				}
				
				SetLiveHeart();
				
				//设置心跳包发送模式
				for(var t=0;t<$("LiveMode").options.length; t++)
				{
					if($("LiveMode").options[t].value == Obj.byLiveHeartMode)
					{
						$("LiveMode").selectedIndex = t;
						break;
					}
				}
				
				//发送心跳间隔时间
				for(var t=0;t<$("SpacingInterval").options.length; t++)
				{
					if($("SpacingInterval").options[t].value == Obj.wLiveTime)
					{
						$("SpacingInterval").selectedIndex = t;
						break;
					}
				}
				
				//远程管理主机地址
				$("ServiceAds").value = Obj.sServerAddress;
				
				//远程管理主机端口号
				$("ServicePort").value = Obj.dwServerPort;
				
			}
			else
			{
				//alert("get LiveHeart fail!");
			}
		};
	
	g_LiveHeartInfoObj.method = "POST";
	g_LiveHeartInfoObj.asynchrony = true;
	g_LiveHeartInfoObj.username = g_UserName;
	g_LiveHeartInfoObj.password = g_Password;

	GetLiveHeartInfo(g_LiveHeartInfoObj);
	
}


function SendSetLiveHeartInfo()
{
	if( isNaN($("ServicePort").value) )
	{
		alert(a_ParameterInvalid);
		$("ServicePort").value = "";
		$("ServicePort").focus();
		return false;
	}
	
	if( isNull( $("ServiceAds").value) && $("EnableLiveHeart").checked  )
	{
		alert(a_ParameterInvalid);
		 $("ServiceAds").focus();
		 return false;
	}
	
	if( isNull( $("ServicePort").value) && $("EnableLiveHeart").checked  )
	{
		alert(a_ParameterInvalid);
		 $("ServicePort").focus();
		 return false;
	}
	
	if( $("ServicePort").value.indexOf(".") >=0 )
	{
		alert(a_ParameterInvalid);
		$("ServicePort").value = "";
		$("ServicePort").focus();
		return false;
	}
	
	if( Ipv4IsValid($("ServiceAds").value) == false )
	{
		alert(a_ParameterInvalid);
		$("ServiceAds").value = "";
		$("ServiceAds").focus();
		return false;
	}
	
	g_LiveHeartInfoObj.byEnableLiveHeart = $("EnableLiveHeart").checked ? 1 : 0;
	g_LiveHeartInfoObj.byLiveHeartMode = $("LiveMode").value;
	g_LiveHeartInfoObj.wLiveTime = $("SpacingInterval").value;
	g_LiveHeartInfoObj.sServerAddress = $("ServiceAds").value; //远程管理主机地址
	g_LiveHeartInfoObj.dwServerPort = $("ServicePort").value;	//远程管理主机端口号
	
	g_LiveHeartInfoObj.callbackfunction = function(Obj){
		
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_LiveHeartInfoObj.method = "POST";
	g_LiveHeartInfoObj.asynchrony = true;
	g_LiveHeartInfoObj.username = g_UserName;
	g_LiveHeartInfoObj.password = g_Password;
	
	SetLiveHeartInfo(g_LiveHeartInfoObj);
}

function SetLiveHeart()
{
	if($("EnableLiveHeart").checked )
	{
		$("LiveMode").disabled = "";
		$("SpacingInterval").disabled = "";
		$("ServiceAds").disabled = "";
		$("ServicePort").disabled = "";
	}
	else
	{
		$("LiveMode").disabled = "disabled";
		$("SpacingInterval").disabled = "disabled";
		$("ServiceAds").disabled = "disabled";
		$("ServicePort").disabled = "disabled";
	}
}



/*==========================================
============================================
==										  ==
==				Wifi信息代码段  	      ==
==										  ==
==			2011.06.07	By angel		  ==
============================================
==========================================*/

var g_WifiInfoObj = new WifiInfoObj();
function SendGetWifiInfo()
{
	g_WifiInfoObj.callbackfunction = function(Obj){
			g_WifiInfoObj = Obj;
			
			if(Obj.result )
			{
				InitWifiPage();
			}
			else
			{
				//alert("get wifiInfo fail!");
			}
		};
	
	g_WifiInfoObj.method = "POST";
	g_WifiInfoObj.asynchrony = true;
	g_WifiInfoObj.username = g_UserName;
	g_WifiInfoObj.password = g_Password;
	
	GetWifiInfo(g_WifiInfoObj);
}

function SendSetWifiInfo()
{
	var strIp="",gateway="",dns1="",dns2="",mask="";
	
	g_WifiInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	strIp = $("WifiIpAddress").value;
	gateway = $("WifiGateway").value;
	dns1 = $("WifiDns1").value;
	dns2 = $("WifiDns2").value;
	mask = $("WifiSubnetMask").value ;
	
	if($("WifiIpMethod").value == 0)		//如果是自定义IP
	{
		//检查IP是否有效
		
		if( Ipv4IsValid(strIp) == false )
		{
			alert(a_ParameterInvalid);
			$("WifiIpAddress").value = "";
			$("WifiIpAddress").focus();
			return false;
		}
		
		//checke the gateway
		
		if( Ipv4IsValid(gateway) == false )
		{
			alert(a_ParameterInvalid);
			$("WifiGateway").value = "";
			$("WifiGateway").focus();
			return false;
		}
		
		
		if( Ipv4IsValid(dns1) == false )
		{
			alert(a_ParameterInvalid);
			$("WifiDns1").value = "";
			$("WifiDns1").focus();
			return false;
		}
		
		
		if( Ipv4IsValid(dns2) == false )
		{
			alert(a_ParameterInvalid);
			$("WifiDns2").value = "";
			$("WifiDns2").focus();
			return false;
		}
		
		
		if( Ipv4IsValid(gateway) == false )
		{
			alert(a_ParameterInvalid);
			$("WifiSubnetMask").value = "";
			$("WifiSubnetMask").focus();
			return false;
		}
	}
	
	if( isNaN($("WifiKeyExpiredTime").value) )
	{
		alert(a_ParameterInvalid);
		$("WifiKeyExpiredTime").value = "";
		$("WifiKeyExpiredTime").focus();
		return false;
	}
	
	if( $("EnableWifi").checked )
	{
		g_WifiInfoObj.byEnable = 1;
	}
	else
	{
		g_WifiInfoObj.byEnable = 0;
	}
	
	g_WifiInfoObj.byDhcp = $("WifiIpMethod").value;
	g_WifiInfoObj.sIpAddr = strIp;
	g_WifiInfoObj.sIpMaskAddr = mask;
	g_WifiInfoObj.sGatewayIP = gateway;
	g_WifiInfoObj.sDNSIP1 = dns1;
	g_WifiInfoObj.sDNSIP2 = dns2;
	g_WifiInfoObj.sSsid = $("WifiNetworkName").value;
	g_WifiInfoObj.sKey = $("WifiNetworkKey").value;
	g_WifiInfoObj.byKeyMgmt = $("WifiIdentityAuthentication").value;
	g_WifiInfoObj.byKeyType = $("WifiEncryption").value;
	g_WifiInfoObj.dwWpaPtkRekey = $("WifiKeyExpiredTime").value;
	
	g_WifiInfoObj.method = "POST";
	g_WifiInfoObj.asynchrony = true;
	g_WifiInfoObj.username = g_UserName;
	g_WifiInfoObj.password = g_Password;
	
	SetWifiInfo(g_WifiInfoObj);
 
}

function InitWifiPage()
{
	if(g_WifiInfoObj.byEnable == 1 )
	{
		$("EnableWifi").checked = true;
	}
	else
	{
		$("EnableWifi").checked = false;
	}
	
	$("WifiIpMethod").selectedIndex = g_WifiInfoObj.byDhcp;
	$("WifiIpAddress").value = g_WifiInfoObj.sIpAddr;
	$("WifiSubnetMask").value = g_WifiInfoObj.sIpMaskAddr;
	$("WifiGateway").value = g_WifiInfoObj.sGatewayIP;
	$("WifiDns1").value = g_WifiInfoObj.sDNSIP1;
	$("WifiDns2").value = g_WifiInfoObj.sDNSIP2;
	$("WifiNetworkName").value = g_WifiInfoObj.sSsid;
	$("WifiNetworkKey").value = g_WifiInfoObj.sKey;
	$("WifiIdentityAuthentication").selectedIndex = g_WifiInfoObj.byKeyMgmt;
	$("WifiEncryption").selectedIndex = g_WifiInfoObj.byKeyType;
	$("WifiKeyExpiredTime").value = g_WifiInfoObj.dwWpaPtkRekey;
	
	SetWifi();
}

function SetWifi()
{
	if($("EnableWifi").checked == false)
	{
		$("WifiIpMethod").disabled = "disabled";
		$("WifiIpAddress").disabled = "disabled";
		$("WifiSubnetMask").disabled = "disabled";
		$("WifiGateway").disabled = "disabled";
		$("WifiDns1").disabled = "disabled";
		$("WifiDns2").disabled = "disabled";
		$("WifiNetworkName").disabled = "disabled";
		$("WifiNetworkKey").disabled = "disabled";
		$("WifiIdentityAuthentication").disabled = "disabled";
		$("WifiEncryption").disabled = "disabled";
		$("WifiKeyExpiredTime").disabled = "disabled";
		//$("btnSaveWifi").disabled = "disabled";
		//$("btnRefreshWifi").disabled = "disabled";
	}
	else
	{
		$("WifiIpMethod").disabled = "";
		$("WifiIpAddress").disabled = "";
		$("WifiSubnetMask").disabled = "";
		$("WifiGateway").disabled = "";
		$("WifiDns1").disabled = "";
		$("WifiDns2").disabled = "";
		$("WifiNetworkName").disabled = "";
		$("WifiNetworkKey").disabled = "";
		$("WifiIdentityAuthentication").disabled = "";
		$("WifiEncryption").disabled = "";
		$("WifiKeyExpiredTime").disabled = "";
		$("btnSaveWifi").disabled = "";
		$("btnRefreshWifi").disabled = "";
		
		if($("WifiIpMethod").value == 1)
		{
			$("WifiIpAddress").disabled = "disabled";
			$("WifiSubnetMask").disabled = "disabled";
			$("WifiGateway").disabled = "disabled";
			$("WifiDns1").disabled = "disabled";
			$("WifiDns2").disabled = "disabled";
		}
	}
}
