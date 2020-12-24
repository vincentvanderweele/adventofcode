data=document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')
  .filter(x => x)

inputBlocks = data
  .map(x => {
    [h, ...d] = x.split('\n')
    return { h: parseInt(h.substring(5, 9)), d: d.map(y => y.split('')) }
  })
  
monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
  .split('\n')
  .map(x => x.split('').map((c, x) => ({ c, x })))
  .flatMap((r, y) => r.map(({c, x }) => ({ c, x, y })))
  .filter(({ c }) => c === '#')
  .map(({x, y}) => ({ x, y}))

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

edgeCount = allBlocks
  .reduce((c, { t, b, l, r }) => {
    [t, b, l, r].forEach(x => { c[x] = (c[x] || 0) + 1 })
    return c
  }, {})
edges = new Set(
  Object
    .entries(edgeCount)
    .filter(([k, v]) => v === 4)
    .map(([k]) => k))

corners = allBlocks
  .filter(({ t, l }) => edges.has(t) && edges.has(l))
  .filter((_, i) => i % 2)

// problem 1
corners.reduce((p, { h }) => p * h, 1)

// problem 2
previous = corners[0]

row = [previous]
for (i = 1; i < 12; i++) {
  previous = allBlocks.filter(({ h, l, t }) => edges.has(t) && l === previous.r && h !== previous.h)[0]
  row.push(previous)
}

rows = [row]
previousRow = row
for (j = 1; j < 12; j++) {
  previous = allBlocks.filter(({ h, l, t }) => edges.has(l) && t === previousRow[0].b && h !== previousRow[0].h)[0]
  row = [previous]

  for (i = 1; i < 12; i++) {
    previous = allBlocks.filter(({ h, l, t }) => t === previousRow[i].b && l === previous.r && h !== previous.h)[0]
    row.push(previous)
  }

  previousRow = row
  rows.push(row)
}

puzzle = rows
  .map(x => x.map(({ d }) => d.slice(1, d.length - 1).map(y => y.slice(1, y.length - 1))))
  .flatMap(x => x.reduce((r, y) => r.map((z, i) => [...z, ...y[i]])))

monsters = getAllOrientations(puzzle)
  .map(p => {
    count = 0
    for (y = 0; y < puzzle.length - 3; y++) {
      for (x = 0; x < puzzle[0].length - 20; x++) {
        if (monster.every(m => puzzle[y + m.y][x + m.x] === '#')) {
          count++
        }
      }
    }
    return count
  })
  .filter(x => x)[0]

puzzle.flatMap(x => x).filter(x => x === '#').length - monsters * monster.length
