parseNumbers = line =>
  line
    .split(' ')
    .map(x => parseInt(x))
    .filter(x => !isNaN(x));

parse = () =>
  document
    .querySelector('pre')
    .firstChild.data.split('\n\n')
    .map(x => {
      const lines = x.split('\n');
      const numbers = lines.map(parseNumbers);

      return {
        items: numbers[1],
        op: lines[2].includes('+')
          ? y => y + (numbers[2][0] ?? y)
          : y => y * (numbers[2][0] ?? y),
        test: numbers[3][0],
        to: {
          true: numbers[4][0],
          false: numbers[5][0],
        },
        count: 0,
      };
    });

solve = (monkies, n, reduce) => {
  for (i = 0; i < n; i++) {
    for (let m of monkies) {
      while ((item = m.items.shift())) {
        m.count++;
        newItem = reduce(m.op(item));
        monkies[m.to[newItem % m.test === 0]].items.push(newItem);
      }
    }
  }

  return monkies
    .map(x => x.count)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((p, x) => p * x, 1);
};

// problem 1
solve(parse(), 20, x => Math.floor(x / 3));

// problem 2
monkies = parse();
mod = monkies.map(x => x.test).reduce((p, x) => p * x, 1);
solve(monkies, 10000, x => x % mod);
