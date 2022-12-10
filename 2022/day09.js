moves = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .flatMap(([d, c]) =>
    [...Array(parseInt(c))].map(
      _ =>
        ({
          L: [-1, 0],
          R: [1, 0],
          D: [0, -1],
          U: [0, 1],
        }[d])
    )
  );

moveTail = (h, t) => {
  if (t.every((ti, i) => Math.abs(h[i] - ti) <= 1)) return t;
  return t.map((ti, i) => ti + Math.sign(h[i] - ti));
};

visited = moves.reduce(
  (ropes, move) => {
    ropes[0].unshift(ropes[0][0].map((ri, i) => ri + move[i]));

    for (let i = 1; i < ropes.length; i++) {
      ropes[i].unshift(moveTail(ropes[i - 1][0], ropes[i][0]));
    }

    return ropes;
  },
  [...Array(10)].map(_ => [[0, 0]])
);

countVisited = n => new Set(visited[n].map(([x, y]) => `${x},${y}`)).size;

// problem 1
countVisited(1);

// problem 2
countVisited(9);
