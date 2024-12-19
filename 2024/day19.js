input = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x);

patterns = input[0].split(', ');
designs = input[1].split('\n').filter(x => x);

memo = f => {
  const cache = {};

  return (...args) => (cache[JSON.stringify(args)] ??= f(...args));
};

solve = memo(s => {
  if (s.length === 0) return 1;

  return patterns
    .filter(x => s.startsWith(x))
    .map(x => solve(s.slice(x.length)))
    .reduce((s, x) => s + x, 0);
});

// Problem 1
a = designs.filter(solve).length;

// Problem 2
b = designs.map(solve).reduce((s, x) => s + x);

[a, b];
