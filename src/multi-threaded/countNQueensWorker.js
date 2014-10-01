var partialCount = 0;
var sizeMask;


var placeQueen = function(n,col,rd,ld) {

  if (sizeMask === col) {
    partialCount++;
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
        (ld | freeSpot) << 1);
  }
};

onmessage = function (oEvent) {
	var args = oEvent.data.split(',');
	sizeMask = Math.pow(2,args[0]) - 1;
	placeQueen(args[0],args[1],args[2],args[3]);
  postMessage(partialCount);
};


