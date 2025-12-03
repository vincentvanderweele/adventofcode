input = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => x.split('').map(x => parseInt(x, 10)));

solve = n => input
  .map(a =>
    a.slice(n).reduce((m, x) => {
      m.push(x);
      for (i = 0; i < n; i++) {
        if (m[i + 1] > m[i]) {
          m.splice(i, 1);
          break;
        }
      }
      return m.slice(0, n);
    }, a.slice(0, n))
  )
  .reduce((s, x) => s + x.reduce((r, x) => 10 * r + x), 0);

[solve(2), solve(12)]; 
