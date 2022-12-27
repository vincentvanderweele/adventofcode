data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .slice(1, -1)
  .map(x => x.slice(1, -1).split(''));

nx = data[0].length;
ny = data.length;

start = '0,-1';
end = `${nx - 1},${ny}`;

initialStorms = data
  .flatMap((r, y) => r.map((c, x) => ({ c, x, y })))
  .filter(({ c }) => c !== '.')
  .map(({ c, x, y }) => ({
    p: [x, y],
    d: { '>': [1, 0], '<': [-1, 0], v: [0, 1], '^': [0, -1] }[c],
  }));

toMap = storms => {
  const map = storms.reduce((r, { p: [x, y] }) => {
    r[`${x},${y}`] = (r[`${x},${y}`] ?? 0) + 1;
    return r;
  }, {});

  const value = ([x, y]) => map[`${x},${y}`];

  const moves = p =>
    [
      [0, 1],
      [1, 0],
      [0, 0],
      [-1, 0],
      [0, -1],
    ]
      .map(d =>
        p
          .split(',')
          .map(x => parseInt(x))
          .map((x, i) => x + d[i])
      )
      .filter(
        ([x, y]) =>
          (x >= 0 && x < nx && y >= 0 && y < ny) ||
          (x === 0 && y === -1) ||
          (x === nx - 1 && y === ny)
      )
      .filter(p => !value(p))
      .map(([x, y]) => `${x},${y}`);

  return { value, moves };
};

updateStorms = storms =>
  storms.map(({ p: [x, y], d: [dx, dy] }) => ({
    p: [(x + dx + nx) % nx, (y + dy + ny) % ny],
    d: [dx, dy],
  }));

solve = (path, storms) =>
  path
    .slice(1)
    .map((x, i) => [path[i], x])
    .reduce(
      ({ storms, round }, [start, end]) => {
        positions = new Set([start]);

        while (!positions.has(end)) {
          storms = updateStorms(storms);
          map = toMap(storms);

          positions = new Set([...positions].flatMap(p => map.moves(p)));

          round++;
        }

        return { storms, round };
      },
      { storms, round: 0 }
    ).round;

// problem 1
solve([start, end], initialStorms);

// problem 2
solve([start, end, start, end], initialStorms);
