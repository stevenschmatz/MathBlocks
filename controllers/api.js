var request = require('request');
var xml2js = require('xml2js');
var csrfUtils = require('csrfUtils');

exports.ApiController = function() {
	// ...
}

exports.ApiController.prototype.calc = function(req, res) {
	if(req.xhr) {
		/* request is AJAX */
		var math = req.body.exp;
		var csrfToken = req.body.csrfToken;
		if(csrfToken != undefined && csrfUtils.isValidCsrfToken(csrfToken)) {
			request('http://api.wolframalpha.com/v2/query?input='+encodeURIComponent(math)+'&appid=8HLE69-6TAEVQ2637', function(err, resp, body) {
				if(!err && resp.statusCode == 200) {
					var wolframXML = body;
					xml2js.parseString(wolframXML, function(err, obj) {
						var xmlObj = obj;
						if(xmlObj['queryresult']['pod'] != undefined) {
							if(xmlObj['queryresult']['pod'][1] != undefined) {
								if(xmlObj['queryresult']['pod'][1]['$']['title'] == 'Result') {
									var responseObject = {"result": xmlObj['queryresult']['pod'][1]['subpod'][0]['plaintext'][0], "exp": math}
									res.status(200);
									res.end(responseObject);
								}
								else {
									var responseObject = {"error": "You must enter a valid numerical expression."};
									res.status(403);
									res.end(responseObject);
								}
							}
							else {
								var responseObject = {"error": "You must enter a valid numerical expression."};
								res.status(403);
								res.end(responseObject);
							}
		         }
						else {
							var responseObject = {"error": "You must enter a valid numerical expression."};
							res.status(403);
							res.send(responseObject);
						}
					});
				}
				else {
					var responseObject = {"error": "There was an error."};
					res.status(500);
					res.send(responseObject);
				}
			});
		}
	}
	else {
		/* request is not AJAX */
		res.status(403);
		res.end("Forbidden");
	}
}

exports.ApiController.prototype.plot = function(req, res) {
	if(req.xhr) {
		var funct = req.body.funct;
		var csrfToken = req.body.csrfToken;
		if(csrfUtils.isValidCsrfToken(csrfToken)) {
			request('http://api.wolframalpha.com/v2/query?input=plot+'+encodeURIComponent(funct)+'&appid=8HLE69-6TAEVQ2637', function(err, resp, body) {
				if(!err && resp.statusCode == 200) {
					var wolframXML = body;
					xml2js.parseString(wolframXML, function(err, obj) {
						var xmlObj = obj;
						//console.dir(xmlObj);
						if(xmlObj['queryresult']['pod'] != undefined) {
							if(xmlObj['queryresult']['pod'][1] != undefined) {
								if(xmlObj['queryresult']['pod'][1]['$']['title'] == 'Plots' || xmlObj['queryresult']['pod'][1]['$']['title'] == 'Plot') {
									var responseObject = {"result": xmlObj['queryresult']['pod'][1]['subpod'][0]['img'][0]['$']['src'], "funct": funct};
									res.status(200);
									res.end(responseObject);
								}
								else {
									// ...
								}
							}
							else {
								var responseObject = {"error": "You must enter a valid function."};
								res.status(403);
								res.end(responseObject);
							}
						}
						else {
							var responseObject = {"error": "You must enter a valid function."};
							res.status(403);
							res.end(responseObject);
						}
					});
				}
				else {
					var responseObject = {"error": "You must enter a valid function."};
					res.status(403);
					res.end(responseObject);
				}
			});
		}	
	}
	else {
		res.status(403);
		res.end("Forbidden");
	}
}

exports.setup = function(app) {
	var controller = new exports.ApiController();
	var calcRoute = '/api/calc';
	app.post(calcRoute, controller.calc);
	var plotRoute = '/api/plot';
	app.post(plotRoute, controller.plot);
}
