data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  .map(x => parseInt(x))
  .sort((a, b) => a-b)
  
data = [0, ...data, data[data.length-1]+3]
  
// problem 1
r = data
  .slice(1)
  .map((x, i) => x - data[i])
  .reduce((r, x) => { r[x % 3]++; return r }, [0, 0])
r[0]*r[1]

// problem 2
c = {}
function s(d, i, l) {
    if (i >= d.length || d[i] - l > 3) return 0
    if (i === d.length-1) return 1

    if (!c[i]) c[i] = {}
    return c[i][l]
      || (c[i][l] = s(d, i+1, l) + s(d, i+1, d[i]))
}
s(data, 1, 0)
