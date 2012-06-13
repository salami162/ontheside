// npm
const express = require('express');
const hbs = require('hbs');
const _ = require('underscore');



var app = express.createServer();

// Configuration
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});

// setup server routes 
var routes = require('./server/routes');
app.use(routes);

// setup view engine
express.view.register('.hbs', hbs);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'hbs');
var blocks = {};

hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if (!block) {
      block = blocks[name] = [];
  }

  block.push(context(this));
});

hbs.registerHelper('block', function(name) {
  var val = (blocks[name] || []).join('\n');

  // clear the block
  blocks[name] = [];
  return val;
});

// session support
app.use(express.cookieParser());
app.use(express.session({ secret: "ontheside" }));


app.configure('development', function(){
    app.use(express.static(__dirname + '/public')); //dir of the currently executing script.
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get('/', routes.index);


app.listen(1234);

console.log('Server running @ http://127.0.0.1:1234');


