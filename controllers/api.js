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
}

exports.setup = function(app) {
	var controller = new exports.ApiController();
	var calcRoute = '/calc';
	app.post(calcRoute, controller.calc);
	var plotRoute = '/plot';
	app.post(plotRoute, controller.plot);
}
