var partsGenerator = require('./cnq');
var und = require('underscore');
var Firebase = require("firebase");
var ref = new Firebase("https://fiery-inferno-3618.firebaseio.com/nqueens/");



var n = process.argv[2] || 16;
var numParts = process.argv[3] || 1000

var currentRef = ref.child(n.toString());
currentRef.set({});

var parts = partsGenerator.getParts(n,numParts);

und.each(parts, function(part, i) {
	console.log('generating sectionId: ' + i + ' for n = ' + n);
	currentRef.child(i.toString()).set({
		sectionId: i,
		n:n,
		section: part,
		status: 'UNPROCESSED',
		solutionCount: null,
		solver: null,
		createdAt: Date.now(),
		pendingSince: null,
		solvedAt: null,
		computeTime: null
	});
});
