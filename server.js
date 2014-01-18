var express = require('express');
var uuid = require('uuid');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var http = require('http');
var xml2js = require('xml2js');
var request = require('request');

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

app.post('/invite', function(req, res) {
	var emails = res
});

app.get('/session/:id', function(req, res) {
		io.sockets.on('connection', function(socket) {
			socket.emit('hello', {'foo': 'bar'});
			socket.on('chatMessage', function(data) {
				io.sockets.emit('chatMessage', {'messageText': data['messageText'], 'sendingUser': data['sendingUser']});
			});
		});
		res.render('session.html', {problemText: req.session.problemText, sessionID: req.params.id});
});

app.post('/calc', function(req, res) {
	var math = req.body.exp;
	request('http://api.wolframalpha.com/v2/query?input='+math+'&appid=8HLE69-6TAEVQ2637', function(err, resp, body) {
		if(!err && resp.statusCode == 200) {
			var wolframXML = body;
			xml2js.parseString(wolframXML, function(err, obj) {
				var xmlObj = obj;
				if(xmlObj['queryresult']['pod'] != undefined) {
					if(xmlObj['queryresult']['pod'][1] != undefined) {
						if(xmlObj['queryresult']['pod'][1]['$']['title'] == 'Result') {
							res.send('{"status": "ok", "result": ' + xmlObj['queryresult']['pod'][1]['subpod'][0]['plaintext'][0] + '}');
						}
						else {
							res.send('{"status": "bad", "error": "You must enter a valid numerical expression."}');
						}
					}
					else {
						res.send('{"status": "bad", "error": "You must enter a valid numerical expression."}');
					}
				}
				else {
					res.send('{"status": "bad", "error": "You must enter a valid numerical expression."}');
				}
			});
		}
	});
});

server.listen(process.env.PORT || 3001);