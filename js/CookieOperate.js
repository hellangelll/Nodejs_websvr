
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
