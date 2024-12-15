[map, moves] = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x);
map = map
  .split('\n')
  .filter(x => x)
  .map(x => x.split(''));
moves = moves
  .split('\n')
  .filter(x => x)
  .flatMap(x => x.split(''));

[ri0, rj0] = map
  .flatMap((row, i) => row.map((c, j) => (c === '@' ? [i, j] : undefined)))
  .find(x => x);
map[ri0][rj0] = '.';

dirs = {
  '^': [-1, 0],
  v: [1, 0],
  '>': [0, 1],
  '<': [0, -1],
};

// Problem 1
[ri, rj] = [ri0, rj0];
m1 = [...map.map(x => [...x])];
for (const move of moves) {
  const [di, dj] = dirs[move];

  const [ni, nj] = [ri + di, rj + dj];

  if (m1[ni][nj] === '#') {
    continue;
  }
  if (m1[ni][nj] === '.') {
    [ri, rj] = [ni, nj];
    continue;
  }

  let [xi, xj] = [ni, nj];
  while (m1[xi][xj] === 'O') [xi, xj] = [xi + di, xj + dj];

  if (m1[xi][xj] === '.') {
    m1[xi][xj] = 'O';
    m1[ni][nj] = '.';
    [ri, rj] = [ni, nj];
  }
}
a = m1
  .flatMap((row, i) => row.map((c, j) => (c === 'O' ? 100 * i + j : 0)))
  .reduce((s, x) => s + x);

// Problem 2
m2 = map.map(row => row.flatMap(x => (x === 'O' ? ['[', ']'] : [x, x])));
[ri, rj] = [ri0, 2 * rj0];

checks = (move, [i, j]) => {
  switch (move) {
    case '<':
      return [[i, j - 1]];
    case '>':
      return [[i, j + 2]];
    case '^':
      return [
        [i - 1, j],
        [i - 1, j + 1],
      ];
    case 'v':
      return [
        [i + 1, j],
        [i + 1, j + 1],
      ];
  }
};

distinct = boxes => {
  const seen = new Set();
  return boxes.filter(([i, j]) => {
    const key = `${i},${j}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

for (const move of moves) {
  const [di, dj] = dirs[move];

  const [ni, nj] = [ri + di, rj + dj];

  if (m2[ni][nj] === '#') {
    continue;
  }
  if (m2[ni][nj] === '.') {
    [ri, rj] = [ni, nj];
    continue;
  }

  const box = m2[ni][nj] === '[' ? [ni, nj] : [ni, nj - 1];

  const boxes = [box];
  let toCheck = [box];

  let canMove = true;
  while (toCheck.length) {
    const checked = toCheck.flatMap(box => checks(move, box));

    if (checked.some(([i, j]) => m2[i][j] === '#')) {
      canMove = false;
      break;
    }

    toCheck = distinct(
      checked
        .map(([i, j]) =>
          m2[i][j] === '[' ? [i, j] : m2[i][j] === ']' ? [i, j - 1] : undefined
        )
        .filter(x => x)
    );

    boxes.push(...toCheck);
  }

  if (!canMove) continue;

  [ri, rj] = [ni, nj];

  for (const [bi, bj] of boxes.reverse()) {
    const [di, dj] = dirs[move];
    const [ni, nj] = [bi + di, bj + dj];

    if (move === '>') {
      m2[ni][nj + 1] = ']';
      m2[bi][bj + 1] = '.';
      m2[ni][nj] = '[';
      m2[bi][bj] = '.';
    } else {
      m2[ni][nj] = '[';
      m2[bi][bj] = '.';
      m2[ni][nj + 1] = ']';
      m2[bi][bj + 1] = '.';
    }
  }
}

b = m2
  .flatMap((row, i) => row.map((c, j) => (c === '[' ? 100 * i + j : 0)))
  .reduce((s, x) => s + x);

[a, b];
