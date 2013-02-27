// JavaScript Document

function $(id){
    return document.getElementById(id);
}

function GetQueryString(sProp){
    var re = new RegExp("[&,?]" + sProp + "=([^\\&]*)", "i");
    var a = re.exec(top.window.document.location.search);
    
    if (a == null) {
        return "";
    }
    
    return a[1];
}

function isNull(str){
    if (str == "") {
        return true;
    }
    
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

var g_WeekDate = new Date().getDay() - 1; //星期
//初始化程序
function InitializeProgram(){
    var clientW = parseInt(document.body.clientWidth) - 11;
    var clientH = parseInt(document.documentElement.clientHeight) - 20;
    //var clientH = document.body.clientHeight;
    if (clientH < 500) {
        clientH = 500;
    }
    
    if (clientW < 950) {
        clientW = 950;
    }
    
    if (!CreateVideow()) {
        DisplayDiv(false);
        return false;
    }
    else {
        var strCurrentVersion = PlayCtrl.GetVersion(); //获取当前控件版本 Ps:1,1,0,20
        //按视频比例显示
        PlayCtrl.SetLockVideoSize(0, true);
        //判断当前控件版本
        if (strCurrentVersion < "1,3,1,0") {
            DisplayDiv(false);
            
            $("divDownload").style.display = "block";
            $("divDownload").style.left = (parseInt(document.body.clientWidth) - 650) / 2 + "px";
            $("divDownload").style.top = parseInt(document.documentElement.clientHeight) / 3 + "px";
            
            return false;
        }
    }
    
    $("backgroundDiv").style.height = clientH + "px";
    $("backgroundDiv").style.width = clientW + "px";
    
    $("centerDiv").style.height = clientH + 15 + "px";
    $("centerDiv").style.width = clientW + 8 + "px";
    
    var centerDivHeight = $("centerDiv").style.pixelHeight;
    $("centerDiv").style.marginTop = -centerDivHeight + 0 + "px";
    $("centerDiv").style.marginLeft = 0 + "px";
    
    $("center_CenterDiv").style.height = (centerDivHeight - 30) + 8 + "px";
    $("center_CenterDiv").style.width = ($("centerDiv").style.pixelWidth - 340 - 30) + 0 + "px";
    
    $("center_CenterDiv").style.marginLeft = "20px";
    /*$("center_CenterDiv").style.marginTop = "20px";*/
    
    var center_CenterDivHeight = $("center_CenterDiv").style.pixelHeight;
    var center_CenterDivWidth = $("center_CenterDiv").style.pixelWidth;
    $("VideoDiv").style.height = center_CenterDivHeight * 0.94 + "px";
    $("VideoDiv").style.width = center_CenterDivWidth * 0.98 + "px";
    
    $("VideoDiv").style.marginTop = center_CenterDivHeight * 0.02 + "px";
    $("VideoDiv").style.marginLeft = center_CenterDivWidth * 0.01 + "px";
    
    $("LeftDiv").style.height = center_CenterDivHeight + "px";
    $("LeftDiv").style.width = 140 + "px";
    //$("ChannelListDiv").style.width = parseInt($("LeftDiv").style.width)-15 + "px";
    
    $("center_RightDiv").style.height = center_CenterDivHeight - 2 + "px";
    $("center_RightDiv").style.marginTop = (-center_CenterDivHeight) + "px";
    $("center_RightDiv").style.width = "340px";
    $("center_RightDiv").style.marginLeft = (center_CenterDivWidth + 30) + "px";
    
    $("center_BottomDiv").style.width = center_CenterDivWidth - 0 + "px";
    $("center_BottomDiv").style.height = 26 + "px";
    $("center_BottomDiv").style.marginLeft = parseInt($("center_CenterDiv").style.marginLeft) - 0 + "px";
    $("center_BottomDiv").style.top = (centerDivHeight - 38) + "px";
    
    $("PatameterBodyDiv").style.height = ($("center_RightDiv").style.pixelHeight) + "px";
    //$("divChannelList").style.height = ($("PatameterBodyDiv").style.pixelHeight - 233) + "px";
    //alert($("divChannelList").style.height = ($("PatameterBodyDiv").style.pixelHeight - 233) + "px");
    $("divFileList").style.height = ($("PatameterBodyDiv").style.pixelHeight - 370) + "px";
    
    
    
    //显示页面内容
    $("backgroundDiv").style.display = "";
    ShowBottomDiv();
    return true;
}

var g_RightDivState = false;
function RightDivFloat(){
    if (g_RightDivState == false) {
        $("center_RightDiv").style.width = "15px";
        $("center_RightDiv").style.marginLeft = (parseInt($("center_RightDiv").style.marginLeft) + 325) + "px";
        
        $("center_CenterDiv").style.width = parseInt($("center_CenterDiv").style.width) + 325 + "px";
        $("center_BottomDiv").style.width = parseInt($("center_CenterDiv").style.width) + 0 + "px";
        
        $("VideoDiv").style.width = parseInt($("center_CenterDiv").style.width) * 0.98 + "px";
        $("VideoDiv").style.marginLeft = parseInt($("center_CenterDiv").style.width) * 0.01 - 2 + "px";
        
        $("PatameterDiv").style.display = "none";
        
        g_RightDivState = true;
        ChangeVernierPic(1);
        
    }
    else {
        $("center_RightDiv").style.width = "340px";
        $("center_RightDiv").style.marginLeft = (parseInt($("center_RightDiv").style.marginLeft) - 325) + "px";
        
        $("center_CenterDiv").style.width = parseInt($("center_CenterDiv").style.width) - 325 + "px";
        $("center_BottomDiv").style.width = parseInt($("center_CenterDiv").style.width) + 0 + "px";
        
        $("VideoDiv").style.width = parseInt($("center_CenterDiv").style.width) * 0.98 + "px";
        $("VideoDiv").style.marginLeft = parseInt($("center_CenterDiv").style.width) * 0.01 - 2 + "px";
        
        $("PatameterDiv").style.display = "";
        
        //获取视频参数的值
        SendGetVideoParam();
        
        g_RightDivState = false;
        ChangeVernierPic(0);
    }
}

var g_BottomDivState;
function CheckBottomDivState(){
    if (!g_BottomDivState) {
        $("center_BottomDiv").style.display = "none";
    }
    else {
        clearInterval(g_statusBottomDivInterval);
    }
}

var g_statusBottomDivInterval;
function HideBottomDiv(){
    g_BottomDivState = false;
    
    g_statusBottomDivInterval = setInterval("CheckBottomDivState()", 3000);
}

function ShowBottomDiv(){
    $("center_BottomDiv").style.display = "";
    clearInterval(g_statusBottomDivInterval);
    
    g_BottomDivState = true;
}

//切换视频回放标签
function ChangePlaybackDiv(){
	g_PlaybackState = true;
	
    ChangeTagPic(3);

    
    $("LeftVernierPic").style.display = "none";
    $("PatameterTopDiv").style.display = "none";
    $("PatameterTopDiv1").style.display = "none";
    
    //移动层到默认位置
    RightDivFloat();
    LeftDivFloat();
}

//create the videow 
function CreateVideow(){
    //添加控件
    var strHtml = "<table id='PlayWindow' border='0' width='100%' height='99.8%' bgcolor='#cccccc' cellspacing='0'><tr height='100%' valign='center'><td style='cursor:default;' width='100%' height='100%' align='center' ><object classid='clsid:866220F2-4079-4D30-A9A8-E48741BD65B6'  name='PlayCtrl' id='PlayCtrl'  width='100%' height='100%' hspace='0'  vspace='0' align='center' onmouseover='event.srcElement.releaseCapture();' onmousemove='event.srcElement.releaseCapture();'></object> </td></tr></table>";
    
    $("VideoDiv").innerHTML = strHtml;
    //$("PlayWindow").style.display = "none";
    return CheckContral();
}


//检测控件是否能够成功连接
function CheckContral(){
    var PlayCtrl = $("PlayCtrl");
    //var iChannel = 0;
    //check the videow control
    try {
        if (g_Language == "English") {
            PlayCtrl.SetLanguageType("EN");
        }
        else 
            if (g_Language == "Chinese") {
                PlayCtrl.SetLanguageType("CN");
            }
        bSuccessful = PlayCtrl.SetIPAddress(window.location.hostname);
        PlayCtrl.SetLockVideoSize(0, true);
        
        return true;
    } 
    catch (err) {
        //hide the slider control
        DisplayDiv(false);
        $("divDownload").style.display = "block";
        $("divDownload").style.left = (parseInt(document.body.clientWidth) - 650) / 2 + "px";
        $("divDownload").style.top = parseInt(document.documentElement.clientHeight) / 3 + "px";
        return false;
    }
}

//显示或隐藏层
function DisplayDiv(visible){
    //Show Div
    if (visible == true) {
        $("backgroundDiv").style.display = "";
    }
    //Hidden Div
    else 
        if (visible == false) {
            $("backgroundDiv").style.display = "none";
        }
}

//下载视频控件
function DownLoad(){
    location.href = "../HDLive.exe";
    $("divDownload").style.display = "none";
}

//连接视频
function ConnectServer(codeType){

    if (!CheckUserRight(0x00000080)) {
        return false;
    }
    
    //如果当前处于视频回放模式, 就不连接视频
//    if (g_PlaybackState) {
//        return g_PlaybackState = false;
//    }
    
    if (g_bConnect == false) {//alert(g_ServerIp+" "+g_ServerPort+" "+g_CurrentChannelNum+" "+codeType+" "+g_UserName+" "+g_Password);
        try {
            //先断开连接
            DisConnect();
            setWindowNo(1);
			
			//如果当前处于视频回放模式, 就不连接视频
			if (!g_PlaybackState) {
				bSuccessful = PlayCtrl.ConnectA(g_ServerIp, g_ServerPort, g_CurrentChannelNum, codeType, g_UserName, g_connectPassword);
				if (g_IsMute != PlayCtrl.IsMute()) {
					PlayCtrl.PutMute(g_IsMute);
				}
				g_bConnect = true;
			} 
            
        } 
        catch (err) {
            //alert("连接失败!");
        }
    }
    else {
        CloseVieow();
        g_bConnect = false;
    }
}

function DisConnect(){
    try {
        PlayCtrl.Disconnect();
        g_bConnect = false;
    } 
    catch (err) {
    
    }
}


//关闭视频函数
function CloseVieow(){
    try {
        var div = $("VideowDiv");
        if (div != null) {
            PlayCtrl.Disconnect();
        }
    } 
    catch (exception) {
        var div = $("VideowDiv");
        if (div != null) {
            div.style.display = "none";
        }
    }
}

//capture the picture
function Capture(){
    if (!g_bConnect && !g_Play) {
        return false;
    }
    
    try {
        PlayCtrl.CapturePicture("");
    } 
    catch (err) {
    
    }
    //alert("ok"); 
}

function Record(){
    //Check user right
    if ((0x00000002 & g_UserRight) == 0) {
        alert(a_NoPopedom);
        return false;
    }
    
    if (!g_bConnect) {
        return false;
    }
    
    if (bStartRecord == false) //record
    {
        //start record
        try {
            var bRet = false;
            //var sFileName = "";
            bRet = PlayCtrl.BeginRecord("");
            
            //set the status
            if (bRet) {
                //statusInterval = setInterval("DisplayStatus()",800);
                //set the flag of record start
                bStartRecord = true;
                //$("btnRecord").value=g_Stoprecording;
                $("PlayRecord").title = a_StopRecord;
                //$("btnDisConnect").disabled = "disabled";
            }
        } 
        catch (err) {
            alert(a_VideoConnect);
        }
    }
    else //stop record
    {
        //stop the record
        try {
            PlayCtrl.EndRecord();
            //set the record flag
            bStartRecord = false;
            //$("btnRecord").value=g_record;
            $("PlayRecord").title = a_Record;
            //set the status 
            //clearInterval(statusInterval);
            //$("spStatus").innerHTML = "";
            //set the disconnect button stat
            //$("btnDisconnect").disabled = ""
        } 
        catch (err) {
        
        }
    }
    
    $("PlayRecord").src = bStartRecord ? "images/recordStart.gif" : "images/recordStop.png";
}


var g_IsMute = true;
function SetMute(){
    if (!CheckUserRight(0x00000040)) {
        alert(a_notRightClose);
        return false;
    }
    
    g_IsMute = !g_IsMute;
    try {
        if (g_IsMute != PlayCtrl.IsMute()) {
            PlayCtrl.PutMute(g_IsMute);
        }
        
        $("chPlayIsMute").title = g_IsMute ? a_OpenAudio : a_CloseAudio;
        
        $("PlayOpenAudio").src = g_IsMute ? "images/audioClose.png" : "images/audioOpen.png";
        $("chPlayIsMute").src = g_IsMute ? "images/audioClose.png" : "images/audioOpen.png";
        
    } 
    catch (error) {
        alert(a_VideoConnect);
    }
}

var g_TimerPlayState = 0;96
function GetPlayState(){
    try {
        var iState = PlayCtrl.GetPlayState();
        if (iState == 13 || iState == 0 || iState == 24) {
            clearInterval(g_TimerPlayState);
        }
        if (iState == 13 || iState == 0) {
            g_Play = false;
            //$("btnPPause").value = g_btnPPause;
            g_bPause = true;
        }
    } 
    catch (err) {
        alert(g_strUpdate);
        clearInterval(g_TimerPlayState);
    }
}

//本地播放
var g_bPause = false;
var g_Play = false;
function PPlay(){
    try {
        if (g_strCurrentFile != "") {
        	 var strFileName = g_strCurrentFile.split("$");
        	 
            if (g_bSelectLocate == false) {
                //PlayCtrl.PlayRemoteFile(g_strCurrentFile);
               
                PlayCtrl.PlayRemoteFileEx(strFileName[0], -1); //特殊情况
                //ChangePlayState(false);
            }
            else {
                PlayCtrl.Play(strFileName[0]);
                //ChangePlayState(true);
            }
            g_Play = true;
            g_bPause = false;
            
            //start the timer for get play state
            g_TimerPlayState = setInterval("GetPlayState()", 1000);
        }
    } 
    catch (err) {
    }
    
}

//暂停
function PPause(){
    try {
        PlayCtrl.Pause();
    } 
    catch (err) {
    }
}



//停止
function PSStop(){
    try {
        g_Play = false;
        PlayCtrl.Stop();
        
        g_bPause = true;
        //$("btnPPause").title = g_btnPPause;
    } 
    catch (err) {
    }
}

function ChangePlayState(state){
    $("btnPNext").style.display = state ? "" : "none";
    $("btnPFast2").style.display = state ? "" : "none";
    $("btnPFast4").style.display = state ? "" : "none";
    $("btnPNext_span").style.display = state ? "" : "none";
    $("btnPFast2_span").style.display = state ? "" : "none";
    $("btnPFast4_span").style.display = state ? "" : "none";
    
}

//下一帧
function PSetFrame(bForward){
    try {
        PlayCtrl.StepFrame(bForward);
    } 
    catch (err) {
    }
}

//快进X2
function PSetPlayRate(value){
    try {
        PlayCtrl.SetPlayRate(value);
    } 
    catch (err) {
    }
}

//慢放x2
function PSetPlaySlow(value){
    try {
        PlayCtrl.SetPlaySlow(value);
    } 
    catch (e) {
    }
}

//连接指定通道视频
var g_CurrentChannelNum = 0;
var g_OldChannelTdNum = 0;
function ConnectVideoEx(id, substream){
    if (!CheckUserRight(0x00000080)) {
        alert(a_notRightClose);
        return false;
    }
    
    
    $("ChannelListTd" + id).style.color = "#e98402";
    $("ChannelListImg" + id).src = "images/Camera1.gif";
    
    if (g_OldChannelTdNum != id) {
        $("ChannelListTd" + g_OldChannelTdNum).style.color = "#000";
        $("ChannelListImg" + g_OldChannelTdNum).src = "images/Camera.gif";
        
        g_OldChannelTdNum = id;
        
        //选断开连接
        DisConnect();
        g_CurrentChannelNum = id; //通道号
        var codeType = 0; //码流类型
        //如果该通道启用了从码流的话  默认连接的时候连从码流
        
        //todo 暂时取消了, 默认还是连接主码流
//        if (substream == "1") {
//            codeType = 1
//        }
//        else {
//            codeType = 0;
//        }
		
		//alert(g_PlaybackState +"abcd");
		if (!g_PlaybackState) {
		
			PlayCtrl.ConnectA(g_ServerIp, g_ServerPort, g_CurrentChannelNum, codeType, g_UserName, g_connectPassword);
			g_bConnect = true;
		}
        
        //将当前的通道信息写入隐藏域
        $("InputServerIp").value = g_ServerIp;
        $("InputPort").value = g_ServerPort;
        $("InputChannel").value = g_CurrentChannelNum;
        $("InputCodeType").value = codeType;
        $("InputUser").value = g_UserName;
        $("InputPwd").value = g_connectPassword;
        
        switch (g_oldTag) {
            case 0: //VideoParameterDiv
                SendGetVideoParam();
                SetSliderValue();
                break;
                
            case 1: //PtzContralDiv
                break;
                
            case 2: //PicModeDiv
                SendGetPicMode();
                SendGetTheodoliteInfo();
                break;
                
            case 3: //VideoPlaybackDiv
                PlayBack();
                g_videostate = false;
                break;
                
            case 4: //CompressFormatDiv
                //获取设备支持的视频编码类型
                SendGetVideoCodeType();
                break;
                
            case 5: //OsdDiv
                SendGetVideoOsd();
                break;
                
            case 6: //MotionSetDiv
                SendGetVideoMotion();
                break;
                
            case 7: //VideoIn
                SendGetVideoInInfo();
                break;
                
            case 8: //DeviceInfoDiv
                SendGetDeviceInfo();
                break;
                
            default:
                break;
        }
    }
}

//切换伸缩导航按钮
function ChangeVernierPic(par1){
    if (g_RightDivState == true) {
        if (par1 == 0) {
            $("VernierPic").src = "images/flexible_1_2.gif";
        }
        else 
            if (par1 == 1) {
                $("VernierPic").src = "images/flexible_1_1.gif";
            }
    }
    else {
        if (par1 == 0) {
            $("VernierPic").src = "images/flexible_2_1.gif";
        }
        else 
            if (par1 == 1) {
                $("VernierPic").src = "images/flexible_2_2.gif";
            }
    }
}

//切换栏目标签
var g_oldTag = 0;
function ChangeTagPic(which){
    /*if( g_oldTag >= 5)
     {
     document.getElementsByName("tag"+ g_oldTag)[0].style.backgroundImage = "url(../../images/tag3.png)";
     document.getElementsByName("tag"+ g_oldTag)[1].style.backgroundImage = "url(../../images/tag3.png)";
     }
     else
     {
     document.getElementsByName("tag"+ g_oldTag)[0].style.backgroundImage = "url(../../images/tag2.png)";
     document.getElementsByName("tag"+ g_oldTag)[1].style.backgroundImage = "url(../../images/tag2.png)";
     }
     
     if( which >= 5 )
     {
     document.getElementsByName("tag"+ which)[0].style.backgroundImage = "url(../../images/tag4.png)";
     document.getElementsByName("tag"+ which)[1].style.backgroundImage = "url(../../images/tag4.png)";
     
     $("PatameterTopDiv").style.display = "";
     $("PatameterTopDiv1").style.display = "none";
     }
     else
     {
     document.getElementsByName("tag"+ which)[0].style.backgroundImage = "url(../../images/tag1.png)";
     document.getElementsByName("tag"+ which)[1].style.backgroundImage = "url(../../images/tag1.png)";
     
     $("PatameterTopDiv").style.display = "none";
     $("PatameterTopDiv1").style.display = "";
     }*/
    document.getElementsByName("tag" + g_oldTag)[0].style.backgroundImage = "url(../../images/tag3.png)";
    document.getElementsByName("tag" + g_oldTag)[1].style.backgroundImage = "url(../../images/tag3.png)";
    
    document.getElementsByName("tag" + which)[0].style.backgroundImage = "url(../../images/tag4.png)";
    document.getElementsByName("tag" + which)[1].style.backgroundImage = "url(../../images/tag4.png)";
    
    if (which >= 5) {
        $("PatameterTopDiv").style.display = "";
        $("PatameterTopDiv1").style.display = "none";
    }
    else {
        $("PatameterTopDiv").style.display = "none";
        $("PatameterTopDiv1").style.display = "";
    }
    
	if(which!=3)
	{
		g_PlaybackState = false;
	}
	
    //判断是否处于移动侦测模式
    if (g_MotionStart) {
        DisConnect();
        
        try {
            PlayCtrl.EnableDrawMotion(false);
            PlayCtrl.SetCurrentDrawMode(0); //设置控件为正常浏览模式
        } 
        catch (err) {
        }
        
//        if (g_ChannelInfoObj.ChannelInfo[g_CurrentChannelNum].bySubStream == 1) {
//            ConnectServer(1);
//        }
//        else {
//            ConnectServer(0);
//        }
        
        //不判断  默认连接主码流
        ConnectServer(0);
        
        g_MotionStart = false;
    }
    
    $("PtzContralDiv").style.display = "none";
    $("VideoParameterDiv").style.display = "none";
    $("PicModeDiv").style.display = "none";
    $("VideoPlaybackDiv").style.display = "none";
    $("CompressFormatDiv").style.display = "none";
    $("OsdDiv").style.display = "none";
    $("MotionSetDiv").style.display = "none";
    $("DeviceInfoDiv").style.display = "none";
    $("VideoInDiv").style.display = "none";
    
    $("VideoPlayContralDiv").style.display = "none";
    $("VideoContralDiv").style.display = "";
    
    if (!g_bConnect) 
    {
//        if (g_ChannelInfoObj.ChannelInfo[g_CurrentChannelNum].bySubStream == 1) {
//            ConnectServer(1);
//        }
//        else {
//            ConnectServer(0);
//        }
    	
    	//不判断  默认连接主码流
        ConnectServer(0);
        
        g_bConnect = true;
    }
    
    switch (which) {
        case 0: //VideoParameterDiv
            $("VideoParameterDiv").style.display = "inline";
            
            SendGetVideoParam();
            SetSliderValue();
            break;
        case 1: //PtzContralDiv
            $("PtzContralDiv").style.display = "inline";
            
            break;
        case 2: //PicModeDiv
            $("PicModeDiv").style.display = "inline";
            
            SendGetPicMode();
            SendGetTheodoliteInfo();
            break;
        case 3: //VideoPlaybackDiv
            $("VideoPlaybackDiv").style.display = "inline";
            CreCheckDtreeChannel();
            PlayBack();
            g_videostate = false;
            break;
        case 4: //CompressFormatDiv
            $("CompressFormatDiv").style.display = "inline";
            
            //获取设备支持的视频编码类型
            SendGetVideoCodeType();
            break;
        case 5: //OsdDiv
            $("OsdDiv").style.display = "inline";
            
            SendGetVideoOsd();
            break;
        case 6: //MotionSetDiv
            $("MotionSetDiv").style.display = "inline";
            
            SendGetVideoMotion();
            break;
        case 7: //DeviceInfoDiv
            $("VideoInDiv").style.display = "inline";
            
            SendGetVideoInInfo();
            break;
        case 8:
            
            $("DeviceInfoDiv").style.display = "inline";
            
            SendGetDeviceInfo();
            break;
            
        default:
            break;
    }
    g_oldTag = which;
}

var g_LeftDivState = false;
function LeftDivFloat(){
    g_LeftDivState = !g_LeftDivState;
    
    if (g_LeftDivState == true) {
        $("LeftDiv").style.width = 140 + "px";
        
        $("centerDiv").style.width = parseInt($("centerDiv").style.width) - 125 + "px";
        $("centerDiv").style.marginLeft = parseInt($("centerDiv").style.marginLeft) + 125 + "px";
        
        $("center_CenterDiv").style.width = parseInt($("center_CenterDiv").style.width) - 125 + "px";
        
        $("VideoDiv").style.width = parseInt($("center_CenterDiv").style.width) * 0.98 + "px";
        $("VideoDiv").style.marginLeft = parseInt($("center_CenterDiv").style.width) * 0.01 - 2 + "px";
        
        $("center_RightDiv").style.marginLeft = parseInt($("center_RightDiv").style.marginLeft) - 125 + "px";
        
        $("center_BottomDiv").style.width = parseInt($("center_BottomDiv").style.width) - 125 + "px";
        $("center_BottomDiv").style.marginLeft = parseInt($("center_BottomDiv").style.marginLeft) + 125 + "px";
        
        $("ChannelListDiv").style.display = "block";
    }
    else {
        $("LeftDiv").style.width = 15 + "px";
        
        $("centerDiv").style.width = parseInt($("centerDiv").style.width) + 125 + "px";
        $("centerDiv").style.marginLeft = parseInt($("centerDiv").style.marginLeft) - 125 + "px";
        
        $("center_CenterDiv").style.width = parseInt($("center_CenterDiv").style.width) + 125 + "px";
        
        $("VideoDiv").style.width = parseInt($("center_CenterDiv").style.width) * 0.98 + "px";
        $("VideoDiv").style.marginLeft = parseInt($("center_CenterDiv").style.width) * 0.01 + 2 + "px";
        
        $("center_RightDiv").style.marginLeft = parseInt($("center_RightDiv").style.marginLeft) + 125 + "px";
        
        $("center_BottomDiv").style.width = parseInt($("center_BottomDiv").style.width) + 125 + "px";
        $("center_BottomDiv").style.marginLeft = parseInt($("center_BottomDiv").style.marginLeft) - 125 + "px";
        
        $("ChannelListDiv").style.display = "none";
    }
}

//切换伸缩导航按钮
function ChangeLeftVernierPic(par1){
    /*if( g_LeftDivState == false )
     {
	     if(par1 == 0)
	     {
	     	$("LeftVernierPic").src = "images/flexibleleft_1_2.gif";
	     }
	     else if(par1 == 1)
	     {
	     	$("LeftVernierPic").src = "images/flexibleleft_1_1.gif";
	     }
     }
     else
     {
	     if(par1 == 0)
	     {
	     	$("LeftVernierPic").src = "images/flexibleleft_2_1.gif";
	     }
	     else if(par1 == 1)
	     {
	     	$("LeftVernierPic").src = "images/flexibleleft_2_2.gif";
	     }
     }*/
}

//禁用鼠标右键
document.oncontextmenu = function(){
    return false;
};

//禁用F5 禁用backspace键
document.documentElement.onkeydown = function(evt){
    var b = !!evt, oEvent = evt || window.event;
    if (oEvent.keyCode == 8) {
        var node = b ? oEvent.target : oEvent.srcElement;
        var reg = /^(input|textarea)$/i, regType = /^(text|textarea)$/i;
        if (!reg.test(node.nodeName) || !regType.test(node.type) || node.readOnly || node.disabled) {
            if (b) {
                oEvent.stopPropagation();
            }
            else {
                oEvent.cancelBubble = true;
                oEvent.keyCode = 0;
                oEvent.returnValue = false;
            }
        }
    }
    
    var k = oEvent.keyCode;
    if ((oEvent.ctrlKey == true && k == 82) || (k == 116) || (oEvent.ctrlKey == true && k == 116)) {
        oEvent.keyCode = 0;
        oEvent.returnValue = false;
        oEvent.cancelBubble = true;
    }
};


/*==========================================
 ============================================
 ==										  ==
 ==				云台控制代码段            ==
 ==										  ==
 ==			2011.01.26	By angel		  ==
 ============================================
 ==========================================*/
//切换云台控制的按钮图片 obj--当前对象  par1--图片名称 par2--操作状态 par3--区分类别
var bWiperState = true; //雨刷状态 true--开启
var bFanState = true; //风扇状态
var bLamplightState = true; //灯光状态
var bHeatState = true; //加热器状态
function ChangePtzPic(obj, par1, par2, par3){
    /*strUrl = "images/ptz/" + par1 + par2 + ".png";
     obj.src = strUrl;*/
    switch (par1) {
        case "left_top":
            if (par2 == 3) {
                SaveParam(27, 1);
            }
            else {
                SaveParam(27, 0);
            }
            break;
            
        case "top":
            if (par2 == 3) {
                SaveParam(21, 1);
            }
            else {
                SaveParam(21, 0);
            }
            break;
            
        case "top_right":
            if (par2 == 3) {
                SaveParam(25, 1);
            }
            else {
                SaveParam(25, 0);
            }
            break;
            
        case "left":
            if (par2 == 3) {
                SaveParam(23, 1);
            }
            else {
                SaveParam(23, 0);
            }
            break;
            
        case "center":
            if (par2 == 3) {
                SaveParam(29, 1);
            }
            else {
                SaveParam(29, 0);
            }
            break;
            
        case "right":
            if (par2 == 3) {
                SaveParam(24, 1);
            }
            else {
                SaveParam(24, 0);
            }
            break;
            
        case "bottom_left":
            if (par2 == 3) {
                SaveParam(28, 1);
            }
            else {
                SaveParam(28, 0);
            }
            break;
            
        case "bottom":
            if (par2 == 3) {
                SaveParam(22, 1);
            }
            else {
                SaveParam(22, 0);
            }
            break;
            
        case "bottom_right":
            if (par2 == 3) {
                SaveParam(26, 1);
            }
            else {
                SaveParam(26, 0);
            }
            break;
            
        case "plus":
            if (par2 == 3) {
                if (par3 == 1) //ZOOM+
                {
                    SaveParam(11, 1);
                }
                else 
                    if (par3 == 2) //IRIS+
                    {
                        SaveParam(15, 1);
                    }
                    else 
                        if (par3 == 3) //FOCUS+
                        {
                            SaveParam(13, 1);
                        }
            }
            else {
                if (par3 == 1) {
                    SaveParam(11, 0); //ZOOM+ Stop
                }
                else 
                    if (par3 == 2) {
                        SaveParam(15, 0); //IRIS+ Stop
                    }
                    else 
                        if (par3 == 3) {
                            SaveParam(13, 0); //FOCUS+ Stop
                        }
            }
            break;
            
        case "reduce":
            if (par2 == 3) {
                if (par3 == 1) {
                    SaveParam(12, 1); //ZOOM-
                }
                else 
                    if (par3 == 2) {
                        SaveParam(16, 1); //IRIS-
                    }
                    else 
                        if (par3 == 3) {
                            SaveParam(14, 1); //FOCUS-
                        }
            }
            else {
                if (par3 == 1) {
                    SaveParam(12, 0); //ZOOM- Stop
                }
                else 
                    if (par3 == 2) {
                        SaveParam(16, 0); //IRIS- Stop
                    }
                    else 
                        if (par3 == 3) {
                            SaveParam(14, 0); //FOCUS- Stop
                        }
            }
            break;
            
        case "auxiliary_on":
            if (par2 == 3) {
                SendCallAux(1);
            }
            break;
        case "auxiliary_off":
            if (par2 == 3) {
                SendCallAux(0);
            }
            break;
        case "wiper":
            if (par2 == 3) {
                if (bWiperState) {
                    SaveParam(3, 1);
                    
                    
                    obj.src = "images/ptz/wiper.png";
                }
                else {
                    SaveParam(3, 0);
                    
                    obj.src = "images/ptz/wiper3.png";
                }
                
                bWiperState = !bWiperState;
            }
            break;
            
        case "fan":
            if (par2 == 4) {
                if (bFanState) {
                    SaveParam(4, 1);
                    
                    obj.src = "images/ptz/test123.gif";
                }
                else {
                    SaveParam(4, 0);
                    
                    obj.src = "images/ptz/fan4.png";
                }
                
                bFanState = !bFanState;
            }
            break;
            
        case "lamplight":
            if (par2 == 2) {
                if (bLamplightState) {
                    SaveParam(2, 1);
                    
                    obj.src = "images/ptz/lamplight.png";
                }
                else {
                    SaveParam(2, 0);
                    
                    obj.src = "images/ptz/lamplight2.png";
                }
                
                bLamplightState = !bLamplightState;
            }
            break;
            
        case "heat":
            if (par2 == 5) {
                if (bHeatState) {
                    SaveParam(5, 1);
                    
                    obj.src = "images/ptz/heat.png";
                }
                else {
                    SaveParam(5, 0);
                    
                    obj.src = "images/ptz/heat5.png";
                }
                
                bHeatState = !bHeatState;
            }
            break;
            
        default:
            return false;
            break;
    }
}

//云台控制
var g_CallPtzObj = new CallPtzObj();
function SaveParam(command, control){
    if (!CheckUserRight(0x00000001)) {
        alert(a_notRightClose);
        return false;
    }
    
    if (CheckSpeed() == false) {
        return false;
    }
    
    PlayCtrl.PtzContrl(command, control, $("PTZSpeed").value);
    
    /*g_CallPtzObj.callbackfunction = function(Obj){
     if( !Obj.result )
     {
     	alert(a_ContralFail);
     }
     };
     g_CallPtzObj.channel = $("InputChannel").value;
     g_CallPtzObj.speed = $("PTZSpeed").value;
     g_CallPtzObj.method = "POST";
     g_CallPtzObj.username = g_UserName;
     g_CallPtzObj.password = g_Password;
     g_CallPtzObj.asynchrony = false;
     g_CallPtzObj.command = command;
     g_CallPtzObj.control = control;
     CallPtz(g_CallPtzObj);*/
}

//调用云台辅助开关
/*function SendCallAux(control)
 {
 //check user ritht
 if((0x00000001 & g_UserRight) == 0 )
 {
 alert(a_NoPopedom);
 return false;
 }
 
 if( CheckSpeed() == false )
 {
 return false;
 }
 
 g_CallPtzObj.callbackfunction = function(Obj){
 
 if( !Obj.result )
 {
 alert(a_ContralFail);
 }
 
 };
 
 g_CallPtzObj.channel = $("InputChannel").value;
 g_CallPtzObj.speed = $("PTZSpeed").value;
 g_CallPtzObj.method = "POST";
 g_CallPtzObj.username = g_UserName;
 g_CallPtzObj.password = g_Password;
 g_CallPtzObj.asynchrony = false;
 g_CallPtzObj.command = $("PtzAux").value;
 g_CallPtzObj.control = control;
 
 CallPtz(g_CallPtzObj);
 }
 */
//open the 3d
function Open3D(){
    try {
        var bRet = document.getElementById("Enable3D").checked;
        PlayCtrl.Set3DControl(bRet);
    } 
    catch (err) {
    }
    
}

function CheckSpeed(){
    if (isNaN($("PTZSpeed").value)) {
        alert(a_ParameterInvalid);
        $("PTZSpeed").value = "40";
        $("PTZSpeed").focus();
        return false;
    }
    
    if ($("PTZSpeed").value == "") {
        alert(a_ParameterInvalid);
        $("PTZSpeed").focus();
        return false;
    }
    
    if ($("PTZSpeed").value < 0) {
        $("PTZSpeed").value = 0;
        //return false;
    }
    
    if ($("PTZSpeed").value > 255) {
        $("PTZSpeed").value = 255;
    }
    return true;
}

//操作预置点
var g_CallPtzPPObj = new CallPtzPPObj();
/*function SendCallPtzPP(command)
 {
 var ptz = $("PresetPositSelect").value;
 if( isNaN(ptz) )
 {
 alert(a_ParameterInvalid);
 return false;
 }
 
 if( !CheckSpeed() )
 {
 alert(a_ParameterInvalid);
 return false;
 }
 
 g_CallPtzPPObj.callbackfunction = function(Obj){
 if( !Obj.result )
 {
 alert(a_ContralFail);
 }
 };
 
 g_CallPtzPPObj.method = "POST";
 g_CallPtzPPObj.asynchrony = false;
 g_CallPtzPPObj.username = g_UserName;
 g_CallPtzPPObj.password = g_Password;
 g_CallPtzPPObj.channel = $("InputChannel").value;
 g_CallPtzPPObj.command = command;
 g_CallPtzPPObj.control = $("PresetPositSelect").value - 1;
 g_CallPtzPPObj.speed = $("PTZSpeed").value;
 
 CallPtzPP(g_CallPtzPPObj);
 }*/
//控件调用预置点
function PlctrlCallPTZPP(value){
    if (!CheckUserRight(0x00000001)) {
        alert(a_notRightClose);
        return false;
    }
    
    if (CheckSpeed() == false) {
        return false;
    }
    
    $("PresetPositSelect").selectedIndex = value;
    
    PlayCtrl.PtzContrl(102, value, $("PTZSpeed").value);
}

function PlctrlReCallPTZPP(){
    var ptz = $("PresetPositSelect").value;
    
    if (isNaN(ptz)) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    if (String(ptz).indexOf(' ') >= 0) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    if (Number(ptz) < 0 || Number(ptz) > 255) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    
    PlctrlCallPTZPP(ptz);
}

//控件保存预置点
function PlctrlSavePTZPP(){

    if (!CheckUserRight(0x00000001)) {
        alert(a_notRightClose);
        return false;
    }
    
    var ptz = $("PresetPositSelect").value;
    
    if (isNaN(ptz)) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    if (String(ptz).indexOf(' ') >= 0) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    if (Number(ptz) < 0 || Number(ptz) > 255) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    
    if (CheckSpeed() == false) {
        return false;
    }
    
    PlayCtrl.PtzContrl(100, ptz, $("PTZSpeed").value);
}

//控件删除预置点
function PlctrlDelPTZPP(){

    if (!CheckUserRight(0x00000001)) {
        alert(a_notRightClose);
        return false;
    }
    
    var ptz = $("PresetPositSelect").value;
    
    if (isNaN(ptz)) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    if (String(ptz).indexOf(' ') >= 0) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    if (Number(ptz) < 0 || Number(ptz) > 255) {
        alert(a_ParameterInvalid);
        //$("inputPtzPP").value="";
        //$("inputPtzPP").focus();
        return false;
    }
    
    if (CheckSpeed() == false) {
        return false;
    }
    
    PlayCtrl.PtzContrl(101, ptz, $("PTZSpeed").value);
}

//预制点select操作 onkeypress
var g_strSelectValue = "";
function ChangePresetSelect(obj){
    if (obj.options[g_CurrentSelectLength]) {
        g_strSelectValue = obj.options[g_CurrentSelectLength].innerText + String.fromCharCode(event.keyCode);
    }
    else {
        g_strSelectValue = String.fromCharCode(event.keyCode);
    }
    
    obj.options[g_CurrentSelectLength] = new Option(g_strSelectValue, g_strSelectValue);
    obj.selectedIndex = g_CurrentSelectLength;
}

//预制点select操作 onfocus
var g_CurrentSelectLength = 0;
function RenewSelectFlag(obj){
    g_CurrentSelectLength = obj.length;
}

//预制点select操作 onkeyup
function EditPresetSelect(obj){
    if (obj.options[g_CurrentSelectLength]) {
        if (event.keyCode == 8) {
            var str = obj.options[g_CurrentSelectLength].innerText;
            obj.options[g_CurrentSelectLength].innerText = str.substring(0, str.length - 1);
            
            if (obj.options[g_CurrentSelectLength].innerText == "") {
                obj.remove(g_CurrentSelectLength);
            }
        }
        
        if (event.keyCode == 32) {
            obj.options[g_CurrentSelectLength].innerText += " ";
        }
    }
}

//预制点select操作 保存预制点 onblur
function SavePreserSelect(obj){
    if (g_strSelectValue == "") {
        return false;
    }
    
    if (isNaN(g_strSelectValue)) {
        alert(a_ParameterInvalid);
        obj.remove(g_CurrentSelectLength);
    }
    
    if (g_strSelectValue > 255 || g_strSelectValue < 1) {
        alert(a_ParameterInvalid);
        obj.remove(g_CurrentSelectLength);
    }
    
}



/*==========================================
 ============================================
 ==										  ==
 ==				视频参数代码段  	      ==
 ==										  ==
 ==			2011.01.26	By angel		  ==
 ============================================
 ==========================================*/
//display help information
function DisplayHelp(){
    //恢复默认值
    $("light").value = 120;
    $("contrast").value = 64;
    $("saturation").value = 64;
    $("color").value = 128;
    $("Acutance").value = 80;
    
    //设置视频参数
    SaveVideoParameter();
}

//设置滑块位置
function SetSliderValue(){
    var light = $("light").value;
    var contrast = $("contrast").value;
    var saturation = $("saturation").value;
    var color = $("color").value;
    var Acutance = $("Acutance").value;
    
    sliderImage1.setValue(light);
    sliderImage2.setValue(contrast);
    sliderImage3.setValue(saturation);
    sliderImage4.setValue(color);
    sliderImage5.setValue(Acutance);
}

//获取视频参数
function SendGetVideoParam(){
    g_SavePatamVideoObj.callbackfunction = function(Obj){
        if (Obj.result) {
            sliderImage1.setValue(Obj.light);
            sliderImage2.setValue(Obj.contrast);
            sliderImage3.setValue(Obj.satutation);
            sliderImage4.setValue(Obj.color);
            sliderImage5.setValue(Obj.acutance);
        }
        else {
            //alert("get video param fail!");
        }
    };
    
    g_SavePatamVideoObj.method = "POST";
    g_SavePatamVideoObj.asynchrony = true;
    g_SavePatamVideoObj.username = g_UserName;
    g_SavePatamVideoObj.password = g_Password;
    g_SavePatamVideoObj.channel = g_CurrentChannelNum;
    
    GetVideoParam(g_SavePatamVideoObj);
}

//保存视频参数
var g_SavePatamVideoObj = new VideoPatamObj();
function SendSetVideoParam(){
    var light = $("light").value;
    if (isNaN(light)) {
        alert(a_ParameterInvalid);
        $("light").value = "";
        $("light").focus();
        return false;
    }
    
    if (light > 255 || light < 0) {
        alert(a_ParameterInvalid);
        $("light").value = "";
        $("light").focus();
        return false;
    }
    
    var saturation = $("saturation").value;
    if (isNaN(saturation)) {
        alert(a_ParameterInvalid);
        $("saturation").value = "";
        $("saturation").focus();
        return false;
    }
    if (saturation > 255 || saturation < 0) {
        alert(a_ParameterInvalid);
        $("saturation").value = "";
        $("saturation").focus();
        return false;
    }
    
    var color = $("color").value;
    if (isNaN(color)) {
        alert(a_ParameterInvalid);
        $("color").value = "";
        $("color").focus();
        return false;
    }
    
    //锐度
    var acutance = $("Acutance").value;
    if (isNaN(acutance)) {
        alert(a_ParameterInvalid);
        $("Acutance").value = "";
        $("Acutance").focus();
        return false;
    }
    
    if (color > 255 || color < 0) {
        alert(a_ParameterInvalid);
        $("color").value = "";
        $("color").focus();
        return false;
    }
    
    var contrast = $("contrast").value;
    if (isNaN(contrast)) {
        alert(a_ParameterInvalid);
        $("contrast").value = "";
        $("contrast").focus();
        return false;
    }
    if (contrast > 255 || contrast < 0) {
        alert(a_ParameterInvalid);
        $("contrast").value = "";
        $("contrast").focus();
        return false;
    }
    
    g_SavePatamVideoObj.callbackfunction = function(Obj){
        if (!Obj.result) {
            //alert("save param video fail");
        }
    };
    
    g_SavePatamVideoObj.username = g_UserName;
    g_SavePatamVideoObj.password = g_Password;
    g_SavePatamVideoObj.channel = $("InputChannel").value;
    g_SavePatamVideoObj.light = light;
    g_SavePatamVideoObj.contrast = contrast;
    g_SavePatamVideoObj.satutation = saturation;
    g_SavePatamVideoObj.color = color;
    g_SavePatamVideoObj.acutance = acutance;
    
    g_SavePatamVideoObj.method = "POST";
    g_SavePatamVideoObj.asynchrony = true;
    
    SaveParamVideo(g_SavePatamVideoObj);
}

/*==========================================
 ============================================
 ==										  ==
 ==				图像模式代码段  	      ==
 ==										  ==
 ==			2011.01.26	By angel		  ==
 ============================================
 ==========================================*/
//判断当前按下的是否是数字键
function JudgeIsNumKey(){
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
    }
}

