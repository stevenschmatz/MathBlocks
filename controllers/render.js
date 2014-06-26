exports.renderController = function() {
	// ...
}

exports.renderController.prototype.render = function(req, res) {
	var solution = req.query.solution;
	var problem = req.query.problem;
	res.render('rendered.html', {'solution': solution, 'problem': problem});
}

exports.setup = function(app) {
	var controller = new exports.renderController();
	var renderRoute = "/render";
	app.get(renderRoute, controller.render);
}
