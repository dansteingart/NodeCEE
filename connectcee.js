var WebSocket = require('faye-websocket'),
    ws        = new WebSocket.Client('ws://localhost:9003/ws/v0/');

ws.onopen = function(event) {
  console.log('open');
  ws.send('Hello, world!');
};

ws.onmessage = function(event) {
  console.log('message', event.data);
};

ws.onclose = function(event) {
  console.log('close', event.code, event.reason);
  ws = null;
};

