/**
 * @author Hell Angel
 */
var path=require("path");
var libFs=require("fs");
var url=require("url");
var querystring=require("querystring");

function file(req, res, postData) {
	//console.log("postData=" + postData);

	var pathname=__dirname + url.parse(req.url).pathname;
	if( path.extname(pathname)=="" )
	{
		pathname+="/";
	}

	if( pathname.charAt(pathname.length - 1)=="/" )
	{
		pathname+="login.html";
		//默认页index.html
	}
    
    console.log("pathname="+pathname + " "+path.extname(pathname));
	path.exists(pathname, function(exists) {
		if( exists )
		{
		    res.writeHead(200, {"Content-Type":funGetContentType(pathname)});
			
			var stream = libFs.createReadStream(pathname, {
			    flags:"r",
			    encoding:null
			});
			
			stream.on("error", function(){
			    res.writeHead(404,
                {
                    "Content-Type":"text/html"
                });
			});
			
			stream.pipe(res);
		}
		else
		{
			res.writeHead(404,
			{
				"Content-Type":"text/html"
			});
			res.end("<h1>404 Not Found</h1>");
		}
	});
}

var funGetContentType = function(pathname){
    var contentType = "";
    
    switch( path.extname(pathname) )
    {
        case ".html":
            contentType="text/html";
            break;
        case ".js":
            contentType="text/javascript";
            break;
        case ".css":
            contentType="text/css";
            break;
        case ".gif":
            contentType="image/gif";
            break;
        case ".jpg":
            contentType="image/jpeg";
            break;
        case ".png":
            contentType="image/png";
            break;
        case ".ico":
            contentType="image/icon";
            break;
        case ".exe":
            contentType = "application/x-www-form-urlencoded";
            break;
        case ".rar":
            contentType = "application/x-www-form-urlencoded";
            break;
        default:
            contentType = "application/octet-stream";
    }
    
    return contentType;
};

function message(req, res, postData) {
	console.log("Request handler 'message' was called.");
	res.writeHead(200,
	{
		"Content-Type":"text/xml"
	});
	res.write(postData);
	res.end();
}


exports.file=file;
exports.message=message;
