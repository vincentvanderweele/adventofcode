data = document
  .querySelector('pre')
  .firstChild.textContent.split('\n')
  .filter((x) => x)
  .map((x) => x.split('').map((y) => parseInt(y)));

getSafe = (x, y) => data[y]?.[x] ?? 9;

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
      neighbors.every(([dx, dy]) => getSafe(x + dx, y + dy) > height)
    )
  )
  .map((x) => x + 1)
  .reduce((s, e) => s + e, 0);

// problem 2
basinSize = (x, y) => {
  if (getSafe(x, y) === 9) return 0;
  data[y][x] = 9;
  return (
    1 + neighbors.reduce((s, [dx, dy]) => s + basinSize(x + dx, y + dy), 0)
  );
};

data
  .flatMap((row, y) => row.map((_, x) => basinSize(x, y)))
  .sort((x, y) => y - x)
  .slice(0, 3)
  .reduce((p, e) => p * e, 1);
