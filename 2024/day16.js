map = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => (x === '#' ? Infinity : -1)));

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

maps = [...Array(4)].map(() => [...map.map(x => [...x])]);
end = [1, map[0].length - 2];

queue = heap((a, b) => a[3] - b[3]);
queue.add([map.length - 2, 1, 0, 0]);

// Problem 1
while (true) {
  do {
    [i, j, r, s] = queue.min();
  } while (maps[r][i][j] >= 0);

  maps[r][i][j] = s;

  if (i === end[0] && j === end[1]) {
    a = s;
    break;
  }

  const step = [
    [i, j + 1],
    [i + 1, j],
    [i, j - 1],
    [i - 1, j],
  ];

  const neighbors = [
    [i, j, (r + 1) % 4, s + 1000],
    [i, j, (r + 3) % 4, s + 1000],
    [...step[r], r, s + 1],
  ].filter(([i, j, r]) => maps[r][i][j] < 0);

  for (const n of neighbors) queue.add(n);
}

// Problem 2
step = ([i, j, r]) =>
  [
    [i, j - 1],
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
  ][r];
reverseNeighbors = ([i, j, r, s]) =>
  [
    [i, j, (r + 1) % 4, s - 1000],
    [i, j, (r + 3) % 4, s - 1000],
    [...step([i, j, r]), r, s - 1],
  ].filter(([i, j, r, s]) => maps[r][i][j] === s);

bestPath = new Set();
current = [...Array(4)].map((_, r) => [...end, r, a]);

while (current.length) {
  for (const c of current.map(([i, j]) => `${i},${j}`)) bestPath.add(c);
  current = current.flatMap(reverseNeighbors);
}

b = bestPath.size;

[a, b];
