var countNQueens = function(n) {
	var start = Date.now();
	if (n === 1) {
		return 1;
	}
	var Worker = require('webworker-threads').Worker;
	
	

	var problemParts = require('./splitProblem.js').getParts(n, n*2);
	var numWorkers = problemParts.length;
	var workerPool = [];
	var workersFinished = 0;
	var totalCount = 0;
	
	console.log('threadCount: ' + numWorkers);

	for (var i = 0; i < numWorkers; i++) {

		workerPool[i] = new Worker('src/multi-threaded/countNQueensWorker.js');
		workerPool[i].onmessage = function(msg) {
			totalCount += msg.data;
			reportDone();
			this.terminate();
		};

		workerPool[i].postMessage(problemParts[i]);
	}

	var reportDone = function() {
  	workersFinished += 1;
			if (workersFinished === numWorkers) {

				var finish = Date.now();

				var completeMessage = "Found " + totalCount + " n-queens for n = " + n + "\nCompletion Time " + ((finish - start) / 1000) + "seconds\n********************************\n";
				console.log(completeMessage);

				var fs = require('fs');
				fs.appendFile('src/multi-threaded/runtimeLog.txt', completeMessage, function(err) {
					if (err) { 
						console.error('Failed to write to log'); 
					} else {
						console.log('wrote results to log');
					}
				});
			}
  }
};

var n = process.argv[2] || 8;
countNQueens(n);

// var countNQueens = function(n) {
// 	//spawn a bunch of web workers
// 	//call them on placeQueen using a symetrical approach
// 	//use count as an input variable that needs to be returned.
// 	var start = Date.now();

// 	if (n === 1) {
//     return 1;
//   }

//   var Worker = require('webworker-threads').Worker;

// 	var numPartialCounts = 0;
// 	var totalCount = 0
// 	var numWorkers = Math.floor(n/2) + (n%2);
// 	var workerPool = [];

// 	// create one worker per queen placed on the first half of the first row
// 	for (var i = 0; i < numWorkers; i++) {
// 		workerPool[i] = new Worker('src/multi-threaded/countNQueensWorker.js');
// 		// what to do when the worker responds with a partial count
// 		workerPool[i].onmessage = function(msg) {
// 			// here we handle the 'median' worker if n is odd
// 			if (workerPool.indexOf(this) < Math.floor(n/2)) {
// 				totalCount += 2*(msg.data);
// 			} else {
// 				totalCount += msg.data;
// 			}
// 			reportDone();
// 			this.terminate();
// 		};
// 		// post a message to the worker so he begins work
// 		var attackVector = (1 << ((n-1) - i));
//     workerPool[i].postMessage(''+n+','+(attackVector)+','+(attackVector>>>1)+','+(attackVector<<1));
// 	}

//   // called every time a worker returns a value 
//   var reportDone = function() {
//   	numPartialCounts += 1;
// 			if (numPartialCounts === numWorkers) {
// 				var finish = Date.now();
// 				console.log("Found " + totalCount + " n-queens for n = " + n);
// 				console.log("Completion Time " + ((finish - start) / 1000) + "seconds");
// 			}
//   }
// }

// countNQueens(16);

