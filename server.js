var express = require('express');
var uuid = require('uuid');
var app = express();

app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser);
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/', function(req, res) {
	var problem = req.body.problemText;
	res.redirect()
});

app.get('/session/:id', function(req, res) {
	res.render('')
});

app.listen(3000);