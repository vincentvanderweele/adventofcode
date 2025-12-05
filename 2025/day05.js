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

ranges = input[0]
  // create list of events
  .flatMap(([s, e]) => [
    { x: s, v: 1 },
    { x: e + 1, v: -1 }, // switch to open-ended ranges for convenience
  ])
  .sort((a, b) => a.x - b.x)
  .reduce(
    ({ ranges, current }, { x, v }) => {
      // when there are no currently active ranges, any event is a start
      if (current === 0) ranges.push({ s: x });
      current += v;
      // when all ranges are closed, the current event is an end
      if (current === 0) ranges[ranges.length - 1].e = x;
      return { ranges, current };
    },
    { ranges: [], current: 0 }
  ).ranges;

a = input[1].filter(i => ranges.some(({ s, e }) => s <= i && i < e)).length;

b = ranges.reduce((x, { s, e }) => x + e - s, 0);

[a, b];
