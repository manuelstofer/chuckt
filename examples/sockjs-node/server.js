var http = require('http');
var sockjs = require('sockjs');
var chucktjs = require('../../lib/chuckt');

var echo = sockjs.createServer();

echo.on('connection', function(conn) {

  var chuckt = chucktjs.chucktifySockJSNode(conn);

  chuckt.on('echo', function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var callback = args.pop();
    callback.apply(null, args);
  });

  chuckt.emit('hello', 'hello client', function (response) {
    console.log(response);
  });
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(9999, '0.0.0.0');