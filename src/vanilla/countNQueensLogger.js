var numberOfQueens = process.argv[2];
if (numberOfQueens === undefined) {
	console.error("ERROR: Requires argument: number of queens");
	return;
}
var fs = require('fs')
var nQueens = require('./countNQueens.js');
var moment = require('moment');
var log = []; 

var countingSolutions = [1, 0, 0, 2, 10, 4, 40, 92, 352,
											 	724, 2680, 14200, 73712, 365596, 
						 						2279184, 14772512, 95815104, 666090624,
						 						4968057848, 39029188884, 314666222712,
						 						2691008701644, 24233937684440] // up to n=23

var appendToLog = function(line, nextN) {
	fs.appendFile('src/vanilla/runtimeLog.txt', line + '\n', function(err) {
		if (err) { 
			console.error('Failed to write to log'); 
		} else {
			if (nextN <= numberOfQueens) {
				count(nextN);
			}
		}
	});
}

var count = function(n) {
	console.log("running vanilla N queens for n = " + n);
	var start = Date.now();
	var count = nQueens.countNQueens(n);
	var finish = Date.now();
	var runtime = (finish - start) / 1000;
	var logEntry = '';
	if (count === countingSolutions[n-1]) {
		logEntry = 'Found ' + count + ' solutions for N = '; 
		logEntry += n + ' in ' + runtime + ' seconds';
	} else {
		logEntry = 'ERROR: Incorrect number of solutions';
		logEntry += '. Expected ' + count + ' to be ' + countingSolutions[n-1];
		logEntry += '. Took ' + runtime + ' seconds to run';
	}
	appendToLog(logEntry, n+1);
}

var separator = '*************************************************************'

appendToLog(separator+'\n'+'Started running N queens at '+
	moment().format('MMMM Do YYYY, h:mm:ss a') + '\n' + separator, 1000);

count(1);

//appendToLog(separator+'Finished running N queens at '+
//	moment().format('MMMM Do YYYY, h:mm:ss a') + separator, 1000);
