map = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => parseInt(x, 10)));

isInMap = ([i, j]) => i >= 0 && j >= 0 && i < map.length && j < map[0].length;
neighbors = ([i, j]) =>
  [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
    .map(([di, dj]) => [i + di, j + dj])
    .filter(isInMap);
unique = xs => {
  const result = [];
  const seen = new Set();
  for (let [i, j] of xs) {
    const key = `${i},${j}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push([i, j]);
  }
  return result;
};

solve = countUnique => {
  result = 0;
  for (i = 0; i < map.length; i++) {
    for (j = 0; j < map[0].length; j++) {
      if (map[i][j] !== 0) continue;

      let current = [[i, j]];

      for (k = 1; k <= 9; k++) {
        current = current.flatMap(x =>
          neighbors(x).filter(([i, j]) => map[i][j] === k)
        );
      }

      result += (countUnique ? unique(current) : current).length;
    }
  }
  return result;
};

// Problem 1
a = solve(true);

// Problem 2
b = solve(false);

[a, b];
