data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.match(/\d+/g).map(x => parseInt(x, 10)));

solve = races =>
  races
    .map(([t, d]) => [
      Math.floor((t - Math.sqrt(t * t - 4 * d)) / 2) + 1,
      Math.ceil((t + Math.sqrt(t * t - 4 * d)) / 2) - 1,
    ])
    .map(([min, max]) => max - min + 1)
    .reduce((p, x) => p * x, 1);

// problem 1
a = solve(
  data.reduce(
    (r, x) => (r.length ? r.map((r, i) => [...r, x[i]]) : x.map(x => [x])),
    []
  )
);

// problem 2
b = solve([data.map(x => parseInt(x.join(''), 10))]);

[a, b];
