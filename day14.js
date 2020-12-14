data=document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)

// problem 1
mem=data.reduce(({ mem, mask }, line) => {
  if (line.startsWith('mask = ')) return { mem, mask: line.substring('mask = '.length) }
  m = line.match(/mem\[(\d+)\] = (\d+)/)
  x=parseInt(m[2])
  v=mask.split('')
  for (i=v.length-1; i>=0; i--) {
      if (v[i] === 'X') v[i] = x%2
      x = Math.floor(x / 2)
  }
  return { mask, mem: { ...mem, [m[1]]: parseInt(v.join(''), 2) }}
}, { mem: {} }).mem
Object.values(mem).reduce((r, e) => r+e, 0)

// problem 2
mem=data.reduce(({ mem, mask }, line) => {
  if (line.startsWith('mask = ')) return { mem, mask: line.substring('mask = '.length) }
  m = line.match(/mem\[(\d+)\] = (\d+)/)

  a=parseInt(m[1])
  v=mask.split('')
  addresses=[[]]
  for (i=v.length-1; i>=0; i--) {
    addresses = v[i] === 'X'
      ? [
        ...addresses.map(x => ['0', ...x]),
        ...addresses.map(x => ['1', ...x])
      ]
      : addresses.map(x => [v[i] === '1' ? '1' : `${a%2}`, ...x])
    a = Math.floor(a / 2)
  }

  for (i=0; i<addresses.length; i++) {
    mem[parseInt(addresses[i].join(''), 2)] = parseInt(m[2])
  }

  return { mask, mem }
}, { mem: {} }).mem
Object.values(mem).reduce((r, e) => r+e, 0)
