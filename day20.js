data=document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')
  .filter(x => x)

inputBlocks = data.map(x => ({ h: parseInt(x.substring(5, 9)), d: x.split('\n').slice(1).map(y => y.split('')) }))

monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
  .split('\n')
  .flatMap((r, y) => r.split('').map((c, x) => ({ c, x, y })))
  .filter(({ c }) => c === '#')
  .map(({ x, y }) => ({ x, y }))

transpose = b => b.reduce((r, x) => x.map((y, i) => [...(r[i] || []), y]), [])
mirror = b => b.map(x => [...x].reverse())
getAllOrientations = b => [...Array(4)].flatMap(_ => [transpose, mirror]).reduce((r, f) => [f(r[0] || b), ...r], []);

allBlocks = inputBlocks
  .flatMap(({ h, d }) => getAllOrientations(d).map(d => ({ h, d })))
  .map(({ h, d }) => ({ h, d,
    t: d[0].join(''),
    b: d[d.length-1].join(''),
    l: d.map(x => x[0]).join(''),
    r: d.map(x => x[d.length-1]).join(''),
  }))

allBlocks = inputBlocks.flatMap(({ h, d }) => getAllOrientations(d).map(d => ({
  h,
  d,
  t: d[0].join(''),
  b: d[d.length-1].join(''),
  l: d.map(x => x[0]).join(''),
  r: d.map(x => x[d.length-1]).join(''),
})))

edgeCount = allBlocks
  .flatMap(({ t, b, l, r }) => [t, b, l, r])
  .reduce((c, x) => ({ ...c, [x]: (c[x] || 0) + 1 }), {})
edges = new Set(
  Object
    .entries(edgeCount)
    .filter(([k, v]) => v === 4)
    .map(([k]) => k))

corners = allBlocks.filter(({ t, l }) => edges.has(t) && edges.has(l) && t < l)

// problem 1
corners.reduce((p, { h }) => p * h, 1)

// problem 2
topEdges = edges
topLeft = { b: corners[0].t }
rows = []
for (i = 0; i < 12; i++) {
  previous = allBlocks.find(({ h, l, t }) => edges.has(l) && t === topLeft.b && h !== topLeft.h)
  topLeft = previous
  row = [previous]

  for (j = 1; j < 12; j++) {
    previous = allBlocks.find(({ h, l, t }) => topEdges.has(t) && l === previous.r && h !== previous.h)
    row.push(previous)
  }

  topEdges = new Set(row.map(({ b }) => b))
  rows.push(row)
}

puzzle = rows
  .map(x => x.map(({ d }) => d.slice(1, d.length - 1).map(y => y.slice(1, y.length - 1))))
  .flatMap(x => x.reduce((r, y) => r.map((z, i) => [...z, ...y[i]])))

monsters = getAllOrientations(puzzle)
  .map(p =>
    p.flatMap((r, x) => r.map((_, y) => ({ x, y }))
      .map(({ x, y }) => monster.every(m => p[y + m.y] && p[y + m.y][x + m.x] === '#')))
      .filter(x => x).length)
  .find(x => x)

puzzle.flatMap(x => x).filter(x => x === '#').length - monsters * monster.length
