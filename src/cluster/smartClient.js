var http = require('http');
var und = require('underscore');
var Worker = require('webworker-threads').Worker;
var numWorkers = 50
var username = process.argv[2] || "anonymous";

var sections = [];
var gettingSectionsLock = false;
var waitingOnSections = [];
var problemSolved = false;

var pullSections = function(callback) {
	console.log("getting sections");
	var req = http.request({
		hostname: '127.0.0.1',
		port: 4568,
		method: 'GET',
		path: '/sections'
	}, function(res) {
		var secs = ''
		res.on('data', function (chunk) {
	    secs += chunk;
	  });
	  res.on('end', function() {
	    secs = JSON.parse(secs);
	    console.log("Received " + secs.length + " new sections");
	    callback(secs);
	  });
	});
	req.on('error', function(e) {
  	console.log('ERROR with GET request: ' + e.message);
  	gettingSectionsLock = true;
  	waitingOnSections(function() {});
	});
	req.end();
}

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
};

var getSection = function(callback) { // the callback takes the section

	if (sections.length > 0) {
		callback(sections.shift());
	} else {
		waitingOnSections.push(callback);
		if (gettingSectionsLock === false) {
			gettingSectionsLock = true;
			pullSections(function(secs) {
				if (secs.length === 0) {
					noMoreSections = true;
					return;
				}
				sections = secs;
				und.each(waitingOnSections, function(cb) {
					getSection(cb);
				})
				gettingSectionsLock = false;
			});
		}	
	}
};


var createWorker = function() {
	console.log('creating worker');
	var worker = new Worker('src/cluster/sectionWorker.js');
	worker.onmessage = function(msg) {
		var solvedSection = msg.data;
		solvedSection.solver = username;
		console.log('just solved sectionId: ' + JSON.stringify(solvedSection.sectionId));
		sendSolution(solvedSection);
		if (!problemSolved) {
			createWorker();
		}
		this.terminate();
	}
	getSection(worker.postMessage);
};
// ON init, we request a packet of sections
// then we run the specified number of workers
	// each worker is responsible for spawning another one at the end
	// And each worker must pull down new sections from server if necessary



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
};

var init = function(workerCount) {
	console.log('initializing');
	for (var i = 0; i < workerCount; i++) {
		createWorker();
	}
};

//GO!
init(10);
setInterval(function() {
	logStatus();
}, 5000);