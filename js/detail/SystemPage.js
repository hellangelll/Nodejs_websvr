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
		case "imgTimeSet":
			string = g_sTimeSet;
			break;
			
		case "imgUpDate" :
			string = g_sUpDateInfo +"<br />"+ img + g_sYouNeedChoose;
			break;
			
		case "imgSavaSetting":
			string = g_sSaveSetting;
			break;
			
		case "imgRestore":
			string = g_sRestore;
			break;
			
		case "imgRestart":
			string = g_sRestart;
			break;
			
		case "imgSetTimeZone":
			string = g_sImgTimezone;
			break;
			
		case "imgInitalizeDisk":
			string = g_sInitalizeDisk;
			break;
			
		case "imgOutputMode":
			string = g_sOutputMode;
			break;
			
		case "imgVideoPosition":
			string = g_sVideoPosition;
			break;
			
		case "imgEnableDecoderOutput":
			string = g_sEnableDecoderOutput;
			break;
			
		case "imgEnableEnableOSD":
			string = g_sEnableEnableOSD;
			break;
			
		case "alarmStreamStatus":
			string = "<span style='color:red;'>"+ g_sStreamStatus +"</span>";
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
		g_HideHelpInfoInterval = setInterval("TriggerTimerHideDiv()",10);
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
==				用户信息代码段  		  ==
==										  ==
==			2011.03.07	By angel		  ==
============================================
==========================================*/

//获取用户信息
var g_UserInfoObj = new UserInfoObj();
function SendGetUserInfo()
{
	g_UserInfoObj.callbackfunction = function(Obj){
			g_UserInfoObj = Obj;
			
			if(Obj.result )
			{
				//初始化用户信息页面参数
				InitUserInfo();
				
				
			}
			else
			{
				//alert("get User info fail");
			}
		};
	
	g_UserInfoObj.method = "POST";
	g_UserInfoObj.asynchrony = false;		//必须为同步
	g_UserInfoObj.username = g_UserName;
	g_UserInfoObj.password = g_Password;
	g_UserInfoObj.CurrentChannelId = 0;
	
	GetUserInfo(g_UserInfoObj);
}

function InitUserInfo()
{
	//获取用户总数
	var UserListLength = g_UserInfoObj.iUserCount;		
	//生成用户列表
	var strUserList = '<table width="139" id="UserListTable" class="csTableBoder" ><tr title="bottom"><td style="border-bottom:1 #2a7ed4 solid;" align="center" valign="bottom" ><span id="UserList">用户列表</span></td></tr>';
	for(var i=0; i<UserListLength; i++)
	{
		if(g_UserName == g_UserInfoObj.struUserInfo[i].szUserName )
		{
			//获取当前登录用户的权限
			g_UserRight = g_UserInfoObj.struUserInfo[i].dwRemoteRightLo;
		}
		
		//获取用户列表  动态生成用户列表
		var OtherUserName 		= g_UserInfoObj.struUserInfo[i].szUserName;
		var OtherUserRight 		= g_UserInfoObj.struUserInfo[i].dwRemoteRightLo;
		var OtherUserPassword 	= g_UserInfoObj.struUserInfo[i].szPassword;
		
		strUserList += '<tr background="#000000;" ><td id="tr'+ i +'" align="left" onclick="GetUserRight(\'' + OtherUserRight + '\',\'' + OtherUserName + '\',\'' + i + '\',\'' + UserListLength + '\',\'' + OtherUserPassword + '\');" >'+ OtherUserName +'</td></tr>';
		
	}
	strUserList += '</table>';
	document.getElementById("AddUserListDiv").innerHTML = strUserList;

	//初始化页面语言
	InitTheSystemPageLanguage();
}

function GetUserRight(UserRight,username,userid,UserCount,userpassword)
{
	document.getElementById("PTZ").checked = ((0x00000001 & UserRight) != 0 ?  true : false);
	document.getElementById("RECORD").checked = ((0x00000002 & UserRight) !=0 ? true: false);
	document.getElementById("PLAYBACK").checked = ((0x00000004 & UserRight) !=0 ? true: false);
	document.getElementById("SET").checked = ((0x00000008 & UserRight) != 0 ? true : false);
	document.getElementById("STATE").checked = ((0x00000010 & UserRight) != 0 ? true : false);
	document.getElementById("ADVANCE").checked = ((0x00000020 & UserRight) != 0 ? true : false);
	document.getElementById("NETTALK").checked = ((0x00000040 & UserRight) != 0 ? true : false);
	document.getElementById("VIEW").checked = ((0x00000080 & UserRight) != 0 ? true : false);
	document.getElementById("MODIUSER").checked = ((0x00000800 & UserRight) != 0 ? true : false);
	document.getElementById("MODIPWD").checked = ((0x00001000 & UserRight) != 0 ? true : false);
	
	//set the selected user
	document.getElementById("currentuser").value = username;
 	document.getElementById("currentindex").value = userid;
	document.getElementById("currentuserpassword").value = userpassword;
	ClickTable(userid,UserCount);
	document.getElementById("btnDelUser").disabled = "";
	document.getElementById("btnModifyUser").disabled = "";
	document.getElementById("btnModifyRight").disabled = "";
}

function ClickTable(id, iCount)
{
	for(var i=0; i< iCount ;i ++ )
	{
		if( i == id )
		{
			document.getElementById("tr" + i).style.background="#999999";
			document.getElementById("tr" + i).style.color="#FFFFFF";
		}
		else
		{
			document.getElementById("tr" + i).style.background = "#ffffff";
			document.getElementById("tr" + i).style.color="#000";
		}
	}
}

var g_CurrentOperate = "";
function AddUser()
{
	g_CurrentOperate = 2;
	//judge right
	if( (0x00000800 & g_UserRight) != 0 )
	{
		$("UserListTable").style.display = "none";
		$("addUserTable").style.display = "";
	}
	else
	{
		alert(a_NoPopedom);
	}
}

function ReturnUserListTable()
{
	$("UserListTable").style.display = "";
	$("addUserTable").style.display = "none";
	$("ModifyPwdTable").style.display = "none";
}

