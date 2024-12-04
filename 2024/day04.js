data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

getLetter = (i, j) =>
  i >= 0 && j >= 0 && i < data.length && j < data[0].length
    ? data[i][j]
    : undefined;

solve = count =>
  data
    .flatMap((row, i) => row.map((_, j) => ({ i, j })))
    .map(count)
    .reduce((s, x) => s + x);

// problem 1
a = solve(
  ({ i, j }) =>
    [-1, 0, 1]
      .flatMap(x => [-1, 0, 1].map(y => [x, y]))
      .filter(([di, dj]) =>
        'XMAS'
          .split('')
          .every((x, k) => getLetter(i + k * di, j + k * dj) === x)
      ).length
);

// problem 2
b = solve(({ i, j }) => {
  mas = 'MAS';
  if (data[i][j] !== mas[1]) return 0;

  return [
    [
      [-1, -1],
      [1, 1],
    ],
    [
      [-1, 1],
      [1, -1],
    ],
  ].every(
    dir =>
      dir
        .map(([di, dj]) => mas.indexOf(getLetter(i + di, j + dj)) - 1)
        .reduce((p, x) => p * x) === -1
  )
    ? 1
    : 0;
});

[a, b];
