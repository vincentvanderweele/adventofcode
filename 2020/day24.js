data=document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)

dirs = {
  e: [1, 0],
  w: [-1, 0],
  ne: [0, 1],
  nw: [-1, 1],
  se: [1, -1],
  sw: [0, -1]
}

// problem 1
steps = data
  .map(x => x.split(''))
  .map(x => 
    x.map((y, i) => 
      ['e', 'w'].includes(y)
        && (i === 0 || ['e', 'w'].includes(x[i-1]) ? y : `${x[i-1]}${y}`))
      .filter(y => y)
      .map(y => dirs[y]))
tiles = steps.map(x => x.reduce(([a, b], [c, d]) => [a+c, b+d], [0, 0]))
black = new Set(
  Object.entries(tiles.map(x => x.join(',')).reduce((c, x) => { c[x] = (c[x] || 0) + 1; return c }, {}))
    .filter(([_, v]) => v % 2 === 1)
    .map(([k]) => k))
black.size

// problem 2
for (i = 0; i < 100; i++) {
  counts = [...black]
    .flatMap(x => Object.values(dirs).map(d => `${d[0] + parseInt(x.split(',')[0])},${d[1] + parseInt(x.split(',')[1])}`))
    .reduce((r, x) => { r[x] = (r[x] || 0) + 1; return r }, {})

  black = new Set(
    Object
      .entries(counts)
      .filter(([k, v]) => v === 2 || (v === 1 && black.has(k)))
      .map(([k]) => k))
}
black.size
