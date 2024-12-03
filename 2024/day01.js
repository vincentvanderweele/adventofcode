lists = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('   ').map(x => parseInt(x, 10)))
  .reduce((x, y) => x.map((x, i) => [...x, y[i]]), [[], []])
  .map(x => x.sort());

// problem 1
a = lists[0].map((x, i) => Math.abs(x - lists[1][i])).reduce((s, x) => s + x);

// problem 2
counts = lists[1].reduce((r, x) => ({ ...r, [x]: (r[x] ?? 0) + 1 }), {});
b = lists[0].map(x => x * (counts[x] ?? 0)).reduce((s, x) => s + x);

[a, b];
