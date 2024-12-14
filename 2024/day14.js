robots = document
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
a = robots
  .map(([[px, py], [vx, vy]]) => [
    (px + 100 * (vx + n)) % n,
    (py + 100 * (vy + m)) % m,
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
max = 0;

for (let i = 1; i < n * m; i++) {
  const s = new Set();
  let count = 0;

  for (const [[px, py], [vx, vy]] of robots) {
    const x = (px + i * (vx + n)) % n;
    const y = (py + i * (vy + m)) % m;

    if (s.has(`${n - 1 - x},${y}`)) count++;
    s.add(`${x},${y}`);
  }

  if (count > max) {
    b = i;
    max = count;
  }
}

[a, b];
