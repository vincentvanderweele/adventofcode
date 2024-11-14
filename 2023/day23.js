maze = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

isInMaze = ([x, y]) =>
  x >= 0 && x < maze[0].length && y >= 0 && y < maze.length;

neighbors = ([x, y]) =>
  [
    [0, 1, 'v'],
    [0, -1, '^'],
    [1, 0, '>'],
    [-1, 0, '<'],
  ]
    .map(([dx, dy, c]) => [x + dx, y + dy, c])
    .filter(isInMaze);

vertices = [
  [1, 0],
  ...maze
    .flatMap((row, y) => row.map((c, x) => [x, y, c]))
    .filter(([x, y, c]) => c !== '#')
    .map(([x, y]) =>
      neighbors([x, y]).filter(([x, y]) => maze[y][x] !== '#').length > 2
        ? [x, y]
        : null
    )
    .filter(x => x),
  [maze[0].length - 2, maze.length - 1],
];

tracePath = (start, first) => {
  let length = 0;

  let previous = start;
  let current = first;

  do {
    length++;

    const nexts = neighbors(current)
      .filter(([x, y]) => maze[y][x] !== '#')
      .filter(([x, y]) => previous[0] !== x || previous[1] !== y);

    if (nexts.length !== 1) break;

    previous = current;
    current = nexts[0];
  } while (true);

  return [start, current, length];
};

edges = vertices
  .slice(0, vertices.length - 1)
  .flatMap(([x, y]) =>
    neighbors([x, y])
      .filter(([x, y, c]) => maze[y][x] === '.' || maze[y][x] === c)
      .map(first => tracePath([x, y], first))
  )
  .map(([start, end, length]) => [
    vertices.findIndex(v => v[0] === start[0] && v[1] === start[1]),
    vertices.findIndex(v => v[0] === end[0] && v[1] === end[1]),
    length,
  ]);

graph = edges.reduce(
  (r, [start, end, length]) => ({
    ...r,
    [start]: [...(r[start] ?? []), { end, length }],
  }),
  {}
);

longestPath = (graph, current, visited = new Set(), path = 0) => {
  if (current === vertices.length - 1) {
    return path;
  }

  return Math.max(
    ...graph[current].map(({ end, length }) => {
      if (visited.has(end)) return 0;
      return longestPath(graph, end, new Set([...visited, end]), path + length);
    })
  );
};

// problem 1
a = longestPath(graph, 0);

// totally trial-and-errored how many short edges can be ignored
ignore = 5;
sortedEdges = edges.sort((a, b) => a[2] - b[2]);
shortEdges = sortedEdges.slice(0, ignore);
longEdges = sortedEdges.slice(ignore);
edges2 = [
  ...longEdges,
  ...shortEdges.filter(
    ([start, end]) => start === 0 || end === 0 || start === vertices.length - 1 || end === vertices.length - 1
  ),
];

graph2 = edges2.reduce(
  (r, [start, end, length]) => ({
    ...r,
    [start]: [...(r[start] ?? []), { end, length }],
    [end]: [...(r[end] ?? []), { end: start, length }],
  }),
  {}
);

// problem 2
b = longestPath(graph2, 0);

[a, b]
