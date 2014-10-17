var http = require('http');
var und = require('underscore')

var sendSolution = function(id) {
	var postData = JSON.stringify({superFakeSection: id});
	var req = http.request({
		hostname: '127.0.0.1',
		port: 4568,
		method: 'POST',
		path: '/testing',
		headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
      }
	}, function(res) {
		console.log('successfully posted Id: ' + id);
		res.destroy();
	});
	req.on('error', function(e) {
  	console.log('ERROR with POST request: ' + e.message);
	});
	req.on('close', function() { console.log("Connection closed" + JSON.stringify(this.body)); });
	req.write(postData);
	console.log("posting id: " + JSON.stringify(id));
	req.end();
}

var i = 0;

setInterval(function() {
	sendSolution({id:i});
	i++;
},1000);


