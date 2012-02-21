var http = require("http"); //HTTP Server
var url = require("url"); // URL Handling
var fs = require('fs'); // Filesystem Access (writing files)

var express = require('express'), //App Framework (similar to web.py abstraction)
    app = express.createServer();
	app.use(express.bodyParser());
	app.use(app.router);
io = require('socket.io').listen(app); //Socket Creations
io.set('log level', 1)

var WebSocket = require('faye-websocket'),
ws = null

debug = true

deviceReady = false

function initializer()
{
	deviceReady = false
    ws = new WebSocket.Client('ws://localhost:9003/ws/v0/');
	ws.onopen = function(event) {console.log('open');};
	ws.onmessage = function(event) {
		io.sockets.emit('new_data',{'data':event.data})
		try
		{
			messagePasser(JSON.parse(event.data))
		}
		catch (error)
		{
			console.log(error);
		}
	};

	ws.onclose = function(event) {
	  console.log('close', event.code, event.reason);
	  ws = null;
	};

}

function cancelListen()
{
	out['_cmd'] = 'cancelListen'
	ws.send(JSON.stringify(out))
	
}


function messagePasser(jsoned)
{
	if (debug) console.log(jsoned)
	
	if (jsoned["_action"] != null)
	{
		if (jsoned["_action"] == "devices")
		{
			available_devices = jsoned['devices']
			out = {}
			out['_cmd'] = 'selectDevice'
			for (thing in available_devices)
			{
				if (debug) console.log(thing)
				out['id'] = thing
				ws.send(JSON.stringify(out))
			}
		}
		
		if (jsoned["_action"] == "deviceConfig")
		{
			out = {"id":100,"streams":[{"channel":"a","stream":"v"},{"channel":"a","stream":"i"},{"channel":"b","stream":"v"},{"channel":"b","stream":"i"}],"decimateFactor":1000,"start":-1002,"count":-1,"_cmd":"listen"}
			deviceReady = true
			ws.send(JSON.stringify(out))
			
		}
		
		if (jsoned["_action"] == "deviceDisconnected")
		{
			
			deviceReady = false;
		}
		
		
	}
	
}

app.use("/static", express.static(__dirname + '/static/'));
app.use("/socket.io", express.static(__dirname + '/node_modules/socket.io/lib'));


app.get('/', function(req, res){
	indexer = fs.readFileSync('index.html').toString()
    res.send(indexer);
});


app.get('/debug', function(req, res){
	indexer = fs.readFileSync('debug.html').toString()
    res.send(indexer);
});


app.listen(4000);
console.log('Express server started on port %s', app.address().port);

data_log = []


initializer()



io.sockets.on('connection', function (socket) {
	if (debug) console.log("got_love");
  	socket.on('data_back', function (data) 
	{
		foo = data['data']
		if (debug) console.log(foo)
		//io.sockets.emit('new_data',{'data':data})    
		ws.send(foo)
  	});

	//if something hits the fan allow a restart of the CEE connection
	socket.on('reconnect', function (data) 
	{
		cancelListen()
		initializer()
  	});

	socket.on('tocee', function (data) 
	{
		out = data
		ws.send(JSON.stringify(out))
  	});


});

//Heartbeat for device status (ready for capture or not)
setInterval(function(){io.sockets.emit('heartbeat',{'deviceReady':deviceReady})},1000)
