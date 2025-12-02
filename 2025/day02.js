input = document
  .querySelector('pre')
  .firstChild.data.split('\n')[0]
  .split(',')
  .map(x => x.split('-').map(x => parseInt(x, 10)));

isInvalid = n => {
  s = `${n}`;

  for (j = 2; j <= s.length; j++) {
    if (s.length % j > 0) continue;

    if (s === s.slice(0, s.length / j).repeat(j)) return j;
  }

  return 0;
};

solve = check =>
  input
    .flatMap(([s, e]) => {
      r = [];
      for (i = s; i <= e; i++) {
        if (check(isInvalid(i))) r.push(i);
      }
      return r;
    })
    .reduce((s, x) => s + x);

a = solve(x => x === 2);

b = solve(x => x > 0);

[a, b];