//添加用户
var g_UserCfgObj = new UserCfgObj();
function AddUserInfo()
{
	var strUser = "";
	document.getElementById("currentopt").value = 2;
	strUser = document.getElementById("AddUserUserName").value;
	if( strUser.replace(/(^\s*)|(\s*$)/g, "").length == 0 )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserUserName").focus();
		return false;
	}

	if( strUser.indexOf("'") != -1 )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserUserName").value = "";
		document.getElementById("AddUserUserName").focus();
		return false;
	}
	
	if( strUser.indexOf('"') != -1 )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserUserName").value = "";
		document.getElementById("AddUserUserName").focus();
		return false;
	}
	
	if( strUser.indexOf(" ") != -1 )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserUserName").value = "";
		document.getElementById("AddUserUserName").focus();
		return false;
	}
	
	if( document.getElementById("AddUserPassword").value.replace(/(^\s*)|(\s*$)/g, "").length == 0 )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserPassword").focus();
		return false;
	}
	
	if( document.getElementById("AddUserPassword").value.indexOf(" ") != -1 )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserPassword").value = "";
		document.getElementById("AddUserPassword").focus();
		return false;
	}
	
	if( document.getElementById("AddUserPassword2").value != document.getElementById("AddUserPassword").value )
	{
		alert(a_ParameterInvalid);
		document.getElementById("AddUserPassword2").value = "";
		document.getElementById("AddUserPassword2").focus();
		return false;
	}
	
	g_UserCfgObj.operate = "AddUser";
	g_UserCfgObj.szUserName = document.getElementById("AddUserUserName").value;
	g_UserCfgObj.szPassword = calcMD5(document.getElementById("AddUserPassword2").value);		//MD5加密
	
	g_UserCfgObj.callbackfunction = function(Obj){
			
			if(Obj.result == 0)
			{
				alert(a_addUserSuc);					//添加用户成功
				
				$("UserListTable").style.display = "";
				$("addUserTable").style.display = "none";
				
				$("AddUserPassword").value = "";
				$("AddUserPassword2").value = "";
				$("AddUserUserName").value = "";
				
				//重新初始化用户信息列表
				SendGetUserInfo();
			}
			else if( Obj.result == -2)
			{
				alert(a_UserExists);					//用户已经存在
				return false;
			}
			else if(Obj.result == -3)
			{
				alert(a_UserExceed);					//用户数量已经超过最大数量限制
				return false;
			}
			else
			{
				alert(a_addUserFail);					//添加用户失败
				
				$("AddUserPassword").value = "";
				$("AddUserPassword2").value = "";
				$("AddUserUserName").value = "";
				
				return false;
			}
		};
	
	g_UserCfgObj.method = "POST";
	g_UserCfgObj.asynchrony = false;
	g_UserCfgObj.username = g_UserName;
	g_UserCfgObj.password = g_Password;
	
	SetUserCfg(g_UserCfgObj);
}


function ModifyRight()
{
	g_CurrentOperate = 4;
	//set the current operation
	document.getElementById("currentopt").value = 4;
	if( document.getElementById("currentuser").value == "" )
	{
		alert(a_ChooseUser);
		return false;
	}
	
	var UserRight = 0;
	
	if(document.getElementById("MODIUSER").checked)
	{
		if( CheckUserRight(0x00000800) ) 
		{
			UserRight = UserRight + 0x00000800;
		}
		else 
		{
			alert( a_notRightClose );
			return false;
		}
	}
	
	if(document.getElementById("PTZ").checked )
	{
		UserRight = UserRight + 0x00000001;
	}

	if(document.getElementById("RECORD").checked)
	{
		UserRight = UserRight + 0x00000002;
	}
	
	if(document.getElementById("PLAYBACK").checked)
	{
		UserRight = UserRight + 0x00000004;
	}
		
	if(document.getElementById("SET").checked)
	{
		UserRight = UserRight + 0x00000008;
	}
	
	if(document.getElementById("STATE").checked)
	{
		UserRight = UserRight + 0x00000010;
	}
	
	if(document.getElementById("ADVANCE").checked)
	{
		UserRight = UserRight + 0x00000020;
	}
	
	if(document.getElementById("NETTALK").checked)
	{
		UserRight = UserRight + 0x00000040;
	}
	
	if(document.getElementById("VIEW").checked)
	{
		UserRight = UserRight + 0x00000080;
	}
	
	if(document.getElementById("MODIPWD").checked)
	{
		UserRight = UserRight + 0x00001000;
	}

	g_UserCfgObj.operate = "MotifyRight";
	g_UserCfgObj.szUserName = document.getElementById("currentuser").value;
	g_UserCfgObj.dwRemoteRightLo = UserRight;
	
	g_UserCfgObj.callbackfunction = function(Obj){
			
			if(Obj.result == 0)
			{
				alert(a_UserPopSuc);					//用户权限修改成功
			}
			
			//重新初始化用户信息列表
			SendGetUserInfo();
		};
	
	g_UserCfgObj.method = "POST";
	g_UserCfgObj.asynchrony = false;
	g_UserCfgObj.username = g_UserName;
	g_UserCfgObj.password = g_Password;
	
	SetUserCfg(g_UserCfgObj);
	
}

function CheckModifyPwd()
{
	if( document.getElementById("currentuser").value == "" )
	{
		alert(a_ChooseUser);
		return false;
	}
	$("MUserName").value = document.getElementById("currentuser").value;
	$("MPasswordRepeat").value = "";
	$("MPasswordNew").value = "";
	$("MPasswordOld").value = "";
	
	$("UserListTable").style.display = "none";
	$("ModifyPwdTable").style.display = "";
}

function ModifyPwdInfo()
{
	//判断是修改自己的密码还是修改别人的密码
	if ( g_UserName == $("MUserName").value ) 
	{
		//是否有修改密码的权限
		if( !CheckUserRight(0x00001000) && !CheckUserRight(0x00000800) ) 
		{
			alert( a_notRightClose );
			return false;
		}
	} 
	else 
	{
		//是否有修改别人密码的权限
		if( !CheckUserRight(0x00000800) ) 
		{
			alert( a_notRightClose );
			return false;
		}
	}	
	
	if( document.getElementById("MPasswordNew").value != document.getElementById("MPasswordRepeat").value )
	{
		alert(a_PswDisaccord);
		document.getElementById("MPasswordRepeat").value = "";
		document.getElementById("MPasswordRepeat").focus();
		return false;
	}
	
	g_UserCfgObj.operate = "MotifyPassword";
	g_UserCfgObj.szUserName = document.getElementById("currentuser").value;
	g_UserCfgObj.szPassword = calcMD5(document.getElementById("MPasswordOld").value); //MD5加密
	g_UserCfgObj.szMotifyPassword = calcMD5(document.getElementById("MPasswordRepeat").value);	//MD5加密
	
	g_UserCfgObj.callbackfunction = function(Obj){
			
			if(Obj.result == "0")
			{
				alert(a_ModifyUserPswSuc);				//修改用户密码成功
				
				$("UserListTable").style.display = "";
				$("ModifyPwdTable").style.display = "none";
				
				//重新初始化用户信息列表
				SendGetUserInfo();
			}
			else
			{
				alert(a_PswErr);					//密码不正确
			}
		};
	
	g_UserCfgObj.method = "POST";
	g_UserCfgObj.asynchrony = false;
	g_UserCfgObj.username = g_UserName;
	g_UserCfgObj.password = g_Password;
	
	SetUserCfg(g_UserCfgObj);
}

