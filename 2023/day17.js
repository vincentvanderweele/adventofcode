data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => parseInt(x, 10)));

n = data.length;

directions = [
  { d: '>', dx: -1, dy: 0 },
  { d: '<', dx: 1, dy: 0 },
  { d: '^', dx: 0, dy: 1 },
  { d: 'v', dx: 0, dy: -1 },
];

opposite = {
  '>': '<',
  '<': '>',
  '^': 'v',
  v: '^',
};

heap = compare => {
  const queue = [];

  const parent = i => Math.floor((i - 1) / 2);
  const child = i => 2 * i + 1;

  const moveUp = () => {
    i = queue.length - 1;
    while (i > 0 && compare(queue[i], queue[parent(i)]) < 0) {
      x = queue[i];
      queue[i] = queue[parent(i)];
      queue[parent(i)] = x;
      i = parent(i);
    }
  };

  const moveDown = () => {
    i = 0;
    while (child(i) < queue.length) {
      if (
        child(i) === queue.length - 1 ||
        compare(queue[child(i)], queue[child(i) + 1]) <= 0
      ) {
        c = child(i);
      } else {
        c = child(i) + 1;
      }

      if (compare(queue[i], queue[c]) <= 0) break;

      x = queue[i];
      queue[i] = queue[c];
      queue[c] = x;
      i = c;
    }
  };

  return {
    add: x => {
      queue.push(x);
      moveUp();
    },
    min: () => {
      result = queue[0];
      queue[0] = queue.pop();
      moveDown();
      return result;
    },
  };
};

solve = getNeighbors => {
  const seen = {};

  const queue = heap((a, b) => a.v - b.v);
  queue.add({ x: n - 2, y: n - 1, d: '>', c: 1, v: data[n - 1][n - 1] });
  queue.add({ x: n - 1, y: n - 2, d: 'v', c: 1, v: data[n - 1][n - 1] });

  while (true) {
    const current = queue.min();
    let { x, y, d, c, v } = current;

    const key = `${x};${y};${d};${c}`;
    if (seen[key]) continue;

    seen[key] = v;

    if (x === 0 && y === 0) return v;

    for (let neighbor of getNeighbors(current)) {
      queue.add(neighbor);
    }
  }
};

// problem 1
a = solve(({ x, y, d, c, v }) =>
  directions
    .filter(({ d: nd }) => nd !== opposite[d] && (nd !== d || c < 3))
    .map(({ d: nd, dx, dy }) => ({
      x: x + dx,
      y: y + dy,
      d: nd,
      c: d === nd ? c + 1 : 1,
      v: data[y][x] + v,
    }))
    .filter(({ x, y }) => x >= 0 && x < n && y >= 0 && y < n)
);

// problem 2
b = solve(({ x, y, d, c, v }) =>
  directions
    .filter(({ d: nd }) => nd !== opposite[d] && (nd !== d || c < 10))
    .map(({ d: nd, dx, dy }) => {
      if (nd === d)
        return { x: x + dx, y: y + dy, d: nd, c: c + 1, v: data[y][x] + v };

      nv = v;
      for (i = 0; i < 4; i++) {
        nv += data[y + i * dy]?.[x + i * dx];
      }
      return { x: x + 4 * dx, y: y + 4 * dy, d: nd, c: 4, v: nv };
    })
    .filter(({ x, y }) => x >= 0 && x < n && y >= 0 && y < n)
);

[a, b];
