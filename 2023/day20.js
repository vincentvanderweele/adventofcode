data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

// problem 1
lines = data
  .map(x => x.split(' -> '))
  .map(([x, y]) => ({
    type: x.startsWith('%')
      ? 'flipflop'
      : x.startsWith('&')
      ? 'conjunction'
      : 'broadcaster',
    name: x.slice(1),
    to: y.split(', '),
  }));

broadcaster = lines.find(x => x.type === 'broadcaster');
modules = Object.fromEntries(
  lines
    .filter(x => x.type !== 'broadcaster')
    .map(x => [
      x.name,
      x.type === 'flipflop' ? { ...x, value: 0 } : { ...x, incoming: {} },
    ])
);

for (module of lines) {
  for (to of module.to) {
    const target = modules[to];
    if (target?.type === 'conjunction') target.incoming[module.name] = 0;
  }
}

cycle = () => {
  const queue = [broadcaster];
  const counts = [1, 0]; // account for initial button press
  while (queue.length) {
    const current = queue.shift();

    switch (current.type) {
      case 'broadcaster':
        pulse = 0;
        break;
      case 'flipflop':
        pulse = current.value;
        break;
      case 'conjunction':
        pulse = Object.values(current.incoming).every(x => x) ? 0 : 1;
        break;
    }

    for (to of current.to) {
      counts[pulse]++;

      const target = modules[to];
      switch (target?.type) {
        case 'flipflop':
          if (!pulse) {
            target.value = 1 - target.value;
            queue.push(target);
          }
          break;
        case 'conjunction':
          target.incoming[current.name] = pulse;
          queue.push(target);
          break;
      }
    }
  }
  return counts;
};

result = [0, 0];
for (let i = 0; i < 1000; i++) {
  const counts = cycle();
  result[0] += counts[0];
  result[1] += counts[1];
}
a = result[0] * result[1];

// problem 2
starts = data
  .find(x => x.startsWith('broadcaster'))
  .split(' -> ')[1]
  .split(', ');

flipflops = Object.fromEntries(
  data
    .filter(x => x.startsWith('%'))
    .map(x => x.slice(1).split(' -> '))
    .map(([from, tos]) => [from, tos.split(', ')])
);

b = starts
  .map(x => {
    line = [];
    while (x) {
      line.push(x);
      x = flipflops[x].find(y => flipflops[y]);
    }
    return line;
  })
  .map(line =>
    line
      .map((x, i) =>
        flipflops[x].some(y => !flipflops[y]) ? Math.pow(2, i) : 0
      )
      .reduce((s, x) => s + x)
  )
  .reduce((p, x) => p * x);

[a, b];
