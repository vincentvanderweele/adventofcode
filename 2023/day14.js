data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

size = data.length;

rocks = data
  .flatMap((x, row) =>
    x.split('').map((rock, column) => ({ rock, row, column }))
  )
  .filter(({ rock }) => rock !== '.');

rotate = rocks => {
  for (r of rocks) {
    row = r.row;
    r.row = r.column;
    r.column = size - row - 1;
  }
};

slide = rocks => {
  rocks.sort((a, b) => a.row - b.row);

  free = {};
  for (r of rocks) {
    if (r.rock === '#') {
      free[r.column] = r.row + 1;
    } else {
      r.row = free[r.column] ?? 0;
      free[r.column] = r.row + 1;
    }
  }

  return rocks;
};

load = rocks =>
  rocks
    .filter(r => r.rock === 'O')
    .map(r => size - r.row)
    .reduce((s, x) => s + x);

serialize = rocks => {
  rocks.sort((a, b) => (a.row === b.row ? a.column - b.column : a.row - b.row));
  return rocks.map(r => `${r.row},${r.column}`).join(';');
};

// problem 1
a = load(slide(rocks));

// problem 2
solve = (rocks, n) => {
  seen = {};

  for (round = 0; round < n; round++) {
    s = serialize(rocks);
    if (seen[s] !== undefined) {
      return { from: seen[s], to: round };
    }
    seen[s] = round;

    for (i = 0; i < 4; i++) {
      slide(rocks);
      rotate(rocks);
    }
  }
};

let { from, to } = solve(
  rocks.map(({ rock, row, column }) => ({ rock, row, column })),
  100000
);
solve(rocks, ((1000000000 - to) % (to - from)) + from);
b = load(rocks);

[a, b];