function DelUser()
{
	var str = a_SureDelUser + document.getElementById("currentuser").value + " ?";
	if( document.getElementById("currentuser").value == "" )
	{
		alert(a_ChooseUser);
		return false;
	}
	
	if( document.getElementById("currentuser").value == getCookie("g_UserName") ) 
	{
		alert(a_UserLogin);			//用户已经登录,不能删除
		return false;
	}
	
	if( confirm(str) )
	{		
		g_UserCfgObj.operate = "DelUser";
		g_UserCfgObj.szUserName = document.getElementById("currentuser").value;
		
		g_UserCfgObj.callbackfunction = function(Obj){
			
			if(Obj.result == "-2")
			{
				alert(a_UserLogin);					//用户已经登录,不能删除
			}
			else if(Obj.result == "-3")
			{
				alert(a_NotDelUser);					//不能删除该用户
			}
			else if(Obj.result == "0")
			{
				alert(a_DelUserSuc);					//删除用户成功
			}
			else
			{
				alert(a_DelUserFail);					//删除用户失败
			}
			
			//重新初始化用户信息列表
			SendGetUserInfo();
		};
	
		g_UserCfgObj.method = "POST";
		g_UserCfgObj.asynchrony = false;
		g_UserCfgObj.username = g_UserName;
		g_UserCfgObj.password = g_Password;
		
		SetUserCfg(g_UserCfgObj);
	}
}

/*==========================================
============================================
==										  ==
==			系统高级设置代码段  		  ==
==										  ==
==			2011.03.09	By angel		  ==
============================================
==========================================*/


var g_TimeInfoObj = new TimeInfoObj();
function SendGetTimeInfo()
{
	g_TimeInfoObj.callbackfunction = function(Obj){
			 g_TimeInfoObj = Obj;
			
			if(Obj.result )
			{
				var ServerTime = Obj.wYear + "-" + Obj.wMonth + "-" + Obj.wDay + " (" + g_vWeek[Number(Obj.wDayOfWeek)] + ") " +  Obj.wHour + ":" + Obj.wMinute + ":" + Obj.wSecond;
				document.getElementById("ServerTime").value = ServerTime;
			
				var timezone = 0;
				for(var j=0; j<document.getElementById("timezone").options.length; j++ )
				{
					timezone = Obj.wTimeZone;				
					if( parseInt(document.getElementById("timezone").options[j].value) == parseInt(timezone) )
					{
						document.getElementById("timezone").selectedIndex = j;
						break;
					}
				}

			}
			else
			{
				alert("get timeinfo card info fail!");
			}
		};
	
	g_TimeInfoObj.method = "POST";
	g_TimeInfoObj.asynchrony = true;		//异步
	g_TimeInfoObj.username = g_UserName;
	g_TimeInfoObj.password = g_Password;
	
	GetTimeInfo(g_TimeInfoObj);
}


function SendSetTimeInfo()
{
	//calculate the location time
 	var d = new Date();
	var timezone = (parseInt(document.getElementById("timezone").value) * 60 );
	var time = d.getTime();
	time = time - timezone * 60000;
	var utcTime = new Date(time);
	
	var s1 = new Date(2004,1,1);
	var s2 = new Date(2004,6,1);
	var bDayLight = s1.getTimezoneOffset != s2.getTimezoneOffset ;
	bDayLight = bDayLight ? 1 : 0;

	var Hour = parseInt(document.getElementById("timezone").value) + utcTime.getHours();

	g_TimeInfoObj.wTimeZone = parseInt(document.getElementById("timezone").value);
	
	g_TimeInfoObj.wYear 			= utcTime.getYear();
	g_TimeInfoObj.wMonth 			= utcTime.getMonth()+1;
	g_TimeInfoObj.wDay 				= utcTime.getDate();
	g_TimeInfoObj.wDayOfWeek 		= utcTime.getDay();
	g_TimeInfoObj.wHour 			= Hour;
	g_TimeInfoObj.wMinute 			= utcTime.getMinutes(); 
	g_TimeInfoObj.wSecond			= utcTime.getSeconds();
	g_TimeInfoObj.iDayLightTime		= bDayLight;

	g_TimeInfoObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				//alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	g_TimeInfoObj.method = "POST";
	g_TimeInfoObj.asynchrony = true;
	g_TimeInfoObj.username = g_UserName;
	g_TimeInfoObj.password = g_Password;
	
	SetTimeInfo(g_TimeInfoObj);
	
}

