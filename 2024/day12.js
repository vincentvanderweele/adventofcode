map = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

neighbors = ([x, y]) =>
  [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
    .map(([di, dj]) => [x + di, y + dj])
    .filter(
      ([i, j]) =>
        i >= 0 &&
        i < map.length &&
        j >= 0 &&
        j < map[0].length &&
        map[i][j] === map[x][y]
    );

used = new Set();
findPlot = (i, j) => {
  const queue = [[i, j]];
  const plot = [];

  while (queue.length) {
    const current = queue.pop();
    const key = `${current[0]},${current[1]}`;
    if (used.has(key)) continue;

    plot.push(current);
    used.add(key);

    queue.push(...neighbors(current));
  }
  return plot;
};

plots = [];
for (i = 0; i < map.length; i++) {
  for (j = 0; j < map[0].length; j++) {
    plots.push(findPlot(i, j));
  }
}

circumference = plot => {
  let result = 0;

  for (const cell of plot) {
    result += 4 - neighbors(cell).length;
  }

  return result;
};

sides = plot => {
  const fenceGroups = {};

  for (const [i, j] of plot) {
    const fences = [
      [-1, 0, 'b'],
      [1, 0, 't'],
      [0, -1, 'r'],
      [0, 1, 'l'],
    ]
      .map(([di, dj, c]) => [i + di, j + dj, c])
      .filter(([x, y]) => map[x]?.[y] !== map[i][j]);

    for (const fence of fences) {
      const x = fence[2] === 'b' || fence[2] === 't' ? 0 : 1;

      ((fenceGroups[fence[2]] ??= {})[fence[x]] ??= []).push(fence[1 - x]);
    }
  }

  return Object.values(fenceGroups)
    .flatMap(x => Object.values(x))
    .map(x => x.sort((a, b) => a - b))
    .map(x => x.slice(1).reduce((r, y, i) => r + (y > x[i] + 1 ? 1 : 0), 1))
    .reduce((s, x) => s + x, 0);
};

// Problem 1
a = plots
  .map(plot => plot.length * circumference(plot))
  .reduce((s, x) => s + x);

// Problem 2
b = plots.map(plot => plot.length * sides(plot)).reduce((s, x) => s + x);

[a, b];
