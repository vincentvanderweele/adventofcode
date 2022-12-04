data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split(',').map(x => x.split('-').map(x => parseInt(x))))
  // Sort the segments for easier comparison
  .map(([x, y]) =>
    x[0] < y[0] || (x[0] === y[0] && x[1] >= y[1]) ? [x, y] : [y, x]
  );

// problem 1
data.filter(([[, xh], [, yh]]) => yh <= xh).length;

// problem 2
data.filter(([[, xh], [yl]]) => yl <= xh).length;