function JudgeLage(Obj){
    if (Obj.value > 255 || Obj.value < 0) {
        Obj.value = 255;
    }
}

//获取图像模式  
var g_PicModeObj = new PicModeObj();
function SendGetPicMode(){
    g_PicModeObj.callbackfunction = function(Obj){
        if (Obj.result) {
            g_PicModeObj = Obj;
            
            //获取系统时间
            SendGetServerTime();
        }
        else {
            //alert("get pic mode fail");
        }
    };
    
    g_PicModeObj.method = "POST";
    g_PicModeObj.asynchrony = true;
    g_PicModeObj.username = g_UserName;
    g_PicModeObj.password = g_Password;
    g_PicModeObj.channel = g_CurrentChannelNum;
    
    GetPicMode(g_PicModeObj);
}

//获取系统时间
var g_ServerTimeObj = new ServerTimeObj();
function SendGetServerTime(){
    g_ServerTimeObj.callbackfunction = function(obj){
        if (obj.result) {
            var strTime = parseInt(obj.ServerTimeHour) * 60 + parseInt(obj.ServerTimeMinute);
            
            //判断时间是否在预设模式中
            var StartTime = 0;
            var StopTime = 0;
            
            for (var j = 0; j < 4; j++) {
                StartTime = parseInt(g_PicModeObj.ScheduleInfo.ScheduleMode[j].byStartHour) * 60 + parseInt(g_PicModeObj.ScheduleInfo.ScheduleMode[j].byStartMin);
                StopTime = parseInt(g_PicModeObj.ScheduleInfo.ScheduleMode[j].byStopHour) * 60 + parseInt(g_PicModeObj.ScheduleInfo.ScheduleMode[j].byStopMin);
                
                if (strTime >= StartTime && strTime <= StopTime && g_PicModeObj.ScheduleInfo.ScheduleMode[j].byEnable) {
                    if (g_PicModeObj.ScheduleInfo.ScheduleMode[j].byEnable == 1) {
                        sliderImage1.setValue(g_PicModeObj.PreviewInfo.PreviewMode[j].Brightness);
                        sliderImage2.setValue(g_PicModeObj.PreviewInfo.PreviewMode[j].Contrast);
                        sliderImage3.setValue(g_PicModeObj.PreviewInfo.PreviewMode[j].Saturation);
                        sliderImage4.setValue(g_PicModeObj.PreviewInfo.PreviewMode[j].Hue);
                        sliderImage5.setValue(g_PicModeObj.ScheduleInfo.ScheduleMode[j].byAcutance);
                        
                        if (typeof(g_PicModeObj.ScheduleInfo.ScheduleMode[j].byAcutance) == "undefined") {
                            $("Acutance").value = 80;
                        }
                        
                        break;
                    }
                }
            }
            
            //图像模式选项卡初始值
            SelectPicMode();
            
        }
        else {
            //alert("get server time fail");
        }
    };
    
    g_ServerTimeObj.method = "POST";
    g_ServerTimeObj.asynchrony = true;
    g_ServerTimeObj.username = g_UserName;
    g_ServerTimeObj.password = g_Password;
    g_ServerTimeObj.channel = g_CurrentChannelNum;
    
    GetServerTime(g_ServerTimeObj);
}

