data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  
// problem 1
deps = data.map(x => {
    [s, t] = x.split(' bags contain ')
    ts = t === 'no other bags.'
      ? []
      : t.split(',').map(y => y.match(/\d+ (.*) bag/)[1])
    return {s, ts}
})
s = new Set(['shiny gold'])
i = 0
while (i !== s.size) {
    i = s.size
    s = new Set([
      ...s,
      ...deps.filter(x => x.ts.some(t => s.has(t))).map(x => x.s)
    ])
}
i

// problem 2
deps = data.map(x => {
    [s, t] = x.split(' bags contain ')
    ts = t === 'no other bags.'
      ? [] :
      t.split(',').map(y => { 
        z = y.match(/(\d+) (.*) bag/)
        return { c: z[1], t: z[2] }
      })
    return {s, ts}
})
counts = {}
while (!counts['shiny gold']) {
    counts = deps.map(({ s, ts }) => 
      ts.length === 0
        ? {s, v: 1}
        : {s, v: 1 + ts.map(({ c, t }) => c * counts[t]).reduce((a, b) => a+b, 0)})
      .filter(x => !isNaN(x.v))
      .reduce((r, {s, v}) => ({ ...r, [s]: v }), counts)
}
counts['shiny gold']-1
