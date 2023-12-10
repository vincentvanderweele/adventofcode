data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

// add sentinels
map = [
  [...Array(data[0].length + 2)].map(() => '.'),
  ...data.map(x => ['.', ...x, '.']),
  [...Array(data[0].length + 2)].map(() => '.'),
];

directions = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
};
opposite = dir =>
  Object.keys(directions)[(Object.keys(directions).indexOf(dir) + 2) % 4];

pipes = {
  '|': 'ns',
  '-': 'ew',
  L: 'ne',
  J: 'nw',
  7: 'sw',
  F: 'se',
};

sy = map.findIndex(x => x.includes('S'));
s = [map[sy].indexOf('S'), sy];

paths = Object.keys(directions).map(dir => {
  path = [s];
  while (dir) {
    next = path[path.length - 1].map((x, i) => x + directions[dir][i]);
    path.push(next);

    // Find the character at the current position
    dirs = pipes[map[next[1]][next[0]]] ?? [];
    // Try to continue the curve and find the outgoing direction
    // dir is undefined if the curve is broken or we reached S again
    dir = dirs[1 - dirs.indexOf(opposite(dir))];
  }
  if (map[next[1]][next[0]] === 'S') return path;
});

// problem 1
a = (paths.filter(x => x)[0].length - 1) / 2;

// problem 2

// replace S by the character it represents
map[s[1]][s[0]] = Object.entries(pipes).find(
  ([c, dirs]) =>
    dirs ===
    Object.keys(directions)
      .filter((d, i) => paths[i])
      .join('')
)[0];

inPath = paths
  .filter(x => x)[0]
  .reduce((r, [x, y]) => {
    r[`${x},${y}`] = true;
    return r;
  }, {});

// Observation: a cell is inside the curve if any line from that
// cell outwards crosses the curve an odd number of times.
// Use horizontal lines and count the number of crosses.
edges = {
  '|': 1,
  F: 0.5,
  7: -0.5,
  J: 0.5,
  L: -0.5,
  '-': 0,
};

b = map
  .map((row, y) => {
    crosses = 0;
    count = 0;
    for (x = 0; x < row.length; x++) {
      if (inPath[`${x},${y}`]) crosses += edges[map[y][x]];
      else if (Math.abs(crosses % 2) === 1) count++;
    }
    return count;
  })
  .reduce((s, x) => s + x);

[a, b];
