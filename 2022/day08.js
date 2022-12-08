data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => parseInt(x)));
n = data.length;

// problem 1
range = (s, e) => [...Array(e - s)].map((_, i) => s + i);

data.flatMap((r, x) =>
  r.filter(
    (v, y) =>
      range(0, x).every(z => data[z][y] < v) ||
      range(x + 1, n).every(z => data[z][y] < v) ||
      range(0, y).every(z => data[x][z] < v) ||
      range(y + 1, n).every(z => data[x][z] < v)
  )
).length;

// problem 2
score = (x, y, dx, dy) => {
  i = 1;
  while (data[x + i * dx]?.[y + i * dy] < data[x][y]) i++;
  return data[x + i * dx]?.[y + i * dy] === undefined ? i - 1 : i;
};

Math.max(
  ...data.flatMap((r, x) =>
    r.map(
      (_, y) =>
        score(x, y, -1, 0) *
        score(x, y, 1, 0) *
        score(x, y, 0, -1) *
        score(x, y, 0, 1)
    )
  )
);
