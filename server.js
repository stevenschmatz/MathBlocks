var express = require('express');
var app = express();
var http = require('http');

app.engine('html', require('ejs').renderFile);
app.use(require('body-parser')());
app.use(require('serve-static')(__dirname+'/public'));
app.use(require('cookie-parser')());
app.use(require('cookie-session')({secret: 'f15463f8-7ff1-11e3-9b32-28cfe9511e3f'}));

global.idsToNames = {};
global.idsToHistories = {};

/* each controller file implements a setup(app) function */

var controllerNames = ['api', 'index', 'invite', 'render', 'session'];
for(var i = 0; i < controllerNames.length; i++) {
	var controllerName = controllerNames[i];
	var controller = require('./controllers/' + controllerName);
	controller.setup(app);
}

app.listen(process.env.PORT || 5555);

console.log("Server running on port 5555");
