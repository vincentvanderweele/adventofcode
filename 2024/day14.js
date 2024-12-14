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
symmetry = robots => {
  const s = new Set(robots.map(([[x, y]]) => `${x},${y}`));

  return robots.filter(([[x, y]]) => x < n / 2 && s.has(`${n - 1 - x},${y}`))
    .length;
};

max = 0;

for (let i = 1; i < n * m; i++) {
  for (const robot of robots) {
    const [[px, py], [vx, vy]] = robot;
    robot[0] = [(px + vx + n) % n, (py + vy + m) % m];
  }

  const s = symmetry(robots);
  if (s > max) {
    b = i;
    max = s;
  }
}

[a, b];
