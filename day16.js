data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')

// problem 1
ranges = data[0]
  .split('\n')
  .flatMap(x =>
    x.match(/(\d+-\d+) or (\d+-\d+)/)
      .slice(1, 2)
      .map(y => y.split('-').map(z => parseInt(z))))
data[2]
  .split('\n')
  .slice(1)
  .filter(x => x)
  .flatMap(x => x.split(',').map(y => parseInt(y)))
  .filter(x => !ranges.some(([s, e]) => s <= x && x <= e))
  .reduce((r, x) => r+x, 0)

// problem 2
ranges = data[0]
  .split('\n')
  .map(x => { 
    m = x.match(/(.+): (\d+-\d+) or (\d+-\d+)/)
    return {
      k: m[1],
      r: m.slice(2, 4).map(y => y.split('-').map(z => parseInt(z)))
    }
  })

validTickets = tickets
  .filter(ticket => 
    ticket
      .map(t =>
        ranges
          .filter(r => (r.r[0][0] <= t && t <= r.r[0][1]) || (r.r[1][0] <= t && t <= r.r[1][1]))
          .map(x => x.k))
      .every(x => x.length))

options = validTickets[0].map(_ => new Set(ranges.map(x => x.k)))
for (i=0; i<validTickets.length; i++) {
    options = validTickets[i]
      .map(t =>
        ranges
          .filter(r => (r.r[0][0] <= t && t <= r.r[0][1]) || (r.r[1][0] <= t && t <= r.r[1][1]))
          .map(x => x.k))
      .map((x, j) => new Set(x.filter(y => options[j].has(y))))
}

do {
  counts = ranges
    .map(x => x.k)
    .map(k => ({ k, c: options.filter(x => x.has(k)).length }))
    
  counts.filter(x => x.c === 1).forEach(({ k }) => {
    index = options.findIndex(x => x.has(k))
    options[index] = new Set([k]);
  })
} while (counts.some(x => x.c > 1))

myTicket = data[1].split('\n')[1].split(',').map(x => parseInt(x))
options
  .map((x, i) => ({ i, x: [...x][0]}))
  .filter(x => x.x.startsWith('departure'))
  .map(x => myTicket[x.i])
  .reduce((r, e) => r*e, 1)
