input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => parseInt(x, 10)));

a = input
  .map(([m1, m2, ...r]) =>
    r.reduce(
      ([m1, m2], x) => (m2 > m1 ? [m2, x] : [m1, Math.max(m2, x)]),
      [m1, m2]
    )
  )
  .reduce((s, [x1, x2]) => s + 10 * x1 + x2, 0);

b = input
  .map(a =>
    a.slice(12).reduce((m, x) => {
      m.push(x);
      for (i = 0; i < 12; i++) {
        if (m[i + 1] > m[i]) {
          m.splice(i, 1);
          break;
        }
      }
      return m.slice(0, 12);
    }, a.slice(0, 12))
  )
  .reduce((s, x) => s + x.reduce((r, x) => 10 * r + x), 0);

[a, b];
