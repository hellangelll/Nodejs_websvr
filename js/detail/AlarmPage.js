function $(id)
{
	return document.getElementById(id);
}

var g_WeekDate = new Date().getDay() - 1;		//星期

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
		case "imgAlarmIn":
			string = g_sAlarmIn;
			break;
			
		case "imgAlarmName" :
			string = g_sAlarmName;
			break;
			
		case "imgTriggerPTZ":
			string = g_sTriggerPTZ;
			break;
			
		case "imgReportCenter":
			string = g_sReportCenter;
			break;
			
		case "imgTriggerAlarmOutput":
			string = g_sTriggerAlarmOutput;
			break;
			
		case "imgAlarmOut":
			string = g_sAlarmOut;
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
	
	var obj = $("HelpInfoDiv");
	obj.style.pixelTop	= g_iHelpDivHeight;
	
	if( obj.style.pixelTop >= 0)
	{
		clearInterval(g_HelpInfoInterval);
		
		setTimeout('CheckHelpDivFlag()',500);
	}
}

function CheckHelpDivFlag()
{
	if( g_bHelpDivFlag )
	{
		g_HideHelpInfoInterval = setInterval("TriggerTimerHideDiv()",50);
	}
	else
	{
		setTimeout('CheckHelpDivFlag()',500);
	}
}

