connections = new Set(
  document
    .querySelector('pre')
    .firstChild.data.split('\n')
    .filter(x => x)
    .map(x => x.split('-'))
    .flatMap(([x, y]) => [`${x}-${y}`, `${y}-${x}`])
);

ts = [...connections].reduce((r, x) => {
  if (x[0] === 't') (r[x.slice(0, 2)] ??= []).push(x.slice(3));
  return r;
}, {});

cliques = new Set();

// Problem 1
for (let [k, vs] of Object.entries(ts)) {
  for (i = 0; i < vs.length; i++) {
    x = vs[i];
    for (j = i + 1; j < vs.length; j++) {
      y = vs[j];

      if (connections.has(`${x}-${y}`)) cliques.add([k, x, y].sort().join(','));
    }
  }
}

a = cliques.size;

// Problem 2
step = current => {
  next = new Set();
  for (clique of current) {
    vs = clique.split(',');

    for (x of ts[vs.find(v => v[0] === 't')]) {
      if (vs.includes(x)) continue;

      if (vs.every(y => connections.has(`${x}-${y}`)))
        next.add([...vs, x].sort().join(','));
    }
  }

  return next;
};

while (cliques.size > 1) {
  cliques = step(cliques);
}
b = [...cliques][0];

[a, b];
