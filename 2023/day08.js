data = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x);

directions = data[0].split('').map(x => (x === 'L' ? 0 : 1));
steps = data[1]
  .split('\n')
  .filter(x => x)
  .reduce(
    (r, l) => ({ ...r, [l.slice(0, 3)]: [l.slice(7, 10), l.slice(12, 15)] }),
    {}
  );

// problem 1
a = 0;
x = 'AAA';
while (x !== 'ZZZ') x = steps[x][directions[a++ % directions.length]];

// problem 2
// Observation: same answer repeats at regular intervals already after first occurence
intervals = Object.keys(steps)
  .filter(x => x[2] === 'A')
  .map(x => {
    i = 0;
    while (x[2] !== 'Z') x = steps[x][directions[i++ % directions.length]];
    return i;
  });

gcm = (x, y) => {
  if (x < y) return gcm(y, x);
  if (y === 0) return x;
  return gcm(y, x % y);
};

b = intervals.reduce((p, i) => (p * i) / gcm(p, i));

[a, b];
