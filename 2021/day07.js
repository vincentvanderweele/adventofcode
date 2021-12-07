data = document
  .querySelector('pre')
  .firstChild.textContent.split(',')
  .map((x) => parseInt(x));

solve = (cost) =>
  Math.min(
    ...[...Array(Math.max(...data) + 1)]
      .map((_, i) => i)
      .map((target) =>
        data.reduce((sum, position) => sum + cost(position, target), 0)
      )
  );

// problem 1
solve((position, target) => Math.abs(position - target));

// problem 2

solve(
  (position, target) =>
    (Math.abs(position - target) * (Math.abs(position - target) + 1)) / 2
);
