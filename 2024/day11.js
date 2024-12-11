input = document
  .querySelector('pre')
  .firstChild.data.split(' ')
  .filter(x => x)
  .map(x => parseInt(x, 10));

memo = f => {
  const cache = {};

  return (...args) => (cache[JSON.stringify(args)] ??= f(...args));
};

solve = memo((x, n) => {
  if (n === 0) return 1;
  if (x === 0) return solve(1, n - 1);

  if (Math.floor(Math.log10(x)) % 2 === 1) {
    const base = Math.pow(10, (Math.floor(Math.log10(x)) + 1) / 2);
    const right = x % base;
    const left = (x - right) / base;

    return solve(left, n - 1) + solve(right, n - 1);
  }

  return solve(x * 2024, n - 1);
});

// Problem 1
a = input.map(x => solve(x, 25)).reduce((s, x) => s + x);

// Problem 2
b = input.map(x => solve(x, 75)).reduce((s, x) => s + x);

[a, b];
