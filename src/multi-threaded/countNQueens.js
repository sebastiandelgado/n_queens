var countNQueens = function(n) {
	//spawn a bunch of web workers
	//call them on placeQueen using a symetrical approach
	//use count as an input variable that needs to be returned.
	var start = Date.now();

	if (n === 1) {
    return 1;
  }

  var Worker = require('webworker-threads').Worker;

	var numPartialCounts = 0;
	var totalCount = 0
	var numWorkers = Math.floor(n/2) + (n%2);
	var workerPool = [];

	// create one worker per queen placed on the first half of the first row
	for (var i = 0; i < numWorkers; i++) {
		workerPool[i] = new Worker('src/countNQueensWorker.js');
		// what to do when the worker responds with a partial count
		workerPool[i].onmessage = function(msg) {
			// here we handle the 'median' worker if n is odd
			if (workerPool.indexOf(this) < Math.floor(n/2)) {
				totalCount += 2*(msg.data);
			} else {
				totalCount += msg.data;
			}
			reportDone();
			this.terminate();
		};
		// post a message to the worker so he begins work
		var attackVector = (1 << ((n-1) - i));
    workerPool[i].postMessage(''+n+','+(attackVector)+','+(attackVector>>>1)+','+(attackVector<<1));
	}

  // called every time a worker returns a value 
  var reportDone = function() {
  	numPartialCounts += 1;
			if (numPartialCounts === numWorkers) {
				var finish = Date.now();
				console.log("Found " + totalCount + " n-queens for n = " + n);
				console.log("Completion Time " + ((finish - start) / 1000) + "seconds");
			}
  }
}

countNQueens(18);

