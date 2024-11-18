input = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter(x => x)
  .map(x => x.split(': '))
  .flatMap(x => x[1].split(' ').map(y => [x[0], y]));

solve = () => {
  for (let i = 0; i < 1000; i++) {
    let edges = [...input];
    const vertices = [...new Set(edges.flat())];

    const maps = vertices.reduce((r, v) => ({ ...r, [v]: new Set([v]) }), {});
    let size = vertices.length;

    while (edges.length && size > 2) {
      const i = Math.floor(Math.random() * edges.length);
      const [start, end] = edges[i];
      const last = edges.pop();
      if (i < edges.length) edges[i] = last;

      const s = maps[start];
      const e = maps[end];
      if (e === s) continue;

      for (const v of e) {
        s.add(v);
        maps[v] = s;
      }

      size--;
    }

    edges = edges.filter(([start, end]) => maps[start] !== maps[end]);

    if (size === 2 && edges.length === 3)
      return [...new Set(Object.values(maps).map(x => x.size))].reduce(
        (s, x) => s * x
      );
  }
};

solve();
