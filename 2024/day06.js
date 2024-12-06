map = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(''));

isInMap = ([r, c]) => r >= 0 && c >= 0 && r < map.length && c < map[0].length;
get = ([r, c]) => (isInMap([r, c]) ? map[r][c] : undefined);

guard = map
  .map((r, i) => (r.includes('^') ? [i, r.indexOf('^')] : undefined))
  .find(x => x);

dirs = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
d = 0;

isInPath = new Set();

while (isInMap(guard)) {
  isInPath.add(JSON.stringify(guard));

  dir = dirs[d];

  next = [guard[0] + dir[0], guard[1] + dir[1]];
  if (get(next) === '#') {
    d = (d + 1) % dirs.length;
  } else {
    guard = next;
  }
}
a = isInPath.length;

// problem 2
b = map
  .flatMap((row, i) =>
    row.map((_, j) => {
      if (map[i][j] !== '.') return false;
      if (!isInPath.has(JSON.stringify([i, j]))) return false;

      map[i][j] = '#';

      guard = map
        .map((r, i) => (r.includes('^') ? [i, r.indexOf('^')] : undefined))
        .find(x => x);
      d = 0;

      visited = new Set();
      loop = false;

      while (isInMap(guard)) {
        visited.add(JSON.stringify([d, ...guard]));

        dir = dirs[d];

        next = [guard[0] + dir[0], guard[1] + dir[1]];
        if (get(next) === '#') {
          d = (d + 1) % dirs.length;
        } else {
          guard = next;

          if (visited.has(JSON.stringify([d, ...next]))) {
            loop = true;
            break;
          }
        }
      }

      map[i][j] = '.';
      return loop;
    })
  )
  .filter(x => x).length;

[a, b];
