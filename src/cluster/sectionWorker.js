var sectionCount = 0;
var sizeMask;


var placeQueen = function(n,col,rd,ld,sym) {

  if (sizeMask === col) {
    sectionCount++;
    if (sym) {
      sectionCount++;
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
	var args = oEvent.data.section;
	sizeMask = Math.pow(2,args[0]) - 1;
	placeQueen(args[0],args[1],args[2],args[3],args[4]);
  var solvedSection = oEvent.data;
  solvedSection.status = 'SOLVED';
  solvedSection.solutionCount = sectionCount;
  solvedSection.solvedAt = Date.now;
  postMessage(solvedSection);
};


