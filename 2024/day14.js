input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x =>
    x.split(' ').map(x =>
      x
        .slice(2)
        .split(',')
        .map(x => parseInt(x, 10))
    )
  );

(n = 101), (m = 103);

// Problem 1
a = input
  .map(([[px, py], [vx, vy]]) => [
    (((px + 100 * vx) % n) + n) % n,
    (((py + 100 * vy + m) % m) + m) % m,
  ])
  .reduce(
    (r, p) => {
      if (p[0] === n >> 1 || p[1] === m >> 1) return r;

      r[(p[0] < n / 2 ? 0 : 1) + (p[1] < m / 2 ? 0 : 2)]++;
      return r;
    },
    [0, 0, 0, 0]
  )
  .reduce((p, x) => p * x);

// Problem 2
horizontalClusters = map =>
  map.reduce((r, row) => {
    const rowMax = row.reduce(
      ({ current, max }, c) =>
        c === 'X'
          ? { current: current + 1, max }
          : { current: 0, max: Math.max(current, max) },
      { current: 0, max: 0 }
    ).max;

    return r + (rowMax > 2 ? rowMax : 0);
  }, 0);

for (let i = 1; i < n * m; i++) {
  const map = [...Array(m)].map(() => Array(n).fill('.'));

  for (const robot of input) {
    robot[0][0] = (robot[0][0] + robot[1][0] + n) % n;
    robot[0][1] = (robot[0][1] + robot[1][1] + m) % m;

    map[robot[0][1]][robot[0][0]] = 'X';
  }

  const clusters = horizontalClusters(map);
  if (clusters > 250) {
    b = i;
    break;
  }
}

[a, b];
