data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

// add sentinels
data = [
  [...Array(data[0].length + 2)].map(() => '.').join(''),
  ...data.map(x => `.${x}.`),
  [...Array(data[0].length + 2)].map(() => '.').join(''),
];

numbers = [...Array(10)].map((_, i) => i).join('');
numbersAndDot = [...numbers, '.'];

numbersAndPositions = data.flatMap(
  (line, y) =>
    line.split('').reduce(
      ({ current, result }, c, x) =>
        numbers.includes(c)
          ? { current: (current ?? '') + c, result }
          : {
              result: current
                ? [
                    ...result,
                    { n: parseInt(current, 10), x: x - current.length, y },
                  ]
                : result,
            },
      { result: [] }
    ).result
);

numbersAndSymbols = numbersAndPositions.map(({ n, x, y }) =>
  [...Array(`${n}`.length + 2)]
    .flatMap((_, i) =>
      [...Array(3)].map((_, j) => ({ i: i + x - 1, j: j + y - 1 }))
    )
    .map(({ i, j }) => ({ n, i, j, c: data[j].charAt(i) }))
    .find(({ c }) => !numbersAndDot.includes(c))
);

// problem 1
a = numbersAndSymbols.filter(x => x).reduce((s, x) => s + x.n, 0);

// problem 2
b = Object.values(
  numbersAndSymbols
    .filter(x => x?.c === '*')
    .reduce(
      (r, { n, i, j }) => ({
        ...r,
        [`${i},${j}`]: [...(r[`${i},${j}`] ?? []), n],
      }),
      {}
    )
)
  .filter(x => x.length === 2)
  .map(([i0, i1]) => i0 * i1)
  .reduce((s, x) => s + x);

[a, b];
