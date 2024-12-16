map = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => (x === '#' ? Infinity : -1)));

heap = comp => {
  const queue = [];

  const compare = (i, j) => comp(queue[i], queue[j]);
  const swap = (i, j) => ([queue[i], queue[j]] = [queue[j], queue[i]]);

  const moveUp = () => {
    i = queue.length - 1;
    while (i > 0 && compare(i, (parent = (i - 1) >> 1)) < 0) {
      swap(i, parent);
      i = parent;
    }
  };

  const moveDown = () => {
    i = 0;
    while ((child = 2 * i + 1) < queue.length) {
      if (child + 1 < queue.length && compare(child, child + 1) > 0) child++;

      if (compare(i, child) <= 0) break;

      swap(i, child);
      i = child;
    }
  };

  return {
    add: x => {
      queue.push(x);
      moveUp();
    },
    min: () => {
      [result, queue[0]] = [queue[0], queue.pop()];
      moveDown();
      return result;
    },
  };
};

maps = [...Array(4)].map(() => [...map.map(x => [...x])]);
end = [1, map[0].length - 2];

queue = heap((a, b) => a[3] - b[3]);
queue.add([map.length - 2, 1, 0, 0, 1]);

step = (i, j, r, f) =>
  [
    [i, j + f],
    [i + f, j],
    [i, j - f],
    [i - f, j],
  ][r];
neighbors = ([i, j, r, s, f]) => [
  [i, j, (r + 1) % 4, s + 1000 * f, f],
  [i, j, (r + 3) % 4, s + 1000 * f, f],
  [...step(i, j, r, f), r, s + f, f],
];

// Problem 1
a = 0;
while (!a) {
  do {
    [i, j, r, s, f] = queue.min();
  } while (maps[r][i][j] >= 0);

  maps[r][i][j] = s;

  if (i === end[0] && j === end[1]) a = s;

  const ns = neighbors([i, j, r, s, f]).filter(
    ([i, j, r]) => maps[r][i][j] < 0
  );

  for (const n of ns) queue.add(n);
}

// Problem 2
bestPath = new Set();
current = [...Array(4)].map((_, r) => [...end, r, a, -1]);

while (current.length) {
  for (const c of current.map(([i, j]) => `${i},${j}`)) bestPath.add(c);
  current = current
    .flatMap(neighbors)
    .filter(([i, j, r, s]) => maps[r][i][j] === s);
}

b = bestPath.size;

[a, b];
