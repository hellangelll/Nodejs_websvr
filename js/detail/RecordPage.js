function $(id)
{
	return document.getElementById(id);
}

var g_WeekDate = new Date().getDay() - 1;		//星期

//禁用鼠标右键
document.oncontextmenu = function() 
{ 
	//return false; 
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
		case "imgSaveAudio":
			string = g_sSaveAudio;
			break;
			
		case "imgShowStorageDetail" :
			string = g_sShowStorageDetail;
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
						//$("PtzChannelNo").options[num] = new Option(Obj.ChannelInfo[i].ChannelName,Obj.ChannelInfo[i].ChannelId);
						$("StorageChannel").options[num] = new Option(interceptString(Obj.ChannelInfo[i].ChannelName,9),Obj.ChannelInfo[i].ChannelId);
						$("StorageCopyChannel").options[num] = new Option(interceptString(Obj.ChannelInfo[i].ChannelName,9),Obj.ChannelInfo[i].ChannelId);	
						num ++;
					}
				}
				
				$("StorageCopyChannel").options[$("StorageCopyChannel").length] = new Option(a_allchannel,"-1");
				
				//获取设备信息
				SendGetDeviceInfo();
				
				//存储计划参数
				SendGetStorageProjectInfo();
				
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
==				设备信息代码段  	      ==
==										  ==
==			2011.03.01	By angel		  ==
============================================
==========================================*/

var g_DeviceInfoObj = new Object();		//设备信息
function SendGetDeviceInfo()
{
	var ExpGetDeviceInfoObj = new DeviceInfoObj();
	
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
	ExpGetDeviceInfoObj.asynchrony = true;
	ExpGetDeviceInfoObj.username = g_UserName;
	ExpGetDeviceInfoObj.password = g_Password;
	ExpGetDeviceInfoObj.CurrentChannelId = g_CurrentChannelNum;

	GetDeviceInfo(ExpGetDeviceInfoObj);
}

/*==========================================
============================================
==										  ==
==				抓拍参数代码段  		  ==
==										  ==
==			2011.03.08	By angel		  ==
============================================
==========================================*/

var g_CaptureInfoObj = new CaptureInfoObj();
function SendGetCaptureInfo()
{
	g_CaptureInfoObj.callbackfunction = function(Obj){
			 g_CaptureInfoObj = Obj;
			
			if(g_CaptureInfoObj.result )
			{
				$("SDFtpAddress").value = g_CaptureInfoObj.sFTPServerIpAddr;
				$("SDFtpPort").value = g_CaptureInfoObj.dwFTPServerPort;
				$("SDUserName").value = g_CaptureInfoObj.sFTPCliUserName;
				$("SDPassword").value = g_CaptureInfoObj.sFTPCliUserPass;
				$("CaptureNum").value = g_CaptureInfoObj.byCaptureNum;
				$("CaptureInterval").value = g_CaptureInfoObj.dwCaptureInterval;
				if(g_CaptureInfoObj.bySaveMode == 0 || g_CaptureInfoObj.bySaveMode == 1 )
				{
					$("CaptureType").selectedIndex = 0;
				}
				else
				{
					$("CaptureType").selectedIndex  = (g_CaptureInfoObj.bySaveMode - 1);
				}
				
				//根据硬盘个数来判断是否插入了sd卡   如果没有插SD卡,则不启用本地存储
				var DiskNum = g_DeviceInfoObj.byDiskNum;
				
				DiskNum = isNaN(DiskNum) ?  0 : parseInt(DiskNum);
				if( DiskNum <= 0 )
				{
					$("SDFtpAddress").disabled = "disabled";
					$("SDFtpPort").disabled = "disabled";
					$("SDUserName").disabled = "disabled";
					$("SDPassword").disabled = "disabled";
				}
				
				SelectFtp();
			}
			else
			{
				//alert("get Capture info fail!");
			}
		};
	
	g_CaptureInfoObj.method = "POST";
	g_CaptureInfoObj.asynchrony = true;
	g_CaptureInfoObj.username = g_UserName;
	g_CaptureInfoObj.password = g_Password;
	
	GetCaptureInfo(g_CaptureInfoObj);
}

