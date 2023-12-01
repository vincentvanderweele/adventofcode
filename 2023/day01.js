data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x);

solve = digits =>
  data
    .map(line =>
      digits
        .map((digit, i) => [
          i % 10,
          line.indexOf(digit),
          line.lastIndexOf(digit),
        ])
        .reduce(
          ([iLow, vLow, iHigh, vHigh], [i, low, high]) => [
            ...(low >= 0 && low < vLow ? [i, low] : [iLow, vLow]),
            ...(high > vHigh ? [i, high] : [iHigh, vHigh]),
          ],
          [0, Number.POSITIVE_INFINITY, 0, -1]
        )
    )
    .map(([iLow, , iHigh]) => parseInt(`${iLow}${iHigh}`, 10))
    .reduce((s, x) => s + x);

digits = [...Array(10)].map((_, i) => `${i}`);
words = [
  '_',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

// problem 1
a = solve(digits);

// problem 2
b = solve([...digits, ...words]);

[a, b];
