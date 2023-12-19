[workflows, parts] = document
  .querySelector('pre')
  .firstChild.data.split('\n\n')
  .filter(x => x)
  .map((x, i) =>
    i
      ? x
          .replaceAll('=', ':')
          .split('\n')
          .filter(x => x)
          .map(x => eval(`(${x})`))
      : Object.fromEntries(
          x
            .split('\n')
            .filter(x => x)
            .map(x =>
              x
                .slice(0, -1)
                .split('{')
                .map((x, i) =>
                  i
                    ? x
                        .split(',')
                        .map(z =>
                          z.includes(':')
                            ? {
                                to: z.split(':')[1],
                                p: z.split(':')[0][0],
                                op: z.split(':')[0][1],
                                v: parseInt(z.split(':')[0].slice(2), 10),
                              }
                            : { to: z, p: 'x', op: '<', v: 9999 }
                        )
                    : x
                )
            )
        )
  );

// problem 1
a = parts
  .filter(part => {
    current = 'in';
    while (current !== 'A' && current !== 'R') {
      for (step of workflows[current]) {
        if (step.op === '<' ? part[step.p] < step.v : part[step.p] > step.v) {
          current = step.to;
          break;
        }
      }
    }
    return current === 'A';
  })
  .reduce((r, { x, m, a, s }) => r + x + m + a + s, 0);

// problem 2
queue = [
  {
    from: 'in',
    parts: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] },
  },
];
results = [];

while (queue.length) {
  let { from, parts } = queue.pop();

  if (from === 'R') continue;
  if (from === 'A') {
    results.push(parts);
    continue;
  }

  for (let { p, op, v, to } of workflows[from]) {
    if (op === '<') {
      // no match
      if (parts[p][0] >= v) continue;

      // full match
      if (parts[p][1] < v) {
        queue.push({ from: to, parts });
        continue;
      }

      // partial match
      queue.push({ from: to, parts: { ...parts, [p]: [parts[p][0], v - 1] } });
      parts[p] = [v, parts[p][1]];
    } else {
      // no match
      if (parts[p][1] <= v) continue;

      // full match
      if (parts[p][0] > v) {
        queue.push({ from: to, parts });
        continue;
      }

      // partial match
      queue.push({ from: to, parts: { ...parts, [p]: [v + 1, parts[p][1]] } });
      parts[p] = [parts[p][0], v];
    }
  }
}

b = results.reduce(
  (r, { x, m, a, s }) =>
    r + [x, m, a, s].map(x => x[1] - x[0] + 1).reduce((p, x) => p * x),
  0
);

[a, b];
