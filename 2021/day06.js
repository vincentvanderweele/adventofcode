data = document
  .querySelector('pre')
  .firstChild.textContent.split(',')
  .map((x) => parseInt(x));

solve = (n) => {
  counts = data.reduce(
    (counts, x) => {
      counts[x]++;
      return counts;
    },
    [...Array(9)].map((_) => 0)
  );

  for (i = 0; i < n; i++) {
    x = counts.shift();
    counts[6] += x;
    counts[8] = x;
  }

  return counts.reduce((s, e) => s + e, 0);
};

// problem 1
solve(80);

// problem 1
solve(256);
