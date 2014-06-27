var express = require('express');
var app = express();
var http = require('http');

var server = http.createServer(app);

io = require('socket.io').listen(server, {log: true});

// assuming io is the Socket.IO server object
io.configure(function () { 
	io.set("transports", ["xhr-polling"]); 
	io.set("polling duration", 10); 
});

app.engine('html', require('ejs').renderFile);
app.use(require('body-parser')());
app.use(require('serve-static')(__dirname+'/public'));
app.use(require('cookie-parser')());
app.use(require('cookie-session')({secret: 'f15463f8-7ff1-11e3-9b32-28cfe9511e3f'}));

global.idsToNames = {};
global.idsToHistories = {};

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

/* each controller file implements a setup(app) function */

var controllerNames = ['api', 'index', 'invite', 'render'];
for(var i = 0; i < controllerNames.length; i++) {
	var controllerName = controllerNames[i];
	var controller = require('./controllers/' + controllerName);
	controller.setup(app);
}

app.get('/session/:id', function(req, res) {

	var id = req.params.id;
	if(global.idsToNames[id] == undefined) {
		res.send("No session exists with that name.");
	}
	else {
		res.render('session.html', {problemText: global.idsToNames[id], sessionID: id});
	}
});

app.listen(process.env.PORT || 5555);

console.log("Server running on port 5555");
