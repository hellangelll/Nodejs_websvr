/**
 * @author Hell Angel
 */
console.time('[WebSvr][Start]');
var http=require("http");
var url=require("url");
//var io = require("socket.io");
//var formidable = require("./formmidable");


exports.start = function(route, handle)
{
    function onRequest(request, response)
    {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received");
        
        request.setEncoding("utf8");
        request.addListener("data", function(postDataChunk){
            postData += postDataChunk;
            console.log("Received Post data chunk'" +postDataChunk+"'");
        });
        
        request.addListener("end", function(){
            route(handle, pathname, request, response, postData);
        });
    }
    
	var webSvr = http.createServer(onRequest);
	
	//指定服务器错误事件响应
    webSvr.on("error", function(err){
        console.log(err);
    });
	
	//开始侦听8888端口
	webSvr.listen(8888, function(){
    	console.log("[WebSvr][Start] server has started listen 8888");
	});
	
	console.timeEnd('[WebSvr][Start]');
}


