drops = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter(x => x)
  .map(x => x.split(' @ ').map(x => x.split(', ').map(x => parseInt(x, 10))));

testMin = 200000000000000;
testMax = 400000000000000;

at = ([[x, y, z], [vx, vy, vz]], t) => ({
  x: x + t * vx,
  y: y + t * vy,
  z: z + t * vz,
});

// problem 1
a = drops.flatMap(([[x0, y0], [vx0, vy0]], i) =>
  drops.filter(([[x1, y1], [vx1, vy1]], j) => {
    if (j <= i) return false;

    const t0 = (vy1 * (x0 - x1) - vx1 * (y0 - y1)) / (vx1 * vy0 - vx0 * vy1);
    if (!(t0 > 0)) return false;

    const t1 = (x0 - x1 + t0 * vx0) / vx1;
    if (!(t1 > 0)) return false;

    const { x, y } = at(drops[i], t0);

    return testMin <= x && x <= testMax && testMin <= y && y <= testMax;
  })
).length;

gcd = (a, b) => {
  if (a === 0) return b;
  if (a > b) return gcd(b, a);
  return gcd(b % a, a);
};
lcm = (a, b) => (a * b) / gcd(a, b);

by = i =>
  drops.reduce((r, d) => ({ ...r, [d[1][i]]: [...(r[d[1][i]] ?? []), d] }), {});

// Get speeds in all dimentions by using the fact that parallel lines
// are most restrictive: the relative speed must divide the distance
// between each pair of parallel lines
speeds = [0, 1, 2]
  .map(i =>
    Object.entries(by(i)) // group by speed
      .filter(([v, drops]) => drops.length > 2) // find sets of parallel lines
      .map(([v, drops]) => [
        drops
          .map(([ps]) => ps[i]) // project to 1 dimension
          .sort((a, b) => a - b)
          .map((p, _, arr) => p - arr[0]) // get difference between parallel lines
          .reduce((a, b) => gcd(a, b)), // find smallest speed intersecting all
        parseInt(v, 10),
      ])
  )
  .map(
    // get the speed that occurs most often in the list
    x =>
      Object.entries(
        x
          .map(([a, b]) => a + b)
          .reduce((r, x) => ({ ...r, [x]: (r[x] ?? 0) + 1 }), {})
      ).sort((a, b) => b[1] - a[1])[0]
  )
  .map(x => parseInt(x[0]));

// split drops by upward and downward trajectories
positive = [0, 1, 2].map(i =>
  drops
    .map(([p, v]) => [p[i], v[i] - speeds[i]])
    .filter(([p, v]) => v > 0)
    .sort((a, b) => b[0] - a[0])
);
negative = [0, 1, 2].map(i =>
  drops
    .map(([p, v]) => [p[i], v[i] - speeds[i]])
    .filter(([p, v]) => v < 0)
    .sort((a, b) => a[0] - b[0])
);

merge = ([x0, v0], [x1, v1]) => {
  for (let i = 0; i < Math.abs(v1); i++)
    if ((x0 + i * v0 - x1) % v1 === 0) return [x0 + i * v0, lcm(v0, v1)];
};

// find the number that matches all positive and negative equations
b = positive
  .map(x => x.reduce(merge))
  .map(([start, step], i) => {
    if (step > negative[i][0][0]) return start;

    for (let j = 0; j < (negative[i][0][0] - start) / step; j++) {
      const result = start + j * step;
      if (negative[i].every(([x, v]) => (x - result) % v === 0)) return result;
    }
  })
  .reduce((s, x) => s + x);

[a, b];
