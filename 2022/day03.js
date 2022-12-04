data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

a = 'a'.charCodeAt(0);
A = 'A'.charCodeAt(0);

solve = groupedData =>
  groupedData
    .map(x => x.map(x => new Set(x)))
    .map(sets => sets.reduce((r, s) => new Set([...r].filter(x => s.has(x)))))
    .flatMap(x => [...x])
    .map(x => x.charCodeAt(0))
    .map(x => (x < a ? x - A + 27 : x - a + 1))
    .reduce((s, e) => s + e);

// problem 1
solve(data.map(x => [x.slice(0, x.length / 2), x.slice(x.length / 2)]));

// problem 2
solve([...Array(data.length / 3)].map((_, x) => data.slice(3 * x, 3 * x + 3)));
