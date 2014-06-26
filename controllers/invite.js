var sendgrid = require('sendgrid')('amitmhacks', 'stuff123');

exports.InviteController = function() {
	// ...
}

exports.InviteController.prototype.invite = function(req, res) {
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
}

exports.setup = function(app) {
	var controller = new exports.InviteController();
	var inviteRoute = '/invite';
	app.get(inviteRoute, controller.invite);
}
