codes = `805A
682A
671A
973A
319A`.split('\n');

num = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['', '0', 'A'],
];

dir = [
  ['', '^', 'A'],
  ['<', 'v', '>'],
];

mapIndex = pad =>
  pad
    .flatMap((row, i) => row.map((c, j) => [i, j, c]))
    .reduce((r, [i, j, c]) => ((r[c] = [i, j]), r), {});

keyPaths = (pad, from, to) => {
  const index = mapIndex(pad);

  const [fi, fj] = index[from];
  const [ti, tj] = index[to];
  const [gi, gj] = index[''];

  let parts = [];

  if (fi < ti)
    parts.push(
      Array(ti - fi)
        .fill('v')
        .join('')
    );
  if (fi > ti)
    parts.push(
      Array(fi - ti)
        .fill('^')
        .join('')
    );
  if (fj < tj)
    parts.push(
      Array(tj - fj)
        .fill('>')
        .join('')
    );
  if (fj > tj)
    parts.push(
      Array(fj - tj)
        .fill('<')
        .join('')
    );

  switch (parts.length) {
    case 0:
      return ['A'];
    case 1:
      return [`${parts[0]}A`];
    case 2: {
      let result = [`${parts[0]}${parts[1]}A`, `${parts[1]}${parts[0]}A`];
      // Avoid the gap
      if (fi === gi && tj === gj) return [result[0]];
      if (fj === gj && ti === gi) return [result[1]];
      return result;
    }
  }
};

codePaths = (pad, code) => {
  const chars = code.split('');
  const pairs = chars.map((x, i, a) => (i === 0 ? ['A', x] : [a[i - 1], x]));
  let result = [''];
  for (let [from, to] of pairs) {
    const ps = keyPaths(pad, from, to);
    result = result.flatMap(x => ps.map(y => `${x}${y}`));
  }
  return result;
};

shortestArrowCode = (code, n) => {
  return code
    .split('A')
    .map(x => `${x}A`)
    .slice(0, -1)
    .map(s => shortestArrowSegment(s, n))
    .reduce((s, x) => s + x);
};

cache = {};
shortestArrowSegment = (s, n) => {
  const key = `${s},${n}`;
  if (cache[key]) return cache[key];

  let result;
  if (n === 0) {
    result = s.length;
  } else {
    result = Math.min(
      ...codePaths(dir, s).map(c => shortestArrowCode(c, n - 1))
    );
  }
  cache[key] = result;
  return result;
};

solve = n =>
  codes
    .map(
      code =>
        parseInt(code) *
        Math.min(...codePaths(num, code).map(c => shortestArrowCode(c, n)))
    )
    .reduce((s, x) => s + x);

// Problem 1
a = solve(2);

// Problem 2
b = solve(25);

[a, b];
