input = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x)
  .map(x => x.split('\n').filter(x => x))
  .map((x, i) =>
    i
      ? x.map(x => parseInt(x, 10))
      : x.map(x => x.split('-').map(x => parseInt(x, 10)))
  );

merge = rs => {
  rs.sort((a, b) => a[0] - b[0]);
  res = [];
  for (i = 0; i < rs.length; i++) {
    c = [...rs[i]];
    while (rs[i + 1]?.[0] <= c[1]) c[1] = Math.max(rs[1 + i++][1], c[1]);
    res.push(c);
  }
  return res;
};

rs = merge(input[0]);

a = input[1].filter(i => rs.some(([s, e]) => s <= i && i <= e)).length;

b = rs.reduce((x, [s, e]) => x + e - s + 1, 0);

[a, b];