//根据选择的模式显示不同的参数
function SelectPicMode(){
    var iMode = $("Mode").value;
    
    //是否启用
    if (g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byEnable != 0) {
        $("EnableMode").checked = "checked";
    }
    else {
        $("EnableMode").checked = "";
    }
    
    //视频参数
    $("mLight").value = g_PicModeObj.PreviewInfo.PreviewMode[iMode].Brightness;
    $("mContranst").value = g_PicModeObj.PreviewInfo.PreviewMode[iMode].Contrast;
    $("mSaturation").value = g_PicModeObj.PreviewInfo.PreviewMode[iMode].Saturation;
    $("mColor").value = g_PicModeObj.PreviewInfo.PreviewMode[iMode].Hue;
    
    //时间段
    $("StartHour").selectedIndex = g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStartHour;
    $("StartMin").selectedIndex = g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStartMin;
    $("StopHour").selectedIndex = g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStopHour;
    $("StopMin").selectedIndex = g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStopMin;
    $("mAcutance").value = g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byAcutance;
    
}


//设置推荐参数
function Commend(){
    var iMode = $("Mode").value;
    $("mLight").value = PicCommend[iMode].Light;
    $("mContranst").value = PicCommend[iMode].Contrast;
    $("mSaturation").value = PicCommend[iMode].Saturation;
    $("mColor").value = PicCommend[iMode].Hue;
    $("mAcutance").value = PicCommend[iMode].Acutance;
}

//预览当前设置
function Preview(){
    //跟新视频参数值
    $("light").value = $("mLight").value;
    $("contrast").value = $("mContranst").value;
    $("saturation").value = $("mSaturation").value;
    $("color").value = $("mColor").value;
    $("Acutance").value = $("mAcutance").value;
    
    //设置视频参数
    SaveVideoParameter();
}

//设置视频参数函数
function SaveVideoParameter(){
    //设置滑块位置
    SetSliderValue();
    
    //设置视频参数
    SendSetVideoParam();
}

//选择图像模式之前先保存先前的修改
function ClikMode(){
    var iMode = $("Mode").selectedIndex;
    g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStartHour = $("StartHour").selectedIndex;
    g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStartMin = $("StartMin").selectedIndex;
    g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStopHour = $("StopHour").selectedIndex;
    g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byStopMin = $("StopMin").selectedIndex;
    g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byEnable = $("EnableMode").checked ? 1 : 0;
    g_PicModeObj.ScheduleInfo.ScheduleMode[iMode].byAcutance = $("mAcutance").value;
    
    g_PicModeObj.PreviewInfo.PreviewMode[iMode].Brightness = $("mLight").value;
    g_PicModeObj.PreviewInfo.PreviewMode[iMode].Contrast = $("mContranst").value;
    g_PicModeObj.PreviewInfo.PreviewMode[iMode].Saturation = $("mSaturation").value;
    g_PicModeObj.PreviewInfo.PreviewMode[iMode].Hue = $("mColor").value;
}

