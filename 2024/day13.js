games = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x)
  .map(x =>
    x
      .split('\n')
      .filter(x => x)
      .map(x => [...x.matchAll(/\d+/g)].map(x => parseInt(x, 10)))
  );

solve = ([[xa, ya], [xb, yb], [xt, yt]]) => {
  const b = (xa * yt - ya * xt) / (xa * yb - xb * ya);
  const a = (xt - b * xb) / xa;

  return 3 * a + b;
};

solveAll = games =>
  games
    .map(solve)
    .filter(x => x % 1 === 0)
    .reduce((s, x) => s + x);

// Problem 1
a = solveAll(games);

// Problem 2
b = solveAll(games.map(([a, b, x]) => [a, b, x.map(x => x + 10000000000000)]));

[a, b];
