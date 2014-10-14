var partsGenerator = require('./cnq');
var und = require('underscore');
var Firebase = require("firebase");
var ref = new Firebase("https://fiery-inferno-3618.firebaseio.com/nqueens/");

var currentRef = ref.child("19");
currentRef.set({});

var parts = partsGenerator.getParts(19,50000);

und.each(parts, function(part, i) {
	currentRef.child(i.toString()).set({
		sectionId: i,
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