//设置图像模式
function SendSetPicMode(){
    //保存先前的修改
    ClikMode();
    
    g_PicModeObj.callbackfunction = function(Obj){
        if (Obj.result) {
            alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
    };
    
    g_PicModeObj.method = "POST";
    g_PicModeObj.asynchrony = true;
    g_PicModeObj.username = g_UserName;
    g_PicModeObj.password = g_Password;
    g_PicModeObj.channel = $("InputChannel").value;
    
    SetPicMode(g_PicModeObj);
}

/*==========================================
 ============================================
 ==										  ==
 ==				视频回放代码段  	      ==
 ==										  ==
 ==			2011.02.16	By angel		  ==
 ============================================
 ==========================================*/
var bStartRecord = false;
var g_Interval = 0;
var g_bSelectLocate = false;
var g_strCurrentFile = "";
var g_IsSelectLocalFile = 0;

//视频回放
var g_PlaybackState = false;  //如果g_PlaybackState为true表示视频回放
function PlayBack(){

    $("VideoPlayContralDiv").style.display = "";
    $("VideoContralDiv").style.display = "none";
    try {
    
        PlayCtrl.EnableDrawMotion(true);
        PlayCtrl.SetCurrentDrawMode(4); //设置控件为视频回放模式
        g_PlaybackState = true;
		
    } 
    catch (err) {
    }
    //setTimeout("DisConnect()", 1300);
    setWindowNo(4);
    bStartRecord = false;
    g_bConnect = false;
}


//设置窗口
function setWindowNo(Number){

    try {
        PlayCtrl.SetWindowNum(Number); //设置窗口
    } 
    catch (err) {
    }
    
}

//set the start hour 
function SetSearchDate(){
    var strYear, strMonth, strDay;
    //set the hours
    for (var i = 0; i < 24; i++) {
        $("StartHour1").options[i] = new Option(i, i);
        $("StopHour1").options[i] = new Option(i, i);
        $("StopHour").options[i] = new Option(i, i);
        $("StartHour").options[i] = new Option(i, i);
    }
    
    //Set the minutes
    for (var j = 0; j < 60; j++) {
        $("StartMin1").options[j] = new Option(j, j);
        $("StopMin1").options[j] = new Option(j, j);
        $("StartMin").options[j] = new Option(j, j);
        $("StopMin").options[j] = new Option(j, j);
    }
    
    //$("divSearchControl").style.left = 400;
    //$("divSearchControl").style.top = 500;
    
    //Set the default value of stop hours and stop min
    $("StopHour1").selectedIndex = 23;
    $("StopMin1").selectedIndex = 59;
    
    var objDate = new Date();
    strYear = objDate.getFullYear();
    strMonth = parseInt(objDate.getMonth()) + 1;
    strDay = parseInt(objDate.getDate());
    strMonth = strMonth < 10 ? "0" + strMonth : strMonth;
    strDay = strDay < 10 ? "0" + strDay : strDay;
    $("SearchDateStartTime").value = strYear + "-" + strMonth + "-" + strDay;
    $("SearchDateStopTime").value = strYear + "-" + strMonth + "-" + strDay;
}

//排序
function BubbleSort(array){
    var temp;
    for (var i = 1; i < array.length; i++) {
        for (var j = array.length - 1; j >= i; j--) {
            if (array[j] <= array[j - 1]) {
                temp = array[j - 1];
                array[j - 1] = array[j];
                array[j] = temp;
            }
        }
    }
    
    return array;
}

function ChangeSearchFlieState(bFlag)
{
	if ( bFlag ) 
	{
		g_bRemoteFileSearchFlag = false;
		clearInterval(g_ProgressInterval);
		ShowProgress(false);
	    $("btnSearchRemote").disabled = false;
	    document.getElementsByTagName("body")[0].style.cursor = "auto";
	} 
	else 
	{
		$("btnSearchRemote").disabled = true;
		$("chart").style.display = "";
	    //$("percent").style.display = "";
		g_ProgressInterval = setInterval("ShowProgress(true)", 100);   //调用搜索文件之前开始显示进度条
		document.getElementsByTagName("body")[0].style.cursor = "progress";
	}
}

//Search the file 
var g_bRemoteFileSearchFlag = false;
var g_ProgressInterval = "";
var g_SearchFileInterval = "";
var g_iSearchStartTime = 0;		//开始时间
var g_iSearchFileStartTime = 0;	//搜索的开始时间
var g_iSearchEndTime = 0;		//结束时间
var g_iSearchFileEndTime = 0;	//搜索的结束时间
var g_sSearchStartDate = "";	//开始日期
var g_sSearchEndDate = "";		//结束日期
var g_iSearchFileChannel = 0;	//搜索通道
var g_sSearchDate = "";
function Search()
{
    if(!CheckUserRight(0x00000004))
	{
        alert(a_notRightClose);
        return false;
    }
    
    //获取需要搜索的通道
    CheckedRemoteSearchFileChannel();
    
    //如果一个通道都没有被选中
    if( g_iCheckedChannelCount <= 0)
	{
		alert(a_getChannel);
		return false;
	}
    
    g_IsSelectLocalFile = 0;
    g_iSearchFileChannel = 0;
    
    //Clear the table of file list
    ClearTable();
    
    //切换页面状态
    ChangeSearchFlieState(false);
    
	//获取远程文件
    if (!g_bRemoteFileSearchFlag) //取反
    {
        AddFileListTitle();
        g_bRemoteFileSearchFlag = true;
        
        PlayCtrl.Login(g_ServerIp, g_ServerPort, g_UserName, g_connectPassword, true);
        
        setTimeout("StartGetChannelRecordFile()", 500);
        
    	return true;
    }
}

var g_iSearchFileDayConut = 0;	//搜索的总天数
function StartGetChannelRecordFile()
{
	g_sSearchStartDate 		= $("SearchDateStartTime").value;
	g_sSearchEndDate 		= $("SearchDateStopTime").value;
	g_iSearchStartTime 		= parseInt($("StartHour1").value) * 60 + parseInt($("StartMin1").value);
	g_iSearchEndTime 		= parseInt($("StopHour1").value) * 60 + parseInt($("StopMin1").value);
	
	//获取开始日期和结束日期的差值
	var iDiffDay = DiffDays(g_sSearchStartDate, g_sSearchEndDate);
		
	g_iSearchFileDayConut = iDiffDay;
	//alert(g_iSearchFileDayConut);
	if( iDiffDay >=0 ) 
	{
		if ( iDiffDay > 2 ) 
		{
			ChangeSearchFlieState(true);
			alert(a_SearchMacDay);
			return false;
		}
		
		//搜索的开始时间
		g_iSearchFileStartTime = g_iSearchStartTime;
		
		if ( iDiffDay != 0 ) 
		{
			g_iSearchFileEndTime = 23*60+59;
		}
		else 
		{
			g_iSearchFileEndTime = g_iSearchEndTime;
		}
		
		g_sSearchDate = g_sSearchStartDate;
		GetChannelRecordFile();
	}
	else 
	{
		ChangeSearchFlieState(true);
		alert(a_ParameterInvalid);
		
	}
}

function GetChannelRecordFile()
{	
	if (g_ChannelList[g_iSearchFileChannel] == 1) 
    {
		//alert("g_sSearchDate="+g_sSearchDate+"  "+g_iSearchFileStartTime+" "+g_iSearchFileEndTime+" "+g_iSearchFileChannel);
    	PlayCtrl.SearchFile("*.*", g_sSearchDate, g_iSearchFileStartTime, g_iSearchFileEndTime, g_iSearchFileChannel);   	
    }
	
	g_SearchFileInterval = setInterval("GetRecordFile()", 5);
}


//Get file name from ocx
var g_iFileArrayFalg = 0;
var g_aFileArray = new Array();
var g_iSearchFileCurrentDay = 0;
function GetRecordFile()
{
	var strFile = PlayCtrl.GetRecordFileEx(g_iSearchFileChannel);
	
	//add row
	if (strFile == "" || strFile == "." || strFile == "..") 
	{
		return true;
	}
	  
	//如果当前搜索已经完成
	if (strFile == "-1") 
	{
		//g_aFileArray = BubbleSort(g_aFileArray);  取消页面排序
		clearInterval(g_SearchFileInterval);
		
		if ( g_iSearchFileCurrentDay < g_iSearchFileDayConut ) 
		{
			g_iSearchFileCurrentDay++;	//当前的搜索天数自增;
			
			//如果是最后一天
			if( g_iSearchFileCurrentDay == g_iSearchFileDayConut ) 
			{
				g_iSearchFileEndTime = g_iSearchEndTime;
			} 
			else 
			{
				g_iSearchFileEndTime = 23*60+59;
			}
			
			g_sSearchDate = AddDays(g_sSearchStartDate, g_iSearchFileCurrentDay);	//搜索日期自增;
			g_iSearchFileStartTime = 0;
			setTimeout("GetChannelRecordFile()", 500);
		} 
		else 
		{
			g_iSearchFileCurrentDay = 0;
			g_sSearchDate = g_sSearchStartDate;
			
			//搜索的开始时间
			//g_iSearchFileStartTime = g_iSearchStartTime;
			//g_iSearchFileEndTime = g_iSearchEndTime;
						
			if ( g_iSearchFileChannel < g_ChannelList.length ) 
			{
				g_iSearchFileChannel++;
				g_iFileArrayFalg = 0;
				g_aFileArray = [];
				
				setTimeout("StartGetChannelRecordFile()", 500);
			}
			else //如果所有通道都已经遍历了一次
			{
				//切换页面状态
				ChangeSearchFlieState(true);
				
			    g_bSelectLocate = false;
			    g_iSearchFileChannel = 0;
			}
		}
		
		return true;
	}
	
	g_aFileArray[g_iFileArrayFalg] = strFile;
	InsertRow(g_aFileArray[g_iFileArrayFalg], g_aFileArray[g_iFileArrayFalg], g_iSearchFileChannel);
	  
	g_iFileArrayFalg++;
	return false;
}

//显示进度条
var m_bar = 0, m_line = "|", m_amount = "|";
function ShowProgress(par){
    if (par) {
        if (m_bar < 99) {
            m_bar = m_bar + 2;
            m_amount = m_amount + m_line;
            $("chart").value = m_amount;
            $("percent").value = m_bar + "%";
        }
        else {
            m_bar = 0;
            m_amount = "|";
        }
    }
    else 
    {
        $("chart").style.display = "none";
        $("percent").style.display = "none";
        m_bar = 0;
        m_line = "|";
        m_amount = "|";
        $("chart").value = "";
        $("percent").value = "0%";
    }
}

function DiffDays(s1,s2)//计算相差的天数
{
	s1 = s1.replace(/-/g, "/");
	s2 = s2.replace(/-/g, "/");
	s1 = new Date(s1);
	s2 = new Date(s2);

	//var days= Math.abs(s2.getTime() - s1.getTime());
	var days= s2.getTime() - s1.getTime();
	var time = parseInt(days / (1000 * 60 * 60 * 24));

	return time;
}

function AddDays(d1, d2)
{
	d1 = d1.replace(/-/g, "/");
	d1 = new Date(d1);
	
	var days = d1.getTime();
	days += d2*(1000*60*60*24);
	days = new Date(days);
	
	return days.getFullYear()+"-"+(days.getMonth()+1)+"-"+days.getDate();
}


//Clear the table of file list
var bSearched = false;
function ClearTable()
{
    var styles = $("tbFileList");
    
    for (var i = tbFileList.rows.length - 1; i >= 0; i--) 
    {
        var tr = tbFileList.rows[i];
        styles.deleteRow(tr.id);
    }
    
    $("divFileList").style.display = "";
    
    try 
    {
    	PlayCtrl.ClearSearchList();
	} catch (e) 
	{
		
	}
}

//在表格前加一个表头
function AddFileListTitle()
{
    var td;
    var tr;
    var row = tbFileList.rows.length;
    tr = tbFileList.insertRow(row);
    var str = '<font size=2 color="#000000" style="font-weight:bold">&nbsp;' + a_ChannelName + '</font>';
    td = tr.insertCell(0);
    td.innerHTML = str;
    var strFile = '<font size=2 color="#000000" style="font-weight:bold">&nbsp;' + a_FileName + '</font>';
    td = tr.insertCell(1);
    td.innerHTML = strFile;
}


//Insert the file list into table
function InsertRow(strFile, idValue, iChannelNo){
    var td;
    var tr;
    var row = tbFileList.rows.length;
    var strChannel = interceptString(g_ChannelInfoObj.ChannelInfo[iChannelNo].ChannelName, 5);
    row = row < 0 ? 0 : row;
    tr = tbFileList.insertRow(row);
    if (g_IsSelectLocalFile == 1) {
    
        td = tr.insertCell(0);
        td.innerHTML = "";
    }
    else {
        td = tr.insertCell(0);
        td.innerHTML = strChannel;
    }
    
    
    td = tr.insertCell(-1);
    var str = '<font size=2 color="#000000">&nbsp;' + strFile + '</font>';
    td.innerHTML = str;
    tr.id = idValue+'$'+iChannelNo;
    tr.onmouseover = function(){
        return MouseOver(this);
    };
    tr.onmouseout = function(){
        return MouseOut(this);
    };
    tr.ondblclick = function(){
        return clickTable(this, iChannelNo);
    };
    tr.onclick = function(){
        return ClickRow(this);
    };
    tr.oncontextmenu = function(){
        return showMenu(this);
    };
    //tr.title = g_Doubleclickfiles;
    bSearched = true;
    //g_bPause = false;
    g_strCurrentFile = "";
    //$("btnPPause").value="播放";
    $(tr.id).style.cursor = "point";
    //document.getElementById().style.
}


////限制复选框选中的个数不能超过4个 如果超过4个则默认取消第个被选中的通道以此类推
function getCountChecked(id){

    var count = 0;
    if (idStr.length > 0) {
        idStr += ",";
    }
    idStr += id;
    var checkList = document.all.checkboxname;
    
    for (var i = 0; i < checkList.length; i++) {
        if (checkList[i].checked) {
            count++;
        }
    }
    if (count > 4) {
        var idArr = idStr.split(",");
        var firstId = idArr[0];
        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i].id == firstId) {
                checkList[i].checked = false;
            }
        }
        idStr = "";
        for (i = 1, s = idArr.length; i < s; i++) {
            idStr += idArr[i];
            if (i < s - 1) {
                idStr += ",";
            }
        }
    }
}

///获得 勾选的复选框
var g_ChannelList = new Array();
var g_iCheckedChannelCount = 0;
function CheckedRemoteSearchFileChannel()
{
	g_iCheckedChannelCount = 0;
	
	var arrCheckboxChecked = document.getElementsByName("checkboxname");
	
    for (var i = 0; i < arrCheckboxChecked.length; i++) 
    {
        if (arrCheckboxChecked[i].checked) 
        {
            g_ChannelList[arrCheckboxChecked[i].value] = 1; //选中则为1
            g_iCheckedChannelCount++;
        }
        else 
        {
        	g_ChannelList[arrCheckboxChecked[i].value] = 0; //没有选中则为0
        }
    }
}

function MouseOver(obj){
    if (g_strCurrentFile != obj.id) {
        obj.style.backgroundColor = '#b7b7b7';
    }
}

function MouseOut(obj){
    if (g_strCurrentFile != obj.id) {
        obj.style.background = '#F3F3F3';
        //obj.style.background='DCDCDC';
    }
}

//Down load file from server
function DownloadFile(){
	
	var str = g_CurrentDownloadFile.split("$");
		
    try 
    {
        PlayCtrl.DownLoadRemoteFileEx(g_ServerIp, str[0], "",str[1]);
    } 
    catch (err) 
    {
        alert(g_strUpdate);
    }
}

//on dbclick the row of table
function clickTable(obj, iChannel){
    try {
        g_bPause = false;
        g_Play = true;
        var strName = obj.id.split("$");
        
        if (g_bSelectLocate == false) 
        {
            PlayCtrl.PlayRemoteFileEx(strName[0], iChannel);
            $("sliderDemo5").style.display = "none";
        }
        else 
        {
            PlayCtrl.Play(strName[0]);
            //ChangePlayState(true);
        }
        //$("btnPPause").value=g_btnpause;
        
        if (g_IsMute != PlayCtrl.IsMute())
        {
            PlayCtrl.PutMute(g_IsMute);
        }
    } 
    catch (err) {
        //alert("Remote File Fail!");
    }
    //alert(obj.id);
}

