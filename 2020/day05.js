data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)
  .map(x => x.replace(/F|L/g, 0).replace(/B|R/g, 1))
  .map(x => parseInt(x, 2))
  .sort((a, b) => a-b)

// problem 1
data[data.length-1]

// problem 2
data.filter((x, i) => x !== i+data[0])[0] - 1
