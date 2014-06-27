var request = require('request');
var xml2js = require('xml2js');

exports.ApiController = function() {
	// ...
}

exports.ApiController.prototype.calc = function(req, res) {
	var math = req.body.exp;
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

exports.ApiController.prototype.plot = function(req, res) {
	var funct = req.body.funct;
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

exports.setup = function(app) {
	var controller = new exports.ApiController();
	var calcRoute = '/calc';
	app.post(calcRoute, controller.calc);
	var plotRoute = '/plot';
	app.post(plotRoute, controller.plot);
}
