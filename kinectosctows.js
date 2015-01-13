var udp =require('udp');
var osc = require('osc-min');
util = require('util');
var io = require('socket.io-client');

var socketConnected = false;

socket = io.connect('http://128.122.151.90:8080');
socket.on('connect', function () { 
 socketConnected = true;
 console.log("socket connected"); });
//socket.emit('text', "hi");

var c = 0;

sock = udp.createSocket("udp4", function(msg, rinfo) {
  var error;
  try {
 var oscObj = osc.fromBuffer(msg);
 if (socketConnected) { 
  
  //console.log(util.inspect(oscObj, {depth: 10}));
  if (oscObj.elements[0].elements[0].address == "/bodyJoint" && c%4==0) {
   
   socket.emit('kinect', {position: oscObj.elements[0].elements[0].args[1].value,
     x: oscObj.elements[0].elements[0].args[2].value,
     y: oscObj.elements[0].elements[0].args[3].value,
     z: oscObj.elements[0].elements[0].args[4].value});

   //socket.emit('kinect', oscObj);
   //console.log("sent osc packet");
  }
  //console.log("sent osc packet");
  c++;
 }
     //console.log(util.inspect(osc.fromBuffer(msg),{depth: 10}));
 return;
  } catch (_error) {
    error = _error;
    return console.log("invalid OSC packet");
  }
});
sock.bind(8000);

var buf;
  buf = osc.toBuffer({
    address: "/connect",
    args: []
  });
sock.send(buf, 0, buf.length, 9000, "localhost");