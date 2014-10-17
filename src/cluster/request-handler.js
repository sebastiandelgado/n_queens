var n = 17;
var MAX_SECTION_PACKET_SIZE = 15;
var Firebase = require("firebase");
var ref = new Firebase("https://fiery-inferno-3618.firebaseio.com/nqueens/" + n);
var status = require('./problemStatus.js');
status.connectToProblem(n);
var sectionData;
var nextSection = 0; // index of the first section that is unprocessed

exports.sendSections = function(req, res) {
	console.log("Received get request for sections");

	var sectionPacket = [];
	var l = sectionData.length;
	for (var i = 0; i < l; i++) {
		if (sectionPacket.length >= MAX_SECTION_PACKET_SIZE) {
			break;
		} else if (sectionData[nextSection % l].status === 'UNPROCESSED') {
			sectionPacket.push(sectionData[nextSection % l]);
		}
		nextSection++;
	}
	res.status(200).send(sectionPacket);
};

exports.sendStatus = function(req, res) {
	var stat = status.getStatus();
	res.status(200).send(stat);

}

exports.receiveSolutions = function(req, res) {
	console.log("Received solution for sectionId: " + req.body.sectionId);
	var section = req.body;
	if (section.status === 'SOLVED' && section.solutionCount !== undefined) {
		
		ref.child(section.sectionId).set(section, function(err) {
			if (err) {
				console.error("could not set this section: " + section);
			} else {
				console.log("successfully updated sectionId: " + section.sectionId);
			}
		});
		res.status(202).end();
	} else {
		console.log("received unsolved section: " + JSON.stringify(section));
		res.status(404).end();
	}

};

ref.on('value', function(allParts){
	console.log("updated sectionData")
	sectionData = allParts.val();
});


// setInterval(function() {
// 	console.log(status.getStatus());
// }, 5000)
