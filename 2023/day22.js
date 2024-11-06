blocks = document
  .querySelector('pre')
  .textContent.split('\n')
  .filter(x => x)
  .map(x => x.split('~').map(x => x.split(',').map(x => parseInt(x))))
  .sort(([[, , z1]], [[, , z2]]) => z1 - z2);

overlap = ([[xs1, ys1], [xe1, ye1]], [[xs2, ys2], [xe2, ye2]]) =>
  !(xe1 < xs2 || xe2 < xs1) && !(ye1 < ys2 || ye2 < ys1);

// drop all blocks down
for (let i = 0; i < blocks.length; i++) {
  let z = 1;
  for (let j = 0; j < i; j++)
    if (overlap(blocks[i], blocks[j])) z = Math.max(z, blocks[j][1][2] + 1);

  blocks[i][1][2] = z + blocks[i][1][2] - blocks[i][0][2];
  blocks[i][0][2] = z;
}

// compute dependency graph
isSupported = {};
supports = {};
for (let i = 0; i < blocks.length; i++) {
  for (let j = 0; j < i; j++) {
    if (
      overlap(blocks[i], blocks[j]) &&
      blocks[i][0][2] === blocks[j][1][2] + 1
    ) {
      isSupported[i] = (isSupported[i] ?? 0) + 1;
      supports[j] = [...(supports[j] ?? []), i];
    }
  }
}

// problem 1
a = blocks.filter(
  (_, i) => !supports[i] || supports[i].every(j => isSupported[j] > 1)
).length;

// problem 2
b = blocks
  .map((_, i) => i)
  .filter(i => supports[i]?.some(j => isSupported[j] === 1))
  .map(x => {
    let result = 0;

    const queue = [...supports[x]];
    const removedCount = queue.reduce((r, i) => ({ ...r, [i]: 1 }), {});

    while (queue.length) {
      const i = queue.pop();

      if (removedCount[i] === isSupported[i]) {
        result++;
        for (let j of supports[i] ?? []) {
          removedCount[j] = (removedCount[j] ?? 0) + 1;
          queue.push(j);
        }
      }
    }

    return result;
  })
  .reduce((s, x) => s + x);

[a, b];
