input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(',').map(x => parseInt(x, 10)));

neighbors = input
  .flatMap((x, i) =>
    input.slice(i + 1).map((y, j) => ({
      s: i,
      e: j + i + 1,
      d: x.map((x, i) => y[i] - x).reduce((s, x) => s + x * x, 0),
    }))
  )
  .sort((a, b) => a.d - b.d);

sets = input.map((_, i) => new Set([i]));

ni = 0;

while (true) {
  last = neighbors[ni++];

  if (sets[last.s] !== sets[last.e]) {
    s = sets[last.s].union(sets[last.e]);
    if (s.size === input.length) break;
    for (x of s) sets[x] = s;
  }

  if (ni === 1000) {
    sorted = [...sets].map(x => x.size).sort((a, b) => b - a);
    a = sorted[0] * sorted[sorted[0]] * sorted[sorted[0] + sorted[sorted[0]]];
  }
}

b = input[last.s][0] * input[last.e][0];

[a, b];
