data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .map(([c, v]) => ({ c: c.split(''), v: parseInt(v, 10) }));

histogram = c =>
  c.length
    ? Object.values(
        c.reduce((r, c) => ({ ...r, [c]: (r[c] ?? 0) + 1 }), {})
      ).sort((a, b) => b - a)
    : [0];

scores = { T: 10, J: 11, Q: 12, K: 13, A: 14 };
score = (scores, { c }, i) => scores[c[i]] ?? c[i];

solve = (hands, scores) =>
  hands
    .sort((a, b) => {
      for (i = 0; i < a.h.length; i++) {
        if (a.h[i] > b.h[i]) return 1;
        if (a.h[i] < b.h[i]) return -1;
      }
      for (i = 0; i < a.c.length; i++) {
        if (score(scores, a, i) > score(scores, b, i)) return 1;
        if (score(scores, a, i) < score(scores, b, i)) return -1;
      }
      return 0;
    })
    .map(({ v }, i) => v * (i + 1))
    .reduce((s, x) => s + x);

// problem 1
a = solve(
  data.map(({ c, v }) => ({ c, v, h: histogram(c) })),
  scores
);

// problem 2
b = solve(
  data.map(({ c, v }) => ({
    c,
    v,
    h: histogram(c.filter(x => x !== 'J')).map((x, i) =>
      i ? x : x + c.filter(x => x === 'J').length
    ),
  })),
  { ...scores, J: 1 }
);

[a, b];
