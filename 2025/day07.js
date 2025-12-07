input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .filter((_, i) => i % 2 === 0)
  .map(x =>
    x
      .split('')
      .map((x, i) => [x, i])
      .filter(([x]) => x !== '.')
      .map(([, i]) => i)
  );

a = input.slice(1).reduce(
  ({ s, c }, x) => ({
    s: new Set(
      [...s].flatMap(y => (x.some(x => x === y) ? [y - 1, y + 1] : [y]))
    ),
    c: c + x.filter(x => s.has(x)).length,
  }),
  { s: new Set(input[0]), c: 0 }
).c;

memo = f => {
  const cache = {};
  return (...args) => (cache[JSON.stringify(args)] ??= f(...args));
};

tl = memo((r, c) => {
  if (r >= input.length) return 1;

  return input[r].some(x => x === c)
    ? tl(r + 1, c - 1) + tl(r + 1, c + 1)
    : tl(r + 1, c);
});

b = tl(1, input[0][0]);

[a, b];