function SendSetCaptureInfo()
{
	var num = 0;
	var inter = 0;
	//check the port
	if( isNaN($("SDFtpPort").value) ) 
	{
		alert(a_ParameterInvalid);
		$("SDFtpPort").value = "";
		$("SDFtpPort").focus();
		return false;
	}
	
	var SaveMode = $("CaptureType").value;
	
	num = $("CaptureNum").value;
	if( isNaN(num) )
	{
		alert(a_ParameterInvalid);
		$("CaptureNum").value = "";
		$("CaptureNum").focus();
		return false;
	}
	if( num <=0 || num >5 )
	{
		alert(a_ParameterInvalid);
		$("CaptureNum").value = "";
		$("CaptureNum").focus();
		return false;
	}
	
	inter = $("CaptureInterval").value;
	if( isNaN(inter) )
	{
		alert(a_ParameterInvalid);
		$("CaptureInterval").value = "";
		$("CaptureInterval").focus();
		return false;
	}
	if( inter <40 )
	{
		alert(a_ParameterInvalid);
		$("CaptureInterval").value = "";
		$("CaptureInterval").focus();
		return false;
	}

	g_CaptureInfoObj.sFTPServerIpAddr = $("SDFtpAddress").value;
	g_CaptureInfoObj.dwFTPServerPort = $("SDFtpPort").value;
	g_CaptureInfoObj.sFTPCliUserName = $("SDUserName").value;
	g_CaptureInfoObj.sFTPCliUserPass = $("SDPassword").value;
	g_CaptureInfoObj.bySaveMode = SaveMode;
	g_CaptureInfoObj.byCaptureNum = num;
	g_CaptureInfoObj.dwCaptureInterval = inter;	

	g_CaptureInfoObj.callbackfunction = function(Obj){
		
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_CaptureInfoObj.method = "POST";
	g_CaptureInfoObj.asynchrony = true;
	g_CaptureInfoObj.username = g_UserName;
	g_CaptureInfoObj.password = g_Password;
	
	SetCaptureInfo(g_CaptureInfoObj);
}


function SelectFtp()
{
    var i = $("CaptureType").value;
	if( i == 0 )
	{
		$("SDFtpAddress").disabled = "disabled";
		$("SDFtpPort").disabled = "disabled";
		$("SDUserName").disabled = "disabled";
		$("SDPassword").disabled = "disabled";
		$("spServer").innerText = a_FtpAddress;
	}
	else
	{
		$("SDFtpAddress").disabled = "";
		$("SDFtpPort").disabled = "";
		$("SDUserName").disabled = "";
		$("SDPassword").disabled = "";
		
		if( i == 1 || i == 3 )
		{
			$("spServer").innerText = a_FtpAddress;
			$("trUserName").style.display="block";
			$("trPassword").style.display="block";
			$("SDFtpPort").value = g_CaptureInfoObj.dwFTPServerPort;
		}
		else
		{
			$("spServer").innerText = a_PicServiceAddress;
			$("trUserName").style.display="none";
			$("trPassword").style.display="none";
			$("SDFtpPort").value = 5006;
		}
	}
	
	if( $("CaptureType").selectedIndex == 1 )
	{
		$("spNote").innerHTML = a_spNote;
	}
	else
	{
		$("spNote").innerHTML = a_NoteSdShoot;
	}
}

/*==========================================
============================================
==										  ==
==				SD卡录像代码段  		  ==
==										  ==
==			2011.03.08	By angel		  ==
============================================
==========================================*/

/*//获取SD卡录像信息
var g_AlarmInfoObj = new AlarmInfoObj();
function SendGetAlarmInfo()
{
	g_AlarmInfoObj.callbackfunction = function(Obj){
			g_AlarmInfoObj = Obj;
			
			if(g_AlarmInfoObj.result )
			{
				if(g_AlarmInfoObj.byNormalRecoder != 0 )
				{
					$("SDEnableFtp").checked = "checked";
				}
				else
				{
					$("SDEnableFtp").checked = "";
				}
				
				for(var j=0; j< $("SDFileSize").options.length; j ++ )
				{
					
					if( $("SDFileSize").options[j].value == g_AlarmInfoObj.byRecoderFileSize )
					{
						$("SDFileSize").selectedIndex = j;
						break;
					}
				}
				
				//初始化页面
				SetRecord();
				SetSDCarTime();
				
				var DiskNum = g_DeviceInfoObj.byDiskNum;
				DiskNum = isNaN(DiskNum) ?  0 : parseInt(DiskNum);
				if( DiskNum <= 0 )
				{
					$("SDEnableFtp").checked = "";
					$("SDFileSize").disabled = "disabled";
					$("SDEnableFtp").disabled = "disabled";
				}
			}
			else
			{
				alert("get SD card info fail!");
			}
		};
	
	g_AlarmInfoObj.method = "POST";
	g_AlarmInfoObj.asynchrony = false;
	g_AlarmInfoObj.username = g_UserName;
	g_AlarmInfoObj.password = g_Password;
	
	GetAlarmInfo(g_AlarmInfoObj);
}

function SendSetAlarmInfo()
{
	g_AlarmInfoObj.byNormalRecoder = $("SDEnableFtp").checked ? 1:0;
	g_AlarmInfoObj.byRecoderFileSize = $("SDFileSize").value;
	
	for( var k= 0; k< 4; k ++ )
	{
		if(  parseInt($("SDCarstartHour" + k).value) > parseInt($("SDCarstopHour" + k).value) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
		
		if(  (parseInt($("SDCarstartHour" + k).value) == parseInt($("SDCarstopHour" + k).value) ) && (parseInt($("SDCarstartMinute" + k).value) > parseInt($("SDCarstopMinute" + k).value)) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
	}
	
	g_AlarmInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_AlarmInfoObj.method = "POST";
	g_AlarmInfoObj.asynchrony = false;
	g_AlarmInfoObj.username = g_UserName;
	g_AlarmInfoObj.password = g_Password;
	
	SetAlarmInfo(g_AlarmInfoObj);
}

function SetSDCarTime()
{
	var	wDayOfWeek = Number($("SDCarWeek").selectedIndex);
	for( var j = 0; j< 4; j++ )
	{
		$("SDCarstartHour" + j).selectedIndex = g_AlarmInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStartHour;
		$("SDCarstartMinute" + j).selectedIndex = g_AlarmInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStartMin;
		$("SDCarstopHour" + j).selectedIndex = g_AlarmInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStopHour;
		$("SDCarstopMinute" + j).selectedIndex = g_AlarmInfoObj.struAlarmTime.day[wDayOfWeek].Segment[j].byStopMin;
	}
}

function SDCarSetSegment()
{
	var iDay = Number($("FtpWeek").selectedIndex);
	for( j = 0; j< 4; j++ )
	{
		g_AlarmInfoObj.struAlarmTime.day[iDay].Segment[j].byStartHour = $("SDCarstartHour"+j).value;
		g_AlarmInfoObj.struAlarmTime.day[iDay].Segment[j].byStartMin = $("SDCarstartMinute"+j).value ;
		g_AlarmInfoObj.struAlarmTime.day[iDay].Segment[j].byStopHour = $("SDCarstopHour"+j).value ;
		g_AlarmInfoObj.struAlarmTime.day[iDay].Segment[j].byStopMin = $("SDCarstopMinute"+j).value ;	
	}
}

function SDCarSameWeek()
{
	var iType = 0;
	var iCurrent = 0;
	//get current set
	iCurrent = Number($("SDCarWeek").value);
	iType = Number($("SDCarCopyWeek").value);

	if( iType == -1 ) //copy to every day
	{
		for( var i= 0; i< 7 ; i++ )
		{
			if( i != iCurrent )
			{
				for(var j=0; j<4; j++ )
				{
					g_AlarmInfoObj.struAlarmTime.day[i].Segment[j].byStartHour = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartHour;
					g_AlarmInfoObj.struAlarmTime.day[i].Segment[j].byStartMin = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartMin;
					g_AlarmInfoObj.struAlarmTime.day[i].Segment[j].byStopHour = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopHour;
					g_AlarmInfoObj.struAlarmTime.day[i].Segment[j].byStopMin = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopMin;
				}
			}
		}
	}
	else //copy to special day
	{
		for(var j=0; j<4; j++ )
		{
			g_AlarmInfoObj.struAlarmTime.day[iType].Segment[j].byStartHour = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartHour;
			g_AlarmInfoObj.struAlarmTime.day[iType].Segment[j].byStartMin = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStartMin;
			g_AlarmInfoObj.struAlarmTime.day[iType].Segment[j].byStopHour = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopHour;
			g_AlarmInfoObj.struAlarmTime.day[iType].Segment[j].byStopMin = g_AlarmInfoObj.struAlarmTime.day[iCurrent].Segment[j].byStopMin;
		}
	}
}*/

/*==========================================
============================================
==										  ==
==			存储计划设置代码段  		  ==
==										  ==
==			2011.03.14	By angel		  ==
============================================
==========================================*/

//存储计划参数
var g_StorageProjectObj = new StorageProjectObj();
function SendGetStorageProjectInfo()
{
	g_StorageProjectObj.callbackfunction = function(Obj){
			g_StorageProjectObj = Obj;
			
			if(Obj.result )
			{
				//获取前端录像参数
				SendGetAlarmInfo();
			}
			else
			{
				//alert("get StorageProject info fail");
				return false;
			}
			
		};
	
	g_StorageProjectObj.method = "POST";
	g_StorageProjectObj.asynchrony = true;
	g_StorageProjectObj.username = g_UserName;
	g_StorageProjectObj.password = g_Password;
	g_StorageProjectObj.CurrentChannelId = $("StorageChannel").value;
	
	GetStorageProjectInfo(g_StorageProjectObj);
}

function SendSetStorageProjectInfo()
{
	var AlarmType = 0;
	var wDayOfWeek = $("Week").selectedIndex;
	var obj = document.getElementsByName("AlarmType");
	for(var j = 0; j< obj.length; j++ )
	{
		if(obj[j].checked == true )
		{
			AlarmType = obj[j].value;
			break;
		}
	}
	
	for(var k=0; k<4; k++)
	{
		if(  parseInt($("startHour"+k).value) > parseInt($("stopHour"+k).value) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
		if(  (parseInt($("startHour"+k).value) == parseInt($("stopHour"+k).value) ) && (parseInt($("startMinute"+k).value) > parseInt($("stopMinute"+k).value)) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
	}
	
	//是否冗余录像
	g_StorageProjectObj.byRedundancyRec = $("RedundantVideo").checked ? 1 : 0;
	//录像时复合流编码时是否记录音频数据
	g_StorageProjectObj.byAudioRec = $("SaveAudio").checked ? 1 : 0;
	//录像码流为从码流
	g_StorageProjectObj.byRecordStream = $("SaveFromStream").checked ? 1 : 0;		
	//录象延时时间
	g_StorageProjectObj.dwRecordTime = $("Delay").value;		
	//录象预录时间
	g_StorageProjectObj.dwPreRecordTime = $("Delay1").value;
	//录像保存的最长时间
	g_StorageProjectObj.dwRecorderDuration = $("Delay2").value;
	
	g_StorageProjectObj.callbackfunction = function(Obj){
			g_StorageProjectObj = Obj;
			
			if(Obj.result )
			{
				SendSetAlarmInfo();
			}
			else
			{
				alert(a_faild);
				return false;
			}
		};
	
	g_StorageProjectObj.method = "POST";
	g_StorageProjectObj.asynchrony = true;
	g_StorageProjectObj.username = g_UserName;
	g_StorageProjectObj.password = g_Password;
	g_StorageProjectObj.CurrentChannelId = $("StorageChannel").value;;
	
	SetStorageProjectInfo(g_StorageProjectObj);
}

var g_AlarmInfoObj = new AlarmInfoObj();
function SendGetAlarmInfo()
{
	g_AlarmInfoObj.callbackfunction = function(Obj){
			g_AlarmInfoObj = Obj;
			
			if(g_AlarmInfoObj.result )
			{
				//初始化存储计划页面参数
				InitStorageProject();
			}
			else
			{
				//alert("get SD card info fail!");
			}
		};
	
	g_AlarmInfoObj.method = "POST";
	g_AlarmInfoObj.asynchrony = true;
	g_AlarmInfoObj.username = g_UserName;
	g_AlarmInfoObj.password = g_Password;
	
	GetAlarmInfo(g_AlarmInfoObj);
}

function SendSetAlarmInfo()
{
	g_AlarmInfoObj.byNormalRecoder = $("SDEnableFtp").checked ? 1:0;
	g_AlarmInfoObj.byRecoderFileSize = $("SDFileSize").value;
	
	g_AlarmInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_AlarmInfoObj.method = "POST";
	g_AlarmInfoObj.asynchrony = true;
	g_AlarmInfoObj.username = g_UserName;
	g_AlarmInfoObj.password = g_Password;
	
	SetAlarmInfo(g_AlarmInfoObj);
}

//复制通道参数
var g_channelCount=0;
function ChannelParCopy()
{
	var AlarmType = 0;
	var m_CopyChannel = $("StorageCopyChannel").value;
	var wDayOfWeek = $("Week").selectedIndex;
	var obj = document.getElementsByName("AlarmType");
	for(var j = 0; j< obj.length; j++ )
	{
		if(obj[j].checked == true )
		{
			AlarmType = obj[j].value;
			break;
		}
	}
	
	for(var k=0; k<4; k++)
	{
		if(  parseInt($("startHour"+k).value) > parseInt($("stopHour"+k).value) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
		if(  (parseInt($("startHour"+k).value) == parseInt($("stopHour"+k).value) ) && (parseInt($("startMinute"+k).value) > parseInt($("stopMinute"+k).value)) )
		{
			alert(a_ParameterInvalid);
			return false;
		}
	}
	
	//是否冗余录像
	g_StorageProjectObj.byRedundancyRec = $("RedundantVideo").checked ? 1 : 0;
	//录像时复合流编码时是否记录音频数据
	g_StorageProjectObj.byAudioRec = $("SaveAudio").checked ? 1 : 0;
	//录像码流为从码流
	g_StorageProjectObj.byRecordStream = $("SaveFromStream").checked ? 1 : 0;		
	//录象延时时间
	g_StorageProjectObj.dwRecordTime = $("Delay").value;		
	//录象预录时间
	g_StorageProjectObj.dwPreRecordTime = $("Delay1").value;
	//录像保存的最长时间
	g_StorageProjectObj.dwRecorderDuration = $("Delay2").value;
	
	if(m_CopyChannel >= 0)
	{
		g_StorageProjectObj.callbackfunction = function(Obj){
			g_StorageProjectObj = Obj;
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
				return false;
			}
			
		};
	
		g_StorageProjectObj.method = "POST";
		g_StorageProjectObj.asynchrony = true;
		g_StorageProjectObj.username = g_UserName;
		g_StorageProjectObj.password = g_Password;
		g_StorageProjectObj.CurrentChannelId = m_CopyChannel;
		
		SetStorageProjectInfo(g_StorageProjectObj);
	}
	else if(m_CopyChannel == -1)	//复制到每个通道
	{
		g_channelCount = $("StorageChannel").length-1;		//获取录像通道总数
		g_StorageProjectObj.callbackfunction = function(Obj){
				g_StorageProjectObj = Obj;
				
				if(Obj.result )
				{
					if(g_channelCount>=0)
					{
						CopyAllChannel();
					}
					else
					{
						alert(a_succeed);
						
						$("StorageTable").style.display = "";
						$("StorageNoteTable").style.display = "none";
					}
				}
				else
				{
					alert(a_faild);
					return false;
				}
				
			};
		
		g_StorageProjectObj.method = "POST";
		g_StorageProjectObj.asynchrony = true;
		g_StorageProjectObj.username = g_UserName;
		g_StorageProjectObj.password = g_Password;
		
		$("StorageTable").style.display = "none";
		$("StorageNoteTable").style.display = "";
		
		CopyAllChannel();
	}
}

function CopyAllChannel()
{
	g_StorageProjectObj.CurrentChannelId = $("StorageChannel").options[g_channelCount].value;
	g_channelCount--;
	SetStorageProjectInfo(g_StorageProjectObj);
}

//初始化存储计划页面参数
function InitStorageProject()
{
	if(g_WeekDate >= 0 )
	{
		$("Week").selectedIndex = g_WeekDate;
	}
	else
	{
		$("Week").selectedIndex = 6;		//星期天
	}
	
	//设置存储模式
	if(g_StorageProjectObj.byEnableRecord == 0 )
	{
		SetAlarmHandleType(0);		//不启用存储
	}
	else 							//启用存储
	{
		SelectWeek();
	}
	
	//是否冗余录像
	if(g_StorageProjectObj.byRedundancyRec == 1 )
	{
		$("RedundantVideo").checked = "checked";
	}
	else
	{
		$("RedundantVideo").checked = "";
	}
	
	//录像时复合流编码时是否记录音频数据
	if(g_StorageProjectObj.byAudioRec == 1 )
	{
		$("SaveAudio").checked = "checked";
	}
	else
	{
		$("SaveAudio").checked = "";
	}
	
	//录像码流为从码流
	if(g_StorageProjectObj.byRecordStream == 1 )
	{
		$("SaveFromStream").checked = "checked";
	}
	else
	{
		$("SaveFromStream").checked = "";
	}
	//alert(g_StorageProjectObj.dwRecordTime);
	//录象延时时间
	$("Delay").selectedIndex = g_StorageProjectObj.dwRecordTime;
	
	//录象预录时间
	$("Delay1").selectedIndex = g_StorageProjectObj.dwPreRecordTime;
	
	//录像保存的最长时间
	$("Delay2").selectedIndex = g_StorageProjectObj.dwRecorderDuration;

	
	if(g_AlarmInfoObj.byNormalRecoder != 0 )
	{
		$("SDEnableFtp").checked = "checked";
	}
	else
	{
		$("SDEnableFtp").checked = "";
	}
	
	for(var j=0; j< $("SDFileSize").options.length; j ++ )
	{
		if( $("SDFileSize").options[j].value == g_AlarmInfoObj.byRecoderFileSize )
		{
			$("SDFileSize").selectedIndex = j;
			break;
		}
	}
	
	//初始化页面
	SetRecord();	
}


function SetRecord()
{
	var obj = document.getElementsByName("AlarmType");
	
	//暂时设置为启用 以后估计会删除
	$("SDEnableFtp").checked = true;

	if( $("SDEnableFtp").checked == true )
	{
		$("StorageChannel").disabled = "";
		$("SaveTypeTime").disabled = "";
		$("SaveType").disabled = "";
		$("CopyWeek").disabled = "";
		$("btnCopy").disabled = "";
		$("Delay").disabled = "";
		$("Delay1").disabled = "";
		$("Delay2").disabled = "";
		$("Week").disabled = "";
		$("RedundantVideo").disabled = "";
		$("SaveAudio").disabled = "";
		$("SaveFromStream").disabled = "";
		$("SDFileSize").disabled = "";
		
		for(var j=0; j< 4; j++ )
		{
			$("startHour"+j).disabled   = "";
			$("startMinute" + j).disabled = "";
			$("stopHour" + j).disabled    = "";
			$("stopMinute" + j).disabled  = "";
		}
		
		for( j = 0; j< obj.length; j++ )
		{
			obj[j].disabled = false ;
		}
		
		SetEnableHandle();
	}
	else
	{
		var iDay = $("Week").value;
		
		$("StorageChannel").disabled = "disabled";
		$("SaveTypeTime").disabled = "disabled";
		$("SaveType").disabled = "disabled";
		$("CopyWeek").disabled = "disabled";
		$("btnCopy").disabled = "disabled";
		$("Delay").disabled = "disabled";
		$("Delay1").disabled = "disabled";
		$("Delay2").disabled = "disabled";
		$("Week").disabled = "disabled";
		$("RedundantVideo").disabled = "disabled";
		$("SaveAudio").disabled = "disabled";
		$("SaveFromStream").disabled = "disabled";
		$("SDFileSize").disabled = "disabled";
		
		for(var j=0; j< 4; j++ )
		{
			$("startHour"+j).disabled   = "disabled";
			$("startMinute" + j).disabled = "disabled";
			$("stopHour" + j).disabled    = "disabled";
			$("stopMinute" + j).disabled  = "disabled";
		}
		
		for( j = 0; j< obj.length; j++ )
		{
			obj[j].disabled = true ;
		}
		g_StorageProjectObj.byEnableRecord = 0;
		g_StorageProjectObj.struRecordAllDay.StorageDay[iDay].byAllDayRecord = 0;
	}
}


//显示存储计划设置列表

function ShowStorageDetail()
{
	var channelNum = 0;	//当前通道号
	var strShowDiv = "";
	var clientW = parseInt(document.body.clientWidth);
	var clientH = parseInt(document.documentElement.clientHeight);
	var audioFlag = "";
	var sBlackColor = ["#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7","#E3E3E3","#D7D7D7"];
	var BlackColor = "";
	var iFlag = 0;
	
	var bgShowDiv = $("bgShowDiv");
	var DetailShowDiv = $("DetailShowDiv");
	
	bgShowDiv.style.width = clientW * 0.8 + "px";
	bgShowDiv.style.height = clientH * 0.9 + "px";
	bgShowDiv.style.left = (clientW - parseInt(bgShowDiv.style.width))/2 + "px";
	bgShowDiv.style.top = (clientH - parseInt(bgShowDiv.style.height))/2 + "px";
	DetailShowDiv.style.height = parseInt(bgShowDiv.style.height)-20 + "px";

	bgShowDiv.style.display = "inline";
	
	$("StorageProjectSetDiv").style.display = "none";
	strShowDiv = "<table cellpadding='0' cellspacing='0' border='0' align='center' style='width:100%; margin:0 0 0 0px;'>";
	
	g_StorageProjectObj.callbackfunction = function(Obj){
			g_StorageProjectObj = Obj;
			iFlag++;
			
			if(Obj.result )
			{
				strShowDiv += 
					"<tr style='background-color:"+ sBlackColor[iFlag] +";'>" + 
				
						"<td width='140'>&nbsp;&nbsp;"+$("StorageChannel").options[channelNum].text+"</td>" +
						"<td height='30'>";
				//是否启用存储0--不启用   1--启用
				if(g_StorageProjectObj.byEnableRecord == 0)
				{
					strShowDiv += a_Close;  //没有启用存储
				}
				else
				{
					strShowDiv +=
							"<table width='100%' border='2' cellpadding='0' cellspacing='0' style='margin:30px 0 0 0;'>";
					//一周7天
					for(var i=0; i<7; i++)
					{
						strShowDiv +=
								"<tr>" +
									"<td width='20%'>"+ g_sWeek[i] +"</td>";
						//全天存储还是分时段存储    1--全天 
						if(g_StorageProjectObj.struRecordAllDay.StorageDay[i].byAllDayRecord == 1)
						{
							strShowDiv += 
									"<td width='60'>"+ a_AllDay +"</td>" +
									"<td width='200'>"+ g_sSaveType[g_StorageProjectObj.struRecordAllDay.StorageDay[i].byRecordType] +"</td>";
						}
						else	//分时段存储
						{
							strShowDiv +=
									"<td width='80%' colspan='2'>" +
										"<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin:5px 0 0 5px;'>";
							//一天四个时间段
							for(var j=0; j<4; j++)
							{
								strShowDiv += 
											"<tr>" +
												"<td width='60'>"+ g_sSaveTypeTime[j] +"</td>" +
												"<td width='100'>"+ a_starttime +": "+ g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStartHour + ":"+ g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStartMin +"</td>" +
												"<td width='100'>"+ a_stoptime +": "+ g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStopHour + ":" + g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStopMin +"</td>" +
												"<td width='200'>"+ g_sSaveType[g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byRecordType] +"</td>" +
											"</tr>";
							}
											
							strShowDiv +=				
										"</table>" +
									"</td>";
						}
						
						strShowDiv +=	
								"</tr>";
					}
					
					audioFlag = g_StorageProjectObj.byAudioRec ? a_yes : a_no;
					
					strShowDiv +=		
								"<tr><td width='20%'>"+ a_OutputDuration +"</td><td width='auto'>"+ g_StorageProjectObj.dwRecordTime + a_second +"</td><td>&nbsp;</td></tr>" +
								"<tr><td width='20%'>"+ a_DelayTime +"</td><td width='auto'>"+ g_StorageProjectObj.dwPreRecordTime + a_second +"</td><td>&nbsp;</td></tr>" +
								"<tr><td width='20%'>"+ a_SaveAudio +"</td><td width='auto'>"+ audioFlag +"</td><td>&nbsp;</td></tr>" +
							"</table>";//报警录象延时  预录时间  存储音频
				}
				
				strShowDiv +=
						"</td>" +
					"</tr>";
			}
			else
			{
				strShowDiv +=
					"<tr><td>"+ a_getDataWrong +"</td></tr>";		//数据获取错误
			}
		};
		
	g_StorageProjectObj.method = "POST";
	g_StorageProjectObj.asynchrony = false;
	g_StorageProjectObj.username = g_UserName;
	g_StorageProjectObj.password = g_Password;
	
	while( channelNum < $("StorageChannel").length )
	{
		g_StorageProjectObj.CurrentChannelId = $("StorageChannel").options[channelNum].value;
		
		GetStorageProjectInfo(g_StorageProjectObj);
		channelNum++;
	}
	
	strShowDiv +=
				"</table>";
	DetailShowDiv.innerHTML = strShowDiv;
	
	//重新获取当前通道的参数值
	g_StorageProjectObj.CurrentChannelId = $("StorageChannel").value;
	g_StorageProjectObj.callbackfunction = {};
	GetStorageProjectInfo(g_StorageProjectObj);
}

function SetAlarmHandleType(iMask)
{
	var obj = document.getElementsByName("AlarmType");
	
	for( var j=0; j< obj.length; j++ )
	{
		if( obj[j].value == iMask )
		{
			obj[j].checked = true;
			break;
		}
	}
	
	SetEnableHandle();
}

function SelectWeek()
{
	var wDayOfWeek = 0;
	var wSegement = 0;
	wSegement = Number($("SaveTypeTime").selectedIndex);
	wDayOfWeek = Number($("Week").selectedIndex);
	
	if(g_StorageProjectObj.struRecordAllDay.StorageDay[wDayOfWeek].byAllDayRecord == 1 )
	{
		SetAlarmHandleType(1);		//全天存储
	}
	else
	{
		SetAlarmHandleType(2);		//分时段存储
	}
	
	//分时间段开启存储
	for( var j = 0; j<4; j++ )
	{
		$("startHour" + j).selectedIndex = g_StorageProjectObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStartHour;
		$("startMinute" + j).selectedIndex = g_StorageProjectObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStartMin;
		$("stopHour" + j).selectedIndex = g_StorageProjectObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStopHour;
		$("stopMinute" + j).selectedIndex = g_StorageProjectObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStopMin;
	}
	
	//设置指定时间段的存储类型
	if(wSegement == 4)		//全天
	{
		$("SaveType").selectedIndex = g_StorageProjectObj.struRecordAllDay.StorageDay[wDayOfWeek].byRecordType;
	}
	else
	{
		$("SaveType").selectedIndex = g_StorageProjectObj.struRecordSched.StorageDay[wDayOfWeek].Segment[wSegement].byRecordType;
	}
	
	//显示当前的存储类型
	SetSaveType(1);
}

function SetEnableHandle()
{
	var AlarmType = 0;
	var obj = document.getElementsByName("AlarmType");
	for( var j = 0; j< obj.length; j++ )
	{
		if(obj[j].checked == true )
		{
			AlarmType = obj[j].value;
			break;
		}
	}
	
	var iDay = $("Week").value;
	
	if( AlarmType == 2 )		//分时段存储
	{
		for(var j=0; j< 4; j++ )
		{
			$("startHour"+j).disabled   = "";
			$("startMinute" + j).disabled = "";
			$("stopHour" + j).disabled    = "";
			$("stopMinute" + j).disabled  = "";
		}
		
		$("CopyWeek").disabled    = "";
		$("btnCopy").disabled     = "";
		$("SaveTypeTime").disabled = "";
		$("SaveTypeTime").options.remove(4);
		$("SaveType").disabled = "";
		$("Delay").disabled = "";
		$("Delay1").disabled = "";
		$("Delay2").disabled = "";
		$("Week").disabled = "";
		$("RedundantVideo").disabled = "";
		$("SaveAudio").disabled = "";
		$("SaveFromStream").disabled = "";
		$("SDFileSize").disabled = "";
		
		g_StorageProjectObj.byEnableRecord = 1;
		g_StorageProjectObj.struRecordAllDay.StorageDay[iDay].byAllDayRecord = 0;
		
	}
	else
	{
		$("CopyWeek").disabled    = "";
		$("btnCopy").disabled     = "";
		$("SaveTypeTime").disabled = "";
		$("SaveType").disabled = "";
		$("Delay").disabled = "";
		$("Delay1").disabled = "";
		$("Delay2").disabled = "";
		$("Week").disabled = "";
		$("RedundantVideo").disabled = "";
		$("SaveAudio").disabled = "";
		$("SaveFromStream").disabled = "";
		$("SDFileSize").disabled = "";
		
		for(var j=0; j< 4; j++ )
		{
			$("startHour"+j).disabled   = "disabled";
			$("startMinute" + j).disabled = "disabled";
			$("stopHour" + j).disabled    = "disabled";
			$("stopMinute" + j).disabled  = "disabled";
		}
		
		if(AlarmType == 1)		//全天存储
		{
			$("SaveTypeTime").options[4] = new Option("全天","-1");
			$("SaveTypeTime").selectedIndex = 4;
			$("SaveTypeTime").disabled = "disabled";	
			
			g_StorageProjectObj.byEnableRecord = 1;
			g_StorageProjectObj.struRecordAllDay.StorageDay[iDay].byAllDayRecord = 1;
		}
		else if(AlarmType == 0)		//不启用存储
		{
			$("SaveTypeTime").disabled = "disabled";
			$("SaveType").disabled = "disabled";
			$("CopyWeek").disabled = "disabled";
			$("btnCopy").disabled = "disabled";
			$("Delay").disabled = "disabled";
			$("Delay1").disabled = "disabled";
			$("Delay2").disabled = "disabled";
			$("Week").disabled = "disabled";
			$("RedundantVideo").disabled = "disabled";
			$("SaveAudio").disabled = "disabled";
			$("SaveFromStream").disabled = "disabled";
			$("SDFileSize").disabled = "disabled";
			
			//$("Delay2").disabled = "disabled";
			g_StorageProjectObj.byEnableRecord = 0;
			g_StorageProjectObj.struRecordAllDay.StorageDay[iDay].byAllDayRecord = 0;
		}
	}
}

//显示当前的存储类型
function SetSaveType(which)
{
	var week = $("Week").value;
	var time = $("SaveTypeTime").value;
	var type = $("SaveType").value;
	
	if(which == 1)		//显示
	{
		if(time == -1)		//全天录像
		{
			$("SaveType").value = g_StorageProjectObj.struRecordAllDay.StorageDay[week].byRecordType;
		}
		else		//分时段录像
		{
			$("SaveType").value = g_StorageProjectObj.struRecordSched.StorageDay[week].Segment[time].byRecordType;
		}
	}
	else				//保存
	{
		if(time == -1)		//全天录像
		{
			g_StorageProjectObj.struRecordAllDay.StorageDay[week].byAllDayRecord = 1;
			g_StorageProjectObj.struRecordAllDay.StorageDay[week].byRecordType = type;
		}
		else		//分时段录像
		{
			g_StorageProjectObj.struRecordSched.StorageDay[week].Segment[time].byRecordType = type;
		}
	}
}

function SetSegment()
{
	var iDay = $("Week").selectedIndex;
	for( var j = 0; j< 4; j++ )
	{
		g_StorageProjectObj.struRecordSched.StorageDay[iDay].Segment[j].byStartHour = $("startHour"+j).value;
		g_StorageProjectObj.struRecordSched.StorageDay[iDay].Segment[j].byStartMin = $("startMinute"+j).value ;
		g_StorageProjectObj.struRecordSched.StorageDay[iDay].Segment[j].byStopHour = $("stopHour"+j).value ;
		g_StorageProjectObj.struRecordSched.StorageDay[iDay].Segment[j].byStopMin = $("stopMinute"+j).value ;	
	}
}

function SameWeek()
{
	var iType = 0;
	var iCurrent = 0;
	
	//get current set
	iCurrent = Number($("Week").value);
	iType = Number($("CopyWeek").value);

	if( iType == -1 ) //copy to every day
	{
		for( var i= 0; i< 7 ; i++ )
		{
			if( i != iCurrent )
			{
				for(var j=0; j<4; j++ )		//分时段存储
				{
					g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byRecordType = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byRecordType;
					g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStartHour = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartHour;
					g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStartMin = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartMin;
					g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStopHour = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopHour;
					g_StorageProjectObj.struRecordSched.StorageDay[i].Segment[j].byStopMin = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopMin;			
				}
				
				g_StorageProjectObj.struRecordAllDay.StorageDay[i].byAllDayRecord = g_StorageProjectObj.struRecordAllDay.StorageDay[iCurrent].byAllDayRecord;
				g_StorageProjectObj.struRecordAllDay.StorageDay[i].byRecordType = g_StorageProjectObj.struRecordAllDay.StorageDay[iCurrent].byRecordType;
			}
		}
	}
	else //copy to special day
	{
		for(var j=0; j<4; j++ )
		{
			g_StorageProjectObj.struRecordSched.StorageDay[iType].Segment[j].byRecordType = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byRecordType;
			g_StorageProjectObj.struRecordSched.StorageDay[iType].Segment[j].byStartHour = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartHour;
			g_StorageProjectObj.struRecordSched.StorageDay[iType].Segment[j].byStartMin = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartMin;
			g_StorageProjectObj.struRecordSched.StorageDay[iType].Segment[j].byStopHour = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopHour;
			g_StorageProjectObj.struRecordSched.StorageDay[iType].Segment[j].byStopMin = g_StorageProjectObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopMin;
		}
		
		g_StorageProjectObj.struRecordAllDay.StorageDay[iType].byAllDayRecord = g_StorageProjectObj.struRecordAllDay.StorageDay[iCurrent].byAllDayRecord;
		g_StorageProjectObj.struRecordAllDay.StorageDay[iType].byRecordType = g_StorageProjectObj.struRecordAllDay.StorageDay[iCurrent].byRecordType;
	}
	
}


/*==========================================
============================================
==										  ==
==			FTP参数设置代码段  			  ==
==										  ==
==			2011.03.09	By angel		  ==
============================================
==========================================*/

var g_FtpInfoObj = new FtpInfoObj();
function SendGetFtpInfo()
{
	g_FtpInfoObj.callbackfunction = function(Obj){
			g_FtpInfoObj = Obj;
			
			if(Obj.result )
			{
				if(g_WeekDate >= 0 )
				{
					$("FtpWeek").selectedIndex = g_WeekDate;
				}
				else
				{
					$("FtpWeek").selectedIndex = 6;		//星期天
				}
				
				if(g_FtpInfoObj.byUseFTP == 1)
				{
					$("EnableFtp").checked = "checked";
				}
				else
				{
					$("EnableFtp").checked = "";
				}				
				SetFtp();
				
				$("FtpAddress").value = g_FtpInfoObj.strFTPServerIpAddr;
				$("FtpPort").value = g_FtpInfoObj.dwServerPort;
				$("UserName").value = g_FtpInfoObj.strFTPCliUserName;
				$("Password").value = g_FtpInfoObj.strFTPCliUserPass;
				$("FtpStorage").value = g_FtpInfoObj.strDirectoryName;	//指定目录存放
				
				if( g_FtpInfoObj.byEnableDirectory == 0 )
				{
					$("FtpStorage").value = "";
				}
				
				for(var j=0; j< $("FileSize").options.length; j ++ )
				{
					if( $("FileSize").options[j].value == g_FtpInfoObj.dwFTPRecordFileSize )
					{
						$("FileSize").selectedIndex = j;
						break;
					}
				}
				
				SendGetFtpRecordInfo();		//获取FTP分时段录像参数
				
			}
			else
			{
				//alert("get FtpInfo fail!");
			}
		};
	
	g_FtpInfoObj.method = "POST";
	g_FtpInfoObj.asynchrony = true;
	g_FtpInfoObj.username = g_UserName;
	g_FtpInfoObj.password = g_Password;
	
	GetFtpInfo(g_FtpInfoObj);
}

var g_FtpRecordInfoObj = new FtpRecordInfoObj();
function SendGetFtpRecordInfo()
{
	g_FtpRecordInfoObj.callbackfunction = function(Obj){
			g_FtpRecordInfoObj = Obj;
			
			if(Obj.result )
			{
				SetFtpTime();		//初始化时间段页面
			}
			else
			{
				//alert("get FtpRecordInfo fail!");
			}
		};
	
	g_FtpRecordInfoObj.method = "POST";
	g_FtpRecordInfoObj.asynchrony = true;
	g_FtpRecordInfoObj.username = g_UserName;
	g_FtpRecordInfoObj.password = g_Password;
	g_FtpRecordInfoObj.CurrentChannelId = g_CurrentChannelNum;
	
	GetFtpRecordInfo(g_FtpRecordInfoObj);
}

function SendSetFtpInfo()
{
	var EnableFtp = $("EnableFtp").checked ? 1:0;
	
	if(EnableFtp)
	{
		if( isNaN($("FtpPort").value) || $("FtpPort").value.indexOf(".")>=0 ) 
		{
			alert(a_ParameterInvalid);
			if(EnableFtp == 1 )
			{
				$("FtpPort").value = "";
				$("FtpPort").focus();
			}
			return false;
		}
		
		if($("FtpAddress").value == "")
		{
			alert(a_ParameterInvalid);
			if(EnableFtp == 1 )
			{
				$("FtpAddress").value = "";
				$("FtpAddress").focus();
			}
			return false;
		}
		
		if($("UserName").value == "")
		{
			alert(a_ParameterInvalid);
			if(EnableFtp == 1 )
			{
				$("UserName").value = "";
				$("UserName").focus();
			}
			return false;
		}
		
		if($("Password").value == "")
		{
			alert(a_ParameterInvalid);
			if(EnableFtp == 1 )
			{
				$("Password").value = "";
				$("Password").focus();
			}
			return false;
		}
		
		/*if($("FtpStorage").value == "")
		{
			alert(a_ParameterInvalid);
			if(EnableFtp == 1 )
			{
				$("FtpStorage").value = "";
				$("FtpStorage").focus();
			}
			return false;
		}*/
		
		for( var k= 0; k< 4; k ++ )
		{
			if(  parseInt($("FtpstartHour" + k).value) > parseInt($("FtpstopHour" + k).value) )
			{
				alert(a_ParameterInvalid);
				return false;
			}
			
			if(  (parseInt($("FtpstartHour" + k).value) == parseInt($("FtpstopHour" + k).value) ) && (parseInt($("FtpstartMinute" + k).value) > parseInt($("FtpstopMinute" + k).value)) )
			{
				alert(a_ParameterInvalid);
				return false;
			}
		}
		
		if($("FtpStorage").value != "" )
		{
			g_FtpInfoObj.byEnableDirectory = 1;		//启用指定目录存放
		}
		else
		{
			g_FtpInfoObj.byEnableDirectory = 0;
		}
		g_FtpInfoObj.strDirectoryName = $("FtpStorage").value;	//指定目录存放
		g_FtpInfoObj.strFTPServerIpAddr = $("FtpAddress").value;
		g_FtpInfoObj.dwServerPort = $("FtpPort").value;
		g_FtpInfoObj.strFTPCliUserName = $("UserName").value;
		g_FtpInfoObj.strFTPCliUserPass = $("Password").value;
		g_FtpInfoObj.dwFTPRecordFileSize = $("FileSize").value;
	}
	
	g_FtpInfoObj.byUseFTP = EnableFtp;
	
	g_FtpInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				//alert(a_succeed);
				
				SendSetFtpRecordInfo();
				
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_FtpInfoObj.method = "POST";
	g_FtpInfoObj.asynchrony = true;
	g_FtpInfoObj.username = g_UserName;
	g_FtpInfoObj.password = g_Password;
	
	SetFtpInfo(g_FtpInfoObj);
}

function SendSetFtpRecordInfo()
{
	g_FtpRecordInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_FtpRecordInfoObj.byAudioRec = 1;		//记录音频
	g_FtpRecordInfoObj.byEnableRecord = $("EnableFtp").checked ? 1 : 0;	//是否启用录像 1--启用
	
	g_FtpRecordInfoObj.method = "POST";
	g_FtpRecordInfoObj.asynchrony = true;
	g_FtpRecordInfoObj.username = g_UserName;
	g_FtpRecordInfoObj.password = g_Password;
	g_FtpRecordInfoObj.CurrentChannelId = g_CurrentChannelNum;
	
	SetFtpRecordInfo(g_FtpRecordInfoObj);
}

function FtpSetSegment()
{
	var iDay = Number($("FtpWeek").selectedIndex);
	for(var j = 0; j< 4; j++ )
	{
		g_FtpRecordInfoObj.struRecordSched.StorageDay[iDay].Segment[j].byRecordType = 0;	//分时段录像
		g_FtpRecordInfoObj.struRecordSched.StorageDay[iDay].Segment[j].byStartHour = $("FtpstartHour"+j).value;
		g_FtpRecordInfoObj.struRecordSched.StorageDay[iDay].Segment[j].byStartMin = $("FtpstartMinute"+j).value ;
		g_FtpRecordInfoObj.struRecordSched.StorageDay[iDay].Segment[j].byStopHour = $("FtpstopHour"+j).value ;
		g_FtpRecordInfoObj.struRecordSched.StorageDay[iDay].Segment[j].byStopMin = $("FtpstopMinute"+j).value ;	
	}
}

function SetFtpTime()
{
	var	wDayOfWeek = Number($("FtpWeek").selectedIndex);
	for( var j = 0; j< 4; j++ )
	{
		$("FtpstartHour" + j).selectedIndex = g_FtpRecordInfoObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStartHour;
		$("FtpstartMinute" + j).selectedIndex = g_FtpRecordInfoObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStartMin;
		$("FtpstopHour" + j).selectedIndex = g_FtpRecordInfoObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStopHour;
		$("FtpstopMinute" + j).selectedIndex = g_FtpRecordInfoObj.struRecordSched.StorageDay[wDayOfWeek].Segment[j].byStopMin;
	}
}

function FtpSameWeek()
{
	var iType = 0;
	var iCurrent = 0;
	//get current set
	iCurrent = Number($("FtpWeek").value);
	iType = Number($("FtpCopyWeek").value);

	if( iType == -1 ) //copy to every day
	{
		for( var i= 0; i< 7 ; i++ )
		{
			if( i != iCurrent )
			{
				for(var j=0; j<4; j++ )
				{
					g_FtpRecordInfoObj.struRecordSched.StorageDay[i].Segment[j].byStartHour = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartHour;
					g_FtpRecordInfoObj.struRecordSched.StorageDay[i].Segment[j].byStartMin = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartMin;
					g_FtpRecordInfoObj.struRecordSched.StorageDay[i].Segment[j].byStopHour = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopHour;
					g_FtpRecordInfoObj.struRecordSched.StorageDay[i].Segment[j].byStopMin = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopMin;			
				}
			}
		}
	}
	else //copy to special day
	{
		for(var j=0; j<4; j++ )
		{
			g_FtpRecordInfoObj.struRecordSched.StorageDay[iType].Segment[j].byStartHour = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartHour;
			g_FtpRecordInfoObj.struRecordSched.StorageDay[iType].Segment[j].byStartMin = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStartMin;
			g_FtpRecordInfoObj.struRecordSched.StorageDay[iType].Segment[j].byStopHour = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopHour;
			g_FtpRecordInfoObj.struRecordSched.StorageDay[iType].Segment[j].byStopMin = g_FtpRecordInfoObj.struRecordSched.StorageDay[iCurrent].Segment[j].byStopMin;
		}
	}
}

function SetFtp()
{
	if( $("EnableFtp").checked == false )
	{
		$("FtpAddress").disabled = "disabled";
		$("FtpPort").disabled = "disabled";
		$("UserName").disabled = "disabled";
		$("Password").disabled = "disabled";
		$("FileSize").disabled = "disabled";
		$("FtpStorage").disabled = "disabled";
	}
	else
	{
		$("FtpAddress").disabled = "";
		$("FtpPort").disabled = "";
		$("UserName").disabled = "";
		$("Password").disabled = "";
		$("FileSize").disabled = "";
		$("FtpStorage").disabled = "";
	}
}

