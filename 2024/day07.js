eqs = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(': '))
  .map(([t, n]) => ({
    target: parseInt(t, 10),
    numbers: n.split(' ').map(x => parseInt(x, 10)),
  }));

solve =
  useConcat =>
  ({ target, numbers }) => {
    const cache = {};
    const r = (n = numbers, c = 0) => {
      if (n.length === 0) return target === c;

      const key = `${n.join(',')},${c}`;
      if (cache[key] !== undefined) return cache[key];

      const [n0, ...rest] = n;

      const result =
        r(rest, c + n0) ||
        r(rest, c * n0) ||
        (useConcat && c > 0 && r([parseInt(`${c}${n0}`, 10), ...rest], 0));

      cache[key] = result;
      return result;
    };
    return r();
  };

// Problem 1
a = eqs
  .filter(solve(false))
  .map(x => x.target)
  .reduce((s, x) => s + x);

// Problem 2
b = eqs
  .filter(solve(true))
  .map(x => x.target)
  .reduce((s, x) => s + x);

[a, b];
