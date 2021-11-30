data = '327465189'.split('').map(x => parseInt(x) - 1)

function solve(next, head, rounds) {
  for (i = 0; i < rounds; i++) {
    cut = [next[head], next[next[head]], next[next[next[head]]]]

    insert = head
    do {
      insert = (insert - 1 + next.length) % next.length
    } while (cut.includes(insert))

    next[head] = next[cut[2]]
    next[cut[2]] = next[insert]
    next[insert] = cut[0]

    head = next[head]
  }
}

// problem 1
next = data.map((_, i) => data[(data.findIndex(x => x === i) + 1) % data.length])

solve(next, data[0], 100)

answer = []
p = 0
for (i = 0; i < data.length - 1; i++) {
  p = next[p]
  answer.push(p + 1)
}
answer.join('')

// problem 2
next = data
  .map((_, i) => {
    j = data.findIndex(x => x === i)
    return j === data.length - 1 ? data.length : data[j + 1]
  })
  .concat([...Array(1000000 - data.length - 1)].map((_, i) => i + 1 + data.length))
  .concat([data[0]])

solve(next, data[0], 10000000)
(next[0] + 1) * (next[next[0]] + 1)