function UpGradeSystem()
{
	if( !CheckUserRight(0x00000020) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	try
	{
		//check the control 
		CreateVideow();
		if(g_Language == "English")
		{	
			PlayCtrl.SetLanguageType("EN");
		}
		else if(g_Language == "Chinese")
		{
			PlayCtrl.SetLanguageType("CN");
		}
		
		//PlayCtrl.SetLanguageType("CN");
		PlayCtrl.SetIPAddress(window.location.hostname);

		var ip = g_ServerIp;
		var user = g_UserName;
		var pwd  = g_Password;
		var port  = g_ServerPort;
		var iChannel = 0;
		
		//get the file name
		var sFile = "";
		var  iRet = 0;
		PlayCtrl.Login(ip,port,user,pwd,true);
		iRet = PlayCtrl.UpgradeSystem(sFile);
		if( iRet == 1 )
		{
			//SaveParam(0);
			SendSetReboot();
		}
			
	}
	catch(err)
	{
		//hidde the body
		document.getElementById("DIVbg").style.display    = "none";
		document.getElementById("DIVfg").style.display    = "none";
		document.getElementById("DIVTitle").style.display = "none";
		
		//need user to down load control 
		document.getElementById("divDownload").style.display = "block";
		document.getElementById("divDownload").style.left =  parseInt( document.body.clientWidth)/3;
		document.getElementById("divDownload").style.width = 200;
		document.getElementById("divDownload").style.top = parseInt(document.documentElement.clientHeight)/4;
		
	}
}

function CreateVideow()
{
	str = document.createElement("div");  
 	str.id  = "VideowDiv";
 	document.body.appendChild(str);   
	
	with(str.style)   
	{   
	  position = "absolute";   
	  zIndex   = "1000";  
	  display  = "none"; 
	}  
	
	//设置DIV的html  
	var strHtml = "<table id='PlayWindow' border='2' width='512' height='360' bgcolor='#cccccc' style='border:thin' cellspacing='0'>" + "<tr height='384' valign='top'><td  align='left' style='cursor:default;border:outset 1;' bgcolor='#CCCCFF' align='center' ><span id='Loading'>" +  "<object classid='clsid:866220F2-4079-4D30-A9A8-E48741BD65B6'  name='PlayCtrl' id='PlayCtrl' width='512' height='384' hspace='0' + vspace='0' align='center' id='PlayCtrl"  + "'> </span>" + "<embed width='512' height='384' hspace='0' vspace='0' align='center' name='PlayCtrl'></embed> " +" </object> <object name='ert' width='0' height='0'>" +  "</td></tr></table>"
	
	document.getElementById(str.id).style.left   = (document.documentElement.clientWidth)/2  - 512/2;
 	document.getElementById(str.id).style.top    =  (document.documentElement.clientHeight)/10;
	document.getElementById(str.id).innerHTML    = strHtml;
	document.getElementById(str.id).style.width  = 512;
	document.getElementById(str.id).style.height = 384;
	document.getElementById(str.id).style.display = "none";
}

function SaveParam(command)
{	
	if( !CheckUserRight(0x00000008) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	 //0--reboot; 1--saveconfig; 2--restore;3--backup system  
	 //if reboot ,then close the explorer
	 if( command == 0 )
	 {
		//var str = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>Reset</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';		
	 }
	 
	 if( command == 1)
	 {
		 var str = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>SaveConfig</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
		 document.getElementById("welcomDiv").style.display="block";
		// g_Interval = setInterval("DisplayPress()",300);
	}
	
	if( command == 2)
	{
		 var str = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>Restore</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	}
	
	if( xmlDoc.loadXML(str) )
	{
		var sDate = new Date();
		var url = "AipstarWebService?824ec5=" + g_UserName + "&5aa765=" + g_Password + "&date=" + sDate.getTime();
		request.open("POST", url, false);
		request.onreadystatechange = updatePage;
		request.send(xmlDoc);
	}
	window.parent.location = "login.html";
}

//重启
function SendSetReboot()
{
	
	if( !CheckUserRight(0x00000020) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	if(confirm(a_confirmReboot))
	{
		var ExpRebootObj = new RebootObj();
		
		ExpRebootObj.callbackfunction = function(Obj){
				if(Obj.result )
				{
					parent.FramesetTwo.cols = "0,*";
					top.FramesetAll.rows = "0,*";
					
					$("AdvancedSetDiv").style.display = "none";
					alert(a_waitfor);
					//$("waitfor").innerHTML = a_waitfor;
					
					//$("ActionDiv").style.left =  (parseInt(document.body.clientWidth)-650)/2 + "px";
					//$("ActionDiv").style.top = (parseInt(document.documentElement.clientHeight))/3 + "px";
					//$("ActionDiv").style.display = "";
					
					//g_ServiceLiveInterval = setInterval("SendCheckServiceLive()", 5000);
				}
				else
				{
					alert(a_faild);
				}
			};
		
		ExpRebootObj.method = "POST";
		ExpRebootObj.asynchrony = false;
		ExpRebootObj.username = g_UserName;
		ExpRebootObj.password = g_Password;
		
		SetReboot(ExpRebootObj);
		
	}
}

//关机
function SendSetShutdown()
{
	if( (0x00000020 & g_UserRight) != 0 ) 
	{
		if(confirm(a_confirmShutdown))
		{
			var ExpShutdownObj = new ShutdownObj();
			
			ExpShutdownObj.callbackfunction = function(Obj){
					
					if(Obj.result )
					{
						alert( a_selfClose );
					}
					else
					{
						alert(a_faild);
					}
				};
			
			ExpShutdownObj.method = "POST";
			ExpShutdownObj.asynchrony = false;
			ExpShutdownObj.username = g_UserName;
			ExpShutdownObj.password = g_Password;
			
			SetShutdown(ExpShutdownObj);
		}
	} 
	else 
	{
		alert(a_notRightClose);
	}
}

var g_ServiceLiveInterval;
function SendCheckServiceLive()
{	
	var ExpServiceLiveObj = new ServiceLiveObj();
	ExpServiceLiveObj.callbackfunction = function(Obj){
		
		clearInterval(g_ServiceLiveInterval);
		setTimeout('top.location.href = "login.html";', 3000);
	};
	
	ExpServiceLiveObj.method = "POST";
	ExpServiceLiveObj.asynchrony = true;
	ExpServiceLiveObj.username = g_UserName;
	ExpServiceLiveObj.password = g_Password;
	
	CheckServiceLive(ExpServiceLiveObj);
}

//保存
function SendSaveConfig()
{
	if( !CheckUserRight(0x00000008) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	var ExpSaveConfigObj = new SaveConfigObj();
	
	ExpSaveConfigObj.callbackfunction = function(Obj){
			
			if(Obj.result )
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
	
	ExpSaveConfigObj.method = "POST";
	ExpSaveConfigObj.asynchrony = false;
	ExpSaveConfigObj.username = g_UserName;
	ExpSaveConfigObj.password = g_Password;

	SetSaveConfig(ExpSaveConfigObj);
}

//恢复出厂设置
function SendSetRestore()
{
	if( !CheckUserRight(0x00000020) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	if(confirm(a_confirmRestore))
	{
		var ExpRestoreObj = new RestoreObj();
		ExpRestoreObj.callbackfunction = function(Obj){
				
				if(Obj.result )
				{
					//调用重启
					SendSetReboot();
				}
				else
				{
					alert(a_faild);
				}
			};
		
		ExpRestoreObj.method = "POST";
		ExpRestoreObj.asynchrony = false;
		ExpRestoreObj.username = g_UserName;
		ExpRestoreObj.password = g_Password;
	
		SetRestore(ExpRestoreObj);
	}
}



/*==========================================
============================================
==										  ==
==			磁盘参数设置代码段  	      ==
==										  ==
==			2011.03.17	By angel		  ==
============================================
==========================================*/

var g_DriveInfoObj = new DriveInfoObj();
function SendGetDriveInfo()
{	
	g_DriveInfoObj.callbackfunction = function(Obj){
			g_DriveInfoObj = Obj;
			
			if(Obj.result )
			{
				//初始化磁盘参数设置页面
				InitDriveInfo();
			}
			else
			{
				//alert("get Drive info fail");
				return false;
			}
			
		};
	
	g_DriveInfoObj.method = "POST";
	g_DriveInfoObj.asynchrony = true;		//必须为同步
	g_DriveInfoObj.username = g_UserName;
	g_DriveInfoObj.password = g_Password;
	
	GetDriveInfo(g_DriveInfoObj);
}

function SendSetDriveInfo()
{
	if( !CheckUserRight(0x00000010) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	if(g_SelectedTr != "")
	{
		if(confirm(a_SureInitialize)) 
		{
			$("btnRefresh").disabled = true;
			
			var num = Number(g_SelectedTr.replace(/[^0-9]/ig,""));
			
			g_DriveInfoObj.struDisk.Drive[num].byReset = 1;
			
			g_DriveInfoObj.callbackfunction = function(Obj){
				
				parent.FramesetTwo.cols = "200,*";
				top.FramesetAll.rows = "35,*";
				$("DriveSetDiv").style.display = "";
				$("ActionDiv").style.display = "none";
				$("strDeviceNote").style.display = "";
								
				if(Obj.result )
				{
					alert(a_InitializeSucceed);
					
					//刷新页面
					setTimeout("SendGetDriveInfo()", 5000);
				}
				else
				{
					alert(a_InitializeFail);
				}
				
				//本地更改已初始化磁盘的标志
				//g_DriveInfoObj.struDisk.Drive[num].byReset = 0;
				
				//本地修改磁盘初始化的状态标志  
				//g_DriveInfoObj.struDisk.Drive[num].byInit = 1;
				
			};
			
			g_DriveInfoObj.method = "POST";
			g_DriveInfoObj.asynchrony = true;
			g_DriveInfoObj.username = g_UserName;
			g_DriveInfoObj.password = g_Password;
			
			parent.FramesetTwo.cols = "0,*";
			top.FramesetAll.rows = "0,*";
			$("DriveSetDiv").style.display = "none";
			$("ActionDiv").style.left =  (parseInt(document.body.clientWidth)-650)/2 + "px";
			$("ActionDiv").style.top = (parseInt(document.documentElement.clientHeight))/3 + "px";
			$("waitfor").innerHTML = a_waitforDevice;
			$("ActionDiv").style.display = "";
			
			SetDriveInfo(g_DriveInfoObj);
			
		}
		else
		{
			return false;
		}		
	}
	else
	{
		alert(a_ChooseDreve);
	}
}

//初始化磁盘参数设置页面
function InitDriveInfo()
{
	var str = '<table width="100%" height="100%" border="1" cellspacing="0"><tr><td width="20%" align="center"><span id="DriveId">'+ a_DriveId +'</span></td><td width="20%" align="center" style="display:none;"><span id="DriveType">'+a_DriveType+'</span>:</td><td width="20%" align="center"><span id="DrivTotalSpace">'+a_DrivTotalSpace+'</span>:</td><td width="20%" align="center"><span id="DrivUsefullSpace">'+a_DrivUsefullSpace+'</span>:</td><td width="20%" align="center"><span id="DeviceReset">'+a_DeviceReset+'</span>:</td></tr>';
	
	//add by zzt, get the really disk id
	var iDiskId = 0;
	for(var i=0; i<g_DriveInfoObj.dwDriveCount; i++ )
	{
		iDiskId = g_DriveInfoObj.struDisk.Drive[i].byDiskID;
		iDiskID = parseInt(iDiskId) + 1;
		str += '<tr onmouseover="ShowShadowsDriveInfo(0,\'trDriveInfo'+ i +'\');" onmouseout="ShowShadowsDriveInfo(1,\'trDriveInfo'+ i +'\');" onclick="ShowShadowsDriveInfo(2,\'trDriveInfo'+ i +'\');" ondblclick="" id="trDriveInfo'+ i +'">'
		str += '<td width="20%" align="center">' + iDiskID +'</td>';	
		str += '<td width="20%" align="center" style="display:none;">' + g_DriveInfoObj.struDisk.Drive[i].dwDriveType +'</td>';	
		str += '<td width="20%" align="center">' + g_DriveInfoObj.struDisk.Drive[i].dwTotalSpace +' M</td>';	
		str += '<td width="20%" align="center">' + g_DriveInfoObj.struDisk.Drive[i].dwUsefullSpace +' M</td>';	
		
		if(g_DriveInfoObj.struDisk.Drive[i].byInit == 1)
		{
			str += '<td width="20%" id="EnableTurn'+ i +'" align="center">'+ a_strInitialized +'</td></tr>';
		}
		else
		{
			str += '<td width="20%" id="EnableTurn'+ i +'" align="center">' + a_strUninitialized + '</td></tr>';
		}
	}
	
	document.getElementById("trDriveInfo").innerHTML = str + "</table>";	
	
	$("btnRefresh").disabled = false;
	$("strDeviceNote").style.display = "none";
	
	/*for(var i=0; i<g_DriveInfoObj.getElementsByTagName("dwDriveCount")[0].nodeTypedValue; i++ )
	{
		if(g_DriveInfoObj.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[0].nodeTypedValue == 1)
		{
			document.getElementById("EnableTurn" + i).innerHTML = g_Initialized;
		}
		else
		{
			document.getElementById("EnableTurn" + i).innerHTML = g_Uninitialized;
		}
	}*/
	
	
}

//响应鼠标事件  实时改变表格颜色
var g_SelectedTr = "";
function ShowShadowsDriveInfo(way,which)
{
	var WhichTr = document.getElementById(which);
	switch(way)
	{
		case 0:		//onmouseover
			WhichTr.className = "color1";
			WhichTr.style.cursor = "hand";
			
			break;	
		case 1:		//onmouseout
			if( which != g_SelectedTr )
			{
				WhichTr.className = "color2";
			}
			break;	
		case 2:		//onclick
			if( g_SelectedTr != "" )
			{
				document.getElementById(g_SelectedTr).className = "color2";
			}
			g_SelectedTr = which;
			
			WhichTr.className = "color1";
			document.getElementById("btnModify").disabled = "";
			break;			
	}
}

/*==========================================
============================================
==										  ==
==			视频坐标设置代码段  		  ==
==										  ==
==			2011.08.12	By angel		  ==
============================================
==========================================*/
var g_VideoPositionInfoObj = new VideoPositionObj();
function SendGetVideoPositionInfo()
{
	g_VideoPositionInfoObj.callbackfunction = function(Obj){
		g_VideoPositionInfoObj = Obj;
		
		if(Obj.result )
		{
			$("CoordinateX").value = Obj.dwPositionX;
			$("CoordinateY").value = Obj.dwPositionY;
			
			if( Obj.dwEnableVGA == 1 )
			{
				$("OutPutType").selectedIndex = 0;
				$("VGAType").disabled = ""
			}
			else
			{
				$("OutPutType").selectedIndex = 1;
				$("VGAType").disabled = "disabled"
			}
			
			if( Obj.dwEnableSwitch == 1 )
			{
				$("EnableVideoTransition").checked = true;
				//$("VideoTransitionInterval").disabled = ""
			}
			else
			{
				$("EnableVideoTransition").checked = false;
				//$("VideoTransitionInterval").disabled = "disabled"
			}
			
			if(Obj.dwSwitchTime <= 0)
			{
				$("VideoTransitionInterval").value = 30;
			}
			else
			{
				$("VideoTransitionInterval").value = Obj.dwSwitchTime;
			}
			
			if( Obj.dwEnableDecoderOutput == 1 )
			{
				$("EnableDecoderOutput").checked = true;
			}
			else
			{
				$("EnableDecoderOutput").checked = false;
			}
			
			if( Obj.dwEnableOSD == 1 )
			{
				$("EnableOSD").checked = true;
			}
			else
			{
				$("EnableOSD").checked = false;
			}
			
			ChangeTheEnableOSD();
			
			ChangeTheVga();
			
			ChangeTheVideoSwitch();
			
			//vga输出位置
			for(var i=0; i<$("VGAType").options.length; i++)
			{
				if($("VGAType").options[i].value == Obj.szStandName)
				{
					$("VGAType").selectedIndex = i;
					break;
				}
			}
			
			$("OSDPositionX").value = g_VideoPositionInfoObj.dwOSDPositionX;
			$("OSDPositionY").value = g_VideoPositionInfoObj.dwOSDPositionY;
		}
		else
		{
			//alert("get VideoPosition info fail");
			return false;
		}
		
	};

	g_VideoPositionInfoObj.method = "POST";
	g_VideoPositionInfoObj.asynchrony = false;
	g_VideoPositionInfoObj.username = g_UserName;
	g_VideoPositionInfoObj.password = g_Password;
	
	GetVideoPositionInfo(g_VideoPositionInfoObj);
}

function SendSetVideoPositionInfo()
{
	if( $("EnableVideoTransition").checked )
	{
		if(isNaN($("VideoTransitionInterval").value))
		{
			alert(a_ParameterInvalid);
			$("VideoTransitionInterval").value = "";
			$("VideoTransitionInterval").focus();
			return false;
		}
		
		if(($("VideoTransitionInterval").value < 10 || $("VideoTransitionInterval").value > 255))
		{
			alert(a_ParameterInvalid);
			$("VideoTransitionInterval").value = "";
			$("VideoTransitionInterval").focus();
			return false;
		}
	}
	
	if( isNaN($("CoordinateX").value) || isNull( $("CoordinateX").value) )
	{
		alert(a_ParameterInvalid);
		$("CoordinateX").value = "";
		$("CoordinateX").focus();
		return false;
	}
	
	if( isNaN($("CoordinateY").value) || isNull( $("CoordinateY").value) )
	{
		alert(a_ParameterInvalid);
		$("CoordinateY").value = "";
		$("CoordinateY").focus();
		return false;
	}
	
	if( isNaN($("OSDPositionX").value) || isNull( $("OSDPositionX").value) )
	{
		alert(a_ParameterInvalid);
		$("OSDPositionX").value = "";
		$("OSDPositionX").focus();
		return false;
	}
	
	if( isNaN($("OSDPositionY").value) || isNull( $("OSDPositionY").value) )
	{
		alert(a_ParameterInvalid);
		$("OSDPositionY").value = "";
		$("OSDPositionY").focus();
		return false;
	}
	
	g_VideoPositionInfoObj.dwPositionX = $("CoordinateX").value;
	g_VideoPositionInfoObj.dwPositionY = $("CoordinateY").value;
	g_VideoPositionInfoObj.dwSwitchTime = $("VideoTransitionInterval").value;
	g_VideoPositionInfoObj.dwEnableSwitch = $("EnableVideoTransition").checked ? 1 : 0;
	g_VideoPositionInfoObj.dwEnableDecoderOutput = $("EnableDecoderOutput").checked ? 1 : 0;
	g_VideoPositionInfoObj.dwEnableOSD = $("EnableOSD").checked ? 1 : 0;
	g_VideoPositionInfoObj.dwOSDPositionX = $("OSDPositionX").value;
	g_VideoPositionInfoObj.dwOSDPositionY = $("OSDPositionY").value;
	
	if($("OutPutType").value == 0 )
	{
		g_VideoPositionInfoObj.dwEnableVGA = 1;	//启用VGA
	}
	else
	{
		g_VideoPositionInfoObj.dwEnableVGA = 0;	//用户ypbpr
	}
	
	//vga输出类型
	g_VideoPositionInfoObj.szStandName = $("VGAType").value;
	
	g_VideoPositionInfoObj.callbackfunction = function(Obj){
		
		if(Obj.result )
		{
			alert(a_succeed);
		}
		else
		{
			alert(a_faild);
		}
	};
	
	g_VideoPositionInfoObj.method = "POST";
	g_VideoPositionInfoObj.asynchrony = false;
	g_VideoPositionInfoObj.username = g_UserName;
	g_VideoPositionInfoObj.password = g_Password;
	
	SetVideoPositionInfo(g_VideoPositionInfoObj);
}

function ChangeTheVga()
{
	if($("OutPutType").value == 0 )
	{
		$("VGAType").disabled = "";
		//$("CoordinateX").disabled = "";
		//$("CoordinateY").disabled = "";
	}
	else
	{
		$("VGAType").disabled = "disabled";
		//$("CoordinateX").disabled = "disabled";
		//$("CoordinateY").disabled = "disabled";
	}
}

function ChangeTheVideoSwitch()
{
	if($("EnableVideoTransition").checked )
	{
		$("VideoTransitionInterval").disabled = ""
	}
	else
	{
		$("VideoTransitionInterval").disabled = "disabled"
	}
}

function ChangeTheEnableOSD()
{
	if($("EnableOSD").checked )
	{
		$("OSDPositionX").disabled = ""
		$("OSDPositionY").disabled = ""
	}
	else
	{
		$("OSDPositionX").disabled = "disabled"
		$("OSDPositionY").disabled = "disabled"
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


var g_DeviceInfoObj = new DeviceInfoObj();		//设备信息
function SendGetDeviceInfo()
{	
	g_DeviceInfoObj.callbackfunction = function(Obj){
			g_DeviceInfoObj = Obj;
			
			if( g_DeviceInfoObj.result )
			{
				$("vdeostand").selectedIndex 			= g_DeviceInfoObj.dwVideoStandard;			//制式
				$("ServerName").value 					= g_DeviceInfoObj.sDVSName;					//设备名称			
				$("spDeviceSerialNumber").innerText 	= g_DeviceInfoObj.szSerialNumber;			//产品序列号
				$("SoftVersion").innerText 				= g_DeviceInfoObj.dwSoftwareVersion +"Build"+ g_DeviceInfoObj.dwSoftwareBuildDate;		//软件版本
				$("HardwareVersion").innerText 			= g_DeviceInfoObj.dwHardwareVersion;		//硬件版本
				$("ChannelCount").innerText 			= g_DeviceInfoObj.byChanNum;				//通道数
				
				//加载web版本, add by angel 2012.09.11
				try 
				{
					var xmlDoc = LoadXML("file", "xml/Version.xml");
					$("VersionWeb").innerText = xmlDoc.getElementsByTagName("WebVersion")[0].nodeTypedValue;
				} 
				catch (e) 
				{
					$("VersionWeb").innerText = "1.0.0.65Build20120910";
				}
					
				
				//设备类型
				var strExternType = parseInt(g_DeviceInfoObj.byDVSType);
				var strDeviceType = "";
				
				if(strExternType == 3)				//视频服务器
				{
					strDeviceType = "DVS";
				}
				else if(strExternType == 4)			//标清解码器
				{
					strDeviceType = "DEC";
				}
				else if(strExternType == 5)			//高清解码器
				{
					strDeviceType = "HD_DEC";
				}
				else if(strExternType == 6)			//高清NVR
				{
					strDeviceType = "HD_NVR";
				}
				else if(strExternType == 7)			//存储服务器
				{
					strDeviceType = "HD_STORAGE";
				}
				else if(strExternType == 8)			//转发器
				{
					strDeviceType = "HD_TURN";
				}
				else if(strExternType == 9)			//电视墙解码器
				{
					strDeviceType = "HD_TVWALL";
				}
				else if(strExternType == 12)		//15/17编码模块
				{
					strDeviceType = "DVS_IPCAMERA";
				}
				else if(strExternType == 13)		//1080p10(摄像机)
				{
					strDeviceType = "HD_IPC 1080P NRT";
				}
				else if(strExternType == 14)		//720p(摄像机)
				{
					strDeviceType = "HD_IPC 720P";
				}
				else if(strExternType == 15)		//D1(摄像机)
				{
					strDeviceType = "IPC D1";
				}
				else if(strExternType == 16)		//1080p30(摄像机)
				{
					strDeviceType = "HD_IPC 1080P RT";
				}
				else if(strExternType == 21)		//D1编码模块(BNC输入)
				{
					strDeviceType = "HD_NVS D1";
				}
				else if(strExternType == 22)		//高清编码模块(YPbPr输入)
				{
					strDeviceType = "HD_NVS";
				}
				else if(strExternType == 23)		//SC110编码模块
				{
					strDeviceType = "SC110_CAM";
				}
				else if(strExternType == 31)		//模拟CAM
				{
					strDeviceType = "ANALOG_CAM";
				}
				else if(strExternType == 32)		//1M网络摄像机
				{
					strDeviceType = "HD_IPC_1M";
				}
				else if(strExternType == 33)		//2M网络摄像机
				{
					strDeviceType = "HD_IPC_2M";
				}
				else if(strExternType == 34)		//3M网络摄像机
				{
					strDeviceType = "HD_IPC_3M";
				}
				else if(strExternType == 35)		//5M网络摄像机
				{
					strDeviceType = "HD_IPC_5M";
				}
				else if(strExternType == 36)		//2M18倍网络一体机
				{
					strDeviceType = "HD_IPC_2M";
				}
				else if(strExternType == 37)		//2M16倍网络一体机
				{
					strDeviceType = "HD_IPC_2M";
				}
				else if(strExternType == 38)		//2M22倍网络一体机
				{
					strDeviceType = "HD_IPC_2M";
				}
				else if(strExternType == 39)		//D1摄像机
				{
					strDeviceType = "HD_IPC_D1";
				}
				
				
				/*if( strExternType & 0x00000004 )
				{
					strExternType = "(1.3M)";
				}
				else if( strExternType & 0x00000001 )
				{
					strExternType = "(IR)";
				}
				else
				{
					strExternType = "";
				}*/
				
				//strDeviceType = strDeviceType + strExternType;
				//$("spDeviceType").innerText = strDeviceType;
				$("spDeviceType").innerText = "NVR";
				
				//获取网络信息
				SendGetNetWorkInfo();
				
			}
			else
			{
				//alert("get device info fail!");
			}
			
		};
	g_DeviceInfoObj.method = "POST";
	g_DeviceInfoObj.asynchrony = false;
	g_DeviceInfoObj.username = g_UserName;
	g_DeviceInfoObj.password = g_Password;
	g_DeviceInfoObj.CurrentChannelId = -1;		//通道号为-1时  表示请求的是NVR的相关参数

	GetDeviceInfo(g_DeviceInfoObj);
}

function SendGetNetWorkInfo()
{
	var NetWorkInfoObj = new NetWorkObj();	//网络信息
	
	NetWorkInfoObj.callbackfunction = function(Obj){
		NetWorkInfoObj = Obj;
			
			if(Obj.result )
			{
				$("DeviceMAC").innerText = NetWorkInfoObj.byMACAddr;
			}
			else
			{
				//alert("get NetWork info fail");
			}
		};
	
	NetWorkInfoObj.method = "POST";
	NetWorkInfoObj.asynchrony = false;
	NetWorkInfoObj.username = g_UserName;
	NetWorkInfoObj.password = g_Password;
	NetWorkInfoObj.CurrentChannelId = -1;	//通道号为-1时  表示请求的是NVR的相关参数
	
	GetNetWorkInfo(NetWorkInfoObj);
}

function SendSetDeviceInfo()
{
	g_DeviceInfoObj.callbackfunction = function(Obj){
			if(Obj.result)
			{
				alert(a_succeed);
			}
			else
			{
				alert(a_faild);
			}
		};
		
	g_DeviceInfoObj.method 				= "POST";
	g_DeviceInfoObj.asynchrony 			= false;
	g_DeviceInfoObj.username 			= g_UserName;
	g_DeviceInfoObj.password 			= g_Password;
	g_DeviceInfoObj.CurrentChannelId 	= -1;	//通道号为-1时  表示请求的是NVR的相关参数
	
	g_DeviceInfoObj.sDVSName 			= $("ServerName").value;
	g_DeviceInfoObj.dwVideoStandard 	= $("vdeostand").value;
	
	SetDeviceInfo(g_DeviceInfoObj);
}



/*==========================================
============================================
==										  ==
==			日志获取代码段  	      			  ==
==										  ==
==			2012.03.16	By angel		  ==
============================================
==========================================*/

var g_LogInfoObj = new LogInfoObj();
function SendGetLogInfo()
{
	g_LogInfoObj.callbackfunction = function(Obj){
		g_LogInfoObj = Obj;
			if(Obj.result )
			{
				//初始化页面
				InitLogInfo();
			}
			else 
			{
				//alert("get log info fail");
				//如果是点击搜索按钮的话
				if ( g_bFlag ) 
				{
					g_LogInfoObj = new LogInfoObj();
					//初始化页面
					InitLogInfo(true);
				}
				else 	//如果是自动搜索的话
				{
					return false;
				}
			}
		};
	
	g_LogInfoObj.method = "POST";
	g_LogInfoObj.asynchrony = false;
	g_LogInfoObj.username = g_UserName;
	g_LogInfoObj.password = g_Password;
	
	GetLogInfo(g_LogInfoObj);
}

function InitLogInfo(value)
{
	if( g_iCurrentRequestTime == 1 || value == true) 
	{
		var str = '<table width="100%" id="tbLogList" name="tbLogList" cellpadding="10" border="1" cellspacing="0"><tr align="center"><td>ID</td><td>'+a_LogTime+'</td><td>'+a_UserName+'</td><td>'+a_Address+'</td><td>'+a_LoginType+'</td><td>'+a_Info+'</td></tr></table>';
		$("LogInfo").innerHTML = "";
		$("LogInfo").innerHTML = str;
	}
	
	for(var i=0; i<g_LogInfoObj.LogNums; i++)
	{
		InsertRow(i);
	}
}

//Insert the file list into table
function InsertRow(iNum)
{
	var tbLogList = document.getElementById("tbLogList");
	var row = tbLogList.rows.length;
	row = row < 0 ? 0 : row;
	var tr = tbLogList.insertRow(row);
	
	var td5 = tr.insertCell();
	td5.innerHTML = row;

	var td0 = tr.insertCell();
	td0.innerHTML = g_LogInfoObj.loginfo[iNum].sLogTime;
	td0.setAttribute("align","center");
	
	var td1 = tr.insertCell();
	td1.innerHTML = g_LogInfoObj.loginfo[iNum].sUserName != "" ? g_LogInfoObj.loginfo[iNum].sUserName : "&nbsp;";
	
	var td2 = tr.insertCell();
	td2.innerHTML = g_LogInfoObj.loginfo[iNum].sAddress != "" ? g_LogInfoObj.loginfo[iNum].sAddress : "&nbsp;";
	
	var td3 = tr.insertCell();
	td3.innerHTML = g_LogInfoObj.loginfo[iNum].byUserLoginType == 0 ? a_local : a_remote;
	
	var td4 = tr.insertCell();
	td4.innerHTML = g_LogInfoObj.loginfo[iNum].sInfo;
	
}

function SetSearchDate()
{
	var strYear,strMonth,strDay;
	//set the hours
	for(var i=0; i< 24; i++ )
	{
		$("StartHour1").options[i] = new Option(i,i);
		$("StopHour1").options[i]  = new Option(i,i);
	}
	
	//Set the minutes
	for(var j=0; j< 60; j++ )
	{
		$("StartMin1").options[j] = new Option(j,j);
		$("StopMin1").options[j]  = new Option(j,j);
	}
	
	//Set the default value of stop hours and stop min
	$("StopHour1").selectedIndex = 23;
	$("StopMin1").selectedIndex = 59;
	
	var objDate = new Date();
	strYear = objDate.getFullYear();
	strMonth = parseInt(objDate.getMonth())+1;
	strDay   = parseInt(objDate.getDate()) ;
	strMonth = strMonth < 10 ? "0" + strMonth : strMonth;
	strDay   = strDay < 10 ? "0" + strDay : strDay;
	$("SearchDate").value = strYear + "-" + strMonth + "-" + strDay;
}

var g_iCurrentRequestTime = 0;		//当前请求的次数
var g_bFlag = false;
function SearchLog( bFlag )
{
	//为了避免同一时间发送多次请求导致程序异常, 禁用按钮一段时间
	//$("btnSearchLog").disabled = "disabled";
	//setTimeout('$("btnSearchLog").disabled = "";',2000);
	
	if( !CheckUserRight(0x00000010) ) 
	{
		alert( a_notRightClose );
		return false;
	}
	
	g_bFlag = bFlag;
	if( bFlag == true )
	{
		g_iCurrentRequestTime = 0;
		g_LogInfoObj.channel = 0;
	}
	
	if( g_iCurrentRequestTime >= 0 &&  g_LogInfoObj.channel < 0 ) 
	{
		return false;
	}
	
	var sTime = "";
	var sDate = $("SearchDate").value;
	var iStartHour= $("StartHour1").value;
	var iStartMin = $("StartMin1").value;
	var iStopHour= $("StopHour1").value;
	var iStopMin = $("StopMin1").value;
	
	//sTime = sDate+"|"+iStartHour+":"+iStartMin+"-"+iStopHour+":"+iStopMin;
	
	//g_LogInfoObj.loginfo[0].sLogTime = sTime;
	g_LogInfoObj.loginfo[0].sLogTime = sDate;
	g_LogInfoObj.loginfo[0].byMajorType = $("LogType").value;
	g_LogInfoObj.channel = g_iCurrentRequestTime;
	
	g_iCurrentRequestTime++;
	
	SendGetLogInfo();
}

//如果当前已经拖动到页面底部
window.onscroll = function(){
	if ( $("LogDisplayDiv").style.display == "none" ) 
	{
		return false;
	}
	
	var a = document.documentElement.scrollTop==0? document.body.clientHeight : document.documentElement.clientHeight;
	var b = document.documentElement.scrollTop==0? document.body.scrollTop : document.documentElement.scrollTop;
	var c = document.documentElement.scrollTop==0? document.body.scrollHeight : document.documentElement.scrollHeight;

	if(a+b==c  && c>0)
	{
		SearchLog( false );
	}
}

/*==========================================
============================================
==										  ==
==			设备状态查看代码段			  ==
==										  ==
==			2012.07.16	By angel		  ==
============================================
==========================================*/

var g_DeviceStatusObj = new DeviceStatusObj();
function SendGetDeviceStatusInfo()
{
	g_DeviceStatusObj.callbackfunction = function(Obj){
		g_DeviceStatusObj = Obj;
			
			if(Obj.result )
			{
				//初始化页面
				InitDeviceStatusInfo();
			}
			else 
			{
				//alert("get device status fail");
				return false;
			}
			
		};
	
	g_DeviceStatusObj.method = "POST";
	g_DeviceStatusObj.asynchrony = true;
	g_DeviceStatusObj.username = g_UserName;
	g_DeviceStatusObj.password = g_Password;
	
	GetDeviceStatusInfo(g_DeviceStatusObj);
}

function SendGetDeviceStatusInfotest()
{
	var xml = LoadXML("file", "DeviceStatusCfg.xml");
	
	var StatusXML = xml.documentElement;
	
	if(StatusXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
	{
		g_DeviceStatusObj.result = true;
		
		var ChannelStatusXml = StatusXML.getElementsByTagName("ChannelStatusListCfg")[0].childNodes;
		for(var i=0; i<ChannelStatusXml.length; i++)
		{
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].StorageStatus.Enable 		= ChannelStatusXml[i].childNodes[0].childNodes[0].nodeTypedValue;
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].StorageStatus.StorageType 	= ChannelStatusXml[i].childNodes[0].childNodes[1].nodeTypedValue;
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].StreamStatus 				= ChannelStatusXml[i].childNodes[1].nodeTypedValue;
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelName 				= ChannelStatusXml[i].childNodes[2].nodeTypedValue;
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelIP 					= ChannelStatusXml[i].childNodes[3].nodeTypedValue;
		}							
	}
	
	InitDeviceStatusInfo();
}

function InitDeviceStatusInfo()
{
	var iStreamStatusTotal = 0;
	
	var str = '<table width="100%" cellpadding="10" border="1" cellspacing="0" align="center">';
	str += '<tr align="center"><td>ID</td><td>'+ a_statusChannelName +'</td><td>'+ a_statusChannelIP +'</td><td>'+ a_statusStorage +'</td><td>'+ a_statusStream +'</td></tr>';

	for(var i=0; i<g_DeviceStatusObj.ChannelListStatus.ChannelStatus.length; i++)
	{
		if( g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelName == "")
		{
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelName = "&nbsp ";
		}
		
		if( g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelIP == "")
		{
			g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelIP = "&nbsp ";
		}
		
		str += "<tr align='center'><td>" +	(i+1) + "</td><td>" + 
				g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelName + "</td><td>" +
				g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].ChannelIP + "</td>";
		
		if( g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].StorageStatus.Enable == 0 )
		{
			str += "<td>" + a_satusEnable + "</td>";
		}
		else
		{
			str += "<td>" + a_stausDisable + "</td>";
		}
		
		str += "<td>" + g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].StreamStatus + "</td></tr>";
		
		iStreamStatusTotal += Number(g_DeviceStatusObj.ChannelListStatus.ChannelStatus[i].StreamStatus);
	}
	
	str += '</table>';
	
	$("ChannelStatusDiv").innerHTML = str;
	
	if( iStreamStatusTotal > 32*1024 )
	{
		ShowHelpInfoDiv("alarmStreamStatus");
	}
	else 
	{
		g_bHelpDivFlag = true;
	}
	
	setTimeout("SendGetDeviceStatusInfotest()", 3000);
}


