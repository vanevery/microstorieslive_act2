// HTTP Portion
var util = require('util');
var http = require('http');
var fs = require('fs');
var path = require('path');

var backgroundsPath = "backgrounds";

var testKinectData = require('./kinecttestdata.json');
var testKinectDataIndex = 0;

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
    '.html':	'text/html',
    '.js':		'text/javascript',
    '.css':		'text/css',
    '.jpg':		'image/jpeg',
    '.png':		'image/png'
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
var actor_socket = null;

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log(Date.now() + " new client: " + socket.id);
		clients.push(socket);
		
		socket.on('mouse', function(data) {
			socket.broadcast.emit('mouse', data);
			socket.mouse = data;
		});

		socket.on('text', function(data) {
			socket.broadcast.emit('text',data);
			socket.text = data;
		});
		
		socket.on('clear', function(data) {			
			socket.broadcast.emit('clear', data);
		});
		
		socket.on('saveddrawing', function(data) {
			socket.broadcast.emit('saveddrawing', data);
		});
		
		socket.on('kinect', function(data) {
			socket.broadcast.emit('kinect', data);
			socket.kinect = data;
			//console.log(util.inspect(data, {depth: 10}));
		});

		socket.on('kinecttest', function(data) {
			console.log("Received kinecttest");
			sendTestDataLine();
		});
			
		socket.on('kinecttestsingle', function(data) {
			console.log("Received kinecttestsingle");
			sendTestDataSingleLine();
		});
			
		socket.on('peer_id', function(data) {
			console.log("Received: 'peer_id' " + data);
			socket.broadcast.emit('peer_id', data);
			socket.peer_id = data;
		});
		
		socket.on('actor_peer_id', function(data) {
			console.log("Received: 'actor_peer_id' " + data);
			socket.broadcast.emit('actor_peer_id', data);
			actor_socket = socket;
			socket.peer_id = data;
		});
		
		socket.on('backgroundimage', function(data) {
			socket.broadcast.emit('backgroundimage', data);
		});
				
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			var indexToRemove = clients.indexOf(socket);
			if (indexToRemove > -1) {
				clients.splice(indexToRemove, 1);
			}
			io.sockets.emit('disconnect_peer_id', socket.peer_id);
		});
		
		socket.on('listbackgrounds', function(data) {
			console.log("Client has requested list of background images");
			var backgrounds = [];
			fs.readdir(__dirname + '/' + backgroundsPath + '/', 
				function(err, files) { 
					if (!err) {
						files.forEach(function(name) {
							var filePath = path.join(backgroundsPath, name);
							var stat = fs.statSync(filePath);
							if (stat.isFile()) {
								if (name.search('.jpg') > -1) {
									backgrounds.push(filePath);
								}
							}
						});
						socket.emit('backgrounds',backgrounds);	
					} else {
						console.log("Error reading background images: " + err);
					}
				}
			);
		});
	}
);

var sendTestDataSingleLine = function() {
	console.log("Sending: " + testKinectData[testKinectDataIndex]);
	io.sockets.emit('kinect', testKinectData[testKinectDataIndex]);
	if (testKinectDataIndex < testKinectData.length - 1) {	
		testKinectDataIndex++;
	} else {
		testKinectDataIndex = 0;
	}

};

var sendTestDataLine = function() {
	console.log("Sending: " + testKinectData[testKinectDataIndex]);
	io.sockets.emit('kinect', testKinectData[testKinectDataIndex]);
	if (testKinectDataIndex < testKinectData.length - 1) {	
		testKinectDataIndex++;
		setTimeout(sendTestDataLine, 5);
	} else {
		testKinectDataIndex = 0;
	}
};

/*
var clearDrawing = function() {
	io.sockets.emit('clear', {});
	setTimeout(clearDrawing, 30000);
	console.log("Calling Clear");
};

clearDrawing();
*/
