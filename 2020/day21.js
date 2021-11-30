data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
	.filter(x => x)

// problem 1
food = data
  .map(x => ({ 
    i: x.split(' (')[0].split(' '),
    a: x.split(')')[0].split('contains ')[1].split(', ')
  }))
sets = food
  .reduce((r, x) => 
    x.a.reduce((s, a) => ({ 
      ...s,
      [a]: s[a]
        ? new Set(x.i.filter(y => s[a].has(y)))
        : new Set(x.i)
    }), r), {})
s = Object
  .values(sets)
  .reduce((r, x) => new Set([...r, ...x]), new Set())
food.flatMap(x => x.i.filter(y => !s.has(y))).length

// problem 2
while (Object.values(sets).some(s => s.size > 1)) {
    known = Object.values(sets).filter(s => s.size === 1).reduce((r, s) => new Set([...r, ...s]), new Set())
    Object.values(sets).filter(s => s.size > 1).forEach(s => known.forEach(k => s.delete(k)))
}
Object.entries(sets)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(x => [...x[1]][0]).join(',')
