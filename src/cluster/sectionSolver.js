// INPUT: an array of sections
// OUTPUT: an array of solved sections with solutionCount
// Will perform these computations by multithreading

var Worker = require('webworker-threads').Worker;
var numFinished = 0;
var workerPool = [];

var solutions = [];

exports.solve = function(sections) {


	for (var i = 0; i < sections.length; i++) {
		workerPool[i] = new Worker('src/cluster/countNQueensWorker.js');
		workerPool[i].onmessage = function(msg) {
		}

	}

}