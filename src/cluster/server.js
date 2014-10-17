var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var handler = require('./request-handler');

var app = express();

app.use(bodyParser.json());

app.get('/sections', handler.sendSections);
app.get('/status', handler.sendStatus);
app.post('/sections', handler.receiveSolutions);

var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);


