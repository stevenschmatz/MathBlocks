var express = require('express');
var uuid = require('uuid');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: true});
var http = require('http');
var xml2js = require('xml2js');
var request = require('request');
var sendgrid = require('sendgrid')('amitmhacks', 'stuff123');

app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));
app.use(express.cookieParser());
app.use(express.session({secret: 'f15463f8-7ff1-11e3-9b32-28cfe9511e3f'}));

var idsToNames = {};
var idsToHistories = {};

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/', function(req, res) {
	var problemText = req.body.problemText;
	var sessionID = uuid.v4();
	req.session.sessionID = sessionID;
	req.session.problemText = problemText;
	idsToNames[req.session.sessionID] = problemText;
	idsToHistories[req.session.sessionID] = {"chat": [], "calc": [], "latex": [], "solution": [], "graph": []};
	res.redirect('/session/'+req.session.sessionID);
});

app.get('/session/:id', function(req, res) {
		io.sockets.on('connection', function(socket) {
			globalSocket = socket;
			socket.on('room', function(room) {
				socket.join(room);
			});
			// every event has a value and a sending user, and sometimes a third data point
			socket.on('chatMessage', function(data) {
					idsToHistories[req.params.id]['chat'].push(data);
					io.sockets.in(req.params.id).emit('chatMessage', {'messageText': data['messageText'], 'sendingUser': data['sendingUser']});
			});
			socket.on('valueCalculated', function(data) {
				idsToHistories[req.params.id]['calc'].push(data);
					io.sockets.in(req.params.id).emit('valueCalculated', {'value': data['value'], 'sendingUser': data['sendingUser'], 'exp': data['exp']});
			});
			socket.on('latexChanged', function(data) {
				idsToHistories[req.params.id]['latex'].push(data);
				socket.broadcast.to(req.params.id).emit('latexChanged', {'rawText': data['rawText'], 'sendingUser': data['sendingUser']});
			});
			socket.on('solutionChanged', function(data) {
				idsToHistories[req.params.id]['solution'].push(data);
				socket.broadcast.to(req.params.id).emit('solutionChanged', {'solutionText': data['solutionText'], 'sendingUser': data['sendingUser']});
			});
			socket.on('graphChanged', function(data) {
				idsToHistories[req.params.id]['graph'].push(data);
				socket.broadcast.to(req.params.id).emit('graphChanged', {'graphSource': data['graphSource'], 'funct': data['funct'], 'sendingUser': data['sendingUser'], 'graphHistory': idsToHistories[req.params.id]['graph']});
				console.log(idsToHistories);
			});
		});
		
		var id = req.params.id
		res.render('session.html', {problemText: idsToNames[id], sessionID: id, graphHistory: idsToHistories[req.params.id]['graph']});
});

app.post('/calc', function(req, res) {
	var math = req.body.exp;
	request('http://api.wolframalpha.com/v2/query?input='+encodeURIComponent(math)+'&appid=8HLE69-6TAEVQ2637', function(err, resp, body) {
		if(!err && resp.statusCode == 200) {
			var wolframXML = body;
			xml2js.parseString(wolframXML, function(err, obj) {
				var xmlObj = obj;
				if(xmlObj['queryresult']['pod'] != undefined) {
					if(xmlObj['queryresult']['pod'][1] != undefined) {
						if(xmlObj['queryresult']['pod'][1]['$']['title'] == 'Result') {
							res.send('{"status": "ok", "result": ' + xmlObj['queryresult']['pod'][1]['subpod'][0]['plaintext'][0] + ', "exp": "' + math + '"}');
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
		else {
			res.send('{"status": "bad", "error": "There was an error."}');
		}
	});
});

app.post('/plot', function(req, res) {
	var funct = req.body.funct;
	request('http://api.wolframalpha.com/v2/query?input=plot+'+encodeURIComponent(funct)+'&appid=8HLE69-6TAEVQ2637', function(err, resp, body) {
		if(!err && resp.statusCode == 200) {
			var wolframXML = body;
			xml2js.parseString(wolframXML, function(err, obj) {
				var xmlObj = obj;
				//console.dir(xmlObj);
				if(xmlObj['queryresult']['pod'] != undefined) {
					if(xmlObj['queryresult']['pod'][1] != undefined) {
						console.dir(xmlObj['queryresult']['pod'][1]);
						if(xmlObj['queryresult']['pod'][1]['$']['title'] == 'Plots' || xmlObj['queryresult']['pod'][1]['$']['title'] == 'Plot') {
							console.dir(xmlObj['queryresult']['pod'][1]['subpod'][0]['img'][0]);
							console.log('{"status": "ok", "result": ' + xmlObj['queryresult']['pod'][1]['subpod'][0]['img'][0]['$']['src'] + ', "funct": "' + funct + '"}')
							res.send('{"status": "ok", "result": "' + xmlObj['queryresult']['pod'][1]['subpod'][0]['img'][0]['$']['src'] + '", "funct": "' + funct + '"}');
						}
						else {
							console.dir(xmlObj['queryresult']['pod'][1]);
						}
					}
					else {
						res.send('{"status": "bad", "error": "You must enter a valid function."');
					}
				}
				else {
					res.send('{"status": "bad", "error": "You must enter a valid function."');
				}
			});
		}
		else {
			res.send('{"status": "bad", "error": "You must enter a valid function."');
		}
	});
});

app.get('/about', function(req, res) {
	res.render('about.html');
});

app.get('/render', function(req, res) {
	var solution = req.query.solution;
	var problem = req.query.problem;
	res.render('rendered.html', {'solution': solution, 'problem': problem});
});

app.post('/invite', function(req, res) {
	var emails = req.body.emails.split(",");
	var psetter = req.body.psetter;
	var pName = req.body.problemName;
	var link = req.body.link;
	sendgrid.send({
		to: emails,
		from: 'amit@amizrahi.com',
		subject: 'Your invitation to ' + psetter + '\'s Mathelo problem',
		html: require('ejs').render(require('fs').readFileSync(__dirname+'/views/mail.html').toString(), {'problemSetter': psetter, 'problemName': pName, 'link': link})
	}, function(err, json) {
  if (err) { 
		return console.error(err); 
	}
  console.log(json);
	});
	return 'ok';
});

app.get('/help', function(req, res) {
    res.render("help.html")
})

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

server.listen(process.env.PORT || 80);