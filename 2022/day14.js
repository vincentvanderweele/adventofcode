data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' -> ').map(x => x.split(',').map(x => parseInt(x))));

parseCave = () => {
  maxRow = Math.max(...data.flat().map(([, x]) => x));

  cave = [...Array(maxRow + 3)].map(() => [...Array(1000)]);

  for (line of data) {
    for (i = 0; i < line.length - 1; i++) {
      s = line[i];
      e = line[i + 1];
      len = Math.abs(s[0] + s[1] - (e[0] + e[1]));
      for (j = 0; j <= len; j++) {
        x = s.map((sk, k) => sk + (j * (e[k] - sk)) / len);
        cave[x[1]][x[0]] = '#';
      }
    }
  }

  return cave;
};

dropSand = (cave) => {
  i = 0;
  j = 500;
  if (cave[i][j]) return false;

  while (i < cave.length) {
    if (cave[i + 1]?.slice(j - 1, j + 2).every(x => x)) {
      cave[i][j] = 'o';
      return true;
    }

    i++;
    j += [0, -1, 1].find(dj => !cave[i]?.[j + dj]);
  }
  return false;
};

countSand = (cave) => {
  count = 0;
  while (dropSand(cave)) count++;
  return count;
};

// problem 1
countSand(parseCave());

// problem 2
cave = parseCave();
cave[cave.length - 1] = [...Array(1000)].map(() => '#');
countSand(cave);
