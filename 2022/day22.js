[mapData, instructionsData] = document
  .querySelector('pre')
  .firstChild.data.split('\n\n');

sides = 6;
n = Math.sqrt(mapData.replaceAll(/\s/g, '').length / sides);

// Build a map of cube sides and store their
// top-left corner in the original map
map = mapData
  .split('\n')
  // cut in chunks of the right number of rows
  .reduce((r, x, i) => {
    if (i % n === 0) r.push([]);
    r[r.length - 1].push(x);
    return r;
  }, [])
  .flatMap((side, i) =>
    // cut in chunks of the right number of columns
    [...Array(side[0].length / n)].map((_, j) => ({
      top: n * i,
      left: n * j,
      side: side.map(x => x.slice(n * j, n * (j + 1))),
    }))
  )
  .filter(({ side }) => side[0][0] !== ' ');

instructions = instructionsData.match(/[LR]?\d+/g).map(x => {
  [, turn, steps] = x.match(/([LR]?)(\d+)/);
  return {
    turn: turn === 'L' ? -1 : turn === 'R' ? 1 : 0,
    steps: parseInt(steps),
  };
});

directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

// Move in the given direction and wrap
// around using a wrapping object when needed
move = (currentPosition, wrapping) => {
  let { s, x, y, d } = currentPosition;

  [dx, dy] = directions[d];
  x += dx;
  y += dy;

  // wrap around
  if (x < 0 || x >= n || y < 0 || y >= n) {
    // keep the x and y values in range
    x = (x + n) % n;
    y = (y + n) % n;

    // wrapping rules for a given cube side and direction
    w = wrapping[s][d];

    // move to the new cube side and rotate the moving direction
    s = w.to;
    d = (d + (w.rotate ?? 0)) % directions.length;

    // convert coordinate system to the target cube side
    switch (w.rotate) {
      case 0:
        break;
      case 1:
        [x, y] = [n - 1 - y, x];
        break;
      case 2:
        [x, y] = [n - 1 - x, n - 1 - y];
        break;
      case 3:
        [x, y] = [y, n - 1 - x];
        break;
    }
  }

  return map[s].side[y][x] === '.'
    ? // empty space => move
      { s, x, y, d }
    : // wall => don't move
      currentPosition;
};

solve = wrapping => {
  position = { s: 0, x: 0, y: 0, d: 0 };
  for ({ turn, steps } of instructions) {
    position.d = (position.d + turn + directions.length) % directions.length;

    for (i = 0; i < steps; i++) {
      position = move(position, wrapping);
    }
  }

  return (
    1000 * (map[position.s].top + position.y + 1) +
    4 * (map[position.s].left + position.x + 1) +
    position.d
  );
};

// problem 1
neighbors = [
  // horizontal
  [[0, 1], [2], [3, 4], [5]],
  // vertical
  [[0, 2, 4], [1], [3, 5]],
];

solve(
  Object.fromEntries(
    [...Array(sides)].map((_, from) => [
      from,
      Object.fromEntries(
        directions.map((_, direction) => {
          row = neighbors[direction % 2].find(n => n.includes(from));
          neighborIndex =
            (row.indexOf(from) + (direction < 2 ? 1 : -1) + row.length) %
            row.length;

          return [direction, { to: row[neighborIndex] }];
        })
      ),
    ])
  )
);

// problem 2

// Creating the wrapping table by hand is hard.
// Instead, specify the 3 bands of 4 sides around the cube
// and derive the wrapping table from there.
// [{ s: x, d: 0}, { s: y, d: 2 }, ...] means that
// side y is on the right of side x (d = 0) and that
// side y is upside-down wrt side x (d = 2).
bands = [
  [
    { s: 0, d: 0 },
    { s: 1, d: 0 },
    { s: 4, d: 2 },
    { s: 3, d: 2 },
  ],
  [
    { s: 0, d: 1 },
    { s: 2, d: 1 },
    { s: 4, d: 1 },
    { s: 5, d: 2 },
  ],
  [
    { s: 5, d: 3 },
    { s: 3, d: 3 },
    { s: 2, d: 0 },
    { s: 1, d: 3 },
  ],
];

solve(
  Object.fromEntries(
    [...Array(sides)].map((_, from) => [
      from,
      Object.fromEntries(
        directions.map((_, direction) => {
          band = bands.find(band =>
            band.find(({ s, d }) => s === from && d % 2 === direction % 2)
          );

          index = band.findIndex(({ s }) => s === from);
          neighborIndex =
            (index + (band[index].d === direction ? 1 : -1) + band.length) %
            band.length;

          neighbor = band[neighborIndex];
          neighborDirection =
            band[index].d === direction
              ? neighbor.d
              : (neighbor.d + 2) % directions.length;

          rotate =
            (neighborDirection - direction + directions.length) %
            directions.length;

          return [direction, { to: neighbor.s, rotate }];
        })
      ),
    ])
  )
);
