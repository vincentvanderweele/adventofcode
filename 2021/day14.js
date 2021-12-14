parts = document.querySelector('pre').firstChild.textContent.split('\n\n');
template = parts[0];
// Already convert the rules to pair-rewrite rules, so AB -> C becomes AB -> [AC, BC].
rules = parts[1]
  .split('\n')
  .filter((x) => x)
  .reduce((r, x) => {
    [from, to] = x.split(' -> ');
    r[from] = [`${from[0]}${to}`, `${to}${from[1]}`];
    return r;
  }, {});

countFrequencies = (c, [x, n]) => ({ ...c, [x]: (c[x] ?? 0) + n });

solve = (steps) => {
  pairCounts = [...Array(steps)].reduce(
    (previousPairCounts) =>
      Object.entries(previousPairCounts)
        .flatMap(([p, n]) => rules[p].map((newPair) => [newPair, n]))
        .reduce(countFrequencies, {}),
    [...Array(template.length - 1)]
      .map((_, i) => [template.substring(i, i + 2), 1])
      .reduce(countFrequencies, {})
  );

  letterCounts = Object.values(
    Object.entries(pairCounts)
      .flatMap(([p, n]) => p.split('').map((x) => [x, n / 2]))
      .reduce(countFrequencies, {})
  ).map((c) => Math.ceil(c)); // correct for first and last letter

  return Math.max(...letterCounts) - Math.min(...letterCounts);
};

// problem 1
solve(10);

// problem 2
solve(40);
