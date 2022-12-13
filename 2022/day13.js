data = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .map(x =>
    x
      .split('\n')
      .filter(x => x)
      .map(x => eval(x))
  );

compare = (l, r) => {
  isArray = [l, r].map(x => Array.isArray(x));

  if (isArray.every(x => !x)) return l - r;
  if (isArray.some(x => !x))
    return compare(isArray[0] ? l : [l], isArray[1] ? r : [r]);

  for (i = 0; i < Math.min(l.length, r.length); i++) {
    res = compare(l[i], r[i]);
    if (res !== 0) return res;
  }
  return l.length - r.length;
};

// problem 1
data
  .map(([l, r]) => compare(l, r))
  .map((x, i) => [x, i])
  .filter(([x]) => x < 0)
  .map(([, i]) => i + 1)
  .reduce((s, x) => s + x);

// problem 2
indexOf = x =>
  data
    .flat()
    .map(y => compare(y, x))
    .filter(x => x < 0).length + 1;

indexOf([[2]]) * (indexOf([[6]]) + 1);
