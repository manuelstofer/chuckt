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

describe('chuckt.ChuckT', function(){

  var active;
  var passive;

  beforeEach(function(){
    var sockA = new SocketMock();
    var sockB = new SocketMock();

    sockA.connect(sockB);

    active = chucktjs.chucktify(sockA);
    passive = chucktjs.chucktify(sockB);
  });


  it('should receive events and data', function(done){

    passive.on('receive', function(hello, data) {
      expect(arguments.length).toEqual(2);
      expect(hello).toEqual('hello');
      expect(data).toEqual('data');
      done();
    });

    active.emit('receive', 'hello', 'data');
  });
});
