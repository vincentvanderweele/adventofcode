data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .map((x) => parseInt(x))
  .filter((x) => !isNaN(x));

// problem 1
data.filter((x, i, a) => i > 0 && x > a[i - 1]).length;

// problem 2
data
  .map((x, i, a) => (i < 2 ? NaN : x + a[i - 1] + a[i - 2]))
  .filter((x, i, a) => i > 0 && x > a[i - 1]).length;
