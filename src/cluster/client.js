var http = require('http');
var Worker = require('webworker-threads').Worker;

var unsolvedSections = []; // contains sections that workers havent even started on
var runningSections = 0; // number of sections in workers right now

var username = process.argv[2] || "anonymous";

// will put new sections in unsolvedSections
var getSections = function(callback) {
	console.log("getting sections");
	var req = http.request({
		hostname: '127.0.0.1',
		port: 4568,
		method: 'GET',
		path: '/sections'
	}, function(res) {
		var sections = ''
		res.on('data', function (chunk) {
	    sections += chunk;
	  });
	  res.on('end', function() {
	    sections = JSON.parse(sections);
	    console.log("Received " + sections.length + " new sections");
	    unsolvedSections = unsolvedSections.concat(sections);
	    if (callback !== undefined) {
	    	callback();
	    }
	  });
	});
	req.on('error', function(e) {
  	console.log('ERROR with GET request: ' + e.message);
	});
	req.end();
}

// will post a solution to the server
var sendSolution = function(solvedSection) {
	console.log('posting a sectionId: ' + solvedSection.sectionId);
	var postData = JSON.stringify(solvedSection);
	var req = http.request({
		hostname: '127.0.0.1',
		port: 4568,
		method: 'POST',
		path: '/sections',
		headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
      }
	}, function(res) {
		res.destroy();
		console.log('successfully posted sectionId: ' + solvedSection.sectionId);
	});
	req.on('error', function(e) {
  	console.log('ERROR with POST request: ' + e.message);
	});

	req.write(postData);
	req.end();
}

var logStatus = function() {
	var req = http.request({
		hostname: '127.0.0.1',
		port: 4568,
		method: 'GET',
		path: '/status'
	}, function(res) {
		var status = ''
		res.on('data', function (chunk) {
	    status += chunk;
	  });
		res.on('end', function() {
	    console.log(status);
	  });
	});
	req.on('error', function(e) {
  	console.log('ERROR with status GET request: ' + e.message);
	});
	req.end();
}

// will be running the entire time the client is running
var startWorkers = function() {

	while(runningSections < 50 && unsolvedSections.length > 0) {
		var worker = new Worker('src/cluster/sectionWorker.js');
		worker.onmessage = function(msg) {
			var solvedSection = msg.data;
  		solvedSection.solver = username;
			console.log('just solved sectionId: ' + JSON.stringify(solvedSection.sectionId));
			runningSections--;
			console.log("numWorkers: " + runningSections);
			sendSolution(solvedSection);
			this.terminate();
		}
		runningSections++;
		console.log("numWorkers: " + runningSections);
		worker.postMessage(unsolvedSections.shift());	
	}
}

getSections(startWorkers);

setInterval(function() {
	console.log("number of unsolvedSections: " + unsolvedSections.length);
	if (unsolvedSections.length === 0 || runningSections === 0) {
		getSections(startWorkers);
	}
	logStatus();
	console.log("numWorkers: " + runningSections);
}, 5000)