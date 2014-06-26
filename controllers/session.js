var io;

exports.sessionController = function() {
	// ...
}

exports.sessionController.prototype.viewSession = function(req, res) {
	io.sockets.on('connection', function(socket) {
		globalSocket = socket;
		socket.on('room', function(room) {
			socket.join(room);
		});
		// every event has a value and a sending user, and sometimes a third data point
		socket.on('chatMessage', function(data) {
				io.sockets.in(req.params.id).emit('chatMessage', {'messageText': data['messageText'], 'sendingUser': data['sendingUser']});
		});
		socket.on('valueCalculated', function(data) {
			io.sockets.in(req.params.id).emit('valueCalculated', {'value': data['value'], 'sendingUser': data['sendingUser'], 'exp': data['exp']});
		});
		socket.on('latexChanged', function(data) {
			socket.broadcast.to(req.params.id).emit('latexChanged', {'rawText': data['rawText'], 'sendingUser': data['sendingUser']});
		});
		socket.on('solutionChanged', function(data) {
			socket.broadcast.to(req.params.id).emit('solutionChanged', {'solutionText': data['solutionText'], 'sendingUser': data['sendingUser']});
		});
		socket.on('graphChanged', function(data) {
			socket.broadcast.to(req.params.id).emit('graphChanged', {'graphSource': data['graphSource'], 'funct': data['funct'], 'sendingUser': data['sendingUser']});
		});
		socket.on('newUser', function(data) {
			socket.broadcast.to(req.params.id).emit('newUser', {'name': data['name']});
		});
	});
	
	var id = req.params.id;
	if(global.idsToNames[id] == undefined) {
		res.send("No session exists with that name.");
	}
	else {
		res.render('session.html', {problemText: global.idsToNames[id], sessionID: id});
	}
}

exports.setup = function(app) {
	var server = require('http').createServer(app);
	io = require('socket.io').listen(server, {log: true});

	// assuming io is the Socket.IO server object
	io.configure(function () { 
  		io.set("transports", ["xhr-polling"]); 
  		io.set("polling duration", 10); 
	});

	var controller = new exports.sessionController();
	var sessionRoute = "/session/:id";
	app.get(sessionRoute, controller.viewSession);
}
