data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x =>
    x
      .split(': ')[1]
      .split('; ')
      .map(x =>
        x.split(', ').reduce(
          (r, x) => ({
            ...r,
            [x.split(' ')[1]]: parseInt(x.split(' ')[0], 10),
          }),
          {}
        )
      )
  );

// problem 1
a = data.reduce(
  (s, x, i) =>
    s +
    (x.every(x => !(x.red > 12) && !(x.green > 13) && !(x.blue > 14))
      ? i + 1
      : 0),
  0
);

// problem 2
b = data
  .map(x =>
    ['red', 'green', 'blue']
      .map(c => Math.max(...x.map(x => x[c] ?? 0)))
      .reduce((p, x) => p * x, 1)
  )
  .reduce((s, x) => s + x);

[a, b];
