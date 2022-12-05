[cratesData, stepsData] = document
  .querySelector('pre')
  .firstChild.data.split('\n\n');

stacks = cratesData
  .split('\n')
  // remove crate numbers
  .slice(0, -1)
  // parse letters from boxes
  .map(x => [...Array(9)].map((_, i) => x.slice(4 * i + 1, 4 * i + 2)))
  // transpose and reverse
  .reduce((r, x) => x.map((y, i) => [y, ...(r[i] || [])]), [])
  // remove missing boxes
  .map(x => x.filter(x => x !== ' '));

steps = stepsData
  .split('\n')
  .filter(x => x)
  .map(x =>
    x
      .split(' ')
      .filter((_, i) => i % 2 === 1)
      .map(x => parseInt(x))
  )
  .map(([move, from, to]) => ({ move, from, to }));

solve = f =>
  f(stacks.map(x => [...x]))
    .map(x => x.pop())
    .join('');

// problem 1
solve(stacks => {
  for (let { move, from, to } of steps) {
    for (let i = 0; i < move; i++) {
      stacks[to - 1].push(stacks[from - 1].pop());
    }
  }
  return stacks;
});

// problem 2
solve(stacks => {
  for (let { move, from, to } of steps) {
    stacks[to - 1].push(...stacks[from - 1].splice(-move));
  }
  return stacks;
});
