var express = require('express');
var uuid = require('uuid');
var app = express();
var WebSocket = require('ws');

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
		res.render('session.html', {problemText: req.session.problemText});
		var ws = new WebSocket('ws://localhost:3000/path'); // change in deployment
		ws.on('message', function(data) {
			console.log('yay');
		});
	}
});

app.listen(3000);