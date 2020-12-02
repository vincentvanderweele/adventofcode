data = document.querySelector('pre').firstChild.data.split('\n').map(x => parseInt(x)).filter(x => !isNaN(x)).sort()

// problem 1
i = 0; j = data.length - 1
while (data[i] + data[j] !== 2020) {
  if (data[i] + data[j] > 2020) { j--; } else { i++; }
}
console.log(data[i] * data[j]);

// problem2
pairs = data.flatMap(x => data.map(y => ({ x, y, sum: x + y }))).sort((a, b) => a.sum - b.sum)
i = 0; j = data.length - 1
while (pairs[i].sum + data[j] !== 2020) {
	if (pairs[i].sum + data[j] > 2020) { j--; } else { i++; }
}
console.log(pairs[i].x * pairs[i].y * data[j])
