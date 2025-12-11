input = Object.fromEntries(
  document
    .querySelector('pre')
    .firstChild.data.split('\n')
    .filter(x => x)
    .map(x => x.split(': '))
    .map(([from, to]) => [from, to.split(' ')])
);

memo = f => {
  const cache = {};

  return (...args) => (cache[JSON.stringify(args)] ??= f(...args));
};

solve = memo((from, count = 0) => {
  if (from === 'fft' || from === 'dac') count++;

  if (from === 'out') return [1, count === 2 ? 1 : 0];
  return input[from]
    .map(to => solve(to, count))
    .reduce((s, x) => s.map((s, i) => s + x[i]));
});

a = solve('you')[0];
b = solve('svr')[1];

[a, b];
