input = new Set(
  document
    .querySelector('pre')
    .firstChild.data.split('\n')
    .filter(x => x)
    .flatMap((r, j) =>
      r
        .split('')
        .map((v, i) => [`${i},${j}`, v])
        .filter(([, v]) => v === '@')
    )
    .map(([x]) => x)
);

neighbors = xy => {
  let [x, y] = xy.split(',').map(x => parseInt(x, 10));
  return [-1, 0, 1].flatMap(i => [-1, 0, 1].map(j => `${x + i},${y + j}`));
};

step = s =>
  new Set(
    [...s].filter(xy => neighbors(xy).filter(xy => s.has(xy)).length <= 4)
  );

a = step(input).size;

current = input;
do {
  toRemove = step(current);
  current = current.difference(toRemove);
} while (toRemove.size);

b = input.size - current.size;

[a, b];
