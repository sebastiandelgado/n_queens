var partsGenerator = require('./cnq');
var und = require('underscore');
var Firebase = require("firebase");
var ref = new Firebase("https://fiery-inferno-3618.firebaseio.com/nqueens/");
var Worker = require('webworker-threads').Worker;

var currentRef = ref.child("19");



var startWorkers = function(sectionData) {
	und.each(sectionData.slice(0,300), function(section) {
		if (section.status !== 'SOLVED') {
			var worker = new Worker('src/cluster/sectionWorker.js');
			worker.onmessage = function(msg) {
				var returnedSection = msg.data;
				console.log("solved section id = " + returnedSection.sectionId);
				currentRef.child(returnedSection.sectionId).set(returnedSection);
				this.terminate();
			};
			console.log("starting worker for section id = " + section.sectionId);
			worker.postMessage(section);
		}
	})
}

var started = false;
currentRef.on('value', function(allParts) {
	if (!started) {
		startWorkers(allParts.val());
		started = true;
	}
});

// currentRef.on('value', function (allParts) {
// 	var parts = allParts.val();
// 	var workerPool = [];
// 	for (var i = 0; i < parts.length; i++) {
// 		if(parts[i].status !== 'SOLVED') {
// 			workerPool[i] = new Worker('src/cluster/sectionWorker.js');
// 			var part = parts[i];
// 			// worker needs to return the count
// 			workerPool[i].onmessage = function(msg) {
// 				var section = msg.data;
// 				console.log("solved section id = " + section.sectionId);
// 				currentRef.child(section.sectionId).set(section);
// 				this.terminate();
// 			};
// 			// get the worker to start
// 			console.log("Running worker for section " + part.sectionId);
// 			workerPool[i].postMessage(part);
			
// 		}
// 	}

// }, function (errorObject) {
//   console.log('The read failed: ' + errorObject.code);
// });



