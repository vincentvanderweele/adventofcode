data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => (x === '#' ? NaN : -1)));
n0 = data.length;

// Used for problem 1 and to check the answer for 
// solveFast for low values of N
solveSlow = (data, N, steps = N * n0 + Math.floor(n0 / 2)) => {
  const repeat2d = (a, n) =>
    [...Array(n)].flatMap(() =>
      a.map(x => [...Array(n)].flatMap(() => [...x]))
    );

  data = repeat2d(data, 2 * (N + 1) - 1);
  const n = data.length;

  const neighbors = ([x, y]) =>
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([x, y]) => x >= 0 && x < n && y >= 0 && y < n);

  const middle = N * n0 + Math.floor(n0 / 2);
  let current = [[middle, middle]];
  data[middle][middle] = 0;

  for (i = 0; i < steps; i++) {
    const next = [];
    for (c of current) {
      for (let [x, y] of neighbors(c)) {
        if (data[y][x] < 0) {
          data[y][x] = i + 1;
          next.push([x, y]);
        }
      }
    }
    current = next;
  }

  let result = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (data[i][j] % 2 === steps % 2) {
        result++;
      }
    }
  }
  return result;
};

// Numbers are derived from extrapolating the results
// from solveSlow.
solveFast = N => {
  const corners = 5544 + 5553 + 5540 + 5549;
  const diagonalSmall = 937 + 930 + 949 + 954;
  const diagonalLarge = 6453 + 6454 + 6463 + 6449;
  const blockSmall = 7410;
  const blockLarge = 7363 + 7410;

  return (
    corners +
    N * diagonalSmall +
    (N - 1) * diagonalLarge +
    (2 * N - 1) * blockSmall +
    (N - 1) * (N - 1) * blockLarge
  );
};

// problem 1
a = solveSlow(data, 0, 64);

// problem 2
b = solveFast(202300);

[a, b];