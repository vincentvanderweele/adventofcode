data = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .map(x =>
    x
      .split('\n')
      .filter(x => x)
      .map(x => parseInt(x))
  );

sums = data.map(x => x.reduce((s, e) => s + e)).sort((a, b) => b - a);

// problem 1
sums[0];

// problem 2
sums.slice(0, 3).reduce((s, e) => s + e);
