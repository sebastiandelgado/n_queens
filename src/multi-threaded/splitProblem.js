
/* Will return an array of states for searching
* the space of the n queens problem
* State: [n, col, rd, ld, sym]
* numParts >= n/2 please
* It may return up to numParts + n parts.
*/
var splitQueensProblem = function(n, numParts) {

	// get the states for the first row
	var getFirstRow = function(n) {
		var firstRow = [];
		var numStates = Math.floor(n/2) + (n%2);
		for (var i =0; i < numStates; i++) {
			var col = (1 << ((n-1) - i));
			firstRow.push([n,col,col>>>1,col<<1, (i < Math.floor(n / 2))]);
		}
		return firstRow;
	}

	// get the states that follow a particular state (pruning incl.)
	var getChildren = function(n,col,rd,ld,sym) {
		var sizeMask = Math.pow(2,n) - 1;
		if (sizeMask === col) {
			return [];
		}
		var children = [];
		var freeSpotsRemaining = ((~(col | rd | ld)) & sizeMask);
		while (freeSpotsRemaining > 0) {
	    var freeSpot = -freeSpotsRemaining & freeSpotsRemaining;
	    freeSpotsRemaining -= freeSpot;
	    children.push([n, col | freeSpot, (rd | freeSpot) >> 1, (ld | freeSpot) << 1, sym]);
  	}
  	return children;
	}

	states = getFirstRow(n);

	while (states.length < numParts) {
		var toExp = states.shift();
		var children = getChildren(toExp[0],toExp[1],toExp[2],toExp[3], toExp[4]);
		if (children.length === 0) {
			console.log("You probably specified too many children");
			break;
		}
		for (var i = 0; i < children.length; i++) {
			states.push(children[i]);
		}
	}
	return states
}

var n = 8;
var count = 0;
var attacks = Math.pow(2,n);
var sizeMask = attacks - 1;
var placeQueen = function(col,rd,ld,sym) {
  if (sizeMask === col) {
    count++;
    if (sym) {
    	count++;
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
    placeQueen(
        col | freeSpot,
        (rd | freeSpot) >> 1,
        (ld | freeSpot) << 1,
        sym);
  }
};


exports.getParts = splitQueensProblem;
