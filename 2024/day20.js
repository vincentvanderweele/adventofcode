input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

map = input.map(x => x.split('').map(x => (x === '#' ? Infinity : -1)));
start = input.map((x, i) => [i, x.indexOf('S')]).find(([_, j]) => j >= 0);
end = input.map((x, i) => [i, x.indexOf('E')]).find(([_, j]) => j >= 0);

[i, j] = start;
d = 0;

while (map[end[0]][end[1]] < 0) {
  map[i][j] = d++;
  [i, j] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
    .map(([di, dj]) => [i + di, j + dj])
    .find(([i, j]) => map[i][j] < 0) ?? [-1, -1];
}

solve = n => {
  count = 0;

  for (let is = 0; is < map.length; is++) {
    for (let js = 0; js < map[0].length; js++) {
      s = map[is][js];
      if (!isFinite(s)) continue;

      for (let ie = is - n; ie <= is + n; ie++) {
        for (let je = js - n; je <= js + n; je++) {
          d = Math.abs(ie - is) + Math.abs(je - js);
          if (d > n) continue;

          e = map[ie]?.[je];
          if (!isFinite(e)) continue;

          if (e - s - d >= 100) count++;
        }
      }
    }
  }

  return count;
};

// Problem 1
a = solve(2);

// Problem 2
b = solve(20);

[a, b];
