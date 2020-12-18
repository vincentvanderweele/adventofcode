data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')

// problem 1
function solve(s) {
  let l=[0], o=['+']
  for(i = 0; i < s.length; i++) {
    let c=s.charAt(i)
		if (c === '+' || c === '*') o[0]=c
    else if (c === '(') { l.unshift(0); o.unshift('+') }
    else if (c !== ' ') {
      r = c === ')' ? o.shift(), l.shift() : parseInt(c)
      l[0] = o[0] === '+' ? l[0] + r : l[0] * r
    }
  }
  return l[0]
}
data.reduce((s, l) => s + solve(l), 0)

// problem 2
function reduce(n, o) {
	[l, r=0] = n
	return o[0] === '*' ? l * r : l + r
}

function solve2(s) {
  let l=[[0]], o=[['+']]
  for(i = 0; i < s.length; i++) {
    let c=s.charAt(i)
		if (c === '+' || c === '*') o[0].push(c)
    else if (c === '(') { l.unshift([0]); o.unshift(['+']) }
    else if (c !== ' ') {
      r = c === ')' ? reduce(l.shift(), o.shift()) : parseInt(c)

      let [l1, l2] = l[0]
      let [o1, o2] = o[0]

      if (l2 === undefined) {
        if (o1 === '+') { l[0] = [l1 + r]; o[0] = [] }
        else l[0].push(r)
      } else {
        l[0] = o2 === '+' ? [l1, l2 + r] : [l1 * l2, r]
        o[0] = ['*']
      }
    }
  }
  return reduce(l[0], o[0])
}
data.reduce((s, l) => s + solve2(l), 0)
