commands = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' '))
  .map(([command, value]) => [command, parseInt(value)]);

values = commands.reduce(
  (r, [command, value]) => {
    last = r[r.length - 1];
    r.push(last);
    if (command === 'addx') r.push(last + value);
    return r;
  },
  [1]
);

// problem 1
[...Array(6)]
  .map((_, i) => 20 + i * 40)
  .map(x => x * values[x - 1])
  .reduce((s, e) => s + e);

// problem 2
values
  .map((x, i) => (Math.abs(x - (i % 40)) <= 1 ? '#' : '.'))
  .reduce((r, x, i) => {
    if (i % 40 === 0) r.push([]);
    r[r.length - 1].push(x);
    return r;
  }, [])
  .map(x => x.join(''))
  .join('\n');
