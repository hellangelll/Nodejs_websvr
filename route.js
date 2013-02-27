/**
 * @author Hell Angel
 */

function route(handle, pathname, req, response, postData)
{
	//console.log("About to route a request for " + pathname);
	if( pathname =="/AipstarWebService" )
	{
		handle["/AipstarWebService"](req, response, postData);
	}
	else
	{
	    handle["/"](req, response, postData);
	}
}

exports.route=route;
