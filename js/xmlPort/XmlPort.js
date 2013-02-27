
/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==												Cookie操作接口	  			   			              ==
==										 															  ==
==											2011.07.01	By angel			  						  ==
==																									  ==
==																									  ==
==										本接口实现Cookie的添加 删除 获取功能						  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//添加cookie
function addCookie(name, value, expires, path, domain)
{
    var str = name + "=" + escape(value);
    if (expires != "") 
    {
        var date = new Date();
        date.setTime(date.getTime() + expires * 24 * 3600 * 1000);//expires单位为天
        str += ";expires=" + date.toGMTString();
    }
    if (path != "") 
    {
        str += ";path=" + path;//指定可访问cookie的目录
    }
    if (domain != "") 
    {
        str += ";domain=" + domain;//指定可访问cookie的域
    }
    document.cookie = str;
    //alert(document.cookie);
}

//删除cookie
function delCookie(name)
{
    //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
}

//获取cookie
function getCookie(name)
{
	var result = null;
	var myCookie = " " + document.cookie + ";";
	var searchName = " " + name + "=";
	var startOfCookie = myCookie.indexOf(searchName);
	var	endOfCookie;
	if(startOfCookie != -1)
	{
		startOfCookie += searchName.length;
		endOfCookie = myCookie.indexOf(";",startOfCookie);
		result = unescape(myCookie.substring(startOfCookie,endOfCookie));
	}
	return result;
}


////////////////////////////////////检测用户权限//////////////////////////////////////////
function CheckUserRight(right)
{
	if( (right & g_UserRight) != 0 ) 
	{
		return true;
	}
	else 
	{
		return false;
	}
}



/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==												XML对象操作接口	  			   			              ==
==										 															  ==
==											2011.07.01	By angel			  						  ==
==																									  ==
==																									  ==
==										本接口实现XML对象的创建 加载功能							  ==
==																									  ==
========================================================================================================
======================================================================================================*/

var g_xmlDoc = null;

//创建xml对象
function CreateXmlObject()
{
    if (window.ActiveXObject) 
    {
        g_xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        g_xmlDoc.async = false;
    }
    else if (document.implementation && document.implementation.createDocument) 
    {
        g_xmlDoc = document.implementation.createDocument('', '', null); 
		g_xmlDoc.async = false;
    }
    else 
    {
        alert("Your browser does not support this system, suggest you use IE7.0 browser!");
    }
}
 
//加载xml文件
LoadXML = function(type,xmlFile)
{
	g_xmlDoc.async = false;
	
	if(type == "str")
	{
		if(navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			var oParser = new DOMParser();
			var oXmlDom = oParser.parseFromString(xmlFile,"text/xml");
			if(typeof(oXmlDom) == "object")
			{
				return oXmlDom;
			}
			else
			{
				//alert("Loading XML String fail!");
		        return false;
			}
		}
		else if(navigator.appName == "Microsoft Internet Explorer")
		{
			if(g_xmlDoc.loadXML(xmlFile))
			{
				return g_xmlDoc;
			}
			else 
		    {
		        //alert("Loading XML String fail!");
		       // return false;
		        return g_xmlDoc;
		    }
		}
		else 
	    {
	        //alert("Unable to identify your browser!");
	        return false;
	    }
	}
	else if (type == "file")
	{
		if (g_xmlDoc.load(xmlFile)) 
	    {
	        return g_xmlDoc;
	    }
	    else 
	    {
	        //alert("Loading XML file fail!");
	        //return false;
	    	return g_xmlDoc;
	    }
	} 
};


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==												字符转换函数	  			   			              ==
==										 															  ==
==											2011.10.20	By angel			  						  ==
==																									  ==
==																									  ==
==										本接口实现二进制代码到utf-8的转换							  ==
==																									  ==
========================================================================================================
======================================================================================================*/

function gb2utf8(data){
        var glbEncode = [];
        gb2utf8_data = data;
        execScript("gb2utf8_data = MidB(gb2utf8_data, 1)", "VBScript");
        var t=escape(gb2utf8_data).replace(/%u/g,"").replace(/(.{2})(.{2})/g,"%$2%$1").replace(/%([A-Z].)%(.{2})/g,"@$1$2");
        t=t.split("@");
        var i=0,j=t.length,k;
        while(++i<j) {
               k=t[i].substring(0,4);
               if(!glbEncode[k]) {
                       gb2utf8_char = eval("0x"+k);
                       execScript("gb2utf8_char = Chr(gb2utf8_char)", "VBScript");
                       glbEncode[k]=escape(gb2utf8_char).substring(1,6);
               }
               t[i]=glbEncode[k]+t[i].substring(4);
        }
        gb2utf8_data = gb2utf8_char = null;
        return unescape(t.join("%"));
}

/*======================================================================================================
========================================================================================================
==																									  ==
==													云台控制接口  			   			              ==
==										 															  ==
==												2011.01.26	By angel		  						  ==
==																									  ==
==		CallPtzRequest为ajax对象	CallPtzObj为传入的参数对象										  ==
==		本接口实现云台方向控制 云台辅助开关控制功能													  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义CallPtzRequest异步通信函数
var CallPtzRequest;

try 
{
   CallPtzRequest = new XMLHttpRequest();
} 
catch (trymicrosoft) 
{
    try 
    {
        CallPtzRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (othermicrosoft) 
    {
        try 
        {
            CallPtzRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (failed) 
        {
            CallPtzRequest = false;
        }
    }
}

if (!CallPtzRequest) 
{
    alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////

function CallPtzObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.channel = 0;				//云台通道号
	this.command = 0;				//云台调用命令ID
	this.control = 0;				//云台调用命令模式
	this.speed = 0;					//云台调用速度
	
	this.result = false;			//云台调用命令的返回值	true-成功
}

function CallPtz(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8"?><Envelope><Header><cmd>PtzCommandCfg</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>'+ Obj.channel +'</channel></Header><Body><tmPtzCommandCfg_t><dwPTZCommand>'+ Obj.command +'</dwPTZCommand><dwPTZControl>'+ Obj.control +'</dwPTZControl><dwAddress>3</dwAddress><dwSpeed>'+ Obj.speed +'</dwSpeed></tmPtzCommandCfg_t></Body></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			CallPtzRequest.onreadystatechange = function(){
					if (CallPtzRequest.readyState == 4)
					{
						if (CallPtzRequest.status == 200)
						{
							var CallPtzXML = CallPtzRequest.responseXML.documentElement;
							if( CallPtzXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
							}else
							{Obj.result = false;}
							
							CallPtzRequest.abort();
							Obj.callbackfunction(Obj);
						}
					}
				};
				
			CallPtzRequest.open(Obj.method, url, Obj.asynchrony);
			CallPtzRequest.send(g_xmlDoc);
		}
		catch(err)
		{
			Obj.result = false;
		}
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==												云台预置点操作接口	 		   			              ==
==																									  ==
==												2011.01.26	By angel		  						  ==
==																									  ==
==				CallPTZPPRequest为ajax对象	CallPtzPPObj为传入的参数对象							  ==
==		本接口实现预置点调用 添加 删除功能															  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////预置点设置/////////////////////////////////////////////
try 
{
 	CallPTZPPRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	CallPTZPPRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		CallPTZPPRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		CallPTZPPRequest = false;
	   }  
 	}
}

if (!CallPTZPPRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function CallPtzPPObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.channel = 0;
	this.command = "";
	this.control = "";
	this.speed = 0;
	
	this.result = false;
}


function CallPtzPP(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8"?><Envelope><Header><cmd>PtzCommandCfg</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>'+ Obj.channel +'</channel></Header><Body><tmPtzCommandCfg_t><dwPTZCommand>'+ Obj.command +'</dwPTZCommand><dwPTZControl>'+ Obj.control +'</dwPTZControl><dwAddress>3</dwAddress><dwSpeed>'+ Obj.speed +'</dwSpeed></tmPtzCommandCfg_t></Body></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			CallPTZPPRequest.onreadystatechange = function(){
					if (CallPTZPPRequest.readyState == 4)
					{
						if (CallPTZPPRequest.status == 200)
						{
							var CallPtzPPXML = CallPTZPPRequest.responseXML.documentElement;
							if( CallPtzPPXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
							}
							else
							{
								Obj.result = false;
							}
							
							CallPTZPPRequest.abort();
							Obj.callbackfunction(Obj);		
						}
					}
				};
			CallPTZPPRequest.open(Obj.method, url, Obj.asynchrony);
			CallPTZPPRequest.send(g_xmlDoc);
		}
		catch(err)
		{
			Obj.result = false;
		}
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==												视频参数接口  				   			              ==
==										 															  ==
==												2011.05.03	By angel		  						  ==
==																									  ==
==		VideoParamRequest为ajax对象		VideoPatamObj为参数对象										  ==
==		本接口实现视频参数值的实时设置生效															  ==
========================================================================================================
======================================================================================================*/


////////////////////////////////////图像设置/////////////////////////////////////////////
try 
{
 	VideoParamRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	VideoParamRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		VideoParamRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		VideoParamRequest = false;
	   }  
 	}
}

if (!VideoParamRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function VideoPatamObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.channel = 0;
	
	this.light = "";
	this.contrast = "";
	this.satutation = "";
	this.color = "";
	this.acutance = "";
	
	this.result = false;
}

