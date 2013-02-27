/**
 * @author Hell Angel
 */

var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.file;
handle["/AipstarWebService"] = requestHandlers.message;

server.start(router.route, handle);

