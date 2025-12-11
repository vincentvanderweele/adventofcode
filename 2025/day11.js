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
  if (from === 'fft' || from === 'dac') count--;

  if (from === 'out') return count > 0 ? 0 : 1;

  return input[from].map(to => solve(to, count)).reduce((s, x) => s + x);
});

a = solve('you');
b = solve('svr', 2);

[a, b];
