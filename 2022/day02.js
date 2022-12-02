data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '));

points = { A: 1, B: 2, C: 3}

score = (a, b) => 3 * ((points[b] - points[a] + 4) % 3);
findScore = (a, s) => ['A', 'B', 'C'].find(b => score(a, b) === s);

// problem 1
data
  .map(([a, b]) => [a, { X: 'A', Y: 'B', Z: 'C' }[b]])
  .map(([a, b]) => points[b] + score(a, b))
  .reduce((s, e) => s + e);

// problem 2
data
  .map(([a, b]) => [a, findScore(a, { X: 0, Y: 3, Z: 6 }[b])])
  .map(([a, b]) => points[b] + score(a, b))
  .reduce((s, e) => s + e);
