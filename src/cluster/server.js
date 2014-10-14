var express = require('express');

var handler = require('./request-handler');

var app = express();

app.configure(function() {
  app.use(express.bodyParser());
});

app.get('/sections', handler.sendSections);
app.post('/sections', handler.receiveSolutions);

var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);