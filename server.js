var express = require('express');
var uuid = require('uuid');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));
app.use(express.cookieParser());
app.use(express.session({secret: 'f15463f8-7ff1-11e3-9b32-28cfe9511e3f'}));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/', function(req, res) {
	var problemText = req.body.problemText;
	var sessionID = uuid.v4();
	req.session.sessionID = sessionID;
	req.session.problemText = problemText;
	res.redirect('/session/'+req.session.sessionID);
});

app.get('/session/:id', function(req, res) {
	if(req.params.id == req.session.sessionID) {
		io.sockets.on('connection', function(socket) {
			socket.on('chatMessage', function(data) {
				console.log(data);
				io.sockets.emit('chatMessage', {'messageText': data['messageText'], 'sendingUser': data['sendingUser']});
			});
			/*socket.on('userEntered', function(data) {
				socket.broadcast.emit({'type': 'systemMessage', 'messageText': 'has entered the chat room', 'user': data['user']});
			});
			socket.on('userLeft', function(data) {
				socket.broadcast.emit({'type': 'systemMessage', 'messageText': 'has left the chat room', 'user': data['user']});
			});*/
			// specialized system messages later?
		});
		res.render('session.html', {problemText: req.session.problemText, sessionID: req.session.sessionID});
	}
});

server.listen(3001);