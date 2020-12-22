data = document
  .querySelector('pre')
  .firstChild
  .data
  .split('\n\n')
	.filter(x => x)

// problem 1
cards = data.map(x => x.split('\n').filter(y => y).slice(1).map(y => parseInt(y)))
while(cards.every(x => x.length)) {
	c = cards.map(x => x.shift())
  w = c[0] > c[1] ? 0 : 1
  cards[w].push(c[w], c[1-w])
}
cards.flatMap(x => x).reverse().reduce((r, x, i) => r + x * (i+1), 0)

// problem 2
function game(cards) {
	let seen = new Set()
	while(cards.every(x => x.length)) {
		hash = cards.map(x => x.join(',')).join('|')
		if (seen.has(hash)) return [[1], []]
		seen.add(hash)

    let c = cards.map(x => x.shift())
    let w = c.every((x, i) => x <= cards[i].length)
      ? game(cards.map((x, i) => x.slice(0, c[i]))).findIndex(x => x.length)
      : c[0] > c[1] ? 0 : 1
    cards[w].push(c[w], c[1-w])
	}
	return cards
}

cards = data.map(x => x.split('\n').filter(y => y).slice(1).map(y => parseInt(y)))
game(cards)
cards.flatMap(x => x).reverse().reduce((r, x, i) => r + x * (i+1), 0)
