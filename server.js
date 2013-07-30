// npm
var express = require('express');
var _ = require('underscore');

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./server/routes')
  , http = require('http')
  , path = require('path');

var app = express();
app.enable("jsonp callback");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static( path.join(__dirname, 'public') ));
// development only
app.configure('development', function () {
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );
});

app.get('/clientGraph', routes.clientGraph);
app.get('/clientDashboard', routes.clientDashboard);
app.get('/clientCenterGraph', routes.clientCenterGraph);
app.get('/bvio', routes.bvio);
app.get('/foosball', routes.foosball);
app.post('/foosball/games', routes.saveScore);
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server running @ http://127.0.0.1 on port ' + app.get('port'));
});