function ClickRow(obj){
    g_strCurrentFile = obj.id;
    g_CurrentDownloadFile = obj.id;
    obj.style.background = '#CCCCCC';
    
    var tr = "";
    for (var i = 0; i < tbFileList.rows.length; i++) 
    {
        tr = tbFileList.rows[i];
        if (tr.id != obj.id) 
        {
            tr.style.background = '#FFFFFF';
        }
    }
}

function showMenu(obj){
    popMenu();
    event.returnValue = false;
    event.cancelBubble = true;
    g_CurrentDownloadFile = obj.id;
    return false;
}

var g_CurrentDownloadFile = "";
function popMenu(){

    //如果选择本地文件则不弹出下载对话框
    if (g_IsSelectLocalFile == 1) {
        return false;
    }
    
    //创建弹出菜单
    var pop = window.createPopup();
    
    //设置弹出菜单的内容
    pop.document.body.innerHTML = divDowndFile.innerHTML;
    var rowObjs = pop.document.body.all[0].rows;
    
    //获得弹出菜单的行数
    var rowCount = rowObjs.length;
    
    //循环设置每行的属性
    for (var i = 0; i < rowObjs.length; i++) {
        //设置是否显示该行
        rowObjs[i].style.display = "";
        
        //设置鼠标滑入该行时的效果
        rowObjs[i].cells[0].onmouseover = function(){
            //this.style.background="#818181";
            //this.style.color="white";
        };
        
        //设置鼠标滑出该行时的效果
        rowObjs[i].cells[0].onmouseout = function(){
            //this.style.background="#cccccc";
            //this.style.color="black";
        };
    }
    
    //屏蔽菜单的菜单
    pop.document.oncontextmenu = function(){
        return false;
    };
    
    //选择右键菜单的一项后，菜单隐藏
    pop.document.onclick = function(){
        pop.hide();
    };
    
    //显示菜单
    pop.show(event.clientX - 1, event.clientY, 100, rowCount * 25, document.body);
    return true;
}

function getPath(obj){
    if (obj) {
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select();
            return document.selection.createRange().text;
        }
        else 
            if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
                if (obj.files) {
                    return obj.files.item(0).getAsDataURL();
                }
                return obj.value;
            }
        return obj.value;
    }
}


//select locate file
function SelectLocal(){
    g_IsSelectLocalFile = 1;
    
    $("playFile").click();
    $("playFile").style.display = "";
    var ObjplayFile = $("playFile");
    var sFile = getPath(ObjplayFile);
    $("playFile").style.display = "none";
    //sFile_upl.select();
    //var sFile = document.selection.createRange().text;
    if (sFile == "") {
        return false;
    }
    ClearTable();
    g_bSelectLocate = true;
    
    if (sFile.indexOf(":\\") >= 0) {
        InsertRow(GetFileShortPath(sFile), sFile, 0);
    }
    else {
        InsertRow(sFile, sFile, 0);
    }
}

function GetFileShortPath(strFullPath){
    var Index = 0;
    var StrRet = "";
    
    if (strFullPath == "") {
        return "";
    }
    
    Index = strFullPath.lastIndexOf("\\");
    if (Index > 0) {
        StrRet = strFullPath.substring(Index + 1, strFullPath.length);
    }
    return StrRet;
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

var g_channName = new Array();

var g_ChannelInfoObj = new ChannelInfoObj();
var g_ArrChannelEnabledList = []; //启用了的通道信息列表
function SendGetChannelInfo(){
    g_ChannelInfoObj.callbackfunction = function(Obj){
        g_ChannelInfoObj = Obj;
        if (Obj.result) {
            var str = '<table border="0" width="100%" height="0" cellpadding="0" cellspacing="0" onselectstart="return false">';
            var j = 0;
            for (var i = 0; i < Obj.ChannelTotal; i++) 
            {
                g_channName[i] = interceptString(Obj.ChannelInfo[i].ChannelName, 7);
                if (Obj.ChannelInfo[i].ChannelEnable == 1) 
                {
                    if (j == 0) 
                    {
                        //str += '<tr><td id="ChannelListTd'+ i +'" height="30" align="left" style="cursor:pointer; color:#e98402; font-size:14px;" onmouseover="this.style.backgroundColor=\'#999\';" onmouseout="this.style.backgroundColor=\'transparent\';" ondblclick="ConnectVideoEx(\''+ Obj.ChannelInfo[i].ChannelId +'\',\'' + g_ChannelInfoObj.ChannelInfo[i].bySubStream + '\')"><img id="ChannelListImg'+ i +'" src="images/Camera1.gif" title="Camera" /> ' + Obj.ChannelInfo[i].ChannelName + '</td></tr>';
                        str += '<tr><td title='+ g_ChannelInfoObj.ChannelInfo[i].ChannelName +' id="ChannelListTd' + i + '" height="30" align="left" style="cursor:pointer; color:#e98402; font-size:14px;" onmouseover="this.style.backgroundColor=\'#999\';" onmouseout="this.style.backgroundColor=\'transparent\';" onmousemove="moveit();" onmouseup="stopdrag();" onmousedown="MoveDiv(\'' + Obj.ChannelInfo[i].ChannelId + '\',\'' + g_ChannelInfoObj.ChannelInfo[i].bySubStream + '\')"><img id="ChannelListImg' + i + '" src="images/Camera1.gif" title="Camera" /> ' + g_channName[i] + '</td></tr>';
                    }
                    else 
                    {
                        //str += '<tr><td id="ChannelListTd'+ i +'" height="30" align="left" style="cursor:pointer; font-size:14px;" onmouseover="this.style.backgroundColor=\'#999\';" onmouseout="this.style.backgroundColor=\'transparent\';" ondblclick="ConnectVideoEx(\''+ Obj.ChannelInfo[i].ChannelId +'\',\'' + g_ChannelInfoObj.ChannelInfo[i].bySubStream +'\')"><img id="ChannelListImg'+ i +'" src="images/Camera.gif" title="Camera" /> ' + Obj.ChannelInfo[i].ChannelName + '</td></tr>';
                        str += '<tr><td title='+ g_ChannelInfoObj.ChannelInfo[i].ChannelName +' id="ChannelListTd' + i + '" height="30" align="left" style="cursor:pointer; font-size:14px;" onmouseover="this.style.backgroundColor=\'#999\';" onmouseout="this.style.backgroundColor=\'transparent\';" onmousemove= "moveit();" onmouseup= "stopdrag();" onmousedown="MoveDiv(\'' + Obj.ChannelInfo[i].ChannelId + '\',\'' + g_ChannelInfoObj.ChannelInfo[i].bySubStream + '\')"><img id="ChannelListImg' + i + '" src="images/Camera.gif" title="Camera" /> ' + g_channName[i] + '</td></tr>';
                    }
                    g_ArrChannelEnabledList[j] = Obj.ChannelInfo[i].ChannelId;
                    j++;
                }
                
                $("SearchChannel").options[i] = new Option(Obj.ChannelInfo[i].ChannelName, Obj.ChannelInfo[i].ChannelId);
            }
            str += '</table>';
            
            $("ChannelListDiv").innerHTML = str;
            
            g_OldChannelTdNum = g_ArrChannelEnabledList[0];
			
            //连接视频
//            if (g_ChannelInfoObj.ChannelInfo[0].bySubStream == 1) {
//                ConnectServer(1);
//            }
//            else {
//                ConnectServer(0);
//            }
            
            //不判断  默认连接主码流
            ConnectServer(0);
            
        }
        else {
            //alert("get channel info fail!");
        }
        
        //获取设备的视频参数信息
        SendGetVideoParam();
    };
    g_ChannelInfoObj.method = "POST";
    g_ChannelInfoObj.asynchrony = true;
    g_ChannelInfoObj.username = g_UserName;
    g_ChannelInfoObj.password = g_Password;
    
    GetChannelInfo(g_ChannelInfoObj);
}


/////////////////////////////////////////////////////
////////循环添加通道树形带复选框的菜单列表/////////////
//直接从后台取出channelName截取，显示的时候显示截取过后的内容
var idStr = ""; //装所有的id号
function CreCheckDtreeChannel(){
    g_ChannelInfoObj.callbackfunction = function(Obj){
        g_ChannelInfoObj = Obj;
        if (Obj.result) {
        
            var str = '<form name="form1" >';
            str += '<table >';
            //alert(g_ChannelInfoObj.ChannelTotal);
            for (var i = 0; i < g_ChannelInfoObj.ChannelTotal; i += 3) 
            {
                g_channName[i] = interceptString(Obj.ChannelInfo[i].ChannelName, 6);
                g_channName[i + 1] = interceptString(Obj.ChannelInfo[i + 1].ChannelName, 6);
                g_channName[i + 2] = interceptString(Obj.ChannelInfo[i + 2].ChannelName, 6);
                
                if( g_ChannelInfoObj.ChannelInfo[i].ChannelEnable == 1 ) 
            	{
                	str += '<tr><td title='+ g_ChannelInfoObj.ChannelInfo[i].ChannelName +' id="Channel' + g_ChannelInfoObj.ChannelInfo[i].ChannelId + '"><input name="checkboxname" type="checkbox"  onclick="javascript:getCountChecked(this.id);" value="' + g_ChannelInfoObj.ChannelInfo[i].ChannelId + '"  />' + g_channName[i] + '</td>';
            	}
                
                if (i + 1 >= g_ChannelInfoObj.ChannelTotal) 
                {
                    str += '<td id="">&nbsp;</td>';
                }
                else 
                {
                	if( g_ChannelInfoObj.ChannelInfo[i+1].ChannelEnable == 1 ) 
                	{
                		str += '<td title='+ g_ChannelInfoObj.ChannelInfo[i+1].ChannelName +' id="Channel' + g_ChannelInfoObj.ChannelInfo[i + 1].ChannelId + '"><input name="checkboxname" type="checkbox"  onclick="javascript:getCountChecked(this.id);" value="' + g_ChannelInfoObj.ChannelInfo[i + 1].ChannelId + '"  />' + g_channName[i + 1] + '</td>';
					}
                }
                
                if (i + 2 >= g_ChannelInfoObj.ChannelTotal) 
                {
                    str += '<td id="">&nbsp;</td>';
                }
                else 
                {
                	if( g_ChannelInfoObj.ChannelInfo[i+2].ChannelEnable == 1 ) 
                	{
                		str += '<td title='+ g_ChannelInfoObj.ChannelInfo[i+2].ChannelName +' id="Channel' + g_ChannelInfoObj.ChannelInfo[i + 2].ChannelId + '"><input name="checkboxname" type="checkbox"  onclick="javascript:getCountChecked(this.id);" value="' + g_ChannelInfoObj.ChannelInfo[i + 2].ChannelId + '"  />' + g_channName[i + 2] + '</td>';
                	}
                }
                str += '</tr>';
            }
            
            str += '</table>';
            str += '</form>';
            document.getElementById("divChannelList").innerHTML = str;
        }
    };
}


function interceptString(str, len){
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        //if (str.charCodeAt(i) > 128) {
        strlen = strlen + 1;
        if (strlen > len) {
            return s.substring(0, s.length - 1) + "…";
        }
        // }
        // else {
        //  strlen = strlen + 1;
        // if (strlen > len) {
        //   return s.substring(0, s.length - 2) + "…";
        // }
        // }
        s = s + str.charAt(i);
    }
    return s;
}


//移动摄像机详细列表的层
var x, y;
var move = false; //布尔值，判断鼠标是否已按下，true为按下，false为未按下 
function MoveDiv(id, substream)
{
	ConnectVideoEx(id, substream);
	
	//todo 暂时不需要显示div
    return false;
	
    m_movecameradiv = document.getElementById("movecameradiv");
    var striFrame = '<iframe style="position:absolute; filter: Alpha(Opacity=0); z-index:-1;width:100%;height:100%;top:0px;left:0px;" scrolling="no"; frameborder="0" src="about:blank"></iframe><img src="images/Camera.gif" />'
    
    m_movecameradiv.innerHTML = striFrame + " " + g_ChannelInfoObj.ChannelInfo[id].ChannelName; //sIp
    m_movecameradiv.style.zIndex = 1000;
    m_movecameradiv.style.display = "block";
    m_movecameradiv.setCapture(); //当前对象捕获鼠标
        
    move = true;
    
    x = event.x; //获取鼠标指针位置相对于窗口的X坐标 
    y = event.y; //获取鼠标指针位置相对于窗口的Y坐标 
    m_movecameradiv.style.left = x - 90 + "px";
    m_movecameradiv.style.top = y + document.documentElement.scrollTop - 15 + "px";
}

function moveit(){
    //判断鼠标已被按下且onmouseover和onmousedown事件发生在同一对象上 
    if (move) {
        with (m_movecameradiv.style) {
            left = event.x - 90 + "px";
            top = event.y + document.documentElement.scrollTop - 15 + "px";
        }
    }
}

//停止层随鼠标移动
var g_movestate = false; //记录播放控件是否响应播放事件    false为不响应
function stopdrag()
{
	//todo 暂时不需要显示div
	return false;
	
	
    //onmouseup事件触发时说明鼠标已经松开，所以设置move变量值为false 
    move = false;
    m_movecameradiv.releaseCapture(); //释放当前对象的鼠标捕捉 
    m_movecameradiv.style.display = "none";
    g_movestate = true;
    setTimeout("g_movestate = false;", 300);
}

//全窗口响应鼠标拖动
document.onmousemove = function MoveDivDocument(){
    if (move) {
        m_movecameradiv.setCapture(); //捕获鼠标对象
        with (m_movecameradiv.style) {
            left = event.x - 90 + "px";
            top = event.y + document.documentElement.scrollTop - 15 + "px";
        }
    }
}

//全窗口响应鼠标释放
document.onmouseup = function MoveDivDocument(){
    if (move) {
        stopdrag();
    }
}



/*==========================================
 ============================================
 ==										  ==
 ==				压缩参数代码段  	      ==
 ==										  ==
 ==			2011.02.17	By angel		  ==
 ============================================
 ==========================================*/
//获取指定通道支持的视频编码类型
var g_VideoCodeTypeObj = new VideoCodeTypeObj(); //指定通道支持的视频编码类型对象
function SendGetVideoCodeType(){
    g_VideoCodeTypeObj.callbackfunction = function(Obj){
    
        if (Obj.result) {
            g_VideoCodeTypeObj = Obj;
            
            for (var i = 0; i < Obj.VideoCodeTypeTotal; i++) {
                $("CodeType").options[i] = new Option(Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeName, Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeId);
                //alert("i="+i+" "+"CodeTypeNum="+Obj.CodeTypeNum[i]+"  VideoTypeName="+Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeName + "  VideoTypeId=" + Obj.VideoCodeTypeInfo[Obj.CodeTypeNum[i]].VideoTypeId);
            }
            
            //获取设备压缩参数
            SendGetCompression();
        }
        else {
            //alert("get video code type fail!");
        }
    };
    
    g_VideoCodeTypeObj.method = "POST";
    g_VideoCodeTypeObj.asynchrony = true;
    g_VideoCodeTypeObj.username = g_UserName;
    g_VideoCodeTypeObj.password = g_Password;
    g_VideoCodeTypeObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetVideoCodeType(g_VideoCodeTypeObj);
}

var g_CompressionObj = new CompressionObj(); //指定通道的视频压缩参数对象
function SendGetCompression(){
    g_CompressionObj.callbackfunction = function(Obj){
        if (Obj.result) {
            g_CompressionObj = Obj;
            
            //初始化界面压缩参数设置项
            InitializationParameter();
        }
        else {
            //alert("get compression fail!");
        }
    };
    g_CompressionObj.method = "POST";
    g_CompressionObj.asynchrony = true;
    g_CompressionObj.username = g_UserName;
    g_CompressionObj.password = g_Password;
    g_CompressionObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetCompression(g_CompressionObj);
}


