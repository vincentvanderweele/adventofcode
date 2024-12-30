input = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x)
  .map(x => x.split('\n').filter(x => x))
  .map(rows => ({
    type: rows[0] === '#####',
    pins: rows.reduce(
      (r, x) => (r.forEach((_, i) => (r[i] += x[i] === '#' ? 1 : 0)), r),
      Array(5).fill(-1)
    ),
  }));

keys = input.filter(x => x.type).map(x => x.pins);
locks = input.filter(x => !x.type).map(x => x.pins);

keys.reduce(
  (r, k) =>
    r +
    locks.reduce(
      (s, l) => s + (k.every((_, i) => k[i] + l[i] <= 5) ? 1 : 0),
      0
    ),
  0
);
