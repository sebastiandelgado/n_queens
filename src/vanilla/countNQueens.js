exports.countNQueens = function(n) {

  if (n === 1) {
    return 1;
  }

  var count = 0;
  var attacks = Math.pow(2,n);
  var sizeMask = attacks - 1;

  var placeQueen = function(col,rd,ld) {
    if (sizeMask === col) {
      count++;
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
          (ld | freeSpot) << 1);
    }
  };
  
  for (var i = 0; i < Math.floor(n/2); i++) {
    attacks = attacks >> 1;
    placeQueen(attacks, attacks >> 1, attacks << 1);
  }

  count *= 2; // double count because symmetry

  if (n%2 === 1) {
    attacks = attacks >> 1;
    placeQueen(attacks, attacks >> 1, attacks << 1);
  }

return count;

}

