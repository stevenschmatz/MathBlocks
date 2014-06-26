var uuid = require('uuid');

exports.IndexController = function() {
	// ...
}

exports.IndexController.prototype.index = function(req, res) {
	res.render('index.html');
}

exports.IndexController.prototype.createSession = function(req, res) {
	var problemText = req.body.problemText;
	var sessionID = uuid.v4();
	req.session.sessionID = sessionID;
	req.session.problemText = problemText;
	global.idsToNames[req.session.sessionID] = problemText;
	res.redirect('/session/'+req.session.sessionID);
}

exports.IndexController.prototype.about = function(req, res) {
	res.render('about.html');
}

exports.IndexController.prototype.help = function(req, res) {
	res.render('help.html');
}

exports.setup = function(app) {
	var controller = new exports.IndexController();
	var indexRoute = '/';
	app.get(indexRoute, controller.index);
	app.post(indexRoute, controller.createSession);
	var aboutRoute = '/about';
	app.get(aboutRoute, controller.about);
	var helpRoute = '/help';
	app.get(helpRoute, controller.help);
}
