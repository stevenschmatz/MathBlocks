var express = require('express');
var uuid = require('uuid');
var app = express();

app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));
app.use(express.cookieParser());
app.use(express.session({secret: 'f15463f8-7ff1-11e3-9b32-28cfe9511e3f'}));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/', function(req, res) {
	var problem = req.body.problemText;
	var sessionID = uuid.v4();
	req.session.sessionID = sessionID;
	res.redirect('/session/'+sessionID);
});

app.get('/session/:id', function(req, res) {
	if(req.params.id == req.session.sessionID) {
		res.render('session.html');
	}
});

app.listen(3000);