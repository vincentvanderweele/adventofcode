input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => parseInt(x.replace('R', '').replace('L', '-'), 10));

a = input.reduce(
  ({ c, z }, x) => {
    c = (c + (x % 100) + 100) % 100;
    if (c === 0) z++;
    return { c, z };
  },
  { c: 50, z: 0 }
).z;

b = input.reduce(
  ({ c, z }, x) => {
    n = c + x;
    if (n === 0) z++;
    else if (n < 0) {
      z += Math.floor(-n / 100);
      if (c > 0) z++;
    } else z += Math.floor(n / 100);
    c = ((n % 100) + 100) % 100;
    return { c, z };
  },
  { c: 50, z: 0 }
).z;

[a, b];
