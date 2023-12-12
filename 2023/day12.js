data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .map(([s, x]) => [s, x.split(',').map(x => parseInt(x, 10))]);

solve = (s, ls) => {
  // empty cases
  if (!s) return ls.length ? 0 : 1;
  if (!ls.length) return s.includes('#') ? 0 : 1;

  // check if remaining string is long enough still
  if (s.length < ls.reduce((s, x) => s + x) + ls.length - 1) return 0;

  // check first character
  if (s[0] === '.') return solve(s.slice(1), ls);
  if (s[0] === '#') {
    // match the whole current spring
    for (i = 0; i < ls[0]; i++) {
      if (s[i] === '.') return 0;
    }
    // make sure there is a space afterwards (or end of line)
    return s[ls[0]] !== '#' ? solve(s.slice(ls[0] + 1), ls.slice(1)) : 0;
  }

  // first character is ? so try both
  return solve(`.${s.slice(1)}`, ls) + solve(`#${s.slice(1)}`, ls);
};

// memoize solve
memo = {};
memoize =
  f =>
  (...params) =>
    (memo[params.join(';')] ??= f(...params));
solve = memoize(solve);

// problem 1
a = data.map(x => solve(...x)).reduce((s, x) => s + x);

// problem 2
b = data
  .map(([s, ls]) => [
    [...Array(5)].map(() => s).join('?'),
    [...Array(5)].flatMap(() => ls),
  ])
  .map(x => solve(...x))
  .reduce((s, x) => s + x);

[a, b];
