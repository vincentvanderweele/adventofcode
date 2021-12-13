parts = document.querySelector('pre').firstChild.textContent.split('\n\n');
dots = new Set(parts[0].split('\n'));
folds = parts[1]
  .split('\n')
  .filter((x) => x)
  .map((x) => [...'xy'].map((c) => (c === x[11] ? x.slice(13) : 0)));

fold = (s, f) =>
  new Set(
    [...s].map((x) =>
      x
        .split(',')
        .map((c, i) => (f[i] === 0 || parseInt(c) < f[i] ? c : 2 * f[i] - c))
        .join(',')
    )
  );

// problem 1
fold(dots, folds[0]).size;

// problem 2
grid = [...Array(6)].map((_) => [...Array(39)].map((_) => ' '));
[...folds.reduce(fold, dots)]
  .map((s) => s.split(',').map((z) => parseInt(z)))
  .forEach(([x, y]) => (grid[y][x] = '#'));
`\n${grid.map((r) => r.join('')).join('\n')}\n`;