//初始化参数
function InitializationParameter(){
    //设置当前选择的视频流组合
    for (var t = 0; t < $("CodeType").options.length; t++) {
        if ($("CodeType").options[t].value == g_CompressionObj.CurrentCodeTypeId) {
            $("CodeType").selectedIndex = t;
            break;
        }
    }
    //alert(g_CompressionObj.CurrentCodeTypeId+ "   " + g_VideoCodeTypeObj.VideoCodeTypeInfo[g_CompressionObj.CurrentCodeTypeId].byStreamCount);
    //alert(g_VideoCodeTypeObj.VideoCodeTypeInfo[g_CompressionObj.CurrentCodeTypeId].byStreamCount+"    "+g_CompressionObj.CurrentCodeTypeId);
    //初始化其它参数
    for (var i = 0; i < g_VideoCodeTypeObj.VideoCodeTypeInfo[g_CompressionObj.CurrentCodeTypeId].byStreamCount; i++) {
        var byType = g_VideoCodeTypeObj.VideoCodeTypeInfo[g_CompressionObj.CurrentCodeTypeId].StreamDescription[i].byType; //码流类型0-压缩编码，1-数字或模拟输出
        if (byType == 0) //不显示数字或模拟输出的设置项
        {
            $("trParameterSetting" + i).style.display = "";
            
            //获取帧率列表参数
            var FramesRateList = g_VideoCodeTypeObj.VideoCodeTypeInfo[g_CompressionObj.CurrentCodeTypeId].StreamDescription[i].byFramesRateList;
            FramesRateList = FramesRateList.split(",");
            
            //初始化视频帧率下拉列表
            for (var j = 0; j < FramesRateList.length; j++) {
                $("VideowFrameRate" + i).options[j] = new Option(g_arrVideoFrameRate[FramesRateList[j]], FramesRateList[j]);
            }
            
            //设置码流类型
            $("StreamType" + i).selectedIndex = g_CompressionObj.Compression[i].byStreamType;
            
            //设置位率类型
            for (var k = 0; k < $("BitrateType" + i).options.length; k++) {
                if ($("BitrateType" + i).options[k].value == g_CompressionObj.Compression[i].byBitrateType) {
                    $("BitrateType" + i).selectedIndex = k;
                    break;
                }
            }
            
            //设置图像质量
            $("PicQuality" + i).selectedIndex = g_CompressionObj.Compression[i].byPicQuality;
            
            //设置码率上限
            var index = g_CompressionObj.Compression[i].dwVideoBitrate;
            if ((index >> 31) && 0x01) //self define
            {
            
                $("SelfStream" + i).disabled = "";
                $("SelfStream" + i).value = (index & 0x7fffffff) / 1024;
                //$("VideoBitrate" + i).selectedIndex = 24;
                for (var f = 0; f < $("VideoBitrate" + i).options.length; f++) {
                    if ($("VideoBitrate" + i).options[f].value == 24) {
                        $("VideoBitrate" + i).selectedIndex = f;
                        break;
                    }
                }
            }
            else {
                $("SelfStream" + i).disabled = "disabled";
                for (f = 0; f < $("VideoBitrate" + i).options.length; f++) {
                    if ($("VideoBitrate" + i).options[f].value == index) {
                        $("VideoBitrate" + i).selectedIndex = f;
                        break;
                    }
                }
            }
            
            //设置视频帧率
            for (var k = 0; k < $("VideowFrameRate" + i).options.length; k++) {
                if ($("VideowFrameRate" + i).options[k].value == g_CompressionObj.Compression[i].dwVideoFrameRate) {
                    $("VideowFrameRate" + i).selectedIndex = k;
                    break;
                }
            }
        }
    }
}

function SetValue(which){
    //页面初始化隐藏3个视频流参数设置界面
    for (var p = 0; p < 3; p++) {
        $("trParameterSetting" + p).style.display = "none";
        $("VideowFrameRate" + p).length = 0;
    }
    
    if (which == g_CompressionObj.CurrentCodeTypeId) {
        InitializationParameter();
    }
    else {
        //初始化其它列表
        for (var i = 0; i < g_VideoCodeTypeObj.VideoCodeTypeInfo[which].byStreamCount; i++) {
            var byType = g_VideoCodeTypeObj.VideoCodeTypeInfo[which].StreamDescription[i].byType; //码流类型0-压缩编码，1-数字或模拟输出
            if (byType == 0) //不显示数字或模拟输出的设置项
            {
                $("trParameterSetting" + i).style.display = "";
                
                //获取帧率列表参数
                var FramesRateList = g_VideoCodeTypeObj.VideoCodeTypeInfo[which].StreamDescription[i].byFramesRateList;
                FramesRateList = FramesRateList.split(",");
                
                //初始化视频帧率下拉列表
                for (var j = 0; j < FramesRateList.length; j++) {
                    $("VideowFrameRate" + i).options[j] = new Option(g_arrVideoFrameRate[FramesRateList[j]], FramesRateList[j]);
                }
                
                //设置图像大小格式索引
                g_CompressionObj.Compression[i].byResolution = g_VideoCodeTypeObj.VideoCodeTypeInfo[which].StreamDescription[i].byResolution;
                
                //编码格式
                g_CompressionObj.Compression[i].byFormat = g_VideoCodeTypeObj.VideoCodeTypeInfo[which].StreamDescription[i].byFormat;
                
                /*//设置码流类型
                 $("StreamType" + i).selectedIndex = 0;
                 
                 //设置位率类型
                 $("BitrateType" + i).selectedIndex = 0;
                 
                 //设置图像质量
                 $("PicQuality" + i).selectedIndex = 0;
                 
                 //设置码率上限
                 $("SelfStream" + i).style.display = "none";
                 $("VideoBitrate" + i).selectedIndex = 0;
                 
                 //设置视频帧率
                 $("VideowFrameRate" + i).selectedIndex = 0;*/
            }
        }
    }
}

