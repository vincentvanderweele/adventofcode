reports = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(' ').map(x => parseInt(x, 10)));

valid = r => {
  if (r[0] === r[1]) return false;
  sign = Math.sign(r[1] - r[0]);

  for (let i = 1; i < r.length; i++) {
    if (sign * (r[i] - r[i - 1]) < 1 || sign * (r[i] - r[i - 1]) > 3)
      return false;
  }
  return true;
};

// problem 1
a = reports.filter(valid).length;

// problem 2
b = reports.filter(r => {
  if (valid(r)) return true;

  for (let i = 0; i < r.length; i++) {
    rx = [...r.slice(0, i), ...r.slice(i + 1)];
    if (valid(rx)) return true;
  }
  return false;
}).length;

[a, b];
