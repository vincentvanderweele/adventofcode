data = document
  .querySelector('pre')
  .firstChild.data.split('\n')
  .filter(x => x)
  .map(x =>
    x
      .slice('Sensor at '.length)
      .split(': closest beacon is at ')
      .map(x => x.split(', ').map(x => parseInt(x.slice(2))))
  );

getRanges = row =>
  data
    .map(([[xs, ys], [xb, yb]]) => {
      radius = Math.abs(xs - xb) + Math.abs(ys - yb) - Math.abs(row - ys);

      if (radius < 0) return;

      return [xs - radius, xs + radius + 1];
    })
    .filter(x => x)
    // convert to list of events; type is start (1) or end (-1) of segment
    .flatMap(([s, e]) => [
      { position: s, type: 1 },
      { position: e, type: -1 },
    ])
    // a.type - b.type is in [-2, 0, 2], so *3 to get lexicographic sort
    .sort((a, b) => 3 * (a.position - b.position) + a.type - b.type)
    .reduce(
      ({ result, stack }, { position, type }) => {
        // if stack is 0, this event starts a new segment
        if (stack === 0) result.push([position]);
        stack += type;
        // if stack is 0, this event ends the last segment
        if (stack === 0) result[result.length - 1].push(position);
        return { result, stack };
      },
      { result: [], stack: 0 }
    ).result;

// problem 1
row = 2000000;
getRanges(row)
  .map(([s, e]) => e - s)
  .reduce((s, x) => s + x) -
  // beacons don't count as cover, so subtract
  new Set(data.filter(([, [, yb]]) => yb === row).map(([, [xb]]) => xb)).size;

// problem 2
(() => {
  for (i = 0; i <= 4000000; i++) {
    r = getRanges(i);
    if (r.length === 2) return i + 4000000 * r[0][1];
  }
})();
