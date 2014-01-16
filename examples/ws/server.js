var WebSocketServer = require('ws').Server;
var chucktjs = require('../../lib/chuckt');
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {

  var chuckt = chucktjs.chucktify(ws);

  chuckt.on('echo', function() {
    console.log('echo');
    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    callback.apply(null, args);
  });

  chuckt.emit('hello', 'hello client', function (response) {
    console.log(response);
  });
});