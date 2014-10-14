var und = require('underscore');
var Firebase = require("firebase");
var ref = new Firebase("https://fiery-inferno-3618.firebaseio.com/nqueens/19");

var sectionData = [];

var updateStatus = function() {
	var solved = 0;
	var pending = 0;
	var solutionCount = 0;
	und.each(sectionData, function(part) {
		if (part.status === 'SOLVED') {
			solved++;
			solutionCount += part.solutionCount;
		} else {
			pending++;
		}
	});
	console.log("***************");
	console.log("time: " + Date.now());
	console.log("solved: " + solved);
	console.log("pending: " + pending);
	console.log(((solved / (solved+pending))*100)+"% complete");
	if (pending === 0) {
		console.log("Found " + solutionCount + " solutions");
	}
}

ref.on('value', function(allParts){
	sectionData = allParts.val();
	updateStatus();
});