function SendSetCompression(){
    g_CompressionObj.callbackfunction = function(Obj){
        if (Obj.result) {
            alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
    };
    g_CompressionObj.method = "POST";
    g_CompressionObj.asynchrony = true;
    g_CompressionObj.username = g_UserName;
    g_CompressionObj.password = g_Password;
    g_CompressionObj.CurrentChannelId = g_CurrentChannelNum;
    
    g_CompressionObj.CurrentCodeTypeId = parseInt($("CodeType").value); //当前的视频编码模式
    //获取其它参数
    for (var i = 0; i < g_VideoCodeTypeObj.VideoCodeTypeInfo[g_CompressionObj.CurrentCodeTypeId].byStreamCount; i++) {
        //保存码流类型
        g_CompressionObj.Compression[i].byStreamType = $("StreamType" + i).selectedIndex;
        
        //保存位率类型
        g_CompressionObj.Compression[i].byBitrateType = $("BitrateType" + i).value;
        
        //保存图像质量
        g_CompressionObj.Compression[i].byPicQuality = $("PicQuality" + i).selectedIndex;
        
        //获取码率上限
        var VideoBitrateValue = parseInt($("VideoBitrate" + i).value);
        //如果是自定义码率
        if (VideoBitrateValue == 24) {
            var selfStreamValue = $("SelfStream" + i).value;
            if (isNaN(selfStreamValue) || selfStreamValue.indexOf(".") >= 0) {
                alert(a_ParameterInvalid);
                $("SelfStream" + i).value = "";
                $("SelfStream" + i).focus();
                return false;
            }
            
            if (selfStreamValue <= 0) {
                alert(a_ParameterInvalid);
                $("SelfStream" + i).value = "";
                $("SelfStream" + i).focus();
                return false;
            }
            
            selfStreamValue *= 1024;
            if (selfStreamValue < 32 * 1024) {
                selfStreamValue = 32 * 1024;
            }
            if (selfStreamValue > 10240 * 1024) {
                selfStreamValue = 10240 * 1024;
            }
            
            selfStreamValue |= 0x80000000;
            
            g_CompressionObj.Compression[i].dwVideoBitrate = selfStreamValue;
        }
        else {
            g_CompressionObj.Compression[i].dwVideoBitrate = VideoBitrateValue;
        }
        
        //保存视频帧率
        g_CompressionObj.Compression[i].dwVideoFrameRate = $("VideowFrameRate" + i).value;
        
    }
    
    SetCompression(g_CompressionObj);
}

//码率上限
function SelectVideoBitrate(which){
    var value = $("VideoBitrate" + which).value;
    //判断是否是自定义码流
    if (value == 24) {
        $("SelfStream" + which).disabled = "";
        $("SelfStream" + which).focus();
    }
    else {
        $("SelfStream" + which).disabled = "disabled";
        //$("HiddenVideoBitrate" + which).value = value;
        //$("HiddenSelfStream" + which).value = 0;
    }
}


/*==========================================
 ============================================
 ==										  ==
 ==				OSD叠加代码段  		      ==
 ==										  ==
 ==			2011.02.17	By angel		  ==
 ============================================
 ==========================================*/
function EnableOsd(obj){
    if (obj.checked) {
        $("trDateType").disabled = "";
        $("Language").disabled = "";
        $("DisplayWeek").disabled = "";
    }
    else {
        $("trDateType").disabled = "disabled";
        $("Language").disabled = "disabled";
        $("DisplayWeek").disabled = "disabled";
    }
}

function EnableWeek(obj){
    if (obj.checked) {
        $("Language").disabled = "";
    }
    else {
        $("Language").disabled = "disabled";
    }
}

//获取视频叠加信息
g_VideoOsdObj = new VideoOsdObj();
function SendGetVideoOsd(){
    g_VideoOsdObj.callbackfunction = function(Obj){
        GetVideoOsdResult(Obj);
    };
    
    g_VideoOsdObj.method = "POST";
    g_VideoOsdObj.asynchrony = true;
    g_VideoOsdObj.username = g_UserName;
    g_VideoOsdObj.password = g_Password;
    g_VideoOsdObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetVideoOsd(g_VideoOsdObj);
}

function GetVideoOsdResult(Obj){
    if (Obj.result) {
        //set the osd position 
        /*var osdPosition = 0;
         if( Obj.ChX == 0 && Obj.ChY == 0 )
         {
         osdPosition = 0;
         }
         if( Obj.ChX == 100 && Obj.ChY == 0 )
         {
         osdPosition = 1;
         }
         
         if( Obj.ChX == 0 && Obj.ChY == 100 )
         {
         osdPosition = 2;
         }
         if( Obj.ChX == 100 && Obj.ChY == 100 )
         {
         osdPosition = 3;
         }
         
         var objOsd = document.getElementsByName("OsdPosition");
         for( var j = 0; j< objOsd.length; j++ )
         {
         if( objOsd[j].value == osdPosition )
         {
         objOsd[j].checked = true;
         break;
         }
         }*/
        $("CoordX").value = Obj.ChX;
        $("CoordY").value = Obj.ChY;
        
        $("ChannelX").value = Obj.OsdX;
        $("ChannelY").value = Obj.OsdY;
        
        for (var f = 0; f < $("RelativeTo0").options.length; f++) {
            if ($("RelativeTo0").options[f].value == Obj.byTimeCoordinateMode) {
                $("RelativeTo0").selectedIndex = f;
                break;
            }
        }
        
        for (f = 0; f < $("RelativeTo1").options.length; f++) {
            if ($("RelativeTo1").options[f].value == Obj.byNameCoordinateMode) {
                $("RelativeTo1").selectedIndex = f;
                break;
            }
        }
        
        for (f = 0; f < $("TimeType").options.length; f++) {
            if ($("TimeType").options[f].value == Obj.TimeFormat) {
                $("TimeType").selectedIndex = f;
                break;
            }
        }
        
        $("channelname").value = Obj.ChannelName;
        
        //判断是中文还是英文
        if (Obj.sWeekLanguage == 0) {
            $("Language").selectedIndex = 0; //中文
        }
        else {
            $("Language").selectedIndex = 1; //英文
        }
        
        //判断是否叠加时间
        if (Obj.EnableTime == 1) {
            $("EnableTime").checked = "checked";
        }
        else {
            $("EnableTime").checked = "";
        }
        
        //判断是否叠加星期
        if (Obj.DisplayWeek == 1) {
            $("DisplayWeek").checked = "checked";
        }
        else {
            $("DisplayWeek").checked = "";
        }
        
        //判断是否叠加通道名
        if (Obj.EnableChannel == 1) {
            $("EnableChannel").checked = "checked";
        }
        else {
            $("EnableChannel").checked = "";
        }
        
        EnableWeek($("DisplayWeek"));
        EnableOsd($("EnableTime"));
        
        //SendGetVideoMotion();
    }
    else {
        //alert("get osd fail!");
    }
}

function SendSetVideoOsd(){
    g_VideoOsdObj.callbackfunction = function(Obj){
        if (Obj.result) {
            //alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
    };
    
    g_VideoOsdObj.method = "POST";
    g_VideoOsdObj.asynchrony = true;
    g_VideoOsdObj.username = g_UserName;
    g_VideoOsdObj.password = g_Password;
    g_VideoOsdObj.CurrentChannelId = g_CurrentChannelNum;
    
    
    var EnableChannel = $("EnableChannel").checked ? 1 : 0;
    var EnableTime = $("EnableTime").checked ? 1 : 0;
    var DisplayWeek = $("DisplayWeek").checked ? 1 : 0;
    
    var strChName = $("channelname").value;
    strChName = strChName.replace(/^\s+|\s+$/g, "");
    
    
    if (strChName == "") {
        alert(a_ParameterInvalid);
        $("channelname").focus();
        return false;
    }
    
    if (isNaN($("CoordX").value)) {
        alert(a_ParameterInvalid);
        $("CoordX").value = "";
        $("CoordX").focus();
        return false;
    }
    
    if (isNaN($("CoordY").value)) {
        alert(a_ParameterInvalid);
        $("CoordY").value = "";
        $("CoordY").focus();
        return false;
    }
    
    if (isNaN($("ChannelX").value)) {
        alert(a_ParameterInvalid);
        $("ChannelX").value = "";
        $("ChannelX").focus();
        return false;
    }
    
    
    if (isNaN($("ChannelY").value)) {
        alert(a_ParameterInvalid);
        $("ChannelY").value = "";
        $("ChannelY").focus();
        return false;
    }
    
    if ($("CoordX").value > 704 || $("CoordX").value < 0) {
        alert(a_ParameterInvalid);
        $("CoordX").value = "";
        $("CoordX").focus();
        return false;
    }
    
    if ($("ChannelX").value > 704 || $("ChannelX").value < 0) {
        alert(a_ParameterInvalid);
        $("ChannelX").value = "";
        $("ChannelX").focus();
        return false;
    }
    
    if ($("CoordY").value > 576 || $("CoordY").value < 0) {
        alert(a_ParameterInvalid);
        $("CoordY").value = "";
        $("CoordY").focus();
        return false;
    }
    
    if ($("ChannelY").value > 576 || $("ChannelY").value < 0) {
        alert(a_ParameterInvalid);
        $("ChannelY").value = "";
        $("ChannelY").focus();
        return false;
    }
    
    g_VideoOsdObj.EnableChannel = EnableChannel;
    g_VideoOsdObj.EnableTime = EnableTime;
    g_VideoOsdObj.ChX = $("CoordX").value;
    g_VideoOsdObj.ChY = $("CoordY").value;
    g_VideoOsdObj.OsdX = $("ChannelX").value;
    g_VideoOsdObj.OsdY = $("ChannelY").value;
    g_VideoOsdObj.TimeFormat = $("TimeType").value;
    g_VideoOsdObj.sWeekLanguage = $("Language").value;
    g_VideoOsdObj.DisplayWeek = DisplayWeek;
    g_VideoOsdObj.ChannelName = strChName;
    g_VideoOsdObj.byTimeCoordinateMode = $("RelativeTo0").value;
    g_VideoOsdObj.byNameCoordinateMode = $("RelativeTo1").value;
    
    SetVideoOsd(g_VideoOsdObj);
}

function SetVideoOsdResult(Obj){
    if (Obj.result) {
        //alert(a_succeed);
    }
    else {
        alert(a_faild);
    }
}


/*==========================================
 ============================================
 ==										  ==
 ==				移动侦测代码段  	      ==
 ==										  ==
 ==			2011.03.01	By angel		  ==
 ============================================
 ==========================================*/
var g_VideoMotionObj = new VideoMotionObj();
function SendGetVideoMotion(){
    g_VideoMotionObj.callbackfunction = function(Obj){
        GetVideoMotionResult(Obj);
    };
    
    g_VideoMotionObj.method = "POST";
    g_VideoMotionObj.asynchrony = true;
    g_VideoMotionObj.username = g_UserName;
    g_VideoMotionObj.password = g_Password;
    g_VideoMotionObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetVideoMotion(g_VideoMotionObj);
}

function GetVideoMotionResult(Obj){
    g_VideoMotionObj = Obj;
    
    if (g_WeekDate >= 0) {
        $("Week").selectedIndex = g_WeekDate;
    }
    else {
        $("Week").selectedIndex = 6; //星期天
    }
    
    if (g_VideoMotionObj.result) {
        //判断是否处理移动侦测
        if (g_VideoMotionObj.EnableMotion == 1) {
            $("EnableMotion").checked = "checked";
        }
        else {
            $("EnableMotion").checked = "";
        }
        
        //移动侦测灵敏度, 0 - 5,越高越灵敏
        $("Sensitive").selectedIndex = g_VideoMotionObj.byMotionSensitive;
        
        //移动侦测阀值  越小越灵敏
        for (var f = 0; f < $("valv").options.length; f++) {
            if ($("valv").options[f].value == g_VideoMotionObj.byMotionThreshold) {
                $("valv").selectedIndex = f;
                break;
            }
        }
        
        //设置移动侦测区域
        GetMotionRect();
        
        //设置报警处理方式
        SetAlarmHandleType(g_VideoMotionObj.dwHandleType);
        
        //云台联动
        if (g_VideoMotionObj.struAlarmTransFer == 1) {
            $("EnablePTZ").checked = "checked";
        }
        else {
            $("EnablePTZ").checked = "";
        }
        
        //是否处理报警
        if (g_VideoMotionObj.byEnableHandleMotion == 1) {
            $("HandleAlarmIn").checked = "checked";
            
            $("Out1").disabled = "";
            $("SelectAlarmOutPut1").disabled = "";
        }
        else {
            $("HandleAlarmIn").checked = "";
            
            $("Out1").disabled = "disabled";
            $("SelectAlarmOutPut1").disabled = "disabled";
        }
        
        //是否触发报警输出
        for (var m = 0; m < 4; m++) {
            if (g_VideoMotionObj.byRelAlarmOutEnable.AlarmOutEnable[m] == 1) {
                $("Out" + (m + 1)).checked = "checked";
                $("SelectAlarmOutPut" + (m + 1)).selectedIndex = g_VideoMotionObj.byRelAlarmOut.AlarmOut[m];
            }
            else {
                $("Out" + (m + 1)).checked = "";
                $("SelectAlarmOutPut" + (m + 1)).selectedIndex = g_VideoMotionObj.byRelAlarmOut.AlarmOut[m];
            }
            
            //alert(g_VideoMotionObj.byRelAlarmOut.AlarmOut[m] + "  " + g_VideoMotionObj.byRelAlarmOutEnable.AlarmOutEnable[m]);
        }
        
        //给页面赋值
        SetAlarmTime();
        
        //给报警处理页面赋值
        SetEnableHandle();
        
        //SendGetDeviceInfo();
    }
    else {
        //alert("get video motion fail!");
    }
}

//设置报警处理方式
function SetAlarmHandleType(iMask){
    if ((iMask & 0x04) == 0x04) {
        $("Center").checked = true; //上传中心
    }
    
    if ((iMask & 0x08) == 0x08) {
        $("TigerAlarmIn").checked = true; //是否触发报警输出
    }
    else {
        $("TigerAlarmIn").checked = false;
    }
}

var g_MotionStart = false;
function GetMotionRect(){
    var x = 0;
    var y = 0;
    var cx = 0;
    var cy = 0;
    
    DisConnect();
    
    //侦测区域个数，必须小于或等于5
    var MountCount = g_VideoMotionObj.byMotionScopeNum;
    
    try {
    
        PlayCtrl.ResetDrawMotionRect();
    } 
    catch (err) {
    }
    
    var m = 0;
    for (var j = 0; j < 5; j++) {
        x = g_VideoMotionObj.struMotionScope[j].wAreaTopLeftX;
        y = g_VideoMotionObj.struMotionScope[j].wAreaTopLeftY;
        cx = g_VideoMotionObj.struMotionScope[j].wAreaWidth;
        cy = g_VideoMotionObj.struMotionScope[j].wAreaHeight;
        
        try {
            if (x != 0 || y != 0 || cx != 0 || cy != 0) {
                //var s = "x=" + x + ";y=" + y + ";cx=" + cx + "; cy=" + cy;
                PlayCtrl.SetDrawMotionRect(MountCount, m, x, y, cx, cy);
                m++;
            }
            PlayCtrl.EnableDrawMotion(true);
            PlayCtrl.SetCurrentDrawMode(1); //设置控件为移动侦测模式
            g_MotionStart = true;
            
        } 
        catch (err) {
        }
        
        
//        if (g_ChannelInfoObj.ChannelInfo[g_CurrentChannelNum].bySubStream == 1) {
//            ConnectServer(1);
//        }
//        else {
//            ConnectServer(0);
//        }
        
        //不判断  默认连接主码流
        ConnectServer(0);
    }
}

function SetAlarmTime(){
    var wDayOfWeek = 0;
    //var wSegement = 0;
    wDayOfWeek = $("Week").selectedIndex;
    //alert(wDayOfWeek);
    
    for (var j = 0; j < 4; j++) {
        var startHour = Number(g_VideoMotionObj.struAlarmTime.MotionDay[wDayOfWeek].Segment[j].byStartHour);
        var startMin = Number(g_VideoMotionObj.struAlarmTime.MotionDay[wDayOfWeek].Segment[j].byStartMin);
        var stopHour = Number(g_VideoMotionObj.struAlarmTime.MotionDay[wDayOfWeek].Segment[j].byStopHour);
        var stopMin = Number(g_VideoMotionObj.struAlarmTime.MotionDay[wDayOfWeek].Segment[j].byStopMin);
        
        if (startHour > 23) {
            startHour = 23;
            startMin = 59;
        }
        
        if (startMin > 59) {
            startMin = 59;
        }
        
        if (startHour < 0) {
            startHour = 0;
            startMin = 0;
        }
        
        if (startMin < 0) {
            startMin = 0;
        }
        
        if (stopHour > 23) {
            stopHour = 23;
            stopMin = 59;
        }
        
        if (stopMin > 59) {
            stopMin = 59;
        }
        
        if (stopHour < 0) {
            stopHour = 0;
            stopMin = 0;
        }
        
        if (stopMin < 0) {
            stopMin = 0;
        }
        
        $("startHour" + j).selectedIndex = startHour;
        $("startMinute" + j).selectedIndex = startMin;
        $("stopHour" + j).selectedIndex = stopHour;
        $("stopMinute" + j).selectedIndex = stopMin;
        
    }
}

//复制时间段
function CopySame(){
    g_iCopyWeek = $("CopyWeek").value;
    
    var iType = 0;
    var iCurrent = 0;
    //get current set
    iCurrent = $("Week").value;
    iType = $("CopyWeek").value;
    
    if (iType == -1) //copy to every day
    {
        for (var i = 0; i < 7; i++) {
            if (i != iCurrent) {
                for (var j = 0; j < 4; j++) {
                    g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStartHour = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStartHour;
                    g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStartMin = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStartMin;
                    g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStopHour = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStopHour;
                    g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStopMin = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStopMin;
                }
            }
        }
    }
    else //copy to special day
    {
        for (var j = 0; j < 4; j++) {
            g_VideoMotionObj.struAlarmTime.MotionDay[iType].Segment[j].byStartHour = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStartHour;
            g_VideoMotionObj.struAlarmTime.MotionDay[iType].Segment[j].byStartMin = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStartMin;
            g_VideoMotionObj.struAlarmTime.MotionDay[iType].Segment[j].byStopHour = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStopHour;
            g_VideoMotionObj.struAlarmTime.MotionDay[iType].Segment[j].byStopMin = g_VideoMotionObj.struAlarmTime.MotionDay[iCurrent].Segment[j].byStopMin;
        }
    }
}


function SetSegment(){
    var iDay = Number($("Week").selectedIndex);
    for (var j = 0; j < 4; j++) {
        g_VideoMotionObj.struAlarmTime.MotionDay[iDay].Segment[j].byStartHour = $("startHour" + j).value;
        g_VideoMotionObj.struAlarmTime.MotionDay[iDay].Segment[j].byStartMin = $("startMinute" + j).value;
        g_VideoMotionObj.struAlarmTime.MotionDay[iDay].Segment[j].byStopHour = $("stopHour" + j).value;
        g_VideoMotionObj.struAlarmTime.MotionDay[iDay].Segment[j].byStopMin = $("stopMinute" + j).value;
    }
}

function SetEnableHandle(){
    if (!$("HandleAlarmIn").checked) {
        $("EnablePTZ").checked = false;
        $("TigerAlarmIn").checked = false;
        $("Center").checked = false;
        
        for (var i = 1; i <= 4; i++) {
            $("Out" + i).disabled = "disabled";
            $("SelectAlarmOutPut" + i).disabled = "disabled";
            $("Out" + i).checked = false;
        }
        
        $("EnablePTZ").disabled = "disabled";
        $("TigerAlarmIn").disabled = "disabled";
        $("Out1").disabled = "disabled";
        $("Center").disabled = "disabled";
    }
    else {
        $("EnablePTZ").disabled = "";
        $("TigerAlarmIn").disabled = "";
        $("Center").disabled = "";
        
        for (var i = 1; i <= 4; i++) {
            $("Out" + i).disabled = "";
            $("SelectAlarmOutPut" + i).disabled = "";
        }
    }
}

function TigerAlarm1(){
    if (!$("TigerAlarmIn").checked) {
        for (var i = 1; i <= 4; i++) {
            $("Out" + i).disabled = "disabled";
            $("SelectAlarmOutPut" + i).disabled = "disabled";
        }
    }
    else {
        for (var i = 1; i <= 4; i++) {
            $("Out" + i).disabled = "";
            $("SelectAlarmOutPut" + i).disabled = "";
        }
    }
}

function SendSetVideoMotion(opt){
    var Rect1 = new Array();
    var Rect2 = new Array();
    var Rect3 = new Array();
    var Rect4 = new Array();
    var Rect5 = new Array();
    var str = "";
    
    g_VideoMotionObj.callbackfunction = function(Obj){
        if (Obj.result) {
            alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
    };
    
    g_VideoMotionObj.method = "POST";
    g_VideoMotionObj.asynchrony = true;
    g_VideoMotionObj.username = g_UserName;
    g_VideoMotionObj.password = g_Password;
    g_VideoMotionObj.CurrentChannelId = g_CurrentChannelNum;
    
    str = PlayCtrl.GetDrawMotionRect(0);
    Rect1 = str.split("|");
    
    str = PlayCtrl.GetDrawMotionRect(1);
    Rect2 = str.split("|");
    
    str = PlayCtrl.GetDrawMotionRect(2);
    Rect3 = str.split("|");
    
    str = PlayCtrl.GetDrawMotionRect(3);
    Rect4 = str.split("|");
    
    str = PlayCtrl.GetDrawMotionRect(4);
    Rect5 = str.split("|");
    
    g_VideoMotionObj.EnableMotion = $("EnableMotion").checked ? 1 : 0;//是否启用移动侦测
    g_VideoMotionObj.byMotionSensitive = $("Sensitive").value; //移动侦测灵敏度
    g_VideoMotionObj.byMotionThreshold = $("valv").value; //移动侦测阀值
    g_VideoMotionObj.byMotionScopeNum = PlayCtrl.GetDrawMotionCount(); //侦测区域个数
    if (opt == 1) {
        PlayCtrl.ResetDrawMotionRect();
        for (var i = 0; i < 5; i++) {
            g_VideoMotionObj.struMotionScope[i].wAreaTopLeftX = 0;
            g_VideoMotionObj.struMotionScope[i].wAreaTopLeftY = 0;
            g_VideoMotionObj.struMotionScope[i].wAreaWidth = 0;
            g_VideoMotionObj.struMotionScope[i].wAreaHeight = 0;
        }
    }
    else {
        //侦测区域范围
        for (var i = 0; i < 5; i++) {
            g_VideoMotionObj.struMotionScope[i].wAreaTopLeftX = eval("Rect" + (i + 1) + "[0]");
            g_VideoMotionObj.struMotionScope[i].wAreaTopLeftY = eval("Rect" + (i + 1) + "[1]");
            g_VideoMotionObj.struMotionScope[i].wAreaWidth = eval("Rect" + (i + 1) + "[2]");
            g_VideoMotionObj.struMotionScope[i].wAreaHeight = eval("Rect" + (i + 1) + "[3]");
        }
    }
    
    g_VideoMotionObj.struAlarmTransFer = $("EnablePTZ").checked ? 1 : 0; //是否启用云台
    g_VideoMotionObj.byEnableHandleMotion = $("HandleAlarmIn").checked ? 1 : 0; //是否处理报警
    //报警输出
    for (var n = 0; n < 4; n++) {
        if ($("Out" + (n + 1)).checked) {
            g_VideoMotionObj.byRelAlarmOutEnable.AlarmOutEnable[n] = 1;
            g_VideoMotionObj.byRelAlarmOut.AlarmOut[n] = $("SelectAlarmOutPut" + (n + 1)).selectedIndex;
        }
        else {
            g_VideoMotionObj.byRelAlarmOutEnable.AlarmOutEnable[n] = 0;
            g_VideoMotionObj.byRelAlarmOut.AlarmOut[n] = $("SelectAlarmOutPut" + (n + 1)).selectedIndex;
        }
        
        //alert(g_VideoMotionObj.byRelAlarmOut.AlarmOut[n] + "  " + g_VideoMotionObj.byRelAlarmOutEnable.AlarmOutEnable[n]);
    }
    
    //报警处理方式	
    if ($("Center").checked) {
        g_VideoMotionObj.dwHandleType |= 0x04;
        g_VideoMotionObj.dwHandleType |= 0x10;
    }
    else {
        g_VideoMotionObj.dwHandleType &= ~ 0x04;
        g_VideoMotionObj.dwHandleType &= ~ 0x10;
    }
    
    if ($("TigerAlarmIn").checked) {
        g_VideoMotionObj.dwHandleType |= 0x08;
    }
    else {
        g_VideoMotionObj.dwHandleType &= ~ 0x08;
    }
    
    //验证设置时间的合法性
    for (var k = 0; k < 4; k++) {
        if (parseInt($("startHour" + k).value) > parseInt($("stopHour" + k).value)) {
            alert(a_ParameterInvalid);
            return false;
        }
        
        if ((parseInt($("startHour" + k).value) == parseInt($("stopHour" + k).value)) && (parseInt($("startMinute" + k).value) > parseInt($("stopMinute" + k).value))) {
            alert(a_ParameterInvalid);
            return false;
        }
    }
    
    //时间段
    /*for( var i= 0; i< 7 ; i++ )
     {
     for(var j=0; j<4; j++ )
     {
     g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStartHour = g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStartHour;
     g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStartMin = g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStartMin;
     g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStopHour = g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStopHour;
     g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStopMin = g_VideoMotionObj.struAlarmTime.MotionDay[i].Segment[j].byStopMin;
     }
     }*/
    SetVideoMotion(g_VideoMotionObj);
}


/*==========================================
 ============================================
 ==										  ==
 ==				设备信息代码段  	      ==
 ==										  ==
 ==			2011.03.01	By angel		  ==
 ============================================
 ==========================================*/
var g_NetWorkInfoObj = new NetWorkObj(); //网络信息
var g_DeviceInfoObj = new DeviceInfoObj(); //设备信息
function SendGetDeviceInfo(){
    g_DeviceInfoObj.callbackfunction = function(Obj){
        g_DeviceInfoObj = Obj;
        
        if (g_DeviceInfoObj.result) {
            $("vdeostand").selectedIndex = g_DeviceInfoObj.dwVideoStandard; //制式
            $("ServerName").value = g_DeviceInfoObj.sDVSName; //设备名称			
            $("spDeviceSerialNumber").innerText = g_DeviceInfoObj.szSerialNumber; //产品序列号
            $("SoftVersion").innerText = g_DeviceInfoObj.dwSoftwareVersion + "Build" + g_DeviceInfoObj.dwSoftwareBuildDate; //软件版本
            $("HardwareVersion").innerText = g_DeviceInfoObj.dwHardwareVersion; //硬件版本
            $("ChannelCount").innerText = g_DeviceInfoObj.byChanNum; //通道数
            //设备类型
            var strExternType = parseInt(g_DeviceInfoObj.byDVSType);
            var strDeviceType = "";
            
            if (strExternType == 3) //视频服务器
            {
                strDeviceType = "DVS";
            }
            else 
                if (strExternType == 4) //标清解码器
                {
                    strDeviceType = "DEC";
                }
                else 
                    if (strExternType == 5) //高清解码器
                    {
                        strDeviceType = "HD_DEC";
                    }
                    else 
                        if (strExternType == 6) //高清NVR
                        {
                            strDeviceType = "HD_NVR";
                        }
                        else 
                            if (strExternType == 7) //存储服务器
                            {
                                strDeviceType = "HD_STORAGE";
                            }
                            else 
                                if (strExternType == 8) //转发器
                                {
                                    strDeviceType = "HD_TURN";
                                }
                                else 
                                    if (strExternType == 9) //电视墙解码器
                                    {
                                        strDeviceType = "HD_TVWALL";
                                    }
                                    else 
                                        if (strExternType == 12) //15/17编码模块
                                        {
                                            strDeviceType = "DVS_IPCAMERA";
                                        }
                                        else 
                                            if (strExternType == 13) //1080p10(摄像机)
                                            {
                                                strDeviceType = "HD_IPC 1080P NRT";
                                            }
                                            else 
                                                if (strExternType == 14) //720p(摄像机)
                                                {
                                                    strDeviceType = "HD_IPC 720P";
                                                }
                                                else 
                                                    if (strExternType == 15) //D1(摄像机)
                                                    {
                                                        strDeviceType = "IPC D1";
                                                    }
                                                    else 
                                                        if (strExternType == 16) //1080p30(摄像机)
                                                        {
                                                            strDeviceType = "HD_IPC 1080P RT";
                                                        }
                                                        else 
                                                            if (strExternType == 21) //D1编码模块(BNC输入)
                                                            {
                                                                strDeviceType = "HD_NVS D1";
                                                            }
                                                            else 
                                                                if (strExternType == 22) //高清编码模块(YPbPr输入)
                                                                {
                                                                    strDeviceType = "HD_NVS";
                                                                }
                                                                else 
                                                                    if (strExternType == 23) //SC110编码模块
                                                                    {
                                                                        strDeviceType = "SC110_CAM";
                                                                    }
                                                                    else 
                                                                        if (strExternType == 31) //模拟CAM
                                                                        {
                                                                            strDeviceType = "ANALOG_CAM";
                                                                        }
                                                                        else 
                                                                            if (strExternType == 32) //1M网络摄像机
                                                                            {
                                                                                strDeviceType = "HD_IPC_1M";
                                                                            }
                                                                            else 
                                                                                if (strExternType == 33) //2M网络摄像机
                                                                                {
                                                                                    strDeviceType = "HD_IPC_2M";
                                                                                }
                                                                                else 
                                                                                    if (strExternType == 34) //3M网络摄像机
                                                                                    {
                                                                                        strDeviceType = "HD_IPC_3M";
                                                                                    }
                                                                                    else 
                                                                                        if (strExternType == 35) //5M网络摄像机
                                                                                        {
                                                                                            strDeviceType = "HD_IPC_5M";
                                                                                        }
                                                                                        else 
                                                                                            if (strExternType == 36) //2M18倍网络一体机
                                                                                            {
                                                                                                strDeviceType = "HD_IPC_2M";
                                                                                            }
                                                                                            else 
                                                                                                if (strExternType == 37) //2M16倍网络一体机
                                                                                                {
                                                                                                    strDeviceType = "HD_IPC_2M";
                                                                                                }
                                                                                                else 
                                                                                                    if (strExternType == 38) //2M22倍网络一体机
                                                                                                    {
                                                                                                        strDeviceType = "HD_IPC_2M";
                                                                                                    }
                                                                                                    else 
                                                                                                        if (strExternType == 39) //D1摄像机
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
            $("spDeviceType").innerText = strDeviceType;
            
            //获取网络信息
            SendGetNetWorkInfo();
            
        }
        else {
            //alert("get device info fail!");
        }
        
    };
    g_DeviceInfoObj.method = "POST";
    g_DeviceInfoObj.asynchrony = true;
    g_DeviceInfoObj.username = g_UserName;
    g_DeviceInfoObj.password = g_Password;
    g_DeviceInfoObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetDeviceInfo(g_DeviceInfoObj);
}

function SendGetNetWorkInfo(){
    g_NetWorkInfoObj.callbackfunction = function(Obj){
        g_NetWorkInfoObj = Obj;
        
        if (Obj.result) {
            $("DeviceMAC").innerText = g_NetWorkInfoObj.byMACAddr;
        }
        else {
            //alert("get NetWork info fail");
        }
    };
    
    g_NetWorkInfoObj.method = "POST";
    g_NetWorkInfoObj.asynchrony = true;
    g_NetWorkInfoObj.username = g_UserName;
    g_NetWorkInfoObj.password = g_Password;
    g_NetWorkInfoObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetNetWorkInfo(g_NetWorkInfoObj);
}

function SendSetDeviceInfo(){
    g_DeviceInfoObj.callbackfunction = function(Obj){
        if (Obj.result) {
            //alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
    };
    
    g_DeviceInfoObj.method = "POST";
    g_DeviceInfoObj.asynchrony = true;
    g_DeviceInfoObj.username = g_UserName;
    g_DeviceInfoObj.password = g_Password;
    g_DeviceInfoObj.CurrentChannelId = g_CurrentChannelNum;
    
    g_DeviceInfoObj.sDVSName = $("ServerName").value;
    g_DeviceInfoObj.dwVideoStandard = $("vdeostand").value;
    
    SetDeviceInfo(g_DeviceInfoObj);
}

/*==========================================
 ============================================
 ==										  ==
 ==				视频输入代码段  	      ==
 ==										  ==
 ==			2011.03.03	By angel		  ==
 ============================================
 ==========================================*/
//获取视频输入参数
var g_VideoInObj = new VideoInObj();
function SendGetVideoInInfo(){
    g_VideoInObj.callbackfunction = function(Obj){
        g_VideoInObj = Obj;
        
        if (Obj.result) {
            //初始化视频输入页面参数
            InitVideoInfo();
            
        }
        else {
            //alert("get videoin info fail");
        }
        
    };
    
    g_VideoInObj.method = "POST";
    g_VideoInObj.asynchrony = true;
    g_VideoInObj.username = g_UserName;
    g_VideoInObj.password = g_Password;
    g_VideoInObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetVideoInInfo(g_VideoInObj);
}

function SendSetVideoInInfo(){
    g_VideoInObj.callbackfunction = function(Obj){
        if (Obj.result) {
            //alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
        
    };
    
    g_VideoInObj.method = "POST";
    g_VideoInObj.asynchrony = true;
    g_VideoInObj.username = g_UserName;
    g_VideoInObj.password = g_Password;
    g_VideoInObj.CurrentChannelId = g_CurrentChannelNum;
    
    g_VideoInObj.byAntiFlickerMode = $("AntiFlicker").value; //抗闪烁模式
    g_VideoInObj.byVideoColorStyle = $("colorStyle").value; //色彩模式
    g_VideoInObj.byRotaeAngle180 = $("Turn").value; //图像旋转
    g_VideoInObj.byColorTransMode = $("ColorToWhite").value; //彩转黑模式
    g_VideoInObj.byShutterSpeed = $("Shutter").value; //设置快门速度
    g_VideoInObj.byAgc = $("agc").value; //agc
    g_VideoInObj.byIRShutMode = $("IRShutterMode").selectedIndex; //红外模式和时间
    g_VideoInObj.byIRStartHour = $("IRStartHour").value;
    g_VideoInObj.byIRStartMin = $("IRStartMin").value;
    g_VideoInObj.byIRStopHour = $("IRStopHour").value;
    g_VideoInObj.byIRStopMin = $("IRStopMin").value;
    g_VideoInObj.byModeSwitch = $("auto_exposure").value; //曝光模式	
    g_VideoInObj.byWhiteBalance = $("Whitebalance").value; //白平衡
    g_VideoInObj.byWdr = $("Widthrange").value; //宽动态
    g_VideoInObj.byBlc = $("Blc").selectedIndex; //背光补偿
    g_VideoInObj.byExposure = $("3DMctf").value; //光圈(曝光度)
    SetVideoInInfo(g_VideoInObj);
}

//初始化视频输入页面参数
function InitVideoInfo(){
    //抗闪烁模式
    for (var j = 0; j < $("AntiFlicker").options.length; j++) {
        if ($("AntiFlicker").options[j].value == g_VideoInObj.byAntiFlickerMode) {
            $("AntiFlicker").selectedIndex = j;
            break;
        }
    }
    
    //色彩模式
    for (j = 0; j < $("colorStyle").options.length; j++) {
        if ($("colorStyle").options[j].value == g_VideoInObj.byVideoColorStyle) {
            $("colorStyle").selectedIndex = j;
            break;
        }
    }
    
    //图像旋转
    for (j = 0; j < $("Turn").options.length; j++) {
        if ($("Turn").options[j].value == g_VideoInObj.byRotaeAngle180) {
            $("Turn").selectedIndex = j;
            break;
        }
    }
    //$("Turn").checked = g_VideoInObj.byRotaeAngle180 ? true : false;
    
    //设置彩转黑模式
    var ColorTransMode = parseInt(g_VideoInObj.byColorTransMode);
    if (ColorTransMode != 0 && ColorTransMode != 1 && ColorTransMode != 2) {
        ColorTransMode = 0;
    }
    $("ColorToWhite").selectedIndex = ColorTransMode;
    
    //设置快门速度
    var ShutterSpeed = parseInt(g_VideoInObj.byShutterSpeed);
    for (var i = 0; i < ($("Shutter").options.length); i++) {
        if ($("Shutter").options[i].value == ShutterSpeed) {
            $("Shutter").selectedIndex = i;
            break;
        }
    }
    
    //agc增益
    var agc = parseInt(g_VideoInObj.byAgc);
    for (i = 0; i < ($("agc").options.length); i++) {
        if ($("agc").options[i].value == agc) {
            $("agc").selectedIndex = i;
            break;
        }
    }
    
    //设置红外模式和时间
    var IRMode = parseInt(g_VideoInObj.byIRShutMode);
    var StartHour = parseInt(g_VideoInObj.byIRStartHour);
    var StartMin = parseInt(g_VideoInObj.byIRStartMin);
    var StopHour = parseInt(g_VideoInObj.byIRStopHour);
    var StopMin = parseInt(g_VideoInObj.byIRStopMin);
    
    $("IRShutterMode").selectedIndex = IRMode;
    $("IRStartHour").selectedIndex = StartHour;
    $("IRStartMin").selectedIndex = StartMin;
    $("IRStopHour").selectedIndex = StopHour;
    $("IRStopMin").selectedIndex = StopMin;
    
    //如果是定时切换则显示时间段
    if ($("IRShutterMode").value == 1) {
        $("spIRShutter").style.display = "";
    }
    
    //3D滤波
    for (j = 0; j < $("3DMctf").options.length; j++) {
        if ($("3DMctf").options[j].value == g_VideoInObj.byExposure) {
            $("3DMctf").selectedIndex = j;
            break;
        }
    }
    
    //曝光模式
    for (j = 0; j < $("auto_exposure").options.length; j++) {
        if ($("auto_exposure").options[j].value == g_VideoInObj.byModeSwitch) {
            $("auto_exposure").selectedIndex = j;
            break;
        }
    }
    
    //白平衡
    for (j = 0; j < $("Whitebalance").options.length; j++) {
        if ($("Whitebalance").options[j].value == g_VideoInObj.byWhiteBalance) {
            $("Whitebalance").selectedIndex = j;
            break;
        }
    }
    
    //宽动态
    for (j = 0; j < $("Widthrange").options.length; j++) {
        if ($("Widthrange").options[j].value == g_VideoInObj.byWdr) {
            $("Widthrange").selectedIndex = j;
            break;
        }
    }
    
    //背光补偿
    for (j = 0; j < $("Blc").options.length; j++) {
        if ($("Blc").options[j].value == g_VideoInObj.byBlc) {
            $("Blc").selectedIndex = j;
            break;
        }
    }
    
    //根据设备类型决定是否显示红外开关
    if (g_DeviceInfoObj.wTypeExtern & 0x0001) {
        //display ir shutter
        $("trIRShutter").style.display = "";
        $("trIRShutterTime").style.display = "";
    }
    else {
        $("trIRShutter").style.display = "none";
        $("trIRShutterTime").style.display = "none";
    }
    
    DisplayShutterTime();
}

//更改曝光模式选项
function ExposureModeChange(){
    var value = $("auto_exposure").value;
    //alert(value);
    if (value == 16 || value == 32 || value == 17 || value == 33 || value == 49) //自动模式
    {
        $("ColorToWhite").options.length = 0; //彩转黑模式
        $("ColorToWhite").options[0] = new Option(a_Auto, 0);
        $("ColorToWhite").style.disabled = "disabled";
        
        //$("Aperture").disabled = "disabled";//曝光度
        $("agc").disabled = "disabled"; //AGC增益
        $("Shutter").disabled = "disabled"; //电子快门速度	
    }
    else 
        if (value == 0 || value == 1 || value == 7 || value == 8 || value == 9) {
            $("ColorToWhite").options.length = 0; //彩转黑模式
            $("ColorToWhite").options[0] = new Option(a_Colour, 1);
            $("ColorToWhite").options[1] = new Option(a_BlackWhite, 2);
            if (g_VideoInObj.byColorTransMode == 1) {
                $("ColorToWhite").selectedIndex = 0;
            }
            else 
                if (g_VideoInObj.byColorTransMode == 2) {
                    $("ColorToWhite").selectedIndex = 1;
                }
            
            //$("Aperture").disabled = "disabled";//曝光度
            $("agc").disabled = "disabled"; //AGC增益
            $("Shutter").disabled = "disabled"; //电子快门速度	
            if (value == 7) {
                $("Shutter").disabled = "";
            }
            
            if (value == 8) {
            //$("Aperture").disabled = "";
            }
            
            if (value == 9) {
                $("agc").disabled = "";
            }
        }
}

//是否显示红外切换时间
function DisplayShutterTime(){
    if ($("IRShutterMode").selectedIndex == 0 || $("IRShutterMode").selectedIndex == 2) {
        //自动切换
        $("spIRShutter").style.display = "none";
    }
    else {
        $("spIRShutter").style.display = "";
    }
}

/*==========================================
 ============================================
 ==										  ==
 ==				经纬度代码段	  	      ==
 ==										  ==
 ==			2011.06.02	By angel		  ==
 ============================================
 ==========================================*/
//获取视频输入参数
var g_TheodoliteObj = new TheodoliteObj();
function SendGetTheodoliteInfo(){
    g_TheodoliteObj.callbackfunction = function(Obj){
        g_TheodoliteObj = Obj;
        
        if (Obj.result) {
            //初始化视频输入页面参数
            $("Longitude").value = Obj.dwLongitude;
            $("Latitude").value = Obj.dwLatitude;
        }
        else {
            //alert("get Theodolite info fail");
        }
        
    };
    
    g_TheodoliteObj.method = "POST";
    g_TheodoliteObj.asynchrony = true;
    g_TheodoliteObj.username = g_UserName;
    g_TheodoliteObj.password = g_Password;
    g_TheodoliteObj.CurrentChannelId = g_CurrentChannelNum;
    
    GetTheodoliteInfo(g_TheodoliteObj);
}

function SendSetTheodoliteInfo(){
    var strLongitude = $("Longitude").value;
    if (isNaN(strLongitude) || strLongitude.indexOf(".") >= 0) {
        alert(a_ParameterInvalid);
        $("Longitude").value = "";
        $("Longitude").focus();
        return false;
    }
    
    var strLatitude = $("Latitude").value;
    if (isNaN(strLatitude) || strLatitude.indexOf(".") >= 0) {
        alert(a_ParameterInvalid);
        $("Latitude").value = "";
        $("Latitude").focus();
        return false;
    }
    g_TheodoliteObj.dwLongitude = strLongitude;
    g_TheodoliteObj.dwLatitude = strLatitude;
    
    g_TheodoliteObj.callbackfunction = function(Obj){
        if (Obj.result) {
            alert(a_succeed);
        }
        else {
            alert(a_faild);
        }
    };
    g_TheodoliteObj.method = "POST";
    g_TheodoliteObj.asynchrony = true;
    g_TheodoliteObj.username = g_UserName;
    g_TheodoliteObj.password = g_Password;
    g_TheodoliteObj.CurrentChannelId = g_CurrentChannelNum;
    
    SetTheodoliteInfo(g_TheodoliteObj);
}



//////////////////////////////////////////////////////////
/////////剪切视频及下载剪切后的视频文件////////////////////
/////////////////////////////////////////////////////////
//剪切视频
function Cutfile()
{
    var title = document.getElementById("CutorCancel").title;
    if (title == a_cut) 
    {
        document.getElementById("CutorCancel").src = "images/cutclose.png";
        document.getElementById("CutorCancel").title = a_cutCancel;
       
        try 
        {
            PlayCtrl.OnCut(true);
        } 
        catch (err) {
        
        }
    }
    else 
    {
        document.getElementById("CutorCancel").src = "images/cut.jpg";
        document.getElementById("CutorCancel").title = a_cut;
        try 
        {
            PlayCtrl.OnCut(false);
        } 
        catch (err) 
        {
        
        }
    }
}


//下载视频剪切文件
function DownloadCutFile(){
    try 
	{
        PlayCtrl.SetCutFileInfo(1, 0, 0);
    } 
    catch (err) 
	{
    
    }
    DownloadFile();
}














