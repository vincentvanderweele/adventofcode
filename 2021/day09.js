data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => x.split('').map((y) => parseInt(y)));

withSentinels = [
  [...Array(data[0].length + 2)].map((_) => 9),
  ...data.map((x) => [9, ...x, 9]),
  [...Array(data[0].length + 2)].map((_) => 9),
];

neighbors = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

// problem 1
data
  .flatMap((row, y) =>
    row.filter((height, x) =>
      neighbors.every(([dx, dy]) => sentinels[y + 1 + dy][x + 1 + dx] > height)
    )
  )
  .map((x) => x + 1)
  .reduce((s, e) => s + e, 0);

// problem 2
basinSize = (x, y) => {
  if (withSentinels[y][x] === 9) return 0;
  withSentinels[y][x] = 9;
  return (
    1 + neighbors.reduce((s, [dx, dy]) => s + basinSize(x + dx, y + dy), 0)
  );
};

withSentinels
  .flatMap((row, y) => row.map((_, x) => basinSize(x, y)))
  .sort((x, y) => y - x)
  .slice(0, 3)
  .reduce((p, e) => p * e, 1);
