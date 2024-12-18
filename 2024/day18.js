input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

solve = n => {
  const blocked = new Set(input.slice(0, n));

  const end = '70,70';

  neighbors = v => {
    const [x, y] = v.split(',').map(x => parseInt(x, 10));

    return [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(xs => xs.every(x => x >= 0 && x <= 70))
      .map(([x, y]) => `${x},${y}`)
      .filter(v => !blocked.has(v));
  };

  for (current = ['0,0'], d = 0; current.length && !blocked.has(end); d++) {
    let next = new Set(current.flatMap(neighbors));

    for (const v of next) blocked.add(v);

    current = [...next];
  }

  return blocked.has(end) ? d : 0;
};

// Problem 1
a = solve(1024);

// Problem 2
i = [1024, input.length - 1];
while (i[0] + 1 < i[1]) {
  m = (i[0] + i[1]) >> 1;
  i[1 - Math.sign(solve(m))] = m;
}
b = input[i[0]];

[a, b];
