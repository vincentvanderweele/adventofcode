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

circuits = input.map((_, i) => new Set([i]));

ni = 0;

while (circuits[0].size < input.length) {
  last = neighbors[ni++];

  if (circuits[last.s] !== circuits[last.e]) {
    circuit = circuits[last.s].union(circuits[last.e]);
    for (x of circuit) circuits[x] = circuit;
  }

  if (ni === 1000) {
    a = [...new Set(circuits)]
      .map(x => x.size)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((p, x) => p * x);
  }
}

b = input[last.s][0] * input[last.e][0];

[a, b];
