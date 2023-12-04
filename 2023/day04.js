data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x =>
    x
      .split(':')[1]
      .split('|')
      .map(x => x.match(/\d+/g))
  );

wins = data.map(([w, h]) => {
  s = new Set(w);
  return h.filter(x => s.has(x)).length;
});

// problem 1
a = wins
  .filter(x => x)
  .map(x => Math.pow(2, x - 1))
  .reduce((s, x) => s + x);

// problem 2
b = wins
  .reduce(
    (counts, wins, i) => [
      ...counts.slice(0, i + 1),
      ...counts.slice(i + 1, i + wins + 1).map(x => x + counts[i]),
      ...counts.slice(i + wins + 1),
    ],
    [...Array(wins.length)].map(() => 1)
  )
  .reduce((s, x) => s + x);

[a, b];
