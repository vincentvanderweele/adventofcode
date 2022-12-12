data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

values = data.flatMap((r, y) => r.map((v, x) => ({ c: 100 * x + y, v })));

find = c => values.filter(({ v }) => v === c).map(({ c }) => c)[0];
S = find('S');
E = find('E');

heights = Object.fromEntries(
  values
    .map(({ c, v }) => ({ c, v: v === 'S' ? 'a' : v === 'E' ? 'z' : v }))
    .map(({ c, v }) => [c, v.charCodeAt(0) - 'a'.charCodeAt(0)])
);

neighbors = c =>
  [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
    .map(([dx, dy]) => [Math.floor(c / 100) + dx, (c % 100) + dy])
    .filter(
      ([x, y]) => x >= 0 && x <= data[0].length && y >= 0 && y <= data.length
    )
    .map(([x, y]) => 100 * x + y);

current = new Set([E]);
dist = {};
d = 0;

while (current.size > 0) {
  for (c of current) dist[c] = d;

  current = new Set(
    [...current].flatMap(c =>
      neighbors(c).filter(
        n => dist[n] === undefined && heights[n] >= heights[c] - 1
      )
    )
  );

  d++;
}

// problem 1
dist[S];

// problem 2
Math.min(
  ...values
    .filter(({ v }) => v === 'a')
    .map(({ c }) => dist[c])
    .filter(x => x)
);
