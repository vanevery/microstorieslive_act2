// HTTP Portion
var util = require('util');
var http = require('http');
var fs = require('fs');
var path = require('path');

var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

// Regular HTTP Portion
function requestHandler(req, res) {

  var pathname = req.url;

  // If blank let's ask for audience.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  // What's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };
  var contentType = typeExt[ext] || 'text/plain';

  // Now read and write back the file with the appropriate content type
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Dynamically setting content type
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

var clients = [];

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log(Date.now() + " new client: " + socket.id);
		clients.push(socket);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('mouse', function(data) {
			// Data comes in as whatever was sent, including objects
			//console.log("Received: 'mouse' " + data);
			
			// Send it to all of the clients
			socket.broadcast.emit('mouse', data);
		});

		socket.on('text', function(data) {
			socket.broadcast.emit('text',data);
		});
		
		socket.on('clear', function(data) {			
			socket.broadcast.emit('clear', data);
		});
		
		socket.on('kinect', function(data) {
			socket.broadcast.emit('kinect', data);
			//console.log(util.inspect(data, {depth: 10}));
		});
			
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('peer_id', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'peer_id' " + data);
			
			// Send it to all of the clients
			socket.broadcast.emit('peer_id', data);
		});
				
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			var indexToRemove = clients.indexOf(socket);
			if (indexToRemove > -1) {
				clients.splice(indexToRemove, 1);
			}
		});
	}
);

/*
var clearDrawing = function() {
	io.sockets.emit('clear', {});
	setTimeout(clearDrawing, 30000);
	console.log("Calling Clear");
};

clearDrawing();
*/
