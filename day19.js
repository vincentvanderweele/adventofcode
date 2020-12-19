const data=document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')
const rulesData=data[0].split('\n').filter(x => x)
const linesData=data[1].split('\n').filter(x => x)

const rules = rulesData
  .map(x => x.split(': '))
  .map(([k, v]) => [
    k, 
    v.startsWith('"')
      ? { s: v.slice(1, 2) }
      : { r: v.split(' | ').map(x => x.split(' ')) }
  ])
  .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

function reduceRules(rules, specialRules = () => undefined) {
  while(!rules[0].s) {
    rules = Object.entries(rules).reduce((newRules, [k, v]) => ({
        ...newRules,
        [k]: v.s || v.r.some(x => x.some(y => !rules[y].s))
          ? v
          : specialRules(rules, k)
            || { s: '(' + v.r.map(x => `(${x.map(y => rules[y].s).join('')})`).join('|') + ')' }
    }), {})
  }
  return new RegExp(`^${rules[0].s}$`)
}

// problem 1
r = reduceRules(rules)
linesData.filter(l => r.test(l)).length

// problem 2
// no clue how to derive [1, 2, 3, 4], this was just trial and error (there are no matches for 5)
rs = [1, 2, 3, 4].map(i => reduceRules(rules, (rules, k) => ({
	8: {s: `(${rules[42].s}+)`},
	11: {s: `(${rules[42].s}{${i}}${rules[31].s}{${i}})`},
}[k])))
linesData.filter(l => rs.some(r => r.test(l))).length
