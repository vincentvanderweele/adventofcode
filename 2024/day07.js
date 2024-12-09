eqs = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(': '))
  .map(([t, n]) => ({
    target: parseInt(t, 10),
    numbers: n.split(' ').map(x => parseInt(x, 10)),
  }));

solve = useConcat =>
  eqs
    .filter(({ target, numbers }) =>
      [...numbers].reverse().reduce(
        (targets, x, i) =>
          i === numbers.length - 1
            ? targets.includes(x)
            : targets.flatMap(t => {
                const results = [];

                results.push(t - x);
                if (t % x === 0) results.push(t / x);
                if (useConcat) {
                  const base = Math.pow(10, Math.ceil(Math.log10(x + 1)));
                  if (t % base === x) results.push(Math.floor(t / base));
                }

                return results;
              }),
        [target]
      )
    )
    .map(x => x.target)
    .reduce((s, x) => s + x);

// Problem 1
a = solve(false);

// Problem 2
b = solve(true);

[a, b];
