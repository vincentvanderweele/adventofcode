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
    .filter(({ target, numbers }) => {
      r = (t = target, i = numbers.length - 1) => {
        if (i === 0) {
          return t === numbers[0];
        }

        let result = r(t - numbers[i], i - 1);
        if (t % numbers[i] === 0) {
          result ||= r(t / numbers[i], i - 1);
        }
        if (useConcat) {
          const base = Math.pow(10, Math.ceil(Math.log10(numbers[i] + 1)));
          if (t % base === numbers[i]) {
            result ||= r(Math.floor(t / base), i - 1);
          }
        }

        return result;
      };

      return r();
    })
    .map(x => x.target)
    .reduce((s, x) => s + x);

// Problem 1
a = solve(false);

// Problem 2
b = solve(true);

[a, b];
