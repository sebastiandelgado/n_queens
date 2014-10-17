var und = require('underscore');
var moment = require('moment');
var Firebase = require("firebase");

//var n = process.argv[2] || 16;

var sectionData = [];
var N;

exports.connectToProblem = function(n) {
	var ref = new Firebase("https://fiery-inferno-3618.firebaseio.com/nqueens/" + n);
	N = n;
	ref.on('value', function(allParts) {
		sectionData = allParts.val();
	});
}



exports.getStatus = function(ref) {


	var solved = 0;
	var pending = 0;
	var solutionCount = 0;
	var users = {} // k = username ; v = sectionsSolved
	und.each(sectionData, function(part) {
		if (part.status === 'SOLVED') {
			solved++;
			solutionCount += part.solutionCount;
		} else {
			pending++;
		}
		if (part.solver !== null && part.solver != undefined) {
			if (users[part.solver] === undefined) {
				users[part.solver] = 0;
			}
			users[part.solver]++;
		}
	});
	sortedUsers = [];
	for (k in users) {
		sortedUsers.push([k, users[k]]);
	}
	sortedUsers.sort(function(a,b) {
		return a[1] < b[1];
	});


	status = '';
	status += "*****************************\n";
	status += "n = " + N + "\n";
	status += moment().toString() + "\n";
	status += "solved: " + solved + "\n";
	status += "pending: " + pending + "\n";
	status += ((solved / (solved+pending))*100)+"% complete" + "\n";
	if (pending === 0) {
		status += "Found " + solutionCount + " solutions" + "\n";
	}
	status += "TOP CONTRIBUTORS" + "\n";
	for (var i = 0; i < sortedUsers.length; i++) {
		status += sortedUsers[i][0] + ': ' + sortedUsers[i][1] + ' sections' + "\n";
	}
	status += "*****************************\n";
	return status;

};

var logStatus = function() {
	console.log(exports.getStatus());
}



