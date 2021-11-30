data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')
  .filter(x => x)
  .map(x => x.split('\n').filter(x => x).map(y => y.split('')));
  
// problem 1
data.map(x => x.map(y => new Set(y)))
  .map(x => x.reduce((r, x) => new Set([...r, ...x])))
  .map(x => x.size)
  .reduce((r, x) => r+x, 0)

// problem 2
data.map(x => x.map(y => new Set(y)))
  .map(x => x.reduce((r, x) => new Set([...r].filter(y => x.has(y)))))
  .map(x => x.size)
  .reduce((r, x) => r+x, 0)
