data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' ').map(x => parseInt(x, 10)));

solve = data =>
  data
    .map(x => {
      memo = {};
      value = (i, j) => {
        if (!j) return x[i];
        if (memo[`${i};${j}`]) return memo[`${i};${j}`];
        return (memo[`${i};${j}`] = value(i, j - 1) - value(i + 1, j - 1));
      };

      return x.reduce((s, _, j) => s + value(0, j), 0);
    })
    .reduce((s, x) => s + x);

// problem 1
a = solve(data.map(x => [...x].reverse()));

// problem 2
b = solve(data);

[a, b];
