secrets = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x => parseInt(x, 10));

a = 0;
b = 0;
counts = {};

base = 16777216;

for (let s of secrets) {
  const seen = new Set();
  let prev = 0;
  let key = 0;

  for (let i = 0; i < 2000; i++) {
    s = [x => x << 6, x => x >> 5, x => x << 11].reduce(
      (r, f) => (((f(r) ^ r) % base) + base) % base,
      s
    );

    const curr = s % 10;

    key = ((key << 5) & 0xfffff) | (9 + curr - prev);
    prev = curr;

    if (i >= 4 && !seen.has(key)) {
      seen.add(key);
      b = Math.max(b, (counts[key] = (counts[key] ?? 0) + curr));
    }
  }

  a += s;
}

[a, b];
