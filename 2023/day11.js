data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

transpose = d =>
  d.reduce(
    (r, x) => {
      x.forEach((x, i) => r[i].push(x));
      return r;
    },
    [...Array(d[0].length)].map(() => [])
  );

emptyRows = d =>
  d
    .map((row, i) => [row, i])
    .filter(([row]) => row.every(x => x === '.'))
    .map(([, i]) => i);
empty = [emptyRows(transpose(data)), emptyRows(data)];

between = (i, l, r) => {
  min = Math.min(l, r);
  max = Math.max(l, r);
  return empty[i].filter(x => min < x && x < max).length;
};

locations = data.flatMap((row, y) =>
  row.flatMap((c, x) => (c === '#' ? [[x, y]] : []))
);

solve = factor => {
  result = 0;
  for (i = 0; i < locations.length; i++)
    for (j = i + 1; j < locations.length; j++)
      result += [0, 1].reduce((s, k) => {
        l = locations[i][k];
        r = locations[j][k];
        return s + Math.abs(l - r) + factor * between(k, l, r);
      }, 0);
  return result;
};

// problem 1
a = solve(1);

// problem 2
b = solve(999999);

[a, b];
