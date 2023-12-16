data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

right = 1;
down = 2;
left = 4;
up = 8;

move = {
  [right]: [1, 0],
  [down]: [0, 1],
  [left]: [-1, 0],
  [up]: [0, -1],
};

nextMoves = {
  [right]: {
    '.': [right],
    '-': [right],
    '|': [down, up],
    '\\': [down],
    '/': [up],
  },
  [down]: {
    '.': [down],
    '-': [right, left],
    '|': [down],
    '\\': [right],
    '/': [left],
  },
  [left]: {
    '.': [left],
    '-': [left],
    '|': [down, up],
    '\\': [up],
    '/': [down],
  },
  [up]: {
    '.': [up],
    '-': [right, left],
    '|': [up],
    '\\': [left],
    '/': [right],
  },
};

next = (x, y, d, c) =>
  nextMoves[d][c].map(m => {
    let [dx, dy] = move[m];
    return { x: x + dx, y: y + dy, d: m };
  });

solve = initial => {
  stack = [initial];

  light = data.map(row => row.map(() => 0));

  while (stack.length) {
    let { x, y, d } = stack.pop();

    // out of bounds
    if (x < 0 || x >= light[0].length || y < 0 || y >= light.length) continue;

    // break loops
    if (light[y][x] & d) continue;

    light[y][x] |= d;

    stack.push(...next(x, y, d, data[y][x]));
  }

  return light.map(x => x.filter(x => x).length).reduce((s, x) => s + x);
};

// problem 1
a = solve({x: 0, y: 0, d: right });

// problem 2
b = Math.max(
  ...[
    ...[...Array(data.length)].map((_, i) => ({ x: 0, y: i, d: right })),
    ...[...Array(data[0].length)].map((_, i) => ({ x: i, y: 0, d: down })),
    ...[...Array(data.length)].map((_, i) => ({
      x: 0,
      y: data.length - i - 1,
      d: left,
    })),
    ...[...Array(data[0].length)].map((_, i) => ({
      x: data[0].length - i - 1,
      y: 0,
      d: up,
    })),
  ].map(solve)
);

[a, b];