var g_bHelpDivFlag = false;
function TriggerTimerHideDiv()
{
	var obj = $("HelpInfoDiv");
	
	if( obj.style.pixelTop <= 200 && g_bHelpDivFlag)
	{
		
		g_iHelpDivHeight = g_iHelpDivHeight + 20;
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
==				设备信息代码段  	      ==
==										  ==
==			2011.03.01	By angel		  ==
============================================
==========================================*/
/*
var g_DeviceInfoObj = new Object();		//设备信息
function SendGetDeviceInfo()
{
	var ExpGetDeviceInfoObj = new GetDeviceInfoObj();
	
	ExpGetDeviceInfoObj.callbackfunction = function(Obj){
			g_DeviceInfoObj = Obj;
			
			if( g_DeviceInfoObj.result )
			{
			}
			else
			{
				//alert("get device info fail!");
			}
			
		};
	ExpGetDeviceInfoObj.method = "POST";
	ExpGetDeviceInfoObj.asynchrony = false;
	ExpGetDeviceInfoObj.username = g_UserName;
	ExpGetDeviceInfoObj.password = g_Password;
	ExpGetDeviceInfoObj.CurrentChannelId = g_CurrentChannelNum;

	GetDeviceInfo(ExpGetDeviceInfoObj);
}
*/

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
				
				//获取报警输入参数
				SeAlarmInlChannel();
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
==				报警输入代码段  	      ==
==										  ==
==			2011.03.03	By angel		  ==
============================================
==========================================*/

//获取报警输入参数
var g_AlarmInInfoObj = new AlarmInObj();
var g_CurrentAlarmInChannel = 0;		//报警输入的通道
function SendGetAlarmInInfo()
{
	g_AlarmInInfoObj.callbackfunction = function(Obj){
			g_AlarmInInfoObj = Obj;
			
			if(Obj.result )
			{
				//初始化视频输入页面参数
				InitAlarmInInfo();
				
				//获取中心ip和端口
				SendGetNetWorkInfo();
			}
			else
			{
				//alert("get videoin info fail");
			}
		};
	
	g_AlarmInInfoObj.method = "POST";
	g_AlarmInInfoObj.asynchrony = true;
	g_AlarmInInfoObj.username = g_UserName;
	g_AlarmInInfoObj.password = g_Password;
	g_AlarmInInfoObj.CurrentChannelId = g_CurrentAlarmInChannel;
	
	GetAlarmInInfo(g_AlarmInInfoObj);
}

//设置报警输入参数
function SendSetAlarmInInfo()
{
	g_AlarmInInfoObj.callbackfunction = function(Obj){
			g_AlarmInInfoObj = Obj;
			
			if(Obj.result )
			{
				//alert(a_succeed);
				
				//设置中心地址和端口
				SendSetNetWorkInfo();
			}
			else
			{
				alert(a_faild);
			}
		};
		
	if( document.getElementById("AlarmName").value == "" )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AlarmName").focus();
		return false;
	}
	
	for( var k= 0; k< 4; k ++ )
	{
		if(  parseInt(document.getElementById("AlarmInstartHour" + k).value) > parseInt(document.getElementById("AlarmInstopHour" + k).value) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
		
		if(  (parseInt(document.getElementById("AlarmInstartHour" + k).value) == parseInt(document.getElementById("AlarmInstopHour" + k).value) ) && (parseInt(document.getElementById("AlarmInstartMinute" + k).value) > parseInt(document.getElementById("AlarmInstopMinute" + k).value)) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
	}
 
	g_AlarmInInfoObj.sAlarmInName = document.getElementById("AlarmName").value;
	g_AlarmInInfoObj.byAlarmType = document.getElementById("alarmInType").selectedIndex; 
	g_AlarmInInfoObj.byAlarmInHandle = document.getElementById("HandleAlarmIn").checked ? 1: 0;
	
	if( document.getElementById("Center").checked )
	{
		g_AlarmInInfoObj.dwHandleType |= 0x04;
	}
	else
	{
		g_AlarmInInfoObj.dwHandleType &= ~0x04;
	}
	
	if( document.getElementById("TigerAlarmIn").checked )
	{
		g_AlarmInInfoObj.dwHandleType |= 0x08;
	}
	else
	{
		g_AlarmInInfoObj.dwHandleType &= ~0x08;
	}
	
	//根据当前总的通道个数来显示  现在最多只能支持16个
	for(i=1; i<=g_ChannelInfoObj.ChannelTotal; i++)
	{
		//云台联动
		g_AlarmInInfoObj.struAlarmTransFer[(i-1)].byEnablePreset = $("AlarmINEnableChannel" + i).checked ? 1: 0;
		
		//报警联动录像
		g_AlarmInInfoObj.struAlarmTransFer[(i-1)].byEnableRelRecordChan = $("AlarmInEnableRecord" + i).checked ? 1: 0;	
		
		//云台预置点号
		g_AlarmInInfoObj.struAlarmTransFer[(i-1)].byPresetNo = $("AlarmInChannelPtzOpt" + i).value;
	}
	
	
	for(var n=0; n<4; n++ )
	{
		if(document.getElementById("Out" + (n + 1)).checked )
		{
			g_AlarmInInfoObj.byRelAlarmOutEnable.Enable[n] = 1;
			g_AlarmInInfoObj.byRelAlarmOut.AlarmOut[n] = document.getElementById("SelectAlarmOutPut" + (n + 1)).selectedIndex;			
		}
		else
		{
			g_AlarmInInfoObj.byRelAlarmOutEnable.Enable[n] = 0;
			g_AlarmInInfoObj.byRelAlarmOut.AlarmOut[n] = document.getElementById("SelectAlarmOutPut" + (n + 1)).selectedIndex;
		}
	}
	
	g_AlarmInInfoObj.method = "POST";
	g_AlarmInInfoObj.asynchrony = true;
	g_AlarmInInfoObj.username = g_UserName;
	g_AlarmInInfoObj.password = g_Password;
	g_AlarmInInfoObj.CurrentChannelId = g_CurrentAlarmInChannel;
	
	SetAlarmInInfo(g_AlarmInInfoObj);
}

function InitAlarmInInfo()
{
	if(g_WeekDate >= 0 )
	{
		$("AlarmInWeek").selectedIndex = g_WeekDate;
	}
	else
	{
		$("AlarmInWeek").selectedIndex = 6;		//星期天
	}	
	
	//是否触发报警输出
	for(var i=0; i<4; i++)
	{
		var value = parseInt(g_AlarmInInfoObj.byRelAlarmOutEnable.Enable[i]);
		if(value == 1)
		{
			document.getElementById("Out" + (i + 1)).checked = "checked";
			document.getElementById("SelectAlarmOutPut" + (i + 1)).disabled = "";
			document.getElementById("SelectAlarmOutPut" + (i + 1)).selectedIndex = g_AlarmInInfoObj.byRelAlarmOut.AlarmOut[i];
		}
		else
		{
			document.getElementById("Out" + (i + 1)).checked = "";
			document.getElementById("SelectAlarmOutPut" + (i + 1)).disabled = "disabled";
			document.getElementById("SelectAlarmOutPut" + (i + 1)).selectedIndex = 0;
		}
	}
	
	with(document.all)
	{    
		for(var i=0;i<alarmInType.options.length;i++){                
			if (alarmInType.options[i].value== g_AlarmInInfoObj.byAlarmType){
				alarmInType.selectedIndex=i;
				break;
			}
		}            
	}
	
	//报警处理方式
	if( (g_AlarmInInfoObj.dwHandleType & 0x04) == 0x04 )
	{
		document.getElementById("Center").checked = true;
	}
	else
	{
		document.getElementById("Center").checked = false;
	}
	
	if( (g_AlarmInInfoObj.dwHandleType & 0x08) == 0x08 )
	{
		document.getElementById("TigerAlarmIn").checked = true;
		//$("spAlarmOut").style.display = "";
	}
	else
	{
		document.getElementById("TigerAlarmIn").checked = false;
		//$("spAlarmOut").style.display = "none";
	}

	/*var DeviceType = g_DeviceInfoObj.wTypeExtern;
	if( DeviceType & 0x0002 )
	{	
		//双路报警输入则没有报警输出
		document.getElementById("TigerAlarmIn").style.display="none";
		document.getElementById("spAlarmOut").style.display="none";
	}*/
	
	document.getElementById("AlarmName").value = g_AlarmInInfoObj.sAlarmInName;
	
	//set the amlarmIn num
	var AlarmChannelCount = 4;		//当前报警输入的通道总数  现在只有4个
	for(var i=0; i< AlarmChannelCount; i++ )
	{
		var name= a_AlarmIn + (i+1);
		document.getElementById("alarmIn").options[i] = new Option(name,i);
		document.getElementById("SameAlarm").options[i] = new Option(name,i);
	}
	
	if($("alarmIn").options.length <= 4)
	{
		for( var i=0; i<g_ChannelInfoObj.ChannelTotal; i++ )
		{
			if( g_ChannelInfoObj.ChannelInfo[i].ChannelEnable == 1 )
			{
				//$("alarmIn").options[$("alarmIn").options.length] = new Option(g_ChannelInfoObj.ChannelInfo[i].ChannelName, $("alarmIn").options.length);
				
			}
		}
	}
	
	//设置选择的报警输入的通道
	$("alarmIn").selectedIndex = g_CurrentAlarmInChannel;
	
	//这里先暂时用的四个前端云台通道,以后再扩展到16个
	for(var i=1; i<= g_ChannelInfoObj.ChannelTotal; i++)
	{
		//显示通道列表
		$("trChannelList" + (i-1)).style.display = "";
		$("AlarmInTriggerPTZ" + (i-1)).innerHTML =interceptString( g_ChannelInfoObj.ChannelInfo[(i-1)].ChannelName,8);
		
		//云台联动
		if(g_AlarmInInfoObj.struAlarmTransFer[(i-1)].byEnablePreset == 1 )
		{
			$("EnablePTZ").checked = "checked";
			$("AlarmINEnableChannel" + i).disabled = "disabled";
			$("AlarmINEnableChannel" + i).checked = "checked";
			$("AlarmInEnableRecord" + i).disabled = "disabled";
		}
		else
		{
			$("AlarmINEnableChannel" + i).checked = "";
			$("AlarmInEnableRecord" + i).checked = "";
		}
		
		//报警联动录像
		if(g_AlarmInInfoObj.struAlarmTransFer[(i-1)].byEnableRelRecordChan == 1)
		{
			$("EnablePTZ").checked = "checked";
			//$("AlarmINEnableChannel" + i).disabled = "disabled";
			$("AlarmInEnableRecord" + i).disabled = "disabled";
			$("AlarmInEnableRecord" + i).checked = "checked";
		}
		else
		{
			//$("AlarmINEnableChannel" + i).checked = "";
			$("AlarmInEnableRecord" + i).checked = "";
		}
		
		//云台预置点号
		$("AlarmInChannelPtzOpt" + i).selectedIndex = g_AlarmInInfoObj.struAlarmTransFer[(i-1)].byPresetNo;
	}
		
	//是否处理报警
	if(g_AlarmInInfoObj.byAlarmInHandle == 1 )
	{
		$("HandleAlarmIn").checked = "checked";
	}
	else
	{
		$("HandleAlarmIn").checked = "";
	}
	
	SetAlarmInEnableHandle();
	
	//给页面布防时间赋值
	SetAlarmInTime();
}

function SetAlarmInTime()
{
	var	wDayOfWeek = Number(document.getElementById("AlarmInWeek").selectedIndex);
	for( var j = 0; j< 4; j++ )
	{
		document.getElementById("AlarmInstartHour" + j).selectedIndex = g_AlarmInInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStartHour;
		document.getElementById("AlarmInstartMinute" + j).selectedIndex = g_AlarmInInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStartMin;
		document.getElementById("AlarmInstopHour" + j).selectedIndex = g_AlarmInInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStopHour;
		document.getElementById("AlarmInstopMinute" + j).selectedIndex = g_AlarmInInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStopMin;
	}
}

function AlarmInSetSegment()
{
	var iDay = Number(document.getElementById("AlarmInWeek").selectedIndex);
	for( j = 0; j< 4; j++ )
	{
		g_AlarmInInfoObj.struAlarmTime.day[iDay].Segment[j].byStartHour = document.getElementById("AlarmInstartHour"+j).value;
		g_AlarmInInfoObj.struAlarmTime.day[iDay].Segment[j].byStartMin = document.getElementById("AlarmInstartMinute"+j).value ;
		g_AlarmInInfoObj.struAlarmTime.day[iDay].Segment[j].byStopHour = document.getElementById("AlarmInstopHour"+j).value ;
		g_AlarmInInfoObj.struAlarmTime.day[iDay].Segment[j].byStopMin = document.getElementById("AlarmInstopMinute"+j).value ;	
	}
}

function AlarmInSameWeek()
{
	var iType = 0;
	var iCurrent = 0;
	//get current set
	iCurrent = Number(document.getElementById("AlarmInWeek").value);
	iType = Number(document.getElementById("AlarmInCopyWeek").value);

	if( iType == -1 ) //copy to every day
	{
		for( var i= 0; i< 7 ; i++ )
		{
			if( i != iCurrent )
			{
				for(var j=0; j<4; j++ )
				{
					g_AlarmInInfoObj.struAlarmTime.day[i].Segment[j].byStartHour = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartHour;
					g_AlarmInInfoObj.struAlarmTime.day[i].Segment[j].byStartMin = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartMin;
					g_AlarmInInfoObj.struAlarmTime.day[i].Segment[j].byStopHour = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopHour;
					g_AlarmInInfoObj.struAlarmTime.day[i].Segment[j].byStopMin = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopMin;
				}
			}
		}
	}
	else //copy to special day
	{
		for(var j=0; j<4; j++ )
		{
			g_AlarmInInfoObj.struAlarmTime.day[iType].Segment[j].byStartHour = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartHour;
			g_AlarmInInfoObj.struAlarmTime.day[iType].Segment[j].byStartMin = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartMin;
			g_AlarmInInfoObj.struAlarmTime.day[iType].Segment[j].byStopHour = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopHour;
			g_AlarmInInfoObj.struAlarmTime.day[iType].Segment[j].byStopMin = g_AlarmInInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopMin;
		}
	}
}

function SeAlarmInlChannel()
{
	g_CurrentAlarmInChannel = document.getElementById("alarmIn").value;
	//alert(g_CurrentAlarmInChannel);
	SendGetAlarmInInfo();
}

function SetAlarmInEnableHandle()
{
	if( !document.getElementById("HandleAlarmIn").checked )
	{
		document.getElementById("TigerAlarmIn").checked =document.getElementById("HandleAlarmIn").checked;
		document.getElementById("Center").checked = document.getElementById("HandleAlarmIn").checked;
		for(var i=1; i<=4; i++ )
		{
			document.getElementById("Out" + i).disabled = "disabled";
			document.getElementById("SelectAlarmOutPut" + i).disabled = "disabled";
			document.getElementById("Out" + i).checked = document.getElementById("HandleAlarmIn").checked;
			//document.getElementById("SelectAlarmOutPut" + i).checked = document.getElementById("HandleAlarmIn").checked;
		}
		
		document.getElementById("EnablePTZ").checked = "";
		document.getElementById("EnablePTZ").disabled = "disabled";
		document.getElementById("TigerAlarmIn").disabled = "disabled";
		document.getElementById("Out1").disabled = "disabled";
		document.getElementById("Center").disabled = "disabled";
	}
	else
	{
		document.getElementById("EnablePTZ").disabled = "";
		document.getElementById("TigerAlarmIn").disabled = "";
		document.getElementById("Center").disabled = "";
		for(var i=1; i<=4; i++ )
		{
			document.getElementById("Out" + i).disabled = "";
			document.getElementById("SelectAlarmOutPut" + i).disabled = "";
		}
	}
	
	AlarmInPztOpt();
}

function TigerAlarm1()
{
	if( !document.getElementById("TigerAlarmIn").checked )
	{
		for(var i=1; i<=4; i++ )
		{
			document.getElementById("Out" + i).disabled = "disabled";
			document.getElementById("Out" + i).checked = "";
			//document.getElementById("Out" + i).checked = "";
			document.getElementById("SelectAlarmOutPut" + i).disabled = "disabled";
		}
	}
	else
	{
		for(var i=1; i<=4; i++ )
		{
			document.getElementById("Out" + i).disabled = "";
			document.getElementById("SelectAlarmOutPut" + i).disabled = "";
		}
	}
}

function ChangeAlarmInType(type)
{
	$("TriggerPTZDiv").style.display = "none";
	$("ReportCenterDiv").style.display = "none";
	$("TigerAlarmInDiv").style.display = "none";
	
	$("TriggerPTZLeftDiv").className = "Alarmcolor";
	$("ReportCenterLeftDiv").className = "Alarmcolor";
	$("TriggerAlarmOutputLeftDiv").className = "Alarmcolor";
	
	switch (type)
	{
		case "0":
			$("TriggerPTZDiv").style.display = "block";
			$("TriggerPTZLeftDiv").className = "Alarmcolor2";
			break;
		case "1":
			$("ReportCenterDiv").style.display = "block";
			$("ReportCenterLeftDiv").className = "Alarmcolor2";
			break;
		case "2":
			$("TigerAlarmInDiv").style.display = "block";
			$("TriggerAlarmOutputLeftDiv").className = "Alarmcolor2";
			break;
		default :
			break;
	}
}

function AlarmInPztOpt()
{
	if( !$("EnablePTZ").checked )
	{
		for(var i=1; i<=g_ChannelInfoObj.ChannelTotal; i++ )
		{
			$("AlarmInChannelPtzOpt" + i).disabled = "disabled";
			$("AlarmINEnableChannel" + i).disabled = "disabled";
			$("AlarmINEnableChannel" + i).checked = "";
			$("AlarmInEnableRecord" + i).disabled = "disabled";
		}
	}
	else
	{
		for(var i=1; i<=g_ChannelInfoObj.ChannelTotal; i++ )
		{
			$("AlarmInChannelPtzOpt" + i).disabled = "";
			$("AlarmINEnableChannel" + i).disabled = "";
			$("AlarmInEnableRecord" + i).disabled = "";
		}
	}
}

//在点击录像之后  验证当前通道的存储计划是否设置
function CheckTheRecoreInfo(channelNum,obj)
{
	var m_StorageProjectObj = new StorageProjectObj();
	var m_StorageFlag = true;
	var m_startHour,m_startMin,m_stopHour,m_stopMin,m_recordType;
	
	m_StorageProjectObj.callbackfunction = function(Obj){
		m_StorageProjectObj = Obj;
		
		if(Obj.result )
		{
			//当前通道没有启用存储
			if(m_StorageProjectObj.byEnableRecord == 0)
			{
				m_StorageFlag = true;
			}
			else
			{
				for(var i=0; i<7; i++)
				{
					//全天存储
					if(m_StorageProjectObj.struRecordAllDay.StorageDay[i].byAllDayRecord == 1)
					{
						m_recordType = m_StorageProjectObj.struRecordAllDay.StorageDay[i].byRecordType;
						
						//如果存储类型不为  2--报警录像或  3--报警和移动侦测任意触发一个 或 4--报警和移动侦测同时触发 的话  就提示
						if( m_recordType== 2 || m_recordType == 3 || m_recordType == 4)
						{
							m_StorageFlag = false;
							break;
						}
					}
					else	//分时段存储
					{
						//一天四个时间段
						for(var j=0; j<4; j++)
						{
							m_startHour = m_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStartHour;
							m_startMin = m_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStartMin;
							m_stopHour = m_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStopHour;
							m_stopMin = m_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStopMin;
							m_recordType = m_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byRecordType;
							
							if(m_startHour < m_stopHour)
							{
								//如果存储类型不为  2--报警录像或  3--报警和移动侦测任意触发一个 或 4--报警和移动侦测同时触发 的话  就提示
								if(m_recordType == 2 || m_recordType == 3 || m_recordType == 4)
								{
									m_StorageFlag = false;
									break;
								}
							}
							else if(m_startHour == m_stopHour)
							{
								if(m_startMin < m_stopMin)
								{
									//如果存储类型不为  2--报警录像或  3--报警和移动侦测任意触发一个 或 4--报警和移动侦测同时触发 的话  就提示
									if(m_recordType == 2 || m_recordType == 3 || m_recordType == 4)
									{
										m_StorageFlag = false;
										break;
									}
								}
							}
						}
						
						if(j<4)break;
					}
				}
			}
			
			if(m_StorageFlag)
			{
				alert(a_strRecordStateNote);
				obj.checked = false;
			}
			
		}
		else
		{
			//alert("get StorageProject info fail");
			return false;
		}
		
	};
	m_StorageProjectObj.method = "POST";
	m_StorageProjectObj.asynchrony = true;
	m_StorageProjectObj.username = g_UserName;
	m_StorageProjectObj.password = g_Password;
	m_StorageProjectObj.CurrentChannelId = channelNum;
	
	GetStorageProjectInfo(m_StorageProjectObj);	
	
}

/*==========================================
============================================
==										  ==
==				网络参数代码段  	      ==
==										  ==
==			2011.03.04	By angel		  ==
============================================
==========================================*/
var g_NetWorkInfoObj = new NetWorkObj();
function SendGetNetWorkInfo()
{
	g_NetWorkInfoObj.callbackfunction = function(Obj){
			g_NetWorkInfoObj = Obj;
			
			if(Obj.result )
			{
				$("AlarmInCenterIP").value 		= g_NetWorkInfoObj.sManageHostIP;
				$("AlarmInCenterPort").value 	= g_NetWorkInfoObj.wManageHostPort;
	
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
	g_NetWorkInfoObj.CurrentChannelId = g_CurrentAlarmInChannel;
	
	GetNetWorkInfo(g_NetWorkInfoObj);
}

function SendSetNetWorkInfo()
{
	//check the manager ip 
	strIp = $("AlarmInCenterIP").value ;
	if( Ipv4IsValid(strIp) == false )
	{
		alert(a_ParameterInvalid);
		ChangeAlarmInType("1");
		$("AlarmInCenterIP").value = "";
		$("AlarmInCenterIP").focus();
		return false;
	}
		
	if( $("Center").checked && isNaN($("AlarmInCenterPort").value) )
	{
		alert(a_ParameterInvalid);
		ChangeAlarmInType("1");
		$("AlarmInCenterPort").value = "";
		$("AlarmInCenterPort").focus();
		return false;
	}
	
	if( ($("AlarmInCenterPort").value <= 0 || $("AlarmInCenterPort").value >65535) && $("Center").checked || $("AlarmInCenterPort").value.indexOf(".")>=0 )
	{
		alert(a_ParameterInvalid);
		ChangeAlarmInType("1");
		$("AlarmInCenterPort").value = "";
		$("AlarmInCenterPort").focus();
		return false;
	}
	
	if( isNull( $("AlarmInCenterPort").value) && $("Center").checked  )
	{
		alert(a_ParameterInvalid);
		ChangeAlarmInType("1");
		$("AlarmInCenterPort").focus();
		return false;
	}
	
	if( $("AlarmInCenterPort").value.indexOf(".") >=0 && $("Center").checked )
	{
		alert(a_ParameterInvalid);
		ChangeAlarmInType("1");
		$("AlarmInCenterPort").value = "";
		$("AlarmInCenterPort").focus();
		return false;
	}


	g_NetWorkInfoObj.sManageHostIP 		= $("AlarmInCenterIP").value;
	g_NetWorkInfoObj.wManageHostPort 	= $("AlarmInCenterPort").value;

	
	g_NetWorkInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed );
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
	g_NetWorkInfoObj.CurrentChannelId = g_CurrentAlarmInChannel;
	
	SetNetWorkInfo(g_NetWorkInfoObj);
}


/*==========================================
============================================
==										  ==
==				报警输出代码段  	      ==
==										  ==
==			2011.03.04	By angel		  ==
============================================
==========================================*/

//获取报警输出参数
var g_AlarmOutInfoObj = new AlarmOutObj();
var g_CurrentAlarmOutChannel = 0;		//报警输出的通道
function SendGetAlarmOutInfo()
{
	g_AlarmOutInfoObj.callbackfunction = function(Obj){
			g_AlarmOutInfoObj = Obj;
			
			if(Obj.result )
			{
				//初始化视频输出页面参数
				InitAlarmOutInfo();
			}
			else
			{
				//alert("get alarm out info fail");
			}
		};
	
	if(g_CurrentAlarmOutChannel == "")
	{
		g_CurrentAlarmOutChannel = 0;
	}	
	
	g_AlarmOutInfoObj.method = "POST";
	g_AlarmOutInfoObj.asynchrony = true;
	g_AlarmOutInfoObj.username = g_UserName;
	g_AlarmOutInfoObj.password = g_Password;
	g_AlarmOutInfoObj.CurrentChannelId = g_CurrentAlarmOutChannel;
	
	GetAlarmOutInfo(g_AlarmOutInfoObj);
}

function SendSetAlarmOutInfo()
{
	g_AlarmOutInfoObj.callbackfunction = function(Obj){
		
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	var obj = document.getElementsByName("AlarmOutType");
	for(var j = 0; j< obj.length; j++ )
	{
		if(obj[j].checked == true )
		{
			g_AlarmOutInfoObj.dwSchedTimType = obj[j].value;
			break;
		}
	}
	if( document.getElementById("AlarmOutName").value == "" )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AlarmOutName").focus();
		return false;
	}
	
	for(var k=0; k<4; k++)
	{
		if(  parseInt(document.getElementById("AlarmOutstartHour"+k).value) > parseInt(document.getElementById("AlarmOutstopHour"+k).value) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
		if(  (parseInt(document.getElementById("AlarmOutstartHour"+k).value) == parseInt(document.getElementById("AlarmOutstopHour"+k).value) ) && (parseInt(document.getElementById("AlarmOutstartMinute"+k).value) > parseInt(document.getElementById("AlarmOutstopMinute"+k).value)) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
	}
	
	if(g_CurrentAlarmOutChannel == "")
	{
		g_CurrentAlarmOutChannel = 0;
	}
	
	g_AlarmOutInfoObj.sAlarmOutName = document.getElementById("AlarmOutName").value;
	g_AlarmOutInfoObj.dwAlarmOutDelay = document.getElementById("AlarmOutDelay").value;
	
	g_AlarmOutInfoObj.method = "POST";
	g_AlarmOutInfoObj.asynchrony = true;
	g_AlarmOutInfoObj.username = g_UserName;
	g_AlarmOutInfoObj.password = g_Password;
	g_AlarmOutInfoObj.CurrentChannelId = g_CurrentAlarmOutChannel;
	
	SetAlarmOutInfo(g_AlarmOutInfoObj);
}

function InitAlarmOutInfo()
{
	if(g_WeekDate >= 0 )
	{
		$("AlarmOutWeek").selectedIndex = g_WeekDate;
	}
	else
	{
		$("AlarmOutWeek").selectedIndex = 6;		//星期天
	}	
	
	//set the amlarmOut num
	var AlarmChannelCount = 2;		//当前报警输出的通道总数  现在只有4个
	for(var i=0; i< AlarmChannelCount; i++ )
	{
		var name= a_AlarmOut + (i+1);
		document.getElementById("alarmOut").options[i] = new Option(name,i);
	}
	
	if(g_CurrentAlarmOutChannel == "")
	{
		g_CurrentAlarmOutChannel = 0;
	}
	document.getElementById("alarmOut").value = g_CurrentAlarmOutChannel;

	document.getElementById("AlarmOutName").value = g_AlarmOutInfoObj.sAlarmOutName;
	
	var obj = document.getElementsByName("AlarmOutType");
	for( var j=0; j< obj.length; j++ )
	{
		if( obj[j].value == g_AlarmOutInfoObj.dwSchedTimType )
		{
			obj[j].checked = true;
			break;
		}
	}
	
	with(document.all)
	{    
		if( g_AlarmOutInfoObj.dwAlarmOutDelay == -1 )
		{
			AlarmOutDelay.selectedIndex = 0;
		}
		else
		{
			for(var i=0;i<AlarmOutDelay.options.length;i++)
			{              
				if (AlarmOutDelay.options[i].value == g_AlarmOutInfoObj.dwAlarmOutDelay)
				{
					AlarmOutDelay.selectedIndex=i;
					break;
				}
			}
		}
	}
	
	SetAlarmOutEnableHandle();
	SetAlarmTime();
}

function SetAlarmOutEnableHandle()
{
	var AlarmType = 0;
	var obj = document.getElementsByName("AlarmOutType");
	for( j = 0; j< obj.length; j++ )
	{
		if(obj[j].checked == true )
		{
			AlarmType = obj[j].value;
			break;
		}
	}
	
	if( AlarmType == 0 )
	{
		document.getElementById("AlarmOutWeek").disabled = "";
		
		for(var j=0; j< 4; j++ )
		{
			document.getElementById("AlarmOutstartHour"+j).disabled   = "";
			document.getElementById("AlarmOutstartMinute" + j).disabled = "";
			document.getElementById("AlarmOutstopHour" + j).disabled    = "";
			document.getElementById("AlarmOutstopMinute" + j).disabled  = "";
		}
		
		document.getElementById("AlarmOutCopyWeek").disabled = "";
		document.getElementById("btnAlarmOutCopy").disabled = "";
	}
	else
	{
		document.getElementById("AlarmOutWeek").disabled = "disabled";
		for(var j=0; j< 4; j++ )
		{
			document.getElementById("AlarmOutstartHour"+j).disabled = "disabled";
			document.getElementById("AlarmOutstartMinute" + j).disabled = "disabled";
			document.getElementById("AlarmOutstopHour" + j).disabled = "disabled";
			document.getElementById("AlarmOutstopMinute" + j).disabled  = "disabled";
		}
		
		document.getElementById("AlarmOutCopyWeek").disabled = "disabled";
		document.getElementById("btnAlarmOutCopy").disabled = "disabled";
	}
}

function SetAlarmTime()
{
	var wDayOfWeek = Number(document.getElementById("AlarmOutWeek").selectedIndex);
	for( var j = 0; j<4; j++ )
	{
		document.getElementById("AlarmOutstartHour" + j).selectedIndex = g_AlarmOutInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStartHour;
		document.getElementById("AlarmOutstartMinute" + j).selectedIndex = g_AlarmOutInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStartMin;
		document.getElementById("AlarmOutstopHour" + j).selectedIndex = g_AlarmOutInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStopHour;
		document.getElementById("AlarmOutstopMinute" + j).selectedIndex = g_AlarmOutInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStopMin;
	}
}

//重新获取指定报警输出的信息
function SelectAlarmOutChannel()
{
	g_CurrentAlarmOutChannel = document.getElementById("alarmOut").value;
	//alert(g_CurrentAlarmOutChannel);
	SendGetAlarmOutInfo();
}

function AlarmOutSameWeek()
{
	var iType = 0;
	var iCurrent = 0;
	
	iCurrent = Number(document.getElementById("AlarmOutWeek").value);
	iType = Number(document.getElementById("AlarmOutCopyWeek").value);

	if( iType == -1 ) //copy to every day
	{
		for( var i= 0; i< 7 ; i++ )
		{
			if( i != iCurrent )
			{
				for(var j=0; j<4; j++ )
				{
					g_AlarmOutInfoObj.struAlarmTime.day[i].Segment[j].byStartHour = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartHour;
					g_AlarmOutInfoObj.struAlarmTime.day[i].Segment[j].byStartMin = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartMin;
					g_AlarmOutInfoObj.struAlarmTime.day[i].Segment[j].byStopHour = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopHour;
					g_AlarmOutInfoObj.struAlarmTime.day[i].Segment[j].byStopMin = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopMin;
				}
			}
		}
	}
	else
	{
		for(var j=0; j<4; j++ )
		{
			g_AlarmOutInfoObj.struAlarmTime.day[iType].Segment[j].byStartHour = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartHour;
			g_AlarmOutInfoObj.struAlarmTime.day[iType].Segment[j].byStartMin = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartMin;
			g_AlarmOutInfoObj.struAlarmTime.day[iType].Segment[j].byStopHour = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopHour;
			g_AlarmOutInfoObj.struAlarmTime.day[iType].Segment[j].byStopMin = g_AlarmOutInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopMin;
		}
	}
}

function AlarmOutSetSegment()
{
	var iDay = document.getElementById("AlarmOutWeek").selectedIndex;
	for( var j = 0; j< 4; j++ )
	{
		g_AlarmOutInfoObj.struAlarmTime.day[iDay].Segment[j].byStartHour = document.getElementById("AlarmOutstartHour"+j).value;
		g_AlarmOutInfoObj.struAlarmTime.day[iDay].Segment[j].byStartMin = document.getElementById("AlarmOutstartMinute"+j).value ;
		g_AlarmOutInfoObj.struAlarmTime.day[iDay].Segment[j].byStopHour = document.getElementById("AlarmOutstopHour"+j).value ;
		g_AlarmOutInfoObj.struAlarmTime.day[iDay].Segment[j].byStopMin = document.getElementById("AlarmOutstopMinute"+j).value ;	
		//alert(g_AlarmOutInfoObj.struAlarmTime.day[iDay].Segment[j].byStartHour + " " + document.getElementById("AlarmOutstartHour"+j).value);
	}	
}

function SendOpenAlarm(value)
{
	var ExpOpenAlarmObj = new OpenAlarmObj();
	
	ExpOpenAlarmObj.callbackfunction = function(Obj){
			if(Obj.result )
			{
				
			}
			else
			{
				alert(a_ContralFail);
			}
		};
	
	if(value == 0 )
	{
		ExpOpenAlarmObj.handle = 0;
	}
	else if(value == 1 )
	{
		ExpOpenAlarmObj.handle = 1;
	}
	
	if(g_CurrentAlarmOutChannel == "")
	{
		g_CurrentAlarmOutChannel = 0;
	}
	
	ExpOpenAlarmObj.method = "POST";
	ExpOpenAlarmObj.asynchrony = true;
	ExpOpenAlarmObj.username = g_UserName;
	ExpOpenAlarmObj.password = g_Password;
	ExpOpenAlarmObj.CurrentChannelId = g_CurrentAlarmOutChannel;
	
	OpenAlarm(ExpOpenAlarmObj);
}



