'use strict';

var chucktjs = require('../lib/chuckt');

/**
 * Simple mock for web sockets
 *
 * @constructor
 */
function SocketMock() {
  this.send = function(message) {
    this.target.onmessage({ data: message });
  };
  this.connect = function(target) {
    this.target = target;
    this.target.target = this;
  };
}

describe('chuckt.ChuckT', function() {

  var active;
  var passive;

  beforeEach(function(){
    var sockA = new SocketMock();
    var sockB = new SocketMock();

    sockA.connect(sockB);

    active = chucktjs.chucktify(sockA);
    passive = chucktjs.chucktify(sockB);

    passive.on('echo', function() {
      var args = Array.prototype.slice.call(arguments, 0);
      var callback = args.pop();
      callback.apply(null, args);
    });
  });


  it('should receive events and data', function(done) {

    passive.on('receive', function(hello, data) {
      expect(arguments.length).toEqual(2);
      expect(hello).toEqual('hello');
      expect(data).toEqual('data');
      done();
    });

    active.emit('receive', 'hello', 'data');
  });

  it('should support callbacks', function(done) {

    active.emit('echo', 'hello', function(hello) {
      expect(arguments.length).toEqual(1);
      expect(hello).toEqual('hello');
      done();
    });
  });

  it('should support callbacks without arguments', function(done) {

    active.emit('echo', function(hello) {
      expect(arguments.length).toEqual(0);
      done();
    });
  });

  it('should call listeners registered with any for any event', function(done) {

    passive.any(function(event, arg) {
      expect(event).toEqual('event-name');
      expect(arg).toEqual('arg');
      expect(arguments.length).toEqual(2);
      done();
    });

    active.emit('event-name', 'arg');
  });
});
