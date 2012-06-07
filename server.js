var express = require('express');

var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public')); //dir of the currently executing script.
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function (req, res) {
  res.send('hello world');
});


app.listen(1234);

console.log('Server running @ http://127.0.0.1:1234');