var m_VideoParamXmlDoc;
function GetVideoParam(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>PicPreviewCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.channel +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		VideoParamRequest.onreadystatechange = function(){
			try{
				if (VideoParamRequest.readyState == 4)
				{
					if (VideoParamRequest.status == 200)
					{
						var VideoParmXml = VideoParamRequest.responseXML.documentElement;
						m_VideoParamXmlDoc = VideoParamRequest.responseXML.xml;
						
						if(typeof(VideoParmXml) == "object")
						{
							if(VideoParmXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								var Result = VideoParmXml.getElementsByTagName("tmPicPreviewCfg_t")[0].childNodes;
								
								Obj.result 		= true;
								Obj.light 		= Result[1].nodeTypedValue;
								Obj.contrast 	= Result[2].nodeTypedValue;
								Obj.satutation	= Result[3].nodeTypedValue;
								Obj.color 		= Result[4].nodeTypedValue;
								Obj.acutance 	= Result[5].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						VideoParamRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		VideoParamRequest.open(Obj.method, url, Obj.asynchrony);
		VideoParamRequest.send(g_xmlDoc);
	}
}

function SaveParamVideo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_VideoParamXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_VideoParamXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.channel;
				
				g_xmlDoc.getElementsByTagName("byBrightness")[0].nodeTypedValue = Obj.light;
				g_xmlDoc.getElementsByTagName("byContrast")[0].nodeTypedValue = Obj.contrast;
				g_xmlDoc.getElementsByTagName("bySaturation")[0].nodeTypedValue = Obj.satutation;
				g_xmlDoc.getElementsByTagName("byHue")[0].nodeTypedValue = Obj.color;
				g_xmlDoc.getElementsByTagName("byAcutance")[0].nodeTypedValue = Obj.acutance;	
				
				VideoParamRequest.onreadystatechange = function(){
						if (VideoParamRequest.readyState == 4)
						{
							if (VideoParamRequest.status == 200)
							{
								var SaveParamVideoXML = VideoParamRequest.responseXML.documentElement;
								if( SaveParamVideoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								VideoParamRequest.abort();
								Obj.callbackfunction(Obj);
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
					};
				VideoParamRequest.open(Obj.method, url, Obj.asynchrony);
				VideoParamRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==											图像模式参数接口  				   			              ==
==										 															  ==
==											2011.05.03	By angel			  						  ==
==																									  ==
==		PicModeRequest为ajax对象		PicModeObj为参数对象										  ==
==		本接口实现图像模式的获取与设置																  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取图像模式参数/////////////////////////////////////////////
try 
{
 	PicModeRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
	try
	{
	PicModeRequest = new ActiveXObject("Msxml2.XMLHTTP");
	} 
	catch (othermicrosoft) 
	{
		try 
		{
			PicModeRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (failed) 
		{
			PicModeRequest = false;
		}  
	}
}
if (!PicModeRequest)
alert("Error initializing XMLHttpRequest!");
//////////////////////////////////////////////////////////////////////////////////////

function ModeObj()
{
	this.Brightness = "";
	this.Contrast = "";
	this.Saturation = "";
	this.Hue = "";
}

function ScheduleInfo()
{
	this.byStartHour = "";
	this.byStartMin = "";
	this.byStopHour = "";
	this.byStopMin = "";
	this.byEnable = "";
	this.byMode = "";
	this.byAcutance = "";
}

function PicModeObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.channel = 0;
	this.result = false;
	
	var arrMode = new Array(3);
	var arrScheduleInfo = new Array(3);
	
	for(var i=0;i<4;i++)
	{
		arrMode[i] = new ModeObj();
		arrScheduleInfo[i] = new ScheduleInfo();
	}
	
	this.result = false;
	this.PreviewInfo = {
			PreviewMode : arrMode
		};
		
	this.ScheduleInfo = {
			ScheduleMode : arrScheduleInfo
		};
}

var m_PicModeXmlDoc;
function GetPicMode(Obj)
{
	//获取图像模式
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>PicModeScheduleCfg</cmd><cmd_type>get</cmd_type><err_flag>1</err_flag><channel>'+ Obj.channel +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		PicModeRequest.onreadystatechange = function(){
				try{
					if (PicModeRequest.readyState == 4)
					{
						if (PicModeRequest.status == 200)
						{
							//解析XML并保存到js中
							var PicModeXml = PicModeRequest.responseXML.documentElement;
							m_PicModeXmlDoc = PicModeRequest.responseXML.xml;
							
							if(typeof(PicModeXml) == "object")
							{
								if(PicModeXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									var aryPicScheduleInfo = PicModeXml.getElementsByTagName("struModeSched")[0].childNodes;
									var aryPicPreviewInfo = PicModeXml.getElementsByTagName("struMode")[0].childNodes;
									
									for(var i=0; i<4; i++ )
									{
										Obj.ScheduleInfo.ScheduleMode[i].byStartHour 	= aryPicScheduleInfo[i].childNodes[0].nodeTypedValue;
										Obj.ScheduleInfo.ScheduleMode[i].byStartMin 	= aryPicScheduleInfo[i].childNodes[1].nodeTypedValue;
										Obj.ScheduleInfo.ScheduleMode[i].byStopHour 	= aryPicScheduleInfo[i].childNodes[2].nodeTypedValue;
										Obj.ScheduleInfo.ScheduleMode[i].byStopMin 		= aryPicScheduleInfo[i].childNodes[3].nodeTypedValue;
										Obj.ScheduleInfo.ScheduleMode[i].byEnable 		= aryPicScheduleInfo[i].childNodes[4].nodeTypedValue;
										Obj.ScheduleInfo.ScheduleMode[i].byMode 		= aryPicScheduleInfo[i].childNodes[5].nodeTypedValue;
										Obj.ScheduleInfo.ScheduleMode[i].byAcutance		= aryPicScheduleInfo[i].childNodes[6].nodeTypedValue;
										
										/*Obj.PreviewInfo.PreviewMode[i].Brightness 		= aryPicPreviewInfo[Obj.ScheduleInfo.ScheduleMode[i].byMode].childNodes[0].nodeTypedValue;
										Obj.PreviewInfo.PreviewMode[i].Contrast 		= aryPicPreviewInfo[Obj.ScheduleInfo.ScheduleMode[i].byMode].childNodes[1].nodeTypedValue;
										Obj.PreviewInfo.PreviewMode[i].Saturation 		= aryPicPreviewInfo[Obj.ScheduleInfo.ScheduleMode[i].byMode].childNodes[2].nodeTypedValue;
										Obj.PreviewInfo.PreviewMode[i].Hue 				= aryPicPreviewInfo[Obj.ScheduleInfo.ScheduleMode[i].byMode].childNodes[3].nodeTypedValue;
										*/
										Obj.PreviewInfo.PreviewMode[i].Brightness 		= aryPicPreviewInfo[i].childNodes[0].nodeTypedValue;
										Obj.PreviewInfo.PreviewMode[i].Contrast 		= aryPicPreviewInfo[i].childNodes[1].nodeTypedValue;
										Obj.PreviewInfo.PreviewMode[i].Saturation 		= aryPicPreviewInfo[i].childNodes[2].nodeTypedValue;
										Obj.PreviewInfo.PreviewMode[i].Hue 				= aryPicPreviewInfo[i].childNodes[3].nodeTypedValue;
									}
									
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
							}
							else
							{
								Obj.result = false;
							}
							
							PicModeRequest.abort();
							Obj.callbackfunction(Obj);
						}
					}
				}
				catch(err)
				{
					Obj.result = false;
				}
			};
		PicModeRequest.open(Obj.method, url, Obj.asynchrony);
		PicModeRequest.send(g_xmlDoc);
	}
}

function SetPicMode(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_PicModeXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_PicModeXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue = "0";
				g_xmlDoc.getElementsByTagName("Header/channel")[0].nodeTypedValue = Obj.channel;
				
				var aryPicScheduleInfo = g_xmlDoc.getElementsByTagName("struModeSched")[0].childNodes;
				var aryPicPreviewInfo = g_xmlDoc.getElementsByTagName("struMode")[0].childNodes;
				
				for(var j=0; j<4; j++)
				{
					var Mode = aryPicScheduleInfo[j].childNodes;
					Mode[0].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byStartHour;
					Mode[1].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byStartMin;
					Mode[2].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byStopHour;
					Mode[3].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byStopMin;
					Mode[4].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byEnable;
					Mode[5].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byMode;
					Mode[6].nodeTypedValue = Obj.ScheduleInfo.ScheduleMode[j].byAcutance;
					
					/*aryPicPreviewInfo[Mode[5].nodeTypedValue].childNodes[0].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Brightness;
					aryPicPreviewInfo[Mode[5].nodeTypedValue].childNodes[1].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Contrast;
					aryPicPreviewInfo[Mode[5].nodeTypedValue].childNodes[2].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Saturation;
					aryPicPreviewInfo[Mode[5].nodeTypedValue].childNodes[3].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Hue;
					*/
					aryPicPreviewInfo[j].childNodes[0].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Brightness;
					aryPicPreviewInfo[j].childNodes[1].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Contrast;
					aryPicPreviewInfo[j].childNodes[2].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Saturation;
					aryPicPreviewInfo[j].childNodes[3].nodeTypedValue = Obj.PreviewInfo.PreviewMode[j].Hue;
					
				}
				//alert("设置==============>>>>>>>>>>>>>>>>>>>>>\n\n\n"+g_xmlDoc.xml);
				
				PicModeRequest.onreadystatechange = function(){
						if (PicModeRequest.readyState == 4)
						{
							if (PicModeRequest.status == 200)
							{
								var arrSetPicModeXml = PicModeRequest.responseXML.documentElement;
								if(arrSetPicModeXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								PicModeRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				PicModeRequest.open(Obj.method, url, Obj.asynchrony);
				PicModeRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==											经纬度参数接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==		TheodoliteRequest为ajax对象		TheodoliteObj为参数对象										  ==
==		本接口实现视频参数值的实时设置生效															  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////经纬度信息/////////////////////////////////////////////
try 
{
 	TheodoliteRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	TheodoliteRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		TheodoliteRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		TheodoliteRequest = false;
	   }  
 	}
}

if (!TheodoliteRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function TheodoliteObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;
	
	this.result = false;
	this.dwLongitude = "";			//经度
	this.dwLatitude = "";			//纬度
}

//获取经纬度
var m_TheodoliteXmlDoc;
function GetTheodoliteInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="utf-8" ?><Envelope><Header><cmd>TheodoliteCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		TheodoliteRequest.onreadystatechange = function(){
			try{
				if (TheodoliteRequest.readyState == 4)
				{
					if (TheodoliteRequest.status == 200)
					{
						var TheodoliteXML = TheodoliteRequest.responseXML.documentElement;
						m_TheodoliteXmlDoc = TheodoliteRequest.responseXML.xml;
						
						if(typeof(TheodoliteXML) == "object")
						{
							//alert(TheodoliteRequest.responseText);
							if(TheodoliteXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.dwLongitude = TheodoliteXML.getElementsByTagName("dwLongitude")[0].nodeTypedValue;
								Obj.dwLatitude 	= TheodoliteXML.getElementsByTagName("dwLatitude")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						TheodoliteRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		TheodoliteRequest.open(Obj.method, url, Obj.asynchrony);
		TheodoliteRequest.send(g_xmlDoc);
	}
}

function SetTheodoliteInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_TheodoliteXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_TheodoliteXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				
				g_xmlDoc.getElementsByTagName("dwLongitude")[0].nodeTypedValue 	= Obj.dwLongitude;
				g_xmlDoc.getElementsByTagName("dwLatitude")[0].nodeTypedValue 	= Obj.dwLatitude;
				
				TheodoliteRequest.onreadystatechange = function(){
						if (TheodoliteRequest.readyState == 4)
						{
							if (TheodoliteRequest.status == 200)
							{
								var TheodoliteXML = TheodoliteRequest.responseXML.documentElement;
								//alert(TheodoliteRequest.responseText);
								if(TheodoliteXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								TheodoliteRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				TheodoliteRequest.open(Obj.method, url, Obj.asynchrony);
				TheodoliteRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											获取系统时间接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
 
//////////////////////////////////获取系统时间////////////////////////////////////////
try 
{
 	GetServerTimeRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
	try
	{
	GetServerTimeRequest = new ActiveXObject("Msxml2.XMLHTTP");
	} 
	catch (othermicrosoft) 
	{
		try 
		{
			GetServerTimeRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (failed) 
		{
			GetServerTimeRequest = false;
		}  
	}
}

if (!GetServerTimeRequest)
alert("Error initializing XMLHttpRequest!");
////////////////////////////////////////////////////////////////////////////////////

function ServerTimeObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.channel = 0;
	
	this.result = false;
	this.ServerTimeHour = "";
	this.ServerTimeMinute = "";
}

function GetServerTime(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>TimeCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.channel +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetServerTimeRequest.onreadystatechange = function(){
			try{
				if (GetServerTimeRequest.readyState == 4)
				{
					if (GetServerTimeRequest.status == 200)
					{
						var strTimeXML = GetServerTimeRequest.responseXML.documentElement;
						
						if(typeof(strTimeXML) == "object")
						{
							if(strTimeXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								var aryServerTimeInfo = strTimeXML.getElementsByTagName("tmTimeCfg_t")[0].childNodes;
								
								Obj.ServerTimeHour = aryServerTimeInfo[4].nodeTypedValue;
								Obj.ServerTimeMinute = aryServerTimeInfo[5].nodeTypedValue;
								Obj.result = true;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetServerTimeRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		GetServerTimeRequest.open(Obj.method, url, Obj.asynchrony);
		GetServerTimeRequest.send(g_xmlDoc);
	}
}
	
	
/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==										通道信息获取和设置接口  			   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/


////////////////////////////////获取通道信息//////////////////////////////////////////
try 
{
 	GetChannelInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetChannelInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetChannelInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetChannelInfoRequest = false;
	   }  
 	}
}

if (!GetChannelInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function ChannelParaObj()
{
	this.ChannelName = 0;
	this.ChannelId = 0;
	this.ChannelListId = 0;
	this.ChannelEnable = 0;
	this.sAddress = "";
	this.wPort = 0;
	this.sUserName = "";
	this.sPassword = "";

	this.sTurnAddress = "";
	this.wTurnPort = 0;
	this.bySubStream = 0;
	this.byTurnServer = "";
	this.byStreamType = 0;
	this.byTransType = 0;
}

function ChannelInfoObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
		
	
	var ArrChannelPara = new Array(128);
	
	for(var i=0; i<ArrChannelPara.length; i++)
	{
		ArrChannelPara[i] = new ChannelParaObj();
	}
	
	this.result = false;
	this.ChannelInfo = ArrChannelPara;
	this.ChannelTotal = 0;
}

var m_ChannelInfoXmlDoc;
function GetChannelInfo(Obj)
{
	var sDate = new Date();
	var strUrl = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>ChannelCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetChannelInfoRequest.onreadystatechange = function(){
			try{
				if (GetChannelInfoRequest.readyState == 4)
				{
					if (GetChannelInfoRequest.status == 200)
					{
						var GetChannelInfoXML = GetChannelInfoRequest.responseXML.documentElement;
						m_ChannelInfoXmlDoc = GetChannelInfoRequest.responseXML.xml;
						
						if(typeof(GetChannelInfoXML) == "object")
						{
							if(GetChannelInfoXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0 )
							{
								//添加通道信息到页面  1--通道名称   8--通道ID
								for(var i=0; i<GetChannelInfoXML.getElementsByTagName("dwCount")[0].nodeTypedValue; i++ )
								{
									Obj.ChannelInfo[i].ChannelName = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[1].nodeTypedValue;
									//Obj.ChannelInfo[i].ChannelId = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[8].nodeTypedValue
									Obj.ChannelInfo[i].ChannelEnable = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[13].nodeTypedValue;
									Obj.ChannelInfo[i].sAddress = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[4].nodeTypedValue;
									Obj.ChannelInfo[i].wPort = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[6].nodeTypedValue;
									Obj.ChannelInfo[i].sUserName = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[2].nodeTypedValue;
									Obj.ChannelInfo[i].sPassword = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[3].nodeTypedValue;
									Obj.ChannelInfo[i].sTurnAddress = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[5].nodeTypedValue;
									Obj.ChannelInfo[i].wTurnPort = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[7].nodeTypedValue;
									Obj.ChannelInfo[i].bySubStream = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[9].nodeTypedValue;
									Obj.ChannelInfo[i].byTurnServer = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[10].nodeTypedValue;
									Obj.ChannelInfo[i].byStreamType = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[11].nodeTypedValue;
									Obj.ChannelInfo[i].byTransType = GetChannelInfoXML.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[12].nodeTypedValue;
									
									Obj.ChannelInfo[i].ChannelId = i;
								}
								
								Obj.result = true;
								Obj.ChannelTotal = GetChannelInfoXML.getElementsByTagName("dwCount")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
					}else
					{
						Obj.result = false;
					}
					
					GetChannelInfoRequest.abort();
					Obj.callbackfunction(Obj);
				}
			}catch(err)
			{Obj.result = false;}	
		};	
		GetChannelInfoRequest.open(Obj.method, strUrl, Obj.asynchrony);
		GetChannelInfoRequest.send(g_xmlDoc);
	}
}

function SetChannelInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_ChannelInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_ChannelInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("dwCount")[0].nodeTypedValue = Obj.ChannelTotal;
				for(var i=0; i<Obj.ChannelTotal; i++ )
				{
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.ChannelInfo[i].ChannelName;
					//g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[8].nodeTypedValue = Obj.ChannelInfo[i].ChannelId;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[13].nodeTypedValue = Obj.ChannelInfo[i].ChannelEnable;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[4].nodeTypedValue = Obj.ChannelInfo[i].sAddress;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[6].nodeTypedValue = Obj.ChannelInfo[i].wPort;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[2].nodeTypedValue = Obj.ChannelInfo[i].sUserName;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[3].nodeTypedValue = Obj.ChannelInfo[i].sPassword;
					
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[5].nodeTypedValue = Obj.ChannelInfo[i].sTurnAddress;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[7].nodeTypedValue = Obj.ChannelInfo[i].wTurnPort;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[9].nodeTypedValue = Obj.ChannelInfo[i].bySubStream;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[10].nodeTypedValue = Obj.ChannelInfo[i].byTurnServer;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[11].nodeTypedValue = Obj.ChannelInfo[i].byStreamType;
					g_xmlDoc.getElementsByTagName("pChannelList")[0].childNodes[i].childNodes[12].nodeTypedValue = Obj.ChannelInfo[i].byTransType;
				}
				
				GetChannelInfoRequest.onreadystatechange = function(){
						if (GetChannelInfoRequest.readyState == 4)
						{
							if (GetChannelInfoRequest.status == 200)
							{
								var GetChannelInfoXML = GetChannelInfoRequest.responseXML.documentElement;
								
								if( GetChannelInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetChannelInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
					
				GetChannelInfoRequest.open(Obj.method, url, Obj.asynchrony);
				GetChannelInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==										视频编码类型获取接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/


////////////////////////////////获取设备支持的视频编码类型//////////////////////////////////////////
try 
{
 	GetVideoCodeTypeRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetVideoCodeTypeRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetVideoCodeTypeRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetVideoCodeTypeRequest = false;
	   }  
 	}
}

if (!GetVideoCodeTypeRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function VideoTypeListObj()
{
	this.VideoTypeName = "0";
	this.VideoTypeId = "0";
	this.byStreamCount = "0";
	
	var ArrStreamDescription = new Array(3);
	for(var i=0; i<3; i++)
	{
		ArrStreamDescription[i] = new StreamDescriptionObj();
	}
	
	this.StreamDescription = ArrStreamDescription;
}

function StreamDescriptionObj()
{
	this.byResolution = "";			//图像大小格式索引
	this.byFormat = "";				//编码格式
	this.byFrameRateNum = "";		//帧率列表数
	this.byType = "";				//码流类型0-压缩编码，1-数字或模拟输出
	this.byFramesRateList = "";		//帧率列表
	this.dwMaxBitRate = "";			//码流上限
	this.dwDisplayRatio = "";		//显示的正确比例*1000
}

function VideoCodeTypeObj()
{
	var ArrVideoType = new Array(200);
	for(var i=0; i<200; i++)
	{
		ArrVideoType[i] = new VideoTypeListObj();
		//ArrChannelPara[i].ChannelId = i;
	}
	
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
		
	this.result = false;
	this.VideoCodeTypeInfo = ArrVideoType;
	this.VideoCodeTypeTotal = 0;
	this.CodeTypeNum = new Array(200);		//每个压缩能力的专有ID
}

function GetVideoCodeType(Obj)
{
	var sDate = new Date();
	var strUrl = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();	
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>CompressCapabilityCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		//获取通道信息
		GetVideoCodeTypeRequest.onreadystatechange = function(){
			try{
				if (GetVideoCodeTypeRequest.readyState == 4)
				{
					if (GetVideoCodeTypeRequest.status == 200)
					{
						var GetVideoCodeTypeInfoXML = GetVideoCodeTypeRequest.responseXML.documentElement;
						
						if(typeof(GetVideoCodeTypeInfoXML) == "object")
						{
							if(GetVideoCodeTypeInfoXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0 )
							{	
								Obj.VideoCodeTypeTotal = GetVideoCodeTypeInfoXML.getElementsByTagName("dwCount")[0].nodeTypedValue;
								
								for(var i=0; i<Obj.VideoCodeTypeTotal; i++)
								{
									Obj.CodeTypeNum[i] = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].childNodes[1].nodeTypedValue;
									
									//0--名称  1--ID  2--Count  
									Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeName = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].childNodes[0].nodeTypedValue;
									Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeId = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].childNodes[1].nodeTypedValue;
									Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].byStreamCount = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].childNodes[2].nodeTypedValue;
									//alert("i="+i+" "+"CodeTypeNum="+Obj.CodeTypeNum[i]+"  VideoTypeName="+Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeName + "  VideoTypeId=" + Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeId);
									//获取视频流描述
									for(var j=0; j<Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].byStreamCount; j++)
									{
										Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].StreamDescription[j].byResolution = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].getElementsByTagName("StreamDescription")[j].childNodes[0].nodeTypedValue;
										
										Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].StreamDescription[j].byFormat = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].getElementsByTagName("StreamDescription")[j].childNodes[1].nodeTypedValue;
										
										Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].StreamDescription[j].byFrameRateNum = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].getElementsByTagName("StreamDescription")[j].childNodes[2].nodeTypedValue;
										
										Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].StreamDescription[j].byType = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].getElementsByTagName("StreamDescription")[j].childNodes[3].nodeTypedValue;
										
										//获取视频帧率列表
										Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].StreamDescription[j].byFramesRateList = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].getElementsByTagName("StreamDescription")[j].childNodes[4].nodeTypedValue;
										
										Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].StreamDescription[j].dwMaxBitRate = GetVideoCodeTypeInfoXML.getElementsByTagName("CompressCapability")[i].getElementsByTagName("StreamDescription")[j].childNodes[5].nodeTypedValue;
									}
								}
								Obj.result = true;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetVideoCodeTypeRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		
		GetVideoCodeTypeRequest.open(Obj.method, strUrl, Obj.asynchrony);
		GetVideoCodeTypeRequest.send(g_xmlDoc);
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											压缩参数获取接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////获取设备压缩参数////////////////////////////////////////
try 
{
 	CompressionRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
	try
	{
	CompressionRequest = new ActiveXObject("Msxml2.XMLHTTP");
	} 
	catch (othermicrosoft) 
	{
		try 
		{
			CompressionRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (failed) 
		{
			CompressionRequest = false;
		}  
	}
}

if (!CompressionRequest)
alert("Error initializing XMLHttpRequest!");
////////////////////////////////////////////////////////////////////////////////////

function CompressionInfoObj()
{
	this.byCompressFormat = 0;
	this.byStreamType = 0;
	this.byResolution = 0;
	this.byBitrateType = 0;
	this.byPicQuality = 0;
	this.dwVideoBitrate = 0;
	this.dwVideoFrameRate = 0;
}

function CompressionObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	this.result = false;
	this.CurrentCodeTypeId = 0;
	
	var ArrCompressionInfoObj = new Array(3);
	for(var i=0; i<3; i++)
	{
		ArrCompressionInfoObj[i] = new CompressionInfoObj();
	}
	this.Compression = ArrCompressionInfoObj;
	
}

//获取设备压缩参数
var m_CompressionXmlDoc;
function GetCompression(Obj)
{	
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>CompressionCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		CompressionRequest.onreadystatechange = function(){
			try{
				if (CompressionRequest.readyState == 4)
				{
					if (CompressionRequest.status == 200)
					{
						var CompressionXML = CompressionRequest.responseXML.documentElement;
						m_CompressionXmlDoc = CompressionRequest.responseXML.xml;
						
						if(typeof(CompressionXML) == "object")
						{
							if(CompressionXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								//获取当前选择的视频流组合ID
								Obj.CurrentCodeTypeId = parseInt(CompressionXML.getElementsByTagName("tmCompressionCfg_t/byFormatId")[0].nodeTypedValue);
								//Obj.CurrentCodeTypeId = 6;
								for(var i=0; i<3; i++)
								{
									Obj.Compression[i].byCompressFormat = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[0].nodeTypedValue;
									
									Obj.Compression[i].byStreamType = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[1].nodeTypedValue;
									
									Obj.Compression[i].byResolution = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[2].nodeTypedValue;
									
									Obj.Compression[i].byBitrateType = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[3].nodeTypedValue;
									
									Obj.Compression[i].byPicQuality = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[4].nodeTypedValue;
									
									Obj.Compression[i].dwVideoBitrate = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[5].nodeTypedValue;
									
									Obj.Compression[i].dwVideoFrameRate = CompressionXML.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[6].nodeTypedValue;
								}
								Obj.result = true;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						CompressionRequest.abort();	
						Obj.callbackfunction(Obj);
					}
				}
			}catch(err)
			{Obj.result = false;}	
		};
		
		CompressionRequest.open(Obj.method, url, Obj.asynchrony);
		CompressionRequest.send(g_xmlDoc);
	}
}


//设置设备压缩参数
function SetCompression(Obj)
{	
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_CompressionXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_CompressionXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				//获取当前选择的视频流组合ID
				g_xmlDoc.getElementsByTagName("tmCompressionCfg_t/byFormatId")[0].nodeTypedValue = Obj.CurrentCodeTypeId;
				
				for(var i=0; i<3; i++)
				{
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[0].nodeTypedValue = Obj.Compression[i].byCompressFormat;
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.Compression[i].byStreamType;
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[2].nodeTypedValue = Obj.Compression[i].byResolution;
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[3].nodeTypedValue = Obj.Compression[i].byBitrateType;
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[4].nodeTypedValue = Obj.Compression[i].byPicQuality;
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[5].nodeTypedValue = Obj.Compression[i].dwVideoBitrate;
					g_xmlDoc.getElementsByTagName("tmCompressionCfg_t")[0].childNodes[i].childNodes[6].nodeTypedValue = Obj.Compression[i].dwVideoFrameRate;
				}
				
				CompressionRequest.onreadystatechange = function(){
						if (CompressionRequest.readyState == 4)
						{
							if (CompressionRequest.status == 200)
							{
								var CompressionXML = CompressionRequest.responseXML.documentElement;
								if(CompressionXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								CompressionRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
					
				CompressionRequest.open(Obj.method, url, Obj.asynchrony);
				CompressionRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											视频叠加信息接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取视频叠加信息/////////////////////////////////////////////
try 
{
 	VideoOsdRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	VideoOsdRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		VideoOsdRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		VideoOsdRequest = false;
	   }  
 	}
}

if (!VideoOsdRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function VideoOsdObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;
	
	this.result = false;
	this.OsdX = 0;					/* 通道名称显示位置的x坐标 */
	this.OsdY = 0;					/* 通道名称显示位置的y坐标 */
	this.ChX = 0;					/* OSD的x坐标 */
	this.ChY = 0;					/* OSD的y坐标 */
	this.ChFont = 0;					/* OSD属性:  0: 不透明  1: 半透明 */	
	this.TimeFormat = 0;				/* OSD类型(主要是年月日格式) */
	this.byNameCoordinateMode = 0;		/* 通道名坐标模式时间模式  0-相对左上角，1-相对右上角，2-相对左下角，3-相对右下角*/
	this.byTimeCoordinateMode = 0;		/* 时间坐标模式*/ 
	
	this.EnableChannel = 0;
	this.EnableTime = 0;			// 预览的图象上是否显示OSD,0-不显示,1-显示
	this.DisplayWeek = 0;			// 是否显示星期
	this.sWeekLanguage = 0;			//显示语言类型  0-中文 1-英文
	this.ChannelName = "";			//通道名称
	
	this.byFontMode = "";			//OSD的字体模式0-默认模式，1-放大模式
	this.byAlignMode = "";			//字符串中如果带\n将隔行显示，头顶对齐方式,0-右对齐，1-中间，2-左对齐
	this.sShowText = "";			//扩展的标题
	this.wShowTextTopLeftX = "";	//扩展的标题显示位置的x坐标
	this.wShowTextTopLeftY = "";	//扩展的标题显示位置的y坐标
	this.byShowText = "";			//预览的图象上是否显示扩展的标题,0-不显示,1-显示 区域为704*576
	this.byTextCoordinateMode = "";	// 坐标模式 0-相对左上角，1-相对右上角，2-相对左下角，3-相对右下角
}

var m_VideoOsdXmlDoc;
//获取视频叠加信息
function GetVideoOsd(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="utf-8" ?><Envelope><Header><cmd>VideoOsdCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		VideoOsdRequest.open(Obj.method, url, Obj.asynchrony);
		VideoOsdRequest.setRequestHeader("Content-Type","text/html;charset=utf-8");
		
		VideoOsdRequest.onreadystatechange = function(){
			try{
				if (VideoOsdRequest.readyState == 4)
				{
					if (VideoOsdRequest.status == 200)
					{
						//var VideoOsdXML = VideoOsdRequest.responseXML.documentElement;
						//m_VideoOsdXmlDoc = VideoOsdRequest.responseXML.xml;
						
						var strUtf8 = gb2utf8(VideoOsdRequest.responseBody);
						var x = LoadXML("str",strUtf8);
						
						var VideoOsdXML = x.documentElement;
						m_VideoOsdXmlDoc = strUtf8;
						
						if(typeof(VideoOsdXML) == "object")
						{
							if(VideoOsdXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.ChannelName 	= VideoOsdXML.getElementsByTagName("tmVideoOsdCfg_t/sChanName")[0].nodeTypedValue;
								Obj.OsdX 			= VideoOsdXML.getElementsByTagName("wShowNameTopLeftX")[0].nodeTypedValue;
								Obj.OsdY 			= VideoOsdXML.getElementsByTagName("wShowNameTopLeftY")[0].nodeTypedValue;
								Obj.ChX 			= VideoOsdXML.getElementsByTagName("wShowTimeTopLeftX")[0].nodeTypedValue;
								Obj.ChY 			= VideoOsdXML.getElementsByTagName("wShowTimeTopLeftY")[0].nodeTypedValue;
								Obj.ChFont 			= VideoOsdXML.getElementsByTagName("byOsdAttrib")[0].nodeTypedValue;
								Obj.TimeFormat 		= VideoOsdXML.getElementsByTagName("byTimeType")[0].nodeTypedValue;
								Obj.EnableChannel 	= VideoOsdXML.getElementsByTagName("byShowChanName")[0].nodeTypedValue;
								Obj.EnableTime 		= VideoOsdXML.getElementsByTagName("byShowTime")[0].nodeTypedValue;
								Obj.DisplayWeek 	= VideoOsdXML.getElementsByTagName("byShowWeek")[0].nodeTypedValue;
								Obj.sWeekLanguage 	= VideoOsdXML.getElementsByTagName("byWeekType")[0].nodeTypedValue;
								Obj.byNameCoordinateMode = VideoOsdXML.getElementsByTagName("byNameCoordinateMode")[0].nodeTypedValue;
								Obj.byTimeCoordinateMode = VideoOsdXML.getElementsByTagName("byTimeCoordinateMode")[0].nodeTypedValue;
								Obj.byFontMode 		= VideoOsdXML.getElementsByTagName("byFontMode")[0].nodeTypedValue;
								Obj.byAlignMode 	= VideoOsdXML.getElementsByTagName("byAlignMode")[0].nodeTypedValue;
								Obj.sShowText 		= VideoOsdXML.getElementsByTagName("sShowText")[0].nodeTypedValue;
								Obj.wShowTextTopLeftX 	= VideoOsdXML.getElementsByTagName("wShowTextTopLeftX")[0].nodeTypedValue;
								Obj.wShowTextTopLeftY 	= VideoOsdXML.getElementsByTagName("wShowTextTopLeftY")[0].nodeTypedValue;
								Obj.byShowText 		= VideoOsdXML.getElementsByTagName("byShowText")[0].nodeTypedValue;
								Obj.byTextCoordinateMode 	= VideoOsdXML.getElementsByTagName("byTextCoordinateMode")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						VideoOsdRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};	
		VideoOsdRequest.send(g_xmlDoc);
	}
}

function SetVideoOsd(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_VideoOsdXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("file", "xml/VideoOsdCfg.xml");
		//g_xmlDoc = LoadXML("str", m_VideoOsdXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("Header/channel")[0].nodeTypedValue 		= Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue 		= "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue 		= "0";
				
				g_xmlDoc.getElementsByTagName("byShowChanName")[0].nodeTypedValue 		= Obj.EnableChannel;
				g_xmlDoc.getElementsByTagName("byShowTime")[0].nodeTypedValue 			= Obj.EnableTime;
				g_xmlDoc.getElementsByTagName("wShowTimeTopLeftX")[0].nodeTypedValue 	= Obj.ChX;
				g_xmlDoc.getElementsByTagName("wShowTimeTopLeftY")[0].nodeTypedValue 	= Obj.ChY;
				g_xmlDoc.getElementsByTagName("wShowNameTopLeftX")[0].nodeTypedValue 	= Obj.OsdX;
				g_xmlDoc.getElementsByTagName("wShowNameTopLeftY")[0].nodeTypedValue 	= Obj.OsdY;
				g_xmlDoc.getElementsByTagName("byOsdAttrib")[0].nodeTypedValue 			= Obj.ChFont;
				g_xmlDoc.getElementsByTagName("byTimeType")[0].nodeTypedValue 			= Obj.TimeFormat;
				g_xmlDoc.getElementsByTagName("byWeekType")[0].nodeTypedValue 			= Obj.sWeekLanguage;
				g_xmlDoc.getElementsByTagName("byShowWeek")[0].nodeTypedValue 			= Obj.DisplayWeek;
				g_xmlDoc.getElementsByTagName("sChanName")[0].nodeTypedValue 			= Obj.ChannelName;
				g_xmlDoc.getElementsByTagName("byNameCoordinateMode")[0].nodeTypedValue = Obj.byNameCoordinateMode;
				g_xmlDoc.getElementsByTagName("byTimeCoordinateMode")[0].nodeTypedValue = Obj.byTimeCoordinateMode;
				g_xmlDoc.getElementsByTagName("byFontMode")[0].nodeTypedValue 			= Obj.byFontMode;
				g_xmlDoc.getElementsByTagName("byAlignMode")[0].nodeTypedValue 			= Obj.byAlignMode;
				g_xmlDoc.getElementsByTagName("sShowText")[0].nodeTypedValue 			= Obj.sShowText;
				g_xmlDoc.getElementsByTagName("wShowTextTopLeftX")[0].nodeTypedValue 	= Obj.wShowTextTopLeftX;
				g_xmlDoc.getElementsByTagName("wShowTextTopLeftY")[0].nodeTypedValue 	= Obj.wShowTextTopLeftY;
				g_xmlDoc.getElementsByTagName("byShowText")[0].nodeTypedValue 			= Obj.byShowText;
				g_xmlDoc.getElementsByTagName("byTextCoordinateMode")[0].nodeTypedValue = Obj.byTextCoordinateMode;
				
				VideoOsdRequest.open(Obj.method, url, Obj.asynchrony);
				VideoOsdRequest.setRequestHeader("Content-Type","text/html;charset=utf-8");
				
				VideoOsdRequest.onreadystatechange = function(){
						if (VideoOsdRequest.readyState == 4)
						{
							if (VideoOsdRequest.status == 200)
							{
								var SetVideoOsdXML = VideoOsdRequest.responseXML.documentElement;
								
								if(SetVideoOsdXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								VideoOsdRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				VideoOsdRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											移动侦测信息接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取移动侦测信息/////////////////////////////////////////////
try 
{
 	VideoMotionRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	VideoMotionRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		VideoMotionRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		VideoMotionRequest = false;
	   }  
 	}
}

if (!VideoMotionRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function MotionAreaObj()
{
	this.wAreaTopLeftX = 0;
	this.wAreaTopLeftY = 0;
	this.wAreaWidth = 0;
	this.wAreaHeight = 0;
}

function MotionTimeObj()
{
	this.byStartHour = 0;
	this.byStartMin = 0;
	this.byStopHour = 0;
	this.byStopMin = 0;
}

function MotionSegmentObj()
{
	var ArrMotionTime = new Array(4);
	
	for(var m=0; m<4; m++)
	{
		ArrMotionTime[m] = new MotionTimeObj();
	}
	
	this.Segment = ArrMotionTime;
}

function MotionAlarmTimeObj()
{
	var ArrMotionAlarmTime = new Array(7);
	
	for(var i=0; i<7; i++)
	{
		ArrMotionAlarmTime[i] = new MotionSegmentObj();
	}
	
	this.MotionDay = ArrMotionAlarmTime;
}

function VideoMotionEnableObj()
{
	var ArrAlarmOutEnable = new Array(4);
	
	for(var i=0; i<4; i++)
	{
		ArrAlarmOutEnable[i] = 1;
	}
	
	this.AlarmOutEnable = ArrAlarmOutEnable;
}

function VideoMotionTimeAgamentObj()
{
	var ArrAlarmOut = new Array(4);
	
	for(var i=0; i<4; i++)
	{
		ArrAlarmOut[i] = 1;
	}
	
	this.AlarmOut = ArrAlarmOut;
}

function VideoMotionObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;
	
	var ArrMotionArea = new Array(5);
	
	for(var i=0; i<5; i++ )
	{
		ArrMotionArea[i] = new MotionAreaObj();
	}
	
	this.result = false;
	this.EnableMotion = 0;									//是否启用移动侦测
	this.byMotionScopeNum = 0;								//侦测区域个数
	this.byMotionSensitive = 0;								//移动侦测灵敏度
	this.byMotionThreshold = 0;							//移动侦测阀值
	this.struMotionScope = ArrMotionArea;					//移动侦测区域
	this.struAlarmTime = new MotionAlarmTimeObj();			//报警布防时间段
	this.struAlarmTransFer = 0;								//是否启用云台
	this.byEnableHandleMotion = 0;							//是否处理
	this.dwHandleType = 0;									//报警处理方式
	this.byRelAlarmOutEnable = new VideoMotionEnableObj();	//是否启用报警输出
	this.byRelAlarmOut = new VideoMotionTimeAgamentObj();				//报警输出通道
}

var m_VideoMotionXmlDoc;
function GetVideoMotion(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="utf-8" ?><Envelope><Header><cmd>VideoMotionCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		VideoMotionRequest.onreadystatechange = function(){
			try{
				if (VideoMotionRequest.readyState == 4)
				{
					if (VideoMotionRequest.status == 200)
					{
						var VideoMotionXML = VideoMotionRequest.responseXML.documentElement;
						m_VideoMotionXmlDoc = VideoMotionRequest.responseXML.xml;
						
						if(typeof(VideoMotionXML) == "object")
						{
							if(VideoMotionXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.EnableMotion = VideoMotionXML.getElementsByTagName("tmVideoMotionCfg_t/byEnableHandleMotion")[0].nodeTypedValue;	//判断是否处理移动侦测
								
								for(var i=0; i<5; i++)
								{
									Obj.struMotionScope[i].wAreaTopLeftX = VideoMotionXML.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[0].nodeTypedValue;
									Obj.struMotionScope[i].wAreaTopLeftY = VideoMotionXML.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[1].nodeTypedValue;
									Obj.struMotionScope[i].wAreaWidth = VideoMotionXML.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[2].nodeTypedValue;
									Obj.struMotionScope[i].wAreaHeight = VideoMotionXML.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[3].nodeTypedValue;
								}
								
								Obj.byMotionSensitive = VideoMotionXML.getElementsByTagName("byMotionSensitive")[0].nodeTypedValue;	//移动侦测灵敏度
								Obj.byMotionThreshold = VideoMotionXML.getElementsByTagName("byMotionThreshold")[0].nodeTypedValue;	//移动侦测阀值
								Obj.byMotionScopeNum = VideoMotionXML.getElementsByTagName("byMotionScopeNum")[0].nodeTypedValue;	//侦测区域个数
								
								for(var j=0; j<7; j++)
								{
									for(var n=0; n<4; n++)
									{
										Obj.struAlarmTime.MotionDay[j].Segment[n].byStartHour = VideoMotionXML.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[0].nodeTypedValue;
										Obj.struAlarmTime.MotionDay[j].Segment[n].byStartMin = VideoMotionXML.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[1].nodeTypedValue;
										Obj.struAlarmTime.MotionDay[j].Segment[n].byStopHour = VideoMotionXML.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[2].nodeTypedValue;
										Obj.struAlarmTime.MotionDay[j].Segment[n].byStopMin = VideoMotionXML.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[3].nodeTypedValue;
									}
								}
								
								Obj.struAlarmTransFer = VideoMotionXML.getElementsByTagName("struAlarmTransFer")[0].childNodes[0].childNodes[1].nodeTypedValue;		//是否启用云台
								Obj.byEnableHandleMotion = VideoMotionXML.getElementsByTagName("byEnableHandleMotion")[0].nodeTypedValue;	//是否处理移动侦测
								Obj.dwHandleType = VideoMotionXML.getElementsByTagName("dwHandleType")[0].nodeTypedValue;	//报警处理方式
								
								//报警输出
								for(var k=0; k<4; k++)
								{
									Obj.byRelAlarmOutEnable.AlarmOutEnable[k] = VideoMotionXML.getElementsByTagName("byRelAlarmOutEnable")[0].childNodes[k].nodeTypedValue;
									Obj.byRelAlarmOut.AlarmOut[k] = VideoMotionXML.getElementsByTagName("byRelAlarmOut")[0].childNodes[k].nodeTypedValue;
								}
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						VideoMotionRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		VideoMotionRequest.open(Obj.method, url, Obj.asynchrony);
		VideoMotionRequest.send(g_xmlDoc);
	}
}


function SetVideoMotion(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_VideoMotionXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_VideoMotionXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue 		= "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue 		= "0";
				
				g_xmlDoc.getElementsByTagName("tmVideoMotionCfg_t/byEnableHandleMotion")[0].nodeTypedValue = Obj.EnableMotion;		//判断是否处理移动侦测
									
				for(var i=0; i<5; i++)
				{
					g_xmlDoc.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[0].nodeTypedValue = Obj.struMotionScope[i].wAreaTopLeftX;
					g_xmlDoc.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.struMotionScope[i].wAreaTopLeftY;
					g_xmlDoc.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[2].nodeTypedValue = Obj.struMotionScope[i].wAreaWidth;
					g_xmlDoc.getElementsByTagName("struMotionScope")[0].childNodes[i].childNodes[3].nodeTypedValue = Obj.struMotionScope[i].wAreaHeight;
				}
				
				g_xmlDoc.getElementsByTagName("byMotionSensitive")[0].nodeTypedValue = Obj.byMotionSensitive;	//移动侦测灵敏度
				g_xmlDoc.getElementsByTagName("byMotionThreshold")[0].nodeTypedValue = Obj.byMotionThreshold;	//移动侦测阀值
				g_xmlDoc.getElementsByTagName("byMotionScopeNum")[0].nodeTypedValue = Obj.byMotionScopeNum;		//侦测区域个数
				
				for(var j=0; j<7; j++)
				{
					for(var n=0; n<4; n++)
					{
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[0].nodeTypedValue = Obj.struAlarmTime.MotionDay[j].Segment[n].byStartHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[1].nodeTypedValue = Obj.struAlarmTime.MotionDay[j].Segment[n].byStartMin;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[2].nodeTypedValue = Obj.struAlarmTime.MotionDay[j].Segment[n].byStopHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[j].childNodes[n].childNodes[3].nodeTypedValue = Obj.struAlarmTime.MotionDay[j].Segment[n].byStopMin;
					}
				}
				
				g_xmlDoc.getElementsByTagName("struAlarmTransFer")[0].childNodes[0].childNodes[1].nodeTypedValue = Obj.struAlarmTransFer;		//是否启用云台
				g_xmlDoc.getElementsByTagName("byEnableHandleMotion")[0].nodeTypedValue = Obj.byEnableHandleMotion;								//是否处理报警
				g_xmlDoc.getElementsByTagName("dwHandleType")[0].nodeTypedValue = Obj.dwHandleType;												//报警处理方式
				
				//报警输出
				for(var k=0; k<4; k++)
				{
					g_xmlDoc.getElementsByTagName("byRelAlarmOutEnable")[0].childNodes[k].nodeTypedValue = Obj.byRelAlarmOutEnable.AlarmOutEnable[k];
					g_xmlDoc.getElementsByTagName("byRelAlarmOut")[0].childNodes[k].nodeTypedValue = Obj.byRelAlarmOut.AlarmOut[k];
					//alert(Obj.byRelAlarmOutEnable.AlarmOutEnable[k] + "  " +g_xmlDoc.getElementsByTagName("byRelAlarmOutEnable")[0].childNodes[k].nodeTypedValue);
				}
				
				VideoMotionRequest.onreadystatechange = function(){
						if (VideoMotionRequest.readyState == 4)
						{
							if (VideoMotionRequest.status == 200)
							{
								var SetVideoMotionXML = VideoMotionRequest.responseXML.documentElement;
								//alert(VideoMotionRequest.responseXML.xml);
								
								if(SetVideoMotionXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}else
								{Obj.result = false;}
								
								VideoMotionRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				VideoMotionRequest.open(Obj.method, url, Obj.asynchrony);
				VideoMotionRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											设备信息接口 	 				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取设备信息/////////////////////////////////////
var DeviceInfoRequest = false;
try 
{
	DeviceInfoRequest = new XMLHttpRequest();	
} 
catch (trymicrosoft)
{
	try
	{
		DeviceInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
	} 
	catch (othermicrosoft) 
	{
		try {
			DeviceInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (failed) 
		{
			DeviceInfoRequest = false;
		}  
	}
}

if (!DeviceInfoRequest)
alert("Error initializing XMLHttpRequest!");
//////////////////////////////////////////////////////////////////////////////

function DeviceInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.result = false;
	
	this.sDVSName = "";				//设备名称
	this.dwDVSID = "";				//DVS ID,用于遥控器
	this.dwRecycleRecord = "";		//是否循环录像
	this.dwVideoStandard = 0;		//制式
	this.dwMicrophone = 0;			//语音对讲
	this.szSerialNumber = 0;		//产品序列号
	this.dwSoftwareVersion = "";	//软件版本
	this.dwSoftwareBuildDate = "";	//软件生成日期,0xYYYYMMDD
	this.dwDSPSoftwareVersion = "";	//DSP软件版本
	this.dwDSPSoftwareBuildDate = "";//DSP软件生成日期
	this.dwPanelVersion = "";		//前面板版本
	this.dwHardwareVersion = "";	//硬件版本
	this.byAlarmInPortNum = "";		//DVS报警输入个数
	this.byAlarmOutPortNum = "";	//DVS报警输出个数
	this.byRS232Num = "";			//DVS 232串口个数
	this.byRS485Num = "";			//DVS 485串口个数
	this.byNetworkPortNum = "";		//网络口个数
	this.byDiskCtrlNum = "";		//DVS 硬盘控制器个数
	this.byDiskNum = 0;				//硬盘个数
	this.byDVSType = 0;				//设备类型
	this.byChanNum = 0;				//通道数
	this.byStartChan = 0;			//起始通道号
	this.byDecordChans = 0;			//DVS 解码路数
	this.byVGANum = 0;				//VGA口的个数
	this.byUSBNum = 0;				//USB口的个数
	this.byFactory = "";			//厂商代码
	this.wTypeExtern = 0;			//设备扩展类型
	this.wAvPort = 0;				//
}

var m_DeviceInfoXmlDoc;
function GetDeviceInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>DeviceCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		DeviceInfoRequest.open(Obj.method, url, Obj.asynchrony);
		DeviceInfoRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
		
		DeviceInfoRequest.onreadystatechange = function(){
			try{
				if (DeviceInfoRequest.readyState == 4)
				{
					if (DeviceInfoRequest.status == 200)
					{
						var strUtf8 = gb2utf8(DeviceInfoRequest.responseBody);
						var x = LoadXML("str",strUtf8);
						
						//var DeviceCfgXml = DeviceInfoRequest.responseXML.documentElement;
						//m_DeviceInfoXmlDoc =  DeviceInfoRequest.responseXML.xml;
						var DeviceCfgXml = x.documentElement;
						m_DeviceInfoXmlDoc = strUtf8;
						
						if(typeof(DeviceCfgXml) == "object")
						{
							if( DeviceCfgXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
								Obj.sDVSName 			= DeviceCfgXml.getElementsByTagName("sDVSName")[0].nodeTypedValue;
								Obj.dwDVSID				= DeviceCfgXml.getElementsByTagName("dwDVSID")[0].nodeTypedValue;
								Obj.dwRecycleRecord		= DeviceCfgXml.getElementsByTagName("dwRecycleRecord")[0].nodeTypedValue;
								Obj.dwVideoStandard 	= DeviceCfgXml.getElementsByTagName("dwVideoStandard")[0].nodeTypedValue;
								Obj.dwMicrophone 		= DeviceCfgXml.getElementsByTagName("dwMicrophone")[0].nodeTypedValue;
								Obj.szSerialNumber 		= DeviceCfgXml.getElementsByTagName("szSerialNumber")[0].nodeTypedValue;
								Obj.dwSoftwareVersion 	= DeviceCfgXml.getElementsByTagName("dwSoftwareVersion")[0].nodeTypedValue;
								Obj.dwSoftwareBuildDate	= DeviceCfgXml.getElementsByTagName("dwSoftwareBuildDate")[0].nodeTypedValue;
								Obj.dwDSPSoftwareVersion = DeviceCfgXml.getElementsByTagName("dwDSPSoftwareVersion")[0].nodeTypedValue;
								Obj.dwDSPSoftwareBuildDate 	= DeviceCfgXml.getElementsByTagName("dwDSPSoftwareBuildDate")[0].nodeTypedValue;
								Obj.dwPanelVersion 		= DeviceCfgXml.getElementsByTagName("dwPanelVersion")[0].nodeTypedValue;
								Obj.dwHardwareVersion 	= DeviceCfgXml.getElementsByTagName("dwHardwareVersion")[0].nodeTypedValue;
								Obj.byAlarmInPortNum 	= DeviceCfgXml.getElementsByTagName("byAlarmInPortNum")[0].nodeTypedValue;
								Obj.byAlarmOutPortNum 	= DeviceCfgXml.getElementsByTagName("byAlarmOutPortNum")[0].nodeTypedValue;
								Obj.byRS232Num 			= DeviceCfgXml.getElementsByTagName("byRS232Num")[0].nodeTypedValue;
								Obj.byRS485Num 			= DeviceCfgXml.getElementsByTagName("byRS485Num")[0].nodeTypedValue;
								Obj.byNetworkPortNum 	= DeviceCfgXml.getElementsByTagName("byNetworkPortNum")[0].nodeTypedValue;
								Obj.byDiskCtrlNum 		= DeviceCfgXml.getElementsByTagName("byDiskCtrlNum")[0].nodeTypedValue;
								Obj.byDiskNum 			= DeviceCfgXml.getElementsByTagName("byDiskNum")[0].nodeTypedValue;
								Obj.byDVSType 			= DeviceCfgXml.getElementsByTagName("byDVSType")[0].nodeTypedValue;
								Obj.byChanNum 			= DeviceCfgXml.getElementsByTagName("byChanNum")[0].nodeTypedValue;
								Obj.byStartChan 		= DeviceCfgXml.getElementsByTagName("byStartChan")[0].nodeTypedValue;
								Obj.byDecordChans 		= DeviceCfgXml.getElementsByTagName("byDecordChans")[0].nodeTypedValue;
								Obj.byVGANum 			= DeviceCfgXml.getElementsByTagName("byVGANum")[0].nodeTypedValue;
								Obj.byUSBNum 			= DeviceCfgXml.getElementsByTagName("byUSBNum")[0].nodeTypedValue;
								Obj.byFactory 			= DeviceCfgXml.getElementsByTagName("byFactory")[0].nodeTypedValue;
								Obj.wTypeExtern 		= DeviceCfgXml.getElementsByTagName("wTypeExtern")[0].nodeTypedValue;
								Obj.wAvPort 			= DeviceCfgXml.getElementsByTagName("wAvPort")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						DeviceInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		DeviceInfoRequest.send(g_xmlDoc);
	}
}

function SetDeviceInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_DeviceInfoXmlDoc) == "string")
	{
		//g_xmlDoc = LoadXML("str", m_DeviceInfoXmlDoc);
		g_xmlDoc = LoadXML("file", "xml/DeviceCfg.xml");
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("sDVSName")[0].nodeTypedValue = Obj.sDVSName;
				g_xmlDoc.getElementsByTagName("dwDVSID")[0].nodeTypedValue = Obj.dwDVSID;
				g_xmlDoc.getElementsByTagName("dwRecycleRecord")[0].nodeTypedValue = Obj.dwRecycleRecord;
				g_xmlDoc.getElementsByTagName("dwVideoStandard")[0].nodeTypedValue = Obj.dwVideoStandard ;
				g_xmlDoc.getElementsByTagName("dwMicrophone")[0].nodeTypedValue = Obj.dwMicrophone ;
				g_xmlDoc.getElementsByTagName("szSerialNumber")[0].nodeTypedValue = Obj.szSerialNumber ;
				g_xmlDoc.getElementsByTagName("dwSoftwareVersion")[0].nodeTypedValue = Obj.dwSoftwareVersion ;
				g_xmlDoc.getElementsByTagName("dwSoftwareBuildDate")[0].nodeTypedValue = Obj.dwSoftwareBuildDate;
				g_xmlDoc.getElementsByTagName("dwDSPSoftwareVersion")[0].nodeTypedValue = Obj.dwDSPSoftwareVersion ;
				g_xmlDoc.getElementsByTagName("dwDSPSoftwareBuildDate")[0].nodeTypedValue = Obj.dwDSPSoftwareBuildDate ;
				g_xmlDoc.getElementsByTagName("dwPanelVersion")[0].nodeTypedValue = Obj.dwPanelVersion ;
				g_xmlDoc.getElementsByTagName("dwHardwareVersion")[0].nodeTypedValue = Obj.dwHardwareVersion ;
				g_xmlDoc.getElementsByTagName("byAlarmInPortNum")[0].nodeTypedValue = Obj.byAlarmInPortNum ;
				g_xmlDoc.getElementsByTagName("byAlarmOutPortNum")[0].nodeTypedValue = Obj.byAlarmOutPortNum ;
				g_xmlDoc.getElementsByTagName("byRS232Num")[0].nodeTypedValue = Obj.byRS232Num 	;
				g_xmlDoc.getElementsByTagName("byRS485Num")[0].nodeTypedValue = Obj.byRS485Num 	;
				g_xmlDoc.getElementsByTagName("byNetworkPortNum")[0].nodeTypedValue = Obj.byNetworkPortNum 	;
				g_xmlDoc.getElementsByTagName("byDiskCtrlNum")[0].nodeTypedValue = Obj.byDiskCtrlNum ;
				g_xmlDoc.getElementsByTagName("byDiskNum")[0].nodeTypedValue = Obj.byDiskNum ;
				g_xmlDoc.getElementsByTagName("byDVSType")[0].nodeTypedValue = Obj.byDVSType ;
				g_xmlDoc.getElementsByTagName("byChanNum")[0].nodeTypedValue = Obj.byChanNum ;
				
				g_xmlDoc.getElementsByTagName("byDecordChans")[0].nodeTypedValue = Obj.byDecordChans ;
				g_xmlDoc.getElementsByTagName("byVGANum")[0].nodeTypedValue = Obj.byVGANum 	;
				g_xmlDoc.getElementsByTagName("byUSBNum")[0].nodeTypedValue = Obj.byUSBNum 	;
				g_xmlDoc.getElementsByTagName("byFactory")[0].nodeTypedValue = Obj.byFactory ;
				g_xmlDoc.getElementsByTagName("wTypeExtern")[0].nodeTypedValue = Obj.wTypeExtern ;
				g_xmlDoc.getElementsByTagName("wAvPort")[0].nodeTypedValue = Obj.wAvPort ;
				
				//为了避免原始的XML文件信息有误,所以暂时先默认把所有摄像机的起始通道号byStartChan设置为0;
				g_xmlDoc.getElementsByTagName("byStartChan")[0].nodeTypedValue = 0;
				
				DeviceInfoRequest.open(Obj.method, url, Obj.asynchrony);
				DeviceInfoRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
				
				DeviceInfoRequest.onreadystatechange = function(){
						if (DeviceInfoRequest.readyState == 4)
						{
							if (DeviceInfoRequest.status == 200)
							{
								var DeviceCfgXml = DeviceInfoRequest.responseXML.documentElement;
								
								if( DeviceCfgXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								DeviceInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
					
				DeviceInfoRequest.send(g_xmlDoc);	
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											网络参数信息接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/


////////////////////////////////////////////////////////////////////////////////////////////
//定义NetInfoRequest异步通信函数
try 
{
 	NetInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	NetInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		NetInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		NetInfoRequest = false;
	   }  
 	}
}

if (!NetInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function NetWorkObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	this.result = false;
	this.dwEnableRtsp = 0;			//RTP是否启用0-不启用，1-启用
	this.wRtspPort = 0;				//RTP/RTSP监听端口
	this.wRtspMode = 0;				//RTP/RTSP传输模式			
	this.sMajorStream = 0;			//RTSP主码流的访问标识
	this.sMinorStream = 0;			//RTSP从码流的访问标识
	this.sDVSIP = 0;				//服务器IP地址
	this.sDVSIPMask = 0;			//服务器IP地址掩码
	this.wDHCP = 0;					//是否启用DHCP服务
	this.sDNSIP = 0;				//DNS服务器地址  
	this.sDNSIP2 = 0;				//备用DNS服务器地址  
	this.sGatewayIP = 0;			//网关地址 
	this.sManageHostIP = 0;			//远程管理主机地址
	this.wManageHostPort = 0;		//远程管理主机端口号
	this.sPPPoEUser = 0;			//PPPoE用户名
	this.sDDNSServerName = 0;		//DDNS服务器名称
	this.sDDNSServerName2 = 0;		//备用DDNS服务器名称
	this.sDDNSUser = 0;				//DDNS用户名
	this.sDDNSPassword = 0;			//DDNS密码
	this.sDDNSName = 0;				//DDNS名称
	this.sPPPoEUser = 0;			//PPPoE用户名
	this.wDVSPort = 0;				//端口号
	this.wHttpPort = 0;				//HTTP服务器
	this.dwManageHost = 0;			//远程管理主0-不启用,1-启用
	this.dwPPPOE = 0;				//是否启用PPPPOE
	this.dwDDNS = 0;				//是否启用DDNS
	this.byMACAddr = 0;				//设备MAC地址
}

var m_NetWorkInfoXmlDoc;
function GetNetWorkInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>NetCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		NetInfoRequest.onreadystatechange = function(){
			try{
				if (NetInfoRequest.readyState == 4)
				{
					if (NetInfoRequest.status == 200)
					{
						var NetInfoXml = NetInfoRequest.responseXML.documentElement;
						m_NetWorkInfoXmlDoc = NetInfoRequest.responseXML.xml;
						
						if(typeof(NetInfoXml) == "object")
						{
							if(NetInfoXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.dwEnableRtsp 	= NetInfoXml.getElementsByTagName("dwEnableRtsp")[0].nodeTypedValue;
								Obj.wRtspPort 		= NetInfoXml.getElementsByTagName("wRtspPort")[0].nodeTypedValue;
								Obj.wRtspMode 		= NetInfoXml.getElementsByTagName("wRtspMode")[0].nodeTypedValue;
								Obj.wRtspPort 		= NetInfoXml.getElementsByTagName("wRtspPort")[0].nodeTypedValue;
								Obj.sMajorStream 	= NetInfoXml.getElementsByTagName("sMajorStream")[0].nodeTypedValue;
								Obj.sMinorStream 	= NetInfoXml.getElementsByTagName("sMinorStream")[0].nodeTypedValue;
								
								Obj.sDVSIP 				= NetInfoXml.getElementsByTagName("eth0/sDVSIP")[0].nodeTypedValue;
								Obj.sDVSIPMask 			= NetInfoXml.getElementsByTagName("eth0/sDVSIPMask")[0].nodeTypedValue;
								Obj.wDHCP 				= NetInfoXml.getElementsByTagName("eth0/wDHCP")[0].nodeTypedValue;
								Obj.sDNSIP 				= NetInfoXml.getElementsByTagName("sDNSIP")[0].nodeTypedValue;
								Obj.sDNSIP2 			= NetInfoXml.getElementsByTagName("sDNSIP2")[0].nodeTypedValue;
								Obj.sGatewayIP 			= NetInfoXml.getElementsByTagName("sGatewayIP")[0].nodeTypedValue;
								Obj.sManageHostIP 		= NetInfoXml.getElementsByTagName("sManageHostIP")[0].nodeTypedValue;
								Obj.wManageHostPort 	= NetInfoXml.getElementsByTagName("wManageHostPort")[0].nodeTypedValue;
								Obj.sPPPoEUser 			= NetInfoXml.getElementsByTagName("sPPPoEUser")[0].nodeTypedValue;
								Obj.sDDNSServerName 	= NetInfoXml.getElementsByTagName("struDDNS/sDDNSServerName")[0].nodeTypedValue;
								Obj.sDDNSServerName2 	= NetInfoXml.getElementsByTagName("struDDNS/sDDNSServerName2")[0].nodeTypedValue;
								Obj.sDDNSUser 			= NetInfoXml.getElementsByTagName("struDDNS/sDDNSUser")[0].nodeTypedValue;
								Obj.sDDNSPassword 		= NetInfoXml.getElementsByTagName("struDDNS/sDDNSPassword")[0].nodeTypedValue;
								Obj.sDDNSName 			= NetInfoXml.getElementsByTagName("struDDNS/sDDNSName")[0].nodeTypedValue;
								Obj.sPPPoEUser			= NetInfoXml.getElementsByTagName("sPPPoEUser")[0].nodeTypedValue;
								Obj.wDVSPort 			= NetInfoXml.getElementsByTagName("eth0/wDVSPort")[0].nodeTypedValue;
								Obj.wHttpPort 			= NetInfoXml.getElementsByTagName("eth0/wHttpPort")[0].nodeTypedValue;
								Obj.dwManageHost 		= NetInfoXml.getElementsByTagName("dwManageHost")[0].nodeTypedValue;
								Obj.dwPPPOE				= NetInfoXml.getElementsByTagName("dwPPPOE")[0].nodeTypedValue;
								Obj.dwDDNS 				= NetInfoXml.getElementsByTagName("dwDDNS")[0].nodeTypedValue;
								Obj.byMACAddr 			= NetInfoXml.getElementsByTagName("eth0/byMACAddr")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						NetInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		NetInfoRequest.open(Obj.method, url, Obj.asynchrony);
		NetInfoRequest.send(g_xmlDoc);
	}
}

function SetNetWorkInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_NetWorkInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_NetWorkInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("dwEnableRtsp")[0].nodeTypedValue 		= Obj.dwEnableRtsp;
				g_xmlDoc.getElementsByTagName("wRtspPort")[0].nodeTypedValue 			= Obj.wRtspPort;
				g_xmlDoc.getElementsByTagName("wRtspMode")[0].nodeTypedValue 			= Obj.wRtspMode;
				g_xmlDoc.getElementsByTagName("wRtspPort")[0].nodeTypedValue 			= Obj.wRtspPort;
				g_xmlDoc.getElementsByTagName("sMajorStream")[0].nodeTypedValue 		= Obj.sMajorStream;
				g_xmlDoc.getElementsByTagName("sMinorStream")[0].nodeTypedValue 		= Obj.sMinorStream;
				
				g_xmlDoc.getElementsByTagName("eth0/sDVSIP")[0].nodeTypedValue 				= Obj.sDVSIP;
				g_xmlDoc.getElementsByTagName("eth0/sDVSIPMask")[0].nodeTypedValue 			= Obj.sDVSIPMask;
				g_xmlDoc.getElementsByTagName("eth0/wDHCP")[0].nodeTypedValue 				= Obj.wDHCP;
				g_xmlDoc.getElementsByTagName("sDNSIP")[0].nodeTypedValue 					= Obj.sDNSIP;
				g_xmlDoc.getElementsByTagName("sDNSIP2")[0].nodeTypedValue 					= Obj.sDNSIP2;
				g_xmlDoc.getElementsByTagName("sGatewayIP")[0].nodeTypedValue 				= Obj.sGatewayIP;
				g_xmlDoc.getElementsByTagName("sManageHostIP")[0].nodeTypedValue 			= Obj.sManageHostIP;
				g_xmlDoc.getElementsByTagName("wManageHostPort")[0].nodeTypedValue 			= Obj.wManageHostPort;
				g_xmlDoc.getElementsByTagName("sPPPoEUser")[0].nodeTypedValue 				= Obj.sPPPoEUser;
				g_xmlDoc.getElementsByTagName("struDDNS/sDDNSServerName")[0].nodeTypedValue = Obj.sDDNSServerName;
				g_xmlDoc.getElementsByTagName("struDDNS/sDDNSServerName2")[0].nodeTypedValue = Obj.sDDNSServerName2;
				g_xmlDoc.getElementsByTagName("struDDNS/sDDNSUser")[0].nodeTypedValue 		= Obj.sDDNSUser;
				g_xmlDoc.getElementsByTagName("struDDNS/sDDNSPassword")[0].nodeTypedValue 	= Obj.sDDNSPassword;
				g_xmlDoc.getElementsByTagName("struDDNS/sDDNSName")[0].nodeTypedValue 		= Obj.sDDNSName;
				g_xmlDoc.getElementsByTagName("sPPPoEUser")[0].nodeTypedValue 				= Obj.sPPPoEUser;
				g_xmlDoc.getElementsByTagName("eth0/wDVSPort")[0].nodeTypedValue 			= Obj.wDVSPort;
				g_xmlDoc.getElementsByTagName("eth0/wHttpPort")[0].nodeTypedValue 			= Obj.wHttpPort;
				g_xmlDoc.getElementsByTagName("dwManageHost")[0].nodeTypedValue 			= Obj.dwManageHost;
				g_xmlDoc.getElementsByTagName("dwPPPOE")[0].nodeTypedValue 					= Obj.dwPPPOE;
				g_xmlDoc.getElementsByTagName("dwDDNS")[0].nodeTypedValue 					= Obj.dwDDNS;
				g_xmlDoc.getElementsByTagName("eth0/byMACAddr")[0].nodeTypedValue 			= Obj.byMACAddr;
				
				NetInfoRequest.onreadystatechange = function(){
						if (NetInfoRequest.readyState == 4)
						{
							if (NetInfoRequest.status == 200)
							{
								var VideoInXml = NetInfoRequest.responseXML.documentElement;
								if(VideoInXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								NetInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				NetInfoRequest.open(Obj.method, url, Obj.asynchrony);
				NetInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											视频输入信息接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取视频输入参数/////////////////////////////////////////////
try 
{
 	VideoInRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	VideoInRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 	VideoInRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 	VideoInRequest = false;
	   }  
 	}
}

if (!VideoInRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function VideoInObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	this.result = false;
	this.byAntiFlickerMode = 0;		//抗闪烁模式
	this.byVideoColorStyle = 0;		//色彩模式
	this.byRotaeAngle180 = 0;		//图像旋转180度
	this.byColorTransMode = 0;		//设置彩转黑模式
	this.byShutterSpeed = 0;		//设置快门速度
	this.byAgc = 0;					//agc增益
	this.byIRShutMode = 0;			//设置红外模式和时间
	this.byExposure = 0;			//光圈
	this.byIRStartHour = 0;			//红外打开时间和关闭时间
	this.byIRStartMin = 0;
	this.byIRStopHour = 0;
	this.byIRStopMin = 0;
	this.byModeSwitch = 0;			//曝光模式
	this.byWhiteBalance = 0;		//白平衡
	this.byWdr = 0;					//宽动态
	this.byBlc = 0;					//背光补偿
	
}

var m_VideoInInfoXmlDoc;
function GetVideoInInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>VideoInCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		VideoInRequest.onreadystatechange = function(){
			try{
				if (VideoInRequest.readyState == 4)
				{
					if (VideoInRequest.status == 200)
					{
						var VideoInXml = VideoInRequest.responseXML.documentElement;
						m_VideoInInfoXmlDoc = VideoInRequest.responseXML.xml;
						
						if(typeof(VideoInXml) == "object")
						{
							if(VideoInXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.byAntiFlickerMode 	= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[0].nodeTypedValue;	//抗闪烁模式
								Obj.byVideoColorStyle 	= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[1].nodeTypedValue;	//色彩模式
								Obj.byRotaeAngle180		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[2].nodeTypedValue;	//图像旋转180度
								Obj.byColorTransMode	= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[3].nodeTypedValue;	//设置彩转黑模式
								Obj.byShutterSpeed		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[4].nodeTypedValue;	//设置快门速度
								Obj.byAgc				= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[5].nodeTypedValue;	//agc增益
								Obj.byIRShutMode		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[6].nodeTypedValue;	//设置红外模式和时间
								Obj.byExposure			= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[7].nodeTypedValue;	//光圈
								Obj.byIRStartHour		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[8].nodeTypedValue;	//红外打开时间和关闭时间
								Obj.byIRStartMin		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[9].nodeTypedValue;
								Obj.byIRStopHour		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[10].nodeTypedValue;
								Obj.byIRStopMin			= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[11].nodeTypedValue;
								Obj.byModeSwitch		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[12].nodeTypedValue;	//曝光模式
								Obj.byWhiteBalance		= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[13].nodeTypedValue;	//白平衡
								Obj.byWdr				= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[14].nodeTypedValue;	//宽动态
								Obj.byBlc				= VideoInXml.getElementsByTagName("tmVideoInCfg_t")[0].childNodes[15].nodeTypedValue;	//背光补偿
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						VideoInRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		VideoInRequest.open(Obj.method, url, Obj.asynchrony);
		VideoInRequest.send(g_xmlDoc);
	}
}


function SetVideoInInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_VideoInInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_VideoInInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("byAntiFlickerMode")[0].nodeTypedValue = Obj.byAntiFlickerMode;
				g_xmlDoc.getElementsByTagName("byVideoColorStyle")[0].nodeTypedValue = Obj.byVideoColorStyle;
				g_xmlDoc.getElementsByTagName("byRotaeAngle180")[0].nodeTypedValue = Obj.byRotaeAngle180;
				g_xmlDoc.getElementsByTagName("byColorTransMode")[0].nodeTypedValue = Obj.byColorTransMode;
				g_xmlDoc.getElementsByTagName("byShutterSpeed")[0].nodeTypedValue = Obj.byShutterSpeed;
				g_xmlDoc.getElementsByTagName("byAgc")[0].nodeTypedValue = Obj.byAgc;
				g_xmlDoc.getElementsByTagName("byIRShutMode")[0].nodeTypedValue = Obj.byIRShutMode;
				g_xmlDoc.getElementsByTagName("byIRStartHour")[0].nodeTypedValue = Obj.byIRStartHour;
				g_xmlDoc.getElementsByTagName("byIRStartMin")[0].nodeTypedValue = Obj.byIRStartMin;
				g_xmlDoc.getElementsByTagName("byIRStopHour")[0].nodeTypedValue = Obj.byIRStopHour;
				g_xmlDoc.getElementsByTagName("byIRStopMin")[0].nodeTypedValue = Obj.byIRStopMin;
				g_xmlDoc.getElementsByTagName("byModeSwitch")[0].nodeTypedValue = Obj.byModeSwitch;
				g_xmlDoc.getElementsByTagName("byWhiteBalance")[0].nodeTypedValue = Obj.byWhiteBalance;
				g_xmlDoc.getElementsByTagName("byWdr")[0].nodeTypedValue = Obj.byWdr;
				g_xmlDoc.getElementsByTagName("byBlc")[0].nodeTypedValue = Obj.byBlc;
				g_xmlDoc.getElementsByTagName("byExposure")[0].nodeTypedValue = Obj.byExposure;
				
				VideoInRequest.onreadystatechange = function(){
						if (VideoInRequest.readyState == 4)
						{
							if (VideoInRequest.status == 200)
							{
								var VideoInXml = VideoInRequest.responseXML.documentElement;
								if(VideoInXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}

								VideoInRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				VideoInRequest.open(Obj.method, url, Obj.asynchrony);
				VideoInRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											报警输入信息接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
//定义AlarmInInfoRequest异步通信函数
try 
{
 	AlarmInInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	AlarmInInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		AlarmInInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		AlarmInInfoRequest = false;
	   }  
 	}
}

if (!AlarmInInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function AlarmOutEnableObj()
{
	this.Enable = new Array(0,0,0,0);
}

function RelAlarmOutObj()
{
	this.AlarmOut = new Array(0,0,0,0);
}

function AlarmInTransFerChannelObj()
{
	this.byChannel = 0;						/* 通道号0-MAX_CHANNUM */
	this.byEnableRelRecordChan = 0;			/* 报警触发的录象通道,为1表示触发该通道 */
	this.byEnablePreset = 0;				/* 是否调用预置点 */
	this.byPresetNo	= 0;					/* 调用的云台预置点序号,一个报警输入可以调用多个通道的云台预置点, 0xff表示不调用预置点。*/
	this.byEnableCruise = 0;				/* 是否调用巡航 */
	this.byCruiseNo	 = 0;					/* 巡航 */
	this.byEnablePtzTrack = 0;				/* 是否调用轨迹 */
	this.byPTZTrack	 = 0;					/* 调用的云台的轨迹序号 */
}

function AlarmInSegmentObj()
{
	this.byStartHour = 0;
	this.byStartMin = 0;
	this.byStopHour	 = 0;
	this.byStopMin = 0;
}

function AlarmInDayObj()
{
	var arrSegment = new Array();
	for(var i=0; i<4; i++)
	{
		arrSegment[i] = new AlarmInSegmentObj();
	}
	
	this.Segment = arrSegment;
}

function AlarmInTimeObj()
{
	var arrTime = new Array();
	for(var i=0; i<7; i++)
	{
		arrTime[i] = new AlarmInDayObj();
	}
	
	this.day = arrTime;
}

function AlarmInObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id

	this.result = false;
	this.byRelAlarmOutEnable = new AlarmOutEnableObj();	//是否触发报警输出
	this.byRelAlarmOut = new RelAlarmOutObj();				//报警触发的输出通道,报警触发的输出,为1表示触发该输出
	this.byAlarmType = 0;									//报警器类型,0：常开,1：常闭
	this.dwHandleType = 0;									/*处理方式,处理方式的"或"结果*/
	this.sAlarmInName = 0;									/* 名称 */
	this.byAlarmInHandle = 0;								//是否处理报警
	
	var arrAlarmTransFer = new  Array(4);
	for(var i=0; i<16; i++)
	{
		arrAlarmTransFer[i] = new AlarmInTransFerChannelObj();
	}
	
	this.struAlarmTransFer = arrAlarmTransFer;			/* 报警处理动作 */
	this.struAlarmTime = new AlarmInTimeObj();			//报警处理时间段
		
}

var m_AlarmInInfoXmlDoc;
function GetAlarmInInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>AlarmInCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		AlarmInInfoRequest.onreadystatechange = function(){
			try{
				if (AlarmInInfoRequest.readyState == 4)
				{
					if (AlarmInInfoRequest.status == 200)
					{
						var AlarmInInXml = AlarmInInfoRequest.responseXML.documentElement;
						m_AlarmInInfoXmlDoc = AlarmInInfoRequest.responseXML.xml;
						
						if(typeof(AlarmInInXml) == "object")
						{
							if(AlarmInInXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								//是否触发报警输出
								for(var i=0; i<4; i++)
								{
									Obj.byRelAlarmOutEnable.Enable[i] = AlarmInInXml.getElementsByTagName("byRelAlarmOutEnable")[0].childNodes[i].nodeTypedValue;
									Obj.byRelAlarmOut.AlarmOut[i] = AlarmInInXml.getElementsByTagName("byRelAlarmOut")[0].childNodes[i].nodeTypedValue;
								}
								
								Obj.byAlarmType = AlarmInInXml.getElementsByTagName("byAlarmType")[0].nodeTypedValue;
								Obj.dwHandleType = AlarmInInXml.getElementsByTagName("dwHandleType")[0].nodeTypedValue;
								Obj.sAlarmInName =  AlarmInInXml.getElementsByTagName("sAlarmInName")[0].nodeTypedValue;
								Obj.byAlarmInHandle = AlarmInInXml.getElementsByTagName("byAlarmInHandle")[0].nodeTypedValue;
								
								for(i=0; i<16; i++)
								{
									Obj.struAlarmTransFer[i].byEnableRelRecordChan = AlarmInInXml.getElementsByTagName("struAlarmTransFer")[0].childNodes[i].childNodes[0].nodeTypedValue;	
									Obj.struAlarmTransFer[i].byEnablePreset = AlarmInInXml.getElementsByTagName("struAlarmTransFer")[0].childNodes[i].childNodes[1].nodeTypedValue;
									Obj.struAlarmTransFer[i].byPresetNo = AlarmInInXml.getElementsByTagName("struAlarmTransFer")[0].childNodes[i].childNodes[2].nodeTypedValue;
								}
								
								for(i=0; i<7; i++)
								{
									for(var j=0; j<4; j++)
									{
										Obj.struAlarmTime.day[i].Segment[j].byStartHour = AlarmInInXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStartMin = AlarmInInXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStopHour = AlarmInInXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStopMin = AlarmInInXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue;
									}
								}
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						AlarmInInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		AlarmInInfoRequest.open(Obj.method, url, Obj.asynchrony);
		AlarmInInfoRequest.send(g_xmlDoc);
	}
}

function SetAlarmInInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_AlarmInInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_AlarmInInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				//是否触发报警输出
				for(var i=0; i<4; i++)
				{
					g_xmlDoc.getElementsByTagName("byRelAlarmOutEnable")[0].childNodes[i].nodeTypedValue = Obj.byRelAlarmOutEnable.Enable[i];
					g_xmlDoc.getElementsByTagName("byRelAlarmOut")[0].childNodes[i].nodeTypedValue = Obj.byRelAlarmOut.AlarmOut[i];
				}
				
				g_xmlDoc.getElementsByTagName("byAlarmType")[0].nodeTypedValue = Obj.byAlarmType;
				g_xmlDoc.getElementsByTagName("dwHandleType")[0].nodeTypedValue = Obj.dwHandleType;
				g_xmlDoc.getElementsByTagName("sAlarmInName")[0].nodeTypedValue = Obj.sAlarmInName;
				g_xmlDoc.getElementsByTagName("byAlarmInHandle")[0].nodeTypedValue = Obj.byAlarmInHandle;
				
				for(i=0; i<16; i++)
				{
					g_xmlDoc.getElementsByTagName("struAlarmTransFer")[0].childNodes[i].childNodes[0].nodeTypedValue = Obj.struAlarmTransFer[i].byEnableRelRecordChan;
					g_xmlDoc.getElementsByTagName("struAlarmTransFer")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.struAlarmTransFer[i].byEnablePreset;
					g_xmlDoc.getElementsByTagName("struAlarmTransFer")[0].childNodes[i].childNodes[2].nodeTypedValue = Obj.struAlarmTransFer[i].byPresetNo;
				}
				
				for(i=0; i<7; i++)
				{
					for(var j=0; j<4; j++)
					{
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStartHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStartMin;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStopHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStopMin;
					}
				}
				
				AlarmInInfoRequest.onreadystatechange = function(){
						if (AlarmInInfoRequest.readyState == 4)
						{
							if (AlarmInInfoRequest.status == 200)
							{
								var VideoInXml = AlarmInInfoRequest.responseXML.documentElement;
								if(VideoInXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								AlarmInInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				AlarmInInfoRequest.open(Obj.method, url, Obj.asynchrony);
				AlarmInInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											报警输出信息接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义AlarmOutInfoRequest异步通信函数
try 
{
 	AlarmOutInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	AlarmOutInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		AlarmOutInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		AlarmOutInfoRequest = false;
	   }  
 	}
}

if (!AlarmOutInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function AlarmOutSegmentObj()
{
	this.byStartHour = 0;
	this.byStartMin = 0;
	this.byStopHour	 = 0;
	this.byStopMin = 0;
}

function AlarmOutDayObj()
{
	var arrSegment = new Array();
	for(var i=0; i<4; i++)
	{
		arrSegment[i] = new AlarmOutSegmentObj();
	}
	
	this.Segment = arrSegment;
}

function AlarmOutTimeObj()
{
	var arrTime = new Array();
	for(var i=0; i<7; i++)
	{
		arrTime[i] = new AlarmOutDayObj();
	}
	
	this.day = arrTime;
}

function AlarmOutObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//报警输入的通道号
	
	this.result = false;
	this.sAlarmOutName = "";		/* 名称 */
	this.dwSchedTimType = 0;		//输出布防类型,0-用时间布防，1-默认开始所有布防，2-撤防
	this.dwAlarmOutDelay = 0;		/* 输出保持时间(-1为无限，手动关闭), 毫秒 */
	this.struAlarmTime = new AlarmOutTimeObj();			//报警处理时间段
}

var m_AlarmOutInfoXmlDoc;
function GetAlarmOutInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>AlarmOutCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		AlarmOutInfoRequest.onreadystatechange = function(){
			try{
				if (AlarmOutInfoRequest.readyState == 4)
				{
					if (AlarmOutInfoRequest.status == 200)
					{
						var AlarmOutXml = AlarmOutInfoRequest.responseXML.documentElement;
						m_AlarmOutInfoXmlDoc = AlarmOutInfoRequest.responseXML.xml;
						
						if(typeof(AlarmOutXml) == "object")
						{
							if(AlarmOutXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.sAlarmOutName = AlarmOutXml.getElementsByTagName("sAlarmOutName")[0].nodeTypedValue;
								Obj.dwSchedTimType = AlarmOutXml.getElementsByTagName("dwSchedTimType")[0].nodeTypedValue;
								Obj.dwAlarmOutDelay = AlarmOutXml.getElementsByTagName("dwAlarmOutDelay")[0].nodeTypedValue;
								
								for(var i=0; i<7; i++)
								{
									for(var j=0; j<4; j++)
									{
										Obj.struAlarmTime.day[i].Segment[j].byStartHour = AlarmOutXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStartMin = AlarmOutXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStopHour = AlarmOutXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStopMin = AlarmOutXml.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue;
									}
								}
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						AlarmOutInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};	
		AlarmOutInfoRequest.open("POST", url, false);
		AlarmOutInfoRequest.send(g_xmlDoc);
	}
}

function SetAlarmOutInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_AlarmOutInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_AlarmOutInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("sAlarmOutName")[0].nodeTypedValue = Obj.sAlarmOutName;
				g_xmlDoc.getElementsByTagName("dwSchedTimType")[0].nodeTypedValue = Obj.dwSchedTimType;
				g_xmlDoc.getElementsByTagName("dwAlarmOutDelay")[0].nodeTypedValue = Obj.dwAlarmOutDelay;
				
				for(var i=0; i<7; i++)
				{
					for(var j=0; j<4; j++)
					{
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStartHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStartMin;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStopHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStopMin;
					}
				}
				
				AlarmOutInfoRequest.onreadystatechange = function(){
						if (AlarmOutInfoRequest.readyState == 4)
						{
							if (AlarmOutInfoRequest.status == 200)
							{
								var VideoInXml = AlarmOutInfoRequest.responseXML.documentElement;
								if(VideoInXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								AlarmOutInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				AlarmOutInfoRequest.open(Obj.method, url, Obj.asynchrony);
				AlarmOutInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											手动操作报警接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义SetHandleAlarmInfoRequest异步通信函数
try 
{
 	SetHandleAlarmInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	SetHandleAlarmInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 	SetHandleAlarmInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 	SetHandleAlarmInfoRequest = false;
	   }  
 	}
}

if (!SetHandleAlarmInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function OpenAlarmObj()
{
	this.callbackfunction = "";		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	this.handle = 0;				//操作方式
	this.result = false;
}

function OpenAlarm(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>HandleOffAlarmOut</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header><Body></Body></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			
			if(Obj.handle == 0 )
			{
				g_xmlDoc.getElementsByTagName("cmd")[0].nodeTypedValue = "HandleOffAlarmOut";		//手动关闭报警
			}
			else
			{
				g_xmlDoc.getElementsByTagName("cmd")[0].nodeTypedValue = "HandleOnAlarmOut";		//手动打开报警
			}
			
			g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
			
			SetHandleAlarmInfoRequest.onreadystatechange = function(){
					if (SetHandleAlarmInfoRequest.readyState == 4)
					{
						if (SetHandleAlarmInfoRequest.status == 200)
						{
							var HandleAlarmInfoXML = SetHandleAlarmInfoRequest.responseXML.documentElement;
							if(HandleAlarmInfoXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
							}
							else
							{
								Obj.result = false;
							}
							
							SetHandleAlarmInfoRequest.abort();
							Obj.callbackfunction(Obj);
						}
					}
				};
			SetHandleAlarmInfoRequest.open(Obj.method, url, Obj.asynchrony);
			SetHandleAlarmInfoRequest.send(g_xmlDoc);
		}
		catch(err)
		{
			Obj.result = false;
		}	
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											云台协议参数接口  				   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取协议参数/////////////////////////////////////////////
try 
{
 	GetPtzProtocolRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetPtzProtocolRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 	GetPtzProtocolRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 	GetPtzProtocolRequest = false;
	   }  
 	}
}

if (!GetPtzProtocolRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function PtzProtocolObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;
	
	var arrDecoderName = new Object(255);
	
	this.result = false;
	this.count = 0;
	this.szDecoderName = arrDecoderName;
	
}

function GetPtzProtocol(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>EnumPtzProtocolCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetPtzProtocolRequest.onreadystatechange = function(){
			try{
					if (GetPtzProtocolRequest.readyState == 4)
					{
						if (GetPtzProtocolRequest.status == 200)
						{
							var PtzProtocolXml = GetPtzProtocolRequest.responseXML.documentElement;
							
							if(typeof(PtzProtocolXml) == "object")
							{
								if( PtzProtocolXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
									Obj.count = PtzProtocolXml.getElementsByTagName("tmDecoderInfo_t")[0].childNodes.length;
									
									for(var i=0; i<Obj.count; i++ )
									{
										Obj.szDecoderName[i] = PtzProtocolXml.getElementsByTagName("tmDecoderInfo_t")[0].childNodes[i].nodeTypedValue;
									}
								}
								else
								{
									Obj.result = false;
								}
							}
							else
							{
								Obj.result = false;
							}
							
							GetPtzProtocolRequest.abort();
							Obj.callbackfunction(Obj);
						}
					}
				}
				catch(err)
				{
					Obj.result = false;
				}	
			};	
		GetPtzProtocolRequest.open(Obj.method, url, Obj.asynchrony);
		GetPtzProtocolRequest.send(g_xmlDoc);
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											云镜参数接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
////////////////////////////////////获取云镜参数/////////////////////////////////////////////
try 
{
 	PtzDecoderInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	PtzDecoderInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 	PtzDecoderInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 	PtzDecoderInfoRequest = false;
	   }  
 	}
}

if (!PtzDecoderInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function PtzDecoderInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;
	
	this.result = false;
	this.wDecoderAddress = "";		/*解码器地址:0 - 255*/
	this.byParity = "";				// 校验 
	this.szDecoderName = "";		//解码器名称	
	this.byDataBit = "";			// 数据有几位 
	this.dwBaudRate = "";			//波特率(bps)直接表示
}

var m_PtzDecoderInfoXmlDoc;
function GetPtzDecoderInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>PtzDecoderCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		PtzDecoderInfoRequest.onreadystatechange = function(){
			try{
				if (PtzDecoderInfoRequest.readyState == 4)
				{
					if (PtzDecoderInfoRequest.status == 200)
					{
						var PtzDecoderInfoXml = PtzDecoderInfoRequest.responseXML.documentElement;
						m_PtzDecoderInfoXmlDoc = PtzDecoderInfoRequest.responseXML.xml;
						
						if(typeof(PtzDecoderInfoXml) == "object")
						{
							if( PtzDecoderInfoXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
								Obj.wDecoderAddress = PtzDecoderInfoXml.getElementsByTagName("wDecoderAddress")[0].nodeTypedValue;
								Obj.byParity = PtzDecoderInfoXml.getElementsByTagName("byParity")[0].nodeTypedValue;
								Obj.szDecoderName = PtzDecoderInfoXml.getElementsByTagName("szDecoderName")[0].nodeTypedValue;
								Obj.byDataBit = PtzDecoderInfoXml.getElementsByTagName("byDataBit")[0].nodeTypedValue;
								Obj.dwBaudRate = PtzDecoderInfoXml.getElementsByTagName("dwBaudRate")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						PtzDecoderInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		PtzDecoderInfoRequest.open(Obj.method, url, Obj.asynchrony);
		PtzDecoderInfoRequest.send(g_xmlDoc);
	}
}

function SetPtzDecoderInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_PtzDecoderInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_PtzDecoderInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				
				g_xmlDoc.getElementsByTagName("wDecoderAddress")[0].nodeTypedValue = Obj.wDecoderAddress;
				g_xmlDoc.getElementsByTagName("byParity")[0].nodeTypedValue = Obj.byParity;
				g_xmlDoc.getElementsByTagName("szDecoderName")[0].nodeTypedValue = Obj.szDecoderName;
				g_xmlDoc.getElementsByTagName("byDataBit")[0].nodeTypedValue = Obj.byDataBit;
				g_xmlDoc.getElementsByTagName("dwBaudRate")[0].nodeTypedValue = Obj.dwBaudRate;
				
				PtzDecoderInfoRequest.onreadystatechange = function(){
						if (PtzDecoderInfoRequest.readyState == 4)
						{
							if (PtzDecoderInfoRequest.status == 200)
							{
								var PtzDecoderInfoXml = PtzDecoderInfoRequest.responseXML.documentElement;
								
								if( PtzDecoderInfoXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								PtzDecoderInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};	
				PtzDecoderInfoRequest.open(Obj.method, url, Obj.asynchrony);
				PtzDecoderInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											音频参数接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取音频设置参数/////////////////////////////////////////////
try 
{
 	GetAudioInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetAudioInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetAudioInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetAudioInfoRequest = false;
	   }  
 	}
}

if (!GetAudioInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
//////////////////////////////////////////////////////////////////////////////////////////


function AudioInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.channel = 0;
	
	this.result = false;
	this.dwLampFactor = "";			//音频倍数
	this.byCompressFormat = "";		//语音格式
	this.byChannelMode = "";		//音频模式
}

var m_AudioInfoXmlDoc;
function GetAudioInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>AudioCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.channel +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetAudioInfoRequest.onreadystatechange = function(){
			try{
				if (GetAudioInfoRequest.readyState == 4)
				{
					if (GetAudioInfoRequest.status == 200)
					{
						var AudioInfoXml = GetAudioInfoRequest.responseXML.documentElement;
						m_AudioInfoXmlDoc = GetAudioInfoRequest.responseXML.xml;
						
						if(typeof(AudioInfoXml) == "object")
						{
							if( AudioInfoXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
								Obj.dwLampFactor = AudioInfoXml.getElementsByTagName("dwLampFactor")[0].nodeTypedValue;
								Obj.byCompressFormat = AudioInfoXml.getElementsByTagName("byCompressFormat")[0].nodeTypedValue;
								Obj.byChannelMode = AudioInfoXml.getElementsByTagName("byChannelMode")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetAudioInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		GetAudioInfoRequest.open(Obj.method, url, Obj.asynchrony);
		GetAudioInfoRequest.send(g_xmlDoc);
	}
}

function SetAudioInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_AudioInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_AudioInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.channel;
				
				g_xmlDoc.getElementsByTagName("dwLampFactor")[0].nodeTypedValue = Obj.dwLampFactor;
				g_xmlDoc.getElementsByTagName("byCompressFormat")[0].nodeTypedValue = Obj.byCompressFormat;
				g_xmlDoc.getElementsByTagName("byChannelMode")[0].nodeTypedValue = Obj.byChannelMode;
				
				GetAudioInfoRequest.onreadystatechange = function(){
						if (GetAudioInfoRequest.readyState == 4)
						{
							if (GetAudioInfoRequest.status == 200)
							{
								var PtzDecoderInfoXml = GetAudioInfoRequest.responseXML.documentElement;
								
								if( PtzDecoderInfoXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetAudioInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};	
				GetAudioInfoRequest.open(Obj.method, url, Obj.asynchrony);
				GetAudioInfoRequest.send(g_xmlDoc);	
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											模拟输出接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取模拟输出参数/////////////////////////////////////////////
try 
{
 	GetVideoOutRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetVideoOutRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetVideoOutRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetVideoOutRequest = false;
	   }  
 	}
}

if (!GetVideoOutRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function VideoOutObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;
	
	this.result = false;
	this.byEnableVideoOut = 0;
	this.byVideoOutMode = "";
}

var m_VideoOutXmlDoc;
function GetVideoOut(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>VideoOutCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetVideoOutRequest.onreadystatechange = function(){
			try{
				if (GetVideoOutRequest.readyState == 4)
				{
					if (GetVideoOutRequest.status == 200)
					{
						var VideoOutXml = GetVideoOutRequest.responseXML.documentElement;
						m_VideoOutXmlDoc = GetVideoOutRequest.responseXML.xml;
						
						if(typeof(VideoOutXml) == "object")
						{
							if( VideoOutXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
								Obj.byEnableVideoOut = VideoOutXml.getElementsByTagName("byEnableVideoOut")[0].nodeTypedValue;
								Obj.byVideoOutMode = VideoOutXml.getElementsByTagName("byVideoOutMode")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetVideoOutRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};	
		GetVideoOutRequest.open(Obj.method, url, Obj.asynchrony);
		GetVideoOutRequest.send(g_xmlDoc);
	}
}

function SetVideoOut(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_VideoOutXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_VideoOutXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("byEnableVideoOut")[0].nodeTypedValue = Obj.byEnableVideoOut;
				g_xmlDoc.getElementsByTagName("byVideoOutMode")[0].nodeTypedValue = Obj.byVideoOutMode;
				
				GetVideoOutRequest.onreadystatechange = function(){
						if (GetVideoOutRequest.readyState == 4)
						{
							if (GetVideoOutRequest.status == 200)
							{
								var VideoOutXml = GetVideoOutRequest.responseXML.documentElement;
								
								if( VideoOutXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetVideoOutRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};	
				GetVideoOutRequest.open(Obj.method, url, Obj.asynchrony);
				GetVideoOutRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
	
	Obj.callbackfunction(Obj);
	GetVideoOutRequest.abort();
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											用户验证接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
//////////////////////////////////////////////////////////////////////////
//定义UserLoginRequest异步通信函数
var UserLoginRequest;

try 
{
   UserLoginRequest = new XMLHttpRequest();
} 
catch (trymicrosoft) 
{
    try 
    {
        UserLoginRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (othermicrosoft) 
    {
        try 
        {
            UserLoginRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (failed) 
        {
            UserLoginRequest = false;
        }
    }
}

if (!UserLoginRequest) 
{
    alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////

function UserLoginObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.headercmd = "";			//命令头
	this.username = "";
	this.password = "";
	
	this.result = false;			//用户登录返回信息
}

function UserLogin(Obj)
{
	//写入xml文件
	var sDate = new Date();
    var strUrl = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
    var str = '<?xml version="1.0" encoding="UTF-8"?><Envelope><Header><cmd>UserCfg</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header><body><tmUserInfo_t><szUserName>1</szUserName><szPassword>2</szPassword></tmUserInfo_t></body></Envelope>';
	g_xmlDoc = LoadXML("str", str);
    //alert(g_xmlDoc);
    if (typeof(g_xmlDoc) == "object") 
    {
    	try{
	        g_xmlDoc.getElementsByTagName("Header/cmd")[0].nodeTypedValue = Obj.headercmd;
	        g_xmlDoc.getElementsByTagName("szUserName")[0].nodeTypedValue = Obj.username;
	        g_xmlDoc.getElementsByTagName("szPassword")[0].nodeTypedValue = Obj.password;
	        
			UserLoginRequest.onreadystatechange = function(){
					if (UserLoginRequest.readyState == 4) 
				    {
				        if (UserLoginRequest.status == 200) 
				        {
				            //获取返回回来的XML文档
				            var strUserLoginXml = UserLoginRequest.responseXML.documentElement;
				            //alert(UserLoginRequest.responseXML.xml);
				            //获取登录状态   登录成功返回 0
				            if (strUserLoginXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0) 
				            {
				            	Obj.result = true;		            
				            }
				            else
							{
				            	Obj.result = false;
				            }
				            
				            UserLoginRequest.abort();
						    Obj.callbackfunction(Obj);
						}
					}
				};
			 UserLoginRequest.open(Obj.method, strUrl, Obj.asynchrony);
			 UserLoginRequest.send(g_xmlDoc);
    	}
    	catch(err)
		{
    		Obj.result = false;
    	}
	}
    else
	{
    	Obj.result = false;
    }
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											用户权限接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

 //////////////////////////////////////////////////////////////////////////
//定义GetUserRight异步通信函数
var GetUserRightRequest;
try 
{
    GetUserRightRequest = new XMLHttpRequest();
} 
catch (trymicrosoft) 
{
    try 
    {
        GetUserRightRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (othermicrosoft) 
    {
        try 
        {
            GetUserRightRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (failed) 
        {
            GetUserRightRequest = false;
        }
    }
}

if (!GetUserRightRequest) 
{
    alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function UserRightObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	
	this.result = false;			//返回值标志
	this.userright = "";			//用户权限
}

//获取用户权限
function GetUserRight(Obj)
{
	//请求用户权限
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var str = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>EnumUserCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag></Header></Envelope>';
	g_xmlDoc = LoadXML("str", str)
	if (typeof(g_xmlDoc) == "object") 
	{
		try{
			GetUserRightRequest.onreadystatechange = function(){
				
					if (GetUserRightRequest.readyState == 4) 
	                {
	                    if (GetUserRightRequest.status == 200) 
	                    {
	                        //获取返回回来的用户信息
							//alert(GetUserRightRequest.responseXML.xml);
	                        var StrUserCfgXml = GetUserRightRequest.responseXML.documentElement;
	                        
	                        if(typeof(StrUserCfgXml) == "object")
							{
		                        var numUserCount = StrUserCfgXml.getElementsByTagName("tmUser_t/iUserCount")[0].nodeTypedValue; //用户总数
		                        var aryAllUserInfo = StrUserCfgXml.getElementsByTagName("struUserInfo")[0].childNodes; //用户详细信息的数组
		                        if (StrUserCfgXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0) //判断XML返回状态
		                        {
		                            for (var i = 0; i < aryAllUserInfo.length; i++) 
		                            {
		                                if (Obj.username == aryAllUserInfo[i].childNodes[0].nodeTypedValue) 
		                                {
											Obj.result = true;		//正常返回
											Obj.userright = aryAllUserInfo[i].childNodes[6].nodeTypedValue;
		                                }
		                            }
		                        }
		                        else
								{
		                        	Obj.result = false;
		                        }
							}
	                        else
							{
	                        	Obj.result = false;
	                        }
	                        
	                        GetUserRightRequest.abort();	
	                		Obj.callbackfunction(Obj);
						}
					}
				};
			GetUserRightRequest.open(Obj.method, url, Obj.asynchrony);
			GetUserRightRequest.send(g_xmlDoc)
		}
		catch(err)
		{
			Obj.result = false;
		}
	}
	else
	{
		Obj.result = false;
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											NTP参数接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

/////////////////////////////////////////////////////////////////////////////////////////////////
//定义NtpInfoRequest异步通信函数
try 
{
 	NtpInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	NtpInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		NtpInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		NtpInfoRequest = false;
	   }  
 	}
}

if (!NtpInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function NtpInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.dwEnableNtp = "";
	this.strNTPServer = "";
	this.dwNtpTime = "";
	
}

var m_NtpInfoXmlDoc;
function GetNtpInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>NtpCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		NtpInfoRequest.onreadystatechange = function(){
			try{
				if(NtpInfoRequest.readyState == 4 )
				{
					if(NtpInfoRequest.status == 200 )
					{
						var NtpInfoXML = NtpInfoRequest.responseXML.documentElement;
						m_NtpInfoXmlDoc = NtpInfoRequest.responseXML.xml;
						
						if(typeof(NtpInfoXML) == "object")
						{
							if(NtpInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.dwEnableNtp = NtpInfoXML.getElementsByTagName("dwEnableNtp")[0].nodeTypedValue;
								Obj.strNTPServer = NtpInfoXML.getElementsByTagName("strNTPServer")[0].nodeTypedValue;
								Obj.dwNtpTime = NtpInfoXML.getElementsByTagName("dwNtpTime")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						NtpInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}
		};
		NtpInfoRequest.open(Obj.method, url, Obj.asynchrony);
		NtpInfoRequest.send(g_xmlDoc);
	}
}

function SetNtpInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	
	if(typeof(m_NtpInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_NtpInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("dwEnableNtp")[0].nodeTypedValue = Obj.dwEnableNtp;
				g_xmlDoc.getElementsByTagName("strNTPServer")[0].nodeTypedValue = Obj.strNTPServer;
				g_xmlDoc.getElementsByTagName("dwNtpTime")[0].nodeTypedValue = Obj.dwNtpTime;
				
				NtpInfoRequest.onreadystatechange = function(){	
						if(NtpInfoRequest.readyState == 4 )
						{
							if(NtpInfoRequest.status == 200 )
							{
								var g_xmlDoc = NtpInfoRequest.responseXML.documentElement;
								
								if(g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								NtpInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				NtpInfoRequest.open(Obj.method, url, Obj.asynchrony);
				NtpInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											心跳包接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

/////////////////////////////////////////////////////////////////////////////////////////////////
//定义LiveHeartInfoRequest异步通信函数
try 
{
 	LiveHeartInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	LiveHeartInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		LiveHeartInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		LiveHeartInfoRequest = false;
	   }  
 	}
}

if (!LiveHeartInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function LiveHeartInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.byEnableLiveHeart = "";		//是否启用心跳
	this.byLiveHeartMode = "";			//心跳包发送模式0-UDP,1-TCP/IP
	this.wLiveTime = "";				//发送心跳间隔时间(单位:秒)
	this.sServerAddress = "";			//远程管理主机地址
	this.dwServerPort = "";				//远程管理主机端口号
	
}

var m_LiveHeartInfoXmlDoc;
function GetLiveHeartInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>LiveHeartCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		LiveHeartInfoRequest.onreadystatechange = function(){
			try{
				if(LiveHeartInfoRequest.readyState == 4 )
				{
					if(LiveHeartInfoRequest.status == 200 )
					{
						var LiveHeartInfoXML = LiveHeartInfoRequest.responseXML.documentElement;
						m_LiveHeartInfoXmlDoc = LiveHeartInfoRequest.responseXML.xml;
						
						if(typeof(LiveHeartInfoXML) == "object")
						{
							if(LiveHeartInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.byEnableLiveHeart = LiveHeartInfoXML.getElementsByTagName("byEnableLiveHeart")[0].nodeTypedValue;
								Obj.byLiveHeartMode = LiveHeartInfoXML.getElementsByTagName("byLiveHeartMode")[0].nodeTypedValue;
								Obj.wLiveTime = LiveHeartInfoXML.getElementsByTagName("wLiveTime")[0].nodeTypedValue;
								Obj.sServerAddress = LiveHeartInfoXML.getElementsByTagName("sServerAddress")[0].nodeTypedValue;
								Obj.dwServerPort = LiveHeartInfoXML.getElementsByTagName("dwServerPort")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						LiveHeartInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		LiveHeartInfoRequest.open(Obj.method, url, Obj.asynchrony);
		LiveHeartInfoRequest.send(g_xmlDoc);
	}
}

function SetLiveHeartInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	
	if(typeof(m_LiveHeartInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_LiveHeartInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("byEnableLiveHeart")[0].nodeTypedValue = Obj.byEnableLiveHeart;
				g_xmlDoc.getElementsByTagName("byLiveHeartMode")[0].nodeTypedValue = Obj.byLiveHeartMode;
				g_xmlDoc.getElementsByTagName("wLiveTime")[0].nodeTypedValue = Obj.wLiveTime;
				g_xmlDoc.getElementsByTagName("sServerAddress")[0].nodeTypedValue = Obj.sServerAddress;
				g_xmlDoc.getElementsByTagName("dwServerPort")[0].nodeTypedValue = Obj.dwServerPort;
				
				LiveHeartInfoRequest.onreadystatechange = function(){
						if (LiveHeartInfoRequest.readyState == 4)
						{
							if (LiveHeartInfoRequest.status == 200)
							{
								var LiveHeartInfoXML = LiveHeartInfoRequest.responseXML.documentElement;
								
								if(LiveHeartInfoXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								LiveHeartInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				LiveHeartInfoRequest.open(Obj.method, url, Obj.asynchrony);
				LiveHeartInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											WIFI参数接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////获取设备wifi信息//////////////////////////////////////////
try 
{
 	WifiInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	WifiInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		WifiInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		WifiInfoRequest = false;
	   }  
 	}
}

if (!WifiInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function WifiInfoObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
		
	this.result = false;
	this.byEnable = "";				//无线是否启用
	this.byDhcp = "";				//无线地址方式,1启用动态IP获取,0指定IP
	this.sIpAddr = "";				//Wifi地址ip
	this.sIpMaskAddr = "";			//掩码
	this.sGatewayIP = "";			//网关
	this.sDNSIP1 = "";
	this.sDNSIP2 = "";
	this.sSsid = "";				//SSID
	this.sKey = "";					//密钥
	this.byKeyMgmt = "";			//身份验证
	this.byKeyType = "";			//数据加密0-禁用，1-WEP，2-TKIP,3-AES
	this.byKeyIndex = "";			//密码索引
	this.dwWpaPtkRekey = "";		//更换密钥时间
}

var m_WifiInfoXmlDoc;
function GetWifiInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>WifiCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		WifiInfoRequest.onreadystatechange = function(){
			try{
					if (WifiInfoRequest.readyState == 4)
					{
						if (WifiInfoRequest.status == 200)
						{
							var WifiInfoXml = WifiInfoRequest.responseXML.documentElement;
							m_WifiInfoXmlDoc = WifiInfoRequest.responseXML.xml;
							
							if(typeof(WifiInfoXml) == "object")
							{
								if(WifiInfoXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
									
									Obj.byEnable 				= WifiInfoXml.getElementsByTagName("byEnable")[0].nodeTypedValue;
									Obj.byDhcp 					= WifiInfoXml.getElementsByTagName("byDhcp")[0].nodeTypedValue;
									Obj.sIpAddr 				= WifiInfoXml.getElementsByTagName("sIpAddr")[0].nodeTypedValue;
									Obj.sIpMaskAddr 			= WifiInfoXml.getElementsByTagName("sIpMaskAddr")[0].nodeTypedValue;
									Obj.sGatewayIP 				= WifiInfoXml.getElementsByTagName("sGatewayIP")[0].nodeTypedValue;
									Obj.sDNSIP1					= WifiInfoXml.getElementsByTagName("sDNSIP1")[0].nodeTypedValue;
									Obj.sDNSIP2					= WifiInfoXml.getElementsByTagName("sDNSIP2")[0].nodeTypedValue;
									Obj.sSsid 					= WifiInfoXml.getElementsByTagName("sSsid")[0].nodeTypedValue;
									Obj.sKey 					= WifiInfoXml.getElementsByTagName("sKey")[0].nodeTypedValue;
									Obj.byKeyMgmt 				= WifiInfoXml.getElementsByTagName("byKeyMgmt")[0].nodeTypedValue;
									Obj.byKeyType 				= WifiInfoXml.getElementsByTagName("byKeyType")[0].nodeTypedValue;
									Obj.byKeyIndex 				= WifiInfoXml.getElementsByTagName("byKeyIndex")[0].nodeTypedValue;
									Obj.dwWpaPtkRekey 			= WifiInfoXml.getElementsByTagName("dwWpaPtkRekey")[0].nodeTypedValue;
								}
								else
								{
									Obj.result = false;
								}
							}
							else
							{
								Obj.result = false;
							}
							
							WifiInfoRequest.abort();
							Obj.callbackfunction(Obj);
						}
					}
				}
				catch(err)
				{
					Obj.result = false;
				}
		};
		WifiInfoRequest.open(Obj.method, url, Obj.asynchrony);
		WifiInfoRequest.send(g_xmlDoc);
	}
}

function SetWifiInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_WifiInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_WifiInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("byEnable")[0].nodeTypedValue 		= Obj.byEnable;
				g_xmlDoc.getElementsByTagName("byDhcp")[0].nodeTypedValue 			= Obj.byDhcp;
				g_xmlDoc.getElementsByTagName("sIpAddr")[0].nodeTypedValue 			= Obj.sIpAddr;
				g_xmlDoc.getElementsByTagName("sIpMaskAddr")[0].nodeTypedValue 		= Obj.sIpMaskAddr;
				g_xmlDoc.getElementsByTagName("sGatewayIP")[0].nodeTypedValue 		= Obj.sGatewayIP;
				g_xmlDoc.getElementsByTagName("sDNSIP1")[0].nodeTypedValue			= Obj.sDNSIP1;
				g_xmlDoc.getElementsByTagName("sDNSIP2")[0].nodeTypedValue			= Obj.sDNSIP2;
				g_xmlDoc.getElementsByTagName("sSsid")[0].nodeTypedValue 			= Obj.sSsid;
				g_xmlDoc.getElementsByTagName("sKey")[0].nodeTypedValue 			= Obj.sKey;
				g_xmlDoc.getElementsByTagName("byKeyMgmt")[0].nodeTypedValue 		= Obj.byKeyMgmt;
				g_xmlDoc.getElementsByTagName("byKeyType")[0].nodeTypedValue 		= Obj.byKeyType;
				g_xmlDoc.getElementsByTagName("byKeyIndex")[0].nodeTypedValue 		= Obj.byKeyIndex;
				g_xmlDoc.getElementsByTagName("dwWpaPtkRekey")[0].nodeTypedValue 	= Obj.dwWpaPtkRekey;
				
				
				WifiInfoRequest.onreadystatechange = function(){
						if (WifiInfoRequest.readyState == 4)
						{
							if (WifiInfoRequest.status == 200)
							{
								var WifiXml = WifiInfoRequest.responseXML.documentElement;
								if(WifiXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								WifiInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				WifiInfoRequest.open(Obj.method, url, Obj.asynchrony);
				WifiInfoRequest.send(g_xmlDoc);
			}catch(err)
			{Obj.result = false;}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											抓拍参数接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义GetCaptureInfoRequest 异步通信函数
try 
{
 	GetCaptureInfoRequest  = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetCaptureInfoRequest  = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetCaptureInfoRequest  = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetCaptureInfoRequest  = false;
	   }  
 	}
}

if (!GetCaptureInfoRequest )
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function CaptureInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.sFTPServerIpAddr = "";		//服务器地址
	this.dwFTPServerPort = "";		//服务器的端口
	this.sFTPCliUserName = "";		//FTP服务器用户名
	this.sFTPCliUserPass = "";		//FTP服务器用户密码
	this.byCaptureNum = "";			//每次报警抓图数目
	this.dwCaptureInterval = "";	//抓图的间隔时间毫秒
	this.bySaveMode = "";			//抓图存放位置
}

var m_CaptureInfoXmlDoc;
function GetCaptureInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>CaptureImageCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetCaptureInfoRequest .onreadystatechange = function(){
			try{
				if(GetCaptureInfoRequest .readyState == 4 )
				{
					if(GetCaptureInfoRequest .status == 200 )
					{
						var CaptureInfoXML = GetCaptureInfoRequest .responseXML.documentElement;
						m_CaptureInfoXmlDoc = GetCaptureInfoRequest .responseXML.xml;
						
						if(typeof(CaptureInfoXML) == "object")
						{
							if(CaptureInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.sFTPServerIpAddr = CaptureInfoXML.getElementsByTagName("sFTPServerIpAddr")[0].nodeTypedValue;
								Obj.dwFTPServerPort = CaptureInfoXML.getElementsByTagName("dwFTPServerPort")[0].nodeTypedValue;
								Obj.sFTPCliUserName = CaptureInfoXML.getElementsByTagName("sFTPCliUserName")[0].nodeTypedValue;
								Obj.sFTPCliUserPass = CaptureInfoXML.getElementsByTagName("sFTPCliUserPass")[0].nodeTypedValue;
								Obj.byCaptureNum = CaptureInfoXML.getElementsByTagName("byCaptureNum")[0].nodeTypedValue;
								Obj.dwCaptureInterval = CaptureInfoXML.getElementsByTagName("dwCaptureInterval")[0].nodeTypedValue;
								Obj.bySaveMode = CaptureInfoXML.getElementsByTagName("bySaveMode")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetCaptureInfoRequest.abort();
						Obj.callbackfunction(Obj);						
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		GetCaptureInfoRequest .open(Obj.method, url, Obj.asynchrony);
		GetCaptureInfoRequest .send(g_xmlDoc);
	}	
}

function SetCaptureInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_CaptureInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_CaptureInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("sFTPServerIpAddr")[0].nodeTypedValue = Obj.sFTPServerIpAddr;
				g_xmlDoc.getElementsByTagName("dwFTPServerPort")[0].nodeTypedValue = Obj.dwFTPServerPort;
				g_xmlDoc.getElementsByTagName("sFTPCliUserName")[0].nodeTypedValue = Obj.sFTPCliUserName;
				g_xmlDoc.getElementsByTagName("sFTPCliUserPass")[0].nodeTypedValue = Obj.sFTPCliUserPass;
				g_xmlDoc.getElementsByTagName("byCaptureNum")[0].nodeTypedValue = Obj.byCaptureNum;
				g_xmlDoc.getElementsByTagName("dwCaptureInterval")[0].nodeTypedValue = Obj.dwCaptureInterval;
				g_xmlDoc.getElementsByTagName("bySaveMode")[0].nodeTypedValue = Obj.bySaveMode;
				
				GetCaptureInfoRequest .onreadystatechange = function(){
						if (GetCaptureInfoRequest .readyState == 4)
						{
							if (GetCaptureInfoRequest .status == 200)
							{
								var CaptureInfoXML = GetCaptureInfoRequest.responseXML.documentElement;
								
								if( CaptureInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetCaptureInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
					
				GetCaptureInfoRequest.open(Obj.method, url, Obj.asynchrony);
				GetCaptureInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											存储计划接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//定义GetRecordInfoRequest异步通信函数
try 
{
 	GetRecordInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetRecordInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetRecordInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetRecordInfoRequest = false;
	   }  
 	}
}

if (!GetRecordInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function StorageObj()
{
	this.byRecordType = 0;
	this.byStartHour = 0;
	this.byStartMin = 0;
	this.byStopHour = 0;
	this.byStopMin = 0;
}

function StorageSegmentObj()
{
	var ArrStorageTime = new Array(4);
	
	for(var m=0; m<4; m++)
	{
		ArrStorageTime[m] = new StorageObj();
	}
	
	this.Segment = ArrStorageTime;
}

function StorageTimeObj()
{
	var ArrStorageTime = new Array(7);
	
	for(var i=0; i<7; i++)
	{
		ArrStorageTime[i] = new StorageSegmentObj();
	}
	
	this.StorageDay = ArrStorageTime;
}

function StorageDayObj()
{
	this.byAllDayRecord = 0;
	this.byRecordType = 0;
}

function DayObj()
{
	var arrDay = new Array();
	for(var i=0; i<7; i++)
	{
		arrDay[i] = new StorageDayObj();
	}
	
	this.StorageDay = arrDay;
}

function StorageProjectObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	this.result = false;
	this.byEnableRecord = 0;		//设置存储模式 |是否启用存储
	this.byRedundancyRec = 0;		//是否冗余录像
	this.byAudioRec = 0;			//录像时复合流编码时是否记录音频数据
	this.byRecordStream = 0;		//录像码流为从码流
	this.dwRecordTime = 0;			//录象延时时间
	this.dwPreRecordTime = 0;		//录象预录时间
	this.dwRecorderDuration = 0;	//录像保存的最长时间
	this.struRecordSched = new StorageTimeObj(); 		//分时段存储
	this.struRecordAllDay = new DayObj();				//全天录像
}

var m_StorageProjectInfoXmlDoc;
function GetStorageProjectInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>RecordCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		
		GetRecordInfoRequest.onreadystatechange = function(){
			try{
				if (GetRecordInfoRequest.readyState == 4)
				{
					if (GetRecordInfoRequest.status == 200)
					{
						var RecordXml = GetRecordInfoRequest.responseXML.documentElement;
						m_StorageProjectInfoXmlDoc = GetRecordInfoRequest.responseXML.xml;
						
						if(typeof(RecordXml) == "object")
						{
							if(RecordXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.byEnableRecord = RecordXml.getElementsByTagName("byEnableRecord")[0].nodeTypedValue;
								Obj.byRedundancyRec = RecordXml.getElementsByTagName("byRedundancyRec")[0].nodeTypedValue;
								Obj.byAudioRec = RecordXml.getElementsByTagName("byAudioRec")[0].nodeTypedValue;
								Obj.byRecordStream = RecordXml.getElementsByTagName("byRecordStream")[0].nodeTypedValue;
								Obj.dwRecordTime = RecordXml.getElementsByTagName("dwRecordTime")[0].nodeTypedValue;
								Obj.dwPreRecordTime = RecordXml.getElementsByTagName("dwPreRecordTime")[0].nodeTypedValue;
								Obj.dwRecorderDuration = RecordXml.getElementsByTagName("dwRecorderDuration")[0].nodeTypedValue;
								
								for(var i=0; i<7; i++)
								{
									for(var j=0; j<4; j++)
									{
										Obj.struRecordSched.StorageDay[i].Segment[j].byRecordType = RecordXml.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStartHour = RecordXml.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStartMin = RecordXml.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStopHour = RecordXml.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStopMin = RecordXml.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[4].nodeTypedValue;
									}
									Obj.struRecordAllDay.StorageDay[i].byAllDayRecord = RecordXml.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[0].nodeTypedValue;
									Obj.struRecordAllDay.StorageDay[i].byRecordType = RecordXml.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[1].nodeTypedValue;
								}
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetRecordInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		GetRecordInfoRequest.open(Obj.method, url, Obj.asynchrony);
		GetRecordInfoRequest.send(g_xmlDoc);	
	}
}

function SetStorageProjectInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_StorageProjectInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_StorageProjectInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue 		= "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue 		= "0";
				
				g_xmlDoc.getElementsByTagName("byEnableRecord")[0].nodeTypedValue = Obj.byEnableRecord;
				g_xmlDoc.getElementsByTagName("byRedundancyRec")[0].nodeTypedValue = Obj.byRedundancyRec;
				g_xmlDoc.getElementsByTagName("byAudioRec")[0].nodeTypedValue = Obj.byAudioRec;
				g_xmlDoc.getElementsByTagName("byRecordStream")[0].nodeTypedValue = Obj.byRecordStream;
				g_xmlDoc.getElementsByTagName("dwRecordTime")[0].nodeTypedValue = Obj.dwRecordTime;
				g_xmlDoc.getElementsByTagName("dwPreRecordTime")[0].nodeTypedValue = Obj.dwPreRecordTime;
				g_xmlDoc.getElementsByTagName("dwRecorderDuration")[0].nodeTypedValue = Obj.dwRecorderDuration;
				
				for(var i=0; i<7; i++)
				{
					for(var j=0; j<4; j++)
					{
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byRecordType;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStartHour;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStartMin;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStopHour;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[4].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStopMin;
					}
					
					g_xmlDoc.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[0].nodeTypedValue = Obj.struRecordAllDay.StorageDay[i].byAllDayRecord;
					g_xmlDoc.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.struRecordAllDay.StorageDay[i].byRecordType;
				}
				
				GetRecordInfoRequest.onreadystatechange = function(){
					
						if(GetRecordInfoRequest.readyState == 4 )
						{
							if(GetRecordInfoRequest.status == 200 )
							{
								var RecordXml = GetRecordInfoRequest.responseXML.documentElement;
								if(RecordXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetRecordInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				GetRecordInfoRequest.open(Obj.method, url, Obj.asynchrony);
				GetRecordInfoRequest.send(g_xmlDoc);
			
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											系统配置接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义GetAlarmInfoRequest异步通信函数
try 
{
 	GetAlarmInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetAlarmInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetAlarmInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetAlarmInfoRequest = false;
	   }  
 	}
}

if (!GetAlarmInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function AlarmInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.byNormalRecoder = "";			//是否启用ftp录像
	this.byRecoderFileSize = "";		//录像文件大小
}

var m_AlarmInfoXmlDoc;
function GetAlarmInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>AlarmCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetAlarmInfoRequest.onreadystatechange = function(){
			try{
				if(GetAlarmInfoRequest.readyState == 4 )
				{
					if(GetAlarmInfoRequest.status == 200 )
					{
						var CaptureInfoXML = GetAlarmInfoRequest.responseXML.documentElement;
						m_AlarmInfoXmlDoc = GetAlarmInfoRequest.responseXML.xml;
						
						if(typeof(CaptureInfoXML) == "object")
						{
							if(CaptureInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.byNormalRecoder = CaptureInfoXML.getElementsByTagName("byNormalRecoder")[0].nodeTypedValue;
								Obj.byRecoderFileSize = CaptureInfoXML.getElementsByTagName("byRecoderFileSize")[0].nodeTypedValue;	
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetAlarmInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}catch(err)
			{Obj.result = false;}	
		};
		GetAlarmInfoRequest.open(Obj.method, url, Obj.asynchrony);
		GetAlarmInfoRequest.send(g_xmlDoc);
	}
}

function SetAlarmInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_AlarmInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_AlarmInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue 		= "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue 		= "0";
				
				g_xmlDoc.getElementsByTagName("byNormalRecoder")[0].nodeTypedValue = Obj.byNormalRecoder;
				g_xmlDoc.getElementsByTagName("byRecoderFileSize")[0].nodeTypedValue = Obj.byRecoderFileSize;
				
				GetAlarmInfoRequest.onreadystatechange = function(){
					
						if(GetAlarmInfoRequest.readyState == 4 )
						{
							if(GetAlarmInfoRequest.status == 200 )
							{
								var CaptureInfoXML = GetAlarmInfoRequest.responseXML.documentElement;
								
								if(CaptureInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetAlarmInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};	
				GetAlarmInfoRequest.open(Obj.method, url, Obj.asynchrony);
				GetAlarmInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											FTP信息接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

///////////////////////////////////////////////////////////////////////////////////////////////
//create the xmlhttp object

var FtpInfoRequest = false;
try
{
	FtpInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft) 
{
	try 
	{
		FtpInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
	} 
	catch (othermicrosoft) 
	{
		try 
		{
			FtpInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (failed) 
		{
			FtpInfoRequest = false;
		}  
	}
}
if (!FtpInfoRequest)
alert("Error initializing XMLHttpRequest!");
///////////////////////////////////////////////////////////////////////////////////////////

function FtpSegmentObj()
{
	this.byStartHour = 0;
	this.byStartMin = 0;
	this.byStopHour	 = 0;
	this.byStopMin = 0;
}

function FtpDayObj()
{
	var arrSegment = new Array();
	for(var i=0; i<4; i++)
	{
		arrSegment[i] = new FtpSegmentObj();
	}
	
	this.Segment = arrSegment;
}

function FtpTimeObj()
{
	var arrTime = new Array();
	for(var i=0; i<7; i++)
	{
		arrTime[i] = new FtpDayObj();
	}
	
	this.day = arrTime;
}

function FtpInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.byUseFTP = "";				//是否启用FTP服务器
	this.strFTPServerIpAddr = "";
	this.dwServerPort = "";			//服务器的端口，ftp默认2
	this.strFTPCliUserName = "";	//FTP服务器用户名
	this.strFTPCliUserPass = "";	//FTP服务器用户密码
	this.dwFTPRecordFileSize = "";	//记录文件的时间
	this.byEnableDirectory = "";	//是否启用指定目录存放 1--启用
	this.strDirectoryName = "";		//指定的存放目录
	this.struAlarmTime = new FtpTimeObj();
}

var m_FtpInfoXmlDoc;
function GetFtpInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>FTPCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		FtpInfoRequest.onreadystatechange = function(){
			try{
				if(FtpInfoRequest.readyState == 4 )
				{
					if(FtpInfoRequest.status == 200 )
					{
						var FtpInfoXML = FtpInfoRequest.responseXML.documentElement;
						m_FtpInfoXmlDoc = FtpInfoRequest.responseXML.xml;
						
						if(typeof(FtpInfoXML) == "object")
						{
							if(FtpInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								
								Obj.byUseFTP = FtpInfoXML.getElementsByTagName("byUseFTP")[0].nodeTypedValue;
								Obj.strFTPServerIpAddr = FtpInfoXML.getElementsByTagName("strFTPServerIpAddr")[0].nodeTypedValue;
								Obj.dwServerPort = FtpInfoXML.getElementsByTagName("dwServerPort")[0].nodeTypedValue;
								Obj.strFTPCliUserName = FtpInfoXML.getElementsByTagName("strFTPCliUserName")[0].nodeTypedValue;
								Obj.strFTPCliUserPass = FtpInfoXML.getElementsByTagName("strFTPCliUserPass")[0].nodeTypedValue;
								Obj.dwFTPRecordFileSize = FtpInfoXML.getElementsByTagName("dwFTPRecordFileSize")[0].nodeTypedValue;
								Obj.byEnableDirectory = FtpInfoXML.getElementsByTagName("byEnableDirectory")[0].nodeTypedValue;
								Obj.strDirectoryName = FtpInfoXML.getElementsByTagName("strDirectoryName")[0].nodeTypedValue;
								
								/*for(i=0; i<7; i++)
								{
									for(var j=0; j<4; j++)
									{
										Obj.struAlarmTime.day[i].Segment[j].byStartHour = FtpInfoXML.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStartMin = FtpInfoXML.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStopHour = FtpInfoXML.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue;
										Obj.struAlarmTime.day[i].Segment[j].byStopMin = FtpInfoXML.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue;
									}
								}*/
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}

						FtpInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		FtpInfoRequest.open(Obj.method, url, Obj.asynchrony);
		FtpInfoRequest.send(g_xmlDoc);
	}
}

function SetFtpInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_FtpInfoXmlDoc) == "string")
	{	
		g_xmlDoc = LoadXML("str", m_FtpInfoXmlDoc);
		
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue 		= "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue 		= "0";
				
				g_xmlDoc.getElementsByTagName("byUseFTP")[0].nodeTypedValue = Obj.byUseFTP;
				g_xmlDoc.getElementsByTagName("strFTPServerIpAddr")[0].nodeTypedValue = Obj.strFTPServerIpAddr;
				g_xmlDoc.getElementsByTagName("dwServerPort")[0].nodeTypedValue = Obj.dwServerPort;
				g_xmlDoc.getElementsByTagName("strFTPCliUserName")[0].nodeTypedValue = Obj.strFTPCliUserName;
				g_xmlDoc.getElementsByTagName("strFTPCliUserPass")[0].nodeTypedValue = Obj.strFTPCliUserPass;
				g_xmlDoc.getElementsByTagName("dwFTPRecordFileSize")[0].nodeTypedValue = Obj.dwFTPRecordFileSize;
				g_xmlDoc.getElementsByTagName("byEnableDirectory")[0].nodeTypedValue = Obj.byEnableDirectory;
				g_xmlDoc.getElementsByTagName("strDirectoryName")[0].nodeTypedValue = Obj.strDirectoryName;
				
				/*for(i=0; i<7; i++)
				{
					for(var j=0; j<4; j++)
					{
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStartHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStartMin;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStopHour;
						g_xmlDoc.getElementsByTagName("struAlarmTime")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue = Obj.struAlarmTime.day[i].Segment[j].byStopMin;
					}
				}*/
				
				FtpInfoRequest.onreadystatechange = function(){
					
						if(FtpInfoRequest.readyState == 4 )
						{
							if(FtpInfoRequest.status == 200 )
							{
								var FtpInfoXML = FtpInfoRequest.responseXML.documentElement;
								
								if(FtpInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								FtpInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				FtpInfoRequest.open(Obj.method, url, Obj.asynchrony);
				FtpInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											FTP录像接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

///////////////////////////////////////////////////////////////////////////////////////////////
//create the xmlhttp object

var FtpRecordInfoRequest = false;
try
{
	FtpRecordInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft) 
{
	try 
	{
		FtpRecordInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
	} 
	catch (othermicrosoft) 
	{
		try 
		{
			FtpRecordInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} 
		catch (failed) 
		{
			FtpRecordInfoRequest = false;
		}  
	}
}
if (!FtpRecordInfoRequest)
alert("Error initializing XMLHttpRequest!");
///////////////////////////////////////////////////////////////////////////////////////////


function FtpStorageObj()
{
	this.byRecordType = 0;
	this.byStartHour = 0;
	this.byStartMin = 0;
	this.byStopHour = 0;
	this.byStopMin = 0;
}

function FtpStorageSegmentObj()
{
	var ArrStorageTime = new Array(4);
	
	for(var m=0; m<4; m++)
	{
		ArrStorageTime[m] = new FtpStorageObj();
	}
	
	this.Segment = ArrStorageTime;
}

function FtpStorageTimeObj()
{
	var ArrStorageTime = new Array(7);
	
	for(var i=0; i<7; i++)
	{
		ArrStorageTime[i] = new FtpStorageSegmentObj();
	}
	
	this.StorageDay = ArrStorageTime;
}

function FtpStorageDayObj()
{
	this.byAllDayRecord = 0;
	this.byRecordType = 0;
}

function FtpDayObj()
{
	var arrDay = new Array();
	for(var i=0; i<7; i++)
	{
		arrDay[i] = new FtpStorageDayObj();
	}
	
	this.StorageDay = arrDay;
}

function FtpRecordInfoObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	this.result = false;
	
	this.struRecordSched = new FtpStorageTimeObj(); 		//分时段存储
	this.struRecordAllDay = new FtpDayObj();				//全天录像
	this.dwRecordTime = "0";								//录象延时时间(单位:秒)
	this.dwPreRecordTime = "0";								//预录时间(单位:秒)
	this.byAudioRec = "1";									//录像时复合流编码时是否记录音频数据
	this.byRecordStream = "0";								//录像码流为从码流
	this.byEnableRecord = "1";								//是否启用录像
}

var m_FtpRecordInfoXmlDoc;
function GetFtpRecordInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>FtpRecordCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		FtpRecordInfoRequest.onreadystatechange = function(){
			try{
				if(FtpRecordInfoRequest.readyState == 4 )
				{
					if(FtpRecordInfoRequest.status == 200 )
					{
						var FtpRecordInfoXML = FtpRecordInfoRequest.responseXML.documentElement;
						m_FtpRecordInfoXmlDoc = FtpRecordInfoRequest.responseXML.xml;
						
						if(typeof(FtpRecordInfoXML) == "object")
						{
							if(FtpRecordInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								//alert(m_FtpRecordInfoXmlDoc);
								Obj.dwRecordTime = FtpRecordInfoXML.getElementsByTagName("dwRecordTime")[0].nodeTypedValue;
								Obj.dwPreRecordTime = FtpRecordInfoXML.getElementsByTagName("dwPreRecordTime")[0].nodeTypedValue;
								Obj.byAudioRec = FtpRecordInfoXML.getElementsByTagName("byAudioRec")[0].nodeTypedValue;
								Obj.byRecordStream = FtpRecordInfoXML.getElementsByTagName("byRecordStream")[0].nodeTypedValue;
								Obj.byEnableRecord = FtpRecordInfoXML.getElementsByTagName("byEnableRecord")[0].nodeTypedValue;
								
								for(var i=0; i<7; i++)
								{
									for(var j=0; j<4; j++)
									{
										Obj.struRecordSched.StorageDay[i].Segment[j].byRecordType = FtpRecordInfoXML.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStartHour = FtpRecordInfoXML.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStartMin = FtpRecordInfoXML.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStopHour = FtpRecordInfoXML.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue;
										Obj.struRecordSched.StorageDay[i].Segment[j].byStopMin = FtpRecordInfoXML.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[4].nodeTypedValue;
									}
									
									Obj.struRecordAllDay.StorageDay[i].byAllDayRecord = FtpRecordInfoXML.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[0].nodeTypedValue;
									Obj.struRecordAllDay.StorageDay[i].byRecordType = FtpRecordInfoXML.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[1].nodeTypedValue;
								}
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						FtpRecordInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		
		FtpRecordInfoRequest.open(Obj.method, url, Obj.asynchrony);
		FtpRecordInfoRequest.send(g_xmlDoc);
	}
}


function SetFtpRecordInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_FtpRecordInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_FtpRecordInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.CurrentChannelId;
				g_xmlDoc.getElementsByTagName("Header/cmd_type")[0].nodeTypedValue 		= "set";
				g_xmlDoc.getElementsByTagName("Header/err_flag")[0].nodeTypedValue 		= "0";
				
				g_xmlDoc.getElementsByTagName("dwRecordTime")[0].nodeTypedValue = Obj.dwRecordTime;
				g_xmlDoc.getElementsByTagName("dwPreRecordTime")[0].nodeTypedValue = Obj.dwPreRecordTime;
				g_xmlDoc.getElementsByTagName("byAudioRec")[0].nodeTypedValue = Obj.byAudioRec;
				g_xmlDoc.getElementsByTagName("byRecordStream")[0].nodeTypedValue = Obj.byRecordStream;
				g_xmlDoc.getElementsByTagName("byEnableRecord")[0].nodeTypedValue = Obj.byEnableRecord;
				
				for(var i=0; i<7; i++)
				{
					for(var j=0; j<4; j++)
					{
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[0].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byRecordType;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[1].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStartHour;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[2].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStartMin;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[3].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStopHour;
						g_xmlDoc.getElementsByTagName("struRecordSched")[0].childNodes[i].childNodes[j].childNodes[4].nodeTypedValue = Obj.struRecordSched.StorageDay[i].Segment[j].byStopMin;
					}
					
					g_xmlDoc.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[0].nodeTypedValue = Obj.struRecordAllDay.StorageDay[i].byAllDayRecord;
					g_xmlDoc.getElementsByTagName("struRecordAllDay")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.struRecordAllDay.StorageDay[i].byRecordType;
				}
				
				//alert(g_xmlDoc.xml);
				FtpRecordInfoRequest.onreadystatechange = function(){
						if(FtpRecordInfoRequest.readyState == 4 )
						{
							if(FtpRecordInfoRequest.status == 200 )
							{
								var FtpRecordInfoXml = FtpRecordInfoRequest.responseXML.documentElement;
								if(FtpRecordInfoXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								FtpRecordInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				FtpRecordInfoRequest.open(Obj.method, url, Obj.asynchrony);
				FtpRecordInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											用户信息接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义UserInfoRequest异步通信函数
try 
{
 	UserInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	UserInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		UserInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		UserInfoRequest = false;
	   }  
 	}
}

if (!UserInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
//////////////////////////////////////////////////////////////////////////////////////

function userObj()
{
	this.szUserName = 0;
	this.szPassword = 0;
	this.szMotifyPassword = 0;
	this.wRemoteLevel = 0;
	this.wRemoteLoginNum = 0;
	this.dwRemoteRightHi = 0;
	this.dwRemoteRightLo = 0;
	this.dwUserIP = 0;
	this.byMACAddr = 0;
}

function UserInfoObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.CurrentChannelId = 0;		//当前选择的通道id
	
	var arrStruUser = new Array(16);
	for(var i=0; i<16; i++)
	{
		arrStruUser[i] = new userObj();
	}
	
	this.result = false;
	this.iUserCount = 0;			//用户总数
	this.struUserInfo = arrStruUser;
}

function GetUserInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>EnumUserCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>'+ Obj.CurrentChannelId +'</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		UserInfoRequest.onreadystatechange = function(){
			try{
				if (UserInfoRequest.readyState == 4)
				{
					if (UserInfoRequest.status == 200)
					{
						var UserInfoXml = UserInfoRequest.responseXML.documentElement;
						
						if(typeof(UserInfoXml) == "object")
						{
							if(UserInfoXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.iUserCount = UserInfoXml.getElementsByTagName("iUserCount")[0].nodeTypedValue;		//用户总数
								
								for(var i=0; i<Obj.iUserCount; i++ )
								{
									Obj.struUserInfo[i].szUserName = UserInfoXml.getElementsByTagName("struUserInfo")[0].childNodes[i].childNodes[0].nodeTypedValue;
									Obj.struUserInfo[i].szPassword = UserInfoXml.getElementsByTagName("struUserInfo")[0].childNodes[i].childNodes[1].nodeTypedValue;
									Obj.struUserInfo[i].dwRemoteRightLo = UserInfoXml.getElementsByTagName("struUserInfo")[0].childNodes[i].childNodes[6].nodeTypedValue;								
								}
							}else
							{Obj.result = false;}
						}else
						{Obj.result = false;}
					}else
					{Obj.result = false;}
				}else
				{Obj.result = false;}
			}catch(err)
			{Obj.result = false;}	
		};
		UserInfoRequest.open(Obj.method, url, Obj.asynchrony);
		UserInfoRequest.send(g_xmlDoc);
	}else
	{Obj.result = false;}
	
	Obj.callbackfunction(Obj);
	UserInfoRequest.abort();
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											用户设置接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
///////////////////////////////////////////////////////////////////////////////////////////////
try 
{
 	UserOperateRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
 try
 {
   UserOperateRequest = new ActiveXObject("Msxml2.XMLHTTP");
 } 
 catch (othermicrosoft) 
 {
   try
   {
	 	UserOperateRequest = new ActiveXObject("Microsoft.XMLHTTP");
   }
   catch (failed) 
   {
	 	UserOperateRequest = false;
   }  
 }
}

if (!UserOperateRequest)
{
	alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function UserCfgObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.operate = 0;				//操作ID
	this.szUserName = 0;
	this.szPassword = 0;
	this.szMotifyPassword = 0;
	this.wRemoteLevel = 0;
	this.wRemoteLoginNum = 0;
	this.dwRemoteRightHi = 0;
	this.dwRemoteRightLo = 0;
	this.dwUserIP = 0;
	this.byMACAddr = 0;
	
}

function SetUserCfg(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>UserCfg</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag></Header><body><tmUserInfo_t><szUserName>1</szUserName><szPassword>2</szPassword><szMotifyPassword>3</szMotifyPassword><dwRemoteRightLo>7</dwRemoteRightLo></tmUserInfo_t></body></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			g_xmlDoc.getElementsByTagName("cmd")[0].nodeTypedValue = Obj.operate;
			g_xmlDoc.getElementsByTagName("szUserName")[0].nodeTypedValue = Obj.szUserName;
			g_xmlDoc.getElementsByTagName("szPassword")[0].nodeTypedValue = Obj.szPassword;
			g_xmlDoc.getElementsByTagName("szMotifyPassword")[0].nodeTypedValue = Obj.szMotifyPassword;
			g_xmlDoc.getElementsByTagName("dwRemoteRightLo")[0].nodeTypedValue = Obj.dwRemoteRightLo;
			
			UserOperateRequest.onreadystatechange = function(){
					if (UserOperateRequest.readyState == 4)
					{
						if (UserOperateRequest.status == 200)
						{
							var UserOperateXml = UserOperateRequest.responseXML.documentElement;
							Obj.result = UserOperateXml.getElementsByTagName("err_flag")[0].nodeTypedValue;
						}else
						{Obj.result = -1;}
					}else
					{Obj.result = -1;}
				};
			UserOperateRequest.open(Obj.method, url, Obj.asynchrony);
			UserOperateRequest.send(g_xmlDoc);
		}catch(err)
		{Obj.result = -1;}
	}else
	{Obj.result = -1;}
	
	Obj.callbackfunction(Obj);
	UserOperateRequest.abort();
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											时间设置接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

//////////////////////////////////////////////////////////////////////////
//定义GetTimeInfoRequest异步通信函数
try 
{
 	GetTimeInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetTimeInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetTimeInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetTimeInfoRequest = false;
	   }  
 	}
}

if (!GetTimeInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function TimeInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.wYear = "";
	this.wMonth = "";
	this.wDay = "";
	this.wDayOfWeek = "";
	this.wHour = "";
	this.wMinute = "";
	this.wSecond = "";
	this.wTimeZone = "";
	this.iDayLightTime = "";
}

var m_TimeInfoXmlDoc;
function GetTimeInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>TimeCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		GetTimeInfoRequest.onreadystatechange = function(){
			try{
				if(GetTimeInfoRequest.readyState == 4 )
				{
					if(GetTimeInfoRequest.status == 200 )
					{
						var TimeInfoXML = GetTimeInfoRequest.responseXML.documentElement;
						m_TimeInfoXmlDoc = GetTimeInfoRequest.responseXML.xml;
						
						if(typeof(TimeInfoXML) == "object")
						{
							if(TimeInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.wYear = TimeInfoXML.getElementsByTagName("wYear")[0].nodeTypedValue;
								Obj.wMonth = TimeInfoXML.getElementsByTagName("wMonth")[0].nodeTypedValue;
								Obj.wDay = TimeInfoXML.getElementsByTagName("wDay")[0].nodeTypedValue;
								Obj.wDayOfWeek = TimeInfoXML.getElementsByTagName("wDayOfWeek")[0].nodeTypedValue;
								Obj.wHour = TimeInfoXML.getElementsByTagName("wHour")[0].nodeTypedValue;
								Obj.wMinute = TimeInfoXML.getElementsByTagName("wMinute")[0].nodeTypedValue;
								Obj.wSecond = TimeInfoXML.getElementsByTagName("wSecond")[0].nodeTypedValue;
								Obj.wTimeZone = TimeInfoXML.getElementsByTagName("wTimeZone")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						GetTimeInfoRequest.abort();
						Obj.callbackfunction(Obj);
						
					}
				}
			}catch(err)
			{Obj.result = false;}
		};	
		
		GetTimeInfoRequest.open(Obj.method, url, Obj.asynchrony);
		GetTimeInfoRequest.send(g_xmlDoc);
	}	
}

function SetTimeInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_TimeInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_TimeInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("wYear")[0].nodeTypedValue = Obj.wYear;
				g_xmlDoc.getElementsByTagName("wMonth")[0].nodeTypedValue = Obj.wMonth;
				g_xmlDoc.getElementsByTagName("wDay")[0].nodeTypedValue = Obj.wDay;
				g_xmlDoc.getElementsByTagName("wDayOfWeek")[0].nodeTypedValue = Obj.wDayOfWeek;
				g_xmlDoc.getElementsByTagName("wHour")[0].nodeTypedValue = Obj.wHour;
				g_xmlDoc.getElementsByTagName("wMinute")[0].nodeTypedValue = Obj.wMinute;
				g_xmlDoc.getElementsByTagName("wSecond")[0].nodeTypedValue = Obj.wSecond;
				g_xmlDoc.getElementsByTagName("wTimeZone")[0].nodeTypedValue = Obj.wTimeZone;
				g_xmlDoc.getElementsByTagName("iDayLightTime")[0].nodeTypedValue = Obj.iDayLightTime;
				
				GetTimeInfoRequest.onreadystatechange = function(){
						if(GetTimeInfoRequest.readyState == 4 )
						{
							if(GetTimeInfoRequest.status == 200 )
							{
								var TimeInfoXML = GetTimeInfoRequest.responseXML.documentElement;
								
								if(TimeInfoXML.getElementsByTagName("err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								GetTimeInfoRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};	
				GetTimeInfoRequest.open(Obj.method, url, Obj.asynchrony);
				GetTimeInfoRequest.send(g_xmlDoc);
			}catch(err)
			{Obj.result = false;}
		}
	}	
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											参数保存接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
////////////////////////////////////保存参数/////////////////////////////////////////////
try 
{
 	SaveConfigRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	SaveConfigRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		SaveConfigRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		SaveConfigRequest = false;
	   }  
 	}
}

if (!SaveConfigRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
//////////////////////////////////////////////////////////////////////////////////////////

function SaveConfigObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;

}

function SetSaveConfig(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>SaveConfig</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			SaveConfigRequest.onreadystatechange = function(){
					if (SaveConfigRequest.readyState == 4)
					{
						if (SaveConfigRequest.status == 200)
						{
							var SaveConfigXml = SaveConfigRequest.responseXML.documentElement;
							
							if( SaveConfigXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
							}else
							{Obj.result = false;}
						}else
						{Obj.result = false;}
					}else
					{Obj.result = false;}
				};	
			SaveConfigRequest.open(Obj.method, url, Obj.asynchrony);
			SaveConfigRequest.send(g_xmlDoc);
		}catch(err)
		{Obj.result = false;}
	}else
	{Obj.result = false;}
	
	Obj.callbackfunction(Obj);
	SaveConfigRequest.abort();
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											设备重启接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////重启参数/////////////////////////////////////////////
try 
{
 	RebootRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	RebootRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		RebootRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		RebootRequest = false;
	   }  
 	}
}

if (!RebootRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
//////////////////////////////////////////////////////////////////////////////////////////

function RebootObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
}

function SetReboot(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>Reset</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			RebootRequest.onreadystatechange = function(){
					if (RebootRequest.readyState == 4)
					{
						if (RebootRequest.status == 200)
						{
							var RebootXml = RebootRequest.responseXML.documentElement;
							
							if( RebootXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
							}else
							{Obj.result = false;}
						}else
						{Obj.result = false;}
					}else
					{Obj.result = false;}
				};
			RebootRequest.open(Obj.method, url, Obj.asynchrony);
			RebootRequest.send(g_xmlDoc);
		}catch(err)
		{Obj.result = false;}
	}else
	{Obj.result = false;}
	
	Obj.callbackfunction(Obj);
	RebootRequest.abort();
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											设备关机接口  					   			              ==
==										 															  ==
==										2012.07.12	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////关机参数/////////////////////////////////////////////
try 
{
 	ShutdownRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	ShutdownRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		ShutdownRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		ShutdownRequest = false;
	   }  
 	}
}

if (!ShutdownRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
//////////////////////////////////////////////////////////////////////////////////////////

function ShutdownObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
}

function SetShutdown(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>Shutdown</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			ShutdownRequest.onreadystatechange = function(){
					if (ShutdownRequest.readyState == 4)
					{
						if (ShutdownRequest.status == 200)
						{
							var RebootXml = ShutdownRequest.responseXML.documentElement;
							
							if( RebootXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
							}else
							{Obj.result = false;}
						}else
						{Obj.result = false;}
					}else
					{Obj.result = false;}
				};
			ShutdownRequest.open(Obj.method, url, Obj.asynchrony);
			ShutdownRequest.send(g_xmlDoc);
		}catch(err)
		{Obj.result = false;}
	}else
	{Obj.result = false;}
	
	Obj.callbackfunction(Obj);
	ShutdownRequest.abort();
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											回复出厂设置  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/
////////////////////////////////////恢复出厂设置/////////////////////////////////////////////
try 
{
 	RestoreRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	RestoreRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		RestoreRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		RestoreRequest = false;
	   }  
 	}
}

if (!RestoreRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
//////////////////////////////////////////////////////////////////////////////////////////

function RestoreObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
}

function SetRestore(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>Restore</cmd><cmd_type>set</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			RestoreRequest.onreadystatechange = function(){
					if (RestoreRequest.readyState == 4)
					{
						if (RestoreRequest.status == 200)
						{
							var SetRestoreXml = RestoreRequest.responseXML.documentElement;
							
							if( SetRestoreXml.getElementsByTagName("err_flag")[0].nodeTypedValue == 0 )
							{
								Obj.result = true;
							}else
							{Obj.result = false;}
						}else
						{Obj.result = false;}
					}else
					{Obj.result = false;}
				};
			RestoreRequest.open(Obj.method, url, Obj.asynchrony);
			RestoreRequest.send(g_xmlDoc);
		}catch(err)
		{Obj.result = false;}
	}else
	{Obj.result = false;}
	
	Obj.callbackfunction(Obj);
	RestoreRequest.abort();
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											磁盘信息接口  					   			              ==
==										 															  ==
==										2011.05.03	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

///////////////////////////////////////////////////////////////////////////////////////////////////
//定义DriveInfoRequest异步通信函数
try 
{
 	DriveInfoRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	DriveInfoRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		DriveInfoRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		DriveInfoRequest = false;
	   }  
 	}
}

if (!DriveInfoRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
  

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function DriveObj()
{
	this.byInit = 0;
	this.byReset = 0;
	this.dwDriveType = 0;
	this.dwTotalSpace = 0;
	this.dwUsefullSpace = 0;
	this.byDiskID = 0;
}

function DiskObj()
{
	var arrDrive = new Array();
	
	for(var i=0; i<16; i++)
	{
		arrDrive[i] = new DriveObj();		
	}
	
	this.Drive = arrDrive;
}

function DriveInfoObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	this.channle = 0;
	
	this.result = false;
	this.dwDriveCount = 0;
	this.struDisk = new DiskObj();
}

var m_DriveInfoXmlDoc;
function GetDriveInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>DriveCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		DriveInfoRequest.onreadystatechange = function(){
		
				if (DriveInfoRequest.readyState == 4)
				{
					if (DriveInfoRequest.status == 200)
					{
						var DriveInfoXml = DriveInfoRequest.responseXML.documentElement;
						m_DriveInfoXmlDoc = DriveInfoRequest.responseXML.xml;
						
						if(typeof(DriveInfoXml) == "object")
						{
							if(DriveInfoXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.dwDriveCount = DriveInfoXml.getElementsByTagName("dwDriveCount")[0].nodeTypedValue;
								
								for(var i=0; i<Obj.dwDriveCount; i++ )
								{
									Obj.struDisk.Drive[i].byInit = DriveInfoXml.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[0].nodeTypedValue;
									Obj.struDisk.Drive[i].dwDriveType = DriveInfoXml.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[2].nodeTypedValue;
									Obj.struDisk.Drive[i].dwTotalSpace = DriveInfoXml.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[3].nodeTypedValue;
									Obj.struDisk.Drive[i].dwUsefullSpace = DriveInfoXml.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[4].nodeTypedValue;
									Obj.struDisk.Drive[i].byReset = DriveInfoXml.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[1].nodeTypedValue;
									Obj.struDisk.Drive[i].byDiskID = DriveInfoXml.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[5].nodeTypedValue;
								}
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						DriveInfoRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			
		};
		DriveInfoRequest.open(Obj.method, url, Obj.asynchrony);
		DriveInfoRequest.send(g_xmlDoc);
	}
}

function SetDriveInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_DriveInfoXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_DriveInfoXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
			try{
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				for(var i=0; i<Obj.dwDriveCount; i++ )
				{
					g_xmlDoc.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[0].nodeTypedValue = Obj.struDisk.Drive[i].byInit;
					g_xmlDoc.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[2].nodeTypedValue = Obj.struDisk.Drive[i].dwDriveType;
					g_xmlDoc.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[3].nodeTypedValue = Obj.struDisk.Drive[i].dwTotalSpace;
					g_xmlDoc.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[4].nodeTypedValue = Obj.struDisk.Drive[i].dwUsefullSpace;
					g_xmlDoc.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[1].nodeTypedValue = Obj.struDisk.Drive[i].byReset;
					g_xmlDoc.getElementsByTagName("struDisk")[0].childNodes[i].childNodes[5].nodeTypedValue = Obj.struDisk.Drive[i].byDiskID;
				}
				
				DriveInfoRequest.onreadystatechange = function(){
						if (DriveInfoRequest.readyState == 4)
						{
							if (DriveInfoRequest.status == 200)
							{
								var DriveInfoXml = DriveInfoRequest.responseXML.documentElement;
								//alert(DriveInfoXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue);
								if(DriveInfoXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								Obj.callbackfunction(Obj);
								DriveInfoRequest.abort();
							}
						}
					};
				DriveInfoRequest.open(Obj.method, url, Obj.asynchrony);
				DriveInfoRequest.send(g_xmlDoc);
			}
			catch(err)
			{
				Obj.result = false;
			}
		}
	}
}

/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==											视频显示位置接口  				   			              ==
==										 															  ==
==										2011.08.12	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/


////////////////////////////////////////////////////////////////////////////////////////////
//定义VideoPositionRequest异步通信函数
try 
{
 	VideoPositionRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	VideoPositionRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		VideoPositionRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		VideoPositionRequest = false;
	   }  
 	}
}

if (!VideoPositionRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//tmScreenPostion_t
function VideoPositionObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.dwPositionX = "";			//视频显示区域的x坐标
	this.dwPositionY = "";			//视频显示区域的Y坐标
	this.dwEnableVGA = "";			//启用VGA输出
	this.szStandName = 0;			//VGA输出分辨率大小
	this.dwEnableSwitch = true; 	//启用视频循切
	this.dwSwitchTime = 30; 		//启用视频循切时间间隔(秒)
	this.dwEnableDecoderOutput = 1; //是否启用解码输出
	this.dwOSDPositionX = 10;		//通道叠加位置x
	this.dwOSDPositionY = 10;		//通道叠加位置Y
	this.dwEnableOSD = 0;			//是否启用通道名叠加
}

var m_VideoPositionXmlDoc;
function GetVideoPositionInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>VideoPositionCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		VideoPositionRequest.onreadystatechange = function(){
			try{
				if (VideoPositionRequest.readyState == 4)
				{
					if (VideoPositionRequest.status == 200)
					{
						var VideoPositionXml = VideoPositionRequest.responseXML.documentElement;
						m_VideoPositionXmlDoc = VideoPositionRequest.responseXML.xml;
						
						if(typeof(VideoPositionXml) == "object")
						{
							if(VideoPositionXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
								Obj.dwPositionX = VideoPositionXml.getElementsByTagName("dwPositionX")[0].nodeTypedValue;
								Obj.dwPositionY = VideoPositionXml.getElementsByTagName("dwPositionY")[0].nodeTypedValue;
								Obj.dwEnableVGA = VideoPositionXml.getElementsByTagName("dwEnableVGA")[0].nodeTypedValue;
								Obj.szStandName = VideoPositionXml.getElementsByTagName("szStandName")[0].nodeTypedValue;
								Obj.dwSwitchTime = VideoPositionXml.getElementsByTagName("dwSwitchTime")[0].nodeTypedValue;
								Obj.dwEnableSwitch = VideoPositionXml.getElementsByTagName("dwEnableSwitch")[0].nodeTypedValue;
								Obj.dwEnableDecoderOutput = VideoPositionXml.getElementsByTagName("dwEnableDecoderOutput")[0].nodeTypedValue;
								Obj.dwOSDPositionX = VideoPositionXml.getElementsByTagName("dwOSDPositionX")[0].nodeTypedValue;
								Obj.dwOSDPositionY = VideoPositionXml.getElementsByTagName("dwOSDPositionY")[0].nodeTypedValue;
								Obj.dwEnableOSD = VideoPositionXml.getElementsByTagName("dwEnableOSD")[0].nodeTypedValue;
							}
							else
							{
								Obj.result = false;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						VideoPositionRequest.abort();
						Obj.callbackfunction(Obj);
					}
				}
			}
			catch(err)
			{
				Obj.result = false;
			}	
		};
		VideoPositionRequest.open(Obj.method, url, Obj.asynchrony);
		VideoPositionRequest.send(g_xmlDoc);
	}
}

function SetVideoPositionInfo(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	if(typeof(m_VideoPositionXmlDoc) == "string")
	{
		g_xmlDoc = LoadXML("str", m_VideoPositionXmlDoc);
		if( typeof(g_xmlDoc) == "object" )
		{
				
				g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "set";
				g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
				
				g_xmlDoc.getElementsByTagName("dwPositionX")[0].nodeTypedValue = Obj.dwPositionX;
				g_xmlDoc.getElementsByTagName("dwPositionY")[0].nodeTypedValue = Obj.dwPositionY;
				g_xmlDoc.getElementsByTagName("dwEnableVGA")[0].nodeTypedValue = Obj.dwEnableVGA;
				g_xmlDoc.getElementsByTagName("szStandName")[0].nodeTypedValue = Obj.szStandName;
				g_xmlDoc.getElementsByTagName("dwEnableSwitch")[0].nodeTypedValue = Obj.dwEnableSwitch;
				g_xmlDoc.getElementsByTagName("dwSwitchTime")[0].nodeTypedValue = Obj.dwSwitchTime;
				g_xmlDoc.getElementsByTagName("dwEnableDecoderOutput")[0].nodeTypedValue = Obj.dwEnableDecoderOutput;
				g_xmlDoc.getElementsByTagName("dwOSDPositionX")[0].nodeTypedValue = Obj.dwOSDPositionX;
				g_xmlDoc.getElementsByTagName("dwOSDPositionY")[0].nodeTypedValue = Obj.dwOSDPositionY;
				g_xmlDoc.getElementsByTagName("dwEnableOSD")[0].nodeTypedValue = Obj.dwEnableOSD;
				
				VideoPositionRequest.onreadystatechange = function(){
						if (VideoPositionRequest.readyState == 4)
						{
							if (VideoPositionRequest.status == 200)
							{
								var VideoPositionXml = VideoPositionRequest.responseXML.documentElement;
								if(VideoPositionXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
								{
									Obj.result = true;
								}
								else
								{
									Obj.result = false;
								}
								
								VideoPositionRequest.abort();
								Obj.callbackfunction(Obj);
							}
						}
					};
				VideoPositionRequest.open(Obj.method, url, Obj.asynchrony);
				VideoPositionRequest.send(g_xmlDoc);
			
		}
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==												心跳包接口	  					   			              ==
==										 															  ==
==										2011.07.29	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

///////////////////////////////////////////////////////////////////////////////////////////////////
//定义DriveInfoRequest异步通信函数
try 
{
	CheckServiceLiveRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
try
{
	CheckServiceLiveRequest = new ActiveXObject("Msxml2.XMLHTTP");
} 
catch (othermicrosoft) 
{
	   try 
	   {
		   CheckServiceLiveRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		   CheckServiceLiveRequest = false;
	   }  
	}
}

if (!CheckServiceLiveRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}

function ServiceLiveObj()
{
	this.callbackfunction = function(){};		//回调函数名
	this.method = "POST";			//AJAX发送模式
	this.asynchrony = true;		//是否异步  true-异步 
	this.username = "";
	this.password = "";
	
	this.result = false;
}

function CheckServiceLive(Obj)
{
	var sDate = new Date();	
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8" ?><Envelope><Header><cmd>ServiceLiveCfg</cmd><cmd_type>Get</cmd_type><err_flag>0</err_flag></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	if( typeof(g_xmlDoc) == "object" )
	{
		try{
			CheckServiceLiveRequest.onreadystatechange = function(){
					if (CheckServiceLiveRequest.readyState == 4)
					{
						if (CheckServiceLiveRequest.status == 200)
						{
							var ServiceLiveXml = CheckServiceLiveRequest.responseXML.documentElement;
							if(ServiceLiveXml.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
							{
								Obj.result = true;
							}else
							{Obj.result = false;}
							
							Obj.callbackfunction(Obj);
							CheckServiceLiveRequest.abort();
						}
						else
						{
							Obj.result = false;
						}
					}
					else
					{
						Obj.result = false;
					}
				};
			CheckServiceLiveRequest.open(Obj.method, url, Obj.asynchrony);
			CheckServiceLiveRequest.send(g_xmlDoc);
		}
		catch(err)
		{
			Obj.result = false;
		}
	}
	else
	{
		Obj.result = false;
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==												获取日志接口					   			              ==
==										 															  ==
==										2011.07.29	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取日志信息/////////////////////////////////////////////
try 
{
 	GetLogRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetLogRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetLogRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetLogRequest = false;
	   }  
 	}
}

if (!GetLogRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function LogCfgObj()
{
	this.sLogTime = "";				//时间
	this.sUserName = "";			//用户名
	this.sAddress = "";				//客户端IP
	this.byUserLoginType = "";		//用户登录方式0-本地，1-网络
	this.byMajorType = "";			//主类型 1-报警; 2-异常; 3-操作; 0xff-全部
	this.byMinorType = "";			//次类型 0-全部;
	this.sInfo = "";				//日志内容
}

function LogInfoObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	this.channel = 0;
	
	this.LogNums = 0;
	this.result = false;
	var logcfg = new Array(10000);
	for(var i=0; i<logcfg.length; i++)
	{
		logcfg[i] = new LogCfgObj();
	}
	this.loginfo = logcfg;
}

//获取日志信息
function GetLogInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="UTF-8"?><Envelope><Header><cmd>EnumLogCfg</cmd><cmd_type>get</cmd_type><err_flag>1</err_flag><channel>0</channel></Header><body><tmLogInfo_t><LogNums>0</LogNums><log><sLogTime>2010-09-27|11:09-13:20</sLogTime><sUserName>0</sUserName><sAddress>0</sAddress><byUserLoginType>0</byUserLoginType><byMajorType>1</byMajorType><byMinorType>0</byMinorType><sInfo>0</sInfo></log></tmLogInfo_t></body></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	//g_xmlDoc = LoadXML("file", "EnumLogCfg.xml");
	
	if( typeof(g_xmlDoc) == "object" )
	{
		g_xmlDoc.getElementsByTagName("cmd_type")[0].nodeTypedValue = "get";
		g_xmlDoc.getElementsByTagName("err_flag")[0].nodeTypedValue = "0";
		g_xmlDoc.getElementsByTagName("channel")[0].nodeTypedValue = Obj.channel;
		
		g_xmlDoc.getElementsByTagName("log")[0].childNodes[0].nodeTypedValue = Obj.loginfo[0].sLogTime;
		g_xmlDoc.getElementsByTagName("log")[0].childNodes[4].nodeTypedValue = Obj.loginfo[0].byMajorType;
		
		GetLogRequest.onreadystatechange = function(){
				if (GetLogRequest.readyState == 4)
				{
					if (GetLogRequest.status == 200)
					{
						//var LogInfoXML = GetLogRequest.responseXML.documentElement;
						
						var strUtf8 = gb2utf8(GetLogRequest.responseBody);
						var x = LoadXML("str",strUtf8);
						
						var LogInfoXML = x.documentElement;
						
						if(LogInfoXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
						{
							Obj.result = true;
							Obj.LogNums = LogInfoXML.getElementsByTagName("LogNums")[0].nodeTypedValue;
							Obj.channel = LogInfoXML.getElementsByTagName("Header/channel")[0].nodeTypedValue;
							//Obj.channel = 0;
							
							for(var i=0; i<Obj.LogNums; i++)
							{
								Obj.loginfo[i].sLogTime 		= LogInfoXML.getElementsByTagName("log")[i].childNodes[0].nodeTypedValue;
								Obj.loginfo[i].sUserName 		= LogInfoXML.getElementsByTagName("log")[i].childNodes[1].nodeTypedValue;
								Obj.loginfo[i].sAddress 		= LogInfoXML.getElementsByTagName("log")[i].childNodes[2].nodeTypedValue;
								Obj.loginfo[i].byUserLoginType 	= LogInfoXML.getElementsByTagName("log")[i].childNodes[3].nodeTypedValue;
								Obj.loginfo[i].byMajorType 		= LogInfoXML.getElementsByTagName("log")[i].childNodes[4].nodeTypedValue;
								Obj.loginfo[i].byMinorType 		= LogInfoXML.getElementsByTagName("log")[i].childNodes[5].nodeTypedValue;
								Obj.loginfo[i].sInfo 			= LogInfoXML.getElementsByTagName("log")[i].childNodes[6].nodeTypedValue;
							}
						}
						else
						{
							Obj.result = false;
						}
						
						Obj.callbackfunction(Obj);
						
						GetLogRequest.abort();
					}
				}
			};
			
		GetLogRequest.open(Obj.method, url, Obj.asynchrony);
		GetLogRequest.send(g_xmlDoc);
	}
}


/*======================================================================================================
========================================================================================================
==																									  ==
==																									  ==
==												获取设备状态接口				   			              ==
==										 															  ==
==										2012.07.16	By angel				  						  ==
==																									  ==
==																									  ==
==																									  ==
========================================================================================================
======================================================================================================*/

////////////////////////////////////获取设备状态/////////////////////////////////////////////
try 
{
 	GetDeviceStatusRequest = new XMLHttpRequest();
} 
catch (trymicrosoft)
{
  try
  {
   	GetDeviceStatusRequest = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (othermicrosoft) 
  {
	   try 
	   {
		 		GetDeviceStatusRequest = new ActiveXObject("Microsoft.XMLHTTP");
	   } 
	   catch (failed)
	   {
		 		GetDeviceStatusRequest = false;
	   }  
 	}
}

if (!GetDeviceStatusRequest)
{
	 alert("Error initializing XMLHttpRequest!");
}
///////////////////////////////////////////////////////////////////////////////////////////

function StorageStatusObj()
{
	this.Enable = 0;	//是否启用存储
	this.StorageType = 0;	//启用的存储类型
}

function ChannelStatusObj()
{
	this.StorageStatus = new StorageStatusObj();	//存储状态
	this.StreamStatus = 0;		//码流统计
	this.ChannelName = "";		//通道名
	this.ChannelIP = "";		//通道IP
}

function ChannelStatusListObj()
{
	var channellist = new Array(32);		//32路通道
	for(var i=0; i<channellist.length; i++)
	{
		channellist[i] = new ChannelStatusObj();
	}
	this.ChannelStatus = channellist;
}

//设备状态结构体
function DeviceStatusObj()
{
	this.callbackfunction = function(){};
	this.method = "POST";
	this.asynchrony = false;
	this.username = "";
	this.password = "";
	
	this.result = false;
	this.ChannelListStatus = new ChannelStatusListObj();
}

//获取设备状态
function GetDeviceStatusInfo(Obj)
{
	var sDate = new Date();
	var url = "AipstarWebService?824ec5=" + Obj.username + "&5aa765=" + Obj.password + "&date=" + sDate.getTime();
	var strXml = '<?xml version="1.0" encoding="gb2312" ?><Envelope><Header><cmd>DeviceStatusCfg</cmd><cmd_type>get</cmd_type><err_flag>0</err_flag><channel>0</channel></Header></Envelope>';
	
	g_xmlDoc = LoadXML("str", strXml);
	
	if( typeof(g_xmlDoc) == "object" )
	{
		GetDeviceStatusRequest.onreadystatechange = function(){
				if (GetDeviceStatusRequest.readyState == 4)
				{
					if (GetDeviceStatusRequest.status == 200)
					{
						var strUtf8 = gb2utf8(GetDeviceStatusRequest.responseBody);
						var x = LoadXML("str",strUtf8);
						
						var StatusXML = x.documentElement;
						
						if(StatusXML.getElementsByTagName("Header/err_flag")[0].nodeTypedValue == 0)
						{
							Obj.result = true;
							
							var ChannelStatusXml = StatusXML.getElementsByTagName("ChannelStatusListCfg")[0].childNodes;
							for(var i=0; i<ChannelStatusXml.length; i++)
							{
								Obj.ChannelListStatus.ChannelStatus[i].StorageStatus.Enable 		= ChannelStatusXml[i].childNodes[0].childNodes[0].nodeTypedValue;
								Obj.ChannelListStatus.ChannelStatus[i].StorageStatus.StorageType 	= ChannelStatusXml[i].childNodes[0].childNodes[1].nodeTypedValue;
								Obj.ChannelListStatus.ChannelStatus[i].StreamStatus 				= ChannelStatusXml[i].childNodes[1].nodeTypedValue;
								Obj.ChannelListStatus.ChannelStatus[i].ChannelName 					= ChannelStatusXml[i].childNodes[2].nodeTypedValue;
								Obj.ChannelListStatus.ChannelStatus[i].ChannelIP 					= ChannelStatusXml[i].childNodes[3].nodeTypedValue;
							}							
						}
						else
						{
							Obj.result = false;
						}
						
						Obj.callbackfunction(Obj);
						
						GetDeviceStatusRequest.abort();
					}
				}
			};
			
		GetDeviceStatusRequest.open(Obj.method, url, Obj.asynchrony);
		GetDeviceStatusRequest.send(g_xmlDoc);
	}
}

