//初始化界面
function InitializeProgram()
{
	InitDiv();
    
    //获取浏览器信息
    GetBrowserInfo();
    
    delCookie("m_ServerAddress");
    addCookie("m_ServerAddress", window.location.hostname, 10, "", "");

	delCookie("m_BrowserName");
	addCookie("m_BrowserName", navigator.appName, 10, "", "");

    //set the focus to the user input
    document.getElementById("UserName").focus();
}

//获取浏览器信息
function GetBrowserInfo()
{
    var Browser_Name = navigator.appName;
    var Browser_Version = parseFloat(navigator.appVersion);
    var Browser_Agent = navigator.userAgent;
    
    var Actual_Version, Actual_Name;
    //alert(Browser_Name + " " + Browser_Agent + " " + Browser_Version + " " + navigator.language);
    var is_IE = (Browser_Name == "Microsoft Internet Explorer");
    var is_NN = (Browser_Name == "Netscape");
    var is_Op = (Browser_Name == "Opera");
        
    if (is_NN) 
    {
        //upper 5.0 need to be process,lower 5.0 return directly
        if (Browser_Version >= 5.0) 
        {
            var Split_Sign = Browser_Agent.lastIndexOf("/");
            var Version = Browser_Agent.indexOf(" ", Split_Sign);
            var Bname = Browser_Agent.lastIndexOf(" ", Split_Sign);
            
            Actual_Version = Browser_Agent.substring(Split_Sign + 1, Version);
            Actual_Name = Browser_Agent.substring(Bname + 1, Split_Sign);
        }
        else 
        {
            Actual_Version = Browser_Version;
            Actual_Name = Browser_Name;
        }
    }
    else if (is_IE) 
    {
        var Version_Start = Browser_Agent.indexOf("MSIE");
        var Version_End = Browser_Agent.indexOf(";", Version_Start);
        Actual_Version = Browser_Agent.substring(Version_Start + 5, Version_End);
        Actual_Name = Browser_Name;
        
        if (Browser_Agent.indexOf("Maxthon") != -1) 
        {
            Actual_Name += "(Maxthon)";
        }
        else if (Browser_Agent.indexOf("Opera") != -1) 
        {
            Actual_Name = "Opera";
            var tempstart = Browser_Agent.indexOf("Opera");
            var tempend = Browser_Agent.length;
            Actual_Version = Browser_Agent.substring(tempstart + 6, tempend);
        }
    }
    else if (is_Op)
    {
    	 Actual_Name = Browser_Name;
    	 Actual_Version = Browser_Version;
    }
    else 
    {
        Actual_Name = "Unknown Navigator";
        Actual_Version = "Unknown Version";
    }

    navigator.Actual_Name = Actual_Name;
    navigator.Actual_Version = Actual_Version;
    
    /*---------------------------------------------------------------------------
     --Or Made this a Class.                                                    --
     --Userage:                                                                 --
     --1,Create a instance of this object like this:var browser=new browserinfo;--
     --2,user this instance:browser.Version/browser.Name;                       --
     ---------------------------------------------------------------------------*/
    this.Name = Actual_Name;
    this.Version = Actual_Version;
    
    //judge the language of client 
    var language = "";
    if (navigator.appName == 'Netscape') 
        language = navigator.language;
    else 
        language = navigator.browserLanguage;
    
	if( language == "zh-cn" || language == "zh-CN")
	{
		//onloadEx("Chinese");
		SeleceLanguage("cn")
	}
	else
	{
		//onloadEx("English");
		SeleceLanguage("en")
	}
}



function isNull(str)
{
    if (str == "") 
        return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}


document.onkeydown = function()
{
    var k = event.keyCode;
    if ((event.ctrlKey == true && k == 82) || (k == 116) || (event.ctrlKey == true && k == 116)) 
    {
        event.keyCode = 0;
        event.returnValue = false;
        event.cancelBubble = true;
    }
    
    if (k == 13) 
    {
        JsMain('login');
        return false;
    }
}

function InitDiv()
{
    var clientW = parseInt(document.body.clientWidth);
    var clientH = parseInt(document.documentElement.clientHeight);
    if (clientW < 1024) 
    {
        clientW = 1024;
    }
    
    if (clientH < 500) 
    {
        clientH = 500;
    }
    //var clientH = document.body.clientHeight;
    
    //页面背景div
    document.getElementById("backgroundDiv").style.height = clientH + "px";
    document.getElementById("backgroundDiv").style.width = clientW + "px";
    
    //登录窗口div
    document.getElementById("loginBoxDiv").style.top = (clientH - 300) / 2 + "px";
    document.getElementById("loginBoxDiv").style.left = (clientW - 500) / 2 + "px";
    
    //登录窗口阴影div
    document.getElementById("shadowDiv").style.top = parseInt(document.getElementById("loginBoxDiv").style.top) + 10 + "px";
    document.getElementById("shadowDiv").style.left = parseInt(document.getElementById("loginBoxDiv").style.left) + 10 + "px";  
}  

function $(id)
{
	return document.getElementById(id);
}
