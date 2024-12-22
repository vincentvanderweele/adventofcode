secrets = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => parseInt(x, 10));

ops = [x => x << 6, x => x >> 5, x => x << 11];
base = 16777216;

round = x => ops.reduce((r, f) => (((f(r) ^ r) % base) + base) % base, x);

solve = secret => {
  bananas = {};

  prev = 0;
  diffs = [];
  for (i = 0; i < 2000; i++) {
    secret = round(secret);

    curr = secret % 10;
    diffs = [...diffs.slice(-3), curr - prev];

    if (i >= 4) bananas[diffs.join(',')] ??= curr;

    prev = curr;
  }

  return { secret, bananas };
};

solutions = secrets.map(solve);

// Problem 1
a = solutions.map(x => x.secret).reduce((s, x) => s + x);

// Problem 2
b = Math.max(
  ...Object.values(
    solutions
      .map(x => x.bananas)
      .reduce((r, x) => {
        for (let [k, v] of Object.entries(x)) r[k] = v + (r[k] ?? 0);
        return r;
      })
  )
);

[a, b];
