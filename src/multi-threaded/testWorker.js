var partialCount = 0;
var sizeMask;


var placeQueen = function(n,col,rd,ld, sym) {
  console.log(arguments);

  if (sizeMask === col) {
    partialCount++;
    if (sym) {
      partialCount++;
    }
    return;
  }

  var freeSpotsRemaining = ((~(col | rd | ld)) & sizeMask);

  while (freeSpotsRemaining > 0) {
    //get the rightmost spot
    var freeSpot = -freeSpotsRemaining & freeSpotsRemaining;
    // update freeSpots remaining
    freeSpotsRemaining -= freeSpot;
    //process the rightmost spot
    placeQueen(n,
    		col | freeSpot,
        (rd | freeSpot) >> 1,
        (ld | freeSpot) << 1,
        sym);
  }
};

onmessage = function (oEvent) {
	var args = oEvent.data.split(',');
	sizeMask = Math.pow(2,args[0]) - 1;
	placeQueen(args[0][0],args[0][1],args[0][2],args[0][3], args[0][4]);
  postMessage(partialCount);
};


var problemParts = require('./splitProblem.js').getParts(8, 1);
console.log(problemParts);
placeQueen(problemParts[0]);
placeQueen(problemParts[1]);
placeQueen(problemParts[2]);
placeQueen(problemParts[3]);
console.log(partialCount);