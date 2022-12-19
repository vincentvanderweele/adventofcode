data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(',').map(x => parseInt(x)));

n = 22;

// Create 22x22x22 grid (inputs are in range [0, 19], add 2 more as sentinels)
grid = [...Array(n)].map(() => [...Array(n)].map(() => [...Array(n)]));
inGrid = v => v.every(x => x >= 0 && x < grid.length);
neighbors = ([x, y, z]) =>
  [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ]
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .filter(inGrid);

// Put input data in grid
for (let [x, y, z] of data) grid[x + 1][y + 1][z + 1] = 'l';

// Set the bounding box
queue = [];
for (i = 0; i < n; i++) {
  for (j = 0; j < n; j++) {
    boundingBox = [
      [0, i, j],
      [n - 1, i, j],
      [i, 0, j],
      [i, n - 1, j],
      [i, j, 0],
      [i, j, n - 1],
    ];

    for (let [x, y, z] of boundingBox) {
      grid[x][y][z] = 'a';
      queue.push([x, y, z]);
    }
  }
}

// Flood fill
while ((v = queue.shift())) {
  for (let [x, y, z] of neighbors(v)) {
    if (!grid[x][y][z]) {
      grid[x][y][z] = 'a';
      queue.push([x, y, z]);
    }
  }
}

solve = predicate =>
  grid
    .flatMap((yzs, x) =>
      yzs.flatMap((zs, y) =>
        zs.flatMap(
          (v, z) =>
            (v === 'l' &&
              neighbors([x, y, z]).filter(([x, y, z]) =>
                predicate(grid[x][y][z])
              ).length) ||
            0
        )
      )
    )
    .reduce((s, x) => s + x);

// problem 1
solve(x => x !== 'l');

// problem 2
solve(x => x === 'a');
