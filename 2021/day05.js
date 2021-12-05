data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => x.split(' -> ').map((y) => y.split(',').map((z) => parseInt(z))));

solve = (data) =>
  Object.entries(
    data
      .flatMap(([[x0, y0], [x1, y1]]) => {
        n = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1));
        return [...Array(n + 1)].map((_, i) => [
          x0 + (i * (x1 - x0)) / n,
          y0 + (i * (y1 - y0)) / n,
        ]);
      })
      .reduce((r, [x, y]) => {
        z = `${x},${y}`;
        r[z] = (r[z] ?? 0) + 1;
        return r;
      }, {})
  ).filter(([_, count]) => count > 1).length;

// problem 1
solve(data.filter(([[x0, y0], [x1, y1]]) => x0 === x1 || y0 === y1));

// problem 2
solve(data);
