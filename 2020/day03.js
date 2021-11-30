data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n')
  .filter(x => x)

// problem 1
n = data[0].length
data.filter((x, i) => x[(3*i)%n] === '#').length

// problem 2
function trees(data, x, y) {
	n = data[0].length
	return data
    .filter((_, i) => i % y === 0)
    .filter((z, i) => z[(x*i)%n] === '#').length
}
[[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].reduce((r, [x, y]) => r * trees(data, x, y), 1)
