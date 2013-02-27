//检查IP是否合法
function Ipv4IsValid(strIp)
{
	var iIndex = 0;
	var i      = 0;
	var str = "";
	var  j     = 0;
	var  sIP = strIp;
	
	//查找是否有255
	if( strIp.indexOf("255") >=0 )
	{
		return false;
	}
	
	//是数字
	if( !isNaN(strIp) )
	{
		return false;
	}
	
	//格式判断
	while (true )
	{
		iIndex = strIp.indexOf(".");
		if( iIndex  <= 0 )
		{
			return false;
		}
		
		//前三位
		str = strIp.substr(0, iIndex);
		if( str.length > 3 )
		{
			return false;
		}
		
		if( isNaN(str) )
		{
			return false;
		}
		if( str >= 255 )
		{
			return false;
		}
		
		if( str == 0 )
		{
			j ++;
		}
		
		strIp = strIp.substr(iIndex + 1, strIp.length );
		
		i++;
		
		if( i  == 3 )
		{
			if( strIp.length > 3 )
			{
				return false;
			}
			
			if( isNaN(strIp) )
			{
				return false;
			}
			
			if( strIp.indexOf(".") >= 0 )
			{
				return false;
			}
			
			if( strIp >= 255 )
			{
				return false;
			}
			
			if( strIp == 0 )
			{
				j++;
			}
			
			if( j >= 4 )
			{
				return false;
			}
			break;
		}
	}
	
	//判断最后一位是否为0
	i = sIP.lastIndexOf (".");
	var s = sIP.substr(i+1);
	if( parseInt(s) == 0 )
	{
		return false;
	}
	return true;
		
}
