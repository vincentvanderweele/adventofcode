input = document
  .querySelector('pre')
  .firstChild.textContent.split('\n\n')
  .map((x) =>
    x
      .split('\n')
      .filter((x) => x)
      .slice(1)
      .map((x) => x.split(',').map((x) => parseInt(x)))
  );

add = (v1, v2) => v1.map((x, i) => x + v2[i]);
diff = (v1, v2) => v1.map((x, i) => x - v2[i]);

signs = ([x, y, z]) => [
  [x, y, z],
  [x, -y, -z],
  [-x, y, -z],
  [-x, -y, z],
];
rotations = ([x, y, z]) => [
  [x, y, z],
  [z, x, y],
  [y, z, x],
];
reversions = ([x, y, z]) => [
  [x, y, z],
  [-z, y, x],
];
transforms = (v) => reversions(v).flatMap(rotations).flatMap(signs);

transpose = (b) =>
  b.reduce((r, x) => x.map((y, i) => [...(r[i] || []), y]), []);

count = (a) =>
  a.reduce((c, x) => {
    c[x] = (c[x] ?? 0) + 1;
    return c;
  }, {});

getOffset = (s1, s2) => {
  allDiffs = s1.flatMap((x) => s2.map((y) => diff(x, y)));
  counts = count(allDiffs.map((v) => v.join(',')));
  return Object.entries(counts)
    .filter(([offset, count]) => count >= 12)
    .map(([offset]) => offset.split(',').map((x) => parseInt(x)))[0];
};

translate = (vs, offset) => vs.map((v) => add(v, offset));

// Compute all transforms of all scanners other than the first
// so we can completely forget about transformations after that
transformedScanners = input.slice(1).map((b) => transpose(b.map(transforms)));

beakons = [...Array(input.length - 1)].map((_) => undefined);
offsets = [...Array(input.length - 1)].map((_) => undefined);
scanners = [input[0]];
emergencyBreak = 0;
while (beakons.some((x) => !x) && ++emergencyBreak < 10) {
  nextScanners = [];
  for (base of scanners) {
    transformedScanners.forEach((toCheck, i) => {
      if (beakons[i]) return;
      for (scanner of toCheck) {
        offset = getOffset(base, scanner);
        if (offset) {
          offsets[i] = offset;
          translated = translate(scanner, offset);
          beakons[i] = translated;
          nextScanners.push(translated);
          return;
        }
      }
    });
  }
  scanners = nextScanners;
}

// problem 1
new Set([...input[0], ...beakons.flatMap((x) => x)].map((v) => v.join(',')))
  .size;

// problem 2
Math.max(
  ...offsets
    .flatMap((x) => offsets.map((y) => diff(x, y)))
    .map((v) => v.reduce((s, e) => s + Math.abs(e), 0))
);
