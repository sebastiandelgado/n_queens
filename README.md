Count N Queens
==============

countNQueens.js returns the total number of solutions of the N Queens problem for a particular board size. It uses the bitshifting algorithm described in [this paper](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.51.7113&rep=rep1&type=pdf) and takes advantage of the reflective symmetry over the vertical axis. Additionally, it uses the webworker-threads node module to run different parts of the problem in parallel. 

Performance
-----------

Here is the performance of the algorithm running on my laptop (2.4GHz Intel Core 2 Duo)

| N  | Number of solutions | time to compute |
|:-- |:------------------- |:--------------- |
| 1  | 1                   | < 1 ms          |
| 2  | 0                   | 0.025 s         |
| 3  | 0                   | 0.026 s         |
| 4  | 2                   | 0.027 s         |
| 5  | 10                  | 0.038 s         |
| 6  | 4                   | 0.039 s         |
| 7  | 40                  | 0.056 s         |
| 8  | 92                  | 0.058 s         |
| 9  | 352                 | 0.067 s         |
| 10 | 724                 | 0.069 s         |
| 11 | 2680                | 0.085 s         |
| 12 | 14200               | 0.092 s         |
| 13 | 73712               | 0.136 s         |
| 14 | 365596              | 0.332 s         |
| 15 | 2279184             | 1.711 s         |
| 16 | 14772512            | 10.138 s        |
| 17 | 95815104            | 76.139 s        |
| 18 | 666090624           | 540.972 s       |
| 19 | 4968057848          | ?               |
| 20 | 39029188884         | ?               |