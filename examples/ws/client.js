var WebSocket = require('ws');
var chucktjs = require('../../lib/chuckt');
var ws = new WebSocket('ws://localhost:8080/');

ws.on('open', function() {

  var chuckt = chucktjs.chucktify(ws);

  chuckt.emit('echo', 'hello', function(data) {
    console.log({ echo: data });
  });

  chuckt.on('hello', function (message, fn) {
    console.log(message);
    fn('hello server');
  });
});