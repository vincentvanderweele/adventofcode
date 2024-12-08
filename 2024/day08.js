map = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

isInMap = ({ i, j }) => i >= 0 && i < map.length && j >= 0 && j < map[0].length;

antennas = map
  .flatMap((x, i) => x.map((a, j) => ({ a, i, j })))
  .filter(x => x.a !== '.')
  .reduce((r, x) => {
    (r[x.a] ??= []).push(x);
    return r;
  }, {});

solve = getAntiNodes =>
  new Set(
    Object.entries(antennas)
      .flatMap(([, as]) =>
        as.flatMap((ai, i) =>
          as.flatMap((aj, j) => (i === j ? [] : getAntiNodes(ai, aj)))
        )
      )
      .filter(isInMap)
      .map(({ i, j }) => `${i},${j}`)
  ).size;

// Problem 1
a = solve(({ i: i0, j: j0 }, { i: i1, j: j1 }) => [
  { i: i0 + (i0 - i1), j: j0 + (j0 - j1) },
]);

// Problem 2
b = solve(({ i: i0, j: j0 }, { i: i1, j: j1 }) => {
  const results = [];

  let current = { i: i0, j: j0 };
  while (isInMap(current)) {
    results.push(current);

    current = { i: current.i + (i0 - i1), j: current.j + (j0 - j1) };
  }

  return results;
});

[a, b];
